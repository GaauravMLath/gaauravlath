import { useEffect, useRef, useState } from 'react';
import { NetworkLoader } from './NetworkLoader';
import { NodeDetailsModal, type NodeDetails } from './NodeDetailsModal';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  liftY: number;
  radius: number;
  isDragging?: boolean;
  isNavNode?: boolean;
  isLabel?: boolean;
  connectedNodeIdx?: number;
}

interface Connection {
  fromIdx: number;
  toIdx: number;
  distance: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
  fromIdx: number;
  toIdx: number;
}

interface HeroNetworkProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/**
 * HeroNetwork - Fixed interactive network with cursor-lift interaction
 * Properly scales on mobile with labels constrained to viewport
 */
export function HeroNetwork({ onNavigate }: HeroNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NodeDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stateRef = useRef({
    nodes: [] as Node[],
    connections: [] as Connection[],
    particles: [] as Particle[],
    mouse: { x: 0, y: 0 },
    animationId: 0,
    width: 0,
    height: 0,
    draggedNodeIdx: -1,
    hoveredNodeIdx: -1,
    isMobile: false,
    pixelRatio: 1,
    particleSpawnTimer: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Detect mobile and set up responsive sizing
    const isMobile = window.innerWidth < 768;
    const pixelRatio = window.devicePixelRatio || 1;
    stateRef.current.isMobile = isMobile;
    stateRef.current.pixelRatio = pixelRatio;

    // Set canvas size with device pixel ratio for sharp rendering
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      
      // Scale context to account for pixel ratio
      ctx.scale(pixelRatio, pixelRatio);
      
      stateRef.current.width = width;
      stateRef.current.height = height;
    };
    resizeCanvas();

    // Initialize fixed network with responsive node count
    const nodes: Node[] = [];
    const numNodes = isMobile ? 40 : 120;
    const centerX = stateRef.current.width / 2;
    const centerY = stateRef.current.height / 2;

    // Calculate network size - much smaller on mobile to accommodate labels
    // Mobile: use 50% of available space, Desktop: use 80%
    const networkSizePercent = isMobile ? 0.5 : 0.8;
    const maxNetworkRadius = Math.min(stateRef.current.width, stateRef.current.height) / 2 * networkSizePercent;

    // Create background nodes
    for (let i = 0; i < numNodes - NAV_SECTIONS.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * maxNetworkRadius * 0.8;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      nodes.push({
        id: `node-${i}`,
        label: '',
        x,
        y,
        baseX: x,
        baseY: y,
        liftY: 0,
        radius: 2,
        isDragging: false,
        isNavNode: false,
      });
    }

    // Create navigation nodes with labels positioned to stay in bounds
    const navNodeIndices: number[] = [];
    NAV_SECTIONS.forEach((section, idx) => {
      const angle = (idx / NAV_SECTIONS.length) * Math.PI * 2;
      const navNodeDistance = maxNetworkRadius * 0.65;
      const x = centerX + Math.cos(angle) * navNodeDistance;
      const y = centerY + Math.sin(angle) * navNodeDistance;
      
      const navNodeIdx = nodes.length;
      navNodeIndices.push(navNodeIdx);
      
      nodes.push({
        id: section.id,
        label: '',
        x,
        y,
        baseX: x,
        baseY: y,
        liftY: 0,
        radius: 4,
        isDragging: false,
        isNavNode: true,
      });
      
      // Calculate label position with boundary constraints
      // Labels should stay within viewport with 30px margin
      const labelMargin = 30;
      const maxLabelDistance = isMobile ? 40 : 60;
      
      // Position label away from center, but constrain to viewport
      let labelX = x + Math.cos(angle) * maxLabelDistance;
      let labelY = y + Math.sin(angle) * maxLabelDistance;
      
      // Clamp label position to stay within viewport bounds
      labelX = Math.max(labelMargin, Math.min(stateRef.current.width - labelMargin, labelX));
      labelY = Math.max(labelMargin, Math.min(stateRef.current.height - labelMargin, labelY));
      
      nodes.push({
        id: `label-${section.id}`,
        label: section.label,
        x: labelX,
        y: labelY,
        baseX: labelX,
        baseY: labelY,
        liftY: 0,
        radius: 0,
        isDragging: false,
        isNavNode: false,
        isLabel: true,
        connectedNodeIdx: navNodeIdx,
      });
    });

    stateRef.current.nodes = nodes;

    // Mouse/Touch move handler
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX: number;
      let clientY: number;

      if (e instanceof TouchEvent) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (stateRef.current.draggedNodeIdx >= 0) {
        const node = stateRef.current.nodes[stateRef.current.draggedNodeIdx];
        if (node) {
          node.x = clientX;
          node.y = clientY;
        }
      }

      // Check for hovered nodes
      let hoveredIdx = -1;
      let isOverNode = false;
      for (let i = 0; i < stateRef.current.nodes.length; i++) {
        const node = stateRef.current.nodes[i];
        if (!node.isNavNode) continue;

        const dx = node.x - clientX;
        const dy = node.y - clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const touchRadius = stateRef.current.isMobile ? 30 : 20;
        if (distance <= node.radius + touchRadius) {
          hoveredIdx = i;
          isOverNode = true;
          break;
        }
      }
      stateRef.current.hoveredNodeIdx = hoveredIdx;
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isOverNode ? 'pointer' : 'default';
      }
      
      stateRef.current.mouse.x = clientX;
      stateRef.current.mouse.y = clientY;
    };

    // Mouse/Touch down handler
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX: number;
      let clientY: number;

      if (e instanceof TouchEvent) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const state = stateRef.current;
      
      for (let i = 0; i < state.nodes.length; i++) {
        const node = state.nodes[i];
        if (!node.isNavNode && !node.isLabel) continue;

        const dx = node.x - clientX;
        const dy = node.y - clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const touchRadius = stateRef.current.isMobile ? 30 : 20;

        if (node.isLabel && distance <= 40 + touchRadius) {
          onNavigate(node.id.replace('label-', ''));
          return;
        } else if (node.isNavNode && distance <= node.radius + touchRadius) {
          state.draggedNodeIdx = i;
          node.isDragging = true;
          return;
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const state = stateRef.current;
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (let i = 0; i < state.nodes.length; i++) {
        const node = state.nodes[i];
        if (!node.isNavNode) continue;

        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const touchRadius = stateRef.current.isMobile ? 30 : 20;
        if (distance <= node.radius + touchRadius) {
          onNavigate(node.id);
          return;
        }
      }

      for (let i = 0; i < state.nodes.length; i++) {
        const node = state.nodes[i];
        if (node.isNavNode || node.isLabel) continue;

        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const touchRadius = stateRef.current.isMobile ? 30 : 20;
        if (distance <= node.radius + touchRadius) {
          const details: NodeDetails = {
            id: node.id,
            label: node.label,
            type: 'skill',
            description: `Explore ${node.label}`,
            details: [
              `${node.label} is a key skill`,
              'Essential for data science work',
              'Used in various applications',
            ],
            tags: ['Data Science', 'Technical'],
          };
          setSelectedNode(details);
          setIsModalOpen(true);
          return;
        }
      }
    };

    // Mouse/Touch up handler
    const handlePointerUp = () => {
      const state = stateRef.current;
      if (state.draggedNodeIdx >= 0) {
        const node = state.nodes[state.draggedNodeIdx];
        if (node) {
          node.isDragging = false;
        }
        state.draggedNodeIdx = -1;
      }
    };

    const handleResize = () => {
      resizeCanvas();
    };

    // Add event listeners
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      const state = stateRef.current;
      const mouse = state.mouse;
      const maxDistance = 120;
      const liftRadius = state.isMobile ? 100 : 150;

      // Update node lift effects
      state.nodes.forEach((node) => {
        if (node.isDragging || node.isLabel) return;

        const cursorDx = node.baseX - mouse.x;
        const cursorDy = node.baseY - mouse.y;
        const cursorDist = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);

        if (cursorDist < liftRadius) {
          const liftStrength = (1 - cursorDist / liftRadius) * 20;
          node.liftY += (liftStrength - node.liftY) * 0.1;
        } else {
          node.liftY += (0 - node.liftY) * 0.1;
        }

        node.x = node.baseX;
        node.y = node.baseY - node.liftY;
      });

      // Update label positions with elastic animation
      state.nodes.forEach((node) => {
        if (!node.isLabel || node.connectedNodeIdx === undefined) return;
        
        const connectedNode = state.nodes[node.connectedNodeIdx];
        if (!connectedNode) return;
        
        const angle = Math.atan2(connectedNode.baseY - state.height / 2, connectedNode.baseX - state.width / 2);
        const maxLabelDistance = state.isMobile ? 40 : 60;
        let baseX = connectedNode.baseX + Math.cos(angle) * maxLabelDistance;
        let baseY = connectedNode.baseY + Math.sin(angle) * maxLabelDistance;
        
        // Constrain base position to viewport
        const labelMargin = 30;
        baseX = Math.max(labelMargin, Math.min(state.width - labelMargin, baseX));
        baseY = Math.max(labelMargin, Math.min(state.height - labelMargin, baseY));

        // Elastic pull toward cursor
        const cursorDx = state.mouse.x - baseX;
        const cursorDy = state.mouse.y - baseY;
        const cursorDist = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);

        if (cursorDist < 200) {
          const elasticStrength = (1 - cursorDist / 200) * 0.15;
          node.x += (baseX + cursorDx * elasticStrength - node.x) * 0.15;
          node.y += (baseY + cursorDy * elasticStrength - node.y) * 0.15;
        } else {
          node.x += (baseX - node.x) * 0.15;
          node.y += (baseY - node.y) * 0.15;
        }
      });

      // Calculate connections
      const connections: Connection[] = [];
      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const nodeA = state.nodes[i];
          const nodeB = state.nodes[j];
          
          if (nodeA.isLabel || nodeB.isLabel) continue;

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            connections.push({ fromIdx: i, toIdx: j, distance });
          }
        }
        
        const node = state.nodes[i];
        if (node.isNavNode) {
          for (let j = 0; j < state.nodes.length; j++) {
            const labelNode = state.nodes[j];
            if (labelNode.isLabel && labelNode.connectedNodeIdx === i) {
              const dx = node.x - labelNode.x;
              const dy = node.y - labelNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              connections.push({ fromIdx: i, toIdx: j, distance: distance * 0.5 });
            }
          }
        }
      }

      
      // Add dynamic connections that form and dissolve
      const currentTime = Date.now() * 0.001;
      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const nodeA = state.nodes[i];
          const nodeB = state.nodes[j];
          
          if (nodeA.isLabel || nodeB.isLabel) continue;
          if (nodeA.isNavNode || nodeB.isNavNode) continue;

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Add dynamic connections based on proximity and time
          if (distance < maxDistance * 1.2) {
            const dynamicFactor = Math.sin(currentTime + i * 0.5 + j * 0.3) * 0.5 + 0.5;
            if (dynamicFactor > 0.4 && Math.random() > 0.95) {
              connections.push({ fromIdx: i, toIdx: j, distance: distance * 0.8 });
            }
          }
        }
      }

      state.connections = connections;

      // Spawn new particles
      state.particleSpawnTimer++;
      if (state.particleSpawnTimer > (state.isMobile ? 30 : 25)) {
        state.particleSpawnTimer = 0;
        if (connections.length > 0) {
          const randomConn = connections[Math.floor(Math.random() * connections.length)];
          const fromNode = state.nodes[randomConn.fromIdx];
          const toNode = state.nodes[randomConn.toIdx];
          if (fromNode && toNode) {
            state.particles.push({
              x: fromNode.x,
              y: fromNode.y,
              targetX: toNode.x,
              targetY: toNode.y,
              progress: 0,
              speed: 0.003 + Math.random() * 0.002,
              size: 2 + Math.random() * 2,
              opacity: 0.8,
              fromIdx: randomConn.fromIdx,
              toIdx: randomConn.toIdx,
            });
          }
        }
      }

      // Update particles
      state.particles = state.particles.filter(particle => {
        particle.progress += particle.speed;
        if (particle.progress >= 1) return false;
        
        const fromNode = state.nodes[particle.fromIdx];
        const toNode = state.nodes[particle.toIdx];
        if (!fromNode || !toNode) return false;
        
        // Smooth easing function (ease-in-out cubic)
        const easeProgress = particle.progress < 0.5
          ? 4 * particle.progress * particle.progress * particle.progress
          : 1 - Math.pow(-2 * particle.progress + 2, 3) / 2;
        
        particle.x = fromNode.x + (toNode.x - fromNode.x) * easeProgress;
        particle.y = fromNode.y + (toNode.y - fromNode.y) * easeProgress;
        particle.opacity = 0.8 * (1 - particle.progress);
        
        return true;
      });

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, state.width, state.height);

      // Draw connections
      connections.forEach((conn) => {
        const fromNode = state.nodes[conn.fromIdx];
        const toNode = state.nodes[conn.toIdx];
        if (!fromNode || !toNode) return;

        const opacity = Math.max(0.15, (1 - conn.distance / maxDistance) * 0.35);
        ctx.strokeStyle = `rgba(53, 89, 200, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });

      // Draw cursor indicator (desktop only)
      if (!state.isMobile && state.mouse.x > 0 && state.mouse.y > 0) {
        ctx.fillStyle = 'rgba(53, 89, 200, 0.1)';
        ctx.beginPath();
        ctx.arc(state.mouse.x, state.mouse.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(53, 89, 200, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(state.mouse.x, state.mouse.y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      
      // Draw pulsing glow effects on random nodes
      const pulseTime = (Date.now() * 0.002) % (Math.PI * 2);
      state.nodes.forEach((node, idx) => {
        if (node.isNavNode || node.isLabel) return;
        if (Math.random() > 0.98) {
          const glowSize = node.radius + 8 + Math.sin(pulseTime + idx) * 4;
          const glowOpacity = Math.max(0, Math.sin(pulseTime + idx) * 0.2);
          ctx.strokeStyle = `rgba(53, 89, 200, ${glowOpacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

// Draw background nodes
      state.nodes.forEach((node) => {
        if (node.isNavNode || node.isLabel) return;

        ctx.fillStyle = `rgba(53, 89, 200, 0.35)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw navigation nodes
      state.nodes.forEach((node, idx) => {
        if (!node.isNavNode) return;

        const isHovered = idx === state.hoveredNodeIdx;
        const nodeRadius = isHovered ? node.radius + 2 : node.radius;
        const opacity = isHovered ? 0.7 : 0.5;

        ctx.fillStyle = `rgba(53, 89, 200, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = `rgba(53, 89, 200, 0.9)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      
      // Draw particles
      state.particles.forEach((particle) => {
        ctx.fillStyle = `rgba(53, 89, 200, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = `rgba(53, 89, 200, ${particle.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
        ctx.stroke();
      });

// Draw labels
      state.nodes.forEach((node) => {
        if (!node.isLabel) return;

        ctx.fillStyle = '#1e3a8a';
        const fontSize = state.isMobile ? 11 : 24;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });

      state.animationId = requestAnimationFrame(animate);
    };

    // Mark loading as complete after a brief delay to show animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    animate();

    return () => {
      clearTimeout(loadingTimer);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(stateRef.current.animationId);
    };
  }, [onNavigate]);

  return (
    <>
      <NetworkLoader isLoading={isLoading} />
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          touchAction: 'none',
        }}
      />
      <NodeDetailsModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

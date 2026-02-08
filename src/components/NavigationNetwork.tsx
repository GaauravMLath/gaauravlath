import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavNode {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isDragging?: boolean;
}

interface NavConnection {
  fromIdx: number;
  toIdx: number;
  distance: number;
}

interface NavigationNetworkProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/**
 * NavigationNetwork - Interactive network-based navigation overlay
 * Users navigate through sections by clicking nodes
 */
export function NavigationNetwork({
  isOpen,
  onClose,
  currentSection,
  onNavigate,
}: NavigationNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    nodes: [] as NavNode[],
    connections: [] as NavConnection[],
    mouse: { x: 0, y: 0 },
    animationId: 0,
    width: 0,
    height: 0,
    time: 0,
    draggedNodeIdx: -1,
    hoveredNodeIdx: -1,
  });

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stateRef.current.width = canvas.width;
      stateRef.current.height = canvas.height;
    };
    resizeCanvas();

    // Initialize navigation nodes in a circular arrangement
    const nodes: NavNode[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;

    SECTIONS.forEach((section, idx) => {
      const angle = (idx / SECTIONS.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      nodes.push({
        id: section.id,
        label: section.label,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 3.5,
        isDragging: false,
      });
    });

    stateRef.current.nodes = nodes;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.mouse = { x: e.clientX, y: e.clientY };

      // Update dragged node position
      if (stateRef.current.draggedNodeIdx >= 0) {
        const node = stateRef.current.nodes[stateRef.current.draggedNodeIdx];
        if (node) {
          node.x = e.clientX;
          node.y = e.clientY;
          node.vx = 0;
          node.vy = 0;
        }
      }

      // Check for hovered nodes
      let hoveredIdx = -1;
      for (let i = 0; i < stateRef.current.nodes.length; i++) {
        const node = stateRef.current.nodes[i];
        const dx = node.x - e.clientX;
        const dy = node.y - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= node.radius + 15) {
          hoveredIdx = i;
          break;
        }
      }
      stateRef.current.hoveredNodeIdx = hoveredIdx;
    };

    // Mouse down handler
    const handleMouseDown = (e: MouseEvent) => {
      const state = stateRef.current;
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (let i = 0; i < state.nodes.length; i++) {
        const node = state.nodes[i];
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= node.radius + 15) {
          // If clicking on a node, navigate to that section
          onNavigate(node.id);
          onClose();
          return;
        }
      }
    };

    // Mouse up handler
    const handleMouseUp = () => {
      const state = stateRef.current;
      if (state.draggedNodeIdx >= 0) {
        const node = state.nodes[state.draggedNodeIdx];
        if (node) {
          node.isDragging = false;
          node.vx = (Math.random() - 0.5) * 0.2;
          node.vy = (Math.random() - 0.5) * 0.2;
        }
        state.draggedNodeIdx = -1;
      }
    };

    // Resize handler
    const handleResize = () => {
      resizeCanvas();
    };

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    // Animation loop
    const animate = () => {
      const state = stateRef.current;
      const mouse = state.mouse;
      const interactionRadius = 250;
      const maxDistance = 200;

      // Update nodes
      state.nodes.forEach((node, idx) => {
        if (node.isDragging) return;

        // Gentle drift
        node.vx += Math.sin(state.time * 0.15 + idx) * 0.008;
        node.vy += Math.cos(state.time * 0.15 + idx * 0.5) * 0.008;

        // Mouse interaction
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const interactionRadiusSq = interactionRadius * interactionRadius;

        if (distSq < interactionRadiusSq) {
          const distance = Math.sqrt(distSq);
          const force = (interactionRadius - distance) / interactionRadius * 0.2;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force;
          node.vy += Math.sin(angle) * force;
        }

        // Damping
        node.vx *= 0.92;
        node.vy *= 0.92;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < node.radius) {
          node.x = node.radius;
          node.vx *= -0.5;
        }
        if (node.x > canvas.width - node.radius) {
          node.x = canvas.width - node.radius;
          node.vx *= -0.5;
        }
        if (node.y < node.radius) {
          node.y = node.radius;
          node.vy *= -0.5;
        }
        if (node.y > canvas.height - node.radius) {
          node.y = canvas.height - node.radius;
          node.vy *= -0.5;
        }
      });

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Recalculate connections
      const connections: NavConnection[] = [];
      const maxDistanceSq = maxDistance * maxDistance;

      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const dx = state.nodes[i].x - state.nodes[j].x;
          const dy = state.nodes[i].y - state.nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const distance = Math.sqrt(distSq);
            connections.push({
              fromIdx: i,
              toIdx: j,
              distance,
            });
          }
        }
      }

      // Draw connections
      connections.forEach((conn) => {
        const fromNode = state.nodes[conn.fromIdx];
        const toNode = state.nodes[conn.toIdx];
        if (!fromNode || !toNode) return;

        const opacity = Math.max(0.1, (1 - conn.distance / maxDistance) * 0.25);
        ctx.strokeStyle = `rgba(53, 89, 200, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });

      // Draw nodes
      state.nodes.forEach((node, idx) => {
        const isHovered = idx === state.hoveredNodeIdx;
        const isCurrent = node.id === currentSection;

        // Glow for hovered nodes
        if (isHovered) {
          ctx.fillStyle = 'rgba(53, 89, 200, 0.2)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glow for current section
        if (isCurrent) {
          ctx.fillStyle = 'rgba(53, 89, 200, 0.3)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node body
        const opacity = isCurrent ? 0.9 : isHovered ? 0.7 : 0.6;
        ctx.fillStyle = `rgba(53, 89, 200, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node outline
        ctx.strokeStyle = `rgba(53, 89, 200, ${isCurrent ? 1 : 0.8})`;
        ctx.lineWidth = isCurrent ? 2 : 1.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      state.time += 0.016;
      stateRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      if (stateRef.current.animationId) {
        cancelAnimationFrame(stateRef.current.animationId);
      }
    };
  }, [isOpen, currentSection, onNavigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            pointerEvents: 'auto',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              background: 'white',
              cursor: 'grab',
            }}
          />

          {/* Labels for nodes */}
          {stateRef.current.nodes.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  background: 'rgba(53, 89, 200, 0.1)',
                  border: '1px solid rgba(53, 89, 200, 0.3)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'rgba(53, 89, 200, 0.8)',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {node.label}
              </div>
            </motion.div>
          ))}

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(53, 89, 200, 0.1)',
              border: '1px solid rgba(53, 89, 200, 0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'rgba(53, 89, 200, 0.8)',
              zIndex: 1001,
              backdropFilter: 'blur(4px)',
            }}
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

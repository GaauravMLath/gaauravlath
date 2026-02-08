import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isDragging?: boolean;
}

interface Connection {
  fromIdx: number;
  toIdx: number;
  distance: number;
}

/**
 * NeuralNetworkBackground - Interactive with drag functionality
 * Users can click and drag nodes to new positions
 */
export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    nodes: [] as Node[],
    connections: [] as Connection[],
    mouse: { x: 0, y: 0 },
    animationId: 0,
    width: 0,
    height: 0,
    time: 0,
    draggedNodeIdx: -1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size to full document height
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
      canvas.height = docHeight;
      stateRef.current.width = canvas.width;
      stateRef.current.height = canvas.height;
    };
    resizeCanvas();

    // Initialize network with more nodes for visible connections
    const nodes: Node[] = [];
    const numNodes = 35;

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 2 + Math.random() * 1.5,
        isDragging: false,
      });
    }

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
    };

    // Mouse down handler - detect if clicking on a node
    const handleMouseDown = (e: MouseEvent) => {
      const state = stateRef.current;
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Check if click is on any node
      for (let i = 0; i < state.nodes.length; i++) {
        const node = state.nodes[i];
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If click is within node radius + 10px buffer
        if (distance <= node.radius + 10) {
          state.draggedNodeIdx = i;
          node.isDragging = true;
          break;
        }
      }
    };

    // Mouse up handler - release dragged node
    const handleMouseUp = () => {
      const state = stateRef.current;
      if (state.draggedNodeIdx >= 0) {
        const node = state.nodes[state.draggedNodeIdx];
        if (node) {
          node.isDragging = false;
          // Give the node a small random velocity to resume natural motion
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      const state = stateRef.current;
      const mouse = state.mouse;
      const interactionRadius = 200;
      const maxDistance = 180;

      // Update nodes
      state.nodes.forEach((node, idx) => {
        // Skip physics if node is being dragged
        if (node.isDragging) return;

        // Drift movement
        node.vx += Math.sin(state.time * 0.2 + idx) * 0.01;
        node.vy += Math.cos(state.time * 0.2 + idx * 0.5) * 0.01;

        // Mouse interaction - repel from cursor
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const interactionRadiusSq = interactionRadius * interactionRadius;

        if (distSq < interactionRadiusSq) {
          const distance = Math.sqrt(distSq);
          const force = (interactionRadius - distance) / interactionRadius * 0.25;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force;
          node.vy += Math.sin(angle) * force;
        }

        // Damping
        node.vx *= 0.93;
        node.vy *= 0.93;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges
        if (node.x < -50) node.x = canvas.width + 50;
        if (node.x > canvas.width + 50) node.x = -50;
        if (node.y < -50) node.y = canvas.height + 50;
        if (node.y > canvas.height + 50) node.y = -50;
      });

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Recalculate connections based on current positions
      const connections: Connection[] = [];
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

      // Draw connections with higher visibility
      connections.forEach((conn) => {
        const fromNode = state.nodes[conn.fromIdx];
        const toNode = state.nodes[conn.toIdx];
        if (!fromNode || !toNode) return;

        // Stronger opacity for visible connections
        const opacity = Math.max(0.15, (1 - conn.distance / maxDistance) * 0.35);

        ctx.strokeStyle = `rgba(53, 89, 200, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });

      // Draw nodes
      state.nodes.forEach((node) => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const isNearMouse = distSq < interactionRadius * interactionRadius;

        // Glow effect for nodes near mouse
        if (isNearMouse) {
          const distance = Math.sqrt(distSq);
          const glowOpacity = (1 - distance / interactionRadius) * 0.3;
          ctx.fillStyle = `rgba(53, 89, 200, ${glowOpacity})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Enhanced glow for dragged nodes
        if (node.isDragging) {
          ctx.fillStyle = `rgba(53, 89, 200, 0.4)`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node body with higher opacity
        ctx.fillStyle = `rgba(53, 89, 200, ${node.isDragging ? 0.8 : 0.55})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Node outline
        ctx.strokeStyle = `rgba(53, 89, 200, ${node.isDragging ? 1 : 0.75})`;
        ctx.lineWidth = node.isDragging ? 1.5 : 1;
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
      if (stateRef.current.animationId) {
        cancelAnimationFrame(stateRef.current.animationId);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
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
    </div>
  );
}

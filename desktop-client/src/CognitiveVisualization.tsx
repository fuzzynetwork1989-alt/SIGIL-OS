import { useState, useEffect, useRef } from "react";

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  label: string;
  activation: number;
  type: "context" | "memory" | "reasoning" | "output";
}

interface NeuralConnection {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

export default function CognitiveVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [connections, setConnections] = useState<NeuralConnection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    initializeNetwork();
    startAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializeNetwork = () => {
    const newNodes: NeuralNode[] = [
      { id: "input", x: 100, y: 300, label: "Input", activation: 0, type: "context" },
      { id: "context", x: 250, y: 200, label: "Context Router", activation: 0, type: "context" },
      { id: "memory", x: 250, y: 400, label: "Memory Engine", activation: 0, type: "memory" },
      { id: "world", x: 400, y: 150, label: "World Model", activation: 0, type: "reasoning" },
      { id: "mission", x: 400, y: 300, label: "Mission Engine", activation: 0, type: "reasoning" },
      { id: "reasoning", x: 550, y: 300, label: "Reasoning", activation: 0, type: "reasoning" },
      { id: "output", x: 700, y: 300, label: "Output", activation: 0, type: "output" },
    ];

    const newConnections: NeuralConnection[] = [
      { from: "input", to: "context", strength: 1, active: false },
      { from: "context", to: "memory", strength: 0.8, active: false },
      { from: "context", to: "world", strength: 0.9, active: false },
      { from: "context", to: "mission", strength: 0.85, active: false },
      { from: "memory", to: "reasoning", strength: 0.9, active: false },
      { from: "world", to: "reasoning", strength: 0.85, active: false },
      { from: "mission", to: "reasoning", strength: 0.8, active: false },
      { from: "reasoning", to: "output", strength: 1, active: false },
    ];

    setNodes(newNodes);
    setConnections(newConnections);
  };

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          if (conn.active) {
            ctx.strokeStyle = `rgba(107, 70, 193, ${conn.strength})`;
            ctx.lineWidth = 3;
            
            // Animated pulse
            const time = Date.now() / 1000;
            const pulsePosition = (time % 1);
            const pulseX = fromNode.x + (toNode.x - fromNode.x) * pulsePosition;
            const pulseY = fromNode.y + (toNode.y - fromNode.y) * pulsePosition;
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#9333ea";
            ctx.fill();
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${conn.strength * 0.2})`;
            ctx.lineWidth = 1;
          }
          
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 40
        );
        
        if (node.activation > 0) {
          gradient.addColorStop(0, `rgba(107, 70, 193, ${node.activation * 0.5})`);
          gradient.addColorStop(1, "transparent");
        } else {
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
          gradient.addColorStop(1, "transparent");
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 40, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        
        if (node.type === "context") {
          ctx.fillStyle = node.activation > 0 ? "#6b46c1" : "#2d3748";
        } else if (node.type === "memory") {
          ctx.fillStyle = node.activation > 0 ? "#3b82f6" : "#2d3748";
        } else if (node.type === "reasoning") {
          ctx.fillStyle = node.activation > 0 ? "#10b981" : "#2d3748";
        } else {
          ctx.fillStyle = node.activation > 0 ? "#f59e0b" : "#2d3748";
        }
        
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + 40);

        // Activation indicator
        if (node.activation > 0) {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 14px Arial";
          ctx.fillText(`${Math.round(node.activation * 100)}%`, node.x, node.y + 5);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    
    // Simulate neural activation flow
    const activationSequence = [
      { node: "input", delay: 0 },
      { node: "context", delay: 200 },
      { node: "memory", delay: 400 },
      { node: "world", delay: 400 },
      { node: "mission", delay: 400 },
      { node: "reasoning", delay: 800 },
      { node: "output", delay: 1200 },
    ];

    for (const step of activationSequence) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      setNodes(prev => prev.map(n => 
        n.id === step.node 
          ? { ...n, activation: 1 }
          : n
      ));

      setConnections(prev => prev.map(c => 
        c.from === step.node || c.to === step.node
          ? { ...c, active: true }
          : c
      ));

      await new Promise(resolve => setTimeout(resolve, 300));

      setConnections(prev => prev.map(c => ({ ...c, active: false })));
    }

    // Decay activations
    await new Promise(resolve => setTimeout(resolve, 500));
    setNodes(prev => prev.map(n => ({ ...n, activation: 0 })));
    setIsProcessing(false);
  };

  return (
    <div className="cognitive-visualization">
      <div className="visualization-header">
        <h2>Neural Cognitive Flow</h2>
        <p>Real-time visualization of SIGIL's cognitive architecture</p>
      </div>
      
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="neural-canvas"
        />
      </div>

      <div className="visualization-controls">
        <button
          onClick={simulateProcessing}
          disabled={isProcessing}
          className="simulate-button"
        >
          {isProcessing ? "Processing..." : "Simulate Cognitive Flow"}
        </button>
        
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color context"></div>
            <span>Context Router</span>
          </div>
          <div className="legend-item">
            <div className="legend-color memory"></div>
            <span>Memory Engine</span>
          </div>
          <div className="legend-item">
            <div className="legend-color reasoning"></div>
            <span>Reasoning</span>
          </div>
          <div className="legend-item">
            <div className="legend-color output"></div>
            <span>Output</span>
          </div>
        </div>
      </div>

      <div className="architecture-info">
        <h3>SIGIL Cognitive Architecture (SCA-1R)</h3>
        <p>
          This visualization shows how information flows through SIGIL's cognitive system:
          Input → Context Assembly → Memory Retrieval → World Model → Mission Context → 
          Reasoning → Output. Each node represents a core component of the cognitive architecture.
        </p>
      </div>
    </div>
  );
}

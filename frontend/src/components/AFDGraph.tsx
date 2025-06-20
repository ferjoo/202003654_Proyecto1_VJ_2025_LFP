import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
} from 'reactflow';

const nodeStyle = {
  borderRadius: '12px',
  borderWidth: '3px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  padding: '15px 25px',
  textAlign: 'center' as const,
  color: 'white',
  minWidth: 180,
  transition: 'all 0.3s ease',
};

const nodeTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 800,
  marginBottom: '5px',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};

const nodeDescStyle = {
  fontSize: '0.9rem',
  marginBottom: '8px',
  opacity: 0.9,
};

const nodeTypeStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  padding: '4px 8px',
  borderRadius: '10px',
  fontSize: '0.8rem',
  fontWeight: 600,
  display: 'inline-block',
};

const initialNodes: Node[] = [
  { 
    id: 's0', 
    position: { x: 800, y: 0 }, 
    data: { 
      label: (
        <>
          <div style={{...nodeTitleStyle, color: '#333'}}>S₀</div>
          <div style={{...nodeDescStyle, color: '#333'}}>Estado Inicial</div>
          <div style={{...nodeTypeStyle, background: 'rgba(0,0,0,0.2)', color: 'white'}}>START</div>
        </>
      )
    }, 
    style: { ...nodeStyle, background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', borderColor: '#ffd700', fontWeight: 700 },
  },
  { 
    id: 's1', 
    position: { x: 200, y: 250 }, 
    data: { 
      label: (
        <>
          <div style={nodeTitleStyle}>S₁</div>
          <div style={nodeDescStyle}>Identificador</div>
          <div style={nodeTypeStyle}>ID</div>
        </>
      )
    }, 
    style: { ...nodeStyle, background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)', borderColor: '#4a90e2' },
  },
  { 
    id: 's2', 
    position: { x: 600, y: 250 }, 
    data: { 
      label: (
        <>
          <div style={nodeTitleStyle}>S₂</div>
          <div style={nodeDescStyle}>Número Entero</div>
          <div style={nodeTypeStyle}>INT</div>
        </>
      )
    }, 
    style: { ...nodeStyle, background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', borderColor: '#9b59b6' },
  },
  { 
    id: 's3', 
    position: { x: 1000, y: 250 }, 
    data: { 
      label: (
        <>
          <div style={nodeTitleStyle}>S₃</div>
          <div style={nodeDescStyle}>Cadena</div>
          <div style={nodeTypeStyle}>STR</div>
        </>
      )
    }, 
    style: { ...nodeStyle, background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', borderColor: '#f39c12' },
  },
  { 
    id: 's4', 
    position: { x: 1400, y: 250 }, 
    data: { 
      label: (
        <>
          <div style={nodeTitleStyle}>S₄</div>
          <div style={nodeDescStyle}>Símbolo</div>
          <div style={nodeTypeStyle}>SYM</div>
        </>
      )
    }, 
    style: { ...nodeStyle, background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', borderColor: '#27ae60' },
  },
  { 
    id: 'error', 
    position: { x: 800, y: 500 }, 
    data: { 
      label: (
        <>
          <div style={nodeTitleStyle}>Error</div>
          <div style={nodeDescStyle}>Error Léxico</div>
          <div style={nodeTypeStyle}>ERR</div>
        </>
      )
    }, 
    style: { ...nodeStyle, background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', borderColor: '#c0392b' },
  },
];

const edgeStyle = {
  strokeWidth: 2,
  stroke: '#ffd700',
};

const edgeLabelStyle = {
  fill: 'white',
  fontWeight: 600,
};

const initialEdges: Edge[] = [
  // S0 -> ...
  { id: 'e-s0-s1', source: 's0', target: 's1', label: 'Letra, _', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s0-s2', source: 's0', target: 's2', label: 'Dígito', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s0-s3', source: 's0', target: 's3', label: 'Comilla (",\')', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s0-s4', source: 's0', target: 's4', label: 'Símbolo', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s0-error', source: 's0', target: 'error', label: 'Otro', type: 'smoothstep', animated: true, style: {...edgeStyle, stroke: '#e74c3c'}, labelStyle: edgeLabelStyle },

  // S1 (ID)
  { id: 'e-s1-s1', source: 's1', target: 's1', label: 'Letra, Dígito, _', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s1-s0', source: 's1', target: 's0', label: 'Otro (Acepta ID)', type: 'smoothstep', style: {...edgeStyle, stroke: '#2ecc71'}, labelStyle: edgeLabelStyle },

  // S2 (INT)
  { id: 'e-s2-s2', source: 's2', target: 's2', label: 'Dígito', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s2-s0', source: 's2', target: 's0', label: 'Otro (Acepta NUM)', type: 'smoothstep', style: {...edgeStyle, stroke: '#2ecc71'}, labelStyle: edgeLabelStyle },

  // S3 (STR)
  { id: 'e-s3-s3', source: 's3', target: 's3', label: 'Cualquier char', type: 'smoothstep', animated: true, style: edgeStyle, labelStyle: edgeLabelStyle },
  { id: 'e-s3-s0', source: 's3', target: 's0', label: 'Comilla (Acepta)', type: 'smoothstep', style: {...edgeStyle, stroke: '#2ecc71'}, labelStyle: edgeLabelStyle },
  { id: 'e-s3-error', source: 's3', target: 'error', label: 'EOF', type: 'smoothstep', style: {...edgeStyle, stroke: '#e74c3c'}, labelStyle: edgeLabelStyle },
  
  // S4 (SYM)
  { id: 'e-s4-s0', source: 's4', target: 's0', label: 'Acepta SYM', type: 'smoothstep', style: {...edgeStyle, stroke: '#2ecc71'}, labelStyle: edgeLabelStyle },
];


const AFDGraph: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ height: '80vh', width: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap nodeColor={(node) => node.style?.background as string || '#fff'} nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default AFDGraph; 
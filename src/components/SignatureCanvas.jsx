import { useState, useRef, useEffect } from 'react';

export default function SignatureCanvas({ onSignatureChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' or 'type'
  const [typedText, setTypedText] = useState('');
  const [penColor, setPenColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = penColor;
  }, [penColor]);

  const startDrawing = (e) => {
    if (mode !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || mode !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      emitSignature();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTypedText('');
    if (onSignatureChange) onSignatureChange(null);
  };

  const renderTypedSignature = (text) => {
    setTypedText(text);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (text.trim()) {
      ctx.fillStyle = penColor;
      ctx.font = 'italic 36px "Dancing Script", cursive, Georgia, serif';
      ctx.fillText(text, 20, 60);
      emitSignature();
    }
  };

  const emitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSignatureChange) onSignatureChange(dataUrl);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          className={`btn btn-sm ${mode === 'draw' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('draw')}
        >
          ✏️ Draw Signature
        </button>
        <button
          className={`btn btn-sm ${mode === 'type' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('type')}
        >
          ⌨️ Type Signature
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>Color:</label>
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', width: '28px', height: '28px' }}
          />
        </div>
      </div>

      {mode === 'type' && (
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            className="input"
            placeholder="Type your name..."
            value={typedText}
            onChange={(e) => renderTypedSignature(e.target.value)}
          />
        </div>
      )}

      <div
        style={{
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-lg)',
          background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={440}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ width: '100%', height: '120px', cursor: mode === 'draw' ? 'crosshair' : 'default' }}
        />
        <button
          onClick={clearCanvas}
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            padding: '2px 8px',
            fontSize: '11px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

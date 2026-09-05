import { useState, useEffect, useRef } from 'react';

const PRESET_SPEEDS = [
  { value: 0.5, label: '0.5x', desc: 'Slow' },
  { value: 0.75, label: '0.75x', desc: 'Mellow' },
  { value: 1.0, label: '1.0x', desc: 'Normal' },
  { value: 1.25, label: '1.25x', desc: 'Brisk' },
  { value: 1.5, label: '1.5x', desc: 'Fast' },
  { value: 1.75, label: '1.75x', desc: 'Faster' },
  { value: 2.0, label: '2.0x', desc: 'Double' },
];

function formatTime(seconds) {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function SpeedController({ file, type = 'audio', speedRatio = 1.25, onChange }) {
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);

  const mediaRef = useRef(null);

  // Setup preview URL when file changes
  useEffect(() => {
    if (!file) {
      setMediaUrl(null);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setIsPlaying(false);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Synchronize playbackRate on player whenever speedRatio changes
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = speedRatio;
    }
  }, [speedRatio]);

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration || 0);
      mediaRef.current.playbackRate = speedRatio;
    }
  };

  const estimatedNewDuration = duration > 0 && speedRatio > 0 ? duration / speedRatio : 0;
  const timeDifference = duration > 0 ? Math.abs(duration - estimatedNewDuration) : 0;

  const getSpeedDescription = () => {
    if (speedRatio === 1) return 'Normal Speed (100%)';
    if (speedRatio > 1) {
      const pct = Math.round((speedRatio - 1) * 100);
      return `${pct}% Faster · Speeds up playback`;
    }
    const pct = Math.round((1 - speedRatio) * 100);
    return `${pct}% Slower · Slow-motion effect`;
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <span style={{ fontWeight: 650, fontSize: '16px' }}>
            Choose Playback Speed
          </span>
        </div>
        <span
          className="badge"
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 650,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {speedRatio.toFixed(2)}x
        </span>
      </div>

      {/* Preset Speed Buttons Grid */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '12px', color: 'var(--fg-muted)', marginBottom: '8px', fontWeight: 500 }}>
          Speed Presets
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))',
            gap: '8px',
          }}
        >
          {PRESET_SPEEDS.map((preset) => {
            const isSelected = Math.abs(speedRatio - preset.value) < 0.01;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange(preset.value)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--fg)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--fg)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--bg-canvas)' : 'var(--fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                  {preset.label}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    opacity: isSelected ? 0.85 : 0.6,
                  }}
                >
                  {preset.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Slider */}
      <div style={{ marginBottom: '1.5rem', background: 'var(--bg-muted)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
            Fine-Tune Speed Multiplier
          </span>
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
            {getSpeedDescription()}
          </span>
        </div>
        <input
          type="range"
          min="0.25"
          max="3.0"
          step="0.05"
          value={speedRatio}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--fg-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
          <span>0.25x (Super Slow)</span>
          <span>1.0x (Normal)</span>
          <span>3.0x (3x Speed)</span>
        </div>
      </div>

      {/* Estimated Duration Calculation */}
      {duration > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '1.25rem',
            fontSize: '12.5px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            <span style={{ color: 'var(--fg-muted)' }}>Original Duration: </span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatTime(duration)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--fg-muted)' }}>New Output Duration: </span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>
              {formatTime(estimatedNewDuration)}
            </strong>
            {speedRatio !== 1 && (
              <span className="badge" style={{ fontSize: '10.5px', padding: '2px 6px' }}>
                {speedRatio > 1 ? `-${formatTime(timeDifference)} faster` : `+${formatTime(timeDifference)} slower`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Player */}
      {mediaUrl && (
        <div>
          <div style={{ fontSize: '12.5px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🎧</span>
            <span>Live Speed Preview ({speedRatio.toFixed(2)}x)</span>
          </div>

          {type === 'video' ? (
            <div
              style={{
                width: '100%',
                maxHeight: '300px',
                background: '#09090b',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <video
                ref={mediaRef}
                src={mediaUrl}
                controls
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--bg-muted)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <audio
                ref={mediaRef}
                src={mediaUrl}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ width: '100%' }}
              />
            </div>
          )}
          <div style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '6px' }}>
            Tip: Press play above to listen / watch at {speedRatio.toFixed(2)}x before generating your file.
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';

function formatShortTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00.0';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
}

export default function VideoTimelineTrimmer({ file, startTime = 0, endTime = 10, onChange }) {
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHandle, setActiveHandle] = useState(null); // 'start' | 'end' | null

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const videoUrlRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Load video file
  useEffect(() => {
    if (!file) return;

    setIsLoading(true);
    setIsPlaying(false);

    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    videoUrlRef.current = url;

    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load();
    }

    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, [file]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    const dur = video.duration || 10;
    setDuration(dur);
    setIsLoading(false);

    const initEnd = endTime && endTime > 0 && endTime <= dur ? endTime : Math.min(dur, Math.max(5, dur * 0.8));
    const initStart = startTime >= 0 && startTime < initEnd ? startTime : 0;
    if (onChangeRef.current) {
      onChangeRef.current(initStart, initEnd);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (video.currentTime < startTime || video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
      video.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    setCurrentTime(cur);

    if (cur >= endTime) {
      video.pause();
      video.currentTime = startTime;
      setIsPlaying(false);
      setCurrentTime(startTime);
    }
  };

  // Drag handles
  const handlePointerDown = (handleType) => (e) => {
    e.preventDefault();
    setActiveHandle(handleType);
  };

  const handlePointerMove = useCallback((e) => {
    if (!activeHandle || !containerRef.current || duration <= 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const posFraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = Number((posFraction * duration).toFixed(1));

    if (activeHandle === 'start') {
      const clampedStart = Math.max(0, Math.min(newTime, endTime - 0.5));
      if (onChangeRef.current) {
        onChangeRef.current(clampedStart, endTime);
      }
      if (videoRef.current) {
        videoRef.current.currentTime = clampedStart;
        setCurrentTime(clampedStart);
      }
    } else if (activeHandle === 'end') {
      const clampedEnd = Math.min(duration, Math.max(newTime, startTime + 0.5));
      if (onChangeRef.current) {
        onChangeRef.current(startTime, clampedEnd);
      }
      if (videoRef.current) {
        videoRef.current.currentTime = clampedEnd;
        setCurrentTime(clampedEnd);
      }
    }
  }, [activeHandle, duration, startTime, endTime]);

  const handlePointerUp = useCallback(() => {
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (activeHandle) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [activeHandle, handlePointerMove, handlePointerUp]);

  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Header with Title and "keep" badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🎬</span>
          <span style={{ fontWeight: 650, fontSize: '16px' }}>Select video range to cut</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge" style={{ padding: '3px 10px', fontSize: '11px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
            keep
          </span>
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
            Selected: {formatTime(Math.max(0, endTime - startTime))}
          </span>
        </div>
      </div>

      {/* Video Preview Player */}
      <div
        style={{
          width: '100%',
          maxHeight: '340px',
          background: '#09090b',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          border: '1px solid var(--border)',
        }}
      >
        <video
          ref={videoRef}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          playsInline
          style={{ maxWidth: '100%', maxHeight: '340px', display: 'block' }}
        />
      </div>

      {isLoading && (
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--fg-muted)', fontSize: '13px' }}>
          Loading video metadata...
        </div>
      )}

      {/* Timeline Scrubber Container */}
      {!isLoading && (
        <div style={{ position: 'relative', marginTop: '1rem', marginBottom: '2rem' }}>
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '48px',
              background: '#18181b',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {/* Left Dimmer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${startPercent}%`,
                background: 'rgba(0, 0, 0, 0.7)',
                pointerEvents: 'none',
              }}
            />

            {/* Middle Keep Zone */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${startPercent}%`,
                bottom: 0,
                width: `${endPercent - startPercent}%`,
                background: 'rgba(34, 197, 94, 0.15)',
                borderTop: '2px solid #22c55e',
                borderBottom: '2px solid #22c55e',
                pointerEvents: 'none',
              }}
            />

            {/* Right Dimmer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${endPercent}%`,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                pointerEvents: 'none',
              }}
            />

            {/* Moving Playhead */}
            {isPlaying && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${currentPercent}%`,
                  width: '2px',
                  background: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />
            )}
          </div>

          {/* Left Crop Handle */}
          <div
            onMouseDown={handlePointerDown('start')}
            onTouchStart={handlePointerDown('start')}
            style={{
              position: 'absolute',
              top: '-6px',
              left: `${startPercent}%`,
              transform: 'translateX(-50%)',
              zIndex: 10,
              cursor: 'ew-resize',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '60px',
                background: '#22c55e',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                border: '1px solid #15803d',
              }}
            >
              <div style={{ width: '2px', height: '18px', background: '#fff', opacity: 0.8 }} />
            </div>
            <div
              style={{
                marginTop: '3px',
                padding: '2px 5px',
                background: '#09090b',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 650,
                border: '1px solid #22c55e',
                whiteSpace: 'nowrap',
              }}
            >
              {formatShortTime(startTime)}
            </div>
          </div>

          {/* Right Crop Handle */}
          <div
            onMouseDown={handlePointerDown('end')}
            onTouchStart={handlePointerDown('end')}
            style={{
              position: 'absolute',
              top: '-6px',
              left: `${endPercent}%`,
              transform: 'translateX(-50%)',
              zIndex: 10,
              cursor: 'ew-resize',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '60px',
                background: '#22c55e',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                border: '1px solid #15803d',
              }}
            >
              <div style={{ width: '2px', height: '18px', background: '#fff', opacity: 0.8 }} />
            </div>
            <div
              style={{
                marginTop: '3px',
                padding: '2px 5px',
                background: '#09090b',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 650,
                border: '1px solid #22c55e',
                whiteSpace: 'nowrap',
              }}
            >
              {formatShortTime(endTime)}
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Play / Listen Button and Fine-Tuning */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#22c55e',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
            }}
            title={isPlaying ? 'Pause' : 'Preview trimmed video clip'}
          >
            {isPlaying ? (
              <span style={{ fontSize: '15px', fontWeight: 900 }}>❚❚</span>
            ) : (
              <span style={{ fontSize: '15px', marginLeft: '3px' }}>▶</span>
            )}
          </button>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>
              {isPlaying ? 'Playing trimmed preview...' : 'Play trimmed clip'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Start / End Time Numeric Steppers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>Start:</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max={endTime - 0.1}
              value={startTime}
              onChange={(e) => {
                const val = Math.max(0, Math.min(Number(e.target.value), endTime - 0.1));
                if (onChangeRef.current) {
                  onChangeRef.current(val, endTime);
                }
              }}
              className="input"
              style={{ width: '70px', height: '28px', fontSize: '12px', padding: '2px 6px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>End:</span>
            <input
              type="number"
              step="0.1"
              min={startTime + 0.1}
              max={duration || 9999}
              value={endTime}
              onChange={(e) => {
                const val = Math.min(duration || 9999, Math.max(Number(e.target.value), startTime + 0.1));
                if (onChangeRef.current) {
                  onChangeRef.current(startTime, val);
                }
              }}
              className="input"
              style={{ width: '70px', height: '28px', fontSize: '12px', padding: '2px 6px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

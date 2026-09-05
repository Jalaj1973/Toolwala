import { useState, useEffect, useRef, useCallback } from 'react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
}

function formatShortTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioWaveformTrimmer({ file, startTime = 0, endTime = 10, onChange }) {
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [peaks, setPeaks] = useState([]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [audioError, setAudioError] = useState(null);

  const [activeHandle, setActiveHandle] = useState(null); // 'start' | 'end' | null

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Decode audio and generate waveform peaks
  useEffect(() => {
    if (!file) return;

    let isMounted = true;
    setIsLoadingAudio(true);
    setAudioError(null);
    setIsPlaying(false);

    // Create object URL for native audio player
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    audioUrlRef.current = objectUrl;

    if (audioRef.current) {
      audioRef.current.src = objectUrl;
      audioRef.current.load();
    }

    // Decode AudioBuffer to extract waveform peaks
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioCtx.close();

        if (!isMounted) return;

        const dur = decodedBuffer.duration;
        setDuration(dur);

        // Extract 240 amplitude peak points
        const channelData = decodedBuffer.getChannelData(0);
        const sampleCount = 240;
        const blockSize = Math.floor(channelData.length / sampleCount);
        const extractedPeaks = [];

        for (let i = 0; i < sampleCount; i++) {
          let max = 0;
          const start = i * blockSize;
          const end = Math.min(channelData.length, start + blockSize);
          for (let j = start; j < end; j++) {
            const val = Math.abs(channelData[j]);
            if (val > max) max = val;
          }
          extractedPeaks.push(Math.max(0.06, max)); // Min height 0.06 for baseline
        }

        setPeaks(extractedPeaks);
        setIsLoadingAudio(false);

        // Initialize default trim range if not already configured
        const initEnd = endTime && endTime > 0 && endTime <= dur ? endTime : Math.min(dur, Math.max(5, dur * 0.8));
        const initStart = startTime >= 0 && startTime < initEnd ? startTime : 0;
        if (onChangeRef.current) {
          onChangeRef.current(initStart, initEnd);
        }
      } catch (err) {
        console.error('Failed to decode audio waveform:', err);
        if (isMounted) {
          setAudioError('Could not render waveform for this audio format, but you can still preview and trim.');
          setIsLoadingAudio(false);
        }
      }
    };

    fileReader.onerror = () => {
      if (isMounted) {
        setAudioError('Error reading audio file.');
        setIsLoadingAudio(false);
      }
    };

    fileReader.readAsArrayBuffer(file);

    return () => {
      isMounted = false;
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [file]);

  // Draw the waveform canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = width / peaks.length;
    const startX = duration > 0 ? (startTime / duration) * width : 0;
    const endX = duration > 0 ? (endTime / duration) * width : width;

    // Draw baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    for (let i = 0; i < peaks.length; i++) {
      const x = i * barWidth;
      const peak = peaks[i];
      const barHeight = peak * (height * 0.85);
      const y = (height - barHeight) / 2;

      const isInKeepZone = x >= startX && x <= endX;

      if (isInKeepZone) {
        ctx.fillStyle = '#22c55e'; // Vibrant green highlight in keep zone
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Dimmed outside zone
      }

      ctx.fillRect(x, y, Math.max(1.5, barWidth - 1), barHeight);
    }
  }, [peaks, startTime, endTime, duration]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Audio Playback Listen Control
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Seek to startTime if cursor is outside the trim range
      if (audio.currentTime < startTime || audio.currentTime >= endTime) {
        audio.currentTime = startTime;
      }
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const cur = audio.currentTime;
    setCurrentTime(cur);

    // Auto-stop when reaching endTime
    if (cur >= endTime) {
      audio.pause();
      audio.currentTime = startTime;
      setIsPlaying(false);
      setCurrentTime(startTime);
    }
  };

  // Dragging Handles logic
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
      if (audioRef.current) {
        audioRef.current.currentTime = clampedStart;
        setCurrentTime(clampedStart);
      }
    } else if (activeHandle === 'end') {
      const clampedEnd = Math.min(duration, Math.max(newTime, startTime + 0.5));
      if (onChangeRef.current) {
        onChangeRef.current(startTime, clampedEnd);
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

  // Click on track to seek
  const handleTrackClick = (e) => {
    if (activeHandle || !containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const posFraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const clickTime = posFraction * duration;

    // If clicked within keep zone, seek
    if (clickTime >= startTime && clickTime <= endTime) {
      if (audioRef.current) {
        audioRef.current.currentTime = clickTime;
        setCurrentTime(clickTime);
      }
    }
  };

  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />

      {/* Header with Title and "keep" indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✂️</span>
          <span style={{ fontWeight: 650, fontSize: '16px' }}>Select the part to trim</span>
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

      {isLoadingAudio && (
        <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>
            Reading audio waveform and peaks...
          </div>
        </div>
      )}

      {audioError && (
        <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderRadius: '8px', fontSize: '13px', marginBottom: '1rem' }}>
          {audioError}
        </div>
      )}

      {/* Interactive Waveform Container */}
      {!isLoadingAudio && (
        <div style={{ position: 'relative', marginTop: '1.5rem', marginBottom: '2rem' }}>
          {/* Main Scrubber Track */}
          <div
            ref={containerRef}
            onClick={handleTrackClick}
            style={{
              position: 'relative',
              width: '100%',
              height: '96px',
              background: '#09090b',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {/* Waveform Canvas */}
            <canvas
              ref={canvasRef}
              width={900}
              height={96}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />

            {/* Left Unselected Dimmer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${startPercent}%`,
                background: 'rgba(0, 0, 0, 0.65)',
                pointerEvents: 'none',
              }}
            />

            {/* Middle Keep Zone Highlight */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${startPercent}%`,
                bottom: 0,
                width: `${endPercent - startPercent}%`,
                background: 'rgba(34, 197, 94, 0.12)',
                borderTop: '2px solid #22c55e',
                borderBottom: '2px solid #22c55e',
                pointerEvents: 'none',
              }}
            />

            {/* Right Unselected Dimmer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${endPercent}%`,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                pointerEvents: 'none',
              }}
            />

            {/* Moving Playhead Cursor Line (Red/Orange) */}
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

          {/* Left Handle (Crop Start) */}
          <div
            onMouseDown={handlePointerDown('start')}
            onTouchStart={handlePointerDown('start')}
            style={{
              position: 'absolute',
              top: '-8px',
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
            {/* Top Green Handle Tab */}
            <div
              style={{
                width: '18px',
                height: '112px',
                background: '#22c55e',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                border: '1px solid #15803d',
              }}
            >
              <div style={{ width: '2px', height: '24px', background: '#fff', borderRadius: '1px', opacity: 0.8 }} />
            </div>
            {/* Time Bubble Below Handle */}
            <div
              style={{
                marginTop: '4px',
                padding: '2px 6px',
                background: '#09090b',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 650,
                border: '1px solid #22c55e',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}
            >
              {formatShortTime(startTime)}
            </div>
          </div>

          {/* Right Handle (Crop End) */}
          <div
            onMouseDown={handlePointerDown('end')}
            onTouchStart={handlePointerDown('end')}
            style={{
              position: 'absolute',
              top: '-8px',
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
            {/* Top Green Handle Tab */}
            <div
              style={{
                width: '18px',
                height: '112px',
                background: '#22c55e',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                border: '1px solid #15803d',
              }}
            >
              <div style={{ width: '2px', height: '24px', background: '#fff', borderRadius: '1px', opacity: 0.8 }} />
            </div>
            {/* Time Bubble Below Handle */}
            <div
              style={{
                marginTop: '4px',
                padding: '2px 6px',
                background: '#09090b',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 650,
                border: '1px solid #22c55e',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}
            >
              {formatShortTime(endTime)}
            </div>
          </div>
        </div>
      )}

      {/* Playback Controls & Listen Bar */}
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
        {/* Play / Listen Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoadingAudio}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#22c55e',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
              transition: 'transform 0.15s ease, background 0.15s ease',
            }}
            title={isPlaying ? 'Pause' : 'Listen to trimmed selection'}
          >
            {isPlaying ? (
              <span style={{ fontSize: '16px', fontWeight: 900 }}>❚❚</span>
            ) : (
              <span style={{ fontSize: '16px', marginLeft: '3px' }}>▶</span>
            )}
          </button>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>
              {isPlaying ? 'Listening to preview...' : 'Listen to trimmed part'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
              Position: {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Volume & Fine-Tune Time Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Start / End Time Inputs */}
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

          {/* Volume Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (audioRef.current) audioRef.current.muted = nextMuted;
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: '16px' }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const vol = Number(e.target.value);
                setVolume(vol);
                setIsMuted(false);
                if (audioRef.current) {
                  audioRef.current.volume = vol;
                  audioRef.current.muted = false;
                }
              }}
              style={{ width: '60px', accentColor: '#22c55e' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

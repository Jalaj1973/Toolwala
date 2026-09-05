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

  // Draw the waveform canvas with dynamic theme support (Geist/shadcn monochromatic design)
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const isDark = typeof document !== 'undefined' && (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark'
    );

    const primaryColor = isDark ? '#fafafa' : '#09090b';
    const dimmedColor = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(9, 9, 11, 0.22)';
    const baselineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(9, 9, 11, 0.08)';

    const barWidth = width / peaks.length;
    const startX = duration > 0 ? (startTime / duration) * width : 0;
    const endX = duration > 0 ? (endTime / duration) * width : width;

    // Draw baseline
    ctx.strokeStyle = baselineColor;
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
        ctx.fillStyle = primaryColor; // Sleek monochromatic theme primary
      } else {
        ctx.fillStyle = dimmedColor; // Subtle dimmed outside zone
      }

      ctx.fillRect(x, y, Math.max(1.5, barWidth - 1), barHeight);
    }
  }, [peaks, startTime, endTime, duration]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Re-draw waveform if user switches dark/light theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      drawWaveform();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
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

      {/* Header with Title and Range Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✂️</span>
          <span style={{ fontWeight: 650, fontSize: '16px' }}>Select Range to Trim</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge" style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            {formatShortTime(startTime)} – {formatShortTime(endTime)}
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
        <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '13px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {audioError}
        </div>
      )}

      {/* Interactive Waveform Container */}
      {!isLoadingAudio && (
        <div style={{ position: 'relative', marginTop: '1.5rem', marginBottom: '2.25rem' }}>
          {/* Main Scrubber Track */}
          <div
            ref={containerRef}
            onClick={handleTrackClick}
            className="media-trimmer-track"
            style={{ height: '100px' }}
          >
            {/* Waveform Canvas */}
            <canvas
              ref={canvasRef}
              width={900}
              height={100}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />

            {/* Left Unselected Dimmer */}
            <div
              className="media-trimmer-dimmer"
              style={{
                left: 0,
                width: `${startPercent}%`,
              }}
            />

            {/* Middle Keep Zone Highlight */}
            <div
              className="media-trimmer-keep-zone"
              style={{
                left: `${startPercent}%`,
                width: `${endPercent - startPercent}%`,
              }}
            />

            {/* Right Unselected Dimmer */}
            <div
              className="media-trimmer-dimmer"
              style={{
                left: `${endPercent}%`,
                right: 0,
              }}
            />

            {/* Moving Playhead Cursor Line */}
            {isPlaying && (
              <div
                className="media-trimmer-playhead"
                style={{
                  left: `${currentPercent}%`,
                }}
              />
            )}
          </div>

          {/* Left Handle (Crop Start) */}
          <div
            className="media-trimmer-handle"
            onMouseDown={handlePointerDown('start')}
            onTouchStart={handlePointerDown('start')}
            style={{
              left: `${startPercent}%`,
            }}
          >
            <div className="media-trimmer-handle-bar" style={{ height: '112px' }}>
              <div className="media-trimmer-handle-grip" style={{ height: '24px' }} />
            </div>
            <div className="media-trimmer-time-bubble">
              {formatShortTime(startTime)}
            </div>
          </div>

          {/* Right Handle (Crop End) */}
          <div
            className="media-trimmer-handle"
            onMouseDown={handlePointerDown('end')}
            onTouchStart={handlePointerDown('end')}
            style={{
              left: `${endPercent}%`,
            }}
          >
            <div className="media-trimmer-handle-bar" style={{ height: '112px' }}>
              <div className="media-trimmer-handle-grip" style={{ height: '24px' }} />
            </div>
            <div className="media-trimmer-time-bubble">
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
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Play / Listen Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="media-trimmer-play-btn"
            onClick={togglePlay}
            disabled={isLoadingAudio}
            title={isPlaying ? 'Pause' : 'Listen to trimmed selection'}
          >
            {isPlaying ? (
              <span style={{ fontSize: '15px', fontWeight: 900 }}>❚❚</span>
            ) : (
              <span style={{ fontSize: '15px', marginLeft: '2px' }}>▶</span>
            )}
          </button>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>
              {isPlaying ? 'Listening to preview...' : 'Listen to trimmed part'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
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
                style={{ width: '70px', height: '28px', fontSize: '12px', padding: '2px 6px', fontFamily: 'var(--font-mono)' }}
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
                style={{ width: '70px', height: '28px', fontSize: '12px', padding: '2px 6px', fontFamily: 'var(--font-mono)' }}
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
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: '15px' }}
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
              style={{ width: '60px', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressBar({ progress = 0, statusText = '', animated = false }) {
  return (
    <div style={{ width: '100%' }}>
      <div className="progress">
        <div
          className={`progress__bar ${animated ? 'progress__bar--animated' : ''}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {statusText && (
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
          <span>{statusText}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}

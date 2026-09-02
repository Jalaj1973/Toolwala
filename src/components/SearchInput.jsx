export default function SearchInput({ value, onChange, placeholder = 'Search tools...' }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingLeft: '2.75rem' }}
        aria-label={placeholder}
      />
      <span
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--fg-muted)',
          fontSize: '1rem',
          pointerEvents: 'none',
        }}
      >
        🔍
      </span>
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'transparent',
            color: 'var(--fg-faint)',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

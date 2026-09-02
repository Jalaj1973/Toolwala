import { getToolSvgIcon } from './Icons';

export default function StatCard({ iconKey, value, label, subtext }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ display: 'flex', alignItems: 'center' }}>
        {getToolSvgIcon(iconKey || 'sparkles', 22)}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {subtext && (
        <div style={{ fontSize: '11px', color: 'var(--fg-faint)', marginTop: '4px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
}

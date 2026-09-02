import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getToolSvgIcon } from './Icons';

export default function ToolCard({ tool }) {
  const { t } = useLanguage();

  return (
    <Link to={`/tool/${tool.id}`} className="tool-card" id={`tool-${tool.id}`}>
      <div className="tool-card__icon">
        {getToolSvgIcon(tool.iconKey || 'convert', 24)}
      </div>
      <h3 className="tool-card__title">{tool.name}</h3>
      <p className="tool-card__desc">{tool.description}</p>
      <div className="tool-card__cta">
        <span>{t('tryNow')}</span>
        <span className="tool-card__cta-arrow">→</span>
      </div>
    </Link>
  );
}

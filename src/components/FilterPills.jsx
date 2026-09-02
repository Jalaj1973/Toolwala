import { getCategoryCount } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';
import { getToolSvgIcon } from './Icons';

export default function FilterPills({ categories, activeCategory, onSelectCategory }) {
  const { t } = useLanguage();

  const getLocalizedCategoryName = (cat) => {
    const keyMap = {
      all: 'categoryAll',
      pdf: 'categoryPdf',
      image: 'categoryImage',
      video: 'categoryVideo',
      audio: 'categoryAudio',
      document: 'categoryDocument',
      archive: 'categoryArchive',
    };
    return t(keyMap[cat.id]) || cat.name;
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = getCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            className={`pill ${isActive ? 'pill--active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {getToolSvgIcon(cat.iconKey || 'folder', 16)}
            </span>
            <span>{getLocalizedCategoryName(cat)}</span>
            <span style={{ opacity: 0.7, fontSize: '12px' }}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}

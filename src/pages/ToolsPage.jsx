import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import SearchInput from '../components/SearchInput';
import FilterPills from '../components/FilterPills';
import Breadcrumb from '../components/Breadcrumb';
import { categories, tools, getToolsByCategory } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';

export default function ToolsPage() {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const activeCategory = urlCategory || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCategory = (catId) => {
    if (catId === 'all') {
      navigate('/tools');
    } else {
      navigate(`/tools/${catId}`);
    }
  };

  const filteredTools = useMemo(() => {
    let result = getToolsByCategory(activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="container section" style={{ paddingTop: '2rem' }}>
      <Breadcrumb
        items={[
          { label: t('allTools'), link: activeCategory !== 'all' ? '/tools' : null },
          ...(activeCategory !== 'all'
            ? [{ label: categories.find((c) => c.id === activeCategory)?.name || activeCategory }]
            : []),
        ]}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <div className="text-eyebrow" style={{ marginBottom: '12px' }}>
          {t('badge')}
        </div>
        <h1 className="text-heading-lg" style={{ marginBottom: '12px' }}>
          {t('allTools')}
        </h1>
        <p className="text-body" style={{ maxWidth: '60ch', marginBottom: '2rem' }}>
          {t('heroDesc')}
        </p>

        <div style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={t('searchPlaceholder')} />
        </div>

        <FilterPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {filteredTools.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--fg-muted)' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <h3>{t('noResults')} "{searchQuery}"</h3>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '1rem' }}
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-tools">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

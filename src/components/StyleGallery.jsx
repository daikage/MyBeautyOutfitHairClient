import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StyleCard from './StyleCard';
import StyleModal from './StyleModal';

const PAGE_SIZE = 12;

/**
 * Filterable style menu: category chips, instant search, "load more" paging and
 * the detail modal. On the Style Menu page the chosen category is mirrored in
 * the URL (?category=Braids%20%26%20Twists) so links can be shared.
 */
export default function StyleGallery({
  styles = [],
  categories = [],
  initialCategory = 'All',
  limit,
  syncUrl = false,
  showSearch = true,
  showFilters = true,
  emptyMessage = 'No styles match that search just yet — try another category or clear the search.',
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = syncUrl ? searchParams.get('category') || 'All' : null;

  const [category, setCategory] = useState(urlCategory || initialCategory);
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(limit || PAGE_SIZE);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (syncUrl && urlCategory && urlCategory !== category) setCategory(urlCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory, syncUrl]);

  useEffect(() => {
    setVisibleCount(limit || PAGE_SIZE);
  }, [category, query, limit]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return styles.filter((style) => {
      const matchesCategory = category === 'All' || style.category === category;
      if (!matchesCategory) return false;
      if (!needle) return true;
      return [style.name, style.description, style.category]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [styles, category, query]);

  const shown = limit ? filtered.slice(0, limit) : filtered.slice(0, visibleCount);

  const chooseCategory = (name) => {
    setCategory(name);
    if (!syncUrl) return;
    const next = new URLSearchParams(searchParams);
    if (name === 'All') next.delete('category');
    else next.set('category', name);
    setSearchParams(next, { replace: true });
  };

  const chips = useMemo(
    () => [
      { name: 'All', count: styles.length },
      ...categories.map((entry) => ({ name: entry.name, count: entry.count })),
    ],
    [categories, styles.length]
  );

  return (
    <>
      {showFilters || showSearch ? (
        <div className="toolbar">
          {showFilters ? (
            <div className="filters" role="group" aria-label="Filter styles by category">
              {chips.map((chip) => (
                <button
                  key={chip.name}
                  type="button"
                  className={`chip${category === chip.name ? ' is-active' : ''}`}
                  aria-pressed={category === chip.name}
                  onClick={() => chooseCategory(chip.name)}
                >
                  {chip.name}
                  {chip.count ? <span className="chip__count">{chip.count}</span> : null}
                </button>
              ))}
            </div>
          ) : null}

          {showSearch ? (
            <div className="search">
              <label className="sr-only" htmlFor="style-search">
                Search styles
              </label>
              <input
                id="style-search"
                type="search"
                value={query}
                placeholder="Search braids, locs, silk press…"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  className="search__clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {shown.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <div className="style-grid">
          {shown.map((style, index) => (
            <StyleCard key={style.id} style={style} index={index} onSelect={setSelected} />
          ))}
        </div>
      )}

      {!limit && filtered.length > shown.length ? (
        <div className="text-center" style={{ marginTop: '2.4rem' }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Show more styles ({filtered.length - shown.length} left)
          </button>
        </div>
      ) : null}

      <StyleModal style={selected} onClose={() => setSelected(null)} />
    </>
  );
}
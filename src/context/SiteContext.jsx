import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';
import { fallbackContent } from '../data/salon';

/**
 * Loads the whole catalogue once and shares it with every page, so filtering
 * and searching happen instantly in the browser.
 */
const SiteContext = createContext(null);

const initialState = {
  status: 'loading',
  error: '',
  styles: [],
  categories: [],
  services: [],
  testimonials: [],
  content: fallbackContent,
};

export function SiteProvider({ children }) {
  const [state, setState] = useState(initialState);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: 'loading', error: '' }));
    try {
      const [styles, categories, services, testimonials, content] = await Promise.all([
        api.getStyles(),
        api.getCategories(),
        api.getServices(),
        api.getTestimonials(),
        api.getContent(),
      ]);
      setState({
        status: 'ready',
        error: '',
        styles: styles.styles || [],
        categories: categories.categories || [],
        services: services.services || [],
        testimonials: testimonials.testimonials || [],
        content: { ...fallbackContent, ...(content.content || {}) },
      });
    } catch (error) {
      setState((current) => ({ ...current, status: 'error', error: error.message }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => {
    const featured = state.styles.filter((style) => style.featured);
    const byCategory = (category) =>
      !category || category === 'All'
        ? state.styles
        : state.styles.filter((style) => style.category === category);

    return {
      ...state,
      featured: featured.length > 0 ? featured : state.styles.slice(0, 8),
      byCategory,
      reload: load,
    };
  }, [state, load]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used inside <SiteProvider>.');
  return context;
}

export default SiteContext;
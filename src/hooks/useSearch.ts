import { useState, useMemo } from 'react';

export function useSearch<T>(
  items: T[],
  searchFields: (item: T) => string[],
  initialQuery: string = ''
) {
  const [query, setQuery] = useState(initialQuery);

  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return items;

    return items.filter((item) => {
      const fields = searchFields(item);
      return fields.some((field) => field && field.toLowerCase().includes(cleanQuery));
    });
  }, [items, searchFields, query]);

  return {
    query,
    setQuery,
    filteredItems,
    hasActiveSearch: query.trim().length > 0,
    clearSearch: () => setQuery(''),
  };
}

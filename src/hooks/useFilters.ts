import { useState, useCallback } from 'react';
import { TaskFilterState, ProjectFilterState } from '../types';

export const initialTaskFilters: TaskFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  projectId: 'all',
};

export const initialProjectFilters: ProjectFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
};

export function useTaskFilters(defaults: Partial<TaskFilterState> = {}) {
  const [filters, setFilters] = useState<TaskFilterState>({
    ...initialTaskFilters,
    ...defaults,
  });

  const setFilter = useCallback((key: keyof TaskFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialTaskFilters);
  }, []);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.projectId !== 'all';

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0) +
    (filters.projectId !== 'all' ? 1 : 0);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}

export function useProjectFilters(defaults: Partial<ProjectFilterState> = {}) {
  const [filters, setFilters] = useState<ProjectFilterState>({
    ...initialProjectFilters,
    ...defaults,
  });

  const setFilter = useCallback((key: keyof ProjectFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialProjectFilters);
  }, []);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all';

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}

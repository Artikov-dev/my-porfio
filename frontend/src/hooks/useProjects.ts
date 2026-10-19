import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DEFAULT_PROJECTS, ProjectItem } from '@/lib/mockProjects';

// Shared by the home preview and the /projects page (same cache key → one request).
// Falls back to the built-in list while the backend is asleep or unreachable.
export const useProjects = () => {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<ProjectItem[]> => {
      try {
        const res = await api.get('/projects', { timeout: 6000 });
        if (Array.isArray(res?.data?.data) && res.data.data.length > 0) {
          return res.data.data;
        }
      } catch {
        // backend asleep / offline
      }
      return DEFAULT_PROJECTS;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { ...query, projects: query.data && query.data.length > 0 ? query.data : DEFAULT_PROJECTS };
};

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api, ExportViewResponse } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface UseExportViewParams {
  page?: number;
  limit?: number;
}

export function useExportView(params: UseExportViewParams = {}) {
  const { page = 1, limit = 10 } = params;
  const token = useAuthStore((state) => state.token);

  return useQuery<ExportViewResponse>({
    queryKey: ['exportView', page, limit],
    queryFn: () => api.getExportView({ page, limit, token: token || '' }),
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
}

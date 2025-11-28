import { useQuery } from '@tanstack/react-query';
import { api, HealthCheckResponse } from '../lib/api';

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'checking';
  latency?: number;
  lastChecked?: Date;
}

export interface UseHealthCheckReturn {
  healthData: HealthCheckResponse | null;
  services: ServiceStatus[];
  apiLatency: number | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useHealthCheck(): UseHealthCheckReturn {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuery<HealthCheckResponse>({
    queryKey: ['healthCheck'],
    queryFn: async () => {
      const startTime = performance.now();
      const response = await api.getHealthCheck();
      const endTime = performance.now();
      
      (response as HealthCheckResponse & { _latency: number })._latency = Math.round(endTime - startTime);
      
      return response;
    },
    refetchInterval: false,
    staleTime: 0,
  });

  // Extraer latencia del response
  const apiLatency = data ? (data as HealthCheckResponse & { _latency?: number })._latency ?? null : null;

  // Construir el estado de los servicios basado en los datos
  const services: ServiceStatus[] = [
    {
      name: 'Frontend App',
      status: 'online',
      latency: 0,
      lastChecked: new Date(),
    },
    {
      name: 'API Backend',
      status: isLoading ? 'checking' : isError ? 'offline' : 'online',
      latency: apiLatency ?? undefined,
      lastChecked: dataUpdatedAt ? new Date(dataUpdatedAt) : undefined,
    },
    {
      name: 'Base de Datos (MongoDB)',
      status: isLoading 
        ? 'checking' 
        : isError 
          ? 'offline' 
          : data?.services.database.connected 
            ? 'online' 
            : 'offline',
      lastChecked: dataUpdatedAt ? new Date(dataUpdatedAt) : undefined,
    },
  ];

  return {
    healthData: data ?? null,
    services,
    apiLatency,
    isLoading,
    isError,
    refetch,
  };
}


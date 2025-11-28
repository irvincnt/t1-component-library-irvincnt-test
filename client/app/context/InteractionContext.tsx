'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

interface InteractionEvent {
  componentName: string;
  action: string;
  timestamp: Date;
}

interface ServerStats {
  totalInteracciones: number;
  porComponente: Array<{ _id: string; count: number }>;
  porAccion: Array<{ _id: { componente: string; accion: string }; count: number }>;
  porTipoUsuario: Array<{ _id: string; count: number }>;
}

interface InteractionContextType {
  totalInteractions: number;
  trackInteraction: (componentName: string, action: string) => void;
  serverStats: ServerStats | undefined;
  isLoadingServerStats: boolean;
  isRefetchingServerStats: boolean;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<InteractionEvent[]>([]);

  const getTotalCurrentInteractions = useCallback(() => {
    return events.length;
  }, [events]);

  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const {
    data: serverStats,
    isLoading: isLoadingServerStats,
    isRefetching: isRefetchingServerStats,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.getStats();
      return response.data;
    },
    // refetchInterval: 5000, // TODO: validar si es necesario el polling de 5 segundos
    refetchOnWindowFocus: true,
    staleTime: 3000,
  });

  const trackMutation = useMutation({
    mutationFn: (params: { nombre: string; accion: string }) => {
      return api.trackInteraction({
        nombre: params.nombre,
        accion: params.accion,
        tipo_usuario: isAuthenticated ? 'registered' : 'anonymous',
        usuario: isAuthenticated ? user?.id : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error al enviar interacción:', error);
    },
  });

  const trackInteraction = useCallback(
    (componentName: string, action: string) => {
      // Guardar en el estado local para el contexto de acciones actuales
      setEvents((prev) => [
        ...prev,
        { componentName, action, timestamp: new Date() },
      ]);

      // Enviar al servidor para persistencia
      trackMutation.mutate({ nombre: componentName, accion: action });
    },
    [trackMutation]
  );

  return (
    <InteractionContext.Provider
      value={{
        totalInteractions: getTotalCurrentInteractions(),
        trackInteraction,
        serverStats,
        isLoadingServerStats,
        isRefetchingServerStats,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteractions() {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteractions must be used within an InteractionProvider');
  }
  return context;
}

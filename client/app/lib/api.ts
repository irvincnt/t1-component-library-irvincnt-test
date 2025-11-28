const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface TrackingPayload {
  nombre: string;
  accion: string;
  tipo_usuario: 'anonymous' | 'registered';
  usuario?: string;
}

interface TrackingResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    nombre: string;
    accion: string;
    tipo_usuario: string;
    timestamp: string;
    usuario?: string;
  };
}

interface StatsResponse {
  success: boolean;
  data: {
    totalInteracciones: number;
    porComponente: Array<{ _id: string; count: number }>;
    porAccion: Array<{ _id: { componente: string; accion: string }; count: number }>;
    porTipoUsuario: Array<{ _id: string; count: number }>;
  };
}

export interface ExportViewItem {
  id: string;
  nombre_componente: string;
  accion: string;
  timestamp: string;
  tipo_usuario: 'anonymous' | 'registered';
  nombre_usuario: string | null;
}

export interface ExportViewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ExportViewResponse {
  success: boolean;
  data: ExportViewItem[];
  pagination: ExportViewPagination;
}

export interface ExportViewParams {
  page?: number;
  limit?: number;
  token: string;
}

export interface HealthCheckResponse {
  success: boolean;
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: string;
  services: {
    database: {
      status: string;
      connected: boolean;
    };
  };
  system: {
    nodeVersion: string;
    memory: {
      heapUsed: string;
      heapTotal: string;
      rss: string;
    };
  };
}

export interface ExportDataItem {
  _id: string;
  nombre: string;
  accion: string;
  timestamp: string;
  tipo_usuario: 'anonymous' | 'registered';
  usuario?: {
    _id: string;
    nombre: string;
    email: string;
  };
  __v: number;
}

export interface ExportResponse {
  success: boolean;
  data: ExportDataItem[];
}

export const api = {
  trackInteraction: async (payload: TrackingPayload): Promise<TrackingResponse> => {
    const response = await fetch(`${API_URL}/components/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Error al registrar interacción');
    }

    return response.json();
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await fetch(`${API_URL}/components/stats`);

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }

    return response.json();
  },

  getExportView: async (params: ExportViewParams): Promise<ExportViewResponse> => {
    const { page = 1, limit = 10, token } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),  
    });

    const response = await fetch(`${API_URL}/components/export/view?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de exportación');
    }

    return response.json();
  },

  getExportData: async (token: string): Promise<ExportResponse> => {
    const response = await fetch(`${API_URL}/components/export`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de exportación');
    }

    return response.json();
  },

  getHealthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error('Error al obtener estado del servidor');
    }

    return response.json();
  },
};


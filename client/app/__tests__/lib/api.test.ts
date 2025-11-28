import { api } from '../../lib/api';

// Mock de fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackInteraction', () => {
    it('envía POST con payload correcto', async () => {
      const mockResponse = {
        success: true,
        message: 'Interacción registrada',
        data: {
          _id: '123',
          nombre: 'Button',
          accion: 'click',
          tipo_usuario: 'anonymous',
          timestamp: '2024-01-01T00:00:00.000Z',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const payload = {
        nombre: 'Button',
        accion: 'click',
        tipo_usuario: 'anonymous' as const,
      };

      const result = await api.trackInteraction(payload);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/components/track'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('envía payload con usuario cuando está presente', async () => {
      const mockResponse = {
        success: true,
        message: 'Interacción registrada',
        data: {
          _id: '123',
          nombre: 'Button',
          accion: 'click',
          tipo_usuario: 'registered',
          timestamp: '2024-01-01T00:00:00.000Z',
          usuario: 'user123',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const payload = {
        nombre: 'Button',
        accion: 'click',
        tipo_usuario: 'registered' as const,
        usuario: 'user123',
      };

      await api.trackInteraction(payload);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(payload),
        })
      );
    });

    it('lanza error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        api.trackInteraction({
          nombre: 'Button',
          accion: 'click',
          tipo_usuario: 'anonymous',
        })
      ).rejects.toThrow('Error al registrar interacción');
    });
  });

  describe('getStats', () => {
    it('obtiene estadísticas correctamente', async () => {
      const mockResponse = {
        success: true,
        data: {
          totalInteracciones: 100,
          porComponente: [{ _id: 'Button', count: 50 }],
          porAccion: [{ _id: { componente: 'Button', accion: 'click' }, count: 50 }],
          porTipoUsuario: [{ _id: 'anonymous', count: 80 }],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getStats();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/components/stats')
      );
      expect(result).toEqual(mockResponse);
    });

    it('lanza error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getStats()).rejects.toThrow('Error al obtener estadísticas');
    });
  });

  describe('getExportView', () => {
    it('obtiene datos de exportación paginados correctamente', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: '1',
            nombre_componente: 'Button',
            accion: 'click',
            timestamp: '2024-01-01T00:00:00.000Z',
            tipo_usuario: 'anonymous',
            nombre_usuario: null,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          totalPages: 10,
          hasNextPage: true,
          hasPrevPage: false,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getExportView({
        page: 1,
        limit: 10,
        token: 'test-token',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/components/export/view?page=1&limit=10'),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-token',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('usa valores por defecto para page y limit', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await api.getExportView({ token: 'test-token' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });

    it('acepta parámetros de paginación personalizados', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {
          page: 2,
          limit: 25,
          total: 100,
          totalPages: 4,
          hasNextPage: true,
          hasPrevPage: true,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await api.getExportView({ page: 2, limit: 25, token: 'test-token' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=25'),
        expect.any(Object)
      );
    });

    it('lanza error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(
        api.getExportView({ token: 'invalid-token' })
      ).rejects.toThrow('Error al obtener datos de exportación');
    });
  });

  describe('getExportData', () => {
    it('obtiene todos los datos de exportación correctamente', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            _id: '1',
            nombre: 'Button',
            accion: 'click',
            timestamp: '2024-01-01T00:00:00.000Z',
            tipo_usuario: 'anonymous',
            __v: 0,
          },
          {
            _id: '2',
            nombre: 'Input',
            accion: 'focus',
            timestamp: '2024-01-01T00:00:00.000Z',
            tipo_usuario: 'registered',
            usuario: {
              _id: 'user1',
              nombre: 'Test User',
              email: 'test@example.com',
            },
            __v: 0,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getExportData('test-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/components/export'),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-token',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('envía Authorization header con el token', async () => {
      const mockResponse = { success: true, data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await api.getExportData('my-auth-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer my-auth-token',
          },
        })
      );
    });

    it('lanza error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(api.getExportData('invalid-token')).rejects.toThrow(
        'Error al obtener datos de exportación'
      );
    });
  });

  describe('getHealthCheck', () => {
    it('obtiene estado de salud del servidor correctamente', async () => {
      const mockResponse = {
        success: true,
        status: 'healthy',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: '24h 30m',
        services: {
          database: {
            status: 'connected',
            connected: true,
          },
        },
        system: {
          nodeVersion: 'v18.0.0',
          memory: {
            heapUsed: '50MB',
            heapTotal: '100MB',
            rss: '150MB',
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getHealthCheck();

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
      expect(result).toEqual(mockResponse);
    });

    it('retorna estado degraded cuando hay problemas', async () => {
      const mockResponse = {
        success: true,
        status: 'degraded',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: '1h',
        services: {
          database: {
            status: 'disconnected',
            connected: false,
          },
        },
        system: {
          nodeVersion: 'v18.0.0',
          memory: {
            heapUsed: '90MB',
            heapTotal: '100MB',
            rss: '200MB',
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.getHealthCheck();

      expect(result.status).toBe('degraded');
      expect(result.services.database.connected).toBe(false);
    });

    it('lanza error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(api.getHealthCheck()).rejects.toThrow(
        'Error al obtener estado del servidor'
      );
    });

    it('lanza error cuando el servidor no responde', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getHealthCheck()).rejects.toThrow('Network error');
    });
  });

  describe('API_URL configuration', () => {
    it('usa la URL configurada en NEXT_PUBLIC_API_URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      });

      await api.getStats();

      // Verificar que usa la URL base correcta
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      // console.log('calledUrl', calledUrl);
      expect(calledUrl.startsWith('http://localhost:3001/api')).toBe(true);
    });
  });
});


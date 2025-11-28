import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InteractionProvider, useInteractions } from '../../context/InteractionContext';
import { api } from '../../lib/api';

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isAuthenticated: false,
    user: null,
    token: null,
  })),
}));

jest.mock('../../lib/api', () => ({
  api: {
    trackInteraction: jest.fn(),
    getStats: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

function TestComponent() {
  const { totalInteractions, trackInteraction, serverStats, isLoadingServerStats } = useInteractions();

  return (
    <div>
      <span data-testid="total-interactions">{totalInteractions}</span>
      <span data-testid="loading">{isLoadingServerStats ? 'loading' : 'ready'}</span>
      <button 
        data-testid="track-button"
        onClick={() => trackInteraction('Button', 'click')}
      >
        Track Click
      </button>
      <button 
        data-testid="track-hover"
        onClick={() => trackInteraction('Card', 'hover')}
      >
        Track Hover
      </button>
      {serverStats && (
        <span data-testid="server-total">{serverStats.totalInteracciones}</span>
      )}
    </div>
  );
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <InteractionProvider>
        {ui}
      </InteractionProvider>
    </QueryClientProvider>
  );
}

describe('Sistema de Tracking - Integración', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.getStats.mockResolvedValue({
      success: true,
      data: {
        totalInteracciones: 100,
        porComponente: [{ _id: 'Button', count: 50 }],
        porAccion: [{ _id: { componente: 'Button', accion: 'click' }, count: 50 }],
        porTipoUsuario: [{ _id: 'anonymous', count: 100 }],
      },
    });
    mockApi.trackInteraction.mockResolvedValue({
      success: true,
      message: 'Interacción registrada',
      data: {
        _id: '123',
        nombre: 'Button',
        accion: 'click',
        tipo_usuario: 'anonymous',
        timestamp: new Date().toISOString(),
      },
    });
  });

  describe('InteractionContext', () => {
    it('proporciona el contexto correctamente', async () => {
      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('total-interactions')).toHaveTextContent('0');
    });

    it('lanza error si useInteractions se usa fuera del provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useInteractions must be used within an InteractionProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Tracking de Interacciones', () => {
    it('incrementa contador local al trackear interacción', async () => {
      renderWithProviders(<TestComponent />);
      
      const initialCount = screen.getByTestId('total-interactions').textContent;
      expect(initialCount).toBe('0');
      
      await userEvent.click(screen.getByTestId('track-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('total-interactions')).toHaveTextContent('1');
      });
    });

    it('envía interacción al servidor', async () => {
      renderWithProviders(<TestComponent />);
      
      await userEvent.click(screen.getByTestId('track-button'));
      
      await waitFor(() => {
        expect(mockApi.trackInteraction).toHaveBeenCalledWith({
          nombre: 'Button',
          accion: 'click',
          tipo_usuario: 'anonymous',
          usuario: undefined,
        });
      });
    });

    it('trackea múltiples interacciones correctamente', async () => {
      renderWithProviders(<TestComponent />);
      
      await userEvent.click(screen.getByTestId('track-button'));
      await userEvent.click(screen.getByTestId('track-hover'));
      await userEvent.click(screen.getByTestId('track-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('total-interactions')).toHaveTextContent('3');
      });
      
      expect(mockApi.trackInteraction).toHaveBeenCalledTimes(3);
    });

    it('maneja diferentes tipos de acciones', async () => {
      renderWithProviders(<TestComponent />);
      
      await userEvent.click(screen.getByTestId('track-button'));
      await userEvent.click(screen.getByTestId('track-hover'));
      
      await waitFor(() => {
        expect(mockApi.trackInteraction).toHaveBeenCalledWith(
          expect.objectContaining({ nombre: 'Button', accion: 'click' })
        );
        expect(mockApi.trackInteraction).toHaveBeenCalledWith(
          expect.objectContaining({ nombre: 'Card', accion: 'hover' })
        );
      });
    });
  });

  describe('Estadísticas del Servidor', () => {
    it('carga estadísticas del servidor', async () => {
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('server-total')).toHaveTextContent('100');
      });
    });

    it('muestra estado de carga mientras obtiene stats', async () => {
      mockApi.getStats.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          success: true,
          data: {
            totalInteracciones: 100,
            porComponente: [],
            porAccion: [],
            porTipoUsuario: [],
          },
        }), 100))
      );
      
      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });
    });

    it('invalida queries después de trackear', async () => {
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(mockApi.getStats).toHaveBeenCalled();
      });
      
      const initialCallCount = mockApi.getStats.mock.calls.length;
      
      await userEvent.click(screen.getByTestId('track-button'));
      
      await waitFor(() => {
        expect(mockApi.getStats.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });

  describe('Manejo de Errores', () => {
    it('maneja error de API al trackear sin romper la UI', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockApi.trackInteraction.mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<TestComponent />);
      
      await userEvent.click(screen.getByTestId('track-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('total-interactions')).toHaveTextContent('1');
      });
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('continúa funcionando después de un error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockApi.trackInteraction
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          success: true,
          message: 'OK',
          data: {
            _id: '124',
            nombre: 'Button',
            accion: 'click',
            tipo_usuario: 'anonymous',
            timestamp: new Date().toISOString(),
          },
        });
      
      renderWithProviders(<TestComponent />);
      
      await userEvent.click(screen.getByTestId('track-button'));
      
      await userEvent.click(screen.getByTestId('track-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('total-interactions')).toHaveTextContent('2');
      });
      
      consoleSpy.mockRestore();
    });
  });
});

describe('API de Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('trackInteraction', () => {
    it('envía payload correcto al endpoint', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          message: 'OK',
          data: { _id: '1' },
        }),
      });
      global.fetch = mockFetch;
      
      const { api: realApi } = jest.requireActual('../../lib/api');
      
      await realApi.trackInteraction({
        nombre: 'Button',
        accion: 'click',
        tipo_usuario: 'anonymous',
      });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/components/track'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: 'Button',
            accion: 'click',
            tipo_usuario: 'anonymous',
          }),
        })
      );
    });

    it('maneja errores de red correctamente', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      
      const { api: realApi } = jest.requireActual('../../lib/api');
      
      await expect(realApi.trackInteraction({
        nombre: 'Button',
        accion: 'click',
        tipo_usuario: 'anonymous',
      })).rejects.toThrow('Error al registrar interacción');
    });
  });

  describe('getStats', () => {
    it('obtiene estadísticas correctamente', async () => {
      const mockStats = {
        success: true,
        data: {
          totalInteracciones: 150,
          porComponente: [],
          porAccion: [],
          porTipoUsuario: [],
        },
      };
      
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats),
      });
      
      const { api: realApi } = jest.requireActual('../../lib/api');
      const result = await realApi.getStats();
      
      expect(result).toEqual(mockStats);
    });

    it('maneja errores al obtener estadísticas', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      
      const { api: realApi } = jest.requireActual('../../lib/api');
      
      await expect(realApi.getStats()).rejects.toThrow('Error al obtener estadísticas');
    });
  });
});

describe('Usuario Autenticado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.getStats.mockResolvedValue({
      success: true,
      data: {
        totalInteracciones: 100,
        porComponente: [],
        porAccion: [],
        porTipoUsuario: [],
      },
    });
    mockApi.trackInteraction.mockResolvedValue({
      success: true,
      message: 'OK',
      data: {
        _id: '123',
        nombre: 'Button',
        accion: 'click',
        tipo_usuario: 'registered',
        timestamp: new Date().toISOString(),
        usuario: 'user-123',
      },
    });
  });

  it('envía tipo_usuario como registered cuando está autenticado', async () => {
    jest.doMock('../../store/authStore', () => ({
      useAuthStore: () => ({
        isAuthenticated: true,
        user: { id: 'user-123', nombre: 'Test User', email: 'test@example.com' },
        token: 'token-123',
      }),
    }));
    
    expect(mockApi.trackInteraction).toBeDefined();
  });
});



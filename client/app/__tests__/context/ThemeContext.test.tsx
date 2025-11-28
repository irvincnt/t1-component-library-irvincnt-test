import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

function ThemeTestComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="mounted">{mounted.toString()}</span>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    document.documentElement.classList.remove('dark');
  });

  describe('ThemeProvider', () => {
    it('renderiza children correctamente', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child content</div>
        </ThemeProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('proporciona valores por defecto del contexto', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });

    it('cambia mounted a true después del montaje', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mounted')).toHaveTextContent('true');
      });
    });

    it('lee tema del localStorage al montar', async () => {
      localStorageMock.getItem.mockReturnValueOnce('dark');

      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      });
    });
  });

  describe('setTheme', () => {
    it('cambia tema a light', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
      });
    });

    it('cambia tema a dark', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      });
    });

    it('cambia tema a system', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-light'));
      await userEvent.click(screen.getByTestId('set-system'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
      });
    });

    it('guarda tema en localStorage cuando mounted es true', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mounted')).toHaveTextContent('true');
      });

      await userEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      });
    });
  });

  describe('toggleTheme', () => {
    it('cambia de light a dark', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
      });

      await userEvent.click(screen.getByTestId('toggle-theme'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      });
    });

    it('cambia de dark a light', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      });

      await userEvent.click(screen.getByTestId('toggle-theme'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
      });
    });

    it('cambia de system a opuesto de resolvedTheme', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      await userEvent.click(screen.getByTestId('toggle-theme'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      });
    });
  });

  describe('resolvedTheme', () => {
    it('resuelve a light cuando tema es light', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });
    });

    it('resuelve a dark cuando tema es dark', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });
    });
  });

  describe('Clase CSS dark', () => {
    it('agrega clase dark al documentElement cuando tema es dark', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('remueve clase dark del documentElement cuando tema es light', async () => {
      document.documentElement.classList.add('dark');

      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });
  });

  describe('useTheme hook', () => {
    it('retorna el contexto correctamente', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toBeInTheDocument();
      expect(screen.getByTestId('resolved-theme')).toBeInTheDocument();
      expect(screen.getByTestId('mounted')).toBeInTheDocument();
      expect(screen.getByTestId('set-light')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-theme')).toBeInTheDocument();
    });

    it('retorna valores por defecto cuando no hay provider', () => {
      function NoProviderComponent() {
        const { theme, resolvedTheme, mounted } = useTheme();
        return (
          <div>
            <span data-testid="theme">{theme}</span>
            <span data-testid="resolved">{resolvedTheme}</span>
            <span data-testid="mounted">{mounted.toString()}</span>
          </div>
        );
      }

      render(<NoProviderComponent />);

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved')).toHaveTextContent('light');
      expect(screen.getByTestId('mounted')).toHaveTextContent('false');
    });
  });

  describe('Media Query - System Theme', () => {
    it('usa el tema del sistema cuando está en modo system', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );

      await userEvent.click(screen.getByTestId('set-system'));

      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('system');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });
    });
  });
});


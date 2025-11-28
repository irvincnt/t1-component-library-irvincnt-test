import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../../components/Navbar';
import { ThemeProvider } from '../../context/ThemeContext';
import { InteractionProvider } from '../../context/InteractionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string }) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isAuthenticated: false,
    user: null,
    logout: jest.fn(),
  })),
}));

jest.mock('../../context/InteractionContext', () => ({
  InteractionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInteractions: () => ({
    totalInteractions: 5,
    trackInteraction: jest.fn(),
    serverStats: undefined,
    isLoadingServerStats: false,
    isRefetchingServerStats: false,
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: jest.fn(),
    toggleTheme: jest.fn(),
    mounted: true,
  }),
}));

import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';

const mockUsePathname = usePathname as jest.Mock;
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    });
  });

  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<Navbar />);
      expect(screen.getByText('T1 Component Library')).toBeInTheDocument();
    });

    it('renderiza el logo con link a home', () => {
      render(<Navbar />);
      const logo = screen.getByText('T1 Component Library').closest('a');
      expect(logo).toHaveAttribute('href', '/');
    });

    it('renderiza todos los links de navegación', () => {
      render(<Navbar />);
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /exports/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /status/i })).toBeInTheDocument();
    });

    it('renderiza contador de interacciones', () => {
      render(<Navbar />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Navegación', () => {
    it('aplica estilo activo al link de la página actual', () => {
      mockUsePathname.mockReturnValue('/docs');
      render(<Navbar />);
      
      // El link de Docs debería tener el estilo activo
      const docsLinks = screen.getAllByRole('link', { name: /docs/i });
      const docsLink = docsLinks.find(link => 
        link.className.includes('bg-primary')
      );
      expect(docsLink).toBeTruthy();
    });

    it('links tienen los href correctos', () => {
      render(<Navbar />);
      
      expect(screen.getAllByRole('link', { name: /home/i })[0]).toHaveAttribute('href', '/');
      expect(screen.getAllByRole('link', { name: /docs/i })[0]).toHaveAttribute('href', '/docs');
      expect(screen.getAllByRole('link', { name: /dashboard/i })[0]).toHaveAttribute('href', '/dashboard');
      expect(screen.getAllByRole('link', { name: /exports/i })[0]).toHaveAttribute('href', '/exports');
      expect(screen.getAllByRole('link', { name: /status/i })[0]).toHaveAttribute('href', '/status');
    });
  });

  describe('Toggle de Tema', () => {
    it('renderiza botón de toggle de tema', () => {
      render(<Navbar />);
      const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(themeButton).toBeInTheDocument();
    });

    it('muestra icono correcto según el tema actual', () => {
      render(<Navbar />);
      const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Autenticación - No autenticado', () => {
    it('muestra botón de login cuando no está autenticado', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
      });
      
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('el botón de login es un link a /login', () => {
      render(<Navbar />);
      const loginLink = screen.getByRole('link', { name: /login/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Autenticación - Autenticado', () => {
    it('muestra nombre de usuario cuando está autenticado', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: '1', nombre: 'John Doe', email: 'john@example.com' },
        logout: jest.fn(),
      });
      
      render(<Navbar />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('muestra botón de logout cuando está autenticado', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: '1', nombre: 'John', email: 'john@example.com' },
        logout: jest.fn(),
      });
      
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('ejecuta logout al hacer click en el botón', async () => {
      const mockLogout = jest.fn();
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: '1', nombre: 'John', email: 'john@example.com' },
        logout: mockLogout,
      });
      
      render(<Navbar />);
      await userEvent.click(screen.getByRole('button', { name: /logout/i }));
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Menú Mobile', () => {
    it('renderiza botón de menú mobile', () => {
      render(<Navbar />);
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('muestra menú mobile al hacer click', async () => {
      render(<Navbar />);
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      
      await userEvent.click(menuButton);
      
      const mobileMenu = document.querySelector('.animate-slide-down');
      expect(mobileMenu).toBeInTheDocument();
    });

    it('oculta menú mobile al hacer click de nuevo', async () => {
      render(<Navbar />);
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      
      await userEvent.click(menuButton);
      await userEvent.click(menuButton);
      
      const mobileMenu = document.querySelector('.animate-slide-down');
      expect(mobileMenu).not.toBeInTheDocument();
    });

    it('cierra menú mobile al seleccionar un link', async () => {
      render(<Navbar />);
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      
      await userEvent.click(menuButton);
      
      const mobileLinks = document.querySelectorAll('.animate-slide-down a');
      if (mobileLinks.length > 0) {
        fireEvent.click(mobileLinks[0]);
      }
      
      await waitFor(() => {
        const mobileMenu = document.querySelector('.animate-slide-down');
        expect(mobileMenu).not.toBeInTheDocument();
      });
    });
  });

  describe('Estilos', () => {
    it('tiene estilos de navegación sticky', () => {
      render(<Navbar />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('sticky', 'top-0');
    });

    it('tiene backdrop blur para efecto glassmorphism', () => {
      render(<Navbar />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('backdrop-blur-md');
    });

    it('tiene z-index adecuado', () => {
      render(<Navbar />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('z-40');
    });
  });

  describe('Accesibilidad', () => {
    it('botón de tema tiene aria-label descriptivo', () => {
      render(<Navbar />);
      const themeButton = screen.getByRole('button', { name: /switch to/i });
      expect(themeButton).toHaveAttribute('aria-label');
    });

    it('botón de menú tiene aria-label', () => {
      render(<Navbar />);
      const menuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
    });
  });
});



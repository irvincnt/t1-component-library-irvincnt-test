import { render, screen } from '@testing-library/react';
import { DesignTokensSection } from '../../../components/home/DesignTokensSection';

describe('DesignTokensSection Component', () => {
  describe('Renderizado Principal', () => {
    it('renderiza el título principal correctamente', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Design Tokens')).toBeInTheDocument();
    });

    it('renderiza como section', () => {
      render(<DesignTokensSection />);
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('aplica animación con delay de 500ms', () => {
      render(<DesignTokensSection />);
      const section = document.querySelector('section');
      expect(section).toHaveStyle({ animationDelay: '500ms' });
    });
  });

  describe('ColorsCard', () => {
    it('renderiza la tarjeta de Colores', () => {
      render(<DesignTokensSection />);
      const colorElements = screen.getAllByText('Colores');
      expect(colorElements.length).toBeGreaterThan(0);
    });

    it('renderiza descripción de colores', () => {
      render(<DesignTokensSection />);
      expect(
        screen.getByText('Paleta de colores del sistema con soporte para light/dark mode')
      ).toBeInTheDocument();
    });

    it('renderiza sección Primary', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Primary')).toBeInTheDocument();
    });

    it('renderiza sección Semánticos', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Semánticos')).toBeInTheDocument();
    });

    it('renderiza sección Neutrales', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Neutrales')).toBeInTheDocument();
    });

    it('renderiza colores primary', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('primary')).toBeInTheDocument();
      expect(screen.getByText('primary-hover')).toBeInTheDocument();
    });

    it('renderiza colores semánticos', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('accent')).toBeInTheDocument();
      expect(screen.getByText('success')).toBeInTheDocument();
      expect(screen.getByText('warning')).toBeInTheDocument();
      expect(screen.getByText('destructive')).toBeInTheDocument();
    });

    it('renderiza colores neutrales', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('background')).toBeInTheDocument();
      expect(screen.getByText('card')).toBeInTheDocument();
      expect(screen.getByText('muted')).toBeInTheDocument();
      expect(screen.getByText('secondary')).toBeInTheDocument();
      expect(screen.getByText('foreground')).toBeInTheDocument();
    });

    it('muestra valores hex de colores', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('#4f46e5')).toBeInTheDocument();
      expect(screen.getByText('#4338ca')).toBeInTheDocument();
    });
  });

  describe('BorderRadiusCard', () => {
    it('renderiza la tarjeta de Border Radius', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Border Radius')).toBeInTheDocument();
    });

    it('renderiza descripción de border radius', () => {
      render(<DesignTokensSection />);
      expect(
        screen.getByText('Valores de radio para esquinas redondeadas')
      ).toBeInTheDocument();
    });

    it('renderiza todos los tamaños de radius', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('sm')).toBeInTheDocument();
      expect(screen.getAllByText('md').length).toBeGreaterThan(0);
      expect(screen.getAllByText('lg').length).toBeGreaterThan(0);
      expect(screen.getByText('xl')).toBeInTheDocument();
      expect(screen.getByText('full')).toBeInTheDocument();
    });

    it('muestra valores de radius', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('0.375rem')).toBeInTheDocument();
      expect(screen.getByText('0.5rem')).toBeInTheDocument();
      expect(screen.getByText('0.75rem')).toBeInTheDocument();
      expect(screen.getByText('1rem')).toBeInTheDocument();
      expect(screen.getByText('9999px')).toBeInTheDocument();
    });
  });

  describe('ShadowsCard', () => {
    it('renderiza la tarjeta de Sombras', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Sombras')).toBeInTheDocument();
    });

    it('renderiza descripción de sombras', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Niveles de elevación y profundidad')).toBeInTheDocument();
    });

    it('renderiza nombres de sombras', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('shadow-sm')).toBeInTheDocument();
      expect(screen.getByText('shadow-md')).toBeInTheDocument();
      expect(screen.getByText('shadow-lg')).toBeInTheDocument();
      expect(screen.getByText('shadow-xl')).toBeInTheDocument();
    });

    it('renderiza labels de sombras', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Sutil')).toBeInTheDocument();
      expect(screen.getByText('Medio')).toBeInTheDocument();
      expect(screen.getByText('Grande')).toBeInTheDocument();
      expect(screen.getByText('Extra grande')).toBeInTheDocument();
    });
  });

  describe('TransitionsCard', () => {
    it('renderiza la tarjeta de Transiciones', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Transiciones')).toBeInTheDocument();
    });

    it('renderiza descripción de transiciones', () => {
      render(<DesignTokensSection />);
      expect(
        screen.getByText('Duraciones para animaciones y transiciones')
      ).toBeInTheDocument();
    });

    it('renderiza nombres de transiciones', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Fast')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
      expect(screen.getByText('Slow')).toBeInTheDocument();
    });

    it('renderiza duraciones de transiciones', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('150ms')).toBeInTheDocument();
      expect(screen.getByText('200ms')).toBeInTheDocument();
      expect(screen.getByText('300ms')).toBeInTheDocument();
    });

    it('renderiza descripciones de uso', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Hover, focus, estados rápidos')).toBeInTheDocument();
      expect(screen.getByText('Transiciones estándar')).toBeInTheDocument();
      expect(
        screen.getByText('Animaciones, modales, page transitions')
      ).toBeInTheDocument();
    });
  });

  describe('TypographyCard', () => {
    it('renderiza la tarjeta de Tipografía', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Tipografía')).toBeInTheDocument();
    });

    it('renderiza descripción de tipografía', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Fuentes y estilos de texto')).toBeInTheDocument();
    });

    it('renderiza ejemplos de tipografía', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
      expect(screen.getByText('Heading 2')).toBeInTheDocument();
      expect(screen.getByText('Heading 3')).toBeInTheDocument();
      expect(screen.getByText('Body text')).toBeInTheDocument();
      expect(screen.getByText('Muted text')).toBeInTheDocument();
      expect(screen.getByText('Monospace')).toBeInTheDocument();
    });

    it('renderiza códigos de tipografía', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('text-4xl / font-bold')).toBeInTheDocument();
      expect(screen.getByText('text-2xl / font-bold')).toBeInTheDocument();
      expect(screen.getByText('text-base')).toBeInTheDocument();
    });
  });

  describe('CssVariablesCard', () => {
    it('renderiza la tarjeta de Variables CSS', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Variables CSS')).toBeInTheDocument();
    });

    it('renderiza descripción de variables CSS', () => {
      render(<DesignTokensSection />);
      expect(
        screen.getByText('Referencia rápida de tokens disponibles')
      ).toBeInTheDocument();
    });

    it('renderiza sección de Colores en variables', () => {
      render(<DesignTokensSection />);
      const colorTexts = screen.getAllByText('Colores');
      expect(colorTexts.length).toBe(2);
    });

    it('renderiza sección de Espaciado y Efectos', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText('Espaciado y Efectos')).toBeInTheDocument();
    });

    it('muestra código de variables de colores', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText(/--background/)).toBeInTheDocument();
      expect(screen.getByText(/--foreground/)).toBeInTheDocument();
    });

    it('muestra código de variables de radius', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText(/--radius-sm: 0.375rem/)).toBeInTheDocument();
      expect(screen.getByText(/--radius-md: 0.5rem/)).toBeInTheDocument();
    });

    it('muestra código de variables de transiciones', () => {
      render(<DesignTokensSection />);
      expect(screen.getByText(/--transition-fast: 150ms/)).toBeInTheDocument();
      expect(screen.getByText(/--transition-normal: 200ms/)).toBeInTheDocument();
      expect(screen.getByText(/--transition-slow: 300ms/)).toBeInTheDocument();
    });
  });
});


import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeaderSection } from '../../../components/home/HeaderSection';

describe('HeaderSection Component', () => {
  describe('Renderizado', () => {
    it('renderiza el título correctamente', () => {
      render(<HeaderSection />);
      expect(screen.getByText('Galería de Componentes')).toBeInTheDocument();
    });

    it('renderiza la descripción correctamente', () => {
      render(<HeaderSection />);
      expect(
        screen.getByText(
          'Explora nuestra biblioteca de componentes UI. Interactúa con cada uno para ver las estadísticas en tiempo real.'
        )
      ).toBeInTheDocument();
    });

    it('renderiza como elemento header', () => {
      render(<HeaderSection />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('aplica clase de animación', () => {
      render(<HeaderSection />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('animate-slide-up');
    });

    it('renderiza título en h1', () => {
      render(<HeaderSection />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Galería de Componentes');
    });

    it('aplica estilos responsivos al título', () => {
      render(<HeaderSection />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'font-bold');
    });

    it('aplica estilos al párrafo descriptivo', () => {
      render(<HeaderSection />);
      const paragraph = screen.getByText(/Explora nuestra biblioteca/);
      expect(paragraph).toHaveClass('text-muted-foreground', 'mt-2');
    });
  });
});


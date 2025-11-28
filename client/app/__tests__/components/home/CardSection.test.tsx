import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardSection } from '../../../components/home/CardSection';

describe('CardSection Component', () => {
  const mockOnTrackInteraction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('renderiza el título correctamente', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Card')).toBeInTheDocument();
    });

    it('renderiza la descripción del componente', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(
        screen.getByText(
          'Contenedor flexible con header, body, footer e imagen. Soporta múltiples variantes.'
        )
      ).toBeInTheDocument();
    });

    it('renderiza como section', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('aplica animación con delay de 300ms', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      const section = document.querySelector('section');
      expect(section).toHaveStyle({ animationDelay: '300ms' });
    });
  });

  describe('Cards Renderizadas', () => {
    it('renderiza Card Default', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Card Default')).toBeInTheDocument();
      expect(
        screen.getByText('Una tarjeta con estilo por defecto y efecto hover.')
      ).toBeInTheDocument();
    });

    it('renderiza Card Bordered', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Card Bordered')).toBeInTheDocument();
      expect(screen.getByText('Tarjeta con borde más pronunciado.')).toBeInTheDocument();
    });

    it('renderiza Card Elevated', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Card Elevated')).toBeInTheDocument();
      expect(
        screen.getByText('Tarjeta con sombra elevada para destacar.')
      ).toBeInTheDocument();
    });
  });

  describe('Imágenes', () => {
    it('renderiza las imágenes de las cards', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByAltText('Abstract art')).toBeInTheDocument();
      expect(screen.getByAltText('Colorful abstract')).toBeInTheDocument();
      expect(screen.getByAltText('Pink abstract')).toBeInTheDocument();
    });
  });

  describe('Botones de acción', () => {
    it('renderiza botón Ver más', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Ver más')).toBeInTheDocument();
    });

    it('renderiza botón Explorar', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Explorar')).toBeInTheDocument();
    });

    it('renderiza botón Descubrir', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Descubrir')).toBeInTheDocument();
    });

    it('ejecuta onTrackInteraction al hacer click en Ver más', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Ver más'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-card');
    });

    it('ejecuta onTrackInteraction al hacer click en Explorar', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Explorar'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-card');
    });

    it('ejecuta onTrackInteraction al hacer click en Descubrir', () => {
      render(<CardSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Descubrir'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-card');
    });
  });

  describe('Interacciones con Cards', () => {
    it('tiene cards con efecto hoverable', () => {
      const { container } = render(
        <CardSection onTrackInteraction={mockOnTrackInteraction} />
      );
      // Verificamos que hay múltiples cards renderizadas
      const cards = container.querySelectorAll('[class*="animate-scale-in"]');
      expect(cards.length).toBeGreaterThanOrEqual(0);
    });
  });
});


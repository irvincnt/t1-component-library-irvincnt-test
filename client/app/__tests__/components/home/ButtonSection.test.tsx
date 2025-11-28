import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonSection } from '../../../components/home/ButtonSection';

describe('ButtonSection Component', () => {
  const mockOnTrackInteraction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('renderiza el título correctamente', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('renderiza la descripción del componente', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(
        screen.getByText('Botón interactivo con diferentes variantes, tamaños y estados.')
      ).toBeInTheDocument();
    });

    it('renderiza como section', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('aplica animación con delay', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      const section = document.querySelector('section');
      expect(section).toHaveStyle({ animationDelay: '100ms' });
    });
  });

  describe('Variantes de Button', () => {
    it('renderiza todas las variantes de botón', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
      expect(screen.getByText('Accent')).toBeInTheDocument();
      expect(screen.getByText('Destructive')).toBeInTheDocument();
      expect(screen.getByText('Ghost')).toBeInTheDocument();
      expect(screen.getByText('Outline')).toBeInTheDocument();
    });

    it('ejecuta onTrackInteraction al hacer click en variante primary', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Primary'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-primary');
    });

    it('ejecuta onTrackInteraction al hacer click en variante secondary', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Secondary'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-secondary');
    });

    it('ejecuta onTrackInteraction al hacer click en variante accent', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Accent'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-accent');
    });

    it('ejecuta onTrackInteraction al hacer click en variante destructive', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Destructive'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-destructive');
    });

    it('ejecuta onTrackInteraction al hacer click en variante ghost', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Ghost'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-ghost');
    });

    it('ejecuta onTrackInteraction al hacer click en variante outline', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Outline'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-outline');
    });
  });

  describe('Tamaños de Button', () => {
    it('renderiza todos los tamaños', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Size SM')).toBeInTheDocument();
      expect(screen.getByText('Size MD')).toBeInTheDocument();
      expect(screen.getByText('Size LG')).toBeInTheDocument();
    });

    it('ejecuta onTrackInteraction con tamaño sm', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Size SM'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-sm');
    });

    it('ejecuta onTrackInteraction con tamaño md', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Size MD'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-md');
    });

    it('ejecuta onTrackInteraction con tamaño lg', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Size LG'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-lg');
    });
  });

  describe('Estados de Button', () => {
    it('renderiza botón Normal', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    it('renderiza botón Loading', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renderiza botón Disabled', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('renderiza botón con ícono', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Con ícono')).toBeInTheDocument();
    });

    it('ejecuta onTrackInteraction al hacer click en Normal', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Normal'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-normal');
    });

    it('ejecuta onTrackInteraction al hacer click en botón con ícono', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      fireEvent.click(screen.getByText('Con ícono'));
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-icon');
    });
  });

  describe('Secciones', () => {
    it('muestra título de sección Variantes', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Variantes')).toBeInTheDocument();
    });

    it('muestra título de sección Tamaños', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Tamaños')).toBeInTheDocument();
    });

    it('muestra título de sección Estados', () => {
      render(<ButtonSection onTrackInteraction={mockOnTrackInteraction} />);
      expect(screen.getByText('Estados')).toBeInTheDocument();
    });
  });
});


import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalSection } from '../../../components/home/ModalSection';

describe('ModalSection Component', () => {
  const mockOnTrackInteraction = jest.fn();
  const mockOnModalSizeChange = jest.fn();

  const defaultProps = {
    modalSize: null as 'sm' | 'md' | 'lg' | null,
    onModalSizeChange: mockOnModalSizeChange,
    onTrackInteraction: mockOnTrackInteraction,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('renderiza el título correctamente', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('Modal')).toBeInTheDocument();
    });

    it('renderiza la descripción del componente', () => {
      render(<ModalSection {...defaultProps} />);
      expect(
        screen.getByText(
          'Diálogo modal con soporte para header, body y footer. Cierra con ESC o click afuera.'
        )
      ).toBeInTheDocument();
    });

    it('renderiza como section', () => {
      render(<ModalSection {...defaultProps} />);
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('aplica animación con delay de 400ms', () => {
      render(<ModalSection {...defaultProps} />);
      const section = document.querySelector('section');
      expect(section).toHaveStyle({ animationDelay: '400ms' });
    });
  });

  describe('Botones de Tamaño', () => {
    it('renderiza botón Small (sm)', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('Small (sm)')).toBeInTheDocument();
    });

    it('renderiza botón Medium (md)', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('Medium (md)')).toBeInTheDocument();
    });

    it('renderiza botón Large (lg)', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('Large (lg)')).toBeInTheDocument();
    });

    it('abre modal sm al hacer click en Small', async () => {
      render(<ModalSection {...defaultProps} />);
      
      await userEvent.click(screen.getByText('Small (sm)'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith('sm');
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Modal', 'open-sm');
    });

    it('abre modal md al hacer click en Medium', async () => {
      render(<ModalSection {...defaultProps} />);
      
      await userEvent.click(screen.getByText('Medium (md)'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith('md');
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Modal', 'open-md');
    });

    it('abre modal lg al hacer click en Large', async () => {
      render(<ModalSection {...defaultProps} />);
      
      await userEvent.click(screen.getByText('Large (lg)'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith('lg');
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Modal', 'open-lg');
    });
  });

  describe('Referencia de Tamaños', () => {
    it('muestra referencia de tamaño sm', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('max-w-sm (384px)')).toBeInTheDocument();
    });

    it('muestra referencia de tamaño md', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('max-w-md (448px)')).toBeInTheDocument();
    });

    it('muestra referencia de tamaño lg', () => {
      render(<ModalSection {...defaultProps} />);
      expect(screen.getByText('max-w-lg (512px)')).toBeInTheDocument();
    });
  });

  describe('Modal Small', () => {
    it('renderiza Modal Small cuando modalSize es sm', () => {
      render(<ModalSection {...defaultProps} modalSize="sm" />);
      expect(screen.getByText('Modal Small')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Este es un modal pequeño, ideal para confirmaciones rápidas o mensajes cortos.'
        )
      ).toBeInTheDocument();
    });

    it('cierra modal sm al hacer click en Cancelar', async () => {
      render(<ModalSection {...defaultProps} modalSize="sm" />);
      
      await userEvent.click(screen.getByText('Cancelar'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null);
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-cancel-sm');
    });

    it('cierra modal sm al hacer click en Aceptar', async () => {
      render(<ModalSection {...defaultProps} modalSize="sm" />);
      
      await userEvent.click(screen.getByText('Aceptar'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null);
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-confirm-sm');
    });
  });

  describe('Modal Medium', () => {
    it('renderiza Modal Medium cuando modalSize es md', () => {
      render(<ModalSection {...defaultProps} modalSize="md" />);
      expect(screen.getByText('Modal Medium')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Este es un modal de tamaño medio, perfecto para formularios simples o contenido moderado.'
        )
      ).toBeInTheDocument();
    });

    it('renderiza input de ejemplo en modal md', () => {
      render(<ModalSection {...defaultProps} modalSize="md" />);
      expect(screen.getByText('Campo de ejemplo')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Escribe algo aquí...')).toBeInTheDocument();
    });

    it('ejecuta onTrackInteraction al enfocar input en modal md', () => {
      render(<ModalSection {...defaultProps} modalSize="md" />);
      const input = screen.getByPlaceholderText('Escribe algo aquí...');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus-modal-md');
    });

    it('ejecuta onTrackInteraction al escribir en input de modal md', async () => {
      render(<ModalSection {...defaultProps} modalSize="md" />);
      const input = screen.getByPlaceholderText('Escribe algo aquí...');
      
      await userEvent.type(input, 'test');
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'change-modal-md');
    });

    it('cierra modal md al hacer click en Cancelar', async () => {
      render(<ModalSection {...defaultProps} modalSize="md" />);
      
      const cancelButtons = screen.getAllByText('Cancelar');
      await userEvent.click(cancelButtons[0]);
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null); 
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-cancel-md');
    });

    it('cierra modal md al hacer click en Confirmar', async () => {
      render(<ModalSection {...defaultProps} modalSize="md" />);
      
      await userEvent.click(screen.getByText('Confirmar'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null);
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-confirm-md');
    });
  });

  describe('Modal Large', () => {
    it('renderiza Modal Large cuando modalSize es lg', () => {
      render(<ModalSection {...defaultProps} modalSize="lg" />);
      expect(screen.getByText('Modal Large')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Este es un modal grande, ideal para formularios complejos, tablas de datos o contenido extenso que requiere más espacio.'
        )
      ).toBeInTheDocument();
    });

    it('renderiza formulario completo en modal lg', () => {
      render(<ModalSection {...defaultProps} modalSize="lg" />);
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Apellido')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Mensaje')).toBeInTheDocument();
    });

    it('renderiza inputs del formulario en modal lg', () => {
      render(<ModalSection {...defaultProps} modalSize="lg" />);
      expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tu apellido')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Escribe tu mensaje...')).toBeInTheDocument();
    });

    it('ejecuta onTrackInteraction al enfocar input en modal lg', () => {
      render(<ModalSection {...defaultProps} modalSize="lg" />);
      const input = screen.getByPlaceholderText('Tu nombre');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus-modal-lg');
    });

    it('cierra modal lg al hacer click en Cancelar', async () => {
      render(<ModalSection {...defaultProps} modalSize="lg" />);
      
      const cancelButtons = screen.getAllByText('Cancelar');
      await userEvent.click(cancelButtons[0]);
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null);
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-cancel-lg');
    });

    it('cierra modal lg al hacer click en Enviar', async () => {
      render(<ModalSection {...defaultProps} modalSize="lg" />);
      
      await userEvent.click(screen.getByText('Enviar'));
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null);
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Button', 'click-confirm-lg');
    });
  });

  describe('Función closeModal', () => {
    it('cierra modal y trackea interacción', async () => {
      render(<ModalSection {...defaultProps} modalSize="sm" />);
      
      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);
      
      expect(mockOnModalSizeChange).toHaveBeenCalledWith(null);
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Modal', 'close-sm');
    });
  });
});


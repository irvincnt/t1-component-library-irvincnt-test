import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputSection } from '../../../components/home/InputSection';

describe('InputSection Component', () => {
  const mockOnTrackInteraction = jest.fn();
  const mockOnInputChange = jest.fn();

  const defaultProps = {
    inputValue: '',
    onInputChange: mockOnInputChange,
    onTrackInteraction: mockOnTrackInteraction,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('renderiza el título correctamente', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Input')).toBeInTheDocument();
    });

    it('renderiza la descripción del componente', () => {
      render(<InputSection {...defaultProps} />);
      expect(
        screen.getByText(
          'Campo de entrada de texto con soporte para labels, errores, iconos y diferentes estados.'
        )
      ).toBeInTheDocument();
    });

    it('renderiza como section', () => {
      render(<InputSection {...defaultProps} />);
      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('aplica animación con delay de 200ms', () => {
      render(<InputSection {...defaultProps} />);
      const section = document.querySelector('section');
      expect(section).toHaveStyle({ animationDelay: '200ms' });
    });
  });

  describe('Inputs Renderizados', () => {
    it('renderiza input de Estado Normal', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Estado Normal')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Escribe algo...')).toBeInTheDocument();
    });

    it('renderiza input Con ícono', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Con ícono')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
    });

    it('renderiza input Con error', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Con error')).toBeInTheDocument();
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    it('renderiza input Deshabilitado', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Deshabilitado')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('No disponible')).toBeDisabled();
    });

    it('renderiza input Con helper text', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Con helper text')).toBeInTheDocument();
      expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument();
    });

    it('renderiza input Tamaño grande', () => {
      render(<InputSection {...defaultProps} />);
      expect(screen.getByText('Tamaño grande')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Input grande')).toBeInTheDocument();
    });
  });

  describe('Interacciones - Input Normal', () => {
    it('llama onInputChange cuando se escribe en el input normal', async () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe algo...');
      
      await userEvent.type(input, 'a');
      
      expect(mockOnInputChange).toHaveBeenCalled();
    });

    it('llama onTrackInteraction con change al escribir', async () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe algo...');
      
      await userEvent.type(input, 'test');
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'change');
    });

    it('llama onTrackInteraction con focus al enfocar input normal', () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe algo...');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus');
    });
  });

  describe('Interacciones - Input con Ícono', () => {
    it('llama onTrackInteraction con focus-icon al enfocar', () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Buscar...');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus-icon');
    });
  });

  describe('Interacciones - Input con Error', () => {
    it('llama onTrackInteraction con focus-error al enfocar', () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Email inválido');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus-error');
    });
  });

  describe('Interacciones - Input con Helper Text', () => {
    it('llama onTrackInteraction con focus-helper al enfocar', () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Contraseña');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus-helper');
    });

    it('renderiza input como type password', () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Contraseña');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Interacciones - Input Tamaño Grande', () => {
    it('llama onTrackInteraction con focus-lg al enfocar', () => {
      render(<InputSection {...defaultProps} />);
      const input = screen.getByPlaceholderText('Input grande');
      
      fireEvent.focus(input);
      
      expect(mockOnTrackInteraction).toHaveBeenCalledWith('Input', 'focus-lg');
    });
  });

  describe('Props inputValue', () => {
    it('muestra el valor del input controlado', () => {
      render(<InputSection {...defaultProps} inputValue="valor inicial" />);
      const input = screen.getByPlaceholderText('Escribe algo...');
      expect(input).toHaveValue('valor inicial');
    });
  });
});


import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../components/Input';

describe('Input Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renderiza con displayName correcto', () => {
      expect(Input.displayName).toBe('Input');
    });

    it('renderiza con id generado automáticamente', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
    });

    it('usa id proporcionado cuando se pasa como prop', () => {
      render(<Input id="custom-id" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Props - Label', () => {
    it('renderiza label correctamente', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('asocia label con input mediante htmlFor', () => {
      render(<Input label="Username" id="username-input" />);
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username-input');
    });

    it('no renderiza label cuando no se proporciona', () => {
      const { container } = render(<Input />);
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });
  });

  describe('Props - Tamaños', () => {
    it('aplica tamaño md por defecto', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-2.5', 'text-base');
    });

    it('aplica tamaño sm correctamente', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('aplica tamaño lg correctamente', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-5', 'py-3.5', 'text-lg');
    });
  });

  describe('Props - Error', () => {
    it('muestra mensaje de error', () => {
      render(<Input error="Este campo es requerido" />);
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    it('aplica estilos de error al input', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
    });

    it('aplica estilos de error al label', () => {
      render(<Input label="Email" error="Error" />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-destructive');
    });

    it('muestra error en color destructive', () => {
      render(<Input error="Error message" />);
      const errorMessage = screen.getByText('Error message');
      expect(errorMessage).toHaveClass('text-destructive');
    });
  });

  describe('Props - Helper Text', () => {
    it('muestra helperText correctamente', () => {
      render(<Input helperText="Ingresa tu email" />);
      expect(screen.getByText('Ingresa tu email')).toBeInTheDocument();
    });

    it('muestra helperText en color muted', () => {
      render(<Input helperText="Hint text" />);
      const helper = screen.getByText('Hint text');
      expect(helper).toHaveClass('text-muted-foreground');
    });

    it('prioriza error sobre helperText', () => {
      render(<Input error="Error" helperText="Helper" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('Props - Iconos', () => {
    it('renderiza leftIcon correctamente', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renderiza rightIcon correctamente', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('aplica padding adicional cuando hay leftIcon', () => {
      render(<Input leftIcon={<span>Icon</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-11');
    });

    it('aplica padding adicional cuando hay rightIcon', () => {
      render(<Input rightIcon={<span>Icon</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-11');
    });
  });

  describe('Interacciones', () => {
    it('permite escribir texto', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await userEvent.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('ejecuta onChange cuando se escribe', async () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      await userEvent.type(screen.getByRole('textbox'), 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('ejecuta onFocus cuando recibe focus', async () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      
      await userEvent.click(screen.getByRole('textbox'));
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('ejecuta onBlur cuando pierde focus', async () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.click(input);
      await userEvent.tab();
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estado Focus', () => {
    it('cambia estilo de label al enfocar', async () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');
      
      await userEvent.click(input);
      
      expect(label).toHaveClass('text-primary');
    });

    it('aplica estilos de focus al input', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      act(() => {
        fireEvent.focus(input);
      });
      
      expect(input).toHaveClass('transition-all');
    });

    it('remueve estilo de label al perder focus', async () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');
      
      await userEvent.click(input);
      expect(label).toHaveClass('text-primary');
      
      await userEvent.tab();
      expect(label).not.toHaveClass('text-primary');
      expect(label).toHaveClass('text-foreground');
    });

    it('setIsFocused se establece a false en blur', async () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test');
      
      act(() => {
        fireEvent.focus(input);
      });
      expect(label).toHaveClass('text-primary');
      
      act(() => {
        fireEvent.blur(input);
      });
      expect(label).toHaveClass('text-foreground');
    });

    it('leftIcon cambia color al enfocar', async () => {
      render(<Input leftIcon={<span data-testid="icon">🔍</span>} />);
      const input = screen.getByRole('textbox');
      const iconContainer = screen.getByTestId('icon').parentElement;
      
      act(() => {
        fireEvent.focus(input);
      });
      
      expect(iconContainer).toHaveClass('text-primary');
    });

    it('leftIcon vuelve a color muted al perder focus', async () => {
      render(<Input leftIcon={<span data-testid="icon">🔍</span>} />);
      const input = screen.getByRole('textbox');
      const iconContainer = screen.getByTestId('icon').parentElement;
      
      act(() => {
        fireEvent.focus(input);
      });
      expect(iconContainer).toHaveClass('text-primary');
      
      act(() => {
        fireEvent.blur(input);
      });
      expect(iconContainer).not.toHaveClass('text-primary');
    });

    it('rightIcon cambia color al enfocar', async () => {
      render(<Input rightIcon={<span data-testid="icon">✓</span>} />);
      const input = screen.getByRole('textbox');
      const iconContainer = screen.getByTestId('icon').parentElement;
      
      act(() => {
        fireEvent.focus(input);
      });
      
      expect(iconContainer).toHaveClass('text-primary');
    });

    it('rightIcon vuelve a color muted al perder focus', async () => {
      render(<Input rightIcon={<span data-testid="icon">✓</span>} />);
      const input = screen.getByRole('textbox');
      const iconContainer = screen.getByTestId('icon').parentElement;
      
      act(() => {
        fireEvent.focus(input);
      });
      
      act(() => {
        fireEvent.blur(input);
      });
      expect(iconContainer).not.toHaveClass('text-primary');
    });
  });

  describe('Estado Disabled', () => {
    it('está deshabilitado cuando disabled es true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('aplica estilos de disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('no permite interacción cuando está disabled', async () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);
      
      await userEvent.type(screen.getByRole('textbox'), 'test');
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom className', () => {
    it('aplica className adicional al input', () => {
      render(<Input className="custom-input" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente al elemento input', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('permite enfocar mediante ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      
      act(() => {
        ref.current?.focus();
      });
      
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe('Props HTML adicionales', () => {
    it('pasa type correctamente', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('pasa placeholder correctamente', () => {
      render(<Input placeholder="Enter your email" />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('pasa required correctamente', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('pasa maxLength correctamente', () => {
      render(<Input maxLength={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });
  });
});



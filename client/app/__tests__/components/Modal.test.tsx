import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('renderiza correctamente cuando isOpen es true', () => {
      render(
        <Modal {...defaultProps}>
          <div>Modal Content</div>
        </Modal>
      );
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('no renderiza cuando isOpen es false', () => {
      render(
        <Modal isOpen={false} onClose={jest.fn()}>
          <div>Modal Content</div>
        </Modal>
      );
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('renderiza con displayName correcto', () => {
      expect(Modal.displayName).toBe('Modal');
    });

    it('renderiza con role="dialog"', () => {
      render(
        <Modal {...defaultProps}>
          <div>Content</div>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('tiene aria-modal="true"', () => {
      render(
        <Modal {...defaultProps}>
          <div>Content</div>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Props - Tamaños', () => {
    it('aplica tamaño md por defecto', () => {
      render(
        <Modal {...defaultProps}>
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      const modalContent = screen.getByTestId('modal-content').parentElement;
      expect(modalContent).toHaveClass('max-w-md');
    });

    it('aplica tamaño sm correctamente', () => {
      render(
        <Modal {...defaultProps} size="sm">
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      const modalContent = screen.getByTestId('modal-content').parentElement;
      expect(modalContent).toHaveClass('max-w-sm');
    });

    it('aplica tamaño lg correctamente', () => {
      render(
        <Modal {...defaultProps} size="lg">
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      const modalContent = screen.getByTestId('modal-content').parentElement;
      expect(modalContent).toHaveClass('max-w-lg');
    });

    it('aplica tamaño xl correctamente', () => {
      render(
        <Modal {...defaultProps} size="xl">
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      const modalContent = screen.getByTestId('modal-content').parentElement;
      expect(modalContent).toHaveClass('max-w-xl');
    });

    it('aplica tamaño full correctamente', () => {
      render(
        <Modal {...defaultProps} size="full">
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      const modalContent = screen.getByTestId('modal-content').parentElement;
      expect(modalContent).toHaveClass('max-w-[90vw]');
    });
  });

  describe('Interacciones - Cerrar con Overlay', () => {
    it('cierra al hacer click en el overlay por defecto', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      
      const overlay = document.querySelector('.animate-fade-in');
      if (overlay) {
        fireEvent.click(overlay);
      }
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('no cierra al hacer click en el overlay cuando closeOnOverlayClick es false', () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      
      const overlay = document.querySelector('.animate-fade-in');
      if (overlay) {
        fireEvent.click(overlay);
      }
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('no cierra al hacer click en el contenido del modal', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      
      fireEvent.click(screen.getByTestId('modal-content'));
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Interacciones - Cerrar con Escape', () => {
    it('cierra al presionar Escape por defecto', () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <div>Content</div>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('no cierra al presionar Escape cuando closeOnEsc es false', () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} closeOnEsc={false}>
          <div>Content</div>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('bloquea scroll del body cuando está abierto', () => {
      render(
        <Modal {...defaultProps}>
          <div>Content</div>
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restaura scroll del body cuando se cierra', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>Content</div>
        </Modal>
      );
      
      rerender(
        <Modal isOpen={false} onClose={jest.fn()}>
          <div>Content</div>
        </Modal>
      );
      
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Custom className', () => {
    it('aplica className adicional al modal', () => {
      render(
        <Modal {...defaultProps} className="custom-modal">
          <div data-testid="modal-content">Content</div>
        </Modal>
      );
      const modalContent = screen.getByTestId('modal-content').parentElement;
      expect(modalContent).toHaveClass('custom-modal');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente al elemento del modal', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Modal {...defaultProps} ref={ref}>
          <div>Content</div>
        </Modal>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('ModalHeader Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<ModalHeader>Header Title</ModalHeader>);
      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });

    it('renderiza con displayName correcto', () => {
      expect(ModalHeader.displayName).toBe('ModalHeader');
    });

    it('aplica estilos de layout correctos', () => {
      render(<ModalHeader data-testid="header">Header</ModalHeader>);
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('renderiza título en h3', () => {
      render(<ModalHeader>Title</ModalHeader>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Title');
    });
  });

  describe('Props - Close Button', () => {
    it('muestra botón de cerrar por defecto cuando onClose está presente', () => {
      render(<ModalHeader onClose={jest.fn()}>Header</ModalHeader>);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('no muestra botón de cerrar cuando showCloseButton es false', () => {
      render(<ModalHeader onClose={jest.fn()} showCloseButton={false}>Header</ModalHeader>);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('no muestra botón de cerrar cuando onClose no está presente', () => {
      render(<ModalHeader>Header</ModalHeader>);
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('ejecuta onClose al hacer click en el botón de cerrar', async () => {
      const onClose = jest.fn();
      render(<ModalHeader onClose={onClose}>Header</ModalHeader>);
      
      await userEvent.click(screen.getByLabelText('Close modal'));
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<ModalHeader data-testid="header" className="custom-header">Header</ModalHeader>);
      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ModalHeader ref={ref}>Header</ModalHeader>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('ModalBody Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<ModalBody>Body Content</ModalBody>);
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('renderiza con displayName correcto', () => {
      expect(ModalBody.displayName).toBe('ModalBody');
    });

    it('aplica estilos de padding y overflow', () => {
      render(<ModalBody data-testid="body">Body</ModalBody>);
      const body = screen.getByTestId('body');
      expect(body).toHaveClass('px-6', 'py-5', 'max-h-[60vh]', 'overflow-y-auto');
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<ModalBody data-testid="body" className="custom-body">Body</ModalBody>);
      expect(screen.getByTestId('body')).toHaveClass('custom-body');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ModalBody ref={ref}>Body</ModalBody>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('ModalFooter Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<ModalFooter>Footer Content</ModalFooter>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('renderiza con displayName correcto', () => {
      expect(ModalFooter.displayName).toBe('ModalFooter');
    });

    it('aplica estilos de layout correctos', () => {
      render(<ModalFooter data-testid="footer">Footer</ModalFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('flex', 'items-center', 'justify-end', 'gap-3');
    });

    it('aplica estilos de borde y background', () => {
      render(<ModalFooter data-testid="footer">Footer</ModalFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('border-t', 'border-border', 'bg-muted/30');
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<ModalFooter data-testid="footer" className="custom-footer">Footer</ModalFooter>);
      expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ModalFooter ref={ref}>Footer</ModalFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('Modal Composición Completa', () => {
  it('renderiza todos los subcomponentes juntos correctamente', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <ModalHeader onClose={onClose} data-testid="header">Modal Title</ModalHeader>
        <ModalBody data-testid="body">Modal body content goes here</ModalBody>
        <ModalFooter data-testid="footer">
          <button>Cancel</button>
          <button>Confirm</button>
        </ModalFooter>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toHaveTextContent('Modal body content goes here');
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });
});



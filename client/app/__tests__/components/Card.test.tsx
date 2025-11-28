import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardBody, CardFooter, CardImage } from '../../components/Card';

describe('Card Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente con children', () => {
      render(<Card data-testid="card">Card Content</Card>);
      expect(screen.getByTestId('card')).toHaveTextContent('Card Content');
    });

    it('renderiza con displayName correcto', () => {
      expect(Card.displayName).toBe('Card');
    });

    it('renderiza estructura compleja de children', () => {
      render(
        <Card data-testid="card">
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
        </Card>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });

  describe('Props - Variantes', () => {
    it('aplica variante default por defecto', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-card', 'border', 'border-border');
    });

    it('aplica variante bordered correctamente', () => {
      render(<Card data-testid="card" variant="bordered">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-2');
    });

    it('aplica variante elevated correctamente', () => {
      render(<Card data-testid="card" variant="elevated">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-lg');
    });
  });

  describe('Props - Padding', () => {
    it('no aplica padding por defecto (none)', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('p-3', 'p-5', 'p-7');
    });

    it('aplica padding sm correctamente', () => {
      render(<Card data-testid="card" padding="sm">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-3');
    });

    it('aplica padding md correctamente', () => {
      render(<Card data-testid="card" padding="md">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-5');
    });

    it('aplica padding lg correctamente', () => {
      render(<Card data-testid="card" padding="lg">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-7');
    });
  });

  describe('Props - Hoverable', () => {
    it('no aplica estilos hover por defecto', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('cursor-pointer');
    });

    it('aplica estilos hover cuando hoverable es true', () => {
      render(<Card data-testid="card" hoverable>Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('hover:shadow-xl', 'hover:-translate-y-1', 'cursor-pointer');
    });
  });

  describe('Interacciones', () => {
    it('ejecuta onClick cuando es hoverable y se hace click', async () => {
      const handleClick = jest.fn();
      render(<Card data-testid="card" hoverable onClick={handleClick}>Clickable</Card>);
      
      await userEvent.click(screen.getByTestId('card'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom className', () => {
    it('aplica className adicional correctamente', () => {
      render(<Card data-testid="card" className="custom-class">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente al elemento div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card with ref</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardHeader Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<CardHeader data-testid="header">Header Content</CardHeader>);
      expect(screen.getByTestId('header')).toHaveTextContent('Header Content');
    });

    it('renderiza con displayName correcto', () => {
      expect(CardHeader.displayName).toBe('CardHeader');
    });

    it('aplica estilos de padding correctos', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      expect(screen.getByTestId('header')).toHaveClass('px-5', 'py-4');
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<CardHeader data-testid="header" className="custom-header">Header</CardHeader>);
      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Header</CardHeader>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardBody Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<CardBody data-testid="body">Body Content</CardBody>);
      expect(screen.getByTestId('body')).toHaveTextContent('Body Content');
    });

    it('renderiza con displayName correcto', () => {
      expect(CardBody.displayName).toBe('CardBody');
    });

    it('aplica estilos de padding correctos', () => {
      render(<CardBody data-testid="body">Body</CardBody>);
      expect(screen.getByTestId('body')).toHaveClass('px-5', 'py-4');
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<CardBody data-testid="body" className="custom-body">Body</CardBody>);
      expect(screen.getByTestId('body')).toHaveClass('custom-body');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardBody ref={ref}>Body</CardBody>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardFooter Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente', () => {
      render(<CardFooter data-testid="footer">Footer Content</CardFooter>);
      expect(screen.getByTestId('footer')).toHaveTextContent('Footer Content');
    });

    it('renderiza con displayName correcto', () => {
      expect(CardFooter.displayName).toBe('CardFooter');
    });

    it('aplica estilos de border y background', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('border-t', 'border-border', 'bg-muted/50');
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<CardFooter data-testid="footer" className="custom-footer">Footer</CardFooter>);
      expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardImage Component', () => {
  describe('Renderizado', () => {
    it('renderiza correctamente con src y alt', () => {
      render(<CardImage data-testid="image" src="/test.jpg" alt="Test image" />);
      const image = screen.getByTestId('image');
      expect(image).toHaveAttribute('src', '/test.jpg');
      expect(image).toHaveAttribute('alt', 'Test image');
    });

    it('renderiza con displayName correcto', () => {
      expect(CardImage.displayName).toBe('CardImage');
    });

    it('aplica estilos de tamaño y object-fit', () => {
      render(<CardImage data-testid="image" src="/test.jpg" alt="Test" />);
      const image = screen.getByTestId('image');
      expect(image).toHaveClass('w-full', 'h-48', 'object-cover');
    });
  });

  describe('Props', () => {
    it('aplica className adicional', () => {
      render(<CardImage data-testid="image" src="/test.jpg" alt="Test" className="custom-image" />);
      expect(screen.getByTestId('image')).toHaveClass('custom-image');
    });
  });

  describe('Ref Forwarding', () => {
    it('pasa ref correctamente', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(<CardImage ref={ref} src="/test.jpg" alt="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });
  });
});

describe('Card Composición Completa', () => {
  it('renderiza todos los subcomponentes juntos correctamente', () => {
    render(
      <Card data-testid="card">
        <CardImage src="/test.jpg" alt="Test" data-testid="card-image" />
        <CardHeader data-testid="card-header">Title</CardHeader>
        <CardBody data-testid="card-body">Body content</CardBody>
        <CardFooter data-testid="card-footer">Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-image')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toHaveTextContent('Title');
    expect(screen.getByTestId('card-body')).toHaveTextContent('Body content');
    expect(screen.getByTestId('card-footer')).toHaveTextContent('Footer actions');
  });
});



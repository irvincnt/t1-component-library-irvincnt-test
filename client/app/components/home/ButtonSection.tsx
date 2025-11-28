'use client';

import { ArrowRight } from 'lucide-react';
import { Button, Card, CardHeader, CardBody } from '../';

interface ButtonSectionProps {
  onTrackInteraction: (component: string, action: string) => void;
}

export function ButtonSection({ onTrackInteraction }: ButtonSectionProps) {
  return (
    <section className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Button
          </h2>
          <p className="text-muted-foreground mt-1">
            Botón interactivo con diferentes variantes, tamaños y estados.
          </p>
        </CardHeader>
        <CardBody>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Variantes</h3>
          <div className="flex flex-wrap gap-3">
            {(['primary', 'secondary', 'accent', 'destructive', 'ghost', 'outline'] as const).map(
              (variant) => (
                <Button
                  key={variant}
                  variant={variant}
                  onClick={() => onTrackInteraction('Button', `click-${variant}`)}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              )
            )}
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4 text-foreground">Tamaños</h3>
          <div className="flex flex-wrap items-center gap-3">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Button
                key={size}
                size={size}
                onClick={() => onTrackInteraction('Button', `click-${size}`)}
              >
                Size {size.toUpperCase()}
              </Button>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-4 text-foreground">Estados</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onTrackInteraction('Button', 'click-normal')}>Normal</Button>
            <Button isLoading onClick={() => onTrackInteraction('Button', 'click-loading')}>
              Loading
            </Button>
            <Button disabled onClick={() => onTrackInteraction('Button', 'click-disabled')}>
              Disabled
            </Button>
            <Button
              leftIcon={<ArrowRight size={16} />}
              onClick={() => onTrackInteraction('Button', 'click-icon')}
            >
              Con ícono
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}


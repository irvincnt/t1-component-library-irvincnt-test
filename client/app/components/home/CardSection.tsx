'use client';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
} from '../';

interface CardSectionProps {
  onTrackInteraction: (component: string, action: string) => void;
}

export function CardSection({ onTrackInteraction }: CardSectionProps) {
  return (
    <section className="space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-8 bg-success rounded-full" />
            Card
          </h2>
          <p className="text-muted-foreground mt-1">
            Contenedor flexible con header, body, footer e imagen. Soporta múltiples variantes.
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              variant="default"
              hoverable
              onClick={() => onTrackInteraction('Card', 'click-default')}
            >
              <CardImage
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
                alt="Abstract art"
              />
              <CardBody>
                <h3 className="text-lg font-semibold text-foreground">Card Default</h3>
                <p className="text-muted-foreground mt-2">
                  Una tarjeta con estilo por defecto y efecto hover.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="primary" onClick={() => onTrackInteraction('Button', 'click-card')}>
                  Ver más
                </Button>
              </CardFooter>
            </Card>

            <Card
              variant="bordered"
              hoverable
              onClick={() => onTrackInteraction('Card', 'click-bordered')}
            >
              <CardImage
                src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop"
                alt="Colorful abstract"
              />
              <CardBody>
                <h3 className="text-lg font-semibold text-foreground">Card Bordered</h3>
                <p className="text-muted-foreground mt-2">
                  Tarjeta con borde más pronunciado.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="secondary" onClick={() => onTrackInteraction('Button', 'click-card')}>
                  Explorar
                </Button>
              </CardFooter>
            </Card>

            <Card
              variant="elevated"
              hoverable
              onClick={() => onTrackInteraction('Card', 'click-elevated')}
            >
              <CardImage
                src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop"
                alt="Pink abstract"
              />
              <CardBody>
                <h3 className="text-lg font-semibold text-foreground">Card Elevated</h3>
                <p className="text-muted-foreground mt-2">
                  Tarjeta con sombra elevada para destacar.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="accent" onClick={() => onTrackInteraction('Button', 'click-card')}>
                  Descubrir
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}


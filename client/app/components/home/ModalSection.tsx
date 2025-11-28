'use client';

import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../';

interface ModalSectionProps {
  modalSize: 'sm' | 'md' | 'lg' | null;
  onModalSizeChange: (size: 'sm' | 'md' | 'lg' | null) => void;
  onTrackInteraction: (component: string, action: string) => void;
}

export function ModalSection({ modalSize, onModalSizeChange, onTrackInteraction }: ModalSectionProps) {
  const closeModal = (size: string) => {
    onModalSizeChange(null);
    onTrackInteraction('Modal', `close-${size}`);
  };

  return (
    <section className="space-y-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-8 bg-warning rounded-full" />
            Modal
          </h2>
          <p className="text-muted-foreground mt-1">
            Diálogo modal con soporte para header, body y footer. Cierra con ESC o click afuera.
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Tamaños</h3>
            <p className="text-muted-foreground mb-4">
              El modal soporta 3 tamaños principales: Small, Medium y Large.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  onModalSizeChange('sm');
                  onTrackInteraction('Modal', 'open-sm');
                }}
              >
                Small (sm)
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onModalSizeChange('md');
                  onTrackInteraction('Modal', 'open-md');
                }}
              >
                Medium (md)
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  onModalSizeChange('lg');
                  onTrackInteraction('Modal', 'open-lg');
                }}
              >
                Large (lg)
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-lg)] bg-muted/50 border border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Referencia de Tamaños</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="h-2 bg-secondary rounded mb-2 mx-auto" style={{ width: '60%' }} />
                <p className="font-mono text-muted-foreground">sm</p>
                <p className="text-xs text-muted-foreground">max-w-sm (384px)</p>
              </div>
              <div>
                <div className="h-2 bg-primary rounded mb-2 mx-auto" style={{ width: '80%' }} />
                <p className="font-mono text-muted-foreground">md</p>
                <p className="text-xs text-muted-foreground">max-w-md (448px)</p>
              </div>
              <div>
                <div className="h-2 bg-accent rounded mb-2 mx-auto" style={{ width: '100%' }} />
                <p className="font-mono text-muted-foreground">lg</p>
                <p className="text-xs text-muted-foreground">max-w-lg (512px)</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal Small */}
      <Modal
        isOpen={modalSize === 'sm'}
        onClose={() => closeModal('sm')}
        size="sm"
      >
        <ModalHeader onClose={() => closeModal('sm')}>
          Modal Small
        </ModalHeader>
        <ModalBody>
          <p className="text-muted-foreground">
            Este es un modal pequeño, ideal para confirmaciones rápidas o mensajes cortos.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onModalSizeChange(null);
              onTrackInteraction('Button', 'click-cancel-sm');
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onModalSizeChange(null);
              onTrackInteraction('Button', 'click-confirm-sm');
            }}
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Medium */}
      <Modal
        isOpen={modalSize === 'md'}
        onClose={() => closeModal('md')}
        size="md"
      >
        <ModalHeader onClose={() => closeModal('md')}>
          Modal Medium
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Este es un modal de tamaño medio, perfecto para formularios simples o contenido moderado.
            </p>
            <Input
              label="Campo de ejemplo"
              placeholder="Escribe algo aquí..."
              onFocus={() => onTrackInteraction('Input', 'focus-modal-md')}
              onChange={() => onTrackInteraction('Input', 'change-modal-md')}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onModalSizeChange(null);
              onTrackInteraction('Button', 'click-cancel-md');
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onModalSizeChange(null);
              onTrackInteraction('Button', 'click-confirm-md');
            }}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal Large */}
      <Modal
        isOpen={modalSize === 'lg'}
        onClose={() => closeModal('lg')}
        size="lg"
      >
        <ModalHeader onClose={() => closeModal('lg')}>
          Modal Large
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Este es un modal grande, ideal para formularios complejos, tablas de datos o contenido extenso que requiere más espacio.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Tu nombre"
                onFocus={() => onTrackInteraction('Input', 'focus-modal-lg')}
              />
              <Input
                label="Apellido"
                placeholder="Tu apellido"
                onFocus={() => onTrackInteraction('Input', 'focus-modal-lg')}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              onFocus={() => onTrackInteraction('Input', 'focus-modal-lg')}
            />
            <Input
              label="Mensaje"
              placeholder="Escribe tu mensaje..."
              onFocus={() => onTrackInteraction('Input', 'focus-modal-lg')}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onModalSizeChange(null);
              onTrackInteraction('Button', 'click-cancel-lg');
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="accent"
            onClick={() => {
              onModalSizeChange(null);
              onTrackInteraction('Button', 'click-confirm-lg');
            }}
          >
            Enviar
          </Button>
        </ModalFooter>
      </Modal>
    </section>
  );
}


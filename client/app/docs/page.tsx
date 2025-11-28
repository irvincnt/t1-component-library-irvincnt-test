'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../components';
import { useInteractions } from '../context/InteractionContext';
import { componentDocs, ComponentDoc } from './comDocs';

type ModalSize = 'sm' | 'md' | 'lg' | null;

interface ButtonPreviewProps {
  onInteraction: () => void;
}

function ButtonPreview({ onInteraction }: ButtonPreviewProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onInteraction}>Primary</Button>
      <Button variant="secondary" onClick={onInteraction}>Secondary</Button>
      <Button variant="accent" onClick={onInteraction}>Accent</Button>
      <Button variant="destructive" onClick={onInteraction}>Destructive</Button>
    </div>
  );
}

interface InputPreviewProps {
  onInteraction: () => void;
}

function InputPreview({ onInteraction }: InputPreviewProps) {
  return (
    <div className="max-w-md space-y-4">
      <Input label="Email" placeholder="tu@email.com" onFocus={onInteraction} />
      <Input label="Con error" error="Este campo es requerido" defaultValue="valor inválido" />
    </div>
  );
}

interface CardPreviewProps {
  onInteraction: () => void;
}

function CardPreview({ onInteraction }: CardPreviewProps) {
  return (
    <div className="max-w-sm">
      <Card variant="elevated" hoverable onClick={onInteraction}>
        <CardBody>
          <h4 className="font-semibold text-foreground">Título de Card</h4>
          <p className="text-muted-foreground text-sm mt-1">
            Este es un ejemplo de contenido en una Card.
          </p>
        </CardBody>
        <CardFooter>
          <Button size="sm">Acción</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface ModalPreviewProps {
  modalSize: ModalSize;
  onOpenModal: (size: ModalSize) => void;
  onCloseModal: () => void;
}

function ModalPreview({ modalSize, onOpenModal, onCloseModal }: ModalPreviewProps) {
  const modalConfigs = [
    { size: 'sm' as const, label: 'Small', variant: 'secondary' as const, description: 'Tamaño pequeño (max-w-sm: 384px). Ideal para confirmaciones.' },
    { size: 'md' as const, label: 'Medium', variant: 'primary' as const, description: 'Tamaño medio (max-w-md: 448px). Perfecto para formularios simples.' },
    { size: 'lg' as const, label: 'Large', variant: 'accent' as const, description: 'Tamaño grande (max-w-lg: 512px). Ideal para formularios complejos o contenido extenso.' },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Prueba los diferentes tamaños de modal:
      </p>
      <div className="flex flex-wrap gap-3">
        {modalConfigs.map(({ size, label, variant }) => (
          <Button key={size} variant={variant} size="sm" onClick={() => onOpenModal(size)}>
            {label}
          </Button>
        ))}
      </div>

      {modalConfigs.map(({ size, label, description, variant }) => (
        <Modal key={size} isOpen={modalSize === size} onClose={onCloseModal} size={size}>
          <ModalHeader onClose={onCloseModal}>Modal {label}</ModalHeader>
          <ModalBody>
            <p className="text-muted-foreground text-sm">{description}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={onCloseModal}>
              {size === 'sm' ? 'Cerrar' : 'Cancelar'}
            </Button>
            {size !== 'sm' && (
              <Button variant={size === 'lg' ? 'accent' : 'primary'} onClick={onCloseModal}>
                {size === 'lg' ? 'Confirmar' : 'Aceptar'}
              </Button>
            )}
          </ModalFooter>
        </Modal>
      ))}
    </div>
  );
}

interface SidebarProps {
  docs: ComponentDoc[];
  activeComponent: string;
  onSelect: (name: string) => void;
}

function Sidebar({ docs, activeComponent, onSelect }: SidebarProps) {
  return (
    <nav className="lg:col-span-1">
      <Card variant="bordered" className="sticky top-24">
        <CardBody className="p-2">
          <ul className="space-y-1">
            {docs.map((doc) => (
              <li key={doc.name}>
                <button
                  onClick={() => onSelect(doc.name)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-md
                    text-sm font-medium transition-colors
                    ${activeComponent === doc.name
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                  `}
                >
                  {doc.name}
                </button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </nav>
  );
}

interface PropsTableProps {
  props: ComponentDoc['props'];
}

function PropsTable({ props }: PropsTableProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">Props</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Prop</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Tipo</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Default</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => (
              <tr key={prop.name} className={index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}>
                <td className="px-4 py-3 font-mono text-primary">{prop.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.default}</td>
                <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CodeExampleProps {
  code: string;
}

function CodeExample({ code }: CodeExampleProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">Ejemplo de Uso</h3>
      <div className="relative rounded-lg bg-[#1e1e2e] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a3c] border-b border-[#3a3a4c]">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-gray-400">example.tsx</span>
        </div>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-gray-300">{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const { trackInteraction } = useInteractions();
  const [activeComponent, setActiveComponent] = useState<string>('Button');
  const [modalSize, setModalSize] = useState<ModalSize>(null);

  const currentDoc = componentDocs.find((c) => c.name === activeComponent)!;

  const handleNavSelect = (name: string) => {
    setActiveComponent(name);
    trackInteraction('Button', 'click-nav-docs');
  };

  const handleOpenModal = (size: ModalSize) => {
    setModalSize(size);
    trackInteraction('Modal', `open-preview-${size}`);
  };

  const handleCloseModal = () => {
    trackInteraction('Modal', `close-preview-${modalSize}`);
    setModalSize(null);
  };

  const renderPreview = () => {
    switch (activeComponent) {
      case 'Button':
        return <ButtonPreview onInteraction={() => trackInteraction('Button', 'click-preview')} />;
      case 'Input':
        return <InputPreview onInteraction={() => trackInteraction('Input', 'focus-preview')} />;
      case 'Card':
        return <CardPreview onInteraction={() => trackInteraction('Card', 'click-preview')} />;
      case 'Modal':
        return (
          <ModalPreview
            modalSize={modalSize}
            onOpenModal={handleOpenModal}
            onCloseModal={handleCloseModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Documentación de Componentes
          </h1>
          <p className="text-muted-foreground mt-2">
            Guía de uso y referencia de props para cada componente.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar
            docs={componentDocs}
            activeComponent={activeComponent}
            onSelect={handleNavSelect}
          />

          <div className="lg:col-span-3 space-y-6">
            <Card variant="bordered" className="animate-fade-in" key={activeComponent}>
              <CardHeader>
                <h2 className="text-2xl font-bold text-foreground">{currentDoc.name}</h2>
                <p className="text-muted-foreground mt-1">{currentDoc.description}</p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Vista Previa</h3>
                  <div className="p-6 rounded-lg bg-muted/30 border border-border">
                    {renderPreview()}
                  </div>
                </div>

                <PropsTable props={currentDoc.props} />
                <CodeExample code={currentDoc.example} />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

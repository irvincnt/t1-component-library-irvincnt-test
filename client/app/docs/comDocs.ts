export interface ComponentDoc {
  name: string;
  description: string;
  props: { name: string; type: string; default: string; description: string }[];
  example: string;
}

export const componentDocs: ComponentDoc[] = [
  {
    name: 'Button',
    description: 'Componente de botón versátil con múltiples variantes, tamaños y estados.',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'destructive' | 'ghost' | 'outline'", default: "'primary'", description: 'Estilo visual del botón' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tamaño del botón' },
      { name: 'isLoading', type: 'boolean', default: 'false', description: 'Muestra un spinner de carga' },
      { name: 'leftIcon', type: 'ReactNode', default: 'undefined', description: 'Ícono a la izquierda del texto' },
      { name: 'rightIcon', type: 'ReactNode', default: 'undefined', description: 'Ícono a la derecha del texto' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el botón' },
    ],
    example: `<Button 
  variant="primary" 
  size="md"
  onClick={() => console.log('clicked')}
>
  Click me
</Button>`,
  },
  {
    name: 'Input',
    description: 'Campo de entrada de texto con soporte para labels, errores, iconos y diferentes estados.',
    props: [
      { name: 'label', type: 'string', default: 'undefined', description: 'Etiqueta del input' },
      { name: 'error', type: 'string', default: 'undefined', description: 'Mensaje de error' },
      { name: 'helperText', type: 'string', default: 'undefined', description: 'Texto de ayuda' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tamaño del input' },
      { name: 'leftIcon', type: 'ReactNode', default: 'undefined', description: 'Ícono a la izquierda' },
      { name: 'rightIcon', type: 'ReactNode', default: 'undefined', description: 'Ícono a la derecha' },
    ],
    example: `<Input
  label="Email"
  placeholder="tu@email.com"
  type="email"
  leftIcon={<MailIcon />}
  error={errors.email}
/>`,
  },
  {
    name: 'Card',
    description: 'Contenedor flexible con header, body, footer e imagen. Soporta múltiples variantes.',
    props: [
      { name: 'variant', type: "'default' | 'bordered' | 'elevated'", default: "'default'", description: 'Estilo visual de la tarjeta' },
      { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Padding interno' },
      { name: 'hoverable', type: 'boolean', default: 'false', description: 'Efecto hover con elevación' },
    ],
    example: `<Card variant="elevated" hoverable>
  <CardImage src="/image.jpg" alt="..." />
  <CardBody>
    <h3>Título</h3>
    <p>Contenido de la tarjeta</p>
  </CardBody>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>`,
  },
  {
    name: 'Modal',
    description: 'Diálogo modal con soporte para header, body y footer. Disponible en 3 tamaños: sm (384px), md (448px) y lg (512px).',
    props: [
      { name: 'isOpen', type: 'boolean', default: 'false', description: 'Controla la visibilidad' },
      { name: 'onClose', type: '() => void', default: 'required', description: 'Callback al cerrar' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Tamaño del modal: sm=384px, md=448px, lg=512px' },
      { name: 'closeOnOverlayClick', type: 'boolean', default: 'true', description: 'Cierra al hacer click fuera' },
      { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Cierra con tecla ESC' },
    ],
    example: `const [isOpen, setIsOpen] = useState(false);

// Modal Small - Para confirmaciones rápidas
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
  <ModalHeader>Confirmar</ModalHeader>
  <ModalBody>¿Estás seguro?</ModalBody>
  <ModalFooter>
    <Button size="sm">Aceptar</Button>
  </ModalFooter>
</Modal>

// Modal Medium (default) - Para formularios simples
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
  ...
</Modal>

// Modal Large - Para contenido extenso
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
  ...
</Modal>`,
  },
];
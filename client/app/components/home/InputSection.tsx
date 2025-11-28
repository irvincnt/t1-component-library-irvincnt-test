'use client';

import { Search } from 'lucide-react';
import { Input, Card, CardHeader, CardBody } from '../';

interface InputSectionProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onTrackInteraction: (component: string, action: string) => void;
}

export function InputSection({ inputValue, onInputChange, onTrackInteraction }: InputSectionProps) {
  return (
    <section className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <Card variant="bordered">
        <CardHeader>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-2 h-8 bg-accent rounded-full" />
            Input
          </h2>
          <p className="text-muted-foreground mt-1">
            Campo de entrada de texto con soporte para labels, errores, iconos y diferentes estados.
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Estado Normal"
              placeholder="Escribe algo..."
              value={inputValue}
              onChange={(e) => {
                onInputChange(e.target.value);
                onTrackInteraction('Input', 'change');
              }}
              onFocus={() => onTrackInteraction('Input', 'focus')}
            />
            <Input
              label="Con ícono"
              placeholder="Buscar..."
              leftIcon={<Search size={18} />}
              onFocus={() => onTrackInteraction('Input', 'focus-icon')}
            />
            <Input
              label="Con error"
              placeholder="Email inválido"
              error="Este campo es requerido"
              defaultValue="email-invalido"
              onFocus={() => onTrackInteraction('Input', 'focus-error')}
            />
            <Input
              label="Deshabilitado"
              placeholder="No disponible"
              disabled
              onFocus={() => onTrackInteraction('Input', 'focus-disabled')}
            />
            <Input
              label="Con helper text"
              placeholder="Contraseña"
              type="password"
              helperText="Mínimo 8 caracteres"
              onFocus={() => onTrackInteraction('Input', 'focus-helper')}
            />
            <Input
              label="Tamaño grande"
              placeholder="Input grande"
              size="lg"
              onFocus={() => onTrackInteraction('Input', 'focus-lg')}
            />
          </div>
        </CardBody>
      </Card>
    </section>
  );
}


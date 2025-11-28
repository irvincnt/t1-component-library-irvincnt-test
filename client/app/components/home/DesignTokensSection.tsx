'use client';

import { Card, CardHeader, CardBody } from '../';

export function DesignTokensSection() {
  return (
    <section className="space-y-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        Design Tokens
      </h2>

      {/* Colors */}
      <ColorsCard />

      {/* Border Radius */}
      <BorderRadiusCard />

      {/* Shadows */}
      <ShadowsCard />

      {/* Transitions */}
      <TransitionsCard />

      {/* Typography */}
      <TypographyCard />

      {/* CSS Variables Reference */}
      <CssVariablesCard />
    </section>
  );
}

function ColorsCard() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Colores</h3>
        <p className="text-sm text-muted-foreground">
          Paleta de colores del sistema con soporte para light/dark mode
        </p>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Primary Colors */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Primary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ColorSwatch color="primary" label="primary" hex="#4f46e5" />
            <ColorSwatch color="primary-hover" label="primary-hover" hex="#4338ca" />
            <ColorSwatch
              color="primary/20"
              label="primary/20"
              hex="20% opacity"
              bordered
              textColor="primary"
            />
            <ColorSwatch
              color="primary/10"
              label="primary/10"
              hex="10% opacity"
              bordered
              borderOpacity
              textColor="primary"
            />
          </div>
        </div>

        {/* Semantic Colors */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Semánticos</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ColorSwatch color="accent" label="accent" hex="#14b8a6" foregroundKey="accent-foreground" />
            <ColorSwatch color="success" label="success" hex="#10b981" foregroundKey="success-foreground" />
            <ColorSwatch color="warning" label="warning" hex="#f59e0b" foregroundKey="warning-foreground" />
            <ColorSwatch color="destructive" label="destructive" hex="#f43f5e" foregroundKey="destructive-foreground" />
          </div>
        </div>

        {/* Neutral Colors */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Neutrales</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <ColorSwatch
              color="background"
              label="background"
              hex="#fafbfc"
              bordered
              textColor="foreground"
            />
            <ColorSwatch
              color="card"
              label="card"
              hex="#ffffff"
              bordered
              foregroundKey="card-foreground"
            />
            <ColorSwatch
              color="muted"
              label="muted"
              hex="#f8fafc"
              bordered
              foregroundKey="muted-foreground"
            />
            <ColorSwatch
              color="secondary"
              label="secondary"
              hex="#f1f5f9"
              foregroundKey="secondary-foreground"
            />
            <ColorSwatch
              color="foreground"
              label="foreground"
              hex="#1a1a2e"
              textColor="background"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

interface ColorSwatchProps {
  color: string;
  label: string;
  hex: string;
  bordered?: boolean;
  borderOpacity?: boolean;
  textColor?: string;
  foregroundKey?: string;
}

function ColorSwatch({ color, label, hex, bordered, borderOpacity, textColor, foregroundKey }: ColorSwatchProps) {
  const bgClass = `bg-${color}`;
  const borderClass = bordered ? (borderOpacity ? 'border border-primary/30' : 'border border-border') : '';
  const textClass = textColor ? `text-${textColor}` : foregroundKey ? `text-${foregroundKey}` : 'text-primary-foreground';

  return (
    <div className="space-y-2">
      <div
        className={`h-16 rounded-[var(--radius-md)] ${bgClass} ${borderClass} flex items-end p-2`}
      >
        <span className={`text-xs ${textClass} font-mono`}>{label}</span>
      </div>
      <p className="text-xs text-muted-foreground font-mono">{hex}</p>
    </div>
  );
}

function BorderRadiusCard() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Border Radius</h3>
        <p className="text-sm text-muted-foreground">
          Valores de radio para esquinas redondeadas
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { name: 'sm', value: '0.375rem', radius: 'var(--radius-sm)' },
            { name: 'md', value: '0.5rem', radius: 'var(--radius-md)' },
            { name: 'lg', value: '0.75rem', radius: 'var(--radius-lg)' },
            { name: 'xl', value: '1rem', radius: 'var(--radius-xl)' },
            { name: 'full', value: '9999px', radius: '9999px' },
          ].map((item) => (
            <div key={item.name} className="space-y-2 text-center">
              <div
                className="h-16 w-full bg-primary"
                style={{ borderRadius: item.radius }}
              />
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{item.value}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function ShadowsCard() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Sombras</h3>
        <p className="text-sm text-muted-foreground">Niveles de elevación y profundidad</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { name: 'shadow-sm', label: 'Sutil', shadow: 'var(--shadow-sm)', hasBorder: true },
            { name: 'shadow-md', label: 'Medio', shadow: 'var(--shadow-md)' },
            { name: 'shadow-lg', label: 'Grande', shadow: 'var(--shadow-lg)' },
            { name: 'shadow-xl', label: 'Extra grande', shadow: 'var(--shadow-xl)' },
          ].map((item) => (
            <div key={item.name} className="space-y-3 text-center">
              <div
                className={`h-20 bg-card rounded-[var(--radius-lg)] ${item.hasBorder ? 'border border-border/50' : ''}`}
                style={{ boxShadow: item.shadow }}
              />
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function TransitionsCard() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Transiciones</h3>
        <p className="text-sm text-muted-foreground">
          Duraciones para animaciones y transiciones
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Fast',
              duration: '150ms',
              variable: 'var(--transition-fast)',
              color: 'primary',
              description: 'Hover, focus, estados rápidos',
            },
            {
              name: 'Normal',
              duration: '200ms',
              variable: 'var(--transition-normal)',
              color: 'accent',
              description: 'Transiciones estándar',
            },
            {
              name: 'Slow',
              duration: '300ms',
              variable: 'var(--transition-slow)',
              color: 'success',
              description: 'Animaciones, modales, page transitions',
            },
          ].map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-[var(--radius-lg)] bg-muted/50 border border-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{item.duration}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${item.color} rounded-full transition-all hover:w-full w-1/4`}
                  style={{ transitionDuration: item.variable }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function TypographyCard() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Tipografía</h3>
        <p className="text-sm text-muted-foreground">Fuentes y estilos de texto</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-3">
          {[
            { label: 'Heading 1', classes: 'text-4xl font-bold text-foreground', code: 'text-4xl / font-bold' },
            { label: 'Heading 2', classes: 'text-2xl font-bold text-foreground', code: 'text-2xl / font-bold' },
            { label: 'Heading 3', classes: 'text-lg font-semibold text-foreground', code: 'text-lg / font-semibold' },
            { label: 'Body text', classes: 'text-base text-foreground', code: 'text-base' },
            { label: 'Muted text', classes: 'text-sm text-muted-foreground', code: 'text-sm / text-muted-foreground' },
            { label: 'Monospace', classes: 'text-xs font-mono text-foreground', code: 'text-xs / font-mono', noBorder: true },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-baseline justify-between ${item.noBorder ? '' : 'border-b border-border pb-2'}`}
            >
              <span className={item.classes}>{item.label}</span>
              <span className="text-xs text-muted-foreground font-mono">{item.code}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function CssVariablesCard() {
  return (
    <Card variant="bordered">
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Variables CSS</h3>
        <p className="text-sm text-muted-foreground">Referencia rápida de tokens disponibles</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Colores</h4>
            <div className="p-3 rounded-[var(--radius-md)] bg-[#1e1e2e] overflow-x-auto">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{`--background
--foreground
--card / --card-foreground
--primary / --primary-hover
--secondary / --secondary-hover
--accent / --accent-hover
--destructive / --destructive-hover
--success / --warning
--muted / --muted-foreground
--border / --input / --ring`}</pre>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Espaciado y Efectos</h4>
            <div className="p-3 rounded-[var(--radius-md)] bg-[#1e1e2e] overflow-x-auto">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{`/* Radius */
--radius-sm: 0.375rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-xl: 1rem
--radius-full: 9999px

/* Transitions */
--transition-fast: 150ms
--transition-normal: 200ms
--transition-slow: 300ms`}</pre>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


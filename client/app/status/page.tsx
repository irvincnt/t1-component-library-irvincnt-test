'use client';

import { Check, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button, Card, CardHeader, CardBody } from '../components';
import { useInteractions } from '../context/InteractionContext';
import { useHealthCheck, ServiceStatus } from '../hooks';

const formatUptime = (uptime: string): string => {
  const seconds = parseInt(uptime.replace('s', ''));
  if (seconds < 60) return `${seconds} segundos`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas`;
  return `${Math.floor(seconds / 86400)} días`;
};

const getStatusColor = (status: ServiceStatus['status']): string => {
  const colors = {
    online: 'bg-success',
    offline: 'bg-destructive',
    checking: 'bg-warning animate-pulse-slow',
  };
  return colors[status];
};

const getStatusText = (status: ServiceStatus['status']): string => {
  const texts = {
    online: 'En línea',
    offline: 'Sin conexión',
    checking: 'Verificando...',
  };
  return texts[status];
};

const getStatusBadgeClass = (status: ServiceStatus['status']): string => {
  const classes = {
    online: 'bg-success/10 text-success',
    offline: 'bg-destructive/10 text-destructive',
    checking: 'bg-warning/10 text-warning',
  };
  return classes[status];
};

interface StatusIconProps {
  allOnline: boolean;
  someOffline: boolean;
}

function StatusIcon({ allOnline, someOffline }: StatusIconProps) {
  if (allOnline) {
    return <Check size={40} className="text-success" strokeWidth={2} />;
  }

  if (someOffline) {
    return <XCircle size={40} className="text-destructive" strokeWidth={2} />;
  }

  return <Loader2 size={40} className="text-warning animate-spin" strokeWidth={2} />;
}

interface ServiceItemProps {
  service: ServiceStatus;
  index: number;
}

function ServiceItem({ service, index }: ServiceItemProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
        <div>
          <p className="font-medium text-foreground">{service.name}</p>
          {service.lastChecked && (
            <p className="text-xs text-muted-foreground">
              Última verificación: {service.lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {service.latency !== undefined && service.latency > 0 && (
          <span className="text-sm text-muted-foreground font-mono">{service.latency}ms</span>
        )}
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(service.status)}`}>
          {getStatusText(service.status)}
        </span>
      </div>
    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

function InfoCard({ label, value, className = '', valueClassName = '' }: InfoCardProps) {
  return (
    <div className={`p-4 rounded-lg bg-muted/30 ${className}`}>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`font-semibold mt-1 ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function StatusPage() {
  const { trackInteraction } = useInteractions();
  const { healthData, services, apiLatency, isLoading, refetch } = useHealthCheck();

  const allOnline = services.every((s) => s.status === 'online');
  const someOffline = services.some((s) => s.status === 'offline');

  const handleRefresh = () => {
    refetch();
    trackInteraction('Button', 'click-refresh-status');
  };

  const getOverallStatusClass = () => {
    if (allOnline) return 'border-success/50';
    if (someOffline) return 'border-destructive/50';
    return 'border-warning/50';
  };

  const getOverallBgClass = () => {
    if (allOnline) return 'bg-success/20';
    if (someOffline) return 'bg-destructive/20';
    return 'bg-warning/20';
  };

  const getOverallTextClass = () => {
    if (allOnline) return 'text-success';
    if (someOffline) return 'text-destructive';
    return 'text-warning';
  };

  const getOverallMessage = () => {
    if (allOnline) return 'Todos los sistemas operativos';
    if (someOffline) return 'Algunos servicios no disponibles';
    return 'Verificando estado...';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Estado del Sistema</h1>
          <p className="text-muted-foreground mt-2">Monitoreo en tiempo real de los servicios.</p>
        </header>

        {/* Overall Status */}
        <Card
          variant="elevated"
          className={`animate-slide-up ${getOverallStatusClass()}`}
          style={{ animationDelay: '100ms' }}
        >
          <CardBody className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getOverallBgClass()}`}>
                <StatusIcon allOnline={allOnline} someOffline={someOffline} />
              </div>
              <div className="text-center">
                <h2 className={`text-2xl font-bold ${getOverallTextClass()}`}>{getOverallMessage()}</h2>
                <p className="text-muted-foreground mt-1">
                  {services.filter((s) => s.status === 'online').length} de {services.length} servicios en línea
                </p>
                {healthData && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Última verificación: {new Date(healthData.timestamp).toLocaleString('es-MX')}
                  </p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Services List */}
        <Card variant="bordered" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Servicios</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              isLoading={isLoading}
              leftIcon={!isLoading && <RefreshCw size={16} />}
            >
              Actualizar
            </Button>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border">
              {services.map((service, index) => (
                <ServiceItem key={service.name} service={service} index={index} />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Server Info */}
        {healthData && (
          <Card variant="bordered" className="animate-slide-up" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <h2 className="text-lg font-semibold">Información del Servidor</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <InfoCard
                  label="Estado"
                  value={healthData.status === 'healthy' ? 'Saludable' : 'Degradado'}
                  valueClassName={healthData.status === 'healthy' ? 'text-success' : 'text-warning'}
                />
                <InfoCard label="Uptime" value={formatUptime(healthData.uptime)} valueClassName="text-foreground" />
                <InfoCard label="Node.js" value={healthData.system.nodeVersion} valueClassName="font-mono text-foreground" />
                <InfoCard label="Latencia API" value={`${apiLatency}ms`} valueClassName="font-mono text-foreground" />
              </div>

              {/* Memory Usage */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Uso de Memoria</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-muted-foreground text-xs">Heap Usado</p>
                    <p className="font-mono text-lg text-primary mt-1">{healthData.system.memory.heapUsed}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-muted-foreground text-xs">Heap Total</p>
                    <p className="font-mono text-lg text-accent mt-1">{healthData.system.memory.heapTotal}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <p className="text-muted-foreground text-xs">RSS</p>
                    <p className="font-mono text-lg text-success mt-1">{healthData.system.memory.rss}</p>
                  </div>
                </div>
              </div>

              {/* Database Status */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Base de Datos</h3>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      healthData.services.database.connected ? 'bg-success' : 'bg-destructive'
                    }`}
                  />
                  <div>
                    <p className="font-medium">MongoDB</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Estado: {healthData.services.database.status}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

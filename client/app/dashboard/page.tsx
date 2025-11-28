'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../components';
import { useInteractions } from '../context/InteractionContext';
import { BarChart3, UserCheck, UserX, Layers } from 'lucide-react';

export default function DashboardPage() {
  const { serverStats, isLoadingServerStats, isRefetchingServerStats } = useInteractions();

  const userTypeData = useMemo(() => {
    if (!serverStats?.porTipoUsuario) return { registered: 0, anonymous: 0 };
    
    const registered = serverStats.porTipoUsuario.find(u => u._id === 'registered')?.count || 0;
    const anonymous = serverStats.porTipoUsuario.find(u => u._id === 'anonymous')?.count || 0;
    
    return { registered, anonymous };
  }, [serverStats]);

  const totalEvents = serverStats?.totalInteracciones || 0;

  const registeredPercent = totalEvents > 0 ? Math.round((userTypeData.registered / totalEvents) * 100) : 0;
  const anonymousPercent = totalEvents > 0 ? Math.round((userTypeData.anonymous / totalEvents) * 100) : 0;

  const activeComponents = serverStats?.porComponente?.length || 0;

  const chartData = serverStats?.porComponente || [];
  const maxValue = Math.max(...chartData.map(c => c.count), 1);

  const donutData = useMemo(() => {
    const total = userTypeData.registered + userTypeData.anonymous;
    if (total === 0) return { registeredDeg: 0, anonymousDeg: 360 };
    
    const registeredDeg = (userTypeData.registered / total) * 360;
    const anonymousDeg = (userTypeData.anonymous / total) * 360;
    
    return { registeredDeg, anonymousDeg };
  }, [userTypeData]);

  if (isLoadingServerStats) {
    return (
      <div className="h-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
return (
    <div className="h-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="animate-slide-up flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Dashboard de Estadísticas
            </h1>
            <p className="text-muted-foreground mt-2">
              Visualiza las interacciones con los componentes de la biblioteca.
            </p>
          </div>
          {isRefetchingServerStats && (
            <span className="text-sm text-muted-foreground animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
              Actualizando...
            </span>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Card variant="bordered" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Eventos</span>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{totalEvents}</p>
            <p className="text-xs text-muted-foreground mt-1">Interacciones en tiempo real</p>
          </Card>

          <Card variant="bordered" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Usuarios Auth</span>
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{userTypeData.registered}</p>
            <p className="text-xs text-muted-foreground mt-1">{registeredPercent}% del total</p>
          </Card>

          <Card variant="bordered" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Usuarios Anónimos</span>
              <UserX className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{userTypeData.anonymous}</p>
            <p className="text-xs text-muted-foreground mt-1">{anonymousPercent}% del total</p>
          </Card>

          <Card variant="bordered" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Componentes</span>
              <Layers className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground mt-2">{activeComponents}</p>
            <p className="text-xs text-muted-foreground mt-1">Componentes activos</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="bordered" className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <div>
                <h2 className="text-lg font-semibold">Eventos por componente</h2>
                <p className="text-sm text-muted-foreground">Distribución de interacciones</p>
              </div>
            </CardHeader>
            <CardBody>
              {chartData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay datos disponibles.</p>
                  <p className="text-sm mt-1">Interactúa con los componentes para generar estadísticas.</p>
                </div>
              ) : (
                <div className="flex items-end justify-around gap-4 h-64">
                  {chartData.map((item, index) => {
                    const heightPercent = (item.count / maxValue) * 100;
                    return (
                      <div key={item._id} className="flex flex-col items-center flex-1 max-w-32 h-full">
                        
                        <div className="flex-1 w-full flex items-end">
                          <div 
                            className="w-full bg-primary rounded-t-md transition-all duration-500"
                            style={{ 
                              height: `${Math.max(heightPercent, 8)}%`,
                            }}
                          />
                        </div>
                        
                        <span className="text-xs text-muted-foreground mt-2 text-center">{item._id} <span className="text-xs text-muted-foreground font-mono font-bold">({item.count})</span></span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          <Card variant="bordered" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div>
                <h2 className="text-lg font-semibold">Por Tipo de Usuario</h2>
                <p className="text-sm text-muted-foreground">Autenticados vs Anónimos</p>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col items-center justify-center">
              {totalEvents === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay datos disponibles.</p>
                </div>
              ) : (
                <>
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="12"
                        strokeDasharray={`${(userTypeData.registered / totalEvents) * 251.2} 251.2`}
                        className="text-foreground transition-all duration-500"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={`${(userTypeData.anonymous / totalEvents) * 251.2} 251.2`}
                        strokeDashoffset={`-${(userTypeData.registered / totalEvents) * 251.2}`}
                        className="text-muted-foreground transition-all duration-500"
                      />
                    </svg>
                  </div>

                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span className="text-sm text-muted-foreground">Autenticado ({userTypeData.registered})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-muted-foreground"></span>
                      <span className="text-sm text-muted-foreground">Anónimo ({userTypeData.anonymous})</span>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <h2 className="text-lg font-semibold">Detalle de Acciones por Componente</h2>
          </CardHeader>
          <CardBody className="p-0">
            {!serverStats?.porAccion || serverStats.porAccion.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No hay estadísticas disponibles.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">
                        Componente
                      </th>
                      <th className="text-left px-5 py-3 text-sm font-semibold text-foreground">
                        Acción
                      </th>
                      <th className="text-right px-5 py-3 text-sm font-semibold text-foreground">
                        Interacciones
                      </th>
                      <th className="text-right px-5 py-3 text-sm font-semibold text-foreground">
                        Porcentaje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {serverStats.porAccion.map((item, index) => {
                      const percent = totalEvents > 0 ? Math.round((item.count / totalEvents) * 100) : 0;
                      return (
                        <tr
                          key={`${item._id.componente}-${item._id.accion}`}
                          className={`border-b border-border/50 ${
                            index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                          }`}
                        >
                          <td className="px-5 py-3 text-sm">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {item._id.componente}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {item._id.accion}
                          </td>
                          <td className="px-5 py-3 text-sm text-right font-mono font-semibold text-foreground">
                            {item.count}
                          </td>
                          <td className="px-5 py-3 text-sm text-right text-muted-foreground">
                            {percent}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { FileText, FileJson, Download, File } from 'lucide-react';
import { Button, Card, CardHeader, CardBody } from '../components';
import { useInteractions } from '../context/InteractionContext';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';
import { useExportView } from '../hooks/useExportView';
import { api, ExportDataItem } from '../lib/api';

export default function ExportsPage() {
  const { trackInteraction } = useInteractions();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: exportData, isLoading, isError } = useExportView({ page, limit });

  const handlePreviousPage = () => {
    if (exportData?.pagination.hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (exportData?.pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadCSV = async () => {
    trackInteraction('Button', 'click-download-csv');
    
    const token = useAuthStore.getState().token;
    if (!token) {
      alert('Debes iniciar sesión para exportar datos.');
      return;
    }

    try {
      const response = await api.getExportData(token);
      
      if (!response.data || response.data.length === 0) {
        alert('No hay datos para exportar.');
        return;
      }

      const headers = ['Componente', 'Acción', 'Fecha', 'Tipo Usuario', 'Nombre Usuario', 'Email Usuario'];
      const csvRows = [
        headers.join(','),
        ...response.data.map((item: ExportDataItem) => [
          item.nombre,
          item.accion,
          formatDate(item.timestamp),
          item.tipo_usuario === 'registered' ? 'Registrado' : 'Anónimo',
          item.usuario?.nombre || '',
          item.usuario?.email || ''
        ].map(value => `"${value}"`).join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `estadisticas-componentes-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar los datos.');
    }
  };

  const downloadJSON = async () => {
    trackInteraction('Button', 'click-download-json');

    const token = useAuthStore.getState().token;
    if (!token) {
      alert('Debes iniciar sesión para exportar datos.');
      return;
    }

    try {
      const response = await api.getExportData(token);
      
      if (!response.data || response.data.length === 0) {
        alert('No hay datos para exportar.');
        return;
      }

      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `estadisticas-componentes-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (error) {
      console.error('Error al exportar JSON:', error);
      alert('Error al exportar los datos.');
    }
  };

   useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Exportar Datos
          </h1>
          <p className="text-muted-foreground mt-2">
            Descarga las estadísticas de interacciones en diferentes formatos.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            variant="bordered"
            hoverable
            className="animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <CardHeader className="bg-gradient-to-r from-success/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <FileText size={24} className="text-success" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Formato CSV</h2>
                  <p className="text-sm text-muted-foreground">Comma-Separated Values</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Button
                variant="ghost"
                className="w-full"
                onClick={downloadCSV}
                leftIcon={<Download size={18} />}
              >
                Descargar CSV
              </Button>
            </CardBody>
          </Card>

          <Card
            variant="bordered"
            hoverable
            className="animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileJson size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Formato JSON</h2>
                  <p className="text-sm text-muted-foreground">JavaScript Object Notation</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Button
                variant="ghost"
                className="w-full"
                onClick={downloadJSON}
                leftIcon={<Download size={18} />}
              >
                Descargar JSON
              </Button>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Vista Previa de Datos</h2>
              {exportData?.pagination && (
                <span className="text-sm text-muted-foreground">
                  {exportData.pagination.total} registros totales
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-destructive">
                <p>Error al cargar los datos.</p>
              </div>
            ) : !exportData?.data || exportData.data.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <File size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay datos para exportar.</p>
                <p className="text-sm mt-1">
                  Visita la página Home e interactúa con los componentes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Componente</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Acción</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Usuario</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Tipo</th>
                        <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exportData.data.map((item) => (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-2">
                            <span className="font-mono text-primary">{item.nombre_componente}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{item.accion}</span>
                          </td>
                          <td className="py-3 px-2">
                            {item.nombre_usuario || <span className="text-muted-foreground italic">-</span>}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.tipo_usuario === 'registered' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {item.tipo_usuario === 'registered' ? 'Registrado' : 'Anónimo'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">
                            {formatDate(item.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Página {exportData.pagination.page} de {exportData.pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!exportData.pagination.hasPrevPage}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!exportData.pagination.hasNextPage}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

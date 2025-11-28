import { ITracking } from '../types';

export const trackingToCSV = (trackings: ITracking[]): string => {
  const headers = ['ID', 'Nombre', 'Accion', 'Timestamp', 'Tipo Usuario', 'Usuario ID'];
  
  const rows = trackings.map(tracking => [
    tracking._id.toString(),
    tracking.nombre,
    tracking.accion,
    tracking.timestamp.toISOString(),
    tracking.tipo_usuario,
    tracking.usuario?.toString() || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};


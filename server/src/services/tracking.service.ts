import { Tracking } from '../models/Tracking.model';
import { ITracking } from '../types';

interface TrackingData {
  nombre: string;
  accion: string;
  tipo_usuario?: 'anonymous' | 'registered';
  usuario?: string;
}

interface TrackingStats {
  totalInteracciones: number;
  porComponente: Array<{ _id: string; count: number }>;
  porAccion: Array<{ _id: { componente: string; accion: string }; count: number }>;
  porTipoUsuario: Array<{ _id: string; count: number }>;
}
interface PaginatedTrackingResult {
  data: Array<{
    id: string;
    nombre_componente: string;
    accion: string;
    timestamp: Date;
    tipo_usuario: string;
    nombre_usuario: string | null;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const trackingService = {
  track: async (data: TrackingData): Promise<ITracking> => {
    const tracking = await Tracking.create({
      nombre: data.nombre,
      accion: data.accion,
      tipo_usuario: data.tipo_usuario || 'anonymous',
      usuario: data.usuario || undefined,
      timestamp: new Date()
    });

    return tracking;
  },

  getStats: async (): Promise<TrackingStats> => {
    const [totalInteracciones, porComponente, porAccion, porTipoUsuario] = await Promise.all([
      Tracking.countDocuments(),
      Tracking.aggregate([
        { $group: { _id: '$nombre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Tracking.aggregate([
        { $group: { _id: { componente: '$nombre', accion: '$accion' }, count: { $sum: 1 } } },
        { $sort: { '_id.componente': 1, count: -1 } }
      ]),
      Tracking.aggregate([
        { $group: { _id: '$tipo_usuario', count: { $sum: 1 } } }
      ])
    ]);

    return {
      totalInteracciones,
      porComponente,
      porAccion,
      porTipoUsuario
    };
  },

  getPaginated: async (page: number = 1, limit: number = 10): Promise<PaginatedTrackingResult> => {
    const skip = (page - 1) * limit;
    
    const [trackings, total] = await Promise.all([
      Tracking.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('usuario', 'nombre'),
      Tracking.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    const data = trackings.map((tracking) => ({
      id: tracking._id.toString(),
      nombre_componente: tracking.nombre,
      accion: tracking.accion,
      timestamp: tracking.timestamp,
      tipo_usuario: tracking.tipo_usuario,
      nombre_usuario: (tracking.usuario as any)?.nombre || null
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  export: async (): Promise<ITracking[]> => {
    const trackings = await Tracking.find()
      .sort({ timestamp: -1 })
      .populate('usuario', 'nombre email');

    return trackings;
  }
};


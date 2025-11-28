import mongoose, { Schema } from 'mongoose';
import { ITracking } from '../types';

const TrackingSchema = new Schema<ITracking>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del componente es requerido'],
      trim: true
    },
    accion: {
      type: String,
      required: [true, 'La acción es requerida'],
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    tipo_usuario: {
      type: String,
      enum: ['anonymous', 'registered'],
      default: 'anonymous'
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: false
  }
);

// Índices para mejorar consultas
TrackingSchema.index({ nombre: 1 });
TrackingSchema.index({ timestamp: -1 });
TrackingSchema.index({ tipo_usuario: 1 });

export const Tracking = mongoose.model<ITracking>('Tracking', TrackingSchema);


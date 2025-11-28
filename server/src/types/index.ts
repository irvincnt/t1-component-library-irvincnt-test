import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  nombre: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITracking extends Document {
  _id: Types.ObjectId;
  nombre: string;
  accion: string;
  timestamp: Date;
  tipo_usuario: 'anonymous' | 'registered';
  usuario?: Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  id: string;
  email: string;
}


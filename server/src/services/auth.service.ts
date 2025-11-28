import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { IUser } from '../types';

interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    nombre: string;
    email: string;
  };
  token: string;
}

const generateToken = (user: IUser): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  return jwt.sign(
    { id: user._id, email: user.email },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const existingUser = await User.findOne({ email: data.email });
    
    if (existingUser) {
      const error = new Error('El email ya está registrado') as Error & { statusCode: number };
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create(data);
    const token = generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        nombre: user.nombre,
        email: user.email
      },
      token
    };
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user) {
      const error = new Error('Credenciales inválidas') as Error & { statusCode: number };
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(data.password);

    if (!isMatch) {
      const error = new Error('Credenciales inválidas') as Error & { statusCode: number };
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        nombre: user.nombre,
        email: user.email
      },
      token
    };
  }
};


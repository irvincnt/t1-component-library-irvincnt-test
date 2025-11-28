import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno');
    }

    await mongoose.connect(mongoUri);
    logger.info('✅ Conexión a MongoDB establecida correctamente');
  } catch (error) {
    logger.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  logger.error('❌ Error de MongoDB:', err);
});


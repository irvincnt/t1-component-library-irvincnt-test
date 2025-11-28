'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '../components';
import { useInteractions } from '../context/InteractionContext';
import { useAuthStore } from '../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { trackInteraction } = useInteractions();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [showError, setShowError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      setShowError(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    setShowError(null);

    const success = await login(data.email, data.password);
    
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md animate-slide-up">
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={32} className="text-primary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Ingresa tus credenciales para continuar
                </p>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody className="space-y-5">
              {showError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {showError}
                </div>
              )}

              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu@email.com"
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un correo electrónico válido',
                  },
                  onChange: () => trackInteraction('Input', 'change'),
                })}
                error={errors.email?.message}
                leftIcon={<Mail size={18} />}
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                  onChange: () => trackInteraction('Input', 'change'),
                })}
                error={errors.password?.message}
                leftIcon={<Lock size={18} />}
              />
            </CardBody>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                Iniciar sesión
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                  onClick={() => trackInteraction('Link', 'click')}
                >
                  Regístrate aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

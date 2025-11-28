'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { UserPlus, User, Mail, Lock, Check } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '../components';
import { useInteractions } from '../context/InteractionContext';
import { useAuthStore } from '../store/authStore';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { trackInteraction } = useInteractions();
  const { register: registerUser, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [showError, setShowError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
  });

  const password = watch('password');

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

  const onSubmit = async (data: RegisterFormData) => {
    trackInteraction('Button', 'click');
    trackInteraction('Form', 'submit');
    setShowError(null);

    const success = await registerUser(data.name, data.email, data.password);
    
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-md animate-slide-up">
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-accent/10 to-primary/10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <UserPlus size={32} className="text-accent" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Completa el formulario para registrarte
                </p>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardBody className="space-y-4">    
              {showError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {showError}
                </div>
              )}

              <Input
                label="Nombre completo"
                type="text"
                placeholder="Juan Pérez"
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                  onChange: () => trackInteraction('Input', 'change'),
                })}
                error={errors.name?.message}
                leftIcon={<User size={18} />}
              />

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
                    value: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                  },
                  pattern: {
                    value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Debe incluir mayúsculas, minúsculas y números',
                  },
                  onChange: () => trackInteraction('Input', 'change'),
                })}
                error={errors.password?.message}
                helperText={!errors.password ? 'Mínimo 8 caracteres con mayúsculas, minúsculas y números' : undefined}
                leftIcon={<Lock size={18} />}
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (value) =>
                    value === password || 'Las contraseñas no coinciden',
                  onChange: () => trackInteraction('Input', 'change'),
                })}
                error={errors.confirmPassword?.message}
                leftIcon={<Check size={18} />}
              />
            </CardBody>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                variant="accent"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                Crear cuenta
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                  onClick={() => trackInteraction('Link', 'click')}
                >
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

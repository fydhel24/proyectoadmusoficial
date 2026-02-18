import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

// Definición de tipos para el formulario de login
type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

// Propiedades esperadas por el componente Login
interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                window.location.reload();
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Iniciar Sesión" description="Bienvenido de nuevo a Admus Production">
            <Head title="Iniciar Sesión" />

            <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Lado Izquierdo: Video de Marca */}
                <div className="hidden md:block w-1/2 relative overflow-hidden bg-brand">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                    >
                        <source src="/assets/auth/ladologinadmus.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 z-10">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Admus <span className="text-white/70">Production</span>
                        </h2>
                        <p className="text-sm font-medium text-white/80 uppercase tracking-widest mt-1">
                            Agencia de Influencers & Marketing
                        </p>
                    </div>
                </div>

                {/* Lado Derecho: Formulario de Login */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white/5 backdrop-blur-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Iniciar Sesión</h1>
                        <p className="text-slate-400 text-sm mt-2">Ingresa tus credenciales para acceder al panel.</p>
                    </div>

                    <form className="space-y-6" onSubmit={submit} noValidate>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-slate-200 font-bold text-xs uppercase tracking-widest mb-2 block">
                                    Correo Electrónico
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@admus.com"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-brand focus:ring-brand h-12"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="password" className="text-slate-200 font-bold text-xs uppercase tracking-widest block">
                                        Contraseña
                                    </Label>

                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-brand focus:ring-brand h-12"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    tabIndex={3}
                                    className="border-white/20 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                                />
                                <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none font-medium">
                                    Recordarme en este equipo
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest h-12 text-sm shadow-[0_0_20px_rgba(217,26,26,0.3)]"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Acceder al Panel"
                            )}
                        </Button>
                    </form>

                    {status && (
                        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium text-center">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Award, CheckCircle2, Clock, Eye, Rocket, Target, TrendingUp, Zap } from 'lucide-react';

interface DashboardProps extends PageProps {
    user: {
        name: string;
    };
    estadisticas: {
        pendiente: number;
        en_revision: number;
        publicada: number;
    };
}

export default function Dashboard({ user, estadisticas }: DashboardProps) {
    const breadcrumbs = [{ title: 'Panel de Control', href: '/dashboard' }];

    const totalTareas = estadisticas.pendiente + estadisticas.en_revision + estadisticas.publicada;
    const completionRate = totalTareas > 0 ? (estadisticas.publicada / totalTareas) * 100 : 0;
    const inProgressRate = totalTareas > 0 ? (estadisticas.en_revision / totalTareas) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard | Admus Productions" />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Welcome Hero Section */}
                    <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 p-8 text-white shadow-2xl md:p-14 lg:p-20 dark:bg-indigo-900">
                        <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl md:h-32 md:w-32">
                                <Rocket className="h-12 w-12 animate-bounce text-white md:h-16 md:w-16" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-orbitron text-4xl font-black tracking-tight uppercase md:text-6xl">
                                    HOLA, {user.name.split(' ')[0]}
                                </h1>
                                <p className="max-w-2xl text-lg font-medium text-indigo-100">
                                    Este es tu centro de rendimiento. Aquí puedes ver el impacto de tu contenido y tu progreso en las campañas
                                    actuales.
                                </p>
                                {totalTareas > 0 && (
                                    <Badge className="bg-white/20 px-4 py-1.5 text-sm font-black tracking-widest text-white uppercase backdrop-blur-md">
                                        <Award className="mr-2 h-4 w-4 text-amber-400" />
                                        {completionRate.toFixed(1)}% DE ÉXITO COMPLETADO
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Abstract background effects */}
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                        <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    </div>

                    {/* Fast Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Pendientes"
                            value={estadisticas.pendiente}
                            icon={<Clock className="h-6 w-6" />}
                            color="bg-amber-500"
                            desc="Por completar"
                        />
                        <StatCard
                            label="En Revisión"
                            value={estadisticas.en_revision}
                            icon={<Eye className="h-6 w-6" />}
                            color="bg-blue-600"
                            desc="Esperando aprobación"
                        />
                        <StatCard
                            label="Publicadas"
                            value={estadisticas.publicada}
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            color="bg-emerald-600"
                            desc="Completadas con éxito"
                        />
                        <StatCard
                            label="Total Tareas"
                            value={totalTareas}
                            icon={<Activity className="h-6 w-6" />}
                            color="bg-slate-900"
                            desc="Récord de gestión"
                        />
                    </div>

                    {/* Detailed Performance */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <Card className="rounded-[2.5rem] border-0 bg-white shadow-xl dark:bg-slate-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight uppercase">
                                    <Target className="h-6 w-6 text-red-600" />
                                    Métricas de Eficacia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black tracking-widest text-slate-500 uppercase">Tasa de Finalización</span>
                                        <span className="text-lg font-black text-emerald-600">{completionRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress
                                        value={completionRate}
                                        className="h-4 bg-slate-100 dark:bg-slate-800"
                                        indicatorClassName="bg-emerald-500"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black tracking-widest text-slate-500 uppercase">Tareas en Proceso</span>
                                        <span className="text-lg font-black text-blue-600">{inProgressRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress
                                        value={inProgressRate}
                                        className="h-4 bg-slate-100 dark:bg-slate-800"
                                        indicatorClassName="bg-blue-600"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-0 bg-gradient-to-br from-slate-900 to-black p-8 text-white shadow-xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
                                <Zap className="h-40 w-40" />
                            </div>
                            <div className="relative z-10 space-y-6 text-center">
                                <h3 className="text-2xl font-black tracking-tight uppercase">¡MANTÉN EL RITMO!</h3>
                                <p className="font-medium text-slate-400 italic">
                                    "La persistencia es el camino del éxito. Cada publicación es un paso más hacia tus metas."
                                </p>
                                <button className="mt-4 rounded-full bg-red-600 px-8 py-3 font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700">
                                    GESTIONAR MIS TAREAS
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Empty State / Welcome Message */}
                    {totalTareas === 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-5 flex flex-col items-center justify-center space-y-4 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 py-20 duration-700 dark:border-slate-800 dark:bg-slate-900/50">
                            <TrendingUp className="h-16 w-16 text-slate-300" />
                            <h3 className="text-xl font-black tracking-tight text-slate-600 uppercase dark:text-slate-400">
                                ¡Comienza tu aventura ahora!
                            </h3>
                            <p className="max-w-sm px-6 text-center text-sm font-medium text-slate-400">
                                Aún no tienes tareas asignadas. Pronto comenzarás a crear contenido increíble. ¡Prepárate para brillar!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon, color, desc }: any) {
    return (
        <Card className="overflow-hidden border-0 shadow-lg transition-all hover:scale-[1.03]">
            <CardContent className="flex items-center gap-5 p-6 md:p-8">
                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-xl ${color}`}>{icon}</div>
                <div>
                    <p className="mb-1 text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
                    <p className="text-4xl leading-none font-black text-slate-900 dark:text-white">{value}</p>
                    <p className="mt-2 text-[10px] font-black tracking-tighter text-slate-400 uppercase opacity-70">{desc}</p>
                </div>
            </CardContent>
        </Card>
    );
}

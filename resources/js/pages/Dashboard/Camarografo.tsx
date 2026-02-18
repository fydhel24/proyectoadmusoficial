'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, CheckCircle2, Clock, Film, History, Star, Target, TrendingUp } from 'lucide-react';

interface DashboardProps extends PageProps {
    user: {
        name: string;
    };
    estadisticas: {
        pendiente: number;
        completado: number;
    };
    totalTareas: number;
    completadasSemana: number;
    ultimaTarea: {
        titulo: string;
        fecha: string;
    } | null;
    estadoFrecuente: string | null;
}

export default function Dashboard({ user, estadisticas, totalTareas, completadasSemana, ultimaTarea, estadoFrecuente }: DashboardProps) {
    const breadcrumbs = [{ title: 'Panel de Control', href: '/dashboard' }];

    const completionRate = totalTareas > 0 ? (estadisticas.completado / totalTareas) * 100 : 0;
    const progressTrend = completadasSemana > 0 ? `+${completadasSemana} esta semana` : 'Sin actividad esta semana';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Camarógrafo | Admus Productions" />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Cinematic Welcome Section */}
                    <div className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl md:p-16 dark:bg-slate-900">
                        <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
                            <div className="animate-in zoom-in flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-red-600 to-red-800 shadow-2xl duration-500 md:h-32 md:w-32">
                                <Film className="h-12 w-12 text-white md:h-16 md:w-16" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-orbitron text-4xl font-black tracking-tight uppercase md:text-6xl">
                                    ¡HOLA, <span className="text-red-600">{user.name.split(' ')[0]}</span>!
                                </h1>
                                <p className="max-w-2xl text-lg font-medium text-slate-400">
                                    Panel de Control - Resumen Ejecutivo de tus Grabaciones. <br />
                                    Capturando momentos, creando historias.
                                </p>
                                {totalTareas > 0 && (
                                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                        <Badge className="border-white/10 bg-white/10 px-4 py-1.5 text-xs font-black tracking-widest text-white uppercase backdrop-blur-md">
                                            <Target className="mr-2 h-4 w-4 text-red-500" />
                                            EFICACIA: {completionRate.toFixed(1)}%
                                        </Badge>
                                        <Badge className="border-white/10 bg-white/10 px-4 py-1.5 text-xs font-black tracking-widest text-white uppercase backdrop-blur-md">
                                            <TrendingUp className="mr-2 h-4 w-4 text-emerald-500" />
                                            {progressTrend}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background visual flair */}
                        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-red-600/10 to-transparent blur-3xl" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <MetricCard
                            label="Pendientes"
                            value={estadisticas.pendiente}
                            icon={<Clock className="h-6 w-6" />}
                            color="bg-rose-600"
                            desc="Grabaciones por realizar"
                        />
                        <MetricCard
                            label="Completadas"
                            value={estadisticas.completado}
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            color="bg-emerald-600"
                            desc="Material finalizado"
                        />
                        <MetricCard
                            label="Total Proyectos"
                            value={totalTareas}
                            icon={<Activity className="h-6 w-6" />}
                            color="bg-indigo-600"
                            desc="Volumen histórico"
                        />
                    </div>

                    {/* Secondary Data Sections */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Rendimiento Column */}
                        <div className="space-y-6">
                            <h2 className="flex items-center gap-2 text-xl font-black tracking-widest text-slate-900 uppercase dark:text-white">
                                <TrendingUp className="h-5 w-5 text-red-600" />
                                Rendimiento Semanal
                            </h2>
                            <Card className="rounded-[2rem] border-0 shadow-lg dark:bg-slate-900/50">
                                <CardContent className="space-y-6 p-8">
                                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <span>Semanal (Output):</span>
                                        </div>
                                        <Badge className="bg-indigo-600 px-4 font-black">{completadasSemana}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                                            <Star className="h-5 w-5 text-amber-500" />
                                            <span>Estado Frecuente:</span>
                                        </div>
                                        <Badge variant="outline" className="border-amber-500 px-4 font-black text-amber-600 uppercase">
                                            {estadoFrecuente || 'N/A'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progreso General Column */}
                        <div className="space-y-6">
                            <h2 className="flex items-center gap-2 text-xl font-black tracking-widest text-slate-900 uppercase dark:text-white">
                                <Target className="h-5 w-5 text-red-600" />
                                Progreso General
                            </h2>
                            <Card className="rounded-[2rem] border-0 shadow-lg dark:bg-slate-900/50">
                                <CardContent className="space-y-8 p-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black tracking-[0.1em] text-slate-500 uppercase">Tasa de Finalización</span>
                                            <span className="text-lg font-black text-emerald-600">{completionRate.toFixed(1)}%</span>
                                        </div>
                                        <Progress
                                            value={completionRate}
                                            className="h-4 bg-slate-100 dark:bg-slate-800"
                                            indicatorClassName="bg-gradient-to-r from-emerald-500 to-indigo-600"
                                        />
                                    </div>

                                    <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                                        <div className="mb-4 flex items-center gap-2 text-sm font-black tracking-widest text-slate-400 uppercase">
                                            <History className="h-4 w-4" />
                                            Último material entregado
                                        </div>
                                        {ultimaTarea ? (
                                            <div className="space-y-1 rounded-2xl bg-slate-900 p-4 text-white shadow-xl">
                                                <h4 className="line-clamp-1 font-black tracking-tight text-red-500 uppercase">
                                                    {ultimaTarea.titulo}
                                                </h4>
                                                <p className="text-[11px] font-bold text-slate-400">
                                                    {new Date(ultimaTarea.fecha).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center font-medium text-slate-400 italic">
                                                No se han registrado entregas aún.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function MetricCard({ label, value, icon, color, desc }: any) {
    return (
        <Card className="overflow-hidden border-0 shadow-lg transition-all hover:translate-y-[-4px] hover:shadow-2xl">
            <CardContent className="flex items-center gap-5 p-6 md:p-8">
                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-xl ${color}`}>{icon}</div>
                <div>
                    <p className="mb-1 text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
                    <p className="text-4xl leading-none font-black text-slate-900 dark:text-white">{value}</p>
                    <p className="mt-2 text-[10px] leading-none font-bold tracking-tighter text-slate-400 uppercase opacity-80">{desc}</p>
                </div>
            </CardContent>
        </Card>
    );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, CheckCircle2, Clock, Eye, Film, History, Rocket, Star, Target, TrendingUp, Video } from 'lucide-react';

interface DashboardProps extends PageProps {
    user: {
        name: string;
    };
    estadisticas: {
        pendiente: number;
        revision: number;
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
    const revisionRate = totalTareas > 0 ? (estadisticas.revision / totalTareas) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Editor | Admus Productions" />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Creative Studio Welcome Section */}
                    <div className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 text-white shadow-2xl md:p-16">
                        <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
                            <div className="animate-in zoom-in flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl duration-500 md:h-32 md:w-32">
                                <Video className="h-12 w-12 text-white md:h-16 md:w-16" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-orbitron text-4xl font-black tracking-tight uppercase md:text-6xl">
                                    ¡HOLA, <span className="text-indigo-500">{user.name.split(' ')[0]}</span>!
                                </h1>
                                <p className="max-w-2xl text-lg font-medium text-slate-400">
                                    Creative Studio - Panel de Control del Editor. <br />
                                    Donde el metraje se convierte en arte cinematográfico.
                                </p>
                                {totalTareas > 0 && (
                                    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                        <Badge className="border-white/10 bg-white/10 px-4 py-1.5 text-xs font-black tracking-widest text-white uppercase backdrop-blur-md">
                                            <Target className="mr-2 h-4 w-4 text-indigo-400" />
                                            COMPLETADO: {completionRate.toFixed(1)}%
                                        </Badge>
                                        <Badge className="border-white/10 bg-white/10 px-4 py-1.5 text-xs font-black tracking-widest text-white uppercase backdrop-blur-md">
                                            <Rocket className="mr-2 h-4 w-4 text-amber-500" />
                                            {completadasSemana} ESTA SEMANA
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Background visual flair */}
                        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-indigo-600/10 to-transparent opacity-50 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-gradient-to-tr from-purple-600/10 to-transparent opacity-30 blur-3xl" />
                    </div>

                    {/* Editor Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            label="Pendientes"
                            value={estadisticas.pendiente}
                            icon={<Clock className="h-6 w-6" />}
                            color="bg-rose-500"
                            desc="Cola de edición"
                        />
                        <MetricCard
                            label="En Revisión"
                            value={estadisticas.revision}
                            icon={<Eye className="h-6 w-6" />}
                            color="bg-amber-500"
                            desc="Feedback pendiente"
                        />
                        <MetricCard
                            label="Completadas"
                            value={estadisticas.completado}
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            color="bg-emerald-600"
                            desc="Renderizados finales"
                        />
                        <MetricCard
                            label="Total Proyectos"
                            value={totalTareas}
                            icon={<Activity className="h-6 w-6" />}
                            color="bg-indigo-600"
                            desc="Histórico de edición"
                        />
                    </div>

                    {/* Analytics & Performance */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Efficiency Card */}
                        <div className="space-y-6">
                            <h2 className="flex items-center gap-2 text-xl font-black tracking-widest text-slate-900 uppercase dark:text-white">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                KPIs de Producción
                            </h2>
                            <Card className="overflow-hidden rounded-[2.5rem] border-0 shadow-lg dark:bg-slate-900/50">
                                <CardContent className="space-y-6 p-8">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center justify-between rounded-3xl bg-slate-900 p-5 text-white shadow-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-2xl bg-white/10 p-3">
                                                    <Film className="h-6 w-6 text-indigo-400" />
                                                </div>
                                                <span className="font-bold tracking-tight uppercase">Output Semanal</span>
                                            </div>
                                            <span className="text-3xl font-black">{completadasSemana}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-2xl bg-amber-500/10 p-3">
                                                    <Star className="h-6 w-6 text-amber-500" />
                                                </div>
                                                <span className="font-bold tracking-tight text-slate-700 uppercase dark:text-slate-300">
                                                    Status Dominante
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="h-fit border-amber-500 px-6 py-1 font-black text-amber-600 uppercase">
                                                {estadoFrecuente || 'N/A'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progress Tracker */}
                        <div className="space-y-6">
                            <h2 className="flex items-center gap-2 text-xl font-black tracking-widest text-slate-900 uppercase dark:text-white">
                                <Target className="h-5 w-5 text-indigo-600" />
                                Pipeline de Entrega
                            </h2>
                            <Card className="rounded-[2.5rem] border-0 shadow-lg dark:bg-slate-900/50">
                                <CardContent className="space-y-8 p-8">
                                    <div className="space-y-4">
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
                                            Último Master entregado
                                        </div>
                                        {ultimaTarea ? (
                                            <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-800 p-5 text-white shadow-2xl">
                                                <div className="rounded-2xl bg-white/20 p-3">
                                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="mb-1 line-clamp-1 leading-none font-black tracking-tight text-white uppercase">
                                                        {ultimaTarea.titulo}
                                                    </h4>
                                                    <p className="text-[10px] font-bold tracking-widest text-white/60">
                                                        {new Date(ultimaTarea.fecha).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center font-medium text-slate-400 italic dark:border-slate-700 dark:bg-slate-800/50">
                                                Iniciando el pipeline de producción
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
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:translate-y-[-6px] hover:shadow-2xl">
            <CardContent className="relative flex items-center gap-5 p-6 md:p-8">
                <div
                    className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-xl ${color} transition-transform group-hover:scale-110`}
                >
                    {icon}
                </div>
                <div className="z-10">
                    <p className="mb-1 text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
                    <p className="text-4xl leading-none font-black text-slate-900 dark:text-white">{value}</p>
                    <p className="mt-2 text-[10px] leading-none font-bold tracking-tighter text-slate-400 uppercase opacity-80">{desc}</p>
                </div>
                <div className="absolute right-0 bottom-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">{icon}</div>
            </CardContent>
        </Card>
    );
}

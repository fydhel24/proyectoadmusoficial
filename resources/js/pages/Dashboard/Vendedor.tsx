'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, CheckCircle2, ChevronRight, PieChart, Target, TrendingUp, XCircle } from 'lucide-react';
import { FC } from 'react';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}

interface Estadisticas {
    total: number;
    completado: number;
    en_proceso: number;
    sin_exito: number;
}

interface EmpresaDashboardProps {
    user: User;
    estadisticas: Estadisticas;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const SalesDashboard: FC<EmpresaDashboardProps> = ({ user, estadisticas }) => {
    const winRate = estadisticas.total > 0 ? ((estadisticas.completado / estadisticas.total) * 100).toFixed(1) : '0';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Ventas | Admus Productions" />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Sales Performance Welcome */}
                    <div className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl md:p-14">
                        <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
                            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl md:h-32 md:w-32">
                                <Target className="h-12 w-12 animate-pulse text-white md:h-16 md:w-16" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="font-orbitron text-4xl font-black tracking-tight uppercase md:text-6xl">
                                    VENTAS <span className="text-blue-500">PRO</span>
                                </h1>
                                <p className="max-w-2xl text-lg leading-relaxed font-medium text-slate-400">
                                    ¡Hola, <span className="font-black text-white">{user.name.split(' ')[0]}</span>! Bienvenida a tu centro de
                                    inteligencia comercial. Aquí puedes rastrear cada oportunidad y cerrar cada trato.
                                </p>
                                <div className="flex items-center justify-center gap-4 md:justify-start">
                                    <Badge className="border border-blue-500/20 bg-blue-600/20 px-4 py-1.5 text-xs font-black tracking-widest text-blue-400 uppercase backdrop-blur-md">
                                        Pipeline Activo
                                    </Badge>
                                    <Badge className="border border-emerald-500/20 bg-emerald-600/20 px-4 py-1.5 text-xs font-black tracking-widest text-emerald-400 uppercase backdrop-blur-md">
                                        Eficacia: {winRate}%
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Decorative flair */}
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-blue-600/5 to-transparent opacity-50 blur-3xl" />
                    </div>

                    {/* Sales Metrics Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            label="Oportunidades"
                            value={estadisticas.total}
                            icon={<PieChart className="h-6 w-6" />}
                            color="bg-slate-900"
                            desc="Histórico total"
                        />
                        <MetricCard
                            label="En Negociación"
                            value={estadisticas.en_proceso}
                            icon={<Activity className="h-6 w-6" />}
                            color="bg-amber-500"
                            desc="Cierres próximos"
                        />
                        <MetricCard
                            label="Cerrados OK"
                            value={estadisticas.completado}
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            color="bg-emerald-600"
                            desc="Ventas exitosas"
                        />
                        <MetricCard
                            label="Sin Cierre"
                            value={estadisticas.sin_exito}
                            icon={<XCircle className="h-6 w-6" />}
                            color="bg-rose-600"
                            desc="Lecciones aprendidas"
                        />
                    </div>

                    {/* Pipeline View / Action Section */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-xl lg:col-span-2 dark:bg-slate-900/50">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight uppercase">
                                    <TrendingUp className="h-7 w-7 text-blue-600" />
                                    Análisis de Embudo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 p-8 pt-6">
                                <div className="space-y-6">
                                    <FunnelItem label="Prospección & Inicio" count={estadisticas.total} percentage={100} color="bg-slate-800" />
                                    <FunnelItem
                                        label="En Negociación Activa"
                                        count={estadisticas.en_proceso}
                                        percentage={estadisticas.total > 0 ? (estadisticas.en_proceso / estadisticas.total) * 100 : 0}
                                        color="bg-amber-500"
                                    />
                                    <FunnelItem
                                        label="Cierres Confirmados"
                                        count={estadisticas.completado}
                                        percentage={estadisticas.total > 0 ? (estadisticas.completado / estadisticas.total) * 100 : 0}
                                        color="bg-emerald-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="group relative h-full overflow-hidden rounded-[2.5rem] border-0 bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                                <CardContent className="relative z-10 flex h-full flex-col justify-between p-8">
                                    <div className="space-y-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-lg">
                                            <TrendingUp className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="text-2xl leading-tight font-black uppercase">IMPULSA TUS VENTAS HOY</h3>
                                        <p className="mb-6 font-medium text-blue-100 opacity-80">
                                            Sigue gestionando tus prospectos para alcanzar tus objetivos mensuales. ¡Tú tienes el control!
                                        </p>
                                    </div>
                                    <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-black tracking-widest text-blue-600 uppercase transition-colors hover:bg-slate-50">
                                        IR A SEGUIMIENTOS
                                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </CardContent>
                                <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

function MetricCard({ label, value, icon, color, desc }: any) {
    return (
        <Card className="overflow-hidden border-0 shadow-lg transition-all hover:translate-y-[-6px] hover:shadow-2xl">
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

function FunnelItem({ label, count, percentage, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black tracking-widest text-slate-500 uppercase">
                <span>{label}</span>
                <span className="font-black text-slate-900 dark:text-white">
                    {count} ({percentage.toFixed(0)}%)
                </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/50">
                <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

export default SalesDashboard;

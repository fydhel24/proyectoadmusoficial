'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Activity, CheckCircle2, Clock, Eye, LayoutDashboard, Settings, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/estadisticas-completas')
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <Head title="Cargando Dashboard | Admus Productions" />
                <div className="container mx-auto space-y-8 p-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!data) return null;

    const totalTareas = data.tareas?.total || 0;
    const tareasPublicadas = data.tareas?.publicada || 0;
    const tareasEnRevision = data.tareas?.en_revision || 0;
    const tareasPendientes = data.tareas?.pendiente || 0;
    const totalUsuarios = data.usuarios?.total_usuarios || 0;
    const totalRoles = data.usuarios?.total_roles || 0;

    const porcentajePublicadas = totalTareas > 0 ? Math.round((tareasPublicadas / totalTareas) * 100) : 0;
    const porcentajeEnRevision = totalTareas > 0 ? Math.round((tareasEnRevision / totalTareas) * 100) : 0;
    const porcentajePendientes = totalTareas > 0 ? Math.round((tareasPendientes / totalTareas) * 100) : 0;

    return (
        <AppLayout>
            <Head title="Dashboard Administrativo | Admus Productions" />
            <div className="container mx-auto space-y-10 p-6 lg:p-10">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-orbitron flex items-center gap-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white">
                            <LayoutDashboard className="h-8 w-8 text-red-600" />
                            DASHBOARD DE GESTIÓN
                        </h1>
                        <p className="font-medium text-slate-500 dark:text-slate-400">Panel administrativo y métricas del sistema.</p>
                    </div>
                    <Badge
                        variant="outline"
                        className="w-fit gap-2 border-green-200 bg-green-50 px-4 py-1.5 text-green-700 shadow-sm dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
                    >
                        <Activity className="h-4 w-4 animate-pulse" />
                        Sistema Activo
                    </Badge>
                </div>

                {/* User Stats Sections */}
                <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-slate-800 uppercase dark:text-slate-200">
                        <Users className="h-5 w-5 text-red-600" />
                        Gestión de Usuarios
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="group relative overflow-hidden border-0 shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                                <Users className="h-20 w-20" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black tracking-widest text-slate-500 uppercase">Total Usuarios</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-900 dark:text-white">{totalUsuarios}</div>
                                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-green-600">
                                    <UserCheck className="h-3 w-3" />
                                    Cuentas registradas
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group relative overflow-hidden border-0 shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                                <Settings className="h-20 w-20" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black tracking-widest text-slate-500 uppercase">Total Roles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-900 dark:text-white">{totalRoles}</div>
                                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
                                    <Settings className="h-3 w-3" />
                                    Perfiles configurados
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Task Stats Section */}
                <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-slate-800 uppercase dark:text-slate-200">
                        <CheckCircle2 className="h-5 w-5 text-red-600" />
                        Métricas de Tareas del Mes
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Total Tareas"
                            value={totalTareas}
                            icon={<Activity className="h-5 w-5" />}
                            trend="Gestión global"
                            color="bg-slate-900 dark:bg-slate-800"
                        />
                        <StatCard
                            label="Publicadas"
                            value={tareasPublicadas}
                            icon={<CheckCircle2 className="h-5 w-5" />}
                            trend={`${porcentajePublicadas}% completado`}
                            color="bg-emerald-600"
                        />
                        <StatCard
                            label="En Revisión"
                            value={tareasEnRevision}
                            icon={<Eye className="h-5 w-5" />}
                            trend={`${porcentajeEnRevision}% en cola`}
                            color="bg-amber-500"
                        />
                        <StatCard
                            label="Pendientes"
                            value={tareasPendientes}
                            icon={<Clock className="h-5 w-5" />}
                            trend={`${porcentajePendientes}% sin iniciar`}
                            color="bg-rose-600"
                        />
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-black tracking-tight uppercase">Distribución de Estados</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ProgressItem label="Publicadas" percentage={porcentajePublicadas} color="bg-emerald-500" value={tareasPublicadas} />
                            <ProgressItem label="En Revisión" percentage={porcentajeEnRevision} color="bg-amber-500" value={tareasEnRevision} />
                            <ProgressItem label="Pendientes" percentage={porcentajePendientes} color="bg-rose-500" value={tareasPendientes} />
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-red-600 to-red-800 text-white shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-black tracking-tight text-white/90 uppercase">Eficacia Operativa</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <div className="relative flex items-center justify-center">
                                <svg className="h-40 w-40">
                                    <circle
                                        className="text-white/20"
                                        strokeWidth="12"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="70"
                                        cx="80"
                                        cy="80"
                                    />
                                    <circle
                                        className="text-white transition-all duration-1000 ease-out"
                                        strokeWidth="12"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * porcentajePublicadas) / 100}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="70"
                                        cx="80"
                                        cy="80"
                                    />
                                </svg>
                                <span className="absolute text-3xl font-black">{porcentajePublicadas}%</span>
                            </div>
                            <p className="mt-6 text-center text-sm font-medium text-white/80">
                                Has completado el <span className="font-black text-white">{porcentajePublicadas}%</span> de las tareas asignadas este
                                mes.
                                <br />
                                Mantén el ritmo acelerado para alcanzar los objetivos.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon, trend, color }: any) {
    return (
        <Card className={`overflow-hidden border-0 text-white ${color} transform shadow-xl transition-transform hover:scale-105`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between opacity-80">
                    <p className="text-xs font-black tracking-widest uppercase">{label}</p>
                    {icon}
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-black">{value}</h3>
                    <p className="mt-1 text-[10px] font-bold tracking-tighter uppercase opacity-70">{trend}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ProgressItem({ label, percentage, color, value }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                    {label} ({value})
                </span>
                <span className="font-black text-slate-900 dark:text-white">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" indicatorClassName={color} />
        </div>
    );
}

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, CheckCircle2, FileText, Link2, PieChart, RefreshCcw, Users, Video } from 'lucide-react';
import { FC } from 'react';
import { FaTiktok } from 'react-icons/fa';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}
interface Estadisticas {
    total: number;
    pendiente: number;
    en_revision: number;
    publicada: number;
}
interface Tarea {
    id: number;
    titulo: string;
    prioridad: string;
    fecha: string;
    descripcion: string;
    created_at: string;
}
interface TareaAsignada {
    id: number;
    tarea: Tarea;
    user: { id: number; name: string };
}
interface Influencer {
    id: number;
    user: { id: number; name: string };
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}
interface Campania {
    id: number;
    company: { id: number; name: string };
    link: { id: number; link: string };
    comprobante: { id: number; detalle: string };
    fecha: string;
}
interface MarketingDashboardProps {
    user: User;
    estadisticas: Estadisticas;
    tareas: TareaAsignada[];
    influencers: Influencer[];
    campanias: Campania[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const MarketingDashboard: FC<MarketingDashboardProps> = ({ user, estadisticas, tareas, influencers, campanias }) => {
    const handleGeneratePdf = async (type: 'influencers' | 'camarografos') => {
        const url = type === 'influencers' ? '/disponibilidad-semanal-pdf' : '/generar-pdf-disponibilidad';
        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Marketing | Admus Productions" />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Hero Welcome Section */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl md:p-12 dark:bg-slate-900">
                        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-2">
                                <h1 className="font-orbitron text-4xl font-black tracking-tight md:text-6xl">
                                    HOLA, <span className="text-red-600">{user.name.split(' ')[0]}</span>
                                </h1>
                                <p className="text-lg font-medium text-slate-400">Bienvenido al centro de mando de Marketing.</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => handleGeneratePdf('influencers')}
                                    className="h-12 rounded-full bg-white font-black text-black shadow-xl transition-all hover:bg-red-600 hover:text-white"
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    PDF INFLUENCERS
                                </Button>
                                <Button
                                    onClick={() => handleGeneratePdf('camarografos')}
                                    variant="secondary"
                                    className="h-12 rounded-full font-black shadow-xl"
                                >
                                    <FileText className="mr-2 h-5 w-5" />
                                    PDF CAMARÓGRAFOS
                                </Button>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Tareas" value={estadisticas.total} icon={<PieChart className="h-6 w-6" />} color="bg-blue-600" />
                        <StatCard title="Pendientes" value={estadisticas.pendiente} icon={<RefreshCcw className="h-6 w-6" />} color="bg-amber-500" />
                        <StatCard
                            title="En Revisión"
                            value={estadisticas.en_revision}
                            icon={<Activity className="h-6 w-6" />}
                            color="bg-indigo-600"
                        />
                        <StatCard
                            title="Publicadas"
                            value={estadisticas.publicada}
                            icon={<CheckCircle2 className="h-6 w-6" />}
                            color="bg-emerald-600"
                        />
                    </div>

                    {/* Detailed Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Task List Section */}
                        <ContentCard title="Últimas Tareas" icon={<FileText className="h-5 w-5 text-red-600" />} count={tareas.length}>
                            <div className="space-y-4">
                                {tareas.length > 0 ? (
                                    tareas.map((t) => (
                                        <div
                                            key={t.id}
                                            className="group relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{t.tarea.titulo}</h4>
                                                <Badge
                                                    className={
                                                        t.tarea.prioridad === 'alta' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                                    }
                                                >
                                                    {t.tarea.prioridad}
                                                </Badge>
                                            </div>
                                            <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase">
                                                <Calendar className="h-3 w-3" /> {t.tarea.fecha}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2 border-t border-slate-50 pt-3 dark:border-slate-800">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black">
                                                    {t.user?.name.charAt(0)}
                                                </div>
                                                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                    {t.user?.name || 'Sin asignar'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center font-medium text-slate-400 italic">No hay tareas recientes</div>
                                )}
                            </div>
                        </ContentCard>

                        {/* Recent Publications */}
                        <ContentCard title="Publicaciones" icon={<Video className="h-5 w-5 text-red-600" />} count={campanias.length}>
                            <div className="space-y-4">
                                {campanias.length > 0 ? (
                                    campanias.map((c) => (
                                        <div
                                            key={c.id}
                                            className="group relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                                                <FaTiktok className="text-xl" />
                                            </div>
                                            <div className="flex-grow space-y-1">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.company?.name || 'Empresa'}</h4>
                                                <a
                                                    href={c.link?.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-black text-red-600 hover:underline"
                                                >
                                                    <Link2 className="h-3 w-3" /> VER CONTENIDO
                                                </a>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{c.fecha}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center font-medium text-slate-400 italic">No hay publicaciones</div>
                                )}
                            </div>
                        </ContentCard>

                        {/* Available Influencers */}
                        <ContentCard title="Influencers Hoy" icon={<Users className="h-5 w-5 text-red-600" />} count={influencers.length}>
                            <div className="space-y-4">
                                {influencers.length > 0 ? (
                                    influencers.map((inf) => (
                                        <div
                                            key={inf.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-sm font-black text-white">
                                                    {inf.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{inf.user.name}</h4>
                                                    <Badge variant="outline" className="h-5 py-0 text-[10px] font-black tracking-widest uppercase">
                                                        {inf.turno}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] font-black tracking-tighter whitespace-nowrap text-slate-400 uppercase">
                                                    {inf.start_time} - {inf.end_time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center font-medium text-slate-400 italic">Sin influencers disponibles hoy</div>
                                )}
                            </div>
                        </ContentCard>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: JSX.Element; color: string }) => (
    <Card className="overflow-hidden border-0 shadow-xl transition-all hover:scale-[1.02]">
        <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${color}`}>{icon}</div>
            <div>
                <p className="text-xs font-black tracking-widest text-slate-400 uppercase">{title}</p>
                <p className="mt-1 text-3xl leading-none font-black text-slate-900 dark:text-white">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const ContentCard = ({ title, icon, count, children }: { title: string; icon: JSX.Element; count: number; children: React.ReactNode }) => (
    <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight uppercase">
                {icon}
                {title}
            </CardTitle>
            <Badge className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 p-0 font-black text-white">{count}</Badge>
        </CardHeader>
        <CardContent className="px-0">{children}</CardContent>
    </Card>
);

export default MarketingDashboard;

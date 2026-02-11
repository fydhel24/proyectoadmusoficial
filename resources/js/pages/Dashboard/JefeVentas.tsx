'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bell, Construction, Settings, TrendingUp } from 'lucide-react';
import { FC } from 'react';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}

interface JefeVentasDashboardProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const JefeVentasDashboard: FC<JefeVentasDashboardProps> = ({ user }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerencia de Ventas | Admus Productions" />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Executive Branding Header */}
                    <div className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl md:p-14">
                        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-white/10 shadow-2xl md:h-32 md:w-32">
                                    <AvatarImage src={user.profile_photo_url || ''} className="object-cover" />
                                    <AvatarFallback className="bg-slate-800 text-3xl font-black">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <h1 className="font-orbitron text-3xl font-black tracking-tight uppercase md:text-5xl">{user.name}</h1>
                                    <p className="text-lg leading-none font-bold tracking-widest text-slate-400 uppercase">GERENCIA DE VENTAS</p>
                                    <Badge variant="outline" className="border-white/20 bg-white/5 px-4 font-medium text-white/60">
                                        {user.email}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                                    <Bell className="h-5 w-5 text-white" />
                                </button>
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                                    <Settings className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Abstract background flair */}
                        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-red-600/5 to-transparent opacity-30 blur-[100px]" />
                    </div>

                    {/* Roadmap / Coming Soon Section */}
                    <Card className="rounded-[4rem] border-0 bg-white py-20 shadow-2xl dark:bg-slate-900/50">
                        <CardContent className="flex flex-col items-center justify-center space-y-8 px-6 text-center">
                            <div className="relative">
                                <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-[2.5rem] bg-red-600/10">
                                    <TrendingUp className="h-12 w-12 text-red-600" />
                                </div>
                                <div className="absolute -top-2 -right-2 rounded-full border-4 border-white bg-slate-900 p-2 text-white shadow-lg">
                                    <Construction className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="max-w-2xl space-y-4">
                                <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase sm:text-4xl dark:text-white">
                                    ESTADÍSTICAS & REPORTES <br />
                                    <span className="text-red-600">EN DESARROLLO</span>
                                </h2>
                                <p className="text-lg leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                    Estamos construyendo un motor de analítica avanzado para tu gestión. Próximamente tendrás acceso a gráficos
                                    interactivos, seguimiento de KPIs en tiempo real y reportes inteligentes personalizados.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Badge
                                    variant="secondary"
                                    className="rounded-full bg-slate-100 px-6 py-2 font-bold tracking-widest uppercase dark:bg-slate-800"
                                >
                                    Gráficos BI
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full bg-slate-100 px-6 py-2 font-bold tracking-widest uppercase dark:bg-slate-800"
                                >
                                    Sales Funnel
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full bg-slate-100 px-6 py-2 font-bold tracking-widest uppercase dark:bg-slate-800"
                                >
                                    Predictive Analysis
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom visual placeholder */}
                    <div className="pointer-events-none grid grid-cols-1 gap-6 opacity-30 grayscale md:grid-cols-3">
                        <div className="h-40 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
                        <div className="h-40 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
                        <div className="h-40 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default JefeVentasDashboard;

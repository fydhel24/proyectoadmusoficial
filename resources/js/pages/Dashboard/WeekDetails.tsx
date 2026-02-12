'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Building2, Calendar, Clock, Tag, TrendingUp } from 'lucide-react';

// Interfaces
interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface Company {
    id: number;
    name: string;
}

interface SpecificWeekBooking {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    turno: string;
    day_of_week: string;
    company: Company;
}

interface SpecificWeekDetailsData {
    week: Week;
    bookings: SpecificWeekBooking[];
    unique_days_worked: number;
    companies_in_week: Company[];
}

interface WeekDetailsProps extends PageProps {
    weekData: SpecificWeekDetailsData;
    user: {
        name: string;
        email: string;
        profile_photo_url?: string;
    };
}

export default function WeekDetails({ weekData, user }: WeekDetailsProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: weekData.week.name, href: '#' },
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reporte de Semana | ${weekData.week.name}`} />

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
                <div className="mx-auto max-w-5xl space-y-8">
                    {/* Week Hero Header */}
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 px-8 py-10 text-white shadow-2xl shadow-none transition-all hover:shadow-indigo-500/10 md:px-14">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="font-orbitron text-3xl font-black tracking-tighter uppercase md:text-5xl">{weekData.week.name}</h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                                        {dayjs(weekData.week.start_date).format('DD MMM')} — {dayjs(weekData.week.end_date).format('DD MMM')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm font-black text-emerald-500 uppercase">
                                        {weekData.unique_days_worked} DÍAS COMPLETADOS
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-indigo-600/10 to-transparent opacity-50 blur-3xl" />
                    </div>

                    {/* Collaboration Section */}
                    <Card className="rounded-[2rem] border-0 bg-white shadow-xl dark:bg-slate-900/50">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                                Empresas Colaboradoras
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            {weekData.companies_in_week.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {weekData.companies_in_week.map((company) => (
                                        <Badge
                                            key={company.id}
                                            variant="secondary"
                                            className="rounded-full border-none bg-slate-100 px-6 py-2 font-black tracking-widest text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-300"
                                        >
                                            {company.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No se registraron colaboraciones específicas.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bookings Timeline */}
                    <div className="space-y-6">
                        <h2 className="flex items-center gap-2 px-2 text-xl font-black tracking-tight uppercase">
                            <Tag className="h-5 w-5 text-indigo-600" />
                            Timeline de Reservas
                        </h2>

                        {weekData.bookings.length > 0 ? (
                            <div className="space-y-4">
                                {weekData.bookings.map((booking) => (
                                    <Card
                                        key={booking.id}
                                        className="group overflow-hidden rounded-[2rem] border-0 bg-white shadow-md transition-all hover:shadow-xl dark:bg-slate-900/50"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            {/* Date/Time Left Sidebar */}
                                            <div className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50 p-6 text-center md:w-32 md:flex-col md:justify-center md:border-r md:border-b-0 dark:border-slate-800 dark:bg-slate-800/50">
                                                <p className="leading-none font-black text-slate-900 uppercase md:mb-1 dark:text-white">
                                                    {booking.day_of_week.slice(0, 3)}
                                                </p>
                                                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{booking.turno}</p>
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex flex-grow flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase transition-colors group-hover:text-indigo-600 dark:text-white">
                                                        {booking.company.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {dayjs(booking.start_time).format('HH:mm')} — {dayjs(booking.end_time).format('HH:mm')}
                                                    </div>
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-full border px-4 py-1.5 font-black tracking-widest uppercase ${getStatusColor(booking.status)}`}
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50 p-20 dark:border-slate-800 dark:bg-slate-950/50">
                                <Clock className="mb-4 h-12 w-12 text-slate-300" />
                                <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Sin actividades registradas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

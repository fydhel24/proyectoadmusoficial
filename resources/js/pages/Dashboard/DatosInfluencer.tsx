'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Calendar, Camera, ChevronRight, Clock, Eye, HandMetal, History, Target, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Interfaces
interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface DaysWorkedData {
    week_id: number;
    week_name: string;
    total_days_worked: number;
}

interface Company {
    id: number;
    name: string;
}

interface Availability {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}

interface NextBooking {
    company_name: string;
    start_time: string;
    day_of_week: string;
}

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            profile_photo_path: string | null;
        };
    };
    workingWeeks: Week[];
    daysWorkedByWeek: DaysWorkedData[];
    workedCompanies: Company[];
    availabilities: Availability[];
    totalBookings: number;
    bookingStatusCounts: { [key: string]: number };
    totalAvailabilityHours: number;
    nextBooking: NextBooking | null;
    lastWorkedCompany: string;
    averageDaysPerWeek: number;
    totalPhotos: number;
    daysWithoutAvailability: string[];
}

export default function DatosInfluencer({
    auth,
    workingWeeks,
    daysWorkedByWeek,
    workedCompanies,
    availabilities,
    totalBookings,
    bookingStatusCounts,
    totalAvailabilityHours,
    nextBooking,
    lastWorkedCompany,
    averageDaysPerWeek,
    totalPhotos,
    daysWithoutAvailability,
}: DashboardProps) {
    const [showWelcome, setShowWelcome] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowWelcome(false), 4000);
        const handleScroll = () => {
            if (window.scrollY > 100) setShowWelcome(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToContent = () => {
        setShowWelcome(false);
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const navigateToWeekDetails = (weekId: number) => {
        router.visit(route('influencer.week.details', { week: weekId }));
    };

    const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Datos de Influencer | Admus Productions" />

            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-red-600 blur-[120px]" />
                            <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-600 blur-[120px] delay-700" />
                        </div>

                        <div className="relative z-10 space-y-8 px-6 text-center">
                            <motion.div
                                animate={{ rotate: [0, 15, -10, 15, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block"
                            >
                                <HandMetal className="h-24 w-24 text-red-600 md:h-32 md:w-32" />
                            </motion.div>
                            <motion.h1
                                className="font-orbitron text-5xl font-black tracking-tighter text-white uppercase md:text-8xl"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                ¡HOLA, {auth.user.name.split(' ')[0]}!
                            </motion.h1>
                            <motion.p className="text-lg font-bold tracking-[0.3em] text-slate-400 uppercase">RESUMEN DE ACTIVIDAD</motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950" ref={contentRef}>
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Compact Profile Section */}
                    <div className="flex flex-col items-center justify-between gap-8 rounded-[3rem] border border-slate-100 bg-white p-8 shadow-xl md:flex-row dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="flex flex-col items-center gap-6 md:flex-row">
                            <Avatar className="h-24 w-24 border-2 border-red-600 shadow-xl md:h-28 md:w-28">
                                <AvatarImage src={auth.user.profile_photo_path || ''} className="object-cover" />
                                <AvatarFallback className="bg-slate-800 text-2xl font-black">{auth.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center md:text-left">
                                <h1 className="mb-2 text-3xl leading-none font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                    {auth.user.name}
                                </h1>
                                <Badge variant="secondary" className="bg-red-600/10 px-4 font-black tracking-widest text-red-600 uppercase">
                                    CENTRO DE DATOS
                                </Badge>
                            </div>
                        </div>
                        <div className="grid w-full grid-cols-2 gap-4 md:w-auto md:grid-cols-4">
                            <QuickStat label="SEMANAS" value={workingWeeks.length} />
                            <QuickStat label="RESERVAS" value={totalBookings} />
                            <QuickStat label="FOTOS" value={totalPhotos} />
                            <QuickStat label="RANKING" value="TOP" />
                        </div>
                    </div>

                    {/* Experimental Grid Layout */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Left Column - Weeks & Days */}
                        <div className="space-y-6 md:col-span-8">
                            <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-xl dark:bg-slate-900/50">
                                <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl font-black uppercase">
                                        <Calendar className="h-6 w-6 text-red-600" />
                                        Semanas en Curso
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {workingWeeks.map((week) => (
                                            <div
                                                key={week.id}
                                                className="group relative h-full cursor-pointer rounded-3xl bg-slate-50 p-6 transition-all hover:bg-slate-900 hover:text-white dark:bg-slate-800/50 dark:hover:bg-indigo-600"
                                                onClick={() => navigateToWeekDetails(week.id)}
                                            >
                                                <div className="mb-4 flex items-start justify-between">
                                                    <Badge className="bg-red-600 px-3 py-1 text-[10px] font-black">{week.name}</Badge>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Eye className="h-5 w-5" />
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold opacity-60">
                                                    {dayjs(week.start_date).format('DD MMM')} — {dayjs(week.end_date).format('DD MMM')}
                                                </p>
                                                <div className="mt-4 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase group-hover:text-red-400">
                                                    Ver detalles completos <ChevronRight className="h-3 w-3" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <MetricCard
                                    label="DIAS TRABAJADOS"
                                    value={daysWorkedByWeek.length > 0 ? daysWorkedByWeek.reduce((sum, d) => sum + d.total_days_worked, 0) : 0}
                                    icon={<BarChart3 className="h-6 w-6" />}
                                    color="bg-indigo-600"
                                    desc="Impacto acumulado"
                                />
                                <MetricCard
                                    label="PROMEDIO SEMANAL"
                                    value={averageDaysPerWeek}
                                    icon={<TrendingUp className="h-6 w-6" />}
                                    color="bg-emerald-600"
                                    desc="Consistencia"
                                />
                            </div>
                        </div>

                        {/* Right Column - Availability & Status */}
                        <div className="space-y-6 md:col-span-4">
                            <Card className="relative h-full overflow-hidden rounded-[2.5rem] border-0 bg-slate-900 p-8 text-white shadow-xl">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Clock className="h-32 w-32" />
                                </div>
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl leading-none font-black uppercase">Disponibilidad</h3>
                                        <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Planning Semanal</p>
                                    </div>
                                    <div className="space-y-4">
                                        {availabilities.slice(0, 5).map((av, idx) => (
                                            <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-3">
                                                <span className="text-sm leading-none font-black uppercase opacity-60">{av.day_of_week}</span>
                                                <span className="text-xs font-bold text-indigo-400">
                                                    {av.start_time} - {av.end_time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4">
                                        <Button className="h-14 w-full rounded-2xl bg-indigo-600 font-black tracking-widest uppercase hover:bg-indigo-700">
                                            ACTUALIZAR AGENDA
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-[2.5rem] border-0 bg-white p-8 shadow-xl dark:bg-slate-900/50">
                                <h3 className="mb-6 flex items-center gap-2 text-lg font-black uppercase">
                                    <Target className="h-5 w-5 text-red-600" />
                                    Reservas
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(bookingStatusCounts).map(([status, count], i) => (
                                        <div key={i} className="group flex items-center justify-between">
                                            <span className="text-xs font-black tracking-widest text-slate-500 uppercase transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                                                {status}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-20 rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full bg-red-600"
                                                        style={{ width: `${(count / totalBookings) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-lg font-black">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Lower Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <MetricCard
                            label="PROXIMA CITA"
                            value={nextBooking ? nextBooking.company_name : 'SIN RESERVAS'}
                            icon={<Zap className="h-6 w-6" />}
                            color="bg-amber-500"
                            desc={nextBooking ? `${nextBooking.day_of_week} • ${nextBooking.start_time}` : 'Nada programado'}
                            isText
                        />
                        <MetricCard
                            label="ULTIMA MARCA"
                            value={lastWorkedCompany || 'N/A'}
                            icon={<History className="h-6 w-6" />}
                            color="bg-slate-900"
                            desc="Colaboración más reciente"
                            isText
                        />
                        <MetricCard
                            label="ASSETS DE PERFIL"
                            value={totalPhotos}
                            icon={<Camera className="h-6 w-6" />}
                            color="bg-rose-600"
                            desc="Fotos y material visual"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function QuickStat({ label, value }: { label: string; value: any }) {
    return (
        <div className="text-center md:text-left">
            <p className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">{label}</p>
            <p className="text-xl leading-none font-black text-slate-900 dark:text-white">{value}</p>
        </div>
    );
}

function MetricCard({ label, value, icon, color, desc, isText }: any) {
    return (
        <Card className="overflow-hidden border-0 shadow-lg transition-all hover:scale-[1.02]">
            <CardContent className="flex items-center gap-5 p-6 md:p-8">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl ${color}`}>{icon}</div>
                <div>
                    <p className="mb-1 text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
                    <p className={`leading-none font-black text-slate-900 dark:text-white ${isText ? 'line-clamp-1 text-lg' : 'text-3xl'}`}>
                        {value}
                    </p>
                    <p className="mt-2 text-[10px] leading-none font-bold tracking-tighter text-slate-400 uppercase opacity-70">{desc}</p>
                </div>
            </CardContent>
        </Card>
    );
}

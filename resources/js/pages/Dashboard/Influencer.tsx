'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart3, Calendar, Clock, HandMetal, MapPin, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Interfaces
interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface DaysWorkedData {
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

// Función para traducir días de la semana de inglés a español
const translateDayToSpanish = (day: string): string => {
    const daysMap: { [key: string]: string } = {
        Monday: 'Lunes',
        Tuesday: 'Martes',
        Wednesday: 'Miércoles',
        Thursday: 'Jueves',
        Friday: 'Viernes',
        Saturday: 'Sábado',
        Sunday: 'Domingo',
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };
    return daysMap[day] || day;
};

export default function InfluencerDashboard({
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

    const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Influencer Dashboard | Admus Productions" />

            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
                        {/* Background VFX */}
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
                                HOLA, {auth.user.name.split(' ')[0]}
                            </motion.h1>
                            <motion.p
                                className="text-lg font-bold tracking-[0.3em] text-slate-400 uppercase"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                PREPARANDO TU PERFORMANCE CENTER
                            </motion.p>

                            <motion.div className="pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                                <Button
                                    onClick={scrollToContent}
                                    variant="outline"
                                    className="rounded-full border-2 border-white/20 px-8 py-6 text-white transition-all duration-300 hover:bg-white hover:text-black"
                                >
                                    ENTRAR AL PANEL
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-950" ref={contentRef}>
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Hero Profile Section */}
                    <div className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl md:p-14">
                        <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
                            <div className="relative">
                                <Avatar className="h-32 w-32 border-4 border-white/10 shadow-2xl md:h-44 md:w-44">
                                    <AvatarImage src={auth.user.profile_photo_path || ''} className="object-cover" />
                                    <AvatarFallback className="bg-slate-800 text-4xl font-black uppercase">{auth.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -right-2 -bottom-2 rounded-full bg-red-600 p-3 shadow-lg ring-4 ring-slate-900 transition-transform hover:scale-110">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <div className="flex-grow space-y-4 text-center md:text-left">
                                <div className="space-y-1">
                                    <h1 className="font-orbitron text-4xl font-black tracking-tighter uppercase md:text-6xl">{auth.user.name}</h1>
                                    <p className="text-xl font-bold tracking-widest text-red-500 uppercase">INFLUENCER</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-red-600/10 to-transparent blur-3xl" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            label="PROMEDIO SEMANAL"
                            value={averageDaysPerWeek}
                            icon={<Activity className="h-6 w-6" />}
                            color="bg-indigo-600"
                            desc="Días de impacto"
                        />
                        <MetricCard
                            label="PROXIMA RESERVA"
                            value={nextBooking ? nextBooking.company_name : 'N/A'}
                            icon={<Calendar className="h-6 w-6" />}
                            color="bg-red-600"
                            desc={
                                nextBooking ? `${translateDayToSpanish(nextBooking.day_of_week)} • ${nextBooking.start_time}` : 'Sin eventos próximos'
                            }
                            isText
                        />
                        <MetricCard
                            label="HORAS DISPONIBLES"
                            value={totalAvailabilityHours}
                            icon={<Clock className="h-6 w-6" />}
                            color="bg-amber-500"
                            desc="Capacidad mensual"
                        />
                        <MetricCard
                            label="ULTIMA MARCA"
                            value={lastWorkedCompany || 'N/A'}
                            icon={<MapPin className="h-6 w-6" />}
                            color="bg-emerald-600"
                            desc="Colaboración reciente"
                            isText
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Weekly Activity */}
                        <Card className="overflow-hidden rounded-[3rem] border-0 bg-white shadow-xl lg:col-span-2 dark:bg-slate-900/50">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight uppercase">
                                    <BarChart3 className="h-7 w-7 text-indigo-600" />
                                    Performance por Semana
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    {daysWorkedByWeek.map((data, idx) => (
                                        <div
                                            key={idx}
                                            className="group flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                                    <Calendar className="h-6 w-6 text-slate-400 transition-colors group-hover:text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="mb-1 leading-none font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                                        {data.week_name}
                                                    </p>
                                                    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Actividad total</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl leading-none font-black text-indigo-600">{data.total_days_worked}</p>
                                                <p className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">Días</p>
                                            </div>
                                        </div>
                                    ))}
                                    {daysWorkedByWeek.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-20 font-medium text-slate-400 italic">
                                            <TrendingUp className="mb-4 h-12 w-12 opacity-20" />
                                            Sin registros históricos aún.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking & Availability Sidebar */}
                        <div className="space-y-8">
                            <Card className="rounded-[3rem] border-0 bg-white shadow-xl dark:bg-slate-900/50">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl font-black uppercase">
                                        <Clock className="h-5 w-5 text-amber-500" />
                                        Disponibilidad
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 px-8 pb-8">
                                    {availabilities.slice(0, 4).map((av, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4"
                                        >
                                            <div className="space-y-0.5">
                                                <p className="text-sm leading-none font-black text-slate-900 uppercase dark:text-white">
                                                    {translateDayToSpanish(av.day_of_week)}
                                                </p>
                                                <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">{av.turno}</p>
                                            </div>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                                                {av.start_time} - {av.end_time}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden rounded-[3rem] border-0 bg-red-600 p-8 text-white shadow-xl shadow-red-600/20">
                                <div className="relative z-10 space-y-4">
                                    <Target className="h-10 w-10 text-white/40" />
                                    <h3 className="text-2xl leading-tight font-black uppercase">STATUS DE RESERVAS</h3>
                                    <div className="space-y-3">
                                        {Object.entries(bookingStatusCounts).map(([status, count], i) => (
                                            <div key={i} className="flex items-center justify-between border-b border-white/20 pb-2">
                                                <span className="text-xs font-black tracking-widest uppercase opacity-80">{status}</span>
                                                <span className="text-xl font-black">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function MetricCard({ label, value, icon, color, desc, isText }: any) {
    return (
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:translate-y-[-6px] hover:shadow-2xl">
            <CardContent className="flex items-center gap-5 p-6 md:p-8">
                <div
                    className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-xl ${color} transition-transform group-hover:scale-110`}
                >
                    {icon}
                </div>
                <div>
                    <p className="mb-1 text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
                    <p className={`leading-none font-black text-slate-900 dark:text-white ${isText ? 'text-xl' : 'text-4xl'}`}>{value}</p>
                    <p className="mt-2 text-[10px] leading-none font-bold tracking-tighter text-slate-400 uppercase opacity-80">{desc}</p>
                </div>
            </CardContent>
        </Card>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    MapPin,
    ArrowLeft,
    ExternalLink
} from 'lucide-react';
import Header from '@/components/header';

export default function PublicLocation() {
    const lat = -16.504426;
    const lng = -68.132940;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <Head title="Nuestra Ubicación - ADMUSPRODUCTIONS" />
            <Header />

            <main className="relative pt-20">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <div className="grid grid-cols-6 h-full w-full">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-foreground" />
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-6 py-20 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand transition-colors mb-6 font-bold uppercase tracking-widest text-xs"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al inicio
                            </Link>
                            <h1 className="text-5xl md:text-7xl font-black font-orbitron text-foreground leading-none mb-4">
                                SEDE PARA <span className="text-brand">EMPRESAS</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                El punto estratégico donde resolvemos los desafíos de marketing de los negocios más ambiciosos.
                            </p>
                        </motion.div>

                        <div className="flex flex-col items-center justify-center space-y-12">
                            {/* Centered Logo and Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-6"
                            >
                                <div className="relative group mx-auto w-fit">
                                    <div className="absolute -inset-8 bg-brand/20 blur-2xl rounded-full opacity-60" />
                                    <img
                                        src="/logo.png"
                                        alt="Admus Logo"
                                        className="relative w-72 h-auto drop-shadow-2xl mx-auto"
                                    />
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black font-orbitron text-foreground tracking-tighter uppercase">
                                    ADMUS <span className="text-brand">PRODUCCIÓN</span>
                                </h2>
                                <p className="text-sm text-brand font-black uppercase tracking-[0.5em]">
                                    Ubicación Central
                                </p>
                            </motion.div>

                            {/* Map View - Natural Colors with Integrated Native Marker */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="relative w-full max-w-5xl aspect-video rounded-none overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.1)] bg-muted"
                            >
                                <iframe
                                    src={`https://maps.google.com/maps?q=${lat},${lng}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="opacity-100"
                                />

                                {/* Modern Frame Elements - Minimalist */}
                                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-brand/20 z-20 pointer-events-none" />
                                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-brand/20 z-20 pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
            {children}
        </span>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
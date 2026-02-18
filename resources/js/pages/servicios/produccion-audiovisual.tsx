import Header from '@/components/header';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import Contactanos from '../home/contactanos';
import Footer from '../home/footer';
import Ideas from './ideas';
import NuestroTrabajo from './nuestro-trabajo';

export default function ProduccionAudiovisual() {
    const { auth } = usePage<SharedData>().props;
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.warn('Autoplay failed:', err);
            });
        }
    }, []);

    return (
        <>
            <Head title="Producción Audiovisual" />

            {/* Sección principal: video + texto, ocupa 80vh */}
            <section className="relative flex h-[80vh] w-full overflow-hidden text-foreground">
                <Header />
                {/* Video de fondo */}
                <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
                    <source src="/Gflores/admus.mp4" type="video/mp4" />
                    Tu navegador no soporta el video.
                </video>

                {/* Overlay oscuro mitad izquierda */}
                <div className="absolute top-0 left-0 z-10 h-full w-1/2 bg-background/70 backdrop-blur-sm" />

                {/* Contenido */}
                <div className="relative z-20 flex h-full w-full">
                    {/* Mitad izquierda con texto */}
                    <div className="flex w-1/2 flex-col items-start justify-center p-12">
                        {/* Logo */}
                        <div
                            className="mb-8 transform transition-all duration-500 hover:scale-110"
                            style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 0, 0.7))' }}
                        >
                            <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto md:mx-0">
                                <defs>
                                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff3333" />
                                        <stop offset="100%" stopColor="#990000" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <path d="M80 20 L150 20 L190 130 L120 130 Z" fill="url(#logoGradient)" filter="url(#glow)" />
                                <text
                                    x="150"
                                    y="120"
                                    fontFamily="Orbitron"
                                    fontSize="60"
                                    fontWeight="bold"
                                    fill="currentColor"
                                    textAnchor="middle"
                                    filter="url(#glow)"
                                    className="text-foreground"
                                >
                                    ADMUS
                                </text>
                            </svg>
                        </div>

                        <h1 className="mb-4 text-5xl font-black font-orbitron text-brand md:text-6xl uppercase tracking-tighter" style={{ textShadow: '0 0 15px rgba(217, 26, 26, 0.4)' }}>
                            PRODUCCIÓN AUDIOVISUAL
                        </h1>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl uppercase tracking-widest text-foreground">HAZ VIRAL TUS VIDEOS</h2>
                        <p className="mb-6 text-xl text-muted-foreground">PRODUCCIONES AUDIOVISUALES QUE CONECTAN</p>

                        <a
                            href="#nuestro-trabajo"
                            className="inline-block transform rounded-none bg-brand px-8 py-4 text-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition hover:scale-105 hover:bg-brand/90 uppercase"
                        >
                            Ver Proyectos
                        </a>
                    </div>

                    {/* Mitad derecha vacía (video fondo visible) */}
                    <div className="w-1/2" />
                </div>
            </section>

            {/* Sección 2 */}
            <section className="bg-muted/80 py-24 text-foreground border-y border-border">
                <p className="mx-auto max-w-3xl text-center text-2xl font-medium leading-relaxed font-sans">
                    Queremos ayudarte a alcanzar tus objetivos y a potenciar tus ideas. Estaremos encantados de agendar una reunión contigo para hacer
                    un <span className="text-brand font-bold underline decoration-brand/30">diagnóstico gratuito</span> de tu presencia digital o para que nos cuentes de tu proyecto.
                </p>
            </section>

            <section id="ideas" className="bg-background py-24">
                <Ideas />
            </section>

            {/* Sección 3 */}
            <section id="nuestro-trabajo" className="bg-muted/20 py-24 border-y border-border">
                <NuestroTrabajo />
            </section>

            {/* Sección 4 */}
            <section id="contactanos" className="bg-background py-24">
                <Contactanos />
            </section>
            <Footer />
        </>
    );
}

import Header from '@/components/header';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Contactanos from '../home/contactanos';
import Footer from '../home/footer';
import IdeasFotografia from './ideasfoto';
import NuestroTrabajoFoto from './nuestro-trabajo-foto';

export default function Fotografia() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Fotografía" />

            {/* Sección principal: imagen + texto, ocupa 80vh */}
            <section
                className="relative flex h-[80vh] w-full overflow-hidden bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/logo.jpeg')" }} // <-- Cambia aquí el path de tu imagen
            >
                <Header />

                {/* Overlay oscuro mitad izquierda */}
                <div className="absolute top-0 left-0 z-10 h-full w-full bg-background/60 backdrop-blur-sm lg:w-1/2" />

                {/* Contenido */}
                <div className="relative z-20 flex h-full w-full">
                    {/* Mitad izquierda con texto */}
                    <div className="flex w-1/2 flex-col items-start justify-center p-12">
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
                            FOTOGRAFÍA PROFESIONAL
                        </h1>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl uppercase tracking-widest text-foreground">HAZ VIRAL TUS FOTOS</h2>
                        <p className="mb-6 text-xl text-muted-foreground uppercase font-medium">UNA IMAGEN DICE MÁS QUE MIL PALABRAS</p>

                        <a
                            href="#nuestro-trabajo"
                            className="inline-block transform rounded-none bg-brand px-8 py-4 text-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:bg-brand/90 uppercase"
                        >
                            Ver Proyectos
                        </a>
                    </div>

                    {/* Mitad derecha vacía (imagen fondo visible) */}
                    <div className="w-1/2" />
                </div>
            </section>

            {/* Sección 3 */}
            <section id="ideas" className="bg-background py-24">
                <IdeasFotografia />
            </section>

            {/* Sección 4 */}
            <section id="nuestro-trabajo" className="bg-muted/20 py-24 border-y border-border">
                <NuestroTrabajoFoto />
            </section>

            {/* Sección 5 */}
            <section id="contactanos" className="bg-background py-24">
                <Contactanos />
            </section>
            <Footer />
        </>
    );
}

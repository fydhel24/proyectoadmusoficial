'use client';

import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play, ArrowRight, Star, CheckCircle } from 'lucide-react';
import QuienesSomos from './home/quienes-somos';
import Contactanos from './home/contactanos';
import Footer from './home/footer';
import ComoTrabajamos from './home/como-trabajamos';
import NuestroTrabajo from './servicios/nuestro-trabajo';

gsap.registerPlugin(ScrollTrigger);

export default function Welcome() {
    const heroContentRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hero entrance animations
        const ctx = gsap.context(() => {
            gsap.from('.hero-badge', { opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.7)', delay: 0.5 });
            gsap.from('.hero-title span', {
                opacity: 0,
                y: 50,
                stagger: 0.1,
                duration: 1,
                ease: 'power4.out',
                delay: 0.7
            });
            gsap.from('.hero-description', { opacity: 0, x: -30, duration: 1, ease: 'power3.out', delay: 1 });
            gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', delay: 1.2 });

            gsap.from(videoContainerRef.current, {
                opacity: 0,
                x: 100,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.5
            });

            // Stats animation
            gsap.from('.stat-item', {
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: 'top 80%',
                },
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-brand selection:text-white overflow-hidden">
            <Head title="ADMUSPRODUCTIONS - Producción Audiovisual Premium">
                <meta name="description" content="ADMUSPRODUCTIONS - Líderes en producción audiovisual, marketing digital y branding profesional." />
            </Head>

            <Header />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                    <div ref={videoContainerRef} className="absolute right-0 top-0 w-full h-full lg:w-[65%] clip-path-hero">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        >
                            <source src="/Gflores/video1.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl" ref={heroContentRef}>
                        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-6">
                            <Star className="w-3 h-3 fill-brand" />
                            Premium Production Studio
                        </div>

                        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black font-orbitron leading-none mb-6">
                            <span className="block text-foreground">IMPULSA TU</span>
                            <span className="block text-brand">PRESENCIA</span>
                            <span className="block text-foreground">DIGITAL</span>
                        </h1>

                        <p className="hero-description text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed font-sans">
                            En <span className="text-foreground font-bold tracking-tighter">AdmusProductions</span> transformamos ideas en experiencias audiovisuales cinematográficas. Innovación, estrategia y calidad en cada frame.
                        </p>

                        <div className="hero-cta flex flex-wrap gap-4">
                            <Button size="lg" className="bg-brand hover:bg-brand/90 text-white px-8 py-7 text-lg font-bold rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                                INICIAR PROYECTO
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-foreground/20 hover:bg-foreground/5 px-8 py-7 text-lg font-bold rounded-none backdrop-blur-sm">
                                <Play className="mr-2 w-5 h-5 fill-foreground" />
                                PORTAFOLIO
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                    <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center p-1">
                        <div className="w-1 h-2 bg-brand rounded-full" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div ref={statsRef} className="py-20 border-y border-border bg-muted/30 backdrop-blur-xl relative z-20">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { num: '500+', label: 'Proyectos' },
                        { num: '50mln', label: 'Vistas' },
                        { num: '100+', label: 'Marcas' },
                        { num: '15+', label: 'Premios' },
                    ].map((item, i) => (
                        <div key={i} className="stat-item text-center">
                            <div className="text-4xl md:text-5xl font-black font-orbitron text-brand mb-2">{item.num}</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Areas */}
            <main className="relative z-10">
                <section id="servicios" className="py-24 bg-muted/20">
                    <div className="container mx-auto px-6 mb-16">
                        <div className="flex items-end justify-between gap-8 flex-wrap">
                            <div className="max-w-2xl">
                                <h2 className="text-brand text-sm font-bold tracking-[0.3em] mb-4">NUESTROS SERVICIOS</h2>
                                <h3 className="text-4xl md:text-6xl font-black font-orbitron">SOLUCIONES<br /><span className="text-foreground/40 text-muted-foreground/40">INTEGRALES</span></h3>
                            </div>
                            <p className="max-w-md text-muted-foreground pb-2">
                                Desde la conceptualización hasta la entrega final, garantizamos un estándar de excelencia que posiciona tu marca por encima de la competencia.
                            </p>
                        </div>
                    </div>
                    <NuestroTrabajo />
                </section>

                <section id="quienes-somos" className="py-24 relative overflow-hidden">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-brand/20 blur-[120px] rounded-full pointer-events-none" />
                    <QuienesSomos />
                </section>

                <section id="metodologia" className="py-24 bg-muted/40 border-y border-border">
                    <ComoTrabajamos />
                </section>

                <section id="contacto" className="py-24 relative">
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-brand/5 pointer-events-none" />
                    <Contactanos />
                </section>
            </main>

            <Footer />
        </div>
    );
}

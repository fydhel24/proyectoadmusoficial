'use client';

import CompanyCarousel from '@/components/company-carousel';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ComoTrabajamos from './home/como-trabajamos';
import Contactanos from './home/contactanos';
import Footer from './home/footer';
import QuienesSomos from './home/quienes-somos';
import NuestroTrabajo from './servicios/nuestro-trabajo';

gsap.registerPlugin(ScrollTrigger);

export default function Welcome({ companies = [] }: { companies?: any[] }) {
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
                delay: 0.7,
            });
            gsap.from('.hero-description', { opacity: 0, x: -30, duration: 1, ease: 'power3.out', delay: 1 });
            gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', delay: 1.2 });

            gsap.from(videoContainerRef.current, {
                opacity: 0,
                x: 100,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.5,
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
                ease: 'power3.out',
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-background text-foreground selection:bg-brand min-h-screen overflow-hidden selection:text-white">
            <Head title="ADMUSPRODUCTIONS - Producción Audiovisual Premium">
                <meta name="description" content="ADMUSPRODUCTIONS - Líderes en producción audiovisual, marketing digital y branding profesional." />
            </Head>

            <Header />

            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="from-background via-background/80 absolute inset-0 z-10 bg-gradient-to-r to-transparent" />
                    <div ref={videoContainerRef} className="clip-path-hero absolute top-0 right-0 h-full w-full lg:w-[65%]">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 hover:grayscale-0"
                        >
                            <source src="/Gflores/admus.mp4" type="video/mp4" />
                        </video>
                        <div className="bg-brand/10 absolute inset-0 mix-blend-overlay" />
                    </div>
                </div>

                <div className="relative z-20 container mx-auto px-6">
                    <div className="max-w-3xl" ref={heroContentRef}>
                        <div className="hero-badge bg-brand/10 border-brand/20 text-brand mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-widest uppercase">
                            <Star className="fill-brand h-3 w-3" />
                            Premium Production Studio
                        </div>

                        <h1 className="hero-title font-orbitron mb-6 text-5xl leading-none font-black md:text-7xl lg:text-8xl">
                            <span className="text-foreground block">IMPULSA TU</span>
                            <span className="text-brand block">PRESENCIA</span>
                            <span className="text-foreground block">DIGITAL</span>
                        </h1>

                        <p className="hero-description text-muted-foreground mb-10 max-w-xl font-sans text-xl leading-relaxed">
                            En <span className="text-foreground font-bold tracking-tighter">AdmusProductions</span> transformamos ideas en
                            experiencias audiovisuales cinematográficas. Innovación, estrategia y calidad en cada frame.
                        </p>

                        <div className="hero-cta flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="bg-brand hover:bg-brand/90 rounded-none px-8 py-7 text-lg font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                            >
                                INICIAR PROYECTO
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-foreground/20 hover:bg-foreground/5 rounded-none px-8 py-7 text-lg font-bold backdrop-blur-sm"
                            >
                                <Play className="fill-foreground mr-2 h-5 w-5" />
                                PORTAFOLIO
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 animate-bounce md:block">
                    <div className="border-foreground/20 flex h-10 w-6 justify-center rounded-full border-2 p-1">
                        <div className="bg-brand h-2 w-1 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div ref={statsRef} className="border-border bg-muted/30 relative z-20 border-y py-20 backdrop-blur-xl">
                <div className="container mx-auto grid grid-cols-2 gap-8 px-6 md:grid-cols-4">
                    {[
                        { num: '500+', label: 'Proyectos' },
                        { num: '50mln', label: 'Vistas' },
                        { num: '100+', label: 'Marcas' },
                        { num: '15+', label: 'Premios' },
                    ].map((item, i) => (
                        <div key={i} className="stat-item text-center">
                            <div className="font-orbitron text-brand mb-2 text-4xl font-black md:text-5xl">{item.num}</div>
                            <div className="text-muted-foreground text-xs font-bold tracking-widest uppercase">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Companies Carousel Section */}
            <section id="empresas" className="bg-background overflow-hidden py-20">
                <div className="container mx-auto mb-12 px-6 text-center">
                    <h2 className="text-brand mb-4 text-sm font-bold tracking-[0.3em] uppercase">Empresas que confían</h2>
                    <h3 className="font-orbitron text-3xl font-black md:text-5xl">
                        PLANES <span className="text-muted-foreground/40 text-foreground/40">ESTRATÉGICOS</span>
                    </h3>
                </div>
                <CompanyCarousel companies={companies} />
            </section>

            {/* Main Content Areas */}
            <main className="relative z-10">
                <section id="servicios" className="bg-muted/20 py-24">
                    <div className="container mx-auto mb-16 px-6">
                        <div className="flex flex-wrap items-end justify-between gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-brand mb-4 text-sm font-bold tracking-[0.3em]">NUESTROS SERVICIOS</h2>
                                <h3 className="font-orbitron text-4xl font-black md:text-6xl">
                                    SOLUCIONES
                                    <br />
                                    <span className="text-foreground/40 text-muted-foreground/40">INTEGRALES</span>
                                </h3>
                            </div>
                            <p className="text-muted-foreground max-w-md pb-2">
                                Desde la conceptualización hasta la entrega final, garantizamos un estándar de excelencia que posiciona tu marca por
                                encima de la competencia.
                            </p>
                        </div>
                    </div>
                    <NuestroTrabajo />
                </section>

                <section id="quienes-somos" className="relative overflow-hidden py-24">
                    <div className="bg-brand/20 pointer-events-none absolute top-1/2 left-0 h-64 w-64 -translate-y-1/2 rounded-full blur-[120px]" />
                    <QuienesSomos />
                </section>

                <section id="metodologia" className="bg-muted/40 border-border border-y py-24">
                    <ComoTrabajamos />
                </section>

                <section id="contacto" className="relative py-24">
                    <div className="bg-brand/5 pointer-events-none absolute top-0 right-0 h-full w-1/3" />
                    <Contactanos />
                </section>
            </main>

            <Footer />
        </div>
    );
}

'use client';

import Header from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Deferred, Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle, Play, Share2 } from 'lucide-react';
import React from 'react';
import Footer from '../home/footer';

// Define las interfaces para los datos que llegan de Laravel
interface LinkData {
    id: number;
    link: string;
    detalle: string;
}

interface CompanyLinkComprobante {
    id: number;
    link: LinkData | null;
}

interface CompanyProps {
    id: number;
    name: string;
    logo: string;
}

interface CompanyVideosProps {
    company: CompanyProps;
    videos?: CompanyLinkComprobante[];
}

// 🦴 Componente Skeleton para el estilo de YouTube/TikTok
const VideoSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-muted/20 relative aspect-[9/16] animate-pulse overflow-hidden rounded-[2.5rem] border border-white/5">
                <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
                    <Skeleton className="h-4 w-2/3 bg-white/10" />
                    <Skeleton className="h-3 w-1/2 bg-white/10" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                    </div>
                </div>
                {/* Floating buttons skeleton */}
                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
                    <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                    <Skeleton className="h-10 w-8 bg-white/10" />
                    <Skeleton className="h-10 w-8 bg-white/10" />
                </div>
            </div>
        ))}
    </div>
);

// 🐛 Función auxiliar mejorada para obtener la URL de incrustación de TikTok
const getEmbedUrl = (tiktokUrl: string): string => {
    try {
        const url = new URL(tiktokUrl);
        const pathParts = url.pathname.split('/');
        const videoId = pathParts.pop() || pathParts.pop();

        if (videoId) {
            return `https://www.tiktok.com/embed/v2/${videoId}`;
        }
    } catch (e) {
        console.error('URL de TikTok inválida:', tiktokUrl);
    }
    return '';
};

// Componente de Tarjeta de Video Individual para manejar Lazy Loading
const VideoCard = ({ companyLink, index, name, logo }: { companyLink: CompanyLinkComprobante; index: number; name: string; logo: string }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }, // Carga el video 200px antes de que entre en pantalla
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: Math.min(index * 0.05, 0.5), // Cap delay for large lists
            }}
            whileHover={{ y: -10 }}
            className="group relative"
        >
            <Card className="hover:border-brand/50 hover:shadow-brand/20 aspect-[9/16] overflow-hidden rounded-[2.5rem] border-white/5 bg-[#010101] shadow-2xl transition-all duration-300">
                <CardContent className="relative h-full p-0">
                    {/* Floating TikTok Actions */}
                    <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6">
                        <div className="relative mb-2">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                                <AvatarImage src={logo || ''} />
                                <AvatarFallback className="bg-brand font-bold text-white">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="bg-brand absolute -bottom-2 translate-x-[75%] rounded-full border-2 border-white px-1 text-[10px] font-bold text-white">
                                +
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white transition-transform group-hover:scale-110 hover:bg-transparent"
                            >
                                <Heart className="h-8 w-8 drop-shadow-md" />
                            </Button>
                            <span className="text-[12px] font-bold text-white drop-shadow-md">{Math.floor(Math.random() * 50) + 1}k</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-transparent">
                                <MessageCircle className="h-8 w-8 drop-shadow-md" />
                            </Button>
                            <span className="text-[12px] font-bold text-white drop-shadow-md">{Math.floor(Math.random() * 500) + 1}</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-transparent">
                                <Share2 className="h-8 w-8 drop-shadow-md" />
                            </Button>
                            <span className="text-[10px] font-bold text-white drop-shadow-md">Share</span>
                        </div>
                    </div>

                    {/* Placeholder con loading mientras aparece el iframe */}
                    {!isVisible && (
                        <div className="bg-muted/10 absolute inset-0 flex animate-pulse items-center justify-center">
                            <Play className="h-12 w-12 text-white/20" />
                        </div>
                    )}

                    {/* Video Iframe (Solo se carga cuando es visible) */}
                    {isVisible && companyLink.link && (
                        <iframe
                            src={getEmbedUrl(companyLink.link.link)}
                            title={`Video de TikTok para ${name}`}
                            className="h-full w-full"
                            style={{ border: 'none' }}
                            allowFullScreen
                        />
                    )}

                    {/* Video Description Overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                        <h4 className="mb-2 font-bold text-white">@{name.replace(/\s+/g, '').toLowerCase()}</h4>
                        <p className="line-clamp-2 text-sm text-white/90">
                            {companyLink?.link?.detalle || 'Descubre nuestro último trabajo creativo.'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 overflow-hidden text-sm text-white/70">
                            <div className="animate-marquee whitespace-nowrap">🎵 Original Sound - {name} - Marketing Agency</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function CompanyVideos({ company, videos }: CompanyVideosProps) {
    const { name, logo } = company;

    return (
        <div className="bg-background text-foreground selection:bg-brand min-h-screen selection:text-white">
            <Header />
            <Head title={`Videos de ${name} | Portafolio`} />

            {/* Spacer for sticky header */}
            <div className="h-20" />

            <main className="container mx-auto px-4 py-12 md:py-20">
                {/* Header Section */}
                <div className="relative mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mb-4"
                    >
                        <h1 className="font-orbitron from-brand animate-gradient-x bg-gradient-to-r via-red-500 to-purple-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-5xl md:text-7xl">
                            VIDEOS PARA {name.toUpperCase()}
                        </h1>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                            Explora la colección de contenido estratégico creado exclusivamente para potenciar la presencia digital de esta marca.
                        </p>
                    </motion.div>

                    {/* Decorative Elements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-8 flex items-center justify-center gap-4"
                    >
                        <div className="bg-brand/20 h-px w-12 md:w-20" />
                        <div className="bg-brand/10 ring-brand/20 rounded-full p-3 ring-1">
                            <Play className="fill-brand text-brand h-6 w-6" />
                        </div>
                        <div className="bg-brand/20 h-px w-12 md:w-20" />
                    </motion.div>
                </div>

                {/* Videos Grid with Deferred Loading */}
                <Deferred data="videos" fallback={<VideoSkeleton />}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {videos && videos.length > 0 ? (
                                videos.map((companyLink, index) => (
                                    <VideoCard key={companyLink?.id || index} companyLink={companyLink} index={index} name={name} logo={logo} />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-muted/30 mx-auto max-w-md rounded-3xl border border-dashed p-12"
                                    >
                                        <Play className="bg-brand/10 text-brand mx-auto mb-6 h-16 w-16 rounded-full p-4" />
                                        <h3 className="mb-2 text-2xl font-bold">Sin videos disponibles</h3>
                                        <p className="text-muted-foreground">Pronto compartiremos el contenido estratégico de esta empresa.</p>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </Deferred>
            </main>

            <Footer />
        </div>
    );
}

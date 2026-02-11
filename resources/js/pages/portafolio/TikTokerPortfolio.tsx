'use client';

import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, router } from '@inertiajs/react';
import { Heart, Search, Star, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import Footer from '../home/footer';

type Video = {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
    views: number;
    likes: number;
    comments: number;
    duration: string;
};

type Influencer = {
    id: number;
    name: string;
    username: string;
    followers: string;
    category: string;
    description: string;
    avatar: string;
    coverImage: string;
    verified: boolean;
    engagement: string;
    rating: string;
    specialties: string[];
    videos: Video[];
    gallery: string[];
    profilePhoto?: any;
    coverPhoto?: any;
    feedPhotos?: any[];
    photos?: any[];
};

interface PageProps {
    influencers: Influencer[];
}

export default function TikTokerPortfolio({ influencers }: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const categories = useMemo(() => {
        return [...new Set(influencers.map((inf) => inf.category))].filter(Boolean);
    }, [influencers]);

    const filteredInfluencers = useMemo(() => {
        return influencers.filter((inf) => {
            const matchesSearch =
                inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = !selectedCategory || inf.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [influencers, searchTerm, selectedCategory]);

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) newFavorites.delete(id);
        else newFavorites.add(id);
        setFavorites(newFavorites);
    };

    const navigateToProfile = (id: number) => {
        router.visit(`/influencers/${id}`);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950">
            <Header />
            <div className="h-20" /> {/* Spacer for fixed header */}
            <Head title="Catálogo de Influencers Elite | Admus Productions" />
            <div className="min-h-screen px-4 py-8 md:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-12 space-y-4 text-center">
                        <h1 className="font-orbitron bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text py-4 text-4xl font-black tracking-tighter text-transparent uppercase md:text-7xl">
                            ⚡ INFLUENCERS ELITE
                        </h1>
                        <p className="text-lg leading-none font-medium tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                            Conecta con los mejores creadores digitales
                        </p>
                        <div className="flex justify-center gap-3">
                            <Badge
                                variant="outline"
                                className="gap-2 rounded-full border-yellow-200/50 bg-yellow-50/50 px-5 py-2 text-yellow-700 shadow-sm backdrop-blur-sm dark:bg-yellow-900/20 dark:text-yellow-400"
                            >
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                {influencers.length} Creadores Premium
                            </Badge>
                            <Badge
                                variant="outline"
                                className="gap-2 rounded-full border-green-200/50 bg-green-50/50 px-5 py-2 text-green-700 shadow-sm backdrop-blur-sm dark:bg-green-900/20 dark:text-green-400"
                            >
                                <TrendingUp className="h-4 w-4" />
                                Trending Now
                            </Badge>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="mb-12 space-y-8">
                        <div className="relative mx-auto flex max-w-lg justify-center">
                            <Search className="absolute top-1/2 left-5 h-6 w-6 -translate-y-1/2 text-red-500" />
                            <Input
                                placeholder="Buscar por nombre, usuario o categoría..."
                                className="h-16 rounded-full border-slate-200 bg-white/80 pl-14 text-lg shadow-2xl backdrop-blur-md focus-visible:ring-red-500 dark:border-slate-800 dark:bg-slate-900/80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Button
                                variant={selectedCategory === '' ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory('')}
                                className="h-11 rounded-full px-8 font-bold shadow-sm"
                            >
                                Todos
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="h-11 rounded-full px-8 font-bold text-slate-700 shadow-sm dark:text-slate-200"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Grid de Influencers */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredInfluencers.map((inf) => (
                            <Card
                                key={inf.id}
                                className="group relative h-[480px] cursor-pointer overflow-hidden rounded-[2.5rem] border-0 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-red-500/30"
                                onClick={() => navigateToProfile(inf.id)}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={inf.avatar || '/placeholder.svg'}
                                        alt={inf.name}
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                                </div>

                                {/* Like Button */}
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="group absolute top-6 right-6 z-20 rounded-full border-white/20 bg-black/60 backdrop-blur-xl hover:bg-red-500"
                                    onClick={(e) => toggleFavorite(inf.id, e)}
                                >
                                    <Heart className={`h-5 w-5 ${favorites.has(inf.id) ? 'fill-white text-white' : 'text-white'}`} />
                                </Button>

                                {/* Info Overlay */}
                                <div className="absolute right-0 bottom-0 left-0 z-10 space-y-3 p-8">
                                    <Badge className="border-0 bg-red-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-red-700">
                                        {inf.category}
                                    </Badge>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl leading-none font-black tracking-tight text-white">{inf.name}</h3>
                                        <p className="text-sm font-medium text-slate-300 italic opacity-80">{inf.username}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] leading-none font-black tracking-widest text-slate-400 uppercase">
                                                Audiencia
                                            </span>
                                            <span className="text-xl font-black text-white">{inf.followers}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="transform rounded-full bg-white px-5 font-black text-black transition-all group-hover:scale-105 hover:bg-red-600 hover:text-white"
                                        >
                                            PORTAFOLIO
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredInfluencers.length === 0 && (
                        <div className="rounded-[3rem] border border-dashed border-slate-200 bg-white/50 py-32 text-center backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
                            <Search className="mx-auto mb-6 h-20 w-20 text-slate-200" />
                            <h3 className="text-3xl font-black tracking-tighter text-slate-600 uppercase dark:text-slate-400">Sin resultados</h3>
                            <p className="mt-2 text-slate-400">Prueba con otros términos o categorías</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

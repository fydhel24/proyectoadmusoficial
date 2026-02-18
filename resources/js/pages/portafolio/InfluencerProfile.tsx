'use client';

import Header from '@/components/header';
import { Head } from '@inertiajs/react';
import Footer from '../home/footer';
import FacebookProfileViewer from '../Profile/FacebookProfileViewer';

interface Photo {
    id: number;
    path: string;
    url: string;
    nombre: string;
    tipo: string;
    created_at: string;
}

interface Influencer {
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
    gallery: string[];
    profilePhoto: Photo | null;
    coverPhoto: Photo | null;
    feedPhotos: Photo[];
    photos: Photo[];
}

interface PageProps {
    influencer: Influencer;
}

export default function InfluencerProfile({ influencer }: PageProps) {
    return (
        <div className="bg-slate-50 dark:bg-slate-950">
            <Header />
            <div className="h-20" /> {/* Spacer for fixed header */}
            <Head title={`Perfil de ${influencer.name} | Influencer Elite`} />
            <main className="min-h-screen">
                <FacebookProfileViewer
                    profileUser={
                        {
                            id: influencer.id,
                            name: influencer.name,
                            email: '',
                            photos: influencer.photos || [],
                        } as any
                    }
                    profilePhoto={influencer.profilePhoto}
                    coverPhoto={influencer.coverPhoto}
                    feedPhotos={influencer.feedPhotos || []}
                />
            </main>
            <Footer />
        </div>
    );
}

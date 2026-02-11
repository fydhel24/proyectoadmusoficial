import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Image as ImageIcon, MapPin } from 'lucide-react';

interface Photo {
    id: number;
    path: string;
    url: string;
    nombre: string;
    tipo: string;
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    photos: Photo[];
}

interface Props {
    profileUser: User;
    profilePhoto: Photo | null;
    coverPhoto: Photo | null;
    feedPhotos: Photo[];
}

export default function FacebookProfileViewer({ profileUser, profilePhoto, coverPhoto, feedPhotos = [] }: Props) {
    const safeFeedPhotos = Array.isArray(feedPhotos) ? feedPhotos : [];

    return (
        <div className="flex flex-col bg-slate-50 dark:bg-slate-950">
            {/* Header Estilo Facebook Público */}
            <div className="bg-card border-b shadow-sm">
                <div className="relative mx-auto w-full max-w-6xl">
                    {/* Portada */}
                    <div className="bg-muted relative h-48 overflow-hidden sm:h-64 md:h-80 md:rounded-b-xl">
                        {coverPhoto ? (
                            <img src={coverPhoto.url} alt="Portada" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                                <ImageIcon className="h-12 w-12 text-slate-400" />
                            </div>
                        )}
                    </div>

                    {/* Info de Perfil Overlap */}
                    <div className="px-6 pb-2 md:px-12">
                        <div className="relative z-10 -mt-12 mb-4 flex flex-col items-center gap-6 md:-mt-10 md:flex-row md:items-end">
                            {/* Avatar */}
                            <div className="bg-card relative rounded-full p-1 shadow-md">
                                <Avatar className="border-card h-32 w-32 border-4 md:h-44 md:w-44">
                                    <AvatarImage src={profilePhoto?.url} className="object-cover" />
                                    <AvatarFallback className="bg-slate-100 text-3xl font-bold text-slate-400 dark:bg-slate-800">
                                        {profileUser.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Nombre */}
                            <div className="flex-1 pt-4 text-center md:text-left">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">
                                    {profileUser.name}
                                </h1>
                                <p className="mt-1 font-semibold text-slate-500">{safeFeedPhotos.length} fotos publicadas</p>
                            </div>

                            {/* Botón de Acción Público (Opcional) */}
                            <div className="flex w-full gap-2 pb-2 md:w-auto">
                                <Button className="flex-1 gap-2 rounded-full bg-red-600 font-bold text-white hover:bg-red-700">
                                    Contratar Influencer
                                </Button>
                            </div>
                        </div>

                        <Separator className="mt-4" />

                        <Tabs defaultValue="publicaciones" className="w-full">
                            <TabsList className="h-14 w-full justify-start gap-8 border-b border-transparent bg-transparent p-0">
                                {['publicaciones', 'fotos', 'informacion'].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="data-[state=active]:border-primary data-[state=active]:text-primary h-full rounded-none border-b-2 border-transparent px-2 font-bold text-slate-500 capitalize transition-all data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-slate-400"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:px-0 lg:grid-cols-12">
                {/* Sidebar */}
                <div className="space-y-6 lg:col-span-12 xl:col-span-4">
                    <Card className="rounded-xl border bg-white shadow-none dark:bg-slate-900">
                        <CardHeader className="pb-3 text-lg font-bold">Biografía</CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                                Influencer oficial en Admus Productions. Apasionado por la tecnología y el diseño.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                    <Briefcase className="h-4 w-4" />
                                    <span>
                                        Influencer en <span className="font-semibold text-slate-900 dark:text-slate-200">Admus Productions</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        Desde <span className="font-semibold text-slate-900 dark:text-slate-200">La Paz, BO</span>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border bg-white shadow-none dark:bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-lg font-bold">Fotos Destacadas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
                                {safeFeedPhotos.slice(0, 9).map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="relative aspect-square cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800"
                                    >
                                        <img
                                            src={photo.url}
                                            alt={photo.nombre}
                                            className="h-full w-full object-cover transition-opacity hover:opacity-90"
                                        />
                                    </div>
                                ))}
                                {safeFeedPhotos.length === 0 && (
                                    <div className="col-span-3 py-8 text-center text-sm text-slate-400 italic">Sin fotos recientes</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feed Column */}
                <div className="space-y-6 lg:col-span-12 xl:col-span-8">
                    {/* List of Content */}
                    <div className="space-y-6">
                        {safeFeedPhotos.map((photo) => (
                            <Card key={photo.id} className="overflow-hidden rounded-xl border bg-white shadow-none dark:bg-slate-900">
                                <CardHeader className="flex flex-row items-center gap-4 p-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={profilePhoto?.url} />
                                        <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 dark:text-slate-50">{profileUser.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(photo.created_at).toLocaleDateString('es-ES', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="border-y p-0 dark:border-slate-800">
                                    <div className="flex justify-center bg-slate-50 dark:bg-black">
                                        <img src={photo.url} alt={photo.nombre} className="h-auto max-h-[600px] max-w-full object-contain" />
                                    </div>
                                </CardContent>
                                <div className="flex gap-4 p-4">
                                    <Button variant="ghost" className="flex-1 font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        ❤️ Me gusta
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 font-bold text-slate-600 italic hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        💬 Comentar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 font-bold text-slate-600 italic hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        ➡️ Compartir
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {safeFeedPhotos.length === 0 && (
                        <Card className="rounded-xl border bg-white p-16 text-center shadow-none dark:bg-slate-900">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-200" />
                            <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-600 uppercase">Sin publicaciones disponibles</h3>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

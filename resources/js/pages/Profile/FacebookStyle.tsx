import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Briefcase,
    Calendar,
    Camera,
    Edit2,
    Image as ImageIcon,
    MapPin,
    MoreHorizontal,
    Plus,
    Settings,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Photo {
    id: number;
    path: string;
    url: string;
    nombre: string;
    tipo: string; // 'foto', 'perfil', 'portada'
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
    isOwnProfile: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mi Perfil Premium',
        href: '/facebook-profile',
    },
];

export default function FacebookStyle({ profileUser, profilePhoto, coverPhoto, feedPhotos = [], isOwnProfile }: Props) {
    const [uploadType, setUploadType] = useState<'foto' | 'perfil' | 'portada'>('foto');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Asegurarse de que feedPhotos sea siempre un array para evitar el error .map is not a function
    const safeFeedPhotos = Array.isArray(feedPhotos) ? feedPhotos : [];

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        file: null as File | null,
        tipo: 'foto',
        nombre: '',
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.photo.store'), {
            onSuccess: () => {
                setIsUploadOpen(false);
                reset();
                toast.success('Foto publicada con éxito');
            },
            onError: (err) => {
                console.error(err);
                toast.error('Error al subir la imagen');
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
            destroy(route('profile.photo.delete', id), {
                onSuccess: () => toast.success('Foto eliminada'),
            });
        }
    };

    const openUploadModal = (type: 'foto' | 'perfil' | 'portada') => {
        setUploadType(type);
        setData('tipo', type);
        setIsUploadOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Perfil de ${profileUser.name}`} />

            <div className="flex min-h-screen flex-col bg-[#fff5f5] dark:bg-[#0a0000]">
                {/* Header Premium con Degradado Rojo */}
                <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-b-[2rem] border-x border-b border-red-100 bg-white shadow-2xl dark:border-red-900/30 dark:bg-[#1a0505]">
                    {/* Portada Premium */}
                    <div className="group relative h-56 bg-red-50 md:h-[400px] dark:bg-black">
                        {coverPhoto ? (
                            <img
                                src={coverPhoto.url}
                                alt="Portada"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="to-crimson-700 flex h-full w-full items-center justify-center bg-gradient-to-br from-red-600 via-rose-600">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <ImageIcon className="h-16 w-16 animate-pulse text-white/40" />
                            </div>
                        )}

                        {/* Overlay Gradiente Portada */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute right-6 bottom-6 gap-2 border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
                                onClick={() => openUploadModal('portada')}
                            >
                                <Camera className="h-4 w-4 text-red-400" />
                                <span className="hidden font-semibold md:inline">Cambiar Portada</span>
                            </Button>
                        )}
                    </div>

                    {/* Info de Perfil - Estética Overlap */}
                    <div className="px-6 pb-8 md:px-12">
                        <div className="relative z-10 -mt-16 mb-6 flex flex-col items-center gap-6 md:-mt-20 md:flex-row md:items-end">
                            {/* Avatar Esférico con Glow */}
                            <div className="group relative rounded-full bg-white p-1 shadow-2xl dark:bg-[#1a0505]">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 to-rose-500 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                                <Avatar className="relative h-32 w-32 border-4 border-white ring-2 ring-red-500/20 md:h-44 md:w-44 dark:border-[#1a0505]">
                                    <AvatarImage src={profilePhoto?.url} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-600 text-3xl font-bold text-white">
                                        {profileUser.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {isOwnProfile && (
                                    <button
                                        className="group absolute right-2 bottom-2 cursor-pointer rounded-full border-4 border-white bg-red-600 p-2.5 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-700 active:scale-95 dark:border-[#1a0505] dark:bg-red-700 dark:hover:bg-red-800"
                                        onClick={() => openUploadModal('perfil')}
                                    >
                                        <Camera className="h-5 w-5 text-white" />
                                    </button>
                                )}
                            </div>

                            {/* Nombre y Estadísticas */}
                            <div className="flex-1 pt-4 text-center md:text-left">
                                <h1 className="flex items-center justify-center gap-2 text-3xl font-black tracking-tight text-slate-900 md:justify-start md:text-4xl dark:text-white">
                                    {profileUser.name}
                                </h1>
                            </div>

                            {/* Botones de Acción Estilo Moderno */}
                            <div className="flex w-full gap-3 pb-2 md:w-auto">
                                {isOwnProfile ? (
                                    <>
                                        <Button
                                            className="flex-1 gap-2 rounded-xl border-none bg-gradient-to-r from-red-600 to-rose-600 py-6 font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 hover:from-red-700 hover:to-rose-700 active:scale-95 md:flex-none"
                                            onClick={() => openUploadModal('foto')}
                                        >
                                            <Plus className="h-5 w-5" />
                                            Subir Foto
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="flex-1 gap-2 rounded-xl bg-red-600 px-8 py-6 font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-700 md:flex-none">
                                            Seguir
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="flex-1 gap-2 rounded-xl bg-slate-100 px-8 py-6 font-bold md:flex-none dark:bg-red-950/30"
                                        >
                                            Mensaje
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <Separator className="my-2 bg-red-100 dark:bg-red-900/20" />

                        {/* Pestañas con animación de línea roja */}
                        <Tabs defaultValue="publicaciones" className="w-full">
                            <TabsList className="h-14 w-full justify-start gap-8 border-b border-transparent bg-transparent p-0">
                                {['publicaciones', 'fotos', 'informacion'].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="h-full rounded-none border-b-2 border-transparent px-2 font-bold text-slate-500 capitalize transition-all duration-300 data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none dark:text-red-200/40 dark:data-[state=active]:text-red-500"
                                    >
                                        {tab}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Contenido Principal con Diseño de Grilla Limpio */}
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:px-0 lg:grid-cols-12">
                    {/* Sidebar: Detalles e Información */}
                    <div className="space-y-6 lg:col-span-4">
                        <Card className="overflow-hidden rounded-3xl border-none bg-white shadow-xl shadow-red-500/5 dark:bg-[#1a0505]">
                            <CardHeader className="border-b border-red-50 pb-2 dark:border-red-950/30">
                                <CardTitle className="text-lg font-black tracking-widest text-red-600 uppercase">Biografía</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-6">
                                <p className="leading-relaxed font-medium text-slate-600 dark:text-red-100/70">
                                    Creador de contenido apasionado por la tecnología y el diseño. Explorando el mundo un pixel a la vez. 🚀
                                </p>
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-red-200/50">
                                        <div className="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-950/30">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <span>
                                            Influencer en{' '}
                                            <span className="font-bold text-slate-900 underline decoration-red-500/30 dark:text-white">
                                                Admus Productions
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-red-200/50">
                                        <div className="rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-950/30">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <span>
                                            Desde <span className="font-bold text-slate-900 dark:text-white">La Paz, BO</span>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Galería Visual Mini */}
                        <Card className="overflow-hidden rounded-3xl border-none bg-white shadow-xl shadow-red-500/5 dark:bg-[#1a0505]">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-red-50 pb-2 dark:border-red-950/30">
                                <CardTitle className="text-lg font-black tracking-widest text-red-600 uppercase">Fotos Recientes</CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-red-500 hover:bg-red-50">
                                    Explorar
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
                                    {safeFeedPhotos.slice(0, 9).map((photo) => (
                                        <div
                                            key={photo.id}
                                            className="group relative aspect-square cursor-pointer overflow-hidden bg-slate-100 dark:bg-black"
                                        >
                                            <img src={photo.url} alt={photo.nombre} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-red-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        </div>
                                    ))}
                                    {safeFeedPhotos.length === 0 && (
                                        <div className="col-span-3 py-10 text-center font-medium text-red-200/30 italic">Sin fotos aún</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Feed de Publicaciones - Enfoque Red Limpio */}
                    <div className="space-y-8 lg:col-span-8">
                        {/* Composer Premium */}
                        {isOwnProfile && (
                            <Card className="rounded-[2.5rem] border-none bg-white p-4 shadow-2xl shadow-red-500/10 ring-red-500/10 transition-all focus-within:ring-2 dark:bg-[#1a0505]">
                                <CardContent className="p-4">
                                    
                                    <div className="mt-6 flex justify-around border-t border-red-50 pt-4 dark:border-red-900/10">
                                        <button
                                            className="group flex items-center gap-2 rounded-xl px-6 py-2 transition-all hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                            onClick={() => openUploadModal('foto')}
                                        >
                                            <ImageIcon className="h-6 w-6 text-red-500 transition-transform group-hover:scale-110" />
                                            <span className="text-sm font-bold text-slate-600 dark:text-red-200/60">Foto</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Lista de Contenido (Feed) */}
                        {safeFeedPhotos.map((photo) => (
                            <Card
                                key={photo.id}
                                className="group animate-in zoom-in-95 overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl shadow-black/5 duration-500 dark:bg-[#1a0505]"
                            >
                                <CardHeader className="flex flex-row items-center gap-4 p-6">
                                    <Avatar className="h-12 w-12 ring-2 ring-red-500/10">
                                        <AvatarImage src={profilePhoto?.url} />
                                        <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-lg leading-tight font-black text-slate-900 dark:text-white">{profileUser.name}</p>
                                        <p className="text-xs font-bold tracking-tighter text-red-400 uppercase opacity-70">
                                            {new Date(photo.created_at).toLocaleString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-50">
                                                <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border-red-50 shadow-xl">
                                            {isOwnProfile && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2 p-3 font-bold text-red-600"
                                                    onClick={() => handleDelete(photo.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar Foto
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {photo.nombre && (
                                        <p className="ml-6 border-l-4 border-red-500 px-8 pb-4 text-lg leading-relaxed font-medium text-slate-700 italic lg:text-xl dark:text-red-50">
                                            {photo.nombre}
                                        </p>
                                    )}
                                    <div className="flex justify-center border-y border-red-50 bg-black transition-all duration-500 group-hover:brightness-110 dark:border-red-950/20">
                                        <img src={photo.url} alt={photo.nombre} className="h-auto max-h-[700px] max-w-full object-contain" />
                                    </div>
                                </CardContent>
                                <div className="flex items-center justify-between bg-red-50/10 p-6 dark:bg-red-950/5">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white dark:border-[#1a0505]"
                                            >
                                                {i}k
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-6 text-sm font-black tracking-widest text-red-900/40 uppercase dark:text-red-200/20">
                                        <span>34 Comentarios</span>
                                        <span>12 compartidos</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 border-t border-red-50 px-6 py-4 dark:border-red-950/10">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 gap-2 rounded-xl font-black text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                    >
                                        ❤️ Me Encanta
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 gap-2 rounded-xl font-black text-slate-600 italic hover:bg-slate-50 dark:text-red-200/50 dark:hover:bg-red-950/30"
                                    >
                                        💬 Opinar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 gap-2 rounded-xl font-black text-slate-600 italic hover:bg-slate-50 dark:text-red-200/50 dark:hover:bg-red-950/30"
                                    >
                                        ➡️ Difundir
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {safeFeedPhotos.length === 0 && (
                            <Card className="rounded-[3rem] border-none bg-white p-16 text-center shadow-xl dark:bg-[#1a0505]">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                                        <Plus className="h-12 w-12 animate-pulse text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase dark:text-white">
                                            Sin fotos aún
                                        </h3>
                                        <p className="mt-2 text-slate-400 italic dark:text-red-200/30">
                                            Sé el primero en darle vida a tu nuevo perfil premium.
                                        </p>
                                    </div>
                                    {isOwnProfile && (
                                        <Button
                                            className="rounded-2xl bg-red-600 px-10 py-6 font-bold text-white shadow-xl shadow-red-500/30 transition-all hover:scale-105 hover:bg-red-700"
                                            onClick={() => openUploadModal('foto')}
                                        >
                                            Empezar Ahora
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Subida Universal */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="rounded-[3rem] border-none bg-white p-8 shadow-2xl sm:max-w-lg dark:bg-[#1a0505]">
                    <DialogHeader>
                        <DialogTitle className="border-b border-red-50 pb-6 text-center text-2xl font-black tracking-widest text-red-600 uppercase">
                            {uploadType === 'portada' ? 'Cambiar Portada' : uploadType === 'perfil' ? 'Cambiar Perfil' : 'Nueva Foto'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload}>
                        <div className="space-y-6 py-6">
                            <div className="space-y-3">
                                <Label htmlFor="file" className="text-sm font-black tracking-widest text-slate-900 uppercase dark:text-white">
                                    Seleccionar Imagen
                                </Label>
                                <div className="group relative">
                                    <Input
                                        id="file"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                        className="flex h-24 cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-red-200 bg-red-50 text-center font-bold text-red-600 transition-all file:hidden hover:border-red-500 dark:border-red-900/50 dark:bg-red-950/30"
                                    />
                                    {!data.file && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-bold text-red-400 italic">
                                            Presiona aquí para elegir una foto
                                        </div>
                                    )}
                                </div>
                                {errors.file && <p className="mt-2 text-center text-sm font-bold text-red-600">{errors.file}</p>}
                            </div>

                            {data.file && (
                                <div className="mt-4 max-h-48 overflow-hidden rounded-[2rem] border-4 border-red-50 shadow-inner">
                                    <img src={URL.createObjectURL(data.file)} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex gap-4 border-t border-red-50 pt-4 dark:border-red-900/10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUploadOpen(false)}
                                className="flex-1 rounded-2xl border-red-100 py-8 font-bold text-slate-400"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-8 font-black tracking-tighter text-white uppercase shadow-xl shadow-red-500/40 transition-all hover:scale-105"
                                disabled={processing}
                            >
                                {processing ? 'Subiendo...' : 'Publicar Foto'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

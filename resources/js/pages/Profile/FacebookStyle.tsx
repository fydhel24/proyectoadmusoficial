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
import { Briefcase, Calendar, Camera, Edit2, Heart, Image as ImageIcon, MapPin, MoreHorizontal, Plus, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
    isOwnProfile: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil',
        href: '/facebook-profile',
    },
];

export default function FacebookStyle({ profileUser, profilePhoto, coverPhoto, feedPhotos, isOwnProfile }: Props) {
    const [uploadType, setUploadType] = useState<'foto' | 'perfil' | 'portada'>('foto');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        photo: null as File | null,
        tipo: 'foto',
        nombre: '',
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.photo.store'), {
            onSuccess: () => {
                setIsUploadOpen(false);
                reset();
                toast.success('Foto subida con éxito');
            },
            onError: (err) => {
                console.error(err);
                toast.error('Error al subir la foto');
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

            <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
                {/* Portada y Perfil Header */}
                <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-b-xl border-x border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {/* Cover Photo */}
                    <div className="group relative h-48 bg-slate-200 md:h-80 dark:bg-slate-800">
                        {coverPhoto ? (
                            <img src={coverPhoto.url} alt="Portada" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
                                <ImageIcon className="h-12 w-12 text-white opacity-50" />
                            </div>
                        )}

                        {isOwnProfile && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute right-4 bottom-4 gap-2 bg-white/90 shadow-sm hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900"
                                onClick={() => openUploadModal('portada')}
                            >
                                <Camera className="h-4 w-4" />
                                <span className="hidden md:inline">Editar foto de portada</span>
                            </Button>
                        )}
                    </div>

                    {/* Profile Info Overlay */}
                    <div className="px-4 pb-4 md:px-8">
                        <div className="relative z-10 -mt-12 mb-4 flex flex-col items-center gap-4 md:-mt-8 md:flex-row md:items-end">
                            {/* Avatar */}
                            <div className="group relative">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-md md:h-40 md:w-40 dark:border-slate-900">
                                    <AvatarImage src={profilePhoto?.url} className="object-cover" />
                                    <AvatarFallback className="bg-slate-100 text-2xl dark:bg-slate-800">{profileUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {isOwnProfile && (
                                    <div
                                        className="absolute right-1 bottom-1 cursor-pointer rounded-full border-2 border-white bg-slate-100 p-2 transition-colors hover:bg-slate-200 md:right-2 md:bottom-2 dark:border-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        onClick={() => openUploadModal('perfil')}
                                    >
                                        <Camera className="h-5 w-5" />
                                    </div>
                                )}
                            </div>

                            {/* Name and Basic Buttons */}
                            <div className="flex-1 pt-2 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl dark:text-slate-50">{profileUser.name}</h1>
                                <p className="font-medium text-slate-500 dark:text-slate-400">{profileUser.photos.length} Fotos</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pb-2">
                                {isOwnProfile ? (
                                    <>
                                        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700" onClick={() => openUploadModal('foto')}>
                                            <Plus className="h-4 w-4" />
                                            Añadir a historia
                                        </Button>
                                        <Button variant="secondary" className="gap-2">
                                            <Edit2 className="h-4 w-4" />
                                            Editar perfil
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                                            <Plus className="h-4 w-4" />
                                            Seguir
                                        </Button>
                                        <Button variant="secondary" className="gap-2">
                                            Enviar mensaje
                                        </Button>
                                    </>
                                )}
                                <Button variant="secondary" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Separator className="my-2 bg-slate-200 dark:bg-slate-800" />

                        {/* Tabs Navigation */}
                        <div className="flex justify-center md:justify-start">
                            <Tabs defaultValue="publicaciones" className="w-full">
                                <TabsList className="h-12 w-full justify-start gap-4 bg-transparent p-0">
                                    <TabsTrigger
                                        value="publicaciones"
                                        className="h-full rounded-none border-b-2 border-transparent px-4 font-semibold data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    >
                                        Publicaciones
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="informacion"
                                        className="h-full rounded-none border-b-2 border-transparent px-4 font-semibold text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    >
                                        Información
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="fotos"
                                        className="h-full rounded-none border-b-2 border-transparent px-4 font-semibold text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    >
                                        Fotos
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="videos"
                                        className="h-full rounded-none border-b-2 border-transparent px-4 font-semibold text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                    >
                                        Vídeos
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-2 py-4 md:px-0 lg:grid-cols-12">
                    {/* Left Sidebar: About/Info */}
                    <div className="space-y-4 lg:col-span-5">
                        <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-bold">Detalles</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <Briefcase className="h-5 w-5 text-slate-400" />
                                    <span>
                                        Trabaja en <span className="font-semibold text-slate-900 dark:text-slate-100">Miracode Agency</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                    <span>
                                        Vive en <span className="font-semibold text-slate-900 dark:text-slate-100">Santa Cruz, Bolivia</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <Heart className="h-5 w-5 text-slate-400" />
                                    <span>
                                        Relación sentimiental con{' '}
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">Productividad</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <Calendar className="h-5 w-5 text-slate-400" />
                                    <span>
                                        Se unió en <span className="font-semibold text-slate-900 dark:text-slate-100">Junio de 2025</span>
                                    </span>
                                </div>

                                {isOwnProfile && (
                                    <Button
                                        variant="secondary"
                                        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    >
                                        Editar detalles
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Photos Card (Mini Grid) */}
                        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xl font-bold">Fotos</CardTitle>
                                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                    Ver todas las fotos
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
                                    {profileUser.photos.slice(0, 9).map((photo) => (
                                        <div key={photo.id} className="group relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={photo.url}
                                                alt={photo.nombre}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                    {profileUser.photos.length === 0 && (
                                        <div className="col-span-3 py-8 text-center text-slate-500 italic">No hay fotos aún.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Main Feed */}
                    <div className="space-y-4 lg:col-span-7">
                        {/* What's on your mind? */}
                        {isOwnProfile && (
                            <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={profilePhoto?.url} />
                                            <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="flex flex-1 cursor-pointer items-center rounded-full bg-slate-100 px-4 py-2 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                            onClick={() => openUploadModal('foto')}
                                        >
                                            ¿Qué estás pensando, {profileUser.name.split(' ')[0]}?
                                        </div>
                                    </div>
                                    <Separator className="my-3 bg-slate-100 dark:bg-slate-800" />
                                    <div className="flex justify-between px-2">
                                        <Button
                                            variant="ghost"
                                            className="gap-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                            onClick={() => openUploadModal('foto')}
                                        >
                                            <Camera className="h-5 w-5 text-rose-500" />
                                            <span>Foto/video</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="gap-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                        >
                                            <UserIcon className="h-5 w-5 text-blue-500" />
                                            <span>Etiquetar</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="gap-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                        >
                                            <ImageIcon className="h-5 w-5 text-amber-500" />
                                            <span>Acontecimiento</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Filter Post Card */}
                        <Card className="flex items-center justify-between border-slate-200 p-3 shadow-sm dark:border-slate-800">
                            <h3 className="px-2 text-lg font-bold">Publicaciones</h3>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" className="gap-2 bg-slate-100 dark:bg-slate-800">
                                    Filtros
                                </Button>
                                <Button variant="secondary" size="sm" className="gap-2 bg-slate-100 dark:bg-slate-800">
                                    Administrar
                                </Button>
                            </div>
                        </Card>

                        {/* List of Photos as Posts */}
                        {feedPhotos.map((photo) => (
                            <Card
                                key={photo.id}
                                className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden border-slate-200 shadow-sm duration-500 dark:border-slate-800"
                            >
                                <CardHeader className="flex flex-row items-center gap-3 p-4">
                                    <Avatar className="h-10 w-10 border border-slate-100 shadow-sm dark:border-slate-800">
                                        <AvatarImage src={profilePhoto?.url} />
                                        <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 dark:text-slate-50">{profileUser.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(photo.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {isOwnProfile && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2 text-rose-600"
                                                    onClick={() => handleDelete(photo.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar foto
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="gap-2">Descargar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {photo.nombre && <p className="px-4 pb-3 text-slate-700 dark:text-slate-300">{photo.nombre}</p>}
                                    <div className="flex justify-center border-y border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                        <img src={photo.url} alt={photo.nombre} className="h-auto max-h-[600px] max-w-full object-contain" />
                                    </div>
                                </CardContent>
                                <div className="flex justify-between border-t border-slate-100 p-4 dark:border-slate-800">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 gap-2 font-semibold text-slate-600 italic hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                    >
                                        👍 Me gusta
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 gap-2 font-semibold text-slate-600 italic hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                    >
                                        💬 Comentar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 gap-2 font-semibold text-slate-600 italic hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                    >
                                        ➡️ Compartir
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {feedPhotos.length === 0 && (
                            <Card className="border-slate-200 p-12 text-center shadow-sm dark:border-slate-800">
                                <div className="flex flex-col items-center gap-4">
                                    <ImageIcon className="h-16 w-16 text-slate-200" />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-400">Sin publicaciones</h3>
                                        <p className="text-slate-500">Comienza compartiendo una foto con el mundo.</p>
                                    </div>
                                    {isOwnProfile && (
                                        <Button className="bg-blue-600" onClick={() => openUploadModal('foto')}>
                                            Subir primera foto
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="border-slate-200 bg-white sm:max-w-md dark:border-slate-800 dark:bg-slate-900">
                    <DialogHeader>
                        <DialogTitle className="border-b pb-4 text-center text-xl font-bold">
                            {uploadType === 'portada'
                                ? 'Actualizar foto de portada'
                                : uploadType === 'perfil'
                                  ? 'Actualizar foto de perfil'
                                  : 'Crear publicación'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="photo" className="text-sm font-semibold">
                                    Seleccionar Imagen
                                </Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                                    className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                                {errors.photo && <p className="text-sm font-medium text-rose-500">{errors.photo}</p>}
                            </div>

                            {uploadType === 'foto' && (
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="text-sm font-semibold">
                                        Descripción (opcional)
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Escribe algo sobre esta foto..."
                                        className="bg-slate-50 dark:bg-slate-800"
                                    />
                                </div>
                            )}

                            {data.photo && (
                                <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                                    <img src={URL.createObjectURL(data.photo)} alt="Vista previa" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>
                        <DialogFooter className="flex-col gap-2 sm:flex-row">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsUploadOpen(false)}
                                className="bg-slate-100 dark:bg-slate-800"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700" disabled={processing}>
                                {processing ? 'Subiendo...' : 'Publicar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

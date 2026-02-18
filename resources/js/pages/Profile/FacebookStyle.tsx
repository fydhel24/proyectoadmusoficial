import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Briefcase, Camera, Image as ImageIcon, MapPin, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
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
    hideLayout?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mi Perfil Premium',
        href: '/facebook-profile',
    },
];

export default function FacebookStyle({ profileUser, profilePhoto, coverPhoto, feedPhotos = [], isOwnProfile, hideLayout = false }: Props) {
    const [uploadType, setUploadType] = useState<'foto' | 'perfil' | 'portada'>('foto');
    const [isUploadOpen, setIsUploadOpen] = useState(false);

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
        files: [] as File[],
        tipo: 'foto' as 'foto' | 'perfil' | 'portada',
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
        reset('file', 'files', 'nombre');
        setUploadType(type);
        setData('tipo', type);
        setIsUploadOpen(true);
    };

    const renderContent = () => (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            {/* Header Estilo Shadcn Refinado */}
            <div className="bg-card border-b shadow-sm">
                <div className="relative mx-auto w-full max-w-6xl">
                    {/* Portada */}
                    <div className="bg-muted group relative h-56 overflow-hidden md:h-80 md:rounded-b-xl">
                        {coverPhoto ? (
                            <img
                                src={coverPhoto.url}
                                alt="Portada"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                                <ImageIcon className="h-12 w-12 text-slate-400" />
                            </div>
                        )}

                        {isOwnProfile && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute right-6 bottom-6 gap-2 border bg-white/90 shadow-sm hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900"
                                onClick={() => openUploadModal('portada')}
                            >
                                <Camera className="h-4 w-4" />
                                <span className="hidden font-semibold md:inline">Editar foto de portada</span>
                            </Button>
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
                                {isOwnProfile && (
                                    <button
                                        className="border-card absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-slate-100 shadow transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        onClick={() => openUploadModal('perfil')}
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="flex-1 pt-4 text-center md:text-left">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">
                                    {profileUser.name}
                                </h1>
                                <p className="mt-1 font-semibold text-slate-500">{safeFeedPhotos.length} fotos</p>
                            </div>

                            {/* Botón de Acción */}
                            <div className="flex w-full gap-2 pb-2 md:w-auto">
                                {isOwnProfile && (
                                    <Button className="flex-1 gap-2 rounded-lg font-bold" onClick={() => openUploadModal('foto')}>
                                        <Plus className="h-5 w-5" />
                                        Subir Foto
                                    </Button>
                                )}
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
                    <Card className="rounded-xl border shadow-none">
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

                    <Card className="rounded-xl border shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-lg font-bold">Fotos Recientes</CardTitle>
                            <Button variant="link" size="sm" className="px-0 font-bold">
                                Ver todo
                            </Button>
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
                                    <div className="col-span-3 py-8 text-center text-sm text-slate-400 italic">No hay fotos aún</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feed Column */}
                <div className="space-y-6 lg:col-span-12 xl:col-span-8">
                    {/* Simple Composer */}
                    {isOwnProfile && (
                        <Card className="rounded-xl border shadow-none">
                            <CardContent className="p-4">
                                <div className="flex justify-around border-t pt-4">
                                    <Button
                                        variant="ghost"
                                        className="h-12 flex-1 gap-2 rounded-lg font-bold text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                                        onClick={() => openUploadModal('foto')}
                                    >
                                        <ImageIcon className="h-6 w-6 text-green-500" />
                                        Subir Foto
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* List of Content */}
                    <div className="space-y-6">
                        {safeFeedPhotos.map((photo) => (
                            <Card key={photo.id} className="overflow-hidden rounded-xl border shadow-none">
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {isOwnProfile && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer font-semibold text-red-600"
                                                    onClick={() => handleDelete(photo.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar foto
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="border-y p-0 dark:border-slate-800">
                                    <div className="flex justify-center bg-slate-50 dark:bg-black">
                                        <img src={photo.url} alt={photo.nombre} className="h-auto max-h-[600px] max-w-full object-contain" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {safeFeedPhotos.length === 0 && (
                        <Card className="rounded-xl border p-16 text-center shadow-none">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-200" />
                            <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-600 uppercase">Sin publicaciones aún</h3>
                            {isOwnProfile && (
                                <Button className="mt-6 font-bold" variant="outline" onClick={() => openUploadModal('foto')}>
                                    Publicar mi primera foto
                                </Button>
                            )}
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal de Subida */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold">
                            {uploadType === 'portada'
                                ? 'Actualizar fondo de portada'
                                : uploadType === 'perfil'
                                  ? 'Actualizar foto de perfil'
                                  : 'Publicar nueva foto'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload}>
                        <div className="space-y-4 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="file" className="font-bold text-slate-700 dark:text-slate-300">
                                    {uploadType === 'foto' ? 'Seleccionar imágenes' : 'Seleccionar imagen'}
                                </Label>
                                <label
                                    htmlFor="file"
                                    className="relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                                >
                                    <Plus className="h-10 w-10 text-slate-400" />
                                    <p className="text-sm font-semibold text-slate-500 italic">
                                        {uploadType === 'foto'
                                            ? data.files.length > 0
                                                ? `${data.files.length} fotos seleccionadas`
                                                : 'Haz click para elegir fotos'
                                            : data.file
                                              ? data.file.name
                                              : 'Haz click para elegir una foto'}
                                    </p>
                                    <input
                                        id="file"
                                        type="file"
                                        accept="image/*"
                                        multiple={uploadType === 'foto'}
                                        onChange={(e) => {
                                            if (uploadType === 'foto') {
                                                const selectedFiles = Array.from(e.target.files || []);
                                                setData('files', selectedFiles);
                                            } else {
                                                setData('file', e.target.files?.[0] || null);
                                            }
                                        }}
                                        className="sr-only"
                                        required={uploadType !== 'foto' || data.files.length === 0}
                                    />
                                </label>
                                {errors.file && <p className="mt-2 text-center text-xs font-bold text-red-600">{errors.file}</p>}
                                {errors.files && <p className="mt-2 text-center text-xs font-bold text-red-600">{errors.files}</p>}
                            </div>

                            {/* Previews */}
                            {uploadType === 'foto' && data.files.length > 0 && (
                                <div className="mt-4 grid max-h-48 grid-cols-3 gap-2 overflow-y-auto p-1">
                                    {data.files.map((file, idx) => (
                                        <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border">
                                            <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {uploadType !== 'foto' && data.file && (
                                <div className="mt-4 flex justify-center overflow-hidden rounded-xl border p-1 shadow-inner">
                                    <img src={URL.createObjectURL(data.file)} alt="Preview" className="h-44 w-auto rounded-lg object-contain" />
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)} className="flex-1 font-bold">
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 font-bold" disabled={processing}>
                                {processing ? 'Subiendo...' : 'Publicar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );

    if (hideLayout) {
        return (
            <>
                <Head title={`Perfil de ${profileUser.name}`} />
                {renderContent()}
            </>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Perfil de ${profileUser.name}`} />
            {renderContent()}
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  X, 
  CheckCircle2,
  Loader2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Perfil de Influencer', href: '/perfil-influencer' }];

interface Photo {
    id: number;
    url: string;
    nombre: string;
}

interface User {
    name: string;
    email: string;
    avatar: string;
}

interface Datos {
    biografia: string;
    telefono: string;
    ciudad: string;
    redesSociales: {
        instagram: string;
        youtube: string;
        tiktok: string;
    };
}

interface Availability {
    id: number;
    day_of_week: string;
    time_start: string;
    time_end: string;
    turno: string;
    status: string;
}

interface Tipo {
    id: number;
    nombre: string;
    color: string;
}

interface ProfileData {
    user: User;
    datos: Datos;
    tipos: Tipo[];
    photos: Photo[];
    availabilities: Availability[];
}

interface Props {
    profileData: ProfileData;
}

export default function InfluencerProfile({ profileData: initialProfileData }: Props) {
    const { props } = usePage();
    const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'warning' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, photoId: null as number | null });

    // Manejar mensajes flash de Laravel
    useEffect(() => {
        const flash = props.flash as any;
        if (flash?.success || flash?.error) {
            setAlert({
                show: true,
                message: flash.success || flash.error,
                type: flash.success ? 'success' : 'error'
            });
            setTimeout(() => setAlert({ ...alert, show: false }), 5000);
        }
    }, [props.flash]);

    // Actualizar profileData cuando cambia initialProfileData (después de operaciones)
    useEffect(() => {
        setProfileData(initialProfileData);
    }, [initialProfileData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            if (file.size > 2 * 1024 * 1024) {
                setAlert({ show: true, message: 'El archivo debe pesar menos de 2MB', type: 'error' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
                return;
            }

            if (!file.type.startsWith('image/')) {
                setAlert({ show: true, message: 'Solo se permiten archivos de imagen', type: 'error' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
                return;
            }

            setSelectedFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            setAlert({ show: true, message: 'Por favor selecciona una foto', type: 'warning' });
            setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('photo', selectedFile);
        formData.append('nombre', selectedFile.name);
        formData.append('tipo', 'foto');

        router.post('/perfil-influencer/foto', formData, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setUploading(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                setAlert({ show: true, message: 'Foto subida exitosamente', type: 'success' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            },
            onError: () => {
                setUploading(false);
                setAlert({ show: true, message: 'Error al subir la foto', type: 'error' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            }
        });
    };

    const handleDeletePhoto = (photoId: number) => {
        setDeleteDialog({ open: true, photoId });
    };

    const confirmDelete = () => {
        if (!deleteDialog.photoId) return;

        router.delete(`/perfil-influencer/foto/${deleteDialog.photoId}`, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeleteDialog({ open: false, photoId: null });
                setAlert({ show: true, message: 'Foto eliminada exitosamente', type: 'success' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            },
            onError: () => {
                setAlert({ show: true, message: 'Error al eliminar la foto', type: 'error' });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
                setDeleteDialog({ open: false, photoId: null });
            }
        });
    };

    const getBackgroundImage = () => {
        return profileData.user.avatar || 'https://images.unsplash.com/photo-1614786269829-d24616faf56d';
    };

    const carouselSettings = {
        dots: true,
        infinite: profileData.photos.length > 3,
        speed: 500,
        slidesToShow: Math.min(3, profileData.photos.length),
        slidesToScroll: 1,
        autoplay: profileData.photos.length > 1,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, profileData.photos.length),
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const diasSemana: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil de Influencer" />

            <div className="min-h-screen bg-background relative">
                {/* Portada con Imagen de Fondo */}
                <div 
                    className="h-[400px] w-full relative bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getBackgroundImage()})`
                    }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                </div>

                {/* Foto de Perfil */}
                <div className="absolute top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <Avatar className="w-[200px] h-[200px] border-4 border-white shadow-lg">
                        <AvatarImage src={profileData.user.avatar} alt={profileData.user.name} />
                        <AvatarFallback>{profileData.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Contenido Principal */}
                <div className="container mx-auto px-4 pt-40 relative">
                    {/* Nombre y Biografía */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4">{profileData.user.name}</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            {profileData.datos.biografia}
                        </p>
                    </div>

                    {/* Tipos de Influencer */}
                    {profileData.tipos && profileData.tipos.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {profileData.tipos.map((tipo) => (
                                <Badge 
                                    key={tipo.id} 
                                    variant="default"
                                    className="bg-primary text-white px-4 py-2"
                                    style={{ backgroundColor: tipo.color }}
                                >
                                    {tipo.nombre}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
                        <div className="lg:col-span-6">
                            {/* Portafolio */}
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Mi Portafolio</CardTitle>
                                    <Button 
                                        onClick={() => document.getElementById('photo-upload')?.click()}
                                        disabled={uploading}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {uploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Subiendo...
                                            </>
                                        ) : 'Añadir Foto'}
                                    </Button>
                                    <Input
                                        type="file"
                                        id="photo-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </CardHeader>
                                <CardContent>
                                    {/* Preview antes de subir */}
                                    {selectedFile && (
                                        <Card className="mb-4 bg-muted/50">
                                            <CardContent className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                                        {previewUrl ? (
                                                            <img 
                                                                src={previewUrl} 
                                                                alt="Preview" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Camera className="w-12 h-12 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{selectedFile.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {selectedFile.type}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            onClick={handleUpload} 
                                                            className="flex-1"
                                                            disabled={uploading}
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Subir
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={() => {
                                                                setSelectedFile(null);
                                                                setPreviewUrl(null);
                                                            }}
                                                            className="flex-1"
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Galería de Fotos */}
                                    {profileData.photos.length > 0 ? (
                                        <div className="relative">
                                            <Slider {...carouselSettings}>
                                                {profileData.photos.map((photo) => (
                                                    <div key={photo.id} className="px-2">
                                                        <Card className="relative overflow-hidden group">
                                                            <div className="aspect-square bg-muted">
                                                                <img
                                                                    src={photo.url}
                                                                    alt={photo.nombre}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeletePhoto(photo.id)}
                                                                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                                                type="button"
                                                            >
                                                                <Trash2 className="w-5 h-5 text-red-500 hover:text-white" />
                                                            </button>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
                                                                <p className="font-medium truncate">{photo.nombre}</p>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No tienes fotos en tu portafolio</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Añade fotos para mostrar tu trabajo y atraer más clientes
                                            </p>
                                            <Button onClick={() => document.getElementById('photo-upload')?.click()}>
                                                <Camera className="w-4 h-4 mr-2" />
                                                Subir Primera Foto
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Información de Contacto */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Información de Contacto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-primary/10 rounded-full">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium">{profileData.user.email}</p>
                                            </div>
                                        </div>
                                        
                                        {profileData.datos.telefono && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-primary/10 rounded-full">
                                                    <Phone className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Teléfono</p>
                                                    <p className="font-medium">{profileData.datos.telefono}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {profileData.datos.ciudad && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-primary/10 rounded-full">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Ciudad</p>
                                                    <p className="font-medium">{profileData.datos.ciudad}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Disponibilidad */}
                            {profileData.availabilities && profileData.availabilities.length > 0 && (
                                <Card className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-2xl font-bold text-primary">
                                            Disponibilidad
                                        </CardTitle>
                                        <Button variant="default">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Gestionar Horarios
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {profileData.availabilities.map((slot) => (
                                                <Card 
                                                    key={slot.id} 
                                                    className={`bg-gradient-to-br ${
                                                        slot.status === 'disponible' 
                                                            ? 'from-cyan-100 to-blue-100' 
                                                            : 'from-orange-100 to-yellow-100'
                                                    } hover:scale-105 transition-transform`}
                                                >
                                                    <CardContent className="p-4">
                                                        <h4 className="font-bold text-lg mb-2">
                                                            {diasSemana[slot.day_of_week] ?? slot.day_of_week}
                                                        </h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground font-medium">Turno:</span>
                                                                <span className="ml-2">{slot.turno}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground font-medium">Horario:</span>
                                                                <span className="ml-2">{slot.time_start} – {slot.time_end}</span>
                                                            </div>
                                                        </div>
                                                        <Badge 
                                                            className="mt-3"
                                                            variant={slot.status === 'disponible' ? 'default' : 'secondary'}
                                                        >
                                                            {slot.status}
                                                        </Badge>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alerta Toast */}
                {alert.show && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
                        <Alert 
                            variant={alert.type === 'success' ? 'default' : 'destructive'}
                            className="min-w-[300px]"
                        >
                            <div className="flex items-center gap-2">
                                {alert.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <X className="w-5 h-5" />
                                )}
                                <AlertDescription>{alert.message}</AlertDescription>
                            </div>
                        </Alert>
                    </div>
                )}

                {/* Dialog Eliminar */}
                <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-red-600">Confirmar Eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que quieres eliminar esta foto? Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setDeleteDialog({ open: false, photoId: null })}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={confirmDelete}
                            >
                                Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
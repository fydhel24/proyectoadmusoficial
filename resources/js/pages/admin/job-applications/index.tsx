import AppLayout from '@/layouts/app-layout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Eye, FileText, Loader2, Phone, Search, Trash2, User, Download } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface JobApplication {
    id: number;
    full_name: string;
    ci: string;
    area: string;
    phone: string;
    cv: string | null;
    extra_documents: string[] | null;
    status: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO';
    created_at: string;
}

interface Props {
    applications: {
        data: JobApplication[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        area?: string;
        status?: string;
    };
}

export default function Index({ applications, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [area, setArea] = useState(filters.area || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { delete: destroy, patch, processing } = useForm();

    // WhatsApp Dialog State
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState('');
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

    // Sincronizar estado local con props del backend
    React.useEffect(() => {
        setSearch(filters.search || '');
        setArea(filters.area || '');
        setStatusFilter(filters.status || '');
    }, [filters.search, filters.area, filters.status]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDownload = (path: string, filename: string) => {
        const link = document.createElement('a');
        link.href = `/storage/${path}`;
        link.download = filename;
        link.click();
    };

    // Función para aplicar filtros
    const applyFilters = (newSearch?: string, newArea?: string, newStatus?: string) => {
        setIsLoading(true);

        router.get(route('admin.job-applications.index'), {
            search: (newSearch ?? search) || '',
            area: (newArea ?? area) || '',
            status: (newStatus ?? statusFilter) || ''
        }, {
            preserveState: true,
            only: ['applications', 'filters'],
            onFinish: () => setIsLoading(false)
        });
    };

    // Función con debounce para búsqueda automática
    const handleSearchChange = (value: string) => {
        setSearch(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            applyFilters(value, area, statusFilter);
        }, 500);
    };

    const handleAreaChange = (selectedArea: string) => {
        setArea(selectedArea);
        applyFilters(search, selectedArea, statusFilter);
    };

    const handleStatusFilterChange = (selectedStatus: string) => {
        setStatusFilter(selectedStatus);
        applyFilters(search, area, selectedStatus);
    };

    const handleUpdateStatus = (applicationId: number, nextStatus: string) => {
        router.patch(route('admin.job-applications.update-status', applicationId), {
            status: nextStatus
        }, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => toast.success('Estado actualizado'),
            onError: () => toast.error('Error al actualizar estado')
        });
    };

    const openWhatsAppDialog = (phone: string) => {
        setSelectedPhone(phone);
        setWhatsappMessage('');
        setIsWhatsAppOpen(true);
    };

    const handleSendWhatsApp = async () => {
        if (!whatsappMessage.trim()) {
            toast.error('El mensaje no puede estar vacío');
            return;
        }

        setIsSendingWhatsApp(true);
        try {
            let cleanPhone = selectedPhone.replace(/\D/g, '');
            if (!cleanPhone.startsWith('591')) {
                cleanPhone = '591' + cleanPhone;
            }

            const sessionId = import.meta.env.VITE_WHATSAPP_SESSION_ID || '3';

            // 🔐 PASO 1: Login para obtener token
            console.log('🔐 [1/4] Autenticando...');
            const loginResponse = await fetch('https://boot.miracode.tech/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: import.meta.env.VITE_WHATSAPP_TEST_EMAIL || 'admus@miracode.tech',
                    password: import.meta.env.VITE_WHATSAPP_TEST_PASSWORD || 'admus@miracode.tech'
                })
            });

            if (!loginResponse.ok) {
                const errorText = await loginResponse.text();
                console.error('❌ Login fallido:', loginResponse.status, errorText);
                throw new Error(`Login fallido: ${loginResponse.status}`);
            }

            const loginData = await loginResponse.json();

            // 🔑 CORRECCIÓN PRINCIPAL: Usar access_token en lugar de token
            const freshToken = loginData.access_token?.trim();

            if (!freshToken) {
                console.error('❌ Token no encontrado en respuesta:', loginData);
                throw new Error('No se recibió un token válido del servidor');
            }

            console.log('✅ [2/4] Token obtenido:', freshToken.substring(0, 30) + '...');
            localStorage.setItem('whatsapp_token', freshToken);

            // 📤 PASO 2: Preparar payload
            const body = {
                sessionId: sessionId,
                to: `${cleanPhone}@s.whatsapp.net`,
                content: whatsappMessage
            };

            console.log('📤 [3/4] Enviando WhatsApp:', { to: body.to, sessionId });

            // 📤 PASO 3: Enviar con token correcto
            const sendResponse = await fetch('https://boot.miracode.tech/whatsapp/send-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${freshToken}`, // ← Ahora sí tendrá valor
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body),
                cache: 'no-store'
            });

            const responseData = await sendResponse.json();
            console.log('📥 [4/4] Respuesta:', {
                status: sendResponse.status,
                data: responseData
            });

            if (sendResponse.ok || responseData?.status === 'Enviado' || responseData?.success === true) {
                toast.success('✅ WhatsApp enviado con éxito');
                setIsWhatsAppOpen(false);
            } else {
                console.error('❌ Error en API:', responseData);
                toast.error('❌ Error: ' + (responseData.message || 'Respuesta inesperada'));
            }

        } catch (error: any) {
            console.error('💥 Error fatal:', error);

            if (error.message?.includes('autenticar') || error.message?.includes('login')) {
                toast.error('❌ Credenciales inválidas');
            } else if (error.message?.includes('token')) {
                toast.error('🔑 Error con el token. Verifica la respuesta de la API');
            } else {
                toast.error('❌ Error: ' + (error.message || 'No se pudo enviar'));
            }
        } finally {
            setIsSendingWhatsApp(false);
        }
    };
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleDelete = (application: JobApplication) => {
        destroy(route('admin.job-applications.destroy', application.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('✅ Postulacion eliminada exitosamente'),
            onError: () => toast.error('❌ Error al eliminar la Postulacion'),
        });
    };

    const clearSearch = () => {
        setSearch('');
        setArea('');
        setStatusFilter('');
        router.get(route('admin.job-applications.index'), {}, { replace: true });
    };

    const StatusToggles = ({ application }: { application: JobApplication }) => (
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            {(['PENDIENTE', 'ACEPTADO', 'RECHAZADO'] as const).map((s) => (
                <button
                    key={s}
                    onClick={() => handleUpdateStatus(application.id, s)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${application.status === s
                        ? s === 'PENDIENTE'
                            ? 'bg-yellow-500 text-white shadow-sm'
                            : s === 'ACEPTADO'
                                ? 'bg-green-500 text-white shadow-sm'
                                : 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                >
                    {s}
                </button>
            ))}
        </div>
    );

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Postulaciones de Trabajo',
                    href: route('admin.job-applications.index'),
                },
            ]}
        >
            <Head title="Postulaciones de Trabajo" />

            <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-10">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Postulaciones de Trabajo</h1>
                        <p className="text-muted-foreground mt-1">Gestiona las postulaciones recibidas de forma clara y ordenada.</p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === 'PENDIENTE' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusFilterChange(statusFilter === 'PENDIENTE' ? '' : 'PENDIENTE')}
                            className={statusFilter === 'PENDIENTE' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-200 text-yellow-700'}
                        >
                            Pendientes
                        </Button>
                        <Badge variant="destructive" className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 w-fit">
                            {applications.total} Postulantes
                        </Badge>
                    </div>
                </div>

                {/* SEARCH AND FILTER */}
                <Card className="border border-red-200 dark:border-red-900 shadow-lg bg-red-50/30 dark:bg-red-950/30">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* BÚSQUEDA POR TEXTO */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="text-red-600 dark:text-red-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            placeholder="Buscar por nombre, cédula o teléfono..."
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="pl-9 border-red-200 dark:border-red-800 focus:border-red-400 focus:ring-red-400 dark:bg-input dark:text-foreground"
                                        />
                                        {isLoading && search && (
                                            <Loader2 className="text-red-600 dark:text-red-400 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
                                        )}
                                    </div>
                                </div>

                                {(search || area || statusFilter) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearSearch}
                                        className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 w-full sm:w-auto"
                                        disabled={isLoading}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>

                            {/* FILTROS SECUNDARIOS */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-2">Área</label>
                                    <select
                                        value={area}
                                        onChange={(e) => handleAreaChange(e.target.value)}
                                        className="w-full rounded-md border border-red-200 dark:border-red-800 bg-white dark:bg-input text-foreground dark:text-foreground p-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm"
                                        disabled={isLoading}
                                    >
                                        <option value="">Todas las áreas</option>
                                        <option value="PRODUCCION">Producción</option>
                                        <option value="EDICION">Edición</option>
                                        <option value="CAMAROGRAFO">Camarógrafo</option>
                                        <option value="MARKETING">Marketing</option>
                                        <option value="VENTAS">Ejecutivo de Ventas</option>
                                        <option value="CREATIVO">Creativo</option>
                                        <option value="TALENTO">Talentos(Influencer)</option>
                                        <option value="PASANTE">Pasante</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-2">Estado</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                                        className="w-full rounded-md border border-red-200 dark:border-red-800 bg-white dark:bg-input text-foreground dark:text-foreground p-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm"
                                        disabled={isLoading}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="ACEPTADO">Aceptado</option>
                                        <option value="RECHAZADO">Rechazado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* LISTA */}
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                            Lista de Postulantes
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                        </CardTitle>
                        <CardDescription className="text-red-600 dark:text-red-400">Revisa, edita y gestiona las postulaciones.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {applications.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="text-red-400 dark:text-red-500 mx-auto mb-4 h-14 w-14" />
                                <h3 className="text-red-700 dark:text-red-400 mb-1 text-lg font-medium">No hay aplicaciones</h3>
                                <p className="text-red-600 dark:text-red-400 text-sm">
                                    {search || area || statusFilter ? 'No se encontraron resultados con los filtros aplicados.' : 'Aún no se han recibido postulaciones.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* DESKTOP TABLE */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[200px]">Nombre</TableHead>
                                                <TableHead>Área</TableHead>
                                                <TableHead>Celular</TableHead>
                                                <TableHead>Fecha de postulación</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Documentos</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {applications.data.map((application) => (
                                                <TableRow key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <TableCell className="font-medium align-top">
                                                        <div className="flex flex-col min-w-[180px] max-w-[200px]">
                                                            <span className="flex items-start gap-2 break-words whitespace-normal">
                                                                <User className="text-muted-foreground h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                <span className="break-words">{application.full_name}</span>
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground ml-6 break-words">{application.ci}</span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                                                            {application.area}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="text-muted-foreground h-4 w-4" />
                                                            {application.phone}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-sm">
                                                        {formatDate(application.created_at)}
                                                    </TableCell>

                                                    <TableCell>
                                                        <StatusToggles application={application} />
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            {application.cv && (
                                                                <Badge className="text-[10px] bg-red-600 text-white cursor-pointer hover:bg-red-700" onClick={() => handleDownload(application.cv!, `CV_${application.full_name}.pdf`)}>CV</Badge>
                                                            )}
                                                            {application.extra_documents && application.extra_documents.length > 0 && (
                                                                <Badge className="text-[10px] bg-gray-500 text-white cursor-pointer hover:bg-gray-600" onClick={() => {
                                                                    application.extra_documents!.forEach((doc, i) => handleDownload(doc, `Doc_${application.full_name}_${i + 1}.pdf`));
                                                                }}>+{application.extra_documents.length}</Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                                                                onClick={() => openWhatsAppDialog(application.phone)}
                                                            >
                                                                <Phone className="h-4 w-4" />
                                                            </Button>

                                                            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                                                <Link href={route('admin.job-applications.show', application.id)}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>

                                                            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                                                <Link href={route('admin.job-applications.edit', application.id)}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="dark:text-foreground">¿Está seguro?</AlertDialogTitle>
                                                                        <AlertDialogDescription className="dark:text-muted-foreground">Eliminar postulante: {application.full_name}</AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="dark:bg-input dark:text-foreground dark:hover:bg-muted">No</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDelete(application)} className="bg-red-600 hover:bg-red-700">Sí, eliminar</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* MOBILE CARDS */}
                                <div className="lg:hidden space-y-4">
                                    {applications.data.map((application) => (
                                        <Card key={application.id} className="border border-gray-200 dark:border-gray-800">
                                            <CardContent className="pt-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-bold text-lg leading-tight break-words">{application.full_name}</h3>
                                                        <p className="text-xs text-muted-foreground break-words">{application.ci}</p>
                                                    </div>
                                                    <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 flex-shrink-0">{application.area}</Badge>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Phone className="h-3 w-3" /> {application.phone}
                                                </div>

                                                <div className="py-2 border-y border-gray-50 dark:border-gray-800">
                                                    <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-1.5">Cambiar Estado</p>
                                                    <StatusToggles application={application} />
                                                </div>

                                                <div className="flex gap-2 pt-1">
                                                    <Button variant="outline" size="sm" className="flex-1 text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800" onClick={() => openWhatsAppDialog(application.phone)}>
                                                        <Phone className="mr-1.5 h-4 w-4" /> WhatsApp
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild className="flex-1 dark:border-gray-700 dark:text-foreground">
                                                        <Link href={route('admin.job-applications.show', application.id)}>
                                                            <Eye className="mr-1.5 h-4 w-4" /> Ver
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800" onClick={() => handleDelete(application)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* PAGINATION */}
                                {applications.last_page > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t mt-6 dark:border-gray-800">
                                        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                            {applications.from}-{applications.to} de {applications.total}
                                        </div>
                                        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
                                            {Array.from({ length: applications.last_page }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === applications.current_page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => router.get(route('admin.job-applications.index'), { ...filters, page })}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* WhatsApp Dialog */}
            <Dialog open={isWhatsAppOpen} onOpenChange={setIsWhatsAppOpen}>
                <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 dark:text-foreground">
                            <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Phone className="h-5 w-5 text-green-600 dark:text-green-400" /></span>
                            Enviar WhatsApp
                        </DialogTitle>
                        <DialogDescription className="dark:text-muted-foreground">
                            Enviar un mensaje directo al número: <span className="font-bold text-foreground dark:text-foreground">{selectedPhone}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-muted-foreground dark:text-muted-foreground mr-1">Mensaje</label>
                            <Textarea
                                placeholder="Escribe el mensaje aquí..."
                                value={whatsappMessage}
                                onChange={(e) => setWhatsappMessage(e.target.value)}
                                className="min-h-[120px] resize-none border-green-100 dark:border-green-800 focus:border-green-400 focus:ring-green-400 dark:bg-input dark:text-foreground"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWhatsAppOpen(false)} disabled={isSendingWhatsApp} className="dark:border-gray-700 dark:text-foreground dark:hover:bg-muted">Cancelar</Button>
                        <Button
                            onClick={handleSendWhatsApp}
                            disabled={isSendingWhatsApp}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                            {isSendingWhatsApp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                            Enviar Ahora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster richColors position="top-right" />
        </AppLayout>
    );
}
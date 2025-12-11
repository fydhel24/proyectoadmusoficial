import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Toaster, toast } from 'sonner';

import { Download, Edit, Eye, FileText, Phone, Search, Trash2, User, Loader2 } from 'lucide-react';

interface JobApplication {
    id: number;
    full_name: string;
    ci: string;
    area: string;
    phone: string;
    cv: string | null;
    extra_documents: string[] | null;
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
    };
}

export default function Index({ applications, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [area, setArea] = useState(filters.area || '');
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { delete: destroy, processing } = useForm();

    // Sincronizar estado local con props del backend
    React.useEffect(() => {
        setSearch(filters.search || '');
        setArea(filters.area || '');
    }, [filters.search, filters.area]);

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
    const applyFilters = (newSearch?: string, newArea?: string) => {
        setIsLoading(true);
        
        router.get(route('admin.job-applications.index'), {
            search: (newSearch ?? search) || '',
            area: (newArea ?? area) || ''
        }, {
            preserveState: true,
            only: ['applications'],
            onFinish: () => setIsLoading(false)
        });
    };

    // Función con debounce para búsqueda automática
    const handleSearchChange = (value: string) => {
        setSearch(value);
        
        // Cancelar timeout anterior si existe
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Aplicar debounce de 500ms
        searchTimeoutRef.current = setTimeout(() => {
            applyFilters(value, area);
        }, 500);
    };

    // Función para filtro de área
    const handleAreaChange = (selectedArea: string) => {
        setArea(selectedArea);
        applyFilters(search, selectedArea);
    };

    // Cleanup timeouts al desmontar
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
            onSuccess: () => {
                toast.success('✅ Postulacion eliminada exitosamente');
            },
            onError: () => {
                toast.error('❌ Error al eliminar la Postulacion');
            },
        });
    };

    const clearSearch = () => {
        setSearch('');
        setArea('');
        router.get(route('admin.job-applications.index'), {}, { replace: true });
    };

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

                    <Badge variant="destructive" className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 w-fit">
                        {applications.total} Postulantes
                    </Badge>
                </div>

                {/* SEARCH AND FILTER */}
                <Card className="border border-red-200 shadow-lg bg-red-50/30">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* BÚSQUEDA POR TEXTO */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="text-red-600 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            placeholder="Buscar por nombre, cédula o teléfono..."
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="pl-9 border-red-200 focus:border-red-400 focus:ring-red-400"
                                        />
                                        {isLoading && search && (
                                            <Loader2 className="text-red-600 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
                                        )}
                                    </div>
                                </div>

                                {(search || area) && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={clearSearch} 
                                        className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                                        disabled={isLoading}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>

                            {/* FILTRO POR ÁREA */}
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Filtrar por Área
                                        {area && (
                                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                                Activo: {area}
                                            </span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={area}
                                            onChange={(e) => handleAreaChange(e.target.value)}
                                            className="w-full rounded-md border border-red-200 bg-white p-3 focus:ring-2 focus:ring-red-400 focus:border-red-400"
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
                                        {isLoading && area && (
                                            <Loader2 className="text-red-600 absolute top-1/2 right-8 h-4 w-4 -translate-y-1/2 animate-spin" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* LISTA */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <FileText className="h-5 w-5 text-red-600" />
                            Lista de Postulantes
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                        </CardTitle>
                        <CardDescription className="text-red-600">Revisa, edita y descarga documentos de los postulantes.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* EMPTY STATE */}
                        {applications.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="text-red-400 mx-auto mb-4 h-14 w-14" />
                                <h3 className="text-red-700 mb-1 text-lg font-medium">No hay aplicaciones</h3>
                                <p className="text-red-600 text-sm">
                                    {search || area ? 'No se encontraron resultados con los filtros aplicados.' : 'Aún no se han recibido postulaciones.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* DESKTOP TABLE */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Cédula</TableHead>
                                                <TableHead>Área</TableHead>
                                                <TableHead>Celular</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Documentos</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {applications.data.map((application) => (
                                                <TableRow key={application.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <User className="text-muted-foreground h-4 w-4" />
                                                            {application.full_name}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>{application.ci}</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">
                                                            {application.area}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="text-muted-foreground h-4 w-4" />
                                                            {application.phone}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-muted-foreground text-sm">{formatDate(application.created_at)}</TableCell>

                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            {application.cv && (
                                                                <Badge className="text-xs bg-red-600 hover:bg-red-700 text-white">
                                                                    CV
                                                                </Badge>
                                                            )}

                                                            {application.extra_documents && application.extra_documents.length > 0 && (
                                                                <Badge className="text-xs bg-red-500 hover:bg-red-600 text-white">
                                                                    +{application.extra_documents.length} docs
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route('admin.job-applications.show', application.id)}>
                                                                    <Eye className="mr-1 h-4 w-4" />
                                                                    Ver
                                                                </Link>
                                                            </Button>

                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={route('admin.job-applications.edit', application.id)}>
                                                                    <Edit className="mr-1 h-4 w-4" />
                                                                    Editar
                                                                </Link>
                                                            </Button>

                                                            {application.cv && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDownload(
                                                                            application.cv!,
                                                                            `CV_${application.full_name.replace(/\s+/g, '_')}.pdf`,
                                                                        )
                                                                    }
                                                                >
                                                                    <Download className="mr-1 h-4 w-4" />
                                                                    CV
                                                                </Button>
                                                            )}

                                                            {application.extra_documents && application.extra_documents.length > 0 && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        application.extra_documents!.forEach((doc, index) => {
                                                                            handleDownload(
                                                                                doc,
                                                                                `Doc_${application.full_name.replace(/\s+/g, '_')}_${index + 1}.pdf`,
                                                                            );
                                                                        });
                                                                    }}
                                                                >
                                                                    <Download className="mr-1 h-4 w-4" />
                                                                    Docs
                                                                </Button>
                                                            )}

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-800">
                                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                                        Eliminar
                                                                    </Button>
                                                                </AlertDialogTrigger>

                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>

                                                                        <AlertDialogDescription>
                                                                            Esta acción eliminará permanentemente la Postulacion de {application.full_name}{' '}
                                                                            y sus documentos.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>

                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>

                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(application)}
                                                                            className="bg-red-600 hover:bg-red-700 text-white font-medium"
                                                                            disabled={processing}
                                                                        >
                                                                            Eliminar
                                                                        </AlertDialogAction>
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
                                        <Card key={application.id} className="border border-gray-200">
                                            <CardContent className="pt-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-lg">{application.full_name}</h3>
                                                        <Badge className="bg-red-100 text-red-800 border-red-300">
                                                            {application.area}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Cédula:</span>
                                                            <span className="ml-1 font-medium">{application.ci}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Teléfono:</span>
                                                            <span className="ml-1 font-medium">{application.phone}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Fecha:</span>
                                                        <span className="ml-1">{formatDate(application.created_at)}</span>
                                                    </div>
                                                    
                                                    <div className="flex gap-1">
                                                        {application.cv && (
                                                            <Badge className="text-xs bg-red-600 hover:bg-red-700 text-white">
                                                                CV
                                                            </Badge>
                                                        )}
                                                        {application.extra_documents && application.extra_documents.length > 0 && (
                                                            <Badge className="text-xs bg-red-500 hover:bg-red-600 text-white">
                                                                +{application.extra_documents.length} docs
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        <Button variant="outline" size="sm" asChild className="flex-1 min-w-0">
                                                            <Link href={route('admin.job-applications.show', application.id)}>
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                Ver
                                                            </Link>
                                                        </Button>

                                                        <Button variant="outline" size="sm" asChild className="flex-1 min-w-0">
                                                            <Link href={route('admin.job-applications.edit', application.id)}>
                                                                <Edit className="mr-1 h-4 w-4" />
                                                                Editar
                                                            </Link>
                                                        </Button>

                                                        {application.cv && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        application.cv!,
                                                                        `CV_${application.full_name.replace(/\s+/g, '_')}.pdf`,
                                                                    )
                                                                }
                                                                className="flex-1 min-w-0"
                                                            >
                                                                <Download className="mr-1 h-4 w-4" />
                                                                CV
                                                            </Button>
                                                        )}

                                                        {application.extra_documents && application.extra_documents.length > 0 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    application.extra_documents!.forEach((doc, index) => {
                                                                        handleDownload(
                                                                            doc,
                                                                            `Doc_${application.full_name.replace(/\s+/g, '_')}_${index + 1}.pdf`,
                                                                        );
                                                                    });
                                                                }}
                                                                className="flex-1 min-w-0"
                                                            >
                                                                <Download className="mr-1 h-4 w-4" />
                                                                Docs
                                                            </Button>
                                                        )}

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-800 flex-1 min-w-0">
                                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                                    Eliminar
                                                                </Button>
                                                            </AlertDialogTrigger>

                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>

                                                                    <AlertDialogDescription>
                                                                        Esta acción eliminará permanentemente la Postulacion de {application.full_name}{' '}
                                                                        y sus documentos.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>

                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>

                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(application)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white font-medium"
                                                                        disabled={processing}
                                                                    >
                                                                        Eliminar
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* PAGINATION */}
                                {applications.last_page > 1 && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
                                        <div className="text-red-600 text-sm font-medium">
                                            Mostrando {applications.from} a {applications.to} de {applications.total} resultados
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {applications.current_page > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.get(
                                                            route('admin.job-applications.index'),
                                                            {
                                                                page: applications.current_page - 1,
                                                                search: search || '',
                                                                area: area || '',
                                                            },
                                                            { replace: true },
                                                        )
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    Anterior
                                                </Button>
                                            )}

                                            {Array.from({ length: Math.min(5, applications.last_page) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <Button
                                                        key={page}
                                                        variant={page === applications.current_page ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() =>
                                                            router.get(
                                                                route('admin.job-applications.index'),
                                                                {
                                                                    page,
                                                                    search: search || '',
                                                                    area: area || ''
                                                                },
                                                                { replace: true },
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            })}

                                            {applications.current_page < applications.last_page && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.get(
                                                            route('admin.job-applications.index'),
                                                            {
                                                                page: applications.current_page + 1,
                                                                search: search || '',
                                                                area: area || '',
                                                            },
                                                            { replace: true },
                                                        )
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    Siguiente
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Toaster richColors position="top-right" />
        </AppLayout>
    );
}

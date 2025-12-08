import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

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

import { Download, Edit, Eye, FileText, Phone, Search, Trash2, User } from 'lucide-react';

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
    };
}

export default function Index({ applications, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const { delete: destroy, processing } = useForm();

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.job-applications.index'), { search }, { preserveState: true });
    };

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
        router.get(route('admin.job-applications.index'), {}, { preserveState: true });
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

            <div className="space-y-8 p-10">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Postulaciones de Trabajo</h1>
                        <p className="text-muted-foreground mt-1">Gestiona las postulaciones recibidas de forma clara y ordenada.</p>
                    </div>

                    <Badge variant="secondary" className="px-4 py-1 text-sm">
                        {applications.total} Postulantes
                    </Badge>
                </div>

                {/* SEARCH */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Buscar por nombre, cédula o teléfono..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <Button type="submit" variant="outline">
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>

                            {search && (
                                <Button type="button" variant="outline" onClick={clearSearch}>
                                    Limpiar
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* LISTA */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Lista de Postulantes
                        </CardTitle>
                        <CardDescription>Revisa, edita y descarga documentos de los postulantes.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* EMPTY STATE */}
                        {applications.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <FileText className="text-muted-foreground mx-auto mb-4 h-14 w-14" />
                                <h3 className="text-muted-foreground mb-1 text-lg font-medium">No hay aplicaciones</h3>
                                <p className="text-muted-foreground text-sm">
                                    {search ? 'No se encontraron resultados.' : 'Aún no se han recibido postulaciones.'}
                                </p>
                            </div>
                        ) : (
                            <>
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
                                                <TableCell>{application.area}</TableCell>

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
                                                            <Badge variant="outline" className="text-xs">
                                                                CV
                                                            </Badge>
                                                        )}

                                                        {application.extra_documents && application.extra_documents.length > 0 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{application.extra_documents.length} docs
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* ACTIONS */}
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

                                                        {/* DELETE */}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
                                                                        className="bg-red-600 hover:bg-red-700"
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

                                {/* PAGINATION */}
                                {applications.last_page > 1 && (
                                    <div className="flex items-center justify-between pt-6">
                                        <div className="text-muted-foreground text-sm">
                                            Mostrando {applications.from} a {applications.to} de {applications.total} resultados
                                        </div>

                                        <div className="flex gap-2">
                                            {applications.current_page > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.get(
                                                            route('admin.job-applications.index'),
                                                            {
                                                                page: applications.current_page - 1,
                                                                search,
                                                            },
                                                            { preserveState: true },
                                                        )
                                                    }
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
                                                                { page, search },
                                                                { preserveState: true },
                                                            )
                                                        }
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
                                                                search,
                                                            },
                                                            { preserveState: true },
                                                        )
                                                    }
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

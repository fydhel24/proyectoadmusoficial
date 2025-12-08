import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toaster } from 'sonner';
import { Download, Edit, ArrowLeft, FileText, User, Phone, IdCard, Calendar } from 'lucide-react';

interface JobApplication {
    id: number;
    full_name: string;
    ci: string;
    area: string;
    phone: string;
    cv: string | null;
    extra_documents: string[] | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    application: JobApplication;
}

export default function Show({ application }: Props) {
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

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Aplicaciones de Trabajo',
                    href: route('admin.job-applications.index'),
                },
                {
                    title: application.full_name,
                    href: route('admin.job-applications.show', application.id),
                },
            ]}
        >
            <Head title={`Aplicación - ${application.full_name}`} />

            <div className="space-y-8 p-10">
                {/* HEADER */}
                <div className="flex items-center justify-between w-full border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild className="rounded-full">
                            <Link href={route('admin.job-applications.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Link>
                        </Button>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Detalles de Postulación
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Información completa de la postulación de <strong>{application.full_name}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                {/* GRID MAIN */}
                <div className="grid gap-8 md:grid-cols-2">

                    {/* INFORMACIÓN PERSONAL */}
                    <Card className="shadow-sm border border-gray-200 rounded-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                <User className="h-5 w-5 text-blue-600" />
                                Información Personal
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">

                            {/* Nombre */}
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Nombre Completo</p>
                                    <p className="text-sm text-gray-600">{application.full_name}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* CI */}
                            <div className="flex items-start gap-3">
                                <IdCard className="h-4 w-4 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Cédula de Identidad</p>
                                    <p className="text-sm text-gray-600">{application.ci}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Área */}
                            <div className="flex items-start gap-3">
                                <IdCard className="h-4 w-4 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Área de Postulación</p>
                                    <p className="text-sm text-gray-600">{application.area}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Teléfono */}
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Teléfono/Celular</p>
                                    <p className="text-sm text-gray-600">{application.phone}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Fecha de aplicación */}
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Fecha de Aplicación</p>
                                    <p className="text-sm text-gray-600">{formatDate(application.created_at)}</p>
                                </div>
                            </div>

                            {/* Si se editó */}
                            {application.updated_at !== application.created_at && (
                                <>
                                    <Separator />
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Última Modificación</p>
                                            <p className="text-sm text-gray-600">{formatDate(application.updated_at)}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* DOCUMENTOS */}
                    <Card className="shadow-sm border border-gray-200 rounded-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Documentos
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Archivos adjuntos proporcionados por el postulante
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            {/* CV */}
                            {application.cv ? (
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-semibold">Currículum Vitae</p>
                                            <p className="text-xs text-gray-500">PDF / DOC</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() =>
                                            handleDownload(
                                                application.cv!,
                                                `CV_${application.full_name.replace(/\s+/g, '_')}.pdf`
                                            )
                                        }
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Descargar
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No se adjuntó currículum vitae</p>
                                </div>
                            )}

                            {/* DOCUMENTOS EXTRA */}
                            {application.extra_documents && application.extra_documents.length > 0 ? (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-700">Documentos Adicionales</h4>

                                    {application.extra_documents.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-semibold">Documento {index + 1}</p>
                                                    <p className="text-xs text-gray-500">Archivo adjunto</p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full"
                                                onClick={() =>
                                                    handleDownload(
                                                        doc,
                                                        `Doc_${application.full_name.replace(/\s+/g, '_')}_${index + 1}.pdf`
                                                    )
                                                }
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Descargar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No se adjuntaron documentos adicionales</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Toaster richColors position="top-right" />
        </AppLayout>
    );
}

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Edit, ArrowLeft, FileText, User, Phone, IdCard, Calendar } from 'lucide-react';

interface JobApplication {
    id: number;
    full_name: string;
    ci: string;
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
        <>
            <Head title={`Aplicación - ${application.full_name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.job-applications.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Detalles de Aplicación</h1>
                            <p className="text-muted-foreground">
                                Información completa de la aplicación de {application.full_name}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.job-applications.edit', application.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información Personal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Nombre Completo</p>
                                    <p className="text-sm text-muted-foreground">{application.full_name}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <IdCard className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Cédula de Identidad</p>
                                    <p className="text-sm text-muted-foreground">{application.ci}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Teléfono/Celular</p>
                                    <p className="text-sm text-muted-foreground">{application.phone}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Fecha de Aplicación</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(application.created_at)}</p>
                                </div>
                            </div>
                            {application.updated_at !== application.created_at && (
                                <>
                                    <Separator />
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Última Modificación</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(application.updated_at)}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Documentos
                            </CardTitle>
                            <CardDescription>
                                Archivos adjuntos en la aplicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {application.cv ? (
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium">Currículum Vitae</p>
                                            <p className="text-xs text-muted-foreground">PDF/DOC</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(
                                            application.cv!,
                                            `CV_${application.full_name.replace(/\s+/g, '_')}.pdf`
                                        )}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Descargar
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No se adjuntó currículum vitae</p>
                                </div>
                            )}

                            {application.extra_documents && application.extra_documents.length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Documentos Adicionales</h4>
                                    {application.extra_documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium">Documento {index + 1}</p>
                                                    <p className="text-xs text-muted-foreground">Archivo adjunto</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(
                                                    doc,
                                                    `Doc_${application.full_name.replace(/\s+/g, '_')}_${index + 1}.pdf`
                                                )}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Descargar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No se adjuntaron documentos adicionales</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Application Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado de la Aplicación</CardTitle>
                        <CardDescription>
                            Información general sobre el estado de esta aplicación
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="text-sm">
                                ID: {application.id}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                Activa
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                {application.extra_documents ? application.extra_documents.length + (application.cv ? 1 : 0) : (application.cv ? 1 : 0)} documento(s)
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
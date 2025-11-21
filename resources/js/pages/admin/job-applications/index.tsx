import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, FileText, Phone, User } from 'lucide-react';

interface JobApplication {
    id: number;
    full_name: string;
    ci: string;
    phone: string;
    cv: string | null;
    extra_documents: string[] | null;
    created_at: string;
}

interface Props {
    applications: JobApplication[];
}

export default function Index({ applications }: Props) {
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
            <Head title="Aplicaciones de Trabajo" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Aplicaciones de Trabajo</h1>
                        <p className="text-muted-foreground">
                            Gestiona las aplicaciones recibidas para trabajar con nosotros.
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {applications.length} aplicaciones
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Lista de Aplicaciones
                        </CardTitle>
                        <CardDescription>
                            Revisa y descarga los documentos de los candidatos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {applications.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    No hay aplicaciones
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Aún no se han recibido aplicaciones de trabajo.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre Completo</TableHead>
                                        <TableHead>Cédula</TableHead>
                                        <TableHead>Teléfono</TableHead>
                                        <TableHead>Fecha de Aplicación</TableHead>
                                        <TableHead>Documentos</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((application) => (
                                        <TableRow key={application.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    {application.full_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{application.ci}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    {application.phone}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(application.created_at)}
                                            </TableCell>
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
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {application.cv && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDownload(
                                                                application.cv!,
                                                                `CV_${application.full_name.replace(/\s+/g, '_')}.pdf`
                                                            )}
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
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
                                                                        `Doc_${application.full_name.replace(/\s+/g, '_')}_${index + 1}.pdf`
                                                                    );
                                                                });
                                                            }}
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Docs
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
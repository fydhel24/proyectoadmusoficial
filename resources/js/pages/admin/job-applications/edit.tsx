import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, User, Phone, IdCard, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

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
    application: JobApplication;
}

export default function Edit({ application }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: application.full_name,
        ci: application.ci,
        phone: application.phone,
        cv: null as File | null,
        extra_documents: [] as File[],
    });

    const [cvPreview, setCvPreview] = useState<string | null>(application.cv ? 'Archivo existente' : null);
    const [extraDocumentsPreview, setExtraDocumentsPreview] = useState<string[]>([]);

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cv', file);
            setCvPreview(file.name);
        }
    };

    const handleExtraDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('extra_documents', files);
        setExtraDocumentsPreview(files.map(file => file.name));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.job-applications.update', application.id));
    };

    return (
        <>
            <Head title={`Editar Aplicación - ${application.full_name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.job-applications.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Aplicación</h1>
                        <p className="text-muted-foreground">
                            Modifica la información de la aplicación de {application.full_name}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información Personal
                        </CardTitle>
                        <CardDescription>
                            Actualiza los datos del candidato.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Nombre Completo *
                                </Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    placeholder="Ingresa el nombre completo"
                                    required
                                />
                                {errors.full_name && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.full_name}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* CI */}
                            <div className="space-y-2">
                                <Label htmlFor="ci" className="flex items-center gap-2">
                                    <IdCard className="h-4 w-4" />
                                    Cédula de Identidad *
                                </Label>
                                <Input
                                    id="ci"
                                    type="text"
                                    value={data.ci}
                                    onChange={(e) => setData('ci', e.target.value)}
                                    placeholder="Ingresa el número de cédula"
                                    required
                                />
                                {errors.ci && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.ci}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Teléfono/Celular *
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Ingresa el número de teléfono"
                                    required
                                />
                                {errors.phone && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.phone}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* CV */}
                            <div className="space-y-2">
                                <Label htmlFor="cv" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Currículum Vitae
                                </Label>
                                {application.cv && (
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Archivo actual: CV existente
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="cv"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleCvChange}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="cv"
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {application.cv ? 'Cambiar archivo' : 'Seleccionar archivo'}
                                    </Label>
                                    {cvPreview && (
                                        <span className="text-sm text-gray-600">{cvPreview}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Formatos aceptados: PDF, DOC, DOCX. Tamaño máximo: 5MB
                                </p>
                                {errors.cv && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.cv}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Extra Documents */}
                            <div className="space-y-2">
                                <Label htmlFor="extra_documents" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Documentos Adicionales
                                </Label>
                                {application.extra_documents && application.extra_documents.length > 0 && (
                                    <div className="text-sm text-muted-foreground mb-2">
                                        {application.extra_documents.length} documento(s) existente(s)
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="extra_documents"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        multiple
                                        onChange={handleExtraDocumentsChange}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="extra_documents"
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Seleccionar archivos
                                    </Label>
                                    {extraDocumentsPreview.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {extraDocumentsPreview.map((name, index) => (
                                                <span key={index} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Formatos aceptados: PDF, DOC, DOCX, JPG, JPEG, PNG. Tamaño máximo por archivo: 5MB
                                </p>
                                {errors.extra_documents && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.extra_documents}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.job-applications.index')}>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
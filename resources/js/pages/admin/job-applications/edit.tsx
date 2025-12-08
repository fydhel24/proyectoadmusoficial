import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, IdCard, Phone, Upload, User } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

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
    application: JobApplication;
}

export default function Edit({ application }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: application.full_name,
        ci: application.ci,
        area: application.area,
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
        setExtraDocumentsPreview(files.map((f) => f.name));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.job-applications.update', application.id), {
            onSuccess: () => toast.success('✅ Aplicación actualizada exitosamente'),
            onError: () => toast.error('❌ Error al actualizar la aplicación'),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Aplicaciones de Trabajo', href: route('admin.job-applications.index') },
                { title: `Editar - ${application.full_name}`, href: route('admin.job-applications.edit', application.id) },
            ]}
        >
            <Head title={`Editar Aplicación - ${application.full_name}`} />

            {/* PADDING GENERAL */}
            <div className="space-y-6 p-10">
                {/* HEADER */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.job-applications.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Aplicación</h1>
                        <p className="text-muted-foreground">Modifica la información de la aplicación de {application.full_name}</p>
                    </div>
                </div>

                {/* CARD PRINCIPAL */}
                <Card className="rounded-xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información Personal
                        </CardTitle>
                        <CardDescription>Actualiza los datos del candidato.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-8">
                            {/* FULL NAME */}
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="flex items-center gap-2 font-semibold">
                                    <User className="h-4 w-4" />
                                    Nombre Completo *
                                </Label>

                                <Input
                                    id="full_name"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    placeholder="Ingresa el nombre completo"
                                />

                                {errors.full_name && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {errors.full_name === 'validation.required'
                                                ? 'El nombre completo es obligatorio'
                                                : 'El nombre debe tener al menos 2 caracteres'}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* CI */}
                            <div className="space-y-2">
                                <Label htmlFor="ci" className="flex items-center gap-2 font-semibold">
                                    <IdCard className="h-4 w-4" />
                                    Cédula de Identidad *
                                </Label>

                                <Input id="ci" value={data.ci} onChange={(e) => setData('ci', e.target.value)} placeholder="Ingresa la cédula" />

                                {errors.ci && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {errors.ci === 'validation.required' ? 'La cédula es obligatoria' : 'Ingresa un número válido'}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* PHONE */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2 font-semibold">
                                    <Phone className="h-4 w-4" />
                                    Teléfono/Celular *
                                </Label>

                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Ejemplo: 78945612"
                                />

                                {errors.phone && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {errors.phone === 'validation.required' ? 'El teléfono es obligatorio' : 'Ingresa un número válido'}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* AREA DE POSTULACIÓN */}
                            <div className="space-y-2">
                                <Label htmlFor="area" className="font-semibold">
                                    Área de Postulación *
                                </Label>

                                <select
                                    id="area"
                                    value={data.area}
                                    onChange={(e) => setData('area', e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 bg-white p-3 focus:ring-2 focus:ring-blue-300"
                                >
                                    <option value="">Seleccione un área</option>
                                    <option value="PRODUCCION">Producción</option>
                                    <option value="EDICION">Edición</option>
                                    <option value="CAMAROGRAFO">Camarógrafo</option>
                                    <option value="MARKETING">Marketing</option>
                                    <option value="VENTAS">Ejecutivo de Ventas</option>
                                    <option value="ASESOR">Creativo</option>
                                    <option value="TALENTO">Talentos(Influencer)</option>
                                    <option value="PASANTE">Pasante</option>
                                </select>

                                {errors.area && (
                                    <Alert variant="destructive">
                                        <AlertDescription>El área es obligatoria</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* CV */}
                            <div className="space-y-2">
                                <Label htmlFor="cv" className="flex items-center gap-2 font-semibold">
                                    <FileText className="h-4 w-4" />
                                    Currículum Vitae
                                </Label>

                                {application.cv && <p className="text-muted-foreground text-sm">Archivo actual: CV existente</p>}

                                <div className="flex items-center gap-4">
                                    <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />

                                    <Label
                                        htmlFor="cv"
                                        className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {application.cv ? 'Cambiar archivo' : 'Seleccionar archivo'}
                                    </Label>

                                    {cvPreview && <span className="text-sm text-gray-600">{cvPreview}</span>}
                                </div>
                            </div>

                            {/* EXTRA DOCUMENTS */}
                            <div className="space-y-2">
                                <Label htmlFor="extra_documents" className="flex items-center gap-2 font-semibold">
                                    <FileText className="h-4 w-4" />
                                    Documentos Adicionales
                                </Label>

                                <Input
                                    id="extra_documents"
                                    multiple
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleExtraDocumentsChange}
                                    className="hidden"
                                />

                                <Label
                                    htmlFor="extra_documents"
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
                                >
                                    <Upload className="h-4 w-4" />
                                    Seleccionar archivos
                                </Label>

                                {/* PREVIEW */}
                                {extraDocumentsPreview.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {extraDocumentsPreview.map((file, i) => (
                                            <span key={i} className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                                                {file}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="bg-blue-600 text-white hover:bg-blue-700">
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>

                                <Button variant="outline" asChild>
                                    <Link href={route('admin.job-applications.index')}>Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Toaster richColors position="top-right" />
        </AppLayout>
    );
}

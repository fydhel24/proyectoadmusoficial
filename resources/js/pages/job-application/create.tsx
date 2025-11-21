import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Toaster, toast } from 'sonner';
import { Upload, FileText, User, Phone, IdCard } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        ci: '',
        phone: '',
        cv: null as File | null,
        extra_documents: [] as File[],
    });

    const [cvPreview, setCvPreview] = useState<string | null>(null);
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
        post(route('job-applications.store'), {
            onSuccess: () => {
                toast.success('¡Aplicación enviada exitosamente! Te contactaremos pronto.');
                reset();
                setCvPreview(null);
                setExtraDocumentsPreview([]);
            },
            onError: () => {
                toast.error('Error al enviar la aplicación. Por favor, inténtalo de nuevo.');
            },
        });
    };

    return (
        <>
            <Head title="Trabaja con Nosotros" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Trabaja con Nosotros
                        </h1>
                        <p className="text-lg text-gray-600">
                            Únete a nuestro equipo. Envía tu información y documentos para considerar tu aplicación.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información Personal
                            </CardTitle>
                            <CardDescription>
                                Completa todos los campos requeridos para enviar tu aplicación.
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
                                        placeholder="Ingresa tu nombre completo"
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
                                        placeholder="Ingresa tu número de cédula"
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
                                        placeholder="Ingresa tu número de teléfono"
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
                                        Currículum Vitae (CV) *
                                    </Label>
                                    <Input
                                        id="cv"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleCvChange}
                                        required
                                        className="hidden"
                                    />
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
                                            Seleccionar archivo
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
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    {processing ? 'Enviando...' : 'Enviar Aplicación'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <Toaster richColors position="top-right" />
            </div>
        </>
    );
}
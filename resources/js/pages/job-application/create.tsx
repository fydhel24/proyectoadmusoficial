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
            // Check file size (20MB = 20 * 1024 * 1024 bytes)
            const maxSize = 20 * 1024 * 1024; // 20MB
            if (file.size > maxSize) {
                toast.error(`❌ El archivo es demasiado grande. Tamaño máximo: 20MB. Archivo actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                e.target.value = ''; // Clear the input
                return;
            }
            setData('cv', file);
            setCvPreview(file.name);
        }
    };

    const handleExtraDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 20 * 1024 * 1024; // 20MB

        // Check each file size
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            const oversizedNames = oversizedFiles.map(file => `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`).join(', ');
            toast.error(`❌ Archivos demasiado grandes (máximo 20MB cada uno): ${oversizedNames}`);
            e.target.value = ''; // Clear the input
            return;
        }

        setData('extra_documents', files);
        setExtraDocumentsPreview(files.map(file => file.name));
    };

    const removeCv = () => {
        setData('cv', null);
        setCvPreview(null);
        // Reset the file input
        const cvInput = document.getElementById('cv') as HTMLInputElement;
        if (cvInput) cvInput.value = '';
    };

    const removeExtraDocument = (index: number) => {
        const currentFiles = data.extra_documents as File[];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        const newPreviews = extraDocumentsPreview.filter((_, i) => i !== index);

        setData('extra_documents', newFiles);
        setExtraDocumentsPreview(newPreviews);

        // Reset the file input to allow re-selection
        const extraInput = document.getElementById('extra_documents') as HTMLInputElement;
        if (extraInput) extraInput.value = '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!data.cv) {
            toast.error('❌ Debes seleccionar un archivo para el currículum vitae.');
            return;
        }

        post(route('job-applications.store'), {
            onSuccess: () => {
                toast.success('✅ ¡Aplicación enviada exitosamente! Te contactaremos pronto vía email o teléfono.');
                reset();
                setCvPreview(null);
                setExtraDocumentsPreview([]);
            },
            onError: (errors: any) => {
                console.error('Form submission errors:', errors);
                toast.error('❌ Error al enviar la aplicación. Revisa los campos e inténtalo de nuevo.');
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
                                    ¡Trabaja con Nosotros!
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Únete a nuestro talentoso equipo. Completa el formulario y envía tus documentos para que podamos conocerte mejor.
                                </p>
                            </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription>
                                    Proporciona tus datos personales para que podamos contactarte.
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
                                        placeholder="Ej: Juan Pérez García"
                                        required
                                    />
                                    {errors.full_name && (
                                        <Alert variant="destructive">
                                            <AlertDescription>
                                                {errors.full_name === 'validation.required' ?
                                                    'El nombre completo es obligatorio' :
                                                    'El nombre debe tener al menos 2 caracteres'
                                                }
                                            </AlertDescription>
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
                                        placeholder="Ej: 12345678 o 1234567-8A"
                                        required
                                    />
                                    {errors.ci && (
                                        <Alert variant="destructive">
                                            <AlertDescription>
                                                {errors.ci === 'validation.required' ?
                                                    'La cédula de identidad es obligatoria' :
                                                    'Ingresa una cédula válida (solo números y guiones)'
                                                }
                                            </AlertDescription>
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
                                        placeholder="Ej: +591 77712345 o 77712345"
                                        required
                                    />
                                    {errors.phone && (
                                        <Alert variant="destructive">
                                            <AlertDescription>
                                                {errors.phone === 'validation.required' ?
                                                    'El número de teléfono es obligatorio' :
                                                    'Ingresa un número de teléfono válido'
                                                }
                                            </AlertDescription>
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
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">{cvPreview}</span>
                                                <button
                                                    type="button"
                                                    onClick={removeCv}
                                                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                                                    title="Quitar archivo"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        📄 Formatos aceptados: PDF, DOC, DOCX (máximo 20MB)
                                    </p>
                                    {errors.cv && (
                                        <Alert variant="destructive">
                                            <AlertDescription>
                                                {errors.cv.includes('required') || errors.cv.includes('The cv field is required') ?
                                                    'El currículum vitae es obligatorio para postular' :
                                                    errors.cv.includes('mimes') || errors.cv.includes('The cv must be a file of type') ?
                                                    'Solo se aceptan archivos PDF, DOC o DOCX' :
                                                    errors.cv.includes('max') || errors.cv.includes('The cv may not be greater than') ?
                                                        'El archivo es demasiado grande (máximo 20MB)' :
                                                    `Error con el archivo del CV: ${errors.cv}`
                                                }
                                            </AlertDescription>
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
                                                    <div key={index} className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        <span className="truncate max-w-32">{name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExtraDocument(index)}
                                                            className="text-red-500 hover:text-red-700 text-xs font-bold ml-1"
                                                            title="Quitar archivo"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        📎 Opcional: Certificados, portafolio, referencias, etc. (PDF, DOC, DOCX, imágenes - máximo 20MB cada uno)
                                    </p>
                                    {errors.extra_documents && (
                                        <Alert variant="destructive">
                                            <AlertDescription>
                                                {errors.extra_documents.includes('mimes') ?
                                                    'Solo se aceptan archivos PDF, DOC, DOCX, JPG, JPEG o PNG' :
                                                    errors.extra_documents.includes('max') ?
                                                        'Uno o más archivos superan el límite de 20MB' :
                                                    'Error con los documentos adicionales'
                                                }
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    {processing ? '⏳ Enviando aplicación...' : '🚀 Enviar mi aplicación'}
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
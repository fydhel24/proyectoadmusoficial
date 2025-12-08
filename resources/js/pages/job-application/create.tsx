import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { FileText, IdCard, Phone, Upload, User } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        ci: '',
        area: '',
        phone: '',
        cv: null as File | null,
        extra_documents: [] as File[],
    });

    const [cvPreview, setCvPreview] = useState<string | null>(null);
    const [extraDocumentsPreview, setExtraDocumentsPreview] = useState<string[]>([]);

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 20 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error(`❌ El archivo es demasiado grande. Máx: 20MB. Actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                e.target.value = '';
                return;
            }
            setData('cv', file);
            setCvPreview(file.name);
        }
    };

    const handleExtraDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 20 * 1024 * 1024;
        const oversizedFiles = files.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            const oversizedNames = oversizedFiles.map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)}MB)`).join(', ');
            toast.error(`❌ Archivos demasiado grandes: ${oversizedNames}`);
            e.target.value = '';
            return;
        }
        setData('extra_documents', files);
        setExtraDocumentsPreview(files.map((f) => f.name));
    };

    const removeCv = () => {
        setData('cv', null);
        setCvPreview(null);
        const cvInput = document.getElementById('cv') as HTMLInputElement;
        if (cvInput) cvInput.value = '';
    };

    const removeExtraDocument = (index: number) => {
        const newFiles = (data.extra_documents as File[]).filter((_, i) => i !== index);
        const newPreviews = extraDocumentsPreview.filter((_, i) => i !== index);
        setData('extra_documents', newFiles);
        setExtraDocumentsPreview(newPreviews);
        const extraInput = document.getElementById('extra_documents') as HTMLInputElement;
        if (extraInput) extraInput.value = '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.cv) {
            toast.error('❌ Debes seleccionar y subir tu CV');
            return;
        }

        post(route('job-applications.store'), {
            onSuccess: () => {
                toast.success('✅ ¡Postulacion enviada exitosamente!');
                reset();
                setCvPreview(null);
                setExtraDocumentsPreview([]);
            },
            onError: (errors: any) => {
                toast.error('❌ Error al enviar la postulacion. Revisa los campos.');
            },
        });
    };

    return (
        <>
            <Head title="Trabaja con Nosotros" />

            {/* Fondo degradiente rojo a negro */}
            <div className="min-h-screen bg-gradient-to-b from-red-700 to-black px-4 py-12 text-gray-100 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {/* Título */}
                    <div className="mb-8 text-center">
                        <h1 className="font-montserrat mb-2 text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
                            ¡Unete a nuestro Equipo!!!
                        </h1>
                        <h3 className="font-roboto-slab mb-4 text-3xl font-bold tracking-tight text-white uppercase drop-shadow-md">
                            ADMUS PRODUCTIONS
                        </h3>
                        <p className="text-lg text-gray-200">Únete a nuestro talentoso equipo. Completa el formulario y envía tus documentos.</p>
                    </div>

                    <div className="flex justify-center">
                        <Card className="w-full max-w-md border-none bg-transparent shadow-xl">
                            <CardHeader>
                                <CardTitle className="font-montserrat flex items-center gap-2 text-lg font-bold text-white">
                                    <User className="h-5 w-5 text-white" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription className="text-gray-300">Proporciona tus datos para que podamos contactarte.</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={submit} className="flex flex-col items-center space-y-6">
                                    {/* Nombre */}
                                    <div className="w-full max-w-md space-y-2">
                                        <Label htmlFor="full_name" className="flex items-center gap-2 font-semibold text-gray-100">
                                            <User className="h-4 w-4" />
                                            Nombre y Apellidos Completo *
                                        </Label>
                                        <Input
                                            id="full_name"
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            placeholder="Ej: Juan Pérez García"
                                            required
                                            className="border-gray-600 bg-gray-600 font-medium text-white focus:border-red-500 focus:ring-red-500"
                                        />
                                        {errors.full_name && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.full_name}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* CI */}
                                    <div className="w-full max-w-md space-y-2">
                                        <Label htmlFor="ci" className="flex items-center gap-2 font-semibold text-gray-100">
                                            <IdCard className="h-4 w-4" />
                                            Cédula de Identidad *
                                        </Label>
                                        <Input
                                            id="ci"
                                            type="text"
                                            value={data.ci}
                                            onChange={(e) => setData('ci', e.target.value)}
                                            placeholder="Ej: 12345678"
                                            required
                                            className="border-gray-600 bg-gray-600 font-medium text-white focus:border-red-500 focus:ring-red-500"
                                        />
                                        {errors.ci && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.ci}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* Teléfono */}
                                    <div className="w-full max-w-md space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2 font-semibold text-gray-100">
                                            <Phone className="h-4 w-4" />
                                            Celular *
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="Ej: 77712345"
                                            required
                                            className="border-gray-600 bg-gray-600 font-medium text-white focus:border-red-500 focus:ring-red-500"
                                        />
                                        {errors.phone && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.phone}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* Área */}
                                    <div className="w-full max-w-md space-y-2">
                                        <Label htmlFor="area" className="font-semibold text-gray-100">
                                            Área de Postulación *
                                        </Label>
                                        <select
                                            id="area"
                                            value={data.area}
                                            onChange={(e) => setData('area', e.target.value)}
                                            required
                                            className="w-full rounded-md border border-gray-600 bg-gray-600 p-2 font-medium text-white focus:border-red-500 focus:ring-red-500"
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
                                                <AlertDescription>{errors.area}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {/* CV */}
                                    <div className="w-full max-w-md space-y-2">
                                        <Label htmlFor="cv" className="flex items-center gap-2 font-semibold text-gray-100">
                                            <FileText className="h-4 w-4" />
                                            Currículum Vitae *
                                        </Label>
                                        <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                                        <Label
                                            htmlFor="cv"
                                            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-600 bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
                                        >
                                            <Upload className="h-4 w-4" /> Seleccionar archivo
                                        </Label>
                                        {cvPreview && (
                                            <div className="flex items-center gap-2 font-medium text-gray-200">
                                                {cvPreview}
                                                <button type="button" onClick={removeCv} className="font-bold text-red-500 hover:text-red-700">
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Extra Documents */}
                                    <div className="w-full max-w-md space-y-2">
                                        <Label htmlFor="extra_documents" className="flex items-center gap-2 font-semibold text-gray-100">
                                            <FileText className="h-4 w-4" />
                                            Documentos Adicionales (Opcional)
                                        </Label>
                                        <Input
                                            id="extra_documents"
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleExtraDocumentsChange}
                                            className="hidden"
                                        />
                                        <Label
                                            htmlFor="extra_documents"
                                            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-600 bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700"
                                        >
                                            <Upload className="h-4 w-4" /> Seleccionar archivos
                                        </Label>
                                        {extraDocumentsPreview.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {extraDocumentsPreview.map((name, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-opacity-50 flex items-center gap-1 rounded bg-red-800 px-2 py-1 text-sm font-medium text-white"
                                                    >
                                                        {name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExtraDocument(i)}
                                                            className="ml-1 font-bold text-red-400 hover:text-red-600"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full max-w-md bg-red-600 font-bold text-white hover:bg-red-700"
                                    >
                                        {processing ? '⏳ Enviando...' : '🚀 Enviar Postulación'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Toaster richColors position="top-right" />
            </div>
        </>
    );
}

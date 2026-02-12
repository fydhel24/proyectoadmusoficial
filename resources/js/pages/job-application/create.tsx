'use client';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { gsap } from 'gsap';
import { Briefcase, FileText, IdCard, Phone, Upload, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import Footer from '../home/footer';

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

    // GSAP Animation Refs
    const bgContainerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Background animation
        const ctx = gsap.context(() => {
            const bubbles = gsap.utils.toArray('.bg-bubble');
            bubbles.forEach((bubble: any) => {
                gsap.to(bubble, {
                    x: 'random(-100, 100)',
                    y: 'random(-100, 100)',
                    duration: 'random(10, 20)',
                    repeat: -1,
                    yoyo: true,
                    ease: 'none',
                });
            });

            // Entry animation
            gsap.from(formRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
            });
        }, bgContainerRef);

        return () => ctx.revert();
    }, []);

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
        setData('extra_documents', [...data.extra_documents, ...files]);
        setExtraDocumentsPreview([...extraDocumentsPreview, ...files.map((f) => f.name)]);
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
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.cv) {
            toast.error('❌ Debes seleccionar y subir tu CV');
            return;
        }

        post(route('job-applications.store'), {
            onSuccess: () => {
                toast.success('✅ ¡Postulación enviada exitosamente!');
                reset();
                setCvPreview(null);
                setExtraDocumentsPreview([]);
            },
            onError: (errors: any) => {
                toast.error('❌ Error al enviar la postulación. Revisa los campos.');
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="relative flex-grow overflow-hidden pt-20" ref={bgContainerRef}>
                <Head title="Trabaja con Nosotros | Admus Productions" />

                {/* GSAP Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="bg-bubble absolute -top-24 -left-24 h-96 w-96 rounded-full bg-red-500/10 blur-3xl dark:bg-red-600/5" />
                    <div className="bg-bubble absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-600/5" />
                    <div className="bg-bubble absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-red-400/10 blur-3xl dark:bg-red-500/5" />
                </div>

                <div className="container mx-auto px-4 py-12 lg:py-20" ref={formRef}>
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-orbitron mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl dark:text-white">
                            ÚNETE A NUESTRO <span className="text-red-600">EQUIPO</span>
                        </h1>
                        <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-400">
                            En Admus Productions estamos buscando talentos apasionados. <br />
                            Completa el formulario y comienza tu carrera con nosotros.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Card className="w-full max-w-2xl border-0 bg-white/70 shadow-2xl backdrop-blur-xl dark:bg-slate-900/70">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                                    <Briefcase className="h-6 w-6 text-red-600" />
                                    Formulario de Postulación
                                </CardTitle>
                                <CardDescription>Proporciona tus datos profesionales y carga tus documentos.</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={submit} className="space-y-8">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Nombre */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="full_name"
                                                className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300"
                                            >
                                                <User className="h-4 w-4" />
                                                Nombre Completo *
                                            </Label>
                                            <Input
                                                id="full_name"
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                placeholder="Ej: Juan Pérez"
                                                required
                                                className="h-11 rounded-lg border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-800/50"
                                            />
                                            {errors.full_name && <p className="text-xs font-medium text-red-500">{errors.full_name}</p>}
                                        </div>

                                        {/* CI */}
                                        <div className="space-y-2">
                                            <Label htmlFor="ci" className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                <IdCard className="h-4 w-4" />
                                                Cédula de Identidad *
                                            </Label>
                                            <Input
                                                id="ci"
                                                value={data.ci}
                                                onChange={(e) => setData('ci', e.target.value)}
                                                placeholder="Ej: 1234567"
                                                required
                                                className="h-11 rounded-lg border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-800/50"
                                            />
                                            {errors.ci && <p className="text-xs font-medium text-red-500">{errors.ci}</p>}
                                        </div>

                                        {/* Celular */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                <Phone className="h-4 w-4" />
                                                Celular de contacto *
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="Ej: 77712345"
                                                required
                                                className="h-11 rounded-lg border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-800/50"
                                            />
                                            {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone}</p>}
                                        </div>

                                        {/* Área */}
                                        <div className="space-y-2">
                                            <Label htmlFor="area" className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                <Briefcase className="h-4 w-4" />
                                                Área de interés *
                                            </Label>
                                            <Select value={data.area} onValueChange={(value) => setData('area', value)}>
                                                <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-800/50">
                                                    <SelectValue placeholder="Seleccione un área" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PRODUCCION">Producción</SelectItem>
                                                    <SelectItem value="EDICION">Edición</SelectItem>
                                                    <SelectItem value="CAMAROGRAFO">Camarógrafo</SelectItem>
                                                    <SelectItem value="MARKETING">Marketing</SelectItem>
                                                    <SelectItem value="VENTAS">Ejecutivo de Ventas</SelectItem>
                                                    <SelectItem value="CREATIVO">Creativo</SelectItem>
                                                    <SelectItem value="TALENTO">Talento (Influencer)</SelectItem>
                                                    <SelectItem value="PASANTE">Pasante</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.area && <p className="text-xs font-medium text-red-500">{errors.area}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* CV Upload */}
                                        <div className="space-y-4">
                                            <Label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                <FileText className="h-4 w-4" />
                                                Currículum Vitae (PDF/Word) *
                                            </Label>
                                            <div className="relative">
                                                <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                                                <Label
                                                    htmlFor="cv"
                                                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-red-500 hover:bg-red-50/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-red-500/50"
                                                >
                                                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-red-500" />
                                                    <span className="font-bold text-slate-600 dark:text-slate-400">
                                                        Haga clic o arrastre su archivo aquí
                                                    </span>
                                                    <span className="text-xs text-slate-400">PDF, DOCX hasta 20MB</span>
                                                </Label>

                                                {cvPreview && (
                                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4" />
                                                            <span className="max-w-[200px] truncate text-sm font-bold">{cvPreview}</span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={removeCv}
                                                            className="h-8 w-8 text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-800/30"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Extra Documents */}
                                        <div className="space-y-4">
                                            <Label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                <Upload className="h-4 w-4" />
                                                Documentos Adicionales (Fotos, Portafolio, etc.)
                                            </Label>
                                            <div className="relative">
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
                                                    className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-red-500 hover:bg-red-50/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-red-500/50"
                                                >
                                                    <span className="font-bold text-slate-600 dark:text-slate-400">
                                                        Añadir documentos adicionales
                                                    </span>
                                                    <span className="text-xs text-slate-400">Puede seleccionar múltiples archivos</span>
                                                </Label>

                                                {extraDocumentsPreview.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {extraDocumentsPreview.map((name, i) => (
                                                            <Badge
                                                                key={i}
                                                                variant="secondary"
                                                                className="flex items-center gap-1 py-1 pr-1 font-bold"
                                                            >
                                                                <span className="max-w-[100px] truncate">{name}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeExtraDocument(i)}
                                                                    className="h-5 w-5 p-0 text-slate-500 hover:bg-transparent hover:text-red-500"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-14 w-full rounded-xl bg-red-600 px-8 text-lg font-black tracking-widest text-white shadow-xl transition-all hover:bg-red-700 active:scale-95"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                procesando...
                                            </span>
                                        ) : (
                                            'ENVIAR MI POSTULACIÓN'
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Toaster richColors position="top-right" />
            </main>

            <Footer />
        </div>
    );
}

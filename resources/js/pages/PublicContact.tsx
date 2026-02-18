import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Loader2,
    Send,
    User,
    Mail,
    Building2,
    Phone,
    DollarSign,
    MessageSquare,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import Footer from './home/footer';

export default function PublicContact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombrecompleto: '',
        correoelectronico: '',
        presupuesto: '',
        celular: '',
        descripcion: '',
        empresa: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contacts.store'), {
            onSuccess: () => {
                const message = `¡Hola AdmusProductions! 👋\n\nHe enviado mis datos a través de la web:\n\n👤 *Nombre:* ${data.nombrecompleto}\n🏢 *Empresa:* ${data.empresa}\n📧 *Correo:* ${data.correoelectronico}\n📱 *Celular:* ${data.celular}\n💰 *Presupuesto:* Bs. ${data.presupuesto}\n📝 *Descripción:* ${data.descripcion}\n\nQuedo a la espera de su respuesta. Gracias!`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/59179582395?text=${encodedMessage}`;

                toast.success('¡Datos enviados exitosamente! Redireccionando a WhatsApp...');
                reset();

                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    window.location.href = '/';
                }, 500);
            },
            onError: () => {
                toast.error('Por favor, verifica los campos del formulario.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <Head title="Contáctanos - ADMUSPRODUCTIONS" />
            <Header />

            <div className="flex min-h-screen pt-20">
                {/* Left Side: Video (Hidden on Mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105"
                    >
                        <source src="/assets/auth/ladologinadmus.mp4" type="video/mp4" />
                    </video>

                    {/* Blending Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/20 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 z-10" />

                    {/* Artistic Mask */}
                    <div className="absolute inset-0 z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-30" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-30" />

                    <div className="absolute bottom-12 left-12 right-12 z-40">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-black/40 backdrop-blur-md p-8 border border-white/10 rounded-none shadow-2xl"
                        >
                            <h2 className="text-4xl font-black font-orbitron text-white mb-4 leading-none">
                                POTENCIA TU <span className="text-brand">EMPRESA</span>
                            </h2>
                            <p className="text-white/80 text-lg font-medium leading-relaxed">
                                Estrategias de marketing y producción audiovisual de alto impacto para negocios que buscan resultados reales.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 lg:p-20 bg-background relative">
                    <div className="max-w-xl mx-auto w-full space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand transition-colors mb-6 font-bold uppercase tracking-widest text-xs"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al inicio
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-black font-orbitron text-foreground leading-none">
                                COTIZA TU <br />
                                <span className="text-brand">SERVICIO</span>
                            </h1>
                            <p className="mt-4 text-muted-foreground text-lg">
                                Si buscas llevar el marketing de tu empresa al siguiente nivel, déjanos tus datos para coordinar una reunión.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                                        <User className="h-3 w-3 text-brand" /> Nombre Completo
                                    </Label>
                                    <Input
                                        value={data.nombrecompleto}
                                        onChange={e => setData('nombrecompleto', e.target.value)}
                                        className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 h-12 transition-all"
                                        placeholder="Ej. Juan Pérez"
                                        required
                                    />
                                    {errors.nombrecompleto && <p className="text-xs text-brand font-bold">{errors.nombrecompleto}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                                        <Mail className="h-3 w-3 text-brand" /> Correo
                                    </Label>
                                    <Input
                                        type="email"
                                        value={data.correoelectronico}
                                        onChange={e => setData('correoelectronico', e.target.value)}
                                        className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 h-12 transition-all"
                                        placeholder="correo@empresa.com"
                                        required
                                    />
                                    {errors.correoelectronico && <p className="text-xs text-brand font-bold">{errors.correoelectronico}</p>}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                                        <Building2 className="h-3 w-3 text-brand" /> Empresa / Marca
                                    </Label>
                                    <Input
                                        value={data.empresa}
                                        onChange={e => setData('empresa', e.target.value)}
                                        className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 h-12 transition-all"
                                        placeholder="Nombre de tu negocio"
                                        required
                                    />
                                    {errors.empresa && <p className="text-xs text-brand font-bold">{errors.empresa}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                                        <Phone className="h-3 w-3 text-brand" /> Celular de Contacto
                                    </Label>
                                    <Input
                                        value={data.celular}
                                        onChange={e => setData('celular', e.target.value)}
                                        className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 h-12 transition-all"
                                        placeholder="70000000"
                                        required
                                    />
                                    {errors.celular && <p className="text-xs text-brand font-bold">{errors.celular}</p>}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                                    <DollarSign className="h-3 w-3 text-brand" /> Presupuesto Estimado (Bs.)
                                </Label>
                                <Input
                                    type="number"
                                    value={data.presupuesto}
                                    onChange={e => setData('presupuesto', e.target.value)}
                                    className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 h-12 transition-all font-bold"
                                    placeholder="0.00"
                                    required
                                />
                                {errors.presupuesto && <p className="text-xs text-brand font-bold">{errors.presupuesto}</p>}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <Label className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
                                    <MessageSquare className="h-3 w-3 text-brand" /> Describe tu Empresa
                                </Label>
                                <Textarea
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 min-h-[120px] transition-all"
                                    placeholder="Cuéntanos más sobre lo que necesitas lograr..."
                                    required
                                />
                                {errors.descripcion && <p className="text-xs text-brand font-bold">{errors.descripcion}</p>}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-brand hover:bg-brand/90 text-white h-14 text-lg font-black font-orbitron tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border border-brand"
                                >
                                    {processing ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>ENVIAR Y CONTACTAR <Send className="ml-2 h-5 w-5" /></>
                                    )}
                                </Button>
                                <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">
                                    Al enviar, serás redireccionado a nuestro WhatsApp oficial.
                                </p>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

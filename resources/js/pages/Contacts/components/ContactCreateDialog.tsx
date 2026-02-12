import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Loader2, Plus, User, Mail, Building2, Phone, DollarSign, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContactForm extends Record<string, any> {
    nombrecompleto: string;
    correoelectronico: string;
    presupuesto: string | number;
    celular: string;
    descripcion: string;
    empresa: string;
}

export function ContactCreateDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<ContactForm>({
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
                toast.success('Contacto creado exitosamente');
                reset();
                setOpen(false);
            },
            onError: () => {
                toast.error('Error al crear el contacto. Verifica los datos.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20 transition-all active:scale-95">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Contacto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] border-border bg-background shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-brand" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-foreground">Registrar Nuevo Contacto</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-base">
                        Ingresa los detalles para iniciar el seguimiento del lead.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="nombrecompleto" className="text-foreground font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-brand" />
                                Nombre Completo
                            </Label>
                            <Input
                                id="nombrecompleto"
                                value={data.nombrecompleto}
                                onChange={(e) => setData('nombrecompleto', e.target.value)}
                                placeholder="Ej. Juan Pérez"
                                className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                                required
                            />
                            {errors.nombrecompleto && <span className="text-xs text-destructive font-medium">{errors.nombrecompleto}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="correoelectronico" className="text-foreground font-semibold flex items-center gap-2">
                                <Mail className="h-4 w-4 text-brand" />
                                Correo Electrónico
                            </Label>
                            <Input
                                id="correoelectronico"
                                type="email"
                                value={data.correoelectronico}
                                onChange={(e) => setData('correoelectronico', e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                                required
                            />
                            {errors.correoelectronico && <span className="text-xs text-destructive font-medium">{errors.correoelectronico}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="empresa" className="text-foreground font-semibold flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-brand" />
                                Empresa
                            </Label>
                            <Input
                                id="empresa"
                                value={data.empresa}
                                onChange={(e) => setData('empresa', e.target.value)}
                                placeholder="Nombre de la empresa"
                                className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                                required
                            />
                            {errors.empresa && <span className="text-xs text-destructive font-medium">{errors.empresa}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="celular" className="text-foreground font-semibold flex items-center gap-2">
                                <Phone className="h-4 w-4 text-brand" />
                                Celular
                            </Label>
                            <Input
                                id="celular"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                placeholder="Ej. 70000000"
                                className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                                required
                            />
                            {errors.celular && <span className="text-xs text-destructive font-medium">{errors.celular}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="presupuesto" className="text-foreground font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-brand" />
                            Presupuesto Estimado (Bs.)
                        </Label>
                        <Input
                            id="presupuesto"
                            type="number"
                            value={data.presupuesto}
                            onChange={(e) => setData('presupuesto', e.target.value)}
                            placeholder="0.00"
                            className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                            required
                        />
                        {errors.presupuesto && <span className="text-xs text-destructive font-medium">{errors.presupuesto}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-foreground font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-brand" />
                            Descripción / Requerimientos
                        </Label>
                        <Textarea
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Describe detalladamente los requerimientos del cliente..."
                            rows={3}
                            className="bg-muted/30 border-border focus:border-brand focus:ring-brand/20 transition-all min-h-[100px] text-foreground placeholder:text-muted-foreground/50"
                            required
                        />
                        {errors.descripcion && <span className="text-xs text-destructive font-medium">{errors.descripcion}</span>}
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="px-6 font-medium">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-brand hover:bg-brand/90 text-white px-8 font-bold shadow-lg shadow-brand/20">
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Contacto'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

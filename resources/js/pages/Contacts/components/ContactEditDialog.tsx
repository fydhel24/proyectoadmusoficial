import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useForm } from '@inertiajs/react';
import { Loader2, User, Mail, Building2, Phone, DollarSign, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { Contact } from '@/types/contact';

interface ContactEditDialogProps {
    contact: Contact | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ContactForm extends Record<string, any> {
    nombrecompleto: string;
    correoelectronico: string;
    presupuesto: string | number;
    celular: string;
    descripcion: string;
    empresa: string;
    estado: boolean;
}

export function ContactEditDialog({ contact, open, onOpenChange }: ContactEditDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm<ContactForm>({
        nombrecompleto: '',
        correoelectronico: '',
        presupuesto: '',
        celular: '',
        descripcion: '',
        empresa: '',
        estado: false,
    });

    useEffect(() => {
        if (contact) {
            setData({
                nombrecompleto: contact.nombrecompleto,
                correoelectronico: contact.correoelectronico,
                presupuesto: contact.presupuesto.replace(/[^\d.,]/g, '').replace(',', '.'),
                celular: contact.celular,
                descripcion: contact.descripcion,
                empresa: contact.empresa,
                estado: contact.estado,
            });
        }
    }, [contact]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contact) return;

        put(route('contacts.update', contact.id), {
            onSuccess: () => {
                toast.success('Contacto actualizado exitosamente');
                onOpenChange(false);
            },
            onError: () => {
                toast.error('Error al actualizar el contacto. Verifica los datos.');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] border-border bg-background shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-brand" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-foreground">Editar Contacto</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-base">
                        Modifica los detalles del lead y actualiza su estado.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="edit-nombrecompleto" className="text-foreground font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-brand" />
                                Nombre Completo
                            </Label>
                            <Input
                                id="edit-nombrecompleto"
                                value={data.nombrecompleto}
                                onChange={(e) => setData('nombrecompleto', e.target.value)}
                                className="bg-muted/30 border-border focus:border-brand transition-all text-foreground"
                                required
                            />
                            {errors.nombrecompleto && <span className="text-xs text-destructive">{errors.nombrecompleto}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-correoelectronico" className="text-foreground font-semibold flex items-center gap-2">
                                <Mail className="h-4 w-4 text-brand" />
                                Correo Electrónico
                            </Label>
                            <Input
                                id="edit-correoelectronico"
                                type="email"
                                value={data.correoelectronico}
                                onChange={(e) => setData('correoelectronico', e.target.value)}
                                className="bg-muted/30 border-border focus:border-brand transition-all text-foreground"
                                required
                            />
                            {errors.correoelectronico && <span className="text-xs text-destructive">{errors.correoelectronico}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="edit-empresa" className="text-foreground font-semibold flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-brand" />
                                Empresa
                            </Label>
                            <Input
                                id="edit-empresa"
                                value={data.empresa}
                                onChange={(e) => setData('empresa', e.target.value)}
                                className="bg-muted/30 border-border focus:border-brand transition-all text-foreground"
                                required
                            />
                            {errors.empresa && <span className="text-xs text-destructive">{errors.empresa}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-celular" className="text-foreground font-semibold flex items-center gap-2">
                                <Phone className="h-4 w-4 text-brand" />
                                Celular
                            </Label>
                            <Input
                                id="edit-celular"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                className="bg-muted/30 border-border focus:border-brand transition-all text-foreground"
                                required
                            />
                            {errors.celular && <span className="text-xs text-destructive">{errors.celular}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="edit-presupuesto" className="text-foreground font-semibold flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-brand" />
                                Presupuesto (Bs.)
                            </Label>
                            <Input
                                id="edit-presupuesto"
                                type="number"
                                value={data.presupuesto}
                                onChange={(e) => setData('presupuesto', e.target.value)}
                                className="bg-muted/30 border-border focus:border-brand transition-all text-foreground"
                                required
                            />
                            {errors.presupuesto && <span className="text-xs text-destructive">{errors.presupuesto}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-foreground font-semibold flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-brand" />
                                Estado del Lead
                            </Label>
                            <div className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg border border-border/50">
                                <Switch
                                    checked={data.estado}
                                    onCheckedChange={(checked) => setData('estado', checked)}
                                    className="data-[state=checked]:bg-green-500"
                                />
                                <Badge
                                    variant={data.estado ? "outline" : "secondary"}
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                                        data.estado ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                                    )}
                                >
                                    {data.estado ? (
                                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> REVISADO</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> PENDIENTE</span>
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-descripcion" className="text-foreground font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-brand" />
                            Descripción / Requerimientos
                        </Label>
                        <Textarea
                            id="edit-descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            rows={3}
                            className="bg-muted/30 border-border focus:border-brand transition-all text-foreground min-h-[100px]"
                            required
                        />
                        {errors.descripcion && <span className="text-xs text-destructive">{errors.descripcion}</span>}
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-brand hover:bg-brand/90 text-white px-8 font-bold shadow-lg shadow-brand/20">
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

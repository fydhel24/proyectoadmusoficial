import React, { useState } from 'react';
import axios from 'axios';
import { startAuthentication } from '@simplewebauthn/browser';
import { router } from '@inertiajs/react';
import {
    Clock, MapPin, Building2, Trash2, AlertTriangle, Fingerprint, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MainPanelProps {
    asistencias: any[];
    empresas: { id: number; name: string }[];
}

export function MainPanel({ asistencias, empresas }: MainPanelProps) {
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState<string>('');

    const handleRevoke = async () => {
        try {
            await axios.delete('/asistencia/dispositivo');
            toast.success("Dispositivo borrado. Ahora debes registrarte otra vez.", { id: 'webauthn-revoke' });
            router.reload();
        } catch (e) {
            toast.error("Error al borrar el dispositivo.", { id: 'webauthn-revoke' });
        }
    };

    const handleMarkAttendance = async () => {
        setLoading(true);
        toast.loading("Obteniendo tu ubicación GPS...", { id: 'attendance' });

        if (!navigator.geolocation) {
            toast.error("Tu navegador no soporta geolocalización.", { id: 'attendance' });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            toast.loading("Esperando tu huella/FaceID...", { id: 'attendance' });

            try {
                // 1. Pedir opciones de aserción (login options de WebAuthn)
                const optionsResp = await axios.post('/webauthn/login/options');

                // 2. Ejecutar la aserción biométrica del dispositivo
                const asseResp = await startAuthentication(optionsResp.data);

                // 3. Enviar al Endpoint de Asistencia con los datos GPS + ID Empresa + Firma
                const payload = {
                    ...asseResp,
                    latitud: latitude,
                    longitud: longitude,
                    company_id: companyId || null,
                };

                await axios.post('/asistencia', payload);

                toast.success("Asistencia marcada correctamente.", { id: 'attendance' });
                setCompanyId('');
                router.reload();

            } catch (error: any) {
                console.error(error);
                if (error.name === 'NotAllowedError') {
                    toast.error("Cancelaste la verificación biométrica.", { id: 'attendance' });
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message, { id: 'attendance' });
                } else {
                    toast.error("Falló la verificación. Intenta nuevamente.", { id: 'attendance' });
                }
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("GPS Error", error);
            if (error.code === error.PERMISSION_DENIED) {
                toast.error("Debes permitir el acceso a tu ubicación para marcar asistencia.", { id: 'attendance' });
            } else {
                toast.error("No se pudo obtener tu ubicación. Revisa tu señal GPS.", { id: 'attendance' });
            }
            setLoading(false);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <Card className="shadow-lg border-l-4 border-l-primary/60">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Fingerprint className="text-primary" />
                                Marcar Asistencia
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Marca tu entrada o salida. Necesitaremos tu ubicación actual.
                            </p>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Perdí mi celular / Borrar Dispositivo
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="text-destructive" />
                                        ¿Estás seguro?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esto desenrolará tu dispositivo actual. Tendrás que volver a registrar tu huella o FaceID en tu próximo celular para poder marcar asistencia.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRevoke} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Sí, Borrar Dispositivo
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-muted/30 rounded-lg border">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-2">
                                <Building2 className="w-3 h-3" />
                                Empresa (Opcional)
                            </label>
                            <Select value={companyId} onValueChange={setCompanyId} disabled={loading}>
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Selecciona si es para una empresa en específico" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none" className="text-muted-foreground italic">Ninguna (oficina general)</SelectItem>
                                    {empresas.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleMarkAttendance}
                            disabled={loading}
                            size="lg"
                            className="w-full md:w-auto mt-4 md:mt-2 h-12 shadow-md relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Escanear Huella
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/80">
                    <Clock className="w-5 h-5" />
                    Historial Reciente
                </h3>
                {asistencias.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/10">
                        No hay registros de asistencia recientes.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted uppercase text-xs font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 border-b">Fecha y Hora</th>
                                    <th className="px-4 py-3 border-b">Empresa</th>
                                    <th className="px-4 py-3 border-b">Ubicación (Coordenadas)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asistencias.map((item, index) => (
                                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                                            {new Date(item.fecha_marcacion).toLocaleString('es-ES', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.company ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                                    <Building2 className="w-3 h-3" />
                                                    {item.company.name}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Oficina general</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                            {item.latitud}, {item.longitud}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

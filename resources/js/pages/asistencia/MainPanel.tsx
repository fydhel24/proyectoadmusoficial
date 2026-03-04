import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { startAuthentication } from '@simplewebauthn/browser';
import { router } from '@inertiajs/react';
import {
    Clock, MapPin, Building2, AlertTriangle, Fingerprint, Loader2, CheckCircle2, Lock
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
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Asistencia {
    id?: number;
    fecha_marcacion: string;
    company?: { id: number; name: string };
}

interface MainPanelProps {
    asistencias: Asistencia[];
    empresas: { id: number; name: string }[];
}

export function MainPanel({ asistencias, empresas }: MainPanelProps) {
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState<string>('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    // Efecto para sincronizar companyId con las empresas disponibles
    // Solo re-ejecutar cuando empresas cambia, no cuando companyId cambia (evita infinite loop)
    // Advertencia de eslint ignorada: companyId NO debe estar en dependencias para evitar re-renders infinitos
    useEffect(() => {
        // Si companyId no está vacío y la empresa seleccionada no existe en la lista, reiniciar
        if (companyId && companyId !== 'none' && !empresas.find(e => String(e.id) === companyId)) {
            setCompanyId('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empresas]);

    const handleMarkAttendance = async () => {
        // VALIDACIÓN: Siempre debe seleccionar una empresa real (no vacío)
        if (!companyId || companyId === '' || companyId === 'none') {
            toast.warning("Por favor, selecciona una empresa para marcar asistencia.", {
                id: 'attendance-warning',
                icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
                duration: 5000
            });
            return;
        }

        setLoading(true);
        toast.loading("Obteniendo tu ubicación GPS...", { id: 'attendance' });

        if (!navigator.geolocation) {
            toast.error("Tu navegador no soporta geolocalización.", { id: 'attendance' });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Validar coordenadas válidas
            if (!latitude || !longitude) {
                toast.error("No se pudo obtener una ubicación válida. Intenta nuevamente.", { id: 'attendance' });
                setLoading(false);
                return;
            }

            toast.loading("Esperando tu huella/FaceID...", { id: 'attendance' });

            try {
                // 1. Pedir opciones de aserción (login options de WebAuthn)
                const optionsResp = await axios.post('/webauthn/login/options');

                // Forzar biometría y no usar PIN/Contraseña como respaldo
                const authOptions = optionsResp.data;
                authOptions.userVerification = 'required';

                // 2. Ejecutar la aserción biométrica del dispositivo
                const asseResp = await startAuthentication(authOptions);

                // 3. Enviar al Endpoint de Asistencia con los datos GPS + ID Empresa + Firma
                // Convertir companyId a número (es obligatorio)
                let normalizedCompanyId = null;
                if (companyId && companyId !== 'none' && companyId !== '') {
                    const parsed = parseInt(companyId, 10);
                    // Validar que la conversión fue exitosa
                    if (!isNaN(parsed)) {
                        normalizedCompanyId = parsed;
                    } else {
                        toast.error("Error en la selección de empresa. Intenta nuevamente.", { id: 'attendance' });
                        setLoading(false);
                        return;
                    }
                } else {
                    // Si no hay companyId válido, es error (no debería llegar aquí por validación anterior)
                    toast.error("Debes seleccionar una empresa válida.", { id: 'attendance' });
                    setLoading(false);
                    return;
                }

                const payload = {
                    ...asseResp,
                    latitud: latitude,
                    longitud: longitude,
                    company_id: normalizedCompanyId,
                };

                const response = await axios.post('/asistencia', payload);

                // Validar que la respuesta sea exitosa
                if (!response.data || response.status !== 200) {
                    throw new Error('Respuesta inválida del servidor');
                }

                // Mostrar Modal de Éxito en lugar de solo el toast
                toast.dismiss('attendance');
                setSuccessModalOpen(true);
                setCompanyId('');

            } catch (error: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const err = error as any;
                console.error('Attendance error:', error);

                let errorMessage = "Falló la verificación. Intenta nuevamente.";

                if (err?.name === 'NotAllowedError') {
                    errorMessage = "Cancelaste la verificación biométrica.";
                } else if (err?.response?.status === 401) {
                    errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
                } else if (err?.response?.status === 400) {
                    errorMessage = err?.response?.data?.message || "Datos inválidos enviados.";
                } else if (err?.response?.status === 500) {
                    errorMessage = "Error en el servidor. Intenta más tarde.";
                } else if (err?.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err?.message === 'Network Error') {
                    errorMessage = "Error de conexión. Verifica tu internet.";
                }

                toast.error(errorMessage, { id: 'attendance', duration: 5000 });
            } finally {
                setLoading(false);
            }
        }, (gpsError: GeolocationPositionError) => {
            console.error("GPS Error", gpsError);
            let gpsMessage = "No se pudo obtener tu ubicación. Revisa tu señal GPS.";

            if (gpsError.code === gpsError.PERMISSION_DENIED) {
                gpsMessage = "Debes permitir el acceso a tu ubicación para marcar asistencia.";
            } else if (gpsError.code === gpsError.POSITION_UNAVAILABLE) {
                gpsMessage = "Servicio de ubicación no disponible. Activa el GPS en tu dispositivo.";
            } else if (gpsError.code === gpsError.TIMEOUT) {
                gpsMessage = "Tiempo agotado al obtener ubicación. Intenta nuevamente en un lugar abierto.";
            }

            toast.error(gpsMessage, { id: 'attendance', duration: 5000 });
            setLoading(false);
        }, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        });
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
        // Recargar para actualizar el historial de asistencias
        setTimeout(() => {
            router.reload();
        }, 300);
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
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-muted/30 rounded-lg border">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-2">
                                <Building2 className="w-3 h-3" />
                                Empresa (Obligatorio)
                            </label>
                            <Select
                                value={companyId || ''}
                                onValueChange={(value) => {
                                    // Asegurar que el valor es un string válido
                                    setCompanyId(value === '' ? '' : value);
                                }}
                                disabled={loading}
                            >
                                <SelectTrigger className={`w-full bg-background ${
                                    !companyId ? 'border-red-500/50 focus:ring-red-500/20' : ''
                                }`}>
                                    <SelectValue placeholder="Selecciona la empresa..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {empresas && Array.isArray(empresas) && empresas.length > 0 && empresas.map(emp => {
                                        // Validar que emp tenga id y name
                                        if (!emp || !emp.id || !emp.name) return null;
                                        const empId = String(emp.id);
                                        return (
                                            <SelectItem key={`emp-${emp.id}`} value={empId}>
                                                {emp.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleMarkAttendance}
                            disabled={loading || !companyId}
                            size="lg"
                            className="w-full md:w-auto mt-4 md:mt-2 h-12 shadow-md relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                            title={!companyId ? "Selecciona una empresa para marcar asistencia" : "Marcar asistencia"}
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Procesando...
                                </>
                            ) : !companyId ? (
                                <>
                                    <Lock className="w-5 h-5 mr-2" />
                                    Selecciona Empresa
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5 mr-2" />
                                   Marcar Asistencia
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
                {!asistencias || asistencias.length === 0 ? (
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

                                </tr>
                            </thead>
                            <tbody>
                                {asistencias && asistencias.length > 0 && asistencias.map((item, index) => (
                                    <tr key={item.id || `asistencia-${index}`} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                                            {item.fecha_marcacion ? (
                                                new Date(item.fecha_marcacion).toLocaleString('es-ES', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })
                                            ) : (
                                                <span className="text-muted-foreground text-xs">Fecha inválida</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.company && item.company.name ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                                    <Building2 className="w-3 h-3" />
                                                    {item.company.name}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">Oficina general</span>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL DE ÉXITO VISUAL */}
            <AlertDialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
                <AlertDialogContent className="max-w-md text-center">
                    <AlertDialogHeader className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold text-center">¡Asistencia Registrada!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base mt-2">
                            Gracias por marcar tu asistencia de hoy. Tu registro biométrico y ubicación han sido guardados exitosamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center mt-6">
                        <Button
                            className="w-full sm:w-auto min-w-[150px] bg-green-600 hover:bg-green-700"
                            onClick={closeSuccessModal}
                        >
                            De acuerdo, continuar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

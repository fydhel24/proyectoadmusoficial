import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { startAuthentication } from '@simplewebauthn/browser';
import { router } from '@inertiajs/react';
import {
    Clock, MapPin, Building2, AlertTriangle, Fingerprint, Loader2, CheckCircle2, Lock, X, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
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
    const [companyId, setCompanyId] = useState<string>(() => {
        // Recuperar del sessionStorage si existe
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('selectedCompanyId') || '';
        }
        return '';
    });
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [mobileModalOpen, setMobileModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(true); // Default true para Xiaomi
    const [isDeviceReady, setIsDeviceReady] = useState(false);

    // Detectar si es mobile - Mejorado con viewport y userAgent incluyendo Xiaomi
    useEffect(() => {
        const detectMobile = () => {
            const ua = navigator.userAgent || '';

            // Patrones más específicos incluyendo navegadores de Xiaomi
            const mobilePatterns = [
                /Android/i,
                /webOS/i,
                /iPhone/i,
                /iPad/i,
                /iPod/i,
                /BlackBerry/i,
                /IEMobile/i,
                /Opera Mini/i,
                /MIUI/i, // Xiaomi específicamente
                /XiaoMi/i, // Xiaomi variante
                /MI[\s_]?[A-Z0-9]+/i, // Xiaomi Mi Series
                /Redmi/i // Xiaomi Redmi
            ];

            const isMobileUserAgent = mobilePatterns.some(pattern => pattern.test(ua));
            const isSmallViewport = typeof window !== 'undefined' && window.innerWidth <= 768;
            const hasTouchSupport = typeof window !== 'undefined' && (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                // @ts-expect-error - IE/Edge compatible check
                (window.navigator && 'msMaxTouchPoints' in window.navigator && (window.navigator as { msMaxTouchPoints?: number }).msMaxTouchPoints > 0)
            );

            // Detectar mobile: userAgent + viewport + touch
            const isMobileDevice = isMobileUserAgent || isSmallViewport || hasTouchSupport;

            setIsMobile(isMobileDevice);
            setIsDeviceReady(true);
        };

        detectMobile();

        // Detectar cambios de tamaño de ventana (responsive)
        const handleResize = () => detectMobile();
        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('orientationchange', detectMobile, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', detectMobile);
        };
    }, []);

    const handleCompanySelect = (id: string) => {
        // Validar que el ID sea válido
        if (!id || id === '') {
            toast.warning("Selecciona una empresa válida.", {
                id: 'company-select',
                duration: 2000
            });
            return;
        }

        // Guardar en sessionStorage para persistencia
        try {
            sessionStorage.setItem('selectedCompanyId', id);
        } catch (e) {
            console.warn('No se pudo guardar en sessionStorage:', e);
        }

        setCompanyId(id);

        // Cerrar modal mobile con delay para permitir visual feedback
        setTimeout(() => {
            setMobileModalOpen(false);
        }, 100);
    };

    const handleMarkAttendance = async () => {
        // VALIDACIÓN: Siempre debe seleccionar una empresa real (no vacío)
        if (!companyId || companyId === '' || companyId === 'none') {
            toast.warning("Por favor, selecciona una empresa para marcar asistencia.", {
                id: 'attendance-warning',
                icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
                duration: 3000
            });
            return;
        }

        setLoading(true);
        toast.loading("Obteniendo tu ubicación GPS...", { id: 'attendance' });

        if (!navigator.geolocation) {
            toast.error("Tu navegador no soporta geolocalización.", { id: 'attendance', duration: 3000 });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Validar coordenadas válidas
            if (!latitude || !longitude) {
                toast.dismiss('attendance');
                toast.error("No se pudo obtener una ubicación válida. Intenta nuevamente.", { id: 'attendance', duration: 3000 });
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
                    toast.dismiss('attendance');
                    toast.error("Debes seleccionar una empresa válida.", { id: 'attendance', duration: 3000 });
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
                setNeedsRefresh(true);

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

                toast.error(errorMessage, { id: 'attendance', duration: 4000 });
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

            toast.error(gpsMessage, { id: 'attendance', duration: 3000 });
            setLoading(false);
        }, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        });
    };

    const closeSuccessModal = () => {
        // Reset de estado
        setSuccessModalOpen(false);
        setMobileModalOpen(false);
        setNeedsRefresh(false);
        setCompanyId('');

        // Limpiar sessionStorage
        try {
            sessionStorage.removeItem('selectedCompanyId');
        } catch (e) {
            console.warn('No se pudo limpiar sessionStorage:', e);
        }

        // Pequeño delay para permitir que los estados se actualicen antes de recargar
        setTimeout(() => {
            router.visit('/asistencia', {
                method: 'get',
                preserveScroll: true
            });
        }, 100);
    };

    // Fallback while device is being detected (especialmente para Xiaomi)
    if (!isDeviceReady) {
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
                                    Inicializando módulo...
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center h-20">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end p-4 bg-muted/30 rounded-lg border">
                        <div className="flex-1 w-full">
                            <label htmlFor="company-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-2">
                                <Building2 className="w-3 h-3" />
                                Empresa (Obligatorio)
                            </label>
                            {isMobile ? (
                                // MÓVIL: Botón personalizado que abre modal
                                <button
                                    type="button"
                                    onClick={() => setMobileModalOpen(true)}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 rounded-lg border-2 text-left bg-background font-medium flex items-center justify-between transition-all duration-200 ${
                                        companyId
                                            ? 'border-primary text-foreground bg-primary/5'
                                            : 'border-red-400/50 text-muted-foreground hover:border-red-400'
                                    } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                >
                                    <span>
                                        {companyId && empresas && empresas.length > 0
                                            ? empresas.find(e => String(e.id) === companyId)?.name || 'Selecciona empresa...'
                                            : 'Selecciona empresa...'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transform transition-transform ${mobileModalOpen ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                // DESKTOP: Select shadcn mejorado
                                <Select
                                    value={companyId}
                                    onValueChange={handleCompanySelect}
                                    disabled={loading}
                                >
                                    <SelectTrigger
                                        id="company-select"
                                        className={`w-full bg-background border-2 font-medium transition-all duration-200 ${
                                            companyId
                                                ? 'border-primary text-foreground'
                                                : 'border-red-400/50 text-muted-foreground'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {companyId && empresas && empresas.length > 0 ? (
                                            <span className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary" />
                                                <span>{empresas.find(e => String(e.id) === companyId)?.name}</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span>Selecciona la empresa...</span>
                                            </span>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent className="min-w-[300px]">
                                        {empresas && Array.isArray(empresas) && empresas.length > 0 ? (
                                            empresas.map(emp => {
                                                if (!emp || !emp.id || !emp.name) return null;
                                                return (
                                                    <SelectItem
                                                        key={`emp-${emp.id}`}
                                                        value={String(emp.id)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-4 h-4" />
                                                            <span>{emp.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })
                                        ) : (
                                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                No hay empresas disponibles
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <Button
                            onClick={handleMarkAttendance}
                            disabled={loading || !companyId}
                            size="lg"
                            className="w-full md:w-auto h-12 shadow-md relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
            <AlertDialog
                open={successModalOpen}
                onOpenChange={(open) => {
                    if (!open && needsRefresh) {
                        closeSuccessModal();
                    } else if (!open) {
                        setSuccessModalOpen(false);
                    }
                }}
            >
                <AlertDialogContent className="max-w-md text-center rounded-2xl border-0 shadow-2xl animate-in fade-in scale-in-95 duration-200">
                    <AlertDialogHeader className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold text-center text-green-600">
                            ¡Asistencia Registrada!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base text-foreground/80 leading-relaxed">
                            Gracias por marcar tu asistencia de hoy. Tu registro biométrico y ubicación han sido guardados exitosamente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center mt-6 flex-col gap-2 w-full">
                        <Button
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-95"
                            onClick={closeSuccessModal}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cargando...
                                </>
                            ) : (
                                'De acuerdo, continuar'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal Mobile para seleccionar empresa - Completamente mejorado */}
            {mobileModalOpen && isMobile && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center"
                    onClick={() => setMobileModalOpen(false)}
                >
                    {/* Overlay semi-transparente */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal */}
                    <div
                        className="relative w-full max-h-[85vh] bg-background rounded-t-3xl p-6 flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Selecciona empresa</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {empresas?.length || 0} opciones disponibles
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileModalOpen(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Lista de empresas */}
                        <div className="flex-1 overflow-y-auto mb-4 pb-2">
                            <div className="space-y-2">
                                {empresas && Array.isArray(empresas) && empresas.length > 0 ? (
                                    empresas.map(emp => {
                                        if (!emp || !emp.id || !emp.name) return null;
                                        const isSelected = String(emp.id) === companyId;
                                        return (
                                            <button
                                                key={`emp-modal-${emp.id}`}
                                                type="button"
                                                onClick={() => handleCompanySelect(String(emp.id))}
                                                className={`w-full px-4 py-4 rounded-2xl text-left transition-all duration-200 font-semibold flex items-center gap-3 active:scale-95 ${
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                                        : 'bg-muted/50 text-foreground hover:bg-muted'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                    isSelected
                                                        ? 'bg-primary-foreground border-primary-foreground'
                                                        : 'border-muted-foreground'
                                                }`}>
                                                    {isSelected && (
                                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{emp.name}</p>
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12">
                                        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground font-medium">
                                            No hay empresas disponibles
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 pt-4 border-t border-border">
                            <Button
                                type="button"
                                onClick={() => setMobileModalOpen(false)}
                                disabled={!companyId}
                                className="flex-1 h-12 font-semibold"
                                variant={companyId ? "default" : "secondary"}
                            >
                                {companyId ? 'Confirmar selección' : 'Selecciona una empresa'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import axios from 'axios';
import { startRegistration } from '@simplewebauthn/browser';
import { router } from '@inertiajs/react';
import { Fingerprint, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

export function RegisterDevice() {
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        try {
            setLoading(true);
            toast.loading("Iniciando registro...", { id: 'webauthn-register' });

            // 1. Pedir las opciones de creación al Backend
            const optionsResp = await axios.post('/webauthn/register/options');

            // 2. Ejecutar la ventana biométrica del navegador
            const attResp = await startRegistration(optionsResp.data);

            // 3. Mandar la firma al backend para guardarla
            await axios.post('/webauthn/register', attResp);

            toast.success("Dispositivo registrado exitosamente", { id: 'webauthn-register' });

            // Recargar para que Index cambie a la vista MainPanel
            router.reload();
        } catch (error: any) {
            console.error(error);
            if (error.name === 'NotAllowedError') {
                toast.error("Cancelaste la operación o no diste permiso biométrico.", { id: 'webauthn-register' });
            } else {
                toast.error("Hubo un error al registrar el dispositivo. Intenta nuevamente.", { id: 'webauthn-register' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                        <Fingerprint className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Vincular Dispositivo</CardTitle>
                    <CardDescription>
                        Para poder registrar tu asistencia diaria (entrada y salida), debes vincular este celular o computadora usando tu huella o FaceID.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-foreground/80">
                    <p>Esto asegura que tu registro sea 100% personal e intransferible.</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        onClick={handleRegister}
                        size="lg"
                        disabled={loading}
                        className="w-full text-md h-12"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Registrando...
                            </>
                        ) : (
                            "Registrar Ahora"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

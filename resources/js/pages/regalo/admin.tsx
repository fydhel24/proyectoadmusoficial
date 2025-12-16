import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Zap, RotateCw, CheckCircle, XCircle, Users } from 'lucide-react';
import axios from 'axios'; 

export default function Admin({ initialStatus }) { 
    const [status, setStatus] = useState(initialStatus || { is_sorted: false, total_users: 0, participating_count: 0 });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); 

    // Obtener el estado actual del Intercambio (GET a la pura)
    const fetchStatus = async () => {
        try {
            // URL corregida a /admin/status
            const response = await axios.get('/admin/status'); 
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching status:', error);
            setMessage({ type: 'error', text: 'No se pudo obtener el estado del intercambio. (Verifica autenticación)' });
        }
    };

    // Inicializar la lista de participantes en caché  POST pura con Axios)
    const handleInitialize = async () => {
        setLoading(true);
        setMessage(null);
        
        try {
            // URL corregida a /admin/init
            const response = await axios.post('/admin/init'); 
            
            setMessage({ type: 'success', text: response.data.message || '¡Lista de usuarios inicializada en caché con éxito!' });
            fetchStatus(); 
            
        } catch (error) {
            console.error("Errores:", error.response);
            const msg = error.response?.data?.message || 'Error al inicializar la lista. Revisa la consola.';
            setMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
        }
    };

    // Realizar el Sorteo  POST pura con Axios)
    const handleDraw = async () => {
        if (status.is_sorted) return;

        setLoading(true);
        setMessage(null);

        try {
            // URL corregida a /admin/draw
            const response = await axios.post('/admin/draw'); 
            
            setMessage({ type: 'success', text: response.data.message || '¡Sorteo completado con éxito! Los resultados están en caché.' });
            fetchStatus(); 
            
        } catch (error) {
            console.error("Errores:", error.response);
            const msg = error.response?.data?.message || 'El sorteo falló. Verifica si hay suficientes participantes (>1).';
            setMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!initialStatus || status.total_users === 0) {
            fetchStatus();
        }
    }, []);

    const isInitialized = status.total_users > 0;
    const canDraw = isInitialized && status.participating_count >= 2;

    return (
        <AppLayout breadcrumbs={[{ title: 'Intercambio de Regalos', href: route('regalo.admin.index') }]}>
            <div className="space-y-6 p-6">
                <h1 className="text-3xl font-bold">Panel de Administración de Intercambio de Regalos</h1>

                {/* Mensajes de Alerta */}
                {message && (
                    <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                        <AlertTitle>
                            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            {' '} {message.type === 'success' ? 'Éxito' : 'Error'}
                        </AlertTitle>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}

                {/* Estado del Sorteo y Acciones... (JSX omitido por brevedad, es el mismo que el anterior) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <span>Estado Actual</span>
                        </CardTitle>
                        <CardDescription>
                            Aquí puedes ver el progreso del registro de participación y el estado del sorteo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-sm font-medium">Estado del Sorteo:</span>
                            <Badge variant={status.is_sorted ? 'default' : 'secondary'}>
                                {status.is_sorted ? '¡SORTEADO!' : 'Pendiente'}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Usuarios Registrados:</span>
                            <Badge variant="outline">{status.total_users}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Participantes Confirmados:</span>
                            <Badge variant="secondary">{status.participating_count}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>1. Inicializar Participantes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-4">
                                Carga todos los usuarios del sistema al caché para iniciar el proceso.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleInitialize} 
                                disabled={loading || status.is_sorted}
                                className="w-full"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isInitialized ? 'Actualizar Lista' : 'Inicializar Intercambio'}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <RotateCw className="h-5 w-5" />
                                <span>2. Realizar Sorteo</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-4">
                                Asigna aleatoriamente los regalos entre los participantes confirmados.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleDraw} 
                                disabled={loading || status.is_sorted || !canDraw} 
                                className="w-full"
                                variant={status.is_sorted ? 'outline' : 'default'}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {status.is_sorted ? 'Sorteo Ya Realizado' : (canDraw ? 'Realizar Sorteo Ahora' : 'Faltan Participantes')}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Gift, CheckCircle, RotateCw, Heart, User } from 'lucide-react';

// Importamos usePage para leer el flash data después de la redirección
import { useForm, router, usePage } from '@inertiajs/react';
import axios from 'axios'; 

export default function Participant({ initialAssignment, initialIsSorted, initialParticipationStatus }) { 
    
    // Obtener las props de Inertia, incluyendo flash data
    const { props } = usePage();
    const flashSuccess = props.flash?.success; // Captura el mensaje de éxito de la redirección

    // Estado local basado en las props iniciales
    const [assignment, setAssignment] = useState(initialAssignment);
    const [isSorted, setIsSorted] = useState(initialIsSorted);
    const [hasParticipated, setHasParticipated] = useState(initialParticipationStatus);
    const [loadingStatus, setLoadingStatus] = useState(false);

    // 1. Manejo del Formulario de Participación
    const { data, setData, post, processing, errors } = useForm({
        descripcion: assignment?.receiver_description || '', 
    });
    
    // --- Funciones de Comunicación ---

    // Función para obtener el estado del sorteo y la asignación del usuario (GET)
    const fetchAssignmentStatus = async () => {
        setLoadingStatus(true);
        try {
            // URL corregida a /exchange/status (Ruta web AJAX)
            const response = await axios.get('/exchange/status'); 
            const data = response.data;
            
            setIsSorted(data.is_sorted);
            setHasParticipated(data.has_participated);
            
            if (data.is_sorted && data.your_assignment) {
                setAssignment(data.your_assignment);
            }
        } catch (error) {
            console.error('Error fetching user status:', error.response || error);
        } finally {
            setLoadingStatus(false);
        }
    };

    // Manejador para el envío del formulario de participación (POST Inertia)
    const submitParticipation = (e) => {
        e.preventDefault();
        
        // Inertia POST espera una redirección del servidor, lo cual ya hace el controlador.
        // Usamos 'exchange.participate' (el nombre de la ruta web).
        post(route('exchange.participate'), { 
            onSuccess: () => {
                // Después de la redirección exitosa, Inertia recarga el componente.
                // El estado 'hasParticipated' y el mensaje de éxito vendrán en las nuevas props.
                // Como el controlador ahora redirige, no necesitamos hacer nada aquí.
            },
            onError: (err) => {
                console.error('Error de validación/server:', err);
            },
        });
    };
    
    // Si la asignación no se cargó inicialmente, la cargamos al inicio
    useEffect(() => {
        // En Inertia, si la vista se cargó correctamente, no siempre es necesario hacer un fetch inicial,
        // pero lo mantenemos como respaldo si las props iniciales son nulas.
        if (!initialAssignment && !initialParticipationStatus) {
            fetchAssignmentStatus();
        }
    }, []);

    // --- Renderizado Condicional ---

    const renderAssignment = () => (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <Gift className="h-4 w-4" />
            <AlertTitle className="font-bold text-green-700">🎉 ¡Te toca regalar a...</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold">{assignment.receiver_name}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                    <p className="font-medium">Sugerencia de Regalo/Deseos:</p>
                    <p className="text-sm italic text-gray-600">
                        "{assignment.receiver_description || 'El participante no ha especificado sus deseos.'}"
                    </p>
                </div>
            </AlertDescription>
        </Alert>
    );

    const renderParticipationForm = () => (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>¡Regístrate para Participar!</span>
                </CardTitle>
                <CardDescription>
                    Escribe qué regalos te gustaría recibir o qué cosas te gustan para guiar a tu amigo secreto.
                </CardDescription>
            </CardHeader>
            <form onSubmit={submitParticipation}>
                <CardContent className="space-y-4">
                    
                    {/* Muestra el mensaje flash después de la redirección exitosa */}
                    {flashSuccess && (
                        <Alert variant="default">
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>¡Gracias!</AlertTitle>
                            <AlertDescription>{flashSuccess}</AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="descripcion">Mis Deseos / Sugerencias (Max 255 caracteres)</Label>
                        <Textarea
                            id="descripcion"
                            placeholder="Ej: Me gustaría un libro de ciencia ficción o un buen café."
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            disabled={processing}
                        />
                         {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
                    </div>
                </CardContent>
                <div className="p-6 pt-0">
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {processing ? 'Enviando...' : 'Confirmar Participación'}
                    </Button>
                </div>
            </form>
        </Card>
    );

    // --- Lógica Principal del Renderizado ---

    let content;

    if (isSorted && assignment) {
        // 1. Sorteado y Asignación encontrada
        content = renderAssignment();
    } else if (isSorted && !assignment && hasParticipated) {
        // 2. Sorteado, participó, pero no se encontró la asignación (error en el sorteo)
        content = (
            <Alert variant="destructive">
                <RotateCw className="h-4 w-4" />
                <AlertTitle>Error en Asignación</AlertTitle>
                <AlertDescription>El sorteo ya se realizó, pero no se encontró tu asignación. Contacta al administrador.</AlertDescription>
            </Alert>
        );
    } else if (isSorted && !hasParticipated) {
         // 3. Sorteado, pero el usuario no participó
         content = (
            <Alert variant="destructive">
                <RotateCw className="h-4 w-4" />
                <AlertTitle>Sorteo Realizado</AlertTitle>
                <AlertDescription>El sorteo ya se realizó y no registraste tu participación a tiempo. No tienes asignación.</AlertDescription>
            </Alert>
        );
    } else if (hasParticipated) {
        // 4. Participación registrada, esperando sorteo
        content = (
            <Alert variant="secondary">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Participación Confirmada</AlertTitle>
                <AlertDescription>¡Ya estás registrado! El sorteo aún no se ha realizado. Vuelve pronto para ver a quién le regalarás.</AlertDescription>
            </Alert>
        );
    } else {
        // 5. Pendiente de registro
        content = renderParticipationForm();
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Mi Intercambio', href: route('regalo.participar') }]}>
            <div className="space-y-6 p-6">
                <h1 className="text-3xl font-bold">Mi Amigo Secreto</h1>
                
                {/* Botón para forzar la actualización del estado (necesario para ver el resultado después de que el Admin sortea) */}
                <Button 
                    onClick={fetchAssignmentStatus} 
                    disabled={loadingStatus} 
                    variant="outline"
                    className="float-right mb-4"
                >
                    {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                    Actualizar Estado
                </Button>

                {content}

            </div>
        </AppLayout>
    );
}
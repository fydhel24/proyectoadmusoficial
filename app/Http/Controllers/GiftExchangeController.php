<?php

namespace App\Http\Controllers;

use App\Services\GiftExchangeManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GiftExchangeController extends Controller
{
    protected $manager;

    public function __construct(GiftExchangeManager $manager)
    {
        $this->manager = $manager;
    }

    // --- 1. VISTAS INERTIA (WEB) ---

    /**
     * Muestra el panel de administración.
     */
    public function adminIndex()
    {
        $initialStatus = $this->manager->getStatusSummary();

        return Inertia::render('regalo/admin', [
            'initialStatus' => $initialStatus,
        ]);
    }

    /**
     * Muestra la vista para que el usuario pueda registrar su participación y ver su asignación.
     */
    public function participantView()
    {
        $userId = Auth::id();
        $isSorted = $this->manager->isSorted();

        $assignment = $isSorted ? $this->manager->getResultForUser($userId) : null;
        $hasParticipated = $this->manager->getParticipationStatus($userId);

        return Inertia::render('regalo/participant', [
            'initialIsSorted' => $isSorted,
            'initialAssignment' => $assignment,
            'initialParticipationStatus' => $hasParticipated
        ]);
    }


    // --- 2. MÉTODOS DE API (DEVUELVEN JSON) ---

    /**
     * Inicializa la lista de participantes en caché. (Admin Action)
     */
    public function initialize()
    {
        $this->manager->initializeParticipants();
        return response()->json(['message' => 'Lista de usuarios inicializada.'], 200);
    }

    /**
     * Registra la participación del usuario autenticado.
     */
    public function participate(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        $request->validate(['descripcion' => 'required|string|max:255']);

        $userId = Auth::id();
        $this->manager->registerParticipation($userId, $request->descripcion);

        // SOLUCIÓN: Redirigir de vuelta a la vista Inertia, no devolver JSON.
        return redirect()->route('regalo.participar')->with('success', '¡Tu participación ha sido registrada con éxito!');
    }

    /**
     * Realiza el sorteo. (Admin Action)
     */
    public function draw()
    {
        if ($this->manager->isSorted()) {
            return response()->json(['message' => 'El sorteo ya se ha realizado.'], 400);
        }

        if ($this->manager->runDraw()) {
            return response()->json(['message' => 'Sorteo completado con éxito!'], 200);
        }

        return response()->json(['message' => 'Error: Mínimo 2 participantes requeridos para el sorteo.'], 400);
    }

    /**
     * Obtiene el estado resumido para el panel de administración.
     */
    public function adminStatus()
    {
        return response()->json($this->manager->getStatusSummary());
    }

    /**
     * Obtiene el resultado del sorteo para el usuario autenticado.
     */
    public function status()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['is_sorted' => false, 'your_assignment' => null], 401);
        }

        $isSorted = $this->manager->isSorted();

        $response = [
            'is_sorted' => $isSorted,
            'has_participated' => $this->manager->getParticipationStatus($userId)
        ];

        if ($isSorted) {
            $response['your_assignment'] = $this->manager->getResultForUser($userId);
        }

        return response()->json($response);
    }
}

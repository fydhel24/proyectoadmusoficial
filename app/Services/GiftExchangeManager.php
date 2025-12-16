<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use App\Models\User; 

class GiftExchangeManager
{
    protected const PARTICIPATION_KEY = 'gift_exchange_participants';
    protected const RESULTS_KEY = 'gift_exchange_results';
    protected const SORTED_KEY = 'gift_exchange_is_sorted';
    protected $ttl;

    public function __construct()
    {
        $this->ttl = now()->addDays(30); 
    }

    protected function getParticipants(): Collection
    {
        return Cache::get(self::PARTICIPATION_KEY, collect());
    }
    
    protected function putParticipants(Collection $participants): void
    {
        Cache::put(self::PARTICIPATION_KEY, $participants, $this->ttl);
    }

    public function initializeParticipants(): void
    {
        if (Cache::has(self::PARTICIPATION_KEY)) {
            return;
        }

        $users = User::all(['id', 'name'])->map(function ($user) {
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'descripcion' => null,
                'participa' => false,
            ];
        });

        $this->putParticipants($users);
        Cache::put(self::SORTED_KEY, false, $this->ttl);
    }

    /**
     * Registra al usuario como participante y añade la descripción.
     */
    public function registerParticipation(int $userId, string $descripcion): bool
    {
        $participants = $this->getParticipants();
        
        $updated = $participants->map(function ($item) use ($userId, $descripcion) {
            if ($item['user_id'] === $userId) {
                $item['participa'] = true;
                $item['descripcion'] = $descripcion;
            }
            return $item;
        });

        $this->putParticipants($updated);
        return true;
    }

    /**
     * Realiza el sorteo.
     */
    public function runDraw(): bool
    {
        if ($this->isSorted()) { return false; }

        $participants = $this->getParticipants()
                             ->where('participa', true)
                             ->shuffle();

        if ($participants->count() < 2) { return false; }

        $list = $participants->pluck('user_id')->toArray();
        $total = count($list);
        $results = collect();

        for ($i = 0; $i < $total; $i++) {
            $giverId = $list[$i];
            $receiverIndex = ($i + 1) % $total; 
            $receiverId = $list[$receiverIndex];

            $results->push([
                'giver_id' => $giverId,
                'receiver_id' => $receiverId,
            ]);
        }
        
        Cache::put(self::RESULTS_KEY, $results, $this->ttl);
        Cache::put(self::SORTED_KEY, true, $this->ttl);
        
        return true;
    }
    
    public function isSorted(): bool
    {
        return Cache::get(self::SORTED_KEY, false);
    }

    public function getStatusSummary(): array
    {
        $participants = $this->getParticipants();
        
        $participatingCount = $participants->where('participa', true)->count();

        return [
            'is_sorted' => $this->isSorted(),
            'total_users' => $participants->count(),
            'participating_count' => $participatingCount,
        ];
    }
    
    /**
     * Obtiene el estado de participación del usuario (si ya se registró o no).
     */
    public function getParticipationStatus(int $authenticatedUserId): bool
    {
        $participant = $this->getParticipants()->firstWhere('user_id', $authenticatedUserId);
        return $participant['participa'] ?? false;
    }

    /**
     * Obtiene el resultado del sorteo para un usuario autentificado.
     */
    public function getResultForUser(int $authenticatedUserId): ?array
    {
        if (!$this->isSorted()) {
            return null;
        }

        $results = Cache::get(self::RESULTS_KEY, collect());
        $match = $results->firstWhere('giver_id', $authenticatedUserId);

        if (!$match) {
            return null; 
        }
        
        $participationList = $this->getParticipants();
        $receiverData = $participationList->firstWhere('user_id', $match['receiver_id']);
        $receiverName = User::find($match['receiver_id'], ['name'])->name ?? 'Desconocido';


        return [
            'giver_id' => $authenticatedUserId,
            'receiver_id' => $match['receiver_id'],
            'receiver_name' => $receiverName,
            'receiver_description' => $receiverData['descripcion'] ?? 'No disponible',
        ];
    }
    public function getCompleteCacheData(): array
    {
        $participants = $this->getParticipants();
        $results = Cache::get(self::RESULTS_KEY, collect());
        $isSorted = $this->isSorted();

        // Mapear los nombres de todos los usuarios (para una búsqueda rápida por ID)
        $userNames = User::all(['id', 'name'])->pluck('name', 'id');

        // Estructura de datos final: lista de participantes enriquecida
        $data = $participants->map(function ($participant) use ($results, $userNames, $isSorted) {
            
            $giverId = $participant['user_id'];
            $assignment = $results->firstWhere('giver_id', $giverId);
            
            $receiverName = null;
            $receiverId = null;

            if ($isSorted && $assignment) {
                $receiverId = $assignment['receiver_id'];
                // Obtener el nombre del receptor usando el array de nombres pre-cargado
                $receiverName = $userNames->get($receiverId, 'Usuario Eliminado');
            }

            return [
                'id' => $giverId,
                'name' => $participant['name'],
                'participa' => $participant['participa'],
                'deseos' => $participant['descripcion'] ?? 'No especificado',
                'asignacion' => [
                    'receptor_id' => $receiverId,
                    'receptor_name' => $receiverName,
                ],
            ];
        })->values()->toArray(); // values() asegura que las claves sean numéricas (0, 1, 2...)

        return [
            'is_sorted' => $isSorted,
            'participants_data' => $data,
            'total_participantes' => $participants->where('participa', true)->count(),
        ];
    }
}
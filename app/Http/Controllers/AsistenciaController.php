<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Asistencia;
use App\Models\Company;
use Laragear\WebAuthn\Http\Requests\AssertedRequest;

class AsistenciaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $hasDevice = $user->webAuthnCredentials()->exists();
        
        $asistencias = Asistencia::with('company')
            ->where('user_id', $user->id)
            ->orderBy('fecha_marcacion', 'desc')
            ->take(30)
            ->get();
            
        $empresas = Company::select('id', 'name')->get();

        return Inertia::render('asistencia/Index', [
            'hasDevice' => $hasDevice,
            'asistencias' => $asistencias,
            'empresas' => $empresas
        ]);
    }

    public function store(AssertedRequest $request)
    {
        // AssertedRequest de Laragear automáticamente valida la firma criptográfica (Passkey).
        // Si llega a esta línea, la biometría fue exitosa.
        
        $validated = $request->validate([
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        Asistencia::create([
            'user_id' => $request->user()->id,
            'company_id' => $validated['company_id'] ?? null,
            'latitud' => $validated['latitud'],
            'longitud' => $validated['longitud'],
            'fecha_marcacion' => now(),
        ]);

        return back()->with('success', 'Asistencia marcada correctamente.');
    }

    public function revoke(Request $request)
    {
        // Revitir dispositivo (borra las credenciales)
        $request->user()->webAuthnCredentials()->delete();
        return back()->with('success', 'Dispositivo reiniciado. Registra uno nuevo.');
    }
}

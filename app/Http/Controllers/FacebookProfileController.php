<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FacebookProfileController extends Controller
{
    /**
     * Muestra el perfil del usuario actual o uno específico.
     */
    public function show($id = null)
    {
        $userId = $id ?: Auth::id();
        $user = User::with(['photos' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->findOrFail($userId);

        // Transformar las URLs de las fotos
        $user->photos->each(function ($photo) {
            if (!filter_var($photo->path, FILTER_VALIDATE_URL)) {
                $photo->url = asset('storage/' . $photo->path);
            } else {
                $photo->url = $photo->path;
            }
        });

        // Agrupar fotos por tipo para facilitar el uso en el frontend
        $profilePhoto = $user->photos->where('tipo', 'perfil')->first();
        $coverPhoto = $user->photos->where('tipo', 'portada')->first();
        $feedPhotos = $user->photos->where('tipo', 'foto');

        return Inertia::render('Profile/FacebookStyle', [
            'profileUser' => $user,
            'profilePhoto' => $profilePhoto,
            'coverPhoto' => $coverPhoto,
            'feedPhotos' => $feedPhotos,
            'isOwnProfile' => Auth::id() == $userId,
        ]);
    }

    /**
     * Sube una nueva foto al perfil.
     */
    public function storePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:5120', // Máx 5MB
            'tipo' => 'required|in:foto,perfil,portada',
            'nombre' => 'nullable|string|max:255',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Si es perfil o portada, desactivar la anterior (o borrarla si prefieres)

        if (in_array($request->tipo, ['perfil', 'portada'])) {
            // Podríamos marcar las anteriores como 'foto' normal o dejarlas.
            // Para simplicidad en este ejemplo, las dejamos pero el controlador 'show' rescatará la última.
        }

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('user_photos', 'public');

            $photo = Photo::create([
                'path' => $path,
                'nombre' => $request->nombre,
                'tipo' => $request->tipo,
            ]);

            $user->photos()->attach($photo->id);
        }

        return back()->with('success', 'Foto subida correctamente.');
    }

    /**
     * Actualiza la información de una foto.
     */
    public function updatePhoto(Request $request, Photo $photo)
    {
        $request->validate([
            'nombre' => 'nullable|string|max:255',
            'tipo' => 'nullable|in:foto,perfil,portada',
        ]);

        $photo->update($request->only(['nombre', 'tipo']));

        return back()->with('success', 'Foto actualizada.');
    }

    /**
     * Elimina una foto.
     */
    public function deletePhoto(Photo $photo)
    {
        // Verificar que la foto sea del usuario (mediante el pivot)
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->photos()->where('photo_id', $photo->id)->exists()) {

            abort(403);
        }

        // Eliminar archivo física
        if (!filter_var($photo->path, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($photo->path);
        }

        // Eliminar registros
        $user->photos()->detach($photo->id);
        $photo->delete();

        return back()->with('success', 'Foto eliminada.');
    }
}

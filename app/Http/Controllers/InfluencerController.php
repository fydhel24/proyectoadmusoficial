<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InfluencerController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userPhotos = $user->photos()->get();

        $profileData = [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $userPhotos->count() > 0 ? $userPhotos->first()->url : 'https://randomuser.me/api/portraits/men/32.jpg'
            ],
            'datos' => [
                'biografia' => $user->biografia ?? 'Creador de contenido digital',
                'telefono' => $user->telefono ?? '',
                'ciudad' => $user->ciudad ?? '',
                'redesSociales' => [
                    'instagram' => $user->instagram ?? '',
                    'youtube' => $user->youtube ?? '',
                    'tiktok' => $user->tiktok ?? ''
                ]
            ],
            'tipos' => $user->tipos ?? [],
            'photos' => $userPhotos->map(function ($photo) {
                return [
                    'id' => $photo->id,
                    'url' => $photo->url,
                    'nombre' => $photo->nombre
                ];
            }),
            'availabilities' => $user->availabilities->map(function ($availability) {
                return [
                    'id' => $availability->id,
                    'day_of_week' => $availability->day_of_week,
                    'time_start' => $availability->start_time,
                    'time_end' => $availability->end_time,
                    'turno' => $availability->turno,
                    'status' => 'disponible'
                ];
            }),
        ];

        return Inertia::render('influencers/Perfil', [
            'profileData' => $profileData
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
            'nombre' => 'nullable|string|max:255',
            'tipo' => 'nullable|string|in:foto,video,dato',
        ]);

        try {
            $user = Auth::user();
            $file = $request->file('photo');
            $path = $file->store('photos/influencers', 'public');

            $photo = Photo::create([
                'path' => $path,
                'nombre' => $request->nombre ?? $file->getClientOriginalName(),
                'tipo' => $request->tipo ?? 'foto',
                'cupon' => null,
            ]);

            $user->photos()->attach($photo->id);

            return redirect()->route('influencer.perfil')->with('success', 'Foto subida exitosamente');

        } catch (\Exception $e) {
            return redirect()->route('influencer.perfil')->with('error', 'Error al subir la foto');
        }
    }

    public function deletePhoto($photoId)
    {
        try {
            $user = Auth::user();
            $photo = Photo::findOrFail($photoId);

            if (!$user->photos()->where('photos.id', $photoId)->exists()) {
                return redirect()->route('influencer.perfil')->with('error', 'No tienes permiso para eliminar esta foto');
            }

            $user->photos()->detach($photoId);

            if ($photo->users()->count() === 0) {
                $photo->deleteFile();
                $photo->delete();
            }

            return redirect()->route('influencer.perfil')->with('success', 'Foto eliminada exitosamente');

        } catch (\Exception $e) {
            return redirect()->route('influencer.perfil')->with('error', 'Error al eliminar la foto');
        }
    }
}
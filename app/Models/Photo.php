<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    protected $fillable = ['path', 'nombre', 'tipo', 'cupon'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'photo_user');
    }

    public function getUrlAttribute()
    {
        return $this->path ? Storage::url($this->path) : null;
    }

    public function deleteFile()
    {
        if ($this->path && Storage::disk('public')->exists($this->path)) {
            Storage::disk('public')->delete($this->path);
            return true;
        }
        return false;
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombrecompleto',
        'correoelectronico',
        'presupuesto',
        'celular',
        'descripcion',
        'empresa',
        'estado'
    ];

    protected $casts = [
        'presupuesto' => 'decimal:2',
        'estado' => 'boolean',
    ];

    // Accesor para mostrar estado legible
    public function getEstadoLabelAttribute(): string
    {
        return $this->estado ? 'Revisado' : 'Pendiente';
    }

    // Accesor para color del badge según estado
    public function getEstadoColorAttribute(): string
    {
        return $this->estado ? 'success' : 'warning';
    }
}

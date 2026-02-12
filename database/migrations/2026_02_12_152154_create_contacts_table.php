<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('nombrecompleto');
            $table->string('correoelectronico')->unique();
            $table->decimal('presupuesto', 10, 2);
            $table->string('celular');
            $table->text('descripcion');
            $table->string('empresa');
            $table->boolean('estado')->default(false); // false = pendiente, true = revisado
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up(): void
{
    Schema::create('clients', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('partner');
        $table->string('email')->unique();
        $table->string('phone');
        $table->date('event_date');
        $table->decimal('budget', 15, 0); // Angka besar tanpa koma
        $table->string('status')->default('Planning'); // Planning, In Progress, Completed
        $table->json('preferences')->nullable(); // Tag array
        $table->timestamps();   
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};

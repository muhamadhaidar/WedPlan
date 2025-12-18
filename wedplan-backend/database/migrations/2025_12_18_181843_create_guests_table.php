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
    Schema::create('guests', function (Blueprint $table) {
        $table->id();
        // Foreign key ke tabel weddings
        $table->foreignId('wedding_id')->constrained()->onDelete('cascade'); 
        
        $table->string('name');
        $table->string('category')->default('General'); // Misal: VIP, Family, Friend
        $table->enum('status', ['pending', 'confirmed', 'declined'])->default('pending');
        $table->integer('pax')->default(1); // Jumlah orang yang dibawa
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};

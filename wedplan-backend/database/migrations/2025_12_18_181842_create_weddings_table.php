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
    Schema::create('weddings', function (Blueprint $table) {
        $table->id();
        $table->string('groom_name');   // Nama Pengantin Pria
        $table->string('bride_name');   // Nama Pengantin Wanita
        $table->date('wedding_date')->nullable();
        $table->string('location')->nullable();
        $table->decimal('budget', 15, 2)->default(0); // Budget (up to triliunan)
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weddings');
    }
};

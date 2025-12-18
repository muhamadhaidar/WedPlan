<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wedding extends Model
{
    use HasFactory;

    protected $fillable = [
        'groom_name', 
        'bride_name', 
        'wedding_date', 
        'location', 
        'budget'
    ];

    // Relasi: Satu wedding punya banyak tamu
    public function guests()
    {
        return $this->hasMany(Guest::class);
    }
}
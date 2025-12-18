<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'partner', 'email', 'phone', 
        'event_date', 'budget', 'status', 'preferences'
    ];

    protected $casts = [
        'event_date' => 'date',
        'preferences' => 'array', // PENTING: Biar otomatis jadi array di React
    ];
}
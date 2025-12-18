<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeddingController;
use App\Http\Controllers\ClientController;

// --- ROUTE USER (Bawaan Laravel) ---
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// ==========================================
// 1. MANAJEMEN KLIEN (CLIENTS)
// ==========================================
Route::get('/clients', [ClientController::class, 'index']);        // Ambil Semua Data
Route::post('/clients', [ClientController::class, 'store']);       // Simpan Baru
Route::put('/clients/{id}', [ClientController::class, 'update']);  // Update Data
Route::delete('/clients/{id}', [ClientController::class, 'destroy']); // Hapus Data


// ==========================================
// 2. MANAJEMEN PERNIKAHAN (WEDDINGS)
// ==========================================
Route::get('/weddings', [WeddingController::class, 'index']);        // List Semua Wedding
Route::post('/weddings', [WeddingController::class, 'store']);       // Bikin Wedding Baru
Route::get('/weddings/{id}', [WeddingController::class, 'show']);    // Lihat Detail Wedding
Route::put('/weddings/{id}', [WeddingController::class, 'update']);  // Edit Info Wedding
Route::delete('/weddings/{id}', [WeddingController::class, 'destroy']); // Hapus Wedding


// ==========================================
// 3. MANAJEMEN TAMU (GUESTS)
// ==========================================
// Tambah tamu ke wedding tertentu
Route::post('/weddings/{id}/guests', [WeddingController::class, 'addGuest']); 

// Update status tamu (Hadir/Tidak)
Route::patch('/guests/{id}', [WeddingController::class, 'updateGuestStatus']); 

// Hapus tamu
Route::delete('/guests/{id}', [WeddingController::class, 'deleteGuest']);
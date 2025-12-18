<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use App\Models\Guest;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    // 1. API untuk bikin Wedding baru
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'groom_name' => 'required|string',
            'bride_name' => 'required|string',
            'wedding_date' => 'nullable|date',
            'location' => 'nullable|string',
            'budget' => 'numeric'
        ]);

        // Simpan ke database
        $wedding = Wedding::create($validated);

        return response()->json([
            'message' => 'Wedding created successfully!',
            'data' => $wedding
        ], 201);
    }

    // 2. API untuk melihat detail Wedding beserta tamunya
    public function show($id)
    {
        // Cari wedding berdasarkan ID, sekalian ambil data guests-nya
        $wedding = Wedding::with('guests')->find($id);

        if (!$wedding) {
            return response()->json(['message' => 'Wedding not found'], 404);
        }

        return response()->json($wedding);
    }

    // 3. API untuk nambah tamu ke wedding tertentu
    public function addGuest(Request $request, $id)
    {
        $wedding = Wedding::find($id);

        if (!$wedding) {
            return response()->json(['message' => 'Wedding not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'string',
            'pax' => 'integer'
        ]);

        // Simpan tamu yg terhubung ke wedding ini
        $guest = $wedding->guests()->create($validated);

        return response()->json([
            'message' => 'Guest added!',
            'data' => $guest
        ], 201);
    }

    // ... fungsi store, show, addGuest yang lama biarin aja ...

    // 4. Update Status Tamu (Hadir/Tidak)
    public function updateGuestStatus(Request $request, $id)
    {
        $guest = Guest::find($id);
        if (!$guest) return response()->json(['message' => 'Tamu tidak ditemukan'], 404);

        $guest->update(['status' => $request->status]); // status: 'confirmed' / 'declined'

        return response()->json(['message' => 'Status updated', 'data' => $guest]);
    }

    // 5. Hapus Tamu
    public function deleteGuest($id)
    {
        $guest = Guest::find($id);
        if ($guest) $guest->delete();
        return response()->json(['message' => 'Tamu dihapus']);
    }

    // 6. Hapus Wedding (Beserta semua tamunya)
    public function destroy($id)
    {
        $wedding = Wedding::find($id);
        if (!$wedding) return response()->json(['message' => 'Wedding tidak ditemukan'], 404);
        
        // Hapus wedding (Tamu ikut terhapus otomatis karena settingan database 'cascade' di awal)
        $wedding->delete(); 
        
        return response()->json(['message' => 'Wedding deleted']);
    }
    // Tambahkan ini di dalam class WeddingController
    public function index()
    {
        // Ambil semua data wedding, urutkan dari yg terbaru
        return response()->json(Wedding::orderBy('created_at', 'desc')->get());
    }

    // Update Data Wedding
    public function update(Request $request, $id)
    {
        $wedding = Wedding::find($id);

        if (!$wedding) {
            return response()->json(['message' => 'Wedding not found'], 404);
        }

        $validated = $request->validate([
            'groom_name' => 'required|string',
            'bride_name' => 'required|string',
            'location' => 'nullable|string',
            'budget' => 'numeric'
        ]);

        $wedding->update($validated);

        // Balikin data terbaru beserta relasi guests-nya biar frontend gak bingung
        return response()->json($wedding->load('guests'));
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Carbon\Carbon; // Import Carbon untuk fix tanggal
use Illuminate\Support\Facades\Log; // Import Log untuk debugging

class ClientController extends Controller
{
    // 1. AMBIL SEMUA DATA
    public function index()
    {
        return response()->json(Client::latest()->get());
    }

    // 2. SIMPAN DATA BARU (FIXED)
    public function store(Request $request)
    {
        // Validasi Input
        $validated = $request->validate([
            'name' => 'required|string',
            'partner' => 'required|string',
            'email' => 'required|email|unique:clients',
            'phone' => 'required',
            'event_date' => 'required', // Kita validasi manual formatnya nanti
            'budget' => 'required|numeric',
            'preferences' => 'nullable|array' // Boleh kosong, tapi harus array
        ]);

        try {
            // FIX: Ubah format tanggal dari "31 Dec 2025" ke "2025-12-31" (MySQL Format)
            // Carbon::parse cukup pintar membaca format teks bahasa Inggris
            $validated['event_date'] = Carbon::parse($request->event_date)->format('Y-m-d');

            // Default values
            $validated['status'] = 'Planning';
            
            // Jika preferences kosong, set array kosong biar gak error
            if (!isset($validated['preferences'])) {
                $validated['preferences'] = [];
            }

            // Simpan ke Database
            $client = Client::create($validated);

            return response()->json([
                'message' => 'Data berhasil disimpan',
                'data' => $client
            ], 201);

        } catch (\Exception $e) {
            // Jika error, catat di log server dan kirim pesan error asli ke frontend
            Log::error("Gagal Simpan Client: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal menyimpan data',
                'error' => $e->getMessage() // Ini akan muncul di Network Tab browser kamu
            ], 500);
        }
    }

    // 3. UPDATE DATA (FIXED)
    public function update(Request $request, $id)
    {
        $client = Client::find($id);
        if (!$client) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        $validated = $request->validate([
            'name' => 'required',
            'partner' => 'required',
            'email' => 'required|email|unique:clients,email,'.$id,
            'phone' => 'required',
            'event_date' => 'required',
            'budget' => 'required|numeric',
            'status' => 'required',
            'preferences' => 'nullable|array'
        ]);

        try {
            // FIX: Ubah format tanggal saat update juga
            $validated['event_date'] = Carbon::parse($request->event_date)->format('Y-m-d');

            $client->update($validated);
            
            return response()->json([
                'message' => 'Data berhasil diupdate',
                'data' => $client
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal update data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 4. HAPUS DATA
    public function destroy($id)
    {
        $client = Client::find($id);
        if ($client) {
            $client->delete();
            return response()->json(['message' => 'Berhasil dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}
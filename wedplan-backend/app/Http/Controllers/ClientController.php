<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'partner' => 'required',
            'email' => 'required|email|unique:clients',
            'phone' => 'required',
            'event_date' => 'required|date',
            'budget' => 'required|numeric',
            'preferences' => 'array'
        ]);

        $validated['status'] = 'Planning'; // Default
        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    // ... method index & store sebelumnya ...

    // 3. UPDATE DATA
    public function update(Request $request, $id)
    {
        $client = Client::find($id);
        if (!$client) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        $validated = $request->validate([
            'name' => 'required',
            'partner' => 'required',
            'email' => 'required|email|unique:clients,email,'.$id, // Cek unik kecuali punya sendiri
            'phone' => 'required',
            'event_date' => 'required|date',
            'budget' => 'required|numeric',
            'status' => 'required', // Status ikut diupdate
            'preferences' => 'array'
        ]);

        $client->update($validated);
        return response()->json($client);
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
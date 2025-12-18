import { useState } from 'react';
import api from '../lib/axios';

export default function WeddingForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        groom_name: '',
        bride_name: '',
        location: '',
        budget: '',
        wedding_date: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Kirim data ke Laravel
            await api.post('/weddings', formData);
            alert('Data Pernikahan Berhasil Disimpan!');
            // Reset form
            setFormData({ groom_name: '', bride_name: '', location: '', budget: '', wedding_date: '' });
            // Panggil fungsi refresh dari parent (App.tsx)
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Buat Rencana Baru</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Nama Pengantin Pria"
                    className="border p-2 rounded"
                    value={formData.groom_name}
                    onChange={e => setFormData({ ...formData, groom_name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Nama Pengantin Wanita"
                    className="border p-2 rounded"
                    value={formData.bride_name}
                    onChange={e => setFormData({ ...formData, bride_name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Lokasi Acara"
                    className="border p-2 rounded"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Budget (Rp)"
                    className="border p-2 rounded"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 w-full disabled:bg-gray-400"
            >
                {loading ? 'Menyimpan...' : 'Simpan Rencana Wedding'}
            </button>
        </form>
    );
}
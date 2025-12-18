import { useEffect, useState } from 'react';
import api from '@/lib/axios'; 
import { Users, Plus, MapPin, Calendar } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  partner: string;
  email: string;
  phone: string;
  event_date: string;
  venue: string;
  budget: string;
  status: string;
  preferences: string[];
}

export default function Clients() {
  // PERHATIKAN: useState mulai dari array kosong [], bukan mockClients
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', partner: '', email: '', phone: '',
    event_date: '', venue: '', budget: '', preferences: [] as string[]
  });

  // Fetch dari Laravel
  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error("Gagal ambil data client", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients', formData);
      alert('Sukses!');
      setShowForm(false);
      setFormData({ name: '', partner: '', email: '', phone: '', event_date: '', venue: '', budget: '', preferences: [] });
      fetchClients(); 
    } catch (error: any) {
      alert('Gagal simpan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clients Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-600">
          <Plus className="w-4 h-4" /> Tambah Klien
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Nama Klien" className="border p-2 rounded" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input placeholder="Nama Pasangan" className="border p-2 rounded" value={formData.partner} onChange={e => setFormData({...formData, partner: e.target.value})} />
            <input type="email" placeholder="Email" className="border p-2 rounded" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input placeholder="No. Telepon" className="border p-2 rounded" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="date" className="border p-2 rounded" required value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} />
            <input placeholder="Venue" className="border p-2 rounded" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
            <input type="number" placeholder="Budget" className="border p-2 rounded" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Batal</button>
              <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {/* LIST KLIEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed">
             <p className="text-gray-500">Database kosong. Silakan tambah klien baru.</p>
          </div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div className="bg-rose-50 p-2 rounded-full text-rose-500"><Users className="w-5 h-5" /></div>
                 <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold uppercase">{client.status}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{client.name} & {client.partner}</h3>
              <p className="text-sm text-gray-500 mb-4">{client.email}</p>
              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-400" /> {client.event_date}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400" /> {client.venue || '-'}</div>
                <div className="font-semibold text-rose-600">Rp {parseInt(client.budget).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
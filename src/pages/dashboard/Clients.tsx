import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  Plus, Mail, Phone, Calendar, Wallet, MoreVertical, 
  X, Edit, Trash2, Eye, MapPin, Loader2, Check
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  partner: string;
  email: string;
  phone: string;
  event_date: string;
  budget: string;
  status: string;
  venue: string;
  preferences: string[];
}

// DAFTAR PILIHAN TEMA / KONSEP
const WEDDING_THEMES = [
  "Traditional", "Modern", "Islamic", "Rustic", 
  "Intimate", "Outdoor", "Luxury", "Garden", 
  "Javanese", "Minimalist"
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI STATES
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState<Client | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // STATE FORM (Sekarang preferences bukan array kosong, tapi bagian dari state)
  const [formData, setFormData] = useState({
    name: '', partner: '', email: '', phone: '',
    event_date: '', budget: '', venue: '', status: 'Planning',
    preferences: [] as string[] // <-- ARRAY UNTUK MENAMPUNG TEMA
  });

  // --- 1. API ACTIONS ---
  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Yakin ingin menghapus data klien ini secara permanen?")) return;
    try {
      await api.delete(`/clients/${id}`);
      fetchClients(); 
      setActiveMenuId(null);
    } catch (error) { 
      alert("Gagal menghapus."); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Pastikan ada tema yg dipilih, kalau kosong kasih default 'General'
      const finalPreferences = formData.preferences.length > 0 ? formData.preferences : ['General'];
      const payload = { ...formData, preferences: finalPreferences };
      
      if (editingId) {
        await api.put(`/clients/${editingId}`, payload);
        alert("Data berhasil diperbarui!");
      } else {
        await api.post('/clients', payload);
        alert("Klien baru berhasil ditambahkan!");
      }
      setShowForm(false);
      fetchClients();
    } catch (error: any) {
      alert("Gagal menyimpan: " + (error.response?.data?.message || "Error Backend"));
    } finally { setIsSubmitting(false); }
  };

  // --- 2. HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // HANDLER KHUSUS MEMILIH TEMA (Toggle)
  const toggleTheme = (theme: string) => {
    setFormData(prev => {
      const currentThemes = prev.preferences || [];
      if (currentThemes.includes(theme)) {
        // Kalau sudah ada, hapus (deselect)
        return { ...prev, preferences: currentThemes.filter(t => t !== theme) };
      } else {
        // Kalau belum ada, tambahkan (select)
        return { ...prev, preferences: [...currentThemes, theme] };
      }
    });
  };

  const openEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name, partner: client.partner, email: client.email, phone: client.phone,
      event_date: client.event_date, budget: client.budget, venue: client.venue || '', status: client.status,
      preferences: client.preferences || [] // Load tema yang sudah ada
    });
    setShowForm(true);
    setActiveMenuId(null);
  };

  const openDetail = (client: Client) => {
    setDetailData(client);
    setShowDetail(true);
    setActiveMenuId(null);
  };

  useEffect(() => { fetchClients(); }, []);

  // --- 3. FORMATTERS ---
  const formatRupiah = (val: string) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
  const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6 font-sans p-6 min-h-screen pb-20" onClick={() => setActiveMenuId(null)}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-serif font-bold text-gray-900">Manajemen Klien</h1></div>
        <button onClick={(e) => { 
            e.stopPropagation(); 
            setEditingId(null); 
            setFormData({ name: '', partner: '', email: '', phone: '', event_date: '', budget: '', venue: '', status: 'Planning', preferences: [] }); 
            setShowForm(true); 
          }}
          className="bg-[#E89E97] hover:bg-[#d68c85] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Klien
        </button>
      </div>

      {/* --- MODAL FORM --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Data Klien' : 'Tambah Klien Baru'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleInputChange} className="border p-2.5 rounded-lg" placeholder="Nama Klien" required />
                <input name="partner" value={formData.partner} onChange={handleInputChange} className="border p-2.5 rounded-lg" placeholder="Nama Pasangan" required />
                <input name="email" value={formData.email} onChange={handleInputChange} className="border p-2.5 rounded-lg" placeholder="Email" required />
                <input name="phone" value={formData.phone} onChange={handleInputChange} className="border p-2.5 rounded-lg" placeholder="WhatsApp" required />
                <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} className="border p-2.5 rounded-lg" required />
                <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="border p-2.5 rounded-lg" placeholder="Budget" required />
                <input name="venue" value={formData.venue} onChange={handleInputChange} className="border p-2.5 rounded-lg md:col-span-2" placeholder="Lokasi Venue (Opsional)" />
                
                {/* --- PILIH KONSEP / TEMA (FITUR BARU) --- */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Konsep Pernikahan (Boleh lebih dari satu)</label>
                  <div className="flex flex-wrap gap-2">
                    {WEDDING_THEMES.map((theme) => {
                      const isSelected = formData.preferences.includes(theme);
                      return (
                        <button
                          key={theme}
                          type="button" // PENTING: Supaya tidak submit form
                          onClick={() => toggleTheme(theme)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all flex items-center gap-1
                            ${isSelected 
                              ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                            }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          {theme}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {editingId && (
                  <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2.5 rounded-lg md:col-span-2 bg-white">
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg border">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL --- */}
      {showDetail && detailData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="h-24 bg-gradient-to-r from-rose-400 to-orange-300 relative">
              <button onClick={() => setShowDetail(false)} className="absolute top-4 right-4 bg-black/20 text-white p-1 rounded-full hover:bg-black/40"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-8 pb-8 -mt-10 relative">
              <div className="bg-white p-3 rounded-2xl shadow-md inline-block mb-4 border border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(detailData.status)}`}>{detailData.status}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{detailData.name} & {detailData.partner}</h2>
              <p className="text-gray-500 text-sm mb-6 flex items-center gap-2"><Mail className="w-3 h-3" /> {detailData.email}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Tanggal Acara</p><p className="text-gray-700 font-medium">{formatDate(detailData.event_date)}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-500" />
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Budget</p><p className="text-gray-700 font-medium">{formatRupiah(detailData.budget)}</p></div>
                </div>
                
                {/* Menampilkan Pilihan Tema di Detail */}
                <div className="p-3 bg-gray-50 rounded-lg">
                   <p className="text-xs text-gray-400 font-bold uppercase mb-2">Konsep / Tema</p>
                   <div className="flex flex-wrap gap-2">
                      {detailData.preferences?.map((pref, i) => (
                        <span key={i} className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-semibold border border-rose-200">{pref}</span>
                      ))}
                   </div>
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="w-full mt-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* --- LIST CLIENTS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all relative group">
            
            <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === client.id ? null : client.id); }} className="absolute top-6 right-6 p-1 text-gray-300 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {activeMenuId === client.id && (
              <div className="absolute right-6 top-12 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-100">
                <button onClick={() => openDetail(client)} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"><Eye className="w-4 h-4" /> Detail</button>
                <button onClick={() => openEdit(client)} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</button>
                <button onClick={() => handleDelete(client.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t"><Trash2 className="w-4 h-4" /> Hapus</button>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{client.name} <span className="text-rose-400">&</span> {client.partner}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(client.status)}`}>{client.status}</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400"/> {formatDate(client.event_date)}</div>
              <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-gray-400"/> {formatRupiah(client.budget)}</div>
            </div>

            <hr className="border-gray-50 my-4"/>
            
            {/* Tampilkan Tema di Card Depan */}
            <div className="flex flex-wrap gap-2">
               {client.preferences?.slice(0, 3).map((pref, i) => (
                  <span key={i} className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-xs font-medium">{pref}</span>
               ))}
               {(client.preferences?.length || 0) > 3 && (
                 <span className="text-xs text-gray-400 flex items-center">+{client.preferences.length - 3} lainnya</span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Kardiyoloji',
    expertiseRequired: '',
    stage: 'Fikir Aşaması',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'Açık', createdAt: new Date().toISOString() })
      });

      if (response.ok) {
        alert('İlan başarıyla yayınlandı!');
        navigate('/dashboard'); // Başarılıysa panoya yönlendir
      }
    } catch (error) {
      console.error("İlan oluşturulamadı:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Yeni İlan Oluştur</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Proje Başlığı</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: AI Destekli EKG Analizi"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tıbbi Alan / Domain</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
              >
                <option>Kardiyoloji</option>
                <option>Radyoloji</option>
                <option>Nöroloji</option>
                <option>Genel Cerrahi</option>
                <option>Yazılım Geliştirme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Proje Aşaması</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                onChange={(e) => setFormData({...formData, stage: e.target.value})}
              >
                <option>Fikir Aşaması</option>
                <option>Prototip</option>
                <option>MVP</option>
                <option>Aktif Ürün</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Aranan Uzmanlık</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: Python, Veri Analizi, Klinik Deneyim"
              onChange={(e) => setFormData({...formData, expertiseRequired: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Detaylı Açıklama</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Projenizi ve nasıl bir iş birliği aradığınızı anlatın..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg"
          >
            İlanı Yayınla
          </button>
        </form>
      </div>
    </div>
  );
}
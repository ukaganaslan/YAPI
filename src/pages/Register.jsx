import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Mühendis'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // .edu ve .edu.tr uzantılarını destekleyen kontrol
    const eduRegex = /\.edu(\.[a-z]{2})?$/i;
    
    if (!eduRegex.test(formData.email)) {
      setError('Kayıt için yalnızca kurumsal (.edu veya .edu.tr) e-posta adresleri kabul edilmektedir.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ email: '', password: '', role: 'Mühendis' });
      } else {
        setError('Kayıt işlemi sırasında bir hata oluştu.');
      }
    } catch (err) {
      setError('Sunucuya ulaşılamıyor. Lütfen mock sunucusunun çalıştığından emin olun.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">HEALTH AI</h2>
        </div>

        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md text-center border border-green-200">
            <p className="font-semibold">Kayıt Başarılı!</p>
            <p className="text-sm mt-1">Lütfen e-posta adresinize gönderilen doğrulama bağlantısını kontrol edin.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-green-600 font-medium hover:underline"
            >
              Yeni Kayıt Oluştur
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kurumsal E-posta</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="isim@universite.edu.tr"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rolünüz</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="Mühendis">Mühendis</option>
                <option value="Sağlık Profesyoneli">Sağlık Profesyoneli</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-blue-700 transform active:scale-[0.98] transition-all shadow-md"
            >
              Kayıt Ol
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
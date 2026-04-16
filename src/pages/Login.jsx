import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

// Login.jsx içindeki handleLogin fonksiyonunu bununla değiştir:
const handleLogin = (e) => {
  e.preventDefault();
  
  
  const userData = {
    name: "admin", 
    email: "admin@edu.tr"
  };
  localStorage.setItem('user', JSON.stringify(userData));
  
  navigate('/dashboard');
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">Tekrar Hoş Geldin</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Kurumsal E-Posta</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="isim@universite.edu.tr"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all uppercase italic tracking-tighter shadow-xl">
            Sisteme Gir
          </button>
        <p className="mt-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
         Giriş Bilgileri: "admin@edu.tr"
        </p>
        </form>
        <p className="mt-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
          Hesabın yok mu? <Link to="/register" className="text-blue-600 hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}
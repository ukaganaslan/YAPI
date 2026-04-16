import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo: Tıklayınca İlan Panosuna Götürür */}
        <Link to="/dashboard" className="group">
          <span className="text-2xl font-black text-blue-600 tracking-tighter group-hover:text-blue-700 transition-colors">
            HEALTH<span className="text-gray-900">AI</span>
          </span>
        </Link>

        <div className="flex items-center space-x-8">
          <Link 
            to="/dashboard" 
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            İlan Panosu
          </Link>

          {user ? (
            /* Giriş yapılmışsa: Kullanıcı Adı ve Çıkış (Başlangıca Dön) */
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-gray-900 uppercase italic">
                {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest border border-red-100 px-3 py-1 rounded-lg"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            /* Giriş yapılmamışsa: Giriş Yap Butonu */
            <Link 
              to="/" 
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-md active:scale-95 uppercase italic"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
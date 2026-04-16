import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        


        <div className="space-y-4">
          <Link 
            to="/register" 
            className="group relative flex items-center justify-center w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase italic tracking-tighter"
          >
            Kayıt Ol
            <span className="absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
          </Link>

          <Link 
            to="/login" 
            className="group relative flex items-center justify-center w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95 uppercase italic tracking-tighter"
          >
            Giriş Yap
            <span className="absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
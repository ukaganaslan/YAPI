import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {}
        <Link to="/" className="group">
          <span className="text-2xl font-black text-blue-600 tracking-tighter group-hover:text-blue-700 transition-colors">
            HEALTH<span className="text-gray-900">AI</span>
          </span>
        </Link>

        <div className="space-x-8 flex items-center">
          <Link 
            to="/dashboard" 
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            İlan Panosu
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </nav>
  );
}
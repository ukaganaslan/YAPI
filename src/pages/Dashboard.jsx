import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Hepsi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts');
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("İlanlar yüklenirken hata oluştu:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(filter.toLowerCase()) || 
                          post.expertiseRequired.toLowerCase().includes(filter.toLowerCase());
    const matchesDomain = selectedDomain === 'Hepsi' || post.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const domains = ['Hepsi', 'Kardiyoloji', 'Radyoloji', 'Nöroloji', 'Yazılım Geliştirme'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        
        {/* ÜST KISIM: Arama, Filtre ve Butonun Yan Yana Olduğu Satır */}
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-12">
          
          {/* Birleşik Filtreleme Barı */}
          <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row flex-1 items-center gap-2 w-full">
            {/* Arama Kutusu */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Proje adı veya uzmanlık ara..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-100 mx-1"></div>

            {/* Domain Butonları */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {domains.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedDomain === dom
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-400 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Yeni İlan Oluştur Butonu */}
          <Link 
            to="/create-post" 
            className="bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-2 uppercase italic tracking-tighter whitespace-nowrap"
          >
            <span>+</span> YENİ İLAN OLUŞTUR
          </Link>
        </div>

        {/* İlan Listesi */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-blue-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-current"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map(post => (
              <div key={post.id} className="group bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {post.domain}
                    </span>
                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic">{post.stage}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-none uppercase italic tracking-tighter">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                    <span className="font-black text-gray-900">ARANAN:</span> {post.expertiseRequired}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DURUM: {post.status}</span>
                  </div>
                  
                  <Link 
                    to={`/post/${post.id}`} 
                    className="h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all group-hover:rotate-12 shadow-lg"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sonuç Yoksa */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-black uppercase tracking-widest text-sm">İlan bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
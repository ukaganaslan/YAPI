import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Detaylar yüklenirken hata oluştu:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold">Yükleniyor...</div>;
  if (!post) return <div className="p-20 text-center font-bold">İlan bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Üst Kısım: Başlık ve Rozetler */}
        <div className="p-8 md:p-12 border-b border-gray-50">
          <Link to="/dashboard" className="text-blue-600 font-bold text-sm mb-6 inline-block hover:underline">
            ← Panoya Geri Dön
          </Link>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-50 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full uppercase">
              {post.domain}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs font-black px-4 py-1.5 rounded-full uppercase">
              {post.stage}
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4 uppercase italic">
            {post.title}
          </h1>
          <p className="text-gray-500 text-lg">İlan Tarihi: {new Date(post.createdAt).toLocaleDateString('tr-TR')}</p>
        </div>

        {/* Orta Kısım: İçerik */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic underline decoration-blue-500 decoration-4">
                Proje Açıklaması
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {post.description || "Bu proje için henüz detaylı bir açıklama girilmemiş."}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic underline decoration-blue-500 decoration-4">
                Aranan Uzmanlıklar
              </h2>
              <div className="flex flex-wrap gap-2">
                {post.expertiseRequired.split(',').map((skill, index) => (
                  <span key={index} className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Yan Panel: Eylem Kutusu */}
          <div className="space-y-6">
            <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100">
              <h3 className="text-xl font-black mb-4 leading-tight uppercase">İş Birliği Başlat</h3>
              <p className="text-blue-100 text-sm mb-6">Bu proje ilginizi çekti mi? İlan sahibiyle iletişime geçerek süreci başlatabilirsiniz.</p>
              <button className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                MESAJ GÖNDER
              </button>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-[2rem] bg-gray-50/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Güvenlik Notu</p>
              <p className="text-[10px] text-gray-400 leading-tight">İş birliği sürecinde KVKK ve gizlilik kurallarına uymanız beklenmektedir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
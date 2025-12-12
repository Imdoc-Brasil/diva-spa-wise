import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import { Search, Calendar, User, ArrowRight, Sparkles } from 'lucide-react';


interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover_image: string;
    author_name: string;
    published_at: string;
    read_time_minutes: number;
    tags: string[];
}

const BlogPage: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('saas_posts')
                .select('*')
                .eq('published', true)
                .order('published_at', { ascending: false });

            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    // Theme integration (Simplified)
    // In a real scenario, we would share the theme state from a Layout context
    const isDark = true; // Forcing dark for now to match sales page default

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans`}>
            {/* Simple Navbar */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/sales')}>
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">I</div>
                        <span className="font-bold text-xl tracking-wide text-white">I'mDoc Blog</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/sales')} className="text-slate-400 hover:text-white transition-colors font-medium">Voltar ao Site</button>
                        <button onClick={() => navigate('/login')} className="bg-white text-purple-900 px-6 py-2 rounded-full font-bold hover:bg-slate-100 transition-colors">Entrar</button>
                    </div>
                </div>
            </nav>

            {/* Header / Hero */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-sm mb-6">
                        <Sparkles size={14} className="mr-2" /> Blog & Conteúdo
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200">
                        Insights para Gestão de Clínicas
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Estratégias de growth, gestão financeira e excelência no atendimento para levar sua clínica ao próximo nível.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/50 border border-slate-700 focus:border-purple-500 outline-none text-white placeholder-slate-500 transition-all shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Carregando conteúdos...</div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <div key={post.id} onClick={() => navigate(`/blog/${post.slug}`)} className="group cursor-pointer">
                                <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/10] relative text-white">
                                    <div className="absolute inset-0 bg-slate-800 animate-pulse" /> {/* Placeholder */}
                                    {post.cover_image && (
                                        <img src={post.cover_image} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {post.tags?.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center text-xs text-slate-500 gap-4">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.published_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {post.author_name}</span>
                                        <span>{post.read_time_minutes} min leitura</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                        {post.summary}
                                    </p>
                                    <div className="flex items-center text-purple-400 text-sm font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        Ler artigo completo <ArrowRight size={16} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4 text-slate-500">
                            <Search size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300">Nenhum artigo encontrado</h3>
                        <p className="text-slate-500 mt-2">Estamos preparando conteúdos incríveis para você. Volte em breve.</p>
                        {/* Mock Data Injection for Demo if empty */}
                        <button
                            onClick={() => navigate('/sales')}
                            className="mt-6 text-purple-400 font-bold hover:underline"
                        >
                            Voltar para o Início
                        </button>
                    </div>
                )}
            </div>

            {/* Newsletter CTA */}
            <div className="border-t border-slate-800 bg-slate-900 py-20 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Receba dicas exclusivas</h2>
                    <p className="text-slate-400 mb-8">Junte-se a mais de 2.000 gestores de clínicas que recebem nossas news.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="Seu melhor e-mail" className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-white" />
                        <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors">Inscrever-se</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPage;

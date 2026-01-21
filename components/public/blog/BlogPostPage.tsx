import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Zap } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    cover_image: string;
    author_name: string;
    published_at: string;
    read_time_minutes: number;
    tags: string[];
}

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            const { data, error } = await supabase
                .from('saas_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (data) setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Carregando artigo...</div>;

    if (!post) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Artigo não encontrado</h1>
            <p className="text-slate-400 mb-8">O conteúdo que você procura não existe ou foi removido.</p>
            <button onClick={() => navigate('/blog')} className="text-purple-400 font-bold hover:underline">Voltar para o Blog</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
            {/* Progress Bar (Optional, can be added later) */}

            <article>
                {/* Header Image */}
                <div className="w-full h-[50vh] relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
                    {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}

                    <div className="absolute top-8 left-8 z-20">
                        <button
                            onClick={() => navigate('/blog')}
                            className="flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors text-sm font-bold border border-white/10"
                        >
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 max-w-5xl mx-auto">
                        <div className="flex gap-2 mb-6">
                            {post.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-purple-600 rounded-full text-xs font-bold text-white shadow-lg shadow-purple-900/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300">
                            <span className="flex items-center gap-2"><User size={16} className="text-purple-400" /> {post.author_name}</span>
                            <span className="flex items-center gap-2"><Calendar size={16} className="text-purple-400" /> {new Date(post.published_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2"><Clock size={16} className="text-purple-400" /> {post.read_time_minutes} min de leitura</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">

                    {/* Main Text */}
                    <div className="prose prose-invert prose-lg prose-purple max-w-none">
                        {/* Render HTML Content */}
                        <div dangerouslySetInnerHTML={{ __html: post.content || '<p>Conteúdo não disponível.</p>' }} />
                    </div>

                    {/* Sidebar / Share (Sticky) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Compartilhar</h4>
                                <div className="flex flex-col gap-2">
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium p-2 hover:bg-slate-900 rounded-lg">
                                        <Twitter size={18} /> Twitter
                                    </button>
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium p-2 hover:bg-slate-900 rounded-lg">
                                        <Linkedin size={18} /> LinkedIn
                                    </button>
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-blue-500 transition-colors text-sm font-medium p-2 hover:bg-slate-900 rounded-lg">
                                        <Facebook size={18} /> Facebook
                                    </button>
                                    <button className="flex items-center gap-3 text-slate-400 hover:text-purple-400 transition-colors text-sm font-medium p-2 hover:bg-slate-900 rounded-lg">
                                        <LinkIcon size={18} /> Copiar Link
                                    </button>
                                </div>
                            </div>

                            {/* CTA Widget */}
                            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 p-6 rounded-2xl">
                                <h4 className="font-bold text-white mb-2">Gostou da dica?</h4>
                                <p className="text-sm text-slate-300 mb-4">Aplique isso na sua clínica agora com o I'mDoc.</p>
                                <div className="space-y-3">
                                    <button onClick={() => navigate('/tools/revenue-calculator')} className="w-full bg-white hover:bg-slate-200 text-purple-900 text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <Zap size={16} /> Calcular Potencial
                                    </button>
                                    <button onClick={() => navigate('/signup')} className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-3 rounded-xl transition-colors">
                                        Testar Grátis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Read Next Section could go here */}
        </div>
    );
};

export default BlogPostPage;

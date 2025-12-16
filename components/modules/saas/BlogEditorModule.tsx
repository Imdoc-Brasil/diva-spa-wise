import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
import { useToast } from '../../ui/ToastContext';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, X, ExternalLink, RefreshCw, Bold, Italic, Link2, List, Type, Heading2, Heading3 } from 'lucide-react';

const ToolbarBtn: React.FC<{ icon?: React.ReactNode, label?: string, title: string, onClick: () => void }> = ({ icon, label, title, onClick }) => (
    <button
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs font-bold flex items-center gap-1"
        title={title}
    >
        {icon}
        {label && <span>{label}</span>}
    </button>
);

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    cover_image: string;
    author_name: string;
    read_time_minutes: number;
    tags: string[];
    published: boolean;
    published_at: string;
}

const BlogEditorModule: React.FC = () => {
    const { addToast } = useToast();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('saas_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            addToast('Erro ao carregar posts.', 'error');
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleCreateNew = () => {
        setCurrentPost({
            title: '',
            slug: '',
            summary: '',
            content: '',
            author_name: 'Equipe I\'mdoc',
            read_time_minutes: 5,
            tags: [],
            published: false,
            cover_image: ''
        });
        setIsEditing(true);
    };

    const handleEdit = (post: BlogPost) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

        const { error } = await supabase.from('saas_posts').delete().eq('id', id);
        if (error) {
            addToast('Erro ao excluir post.', 'error');
        } else {
            addToast('Post excluído com sucesso.', 'success');
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const handleSave = async () => {
        if (!currentPost.title || !currentPost.slug) {
            addToast('Título e Slug são obrigatórios.', 'warning');
            return;
        }

        const postData = {
            ...currentPost,
            slug: currentPost.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            updated_at: new Date().toISOString()
        };

        if (!postData.published_at && postData.published) {
            postData.published_at = new Date().toISOString();
        }

        try {
            let error;
            if (currentPost.id) {
                // Update
                const { error: updateError } = await (supabase
                    .from('saas_posts') as any)
                    .update(postData)
                    .eq('id', currentPost.id);
                error = updateError;
            } else {
                // Create
                const { data, error: insertError } = await (supabase
                    .from('saas_posts') as any)
                    .insert([postData])
                    .select()
                    .single();

                if (data) {
                    setCurrentPost(data); // Update ID
                }
                error = insertError;
            }

            if (error) throw error;

            addToast('Artigo salvo com sucesso!', 'success');
            setIsEditing(false);
            fetchPosts();

        } catch (error: any) {
            console.error(error);
            addToast(`Erro ao salvar: ${error.message || error.details || 'Tabela não encontrada?'}`, 'error');
        }
    };

    const insertTag = (prefix: string, suffix: string) => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = currentPost.content || '';
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + prefix + selection + suffix + after;

        setCurrentPost(prev => ({ ...prev, content: newText }));

        // Restore cursor/selection after update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    if (isEditing) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {currentPost.id ? 'Editar Artigo' : 'Novo Artigo'}
                    </h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg"
                        >
                            <Save size={18} /> Salvar Artigo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Título do Artigo</label>
                            <input
                                type="text"
                                value={currentPost.title || ''}
                                onChange={e => {
                                    const title = e.target.value;
                                    // Auto-generate slug if new
                                    const updates: any = { title };
                                    if (!currentPost.id) {
                                        updates.slug = title.toLowerCase()
                                            .replace(/[^\w\s-]/g, '') // Remove special chars
                                            .replace(/\s+/g, '-')     // Space to hyphen
                                            .replace(/-+/g, '-');     // Collapse hyphens
                                    }
                                    setCurrentPost(prev => ({ ...prev, ...updates }));
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none font-bold text-lg"
                                placeholder="Como aumentar o faturamento da clínica..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Resumo (SEO & Card)</label>
                            <textarea
                                value={currentPost.summary || ''}
                                onChange={e => setCurrentPost(prev => ({ ...prev, summary: e.target.value }))}
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                placeholder="Uma breve descrição do conteúdo..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Conteúdo (Editor Visual)</label>
                            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                                {/* Toolbar */}
                                <div className="bg-slate-900 border-b border-slate-700 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
                                    <ToolbarBtn icon={<Bold size={16} />} title="Negrito (Ctrl+B)" onClick={() => insertTag('<b>', '</b>')} />
                                    <ToolbarBtn icon={<Italic size={16} />} title="Itálico (Ctrl+I)" onClick={() => insertTag('<i>', '</i>')} />
                                    <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
                                    <ToolbarBtn icon={<Heading2 size={16} />} title="Subtítulo H2" onClick={() => insertTag('<h2>', '</h2>')} />
                                    <ToolbarBtn icon={<Heading3 size={16} />} title="Tópico H3" onClick={() => insertTag('<h3>', '</h3>')} />
                                    <ToolbarBtn icon={<Type size={16} />} title="Parágrafo" onClick={() => insertTag('<p>', '</p>')} />
                                    <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
                                    <ToolbarBtn icon={<List size={16} />} title="Lista" onClick={() => insertTag('<ul>\n<li>', '</li>\n</ul>')} />
                                    <ToolbarBtn icon={<Link2 size={16} />} title="Link" onClick={() => {
                                        const url = prompt('URL do link:');
                                        if (url) insertTag(`<a href="${url}" target="_blank" class="text-purple-400 underline">`, '</a>');
                                    }} />
                                    <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
                                    <ToolbarBtn label="CTA" title="Botão de Chamada" onClick={() => insertTag('<a href="/#/tools/revenue-calculator" class="inline-block px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition-colors my-4">', '</a>')} />
                                    <ToolbarBtn label="Comparativo" title="Inserir Comparativo Retrátil" onClick={() => insertTag(
                                        '<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"><summary class="cursor-pointer p-4 font-bold text-white flex items-center gap-2 hover:bg-slate-800 transition-colors">❓ Por que I\'mdoc é melhor?</summary><div class="p-4 border-t border-slate-800 overflow-x-auto"><table class="w-full text-left border-collapse rounded-lg"><thead><tr class="bg-slate-800 text-purple-300"><th class="p-3">Diferencial</th><th class="p-3">I\'mdoc SaaS</th><th class="p-3">Concorrência</th></tr></thead><tbody class="text-sm">',
                                        '<tr class="border-b border-slate-700"><td class="p-3 font-bold text-white">IA Generativa</td><td class="p-3 text-green-400">✅ Nativa</td><td class="p-3 text-slate-500">❌ Chatbot</td></tr></tbody></table></div></details>'
                                    )} />
                                </div>

                                <textarea
                                    id="content-editor"
                                    value={currentPost.content || ''}
                                    onChange={e => setCurrentPost(prev => ({ ...prev, content: e.target.value }))}
                                    rows={20}
                                    className="w-full bg-slate-800 p-4 text-white focus:outline-none font-mono text-sm leading-relaxed"
                                    placeholder="Escreva seu artigo aqui... Use a barra acima para formatar."
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 flex justify-between">
                                <span>Dica: Selecione o texto e clique nos botões para formatar.</span>
                                <span>Suporta HTML e Markdown básico.</span>
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <h3 className="font-bold text-slate-300 border-b border-slate-700 pb-2 mb-4">Configurações</h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={currentPost.slug || ''}
                                    onChange={e => setCurrentPost(prev => ({ ...prev, slug: e.target.value }))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Autor</label>
                                <input
                                    type="text"
                                    value={currentPost.author_name || ''}
                                    onChange={e => setCurrentPost(prev => ({ ...prev, author_name: e.target.value }))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Tempo de Leitura (min)</label>
                                <input
                                    type="number"
                                    value={currentPost.read_time_minutes || 5}
                                    onChange={e => setCurrentPost(prev => ({ ...prev, read_time_minutes: Number(e.target.value) }))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${currentPost.published ? 'bg-green-500' : 'bg-slate-600'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${currentPost.published ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={currentPost.published || false}
                                        onChange={e => setCurrentPost(prev => ({ ...prev, published: e.target.checked }))}
                                    />
                                    <span className="text-white font-medium">{currentPost.published ? 'Publicado' : 'Rascunho'}</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <h3 className="font-bold text-slate-300 border-b border-slate-700 pb-2 mb-4">Mídia</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Imagem de Capa (URL)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentPost.cover_image || ''}
                                        onChange={e => setCurrentPost(prev => ({ ...prev, cover_image: e.target.value }))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm"
                                        placeholder="https://..."
                                    />
                                    <button className="bg-slate-700 p-2 rounded hover:bg-slate-600">
                                        <ImageIcon size={16} />
                                    </button>
                                </div>
                                {currentPost.cover_image && (
                                    <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-slate-700">
                                        <img src={currentPost.cover_image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                            <h3 className="font-bold text-slate-300 border-b border-slate-700 pb-2 mb-4">Tags</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Tags (Separadas por vírgula)</label>
                                <input
                                    type="text"
                                    value={currentPost.tags?.join(', ') || ''}
                                    onChange={e => setCurrentPost(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm"
                                    placeholder="Gestão, Financeiro, Marketing"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {currentPost.tags?.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Gerenciar Artigos</h2>
                    <p className="text-slate-400 text-sm">Gerencie o blog e as publicações do I'mdoc.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Novo Artigo
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" />
                    Carregando artigos...
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
                    <p className="text-slate-400 mb-4">Nenhum artigo publicado ainda.</p>
                    <button onClick={handleCreateNew} className="text-purple-400 font-bold hover:underline">Criar o primeiro artigo</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center hover:border-slate-600 transition-colors">
                            <div className="flex gap-4">
                                <div className="w-24 h-16 bg-slate-900 rounded overflow-hidden">
                                    {post.cover_image ? (
                                        <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700"><ImageIcon size={20} /></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{post.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {post.published ? 'Publicado' : 'Rascunho'}
                                        </span>
                                        <span>Autor: {post.author_name}</span>
                                        <span>{new Date(post.published_at || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`/#/blog/${post.slug}`}
                                    target="_blank"
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                    title="Ver post"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogEditorModule;

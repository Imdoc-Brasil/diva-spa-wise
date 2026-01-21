import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
import { useToast } from '../../ui/ToastContext';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, X, ExternalLink, RefreshCw, Bold, Italic, Link2, List, Type, Heading2, Heading3, Eye } from 'lucide-react';

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

    // Editor UI State
    const [activeModal, setActiveModal] = useState<'none' | 'cta' | 'table'>('none');
    const [ctaConfig, setCtaConfig] = useState({ text: 'Calcular Potencial Agora', url: '/#/tools/revenue-calculator', color: 'purple' });
    const [tableRows, setTableRows] = useState<{ feature: string; us: boolean; them: boolean }[]>([
        { feature: 'IA Nativa', us: true, them: false },
        { feature: 'Suporte 24h', us: true, them: false }
    ]);

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
        const IMDOC_MANIFESTO = `
<h2>Por que o I'mDoc SaaS é um sistema incrível?</h2>
<p>Projetado pelo laboratório de IA de última geração, o <strong>I'mDoc</strong> revoluciona a gestão com design avançado, segurança de ponta e base de conhecimento. Não é apenas um software; é um ecossistema projetado com <strong>Inteligência Artificial</strong> e a <strong>Lógica Dominante do Serviço (SDL) de Philip Kotler</strong>.</p>

<h3>Tecnologia & Inteligência</h3>
<ul>
<li><strong>Design & UX:</strong> Recursos avançados de design e comunicação baseados nos padrões Google e Meta.</li>
<li><strong>IA Generativa:</strong> Integrado nativamente às APIs mais atuais do <strong>ChatGPT e Gemini</strong> para automação de textos e insights.</li>
<li><strong>Segurança:</strong> Módulo de Compliance e LGPD nativos para gestão da segurança do paciente e do colaborador.</li>
</ul>

<h3>Financeiro & Contábil 360º</h3>
<p>Esqueça a complexidade. O I'mDoc cuida da saúde financeira da clínica:</p>
<ul>
<li><strong>Emissão de Notas Fiscais:</strong> Automatizada e integrada.</li>
<li><strong>Busca de Notas:</strong> Monitoramento automático de notas emitidas por fornecedores.</li>
<li><strong>Elisão Fiscal Inteligente:</strong> Configuração para evitar bitributação e suporte total para <strong>Equiparação Hospitalar</strong> (reduzindo significativamente a carga tributária).</li>
<li><strong>I'mDoc Pay:</strong> Configure regras de repasse automático (Split) para prestadores direto no sistema.</li>
<li><strong>I'mDoc Fintech:</strong> Acesso facilitado a capital de giro e assessoria financeira (Em breve).</li>
</ul>

<h3>Marketing & Vendas de Alta Performance</h3>
<ul>
<li><strong>Matriz RFM:</strong> Rankeamento automático de pacientes (Recência, Frequência, Valor).</li>
<li><strong>Omnichannel:</strong> Integração com Instagram, X, TikTok e Página de Vendas White Label.</li>
<li><strong>Clube de Fidelidade:</strong> Gestão de programas de pontos e pacotes de tratamento recorrentes.</li>
<li><strong>Marketplace:</strong> Venda produtos de referência ou autorais diretamente pela plataforma.</li>
</ul>

<h3>Operacional & Qualidade</h3>
<ul>
<li><strong>Padronização (POPs):</strong> Protocolos digitais de diluição, limpeza, manutenção e PGRSS.</li>
<li><strong>Gestão de Estoque:</strong> Controle rigoroso de insumos e enxoval.</li>
<li><strong>Gestão de Documentos:</strong> Prontuário e contratos digitais seguros.</li>
</ul>

<h3>Gestão de Pessoas & Cultura</h3>
<ul>
<li><strong>Metas OKR:</strong> Gestão de desempenho com registro de pontualidade e meritocracia.</li>
<li><strong>Universidade Corporativa:</strong> Área de streaming para treinamentos e certificação dos colaboradores.</li>
<li><strong>Programa de Gratificação:</strong> Bonificação baseada em resultados reais e indicadores diretos.</li>
</ul>

<p><strong>O I'mDoc SaaS não é apenas uma ferramenta, é o parceiro estratégico para o crescimento exponencial da sua clínica.</strong></p>

<div class="my-12 p-8 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30 text-center not-prose">
    <h3 class="text-2xl font-bold text-white mb-4">Quanto dinheiro você está deixando na mesa?</h3>
    <p class="text-slate-300 mb-6">Nossa IA analisa seus números e revela o potencial oculto da sua clínica em segundos.</p>
    <a href="/#/tools/revenue-calculator" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-lg hover:scale-105 transform duration-200 no-underline">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        Calcular Potencial de Receita
    </a>
</div>

<h3>Comparativo de Mercado (Raio-X)</h3>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden group" open>
  <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between hover:bg-slate-800 transition-colors list-none">
    <span class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-diva-primary group-open:rotate-180 transition-transform hidden"><path d="m6 9 6 6 6-6"/></svg>
        <span class="text-diva-primary font-bold mr-2">VS</span>
        Por que I'mdoc SaaS é superior ao Doctoralia Pro + Feegow?
    </span>
    <span class="text-slate-500 text-xs transition-transform group-open:rotate-180">▼</span>
  </summary>
  <div class="p-4 border-t border-slate-700 bg-slate-900/50 overflow-x-auto">
    <table class="w-full text-left border-collapse">
       <thead>
         <tr class="bg-slate-800 text-slate-400 text-xs uppercase"><th class="p-3">Recurso</th><th class="p-3 text-diva-primary">I'mDoc SaaS</th><th class="p-3">Doctoralia + Feegow</th></tr>
       </thead>
       <tbody class="text-sm divide-y divide-slate-700">
         <tr><td class="p-3 font-medium text-white">Ecossistema Único</td><td class="p-3 text-green-400">✅ Tudo Integrado</td><td class="p-3 text-red-400">❌ Integração Limitada</td></tr>
         <tr><td class="p-3 font-medium text-white">IA Generativa Nativa</td><td class="p-3 text-green-400">✅ ChatGPT/Gemini</td><td class="p-3 text-red-400">❌ Não Possui</td></tr>
         <tr><td class="p-3 font-medium text-white">Equiparação Hospitalar</td><td class="p-3 text-green-400">✅ Nativo</td><td class="p-3 text-red-400">❌ Apenas Básico</td></tr>
         <tr><td class="p-3 font-medium text-white">Design Premium</td><td class="p-3 text-green-400">✅ Padrão Google/Meta</td><td class="p-3 text-yellow-500">⚠️ Padrão Antigo</td></tr>
       </tbody>
    </table>
  </div>
</details>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden group">
  <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between hover:bg-slate-800 transition-colors list-none">
    <span class="flex items-center gap-3">
        <span class="text-diva-primary font-bold mr-2">VS</span>
        Por que I'mdoc SaaS é superior ao Gestão DS + ChatGDS?
    </span>
    <span class="text-slate-500 text-xs transition-transform group-open:rotate-180">▼</span>
  </summary>
  <div class="p-4 border-t border-slate-700 bg-slate-900/50 overflow-x-auto">
    <table class="w-full text-left border-collapse">
       <thead>
         <tr class="bg-slate-800 text-slate-400 text-xs uppercase"><th class="p-3">Recurso</th><th class="p-3 text-diva-primary">I'mDoc SaaS</th><th class="p-3">Gestão DS + Chat</th></tr>
       </thead>
       <tbody class="text-sm divide-y divide-slate-700">
         <tr><td class="p-3 font-medium text-white">Lógica de Serviço (SDL)</td><td class="p-3 text-green-400">✅ Foco em Valor</td><td class="p-3 text-yellow-500">⚠️ Foco em Agenda</td></tr>
         <tr><td class="p-3 font-medium text-white">Matriz RFM Automática</td><td class="p-3 text-green-400">✅ Sim</td><td class="p-3 text-red-400">❌ Não</td></tr>
         <tr><td class="p-3 font-medium text-white">Marketplace & Franquias</td><td class="p-3 text-green-400">✅ Sim</td><td class="p-3 text-red-400">❌ Não</td></tr>
       </tbody>
    </table>
  </div>
</details>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden group">
  <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between hover:bg-slate-800 transition-colors list-none">
    <span class="flex items-center gap-3">
        <span class="text-diva-primary font-bold mr-2">VS</span>
        Por que I'mdoc é superior ao Clínica Experts?
    </span>
    <span class="text-slate-500 text-xs transition-transform group-open:rotate-180">▼</span>
  </summary>
  <div class="p-4 border-t border-slate-700 bg-slate-900/50 overflow-x-auto">
    <table class="w-full text-left border-collapse">
       <thead>
         <tr class="bg-slate-800 text-slate-400 text-xs uppercase"><th class="p-3">Recurso</th><th class="p-3 text-diva-primary">I'mDoc SaaS</th><th class="p-3">Clínica Experts</th></tr>
       </thead>
       <tbody class="text-sm divide-y divide-slate-700">
         <tr><td class="p-3 font-medium text-white">Universidade Corporativa</td><td class="p-3 text-green-400">✅ Streaming Nativo</td><td class="p-3 text-red-400">❌ Externo</td></tr>
         <tr><td class="p-3 font-medium text-white">Gestão OKR & Metas</td><td class="p-3 text-green-400">✅ Sim</td><td class="p-3 text-red-400">❌ Não</td></tr>
         <tr><td class="p-3 font-medium text-white">Split de Pagamentos</td><td class="p-3 text-green-400">✅ I'mDoc Pay</td><td class="p-3 text-red-400">❌ Não</td></tr>
       </tbody>
    </table>
  </div>
</details>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden group">
  <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between hover:bg-slate-800 transition-colors list-none">
    <span class="flex items-center gap-3">
        <span class="text-diva-primary font-bold mr-2">VS</span>
        Por que I'mdoc é superior ao Amplimed?
    </span>
    <span class="text-slate-500 text-xs transition-transform group-open:rotate-180">▼</span>
  </summary>
  <div class="p-4 border-t border-slate-700 bg-slate-900/50 overflow-x-auto">
    <table class="w-full text-left border-collapse">
       <thead>
         <tr class="bg-slate-800 text-slate-400 text-xs uppercase"><th class="p-3">Recurso</th><th class="p-3 text-diva-primary">I'mDoc SaaS</th><th class="p-3">Amplimed</th></tr>
       </thead>
       <tbody class="text-sm divide-y divide-slate-700">
         <tr><td class="p-3 font-medium text-white">Experiência do Usuário</td><td class="p-3 text-green-400">✅ Design 2025</td><td class="p-3 text-yellow-500">⚠️ Design Funcional</td></tr>
         <tr><td class="p-3 font-medium text-white">CRM & Funil de Vendas</td><td class="p-3 text-green-400">✅ Avançado</td><td class="p-3 text-yellow-500">⚠️ Básico</td></tr>
         <tr><td class="p-3 font-medium text-white">Clube de Assinatura</td><td class="p-3 text-green-400">✅ Nativo</td><td class="p-3 text-red-400">❌ Não</td></tr>
       </tbody>
    </table>
  </div>
</details>
`;

        setCurrentPost({
            title: 'Por que o I\'mdoc Saas é um sistema incrível?',
            slug: 'por-que-o-imdoc-saas-e-incrivel',
            summary: 'Descubra como a IA e a Lógica Dominante do Serviço transformam a gestão da sua clínica.',
            content: IMDOC_MANIFESTO,
            author_name: 'Equipe I\'mdoc',
            read_time_minutes: 7,
            tags: ['Tecnologia', 'Inovação', 'IA', 'Gestão Financeira'],
            published: false,
            cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
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
        if (!supabase) {
            addToast('Erro de Conexão: Supabase não configurado. Verifique suas chaves .env', 'error');
            console.warn('Supabase client is null. Cannot save post.');
            return;
        }

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
            const msg = error.message || 'Erro desconhecido';
            if (msg.includes('relation "saas_posts" does not exist')) {
                addToast('ERRO CRÍTICO: Tabela "saas_posts" não existe. Rode o SQL de migração.', 'error');
            } else {
                addToast(`Erro ao salvar: ${msg}`, 'error');
            }
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
                                {/* Editor Column */}
                                <div className="flex flex-col h-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                                    <div className="bg-slate-900 border-b border-slate-700 p-2 flex flex-wrap gap-1 items-center shrink-0">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 mr-2">Editor</span>
                                        <ToolbarBtn icon={<Bold size={16} />} title="Negrito (Ctrl+B)" onClick={() => insertTag('<b>', '</b>')} />
                                        <ToolbarBtn icon={<Italic size={16} />} title="Itálico (Ctrl+I)" onClick={() => insertTag('<i>', '</i>')} />
                                        <div className="w-px h-4 bg-slate-700 mx-1" />
                                        <ToolbarBtn icon={<Heading2 size={16} />} title="Subtítulo H2" onClick={() => insertTag('<h2>', '</h2>')} />
                                        <ToolbarBtn icon={<Heading3 size={16} />} title="Tópico H3" onClick={() => insertTag('<h3>', '</h3>')} />
                                        <ToolbarBtn icon={<Type size={16} />} title="Parágrafo" onClick={() => insertTag('<p>', '</p>')} />
                                        <div className="w-px h-4 bg-slate-700 mx-1" />
                                        <ToolbarBtn icon={<List size={16} />} title="Lista" onClick={() => insertTag('<ul>\n<li>', '</li>\n</ul>')} />
                                        <ToolbarBtn icon={<Link2 size={16} />} title="Link" onClick={() => {
                                            const url = prompt('URL do link:');
                                            if (url) insertTag(`<a href="${url}" target="_blank" class="text-purple-400 underline">`, '</a>');
                                        }} />
                                        <div className="w-px h-4 bg-slate-700 mx-1" />
                                        <ToolbarBtn label="CTA" title="Botão de Chamada" onClick={() => setActiveModal('cta')} />
                                        <ToolbarBtn label="Comparativo" title="Tabela de Comparação" onClick={() => setActiveModal('table')} />
                                    </div>

                                    {/* MODALS (POPOVERS) FOR GENERATORS */}
                                    {activeModal !== 'none' && (
                                        <div className="absolute inset-x-0 top-14 mx-auto w-[90%] md:w-[400px] z-50 bg-slate-900 border border-slate-600 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    {activeModal === 'cta' ? 'Configurar Botão (CTA)' : 'Criar Comparativo'}
                                                </h4>
                                                <button onClick={() => setActiveModal('none')}><X size={16} className="text-slate-400 hover:text-white" /></button>
                                            </div>

                                            {activeModal === 'cta' && (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1">Texto do Botão</label>
                                                        <input
                                                            value={ctaConfig.text}
                                                            onChange={e => setCtaConfig({ ...ctaConfig, text: e.target.value })}
                                                            className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1">Link de Destino</label>
                                                        <input
                                                            value={ctaConfig.url}
                                                            onChange={e => setCtaConfig({ ...ctaConfig, url: e.target.value })}
                                                            className="w-full bg-slate-800 border-slate-700 rounded p-2 text-sm text-white font-mono"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => {
                                                                const colorClass = ctaConfig.color === 'purple' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-green-600 hover:bg-green-500';
                                                                const html = `<div class="my-8 text-center"><a href="${ctaConfig.url}" class="inline-block px-8 py-4 ${colorClass} text-white font-bold rounded-full transition-all transform hover:scale-105 no-underline shadow-lg text-lg">${ctaConfig.text}</a></div>`;
                                                                insertTag(html, '');
                                                                setActiveModal('none');
                                                            }}
                                                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded text-sm transition-colors"
                                                        >
                                                            Inserir Botão
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {activeModal === 'table' && (
                                                <div className="space-y-3">
                                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                                        {tableRows.map((row, idx) => (
                                                            <div key={idx} className="flex gap-2 items-center bg-slate-800 p-2 rounded">
                                                                <input
                                                                    value={row.feature}
                                                                    onChange={e => {
                                                                        const newRows = [...tableRows];
                                                                        newRows[idx].feature = e.target.value;
                                                                        setTableRows(newRows);
                                                                    }}
                                                                    placeholder="Recurso..."
                                                                    className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 px-0"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newRows = [...tableRows];
                                                                        newRows[idx].us = !newRows[idx].us;
                                                                        setTableRows(newRows);
                                                                    }}
                                                                    className={`p-1 rounded ${row.us ? 'text-green-400 bg-green-400/10' : 'text-slate-600 bg-slate-700'}`}
                                                                >
                                                                    Nós
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const newRows = [...tableRows];
                                                                        newRows[idx].them = !newRows[idx].them;
                                                                        setTableRows(newRows);
                                                                    }}
                                                                    className={`p-1 rounded ${row.them ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}
                                                                >
                                                                    Eles (❌)
                                                                </button>
                                                                <button onClick={() => setTableRows(tableRows.filter((_, i) => i !== idx))}><X size={14} className="text-slate-500" /></button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => setTableRows([...tableRows, { feature: '', us: true, them: false }])}
                                                            className="w-full py-1 border border-slate-700 border-dashed rounded text-xs text-slate-400 hover:text-white"
                                                        >
                                                            + Adicionar Linha
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const rowsHtml = tableRows.map(row => `
                                                                <tr class="border-b border-slate-700/50 hover:bg-slate-800/30">
                                                                    <td class="p-3 font-medium text-slate-200">${row.feature}</td>
                                                                    <td class="p-3 text-center">${row.us ? '✅' : '❌'}</td>
                                                                    <td class="p-3 text-center opacity-60">${row.them ? '✅' : '❌'}</td>
                                                                </tr>
                                                            `).join('');

                                                            const tableHtml = `
                                                                <div class="my-8 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50 shadow-sm">
                                                                    <table class="w-full text-left border-collapse">
                                                                        <thead>
                                                                            <tr class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                                                                <th class="p-3 font-medium">Diferencial</th>
                                                                                <th class="p-3 text-center font-bold text-diva-primary">I'mDoc</th>
                                                                                <th class="p-3 text-center">Outros</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody class="text-sm">
                                                                            ${rowsHtml}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            `;
                                                            insertTag(tableHtml, '');
                                                            setActiveModal('none');
                                                        }}
                                                        className="w-full bg-diva-primary hover:bg-diva-dark text-white font-bold py-2 rounded text-sm transition-colors"
                                                    >
                                                        Inserir Tabela
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <textarea
                                        id="content-editor"
                                        value={currentPost.content || ''}
                                        onChange={e => setCurrentPost(prev => ({ ...prev, content: e.target.value }))}
                                        className="flex-1 w-full bg-slate-800 p-4 text-slate-300 focus:outline-none font-mono text-sm leading-relaxed resize-none custom-scrollbar"
                                        placeholder="Escreva seu artigo aqui (HTML/Texto)..."
                                    />
                                </div>

                                {/* Preview Column */}
                                <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                                    <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center shrink-0">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-2">
                                            <Eye size={12} /> Preview em Tempo Real
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                        <article
                                            className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-a:text-purple-400 prose-strong:text-white prose-li:text-slate-300"
                                            dangerouslySetInnerHTML={{ __html: currentPost.content || '<p class="text-slate-600 italic">O conteúdo aparecerá aqui...</p>' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 flex justify-between">
                                <span>Edite o HTML à esquerda e veja o resultado à direita.</span>
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

-- Create the seed script for the first blog post
-- This content is based on the user's detailed request about "Por que o I'mdoc Saas é um sistema incrível?"
-- It includes the comprehensive list of features, the comparison tables (using HTML details/summary),
-- and the final Call to Action for the Revenue Calculator.

INSERT INTO saas_posts (
  id,
  title,
  slug,
  summary,
  content,
  cover_image,
  author_name,
  read_time_minutes,
  tags,
  published,
  published_at
) VALUES (
  gen_random_uuid(),
  'Por que o I''mdoc Saas é um sistema incrível?',
  'por-que-o-imdoc-saas-e-um-sistema-incrivel',
  'Projetado e desenvolvido pelo Laboratório de IA de última geração, o I''mdoc revoluciona a gestão de clínicas com design avançado, segurança de ponta e uma base de conhecimento focada em alta performance.',
  '<h2>A Revolução na Gestão de Clínicas</h2>
<p>O <strong>I''mdoc Saas</strong> não é apenas um software de gestão; é um ecossistema completo projetado e desenvolvido por um laboratório de <strong>Inteligência Artificial de última geração</strong>. Combinamos os recursos de Design e códigos mais avançados do mercado para oferecer uma experiência sem precedentes.</p>

<h3>Fundamentação Teórica e Tecnológica</h3>
<ul>
    <li>
        <strong>Base de Conhecimento de Alta Performance:</strong> Estruturado para que sua clínica e marca atinjam resultados reais e impactantes.
    </li>
    <li>
        <strong>Lógica Dominante do Serviço (SDL):</strong> Construído com base nos frameworks de Philip Kotler, focando na cocriação de valor com o paciente.
    </li>
    <li>
        <strong>Design System Global:</strong> Utiliza os recursos avançados de design e comunicação visual do Google e Meta para uma interface intuitiva e moderna.
    </li>
    <li>
        <strong>Inteligência Artificial Integrada:</strong> Conectado às APIs mais atuais do <strong>ChatGPT e Gemini</strong>, trazendo assistentes inteligentes para o dia a dia da clínica.
    </li>
</ul>

<h3>Funcionalidades Completas para Gestão 360º</h3>
<p>O I''mdoc Saas oferece uma gestão completa de indicadores e relacionamento com o cliente, incluindo:</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
    <div class="bg-slate-800 p-4 rounded-lg">
        <h4 class="text-purple-400 font-bold mb-2">Financeiro e Contábil</h4>
        <ul class="list-disc list-inside text-sm text-slate-300">
            <li>Gateway de Pagamentos Integrado (I''mdoc Pay).</li>
            <li>Emissão automatizada de Notas Fiscais.</li>
            <li>Busca automática de NFs emitidas por fornecedores.</li>
            <li>Configuração contábil para evitar bitributação.</li>
            <li>Suporte para Equiparação Hospitalar (redução tributária).</li>
        </ul>
    </div>
    <div class="bg-slate-800 p-4 rounded-lg">
        <h4 class="text-purple-400 font-bold mb-2">Gestão e Compliance</h4>
        <ul class="list-disc list-inside text-sm text-slate-300">
            <li>Módulo de LGPD e Compliance de segurança.</li>
            <li>Gestão de Metas OKR (pontualidade e desempenho).</li>
            <li>POPs digitais (Diluição, Limpeza, Manutenção).</li>
            <li>PGRSS e Gestão de Documentos.</li>
        </ul>
    </div>
    <div class="bg-slate-800 p-4 rounded-lg">
        <h4 class="text-purple-400 font-bold mb-2">Marketing e Vendas</h4>
        <ul class="list-disc list-inside text-sm text-slate-300">
            <li>Página de Vendas White Label integrada.</li>
            <li>Integração com Instagram, X, TikTok.</li>
            <li>Matriz RFM para rankeamento de pacientes.</li>
            <li>Clube de Fidelidade e Gestão de Pacotes.</li>
            <li>Marketplace para revenda de produtos.</li>
        </ul>
    </div>
    <div class="bg-slate-800 p-4 rounded-lg">
        <h4 class="text-purple-400 font-bold mb-2">Experiência do Paciente</h4>
        <ul class="list-disc list-inside text-sm text-slate-300">
            <li>Aplicativo exclusivo do Paciente.</li>
            <li>Área de eventos e Comunidade.</li>
            <li>Streaming de treinamentos.</li>
        </ul>
    </div>
</div>

<h3>Diferenciais Exclusivos</h3>
<ul>
    <li><strong>I''mdoc Pay:</strong> Configure regras de repasse automático (split de pagamento) diretamente no sistema.</li>
    <li><strong>Gratificação por Resultado:</strong> Programa de mérito baseado em indicadores, incentivando a equipe.</li>
    <li><strong>I''mdoc Fintech:</strong> Acesso futuro a capital de giro e assessoria financeira 360º.</li>
    <li><strong>Gestão de Estoque e Enxoval:</strong> Controle preciso de insumos.</li>
</ul>

<hr class="my-8 border-slate-700" />

<h3>Comparativo de Mercado</h3>
<p>Entenda por que o I''mdoc Saas está à frente das soluções tradicionais.</p>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg open:bg-slate-800 transition-all">
    <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between">
        Por que a I''mdoc Saas é superior ao Doctoralia Pro + Feegow?
    </summary>
    <div class="p-4 border-t border-slate-700 text-slate-300">
        <p>Enquanto Doctoralia foca em agendamento, o I''mdoc oferece gestão 360º com IA real. <a href="https://pro.doctoralia.com.br/preco/clinicas" target="_blank" class="text-purple-400 underline">Ver tabela comparativa oficial</a>.</p>
    </div>
</details>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg open:bg-slate-800 transition-all">
    <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between">
        Por que a I''mdoc Saas é superior ao Gestão DS + ChatGDS?
    </summary>
    <div class="p-4 border-t border-slate-700 text-slate-300">
        <p>Nossa IA não é apenas um chat, é um agente ativo de gestão financeira e marketing. <a href="https://www.gestaods.com.br/chatgds/" target="_blank" class="text-purple-400 underline">Ver comparativo</a>.</p>
    </div>
</details>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg open:bg-slate-800 transition-all">
    <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between">
        Por que a I''mdoc é superior ao Clínica Experts?
    </summary>
    <div class="p-4 border-t border-slate-700 text-slate-300">
        <p>Nossos módulos de High Performance e OKR superam modelos tradicionais de consultoria. <a href="https://clinicaexperts.com.br/planos" target="_blank" class="text-purple-400 underline">Ver comparativo</a>.</p>
    </div>
</details>

<details class="mb-4 bg-slate-900 border border-slate-700 rounded-lg open:bg-slate-800 transition-all">
    <summary class="cursor-pointer p-4 font-bold text-white flex items-center justify-between">
        Por que a I''mdoc é superior ao Amplimed?
    </summary>
    <div class="p-4 border-t border-slate-700 text-slate-300">
        <p>Integração nativa com Finanças e Marketing avançado (RFM) que o Amplimed não possui. <a href="https://www.amplimed.com.br/amplimed-sistema-gestao/" target="_blank" class="text-purple-400 underline">Ver comparativo</a>.</p>
    </div>
</details>

<div class="mt-12 p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl border border-purple-500/30 text-center">
    <h3 class="text-2xl font-black text-white mb-4">Descubra seu Potencial de Faturamento</h3>
    <p class="text-slate-300 mb-6">Use nossa calculadora exclusiva baseada em algoritmos de eficiência para saber quanto sua clínica deveria estar faturando hoje. Não requer dados pessoais.</p>
    <a href="/#/tools/revenue-calculator" class="inline-block px-8 py-4 bg-white text-purple-900 font-black rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-900/50">
        SIMULAR MEU FATURAMENTO AGORA
    </a>
</div>',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
  'Equipe I''mdoc',
  7,
  ARRAY['Gestão', 'Tecnologia', 'Inteligência Artificial', 'Finanças'],
  true,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

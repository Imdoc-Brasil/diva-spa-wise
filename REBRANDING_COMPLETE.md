# Relatório de Rebranding e Atualização de Terminologia

## Resumo das Alterações
Este documento resume as modificações realizadas para o rebranding da aplicação de "Diva Spa" para **"I'mDoc SaaS"** e a padronização do termo "Cliente" para **"Paciente"**.

### 1. Rebranding (Diva Spa -> I'mDoc)
A identidade visual e textual foi atualizada para refletir a nova marca **I'mDoc®.**

*   **Identidade Visual**:
    *   **Título da Página**: Atualizado em `index.html`.
    *   **Tela de Login**: Título principal, rodapés e placeholders de e-mail atualizados para `@imdoc.com`.
    *   **Sidebar**: Logotipo e título alterados.
    *   **Rodapés**: Adicionada a marca registrada (**I'mDoc®**) e avisos de copyright em `PublicPage`, `LoginPage` e `Layout` principal.
    *   **Onboarding**: URLs de demonstração alteradas para `app.imdoc.com/...`.

### 2. Atualização de Terminologia (Cliente -> Paciente)
Para alinhar o sistema ao contexto de saúde (Medical/Esthetics), o termo "Cliente" foi substituído por "Paciente" em toda a interface do usuário.

*   **Navegação**:
    *   "Portal do Cliente" -> **"Portal do Paciente"**.
    *   "CRM & Clientes" -> **"CRM & Pacientes"**.
*   **Ações e Comandos**:
    *   "Cadastrar Cliente" -> **"Cadastrar Paciente"**.
*   **Formulários e Modais**:
    *   **Novo Agendamento**: Labels e seletores atualizados.
    *   **Novo Paciente**: Opções de indicação (Amigo/Paciente).
    *   **Módulo Financeiro**: "Nome do Paciente", "Paciente Avulso".
    *   **Módulo de Segurança**: Títulos de colunas, descrições de permissões (RBAC) e logs.
*   **Correções Técnicas**:
    *   Ajuste na exibição de papéis de usuário (Role Mapping) para mostrar "Paciente" quando o sistema detectar `role: client`.
    *   Correção de erros de lint (Typescript) inserindo `organizationId` em novos objetos criados.

### Arquivos Modificados
Abaixo, a lista dos principais arquivos impactados:

1.  `index.html`
2.  `components/Layout.tsx`
3.  `components/LoginPage.tsx`
4.  `components/NotFound.tsx`
5.  `components/CommandPalette.tsx`
6.  `components/public/PublicPage.tsx`
7.  `components/ui/OrganizationSwitcher.tsx`
8.  `components/modules/OrganizationSettings.tsx`
9.  `components/modules/PayModule.tsx`
10. `components/modules/SecurityModule.tsx`
11. `components/modals/NewAppointmentModal.tsx`
12. `components/modals/NewClientModal.tsx`

---
**Status:** ✅ Concluído. O sistema está pronto para uso com a nova identidade.

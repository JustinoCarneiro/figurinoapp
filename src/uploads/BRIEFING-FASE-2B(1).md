# Briefing — Fase 2b · Layout do Sistema de Figurinos TJA

> **Para o Claude Design.** Este documento é o guia operacional da fase. Os princípios visuais e as histórias estão nos arquivos anexos — este aqui diz **o que gerar, em que ordem, e com que critérios de pronto.**

---

## 1. Contexto rápido

- **Projeto:** Sistema de gestão de figurinos do **Theatro José de Alencar** (Fortaleza/CE). Escopo MVP.
- **Onde estamos:** Fase 2b (Layout) da metodologia Onda-Dev. Fases 1 e 2a já estão fechadas.
- **Direção visual aprovada:** **Direção A — Institucional Confiável** (índigo + grafite + off-white). Detalhes no `DESIGN.md`.
- **Saída esperada desta fase:** protótipo navegável das 12 telas listadas abaixo, em código (HTML/React) consumindo `tokens.css`, pronto pra aprovação + handoff pro Claude Code.

## 2. Arquivos anexos (leia nesta ordem)

1. `CLAUDE.md` — fonte da verdade do projeto (épicos, stack, máquina de estados, princípios).
2. `spec.md` — histórias de usuário com critérios de aceite (a base de toda tela).
3. `DESIGN.md` — conceito visual (Direção A · Institucional Confiável) + regras de aplicação + do/don't.
4. `tokens.css` — todas as variáveis de design. **Consuma estas variáveis em vez de hardcodar cores ou fontes.**

## 3. Princípios não-negociáveis

Estes pontos sobrescrevem qualquer preferência estética padrão. Em caso de dúvida, escolha o lado mais conservador deles.

**A figurinista é a usuária crítica.** Ela é sênior, sem proficiência em tecnologia. As telas usadas por ela (login, home figurinista, nova locação, devolução, cadastro de peça) precisam de:
- Botões grandes (mínimo 44px de altura, mas prefira 52–56px nos CTAs principais).
- Fluxo linear, **sem menus aninhados**. O caminho de uma ação comum não passa de 3 cliques.
- Zero jargão técnico ("Submeter", "Validar", "Processar" → use "Salvar", "Confirmar", "Pronto").
- Tipografia de corpo em **15–17px** (nunca menos).
- Estados de erro com **explicação humana**, não código de erro.

**A administração pode ter telas mais densas.** São operadores que lidam com sistemas. Listas, filtros e tabelas são bem-vindos nas telas deles.

**Aluguel ≠ caução.** Nunca mostre os dois somados num mesmo número. Sempre em linhas separadas, com labels explícitos.

**Índigo é pontual.** Use como cor de **ação** (CTAs, links, ícones interativos). Nunca como fundo de seção grande. A maior parte da tela é off-white.

**Paleta restrita.** Sem cor ornamental (sem dourado, sem turquesa). Resista à tentação de adicionar "uma cor pra dar vida". A estética é institucional — não decorativa.

**Estados da locação têm cor codificada** (ver `.badge-*` em `tokens.css`):
- Disponível → verde · Em uso → índigo · Aguardando pagamento → âmbar · Atrasada → vermelho · Em manutenção → azul-info · Finalizada → cinza-neutro.

## 4. As 12 telas a gerar (em ordem)

Ordem proposital: começamos pelo **fluxo crítico** (figurinista cria locação → admin confirma → devolução), depois cadastros, por último relatórios.

### Bloco 1 — Acesso e Home (fundação)
1. **Login** — único formulário, usuário + senha. Diferenciação por perfil acontece no backend. Identidade do TJA no topo (logo + nome do sistema em Source Serif 4).
2. **Home da Figurinista** — atende H1.2. **No máximo 3 botões grandes** centralizados: "Cadastrar peça", "Registrar saída", "Registrar devolução". Header com nome dela + logout. Pode ter um indicador discreto de "peças atrasadas hoje" se houver.
3. **Home da Administração** — atende H1.3. Pode ser densa: lista de pagamentos pendentes (top), lista de devoluções aguardando decisão (logo abaixo), 2-3 métricas resumidas (receita do mês, peças fora, locações ativas), e atalhos pras telas de cadastro/relatórios.

### Bloco 2 — Fluxo de Locação (o coração)
4. **Nova Locação (figurinista)** — atende H4.1. Fluxo em 3 passos visíveis: ① selecionar locatário (busca + opção "novo locatário"), ② adicionar peças (busca por nome, lista com checkbox/quantidade), ③ data de devolução prevista. Total devido aparece em destaque no rodapé (aluguel + caução, **separados**). Botão "Concluir locação" envia ao admin.
5. **Pagamentos Pendentes (admin)** — atende H4.2. Lista de locações aguardando pagamento, cada uma como card expandível mostrando: locatário, peças, valor de aluguel, valor de caução, data prevista. Ação primária: "Confirmar pagamento". Ao confirmar, a peça muda pra `em_uso` e some da lista.

### Bloco 3 — Fluxo de Devolução
6. **Registrar Devolução (figurinista)** — atende H5.1. Começa buscando uma locação ativa (por locatário ou peça). Tela de conferência: cada peça aparece como linha com 3 opções claras (Ok / Danificada / Não devolvida) e campo de observação opcional. Botão "Enviar para administração".
7. **Devolução de Caução (admin)** — atende H5.2. Lista de devoluções aguardando decisão. Cada uma mostra: avaliação da figurinista, peças com seus estados, observações. Decisão dupla: "Devolver caução integral" (verde) ou "Reter caução" (com motivo obrigatório). Se peças OK, sistema **sugere** integral mas não decide.

### Bloco 4 — Cadastros
8. **Acervo (listagem + busca)** — atende H6.1. Grid de cards de peças com foto, nome, estado (badge), tamanho. Busca textual no topo + filtro por estado (Disponível / Em uso / Em manutenção). Botão "Cadastrar nova peça".
9. **Cadastro/Edição de Peça** — atende H2.1/H2.2/H2.3. Formulário com: foto (obrigatória em peças novas), nome, categoria, tamanho, cor, material, estado de conservação, localização. Layout em 2 colunas no desktop (foto à esquerda, dados à direita).
10. **Cadastro de Locatário** — atende H3.1. Formulário simples: nome, CPF, telefone, e-mail. Campo de CPF valida e detecta duplicidade.

### Bloco 5 — Relatórios (em tela, sem export no MVP)
11. **Relatórios — Receita do mês** — atende H7.1. Apenas valores de **aluguel** (caução nunca entra). Pode ter um gráfico simples de barras por mês + total do mês corrente em destaque.
12. **Relatórios — Peças Fora** — atende H7.2. Tabela: peça, locatário, data de saída, data prevista, dias de atraso (se houver). Linhas atrasadas em vermelho soft.

## 5. Definição de "tela pronta"

Cada tela só é aprovada quando atende as 3 camadas da definição de pronto do projeto:

- **Belo** — respeita rigorosamente a Direção A do `DESIGN.md`. Tipografia, cores, espaçamentos, raios saem do `tokens.css`.
- **Fluido** — figurinista executa a operação em até 3 cliques. Estados de carregamento e erro tratados. Não exibe gírias técnicas.
- **Seguro** — feedback visual claro pra ações destrutivas (devolução, retenção de caução). Confirmação obrigatória em decisões financeiras.

## 6. O que **não** fazer

- Não inventar cores fora do `tokens.css` (mesmo "só pra esse caso").
- Não usar Source Serif 4 em texto de UI (botão, input, label). Apenas em títulos.
- Não somar aluguel + caução num número único.
- Não usar texto cinza-claro sobre fundo off-white (figurinista não enxerga).
- Não comunicar estado **só por cor** — sempre cor + texto/ícone.
- Não usar modal/popup pra fluxos críticos (nova locação, devolução). Tela cheia, navegação clara.
- Não exibir mensagens de erro do tipo "Error 422 · Validation failed". Mensagem humana.
- Não adicionar funcionalidades fora do `spec.md` MVP (sem PDF, sem QR Code, sem multa, sem export).
- Não usar padrões "SaaS moderno alegre" (gradientes, sidebar escura, cores neon, ilustrações coloridas). Esse sistema é institucional — visual sóbrio, sem firula.

## 7. Como vamos iterar

1. Comece pelo **Bloco 1** (telas 1, 2, 3) e me apresente. Eu valido o tom geral.
2. Avançamos pro **Bloco 2** (telas 4, 5) — fluxo crítico de locação. Aqui itero mais.
3. Bloco 3 (6, 7), depois Bloco 4 (8, 9, 10), depois Bloco 5 (11, 12).
4. Ao final, gere o **handoff bundle** pro Claude Code. Inclua: estrutura de componentes recomendada, rotas, e mapa de quais histórias do `spec.md` cada tela atende.

Cada vez que apresentar um bloco, sintetize em 1-2 linhas: "tela X resolve história Y, princípio Z respeitado". Ajuda a aprovar rápido.

---

*Briefing v1.1 · Fase 2b · Junho/2026. Atualizado após troca da Direção B para a Direção A.*

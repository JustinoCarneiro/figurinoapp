# Handoff — Fase 2b → Fase 3/4 · Sistema de Figurinos TJA

> **Para o Claude Code.** Pacote de transição do protótipo de layout (Fase 2b) para a implementação.
> O protótipo navegável está em `Figurinos TJA.html` (React + Babel, sem build). É a **referência visual e de interação** — não é o código de produção. A stack alvo continua **Spring Boot · Postgres · frontend web responsivo** (ver `CLAUDE.md`).

---

## 1. O que foi entregue

12 telas navegáveis, na Direção A (Institucional Confiável), consumindo `tokens.css`:

| # | Tela | Perfil | Arquivo |
|---|------|--------|---------|
| 1 | Login | ambos | `screens/Login.jsx` |
| 2 | Home da Figurinista | figurinista | `screens/HomeFigurinista.jsx` |
| 3 | Home da Administração | admin | `screens/HomeAdmin.jsx` |
| 4 | Nova Locação (wizard 3 passos) | figurinista | `screens/NovaLocacao.jsx` |
| 5 | Pagamentos Pendentes | admin | `screens/PagamentosPendentes.jsx` |
| 6 | Registrar Devolução | figurinista | `screens/RegistrarDevolucao.jsx` |
| 7 | Devolução de Caução | admin | `screens/DevolucaoCaucao.jsx` |
| 8 | Acervo (busca + filtros) | ambos | `screens/Acervo.jsx` |
| 9 | Cadastro / Edição de Peça | figurinista | `screens/CadastroPeca.jsx` |
| 10 | Cadastro de Locatário | ambos | `screens/CadastroLocatario.jsx` |
| 11 | Relatório — Receita do mês | admin | `screens/RelatorioReceita.jsx` |
| 12 | Relatório — Peças Fora | admin | `screens/RelatorioPecasFora.jsx` |

Suporte: `lib/components.jsx` (Icon, Emblem, Badge, TopBar, Field, BRL), `lib/data.jsx` (mocks), `app.jsx` (roteador + navegador de protótipo), `app.css` (layout), `tokens.css` (design tokens — **fonte da verdade visual**).

> O navegador flutuante "Telas do protótipo" e o objeto `SCREENS` em `app.jsx` **não fazem parte do produto** — são andaime de revisão. Descartar na implementação.

---

## 2. Mapa Tela × História (cobertura do `spec.md`)

| Tela | Épico | Histórias atendidas | Critérios de aceite refletidos no layout |
|------|-------|---------------------|------------------------------------------|
| 1 · Login | E1 | **H1.1** | Erro "Usuário ou senha incorretos"; redireciona por perfil (figurinista→tela 2, admin→tela 3). |
| 2 · Home Figurinista | E1 | **H1.2** | Exatamente 3 ações grandes. Indicador discreto de atraso (não-bloqueante). |
| 3 · Home Admin | E1 | **H1.3** | Pagamentos pendentes + devoluções a decidir + 3 métricas + atalhos. |
| 4 · Nova Locação | E4 | **H4.1**, **H4.3** | Locatário + peças disponíveis + data prevista. Total = `qtd × aluguel` + caução, **separados**. Só peças `disponivel` são selecionáveis. Tela de sucesso indica "aguardando administração". |
| 5 · Pagamentos Pendentes | E4 | **H4.2** | Lista `aguardando_pagamento`; confirma → `em_uso`. Modal registra aluguel/caução/data/admin. |
| 6 · Registrar Devolução | E5 | **H5.1** | Busca locação `em_uso`; conferência peça a peça (ok / danificada / não devolvida) + observação. |
| 7 · Devolução de Caução | E5 | **H5.2** | Mostra avaliação da figurinista; **sugere** integral se tudo OK; reter **exige motivo obrigatório**. |
| 8 · Acervo | E6 | **H6.1** | Busca textual + filtro por estado (disponível/em uso/manutenção). |
| 9 · Cadastro de Peça | E2 | **H2.1**, **H2.2**, **H2.3** | Barra sem nome/categoria; **foto obrigatória** em peça nova; campos para edição. |
| 10 · Cadastro de Locatário | E3 | **H3.1** | Nome/CPF/telefone/e-mail; CPF valida dígitos + **detecta duplicidade** (reaproveitar cadastro). |
| 11 · Relatório Receita | E7 | **H7.1** | **Apenas aluguel** — caução nunca aparece como receita. |
| 12 · Relatório Peças Fora | E7 | **H7.2** | Peças fora + locações; atraso sinalizado (sem multa). |

**Histórias não-MVP de UI** (backend/políticas, sem tela dedicada): H2.3 bloqueio de localização em peça `em_uso` (validar no form de edição), **H3.2 / LGPD** (controle de acesso no backend — dados de CPF só a autenticados).

---

## 3. Rotas sugeridas (frontend de produção)

Protegidas por perfil. `ambos` = qualquer autenticado; demais restritas ao papel.

```
/login                          → Login                       (público)
/                               → redireciona por perfil
/inicio                         → HomeFigurinista              (figurinista)
/painel                         → HomeAdmin                    (admin)

/locacoes/nova                  → NovaLocacao                  (figurinista)
/pagamentos                     → PagamentosPendentes          (admin)

/devolucoes/registrar           → RegistrarDevolucao           (figurinista)
/devolucoes/caucao              → DevolucaoCaucao              (admin)

/acervo                         → Acervo                       (ambos)
/acervo/peca/nova               → CadastroPeca (criação)       (figurinista)
/acervo/peca/:id/editar         → CadastroPeca (edição)        (figurinista)
/locatarios/novo                → CadastroLocatario            (ambos)

/relatorios/receita             → RelatorioReceita             (admin)
/relatorios/pecas-fora          → RelatorioPecasFora           (admin)
```

---

## 4. Estrutura de componentes recomendada

Reaproveite a separação do protótipo. Sugestão de árvore para o frontend de produção:

```
src/
├─ app/
│  ├─ router.tsx               # rotas + guards por perfil
│  └─ AppShell.tsx             # TopBar + <Outlet/>
├─ design/
│  ├─ tokens.css               # COPIAR sem alterar
│  └─ theme.css                # = app.css (layout utilitário)
├─ components/                 # primitivos (de lib/components.jsx)
│  ├─ Icon.tsx                 # ícones de linha (currentColor)
│  ├─ Emblem.tsx               # marca TJA
│  ├─ Badge.tsx                # estados da locação (cor + texto + ícone)
│  ├─ TopBar.tsx
│  ├─ Field.tsx                # label + erro + hint
│  ├─ MoneySplit.tsx           # aluguel/caução SEMPRE separados ← extrair
│  ├─ StepBar.tsx              # indicador do wizard (de NovaLocacao)
│  └─ ConfirmDialog.tsx        # modal de decisão financeira ← extrair
├─ features/
│  ├─ auth/Login.tsx
│  ├─ home/{HomeFigurinista,HomeAdmin}.tsx
│  ├─ locacao/{NovaLocacao,PagamentosPendentes}.tsx
│  ├─ devolucao/{RegistrarDevolucao,DevolucaoCaucao}.tsx
│  ├─ acervo/{Acervo,CadastroPeca}.tsx
│  ├─ locatario/CadastroLocatario.tsx
│  └─ relatorios/{RelatorioReceita,RelatorioPecasFora}.tsx
├─ lib/
│  ├─ format.ts                # BRL(), máscara/validação de CPF e telefone
│  └─ estados.ts               # rótulos + cores dos estados (de components.jsx)
└─ api/                        # client REST /api/v1 (ver §6)
```

Primitivos a **extrair** do protótipo (hoje inline) por serem reusados em telas críticas: `MoneySplit`, `ConfirmDialog`, `StepBar`.

---

## 5. Máquina de estados (do `CLAUDE.md`) e onde cada transição acontece

```
reservada → aguardando_pagamento → em_uso → aguardando_devolucao_caucao → finalizada
                                          ↘ caucao_retida → finalizada
```

| Transição | Disparada em | Por |
|-----------|--------------|-----|
| → `aguardando_pagamento` (peças → `reservada`) | Tela 4 · concluir locação | figurinista |
| → `em_uso` (peças → `em_uso`) | Tela 5 · confirmar pagamento | admin |
| → `aguardando_devolucao_caucao` | Tela 6 · enviar conferência | figurinista |
| → `finalizada` (caução devolvida) | Tela 7 · devolver integral | admin |
| → `caucao_retida → finalizada` | Tela 7 · reter (com motivo) | admin |

Estados de **peça** na devolução (tela 6): `ok → disponivel`, `danificada → em_manutencao`, `nao_devolvida → nao_devolvida`.

---

## 6. Regras de negócio críticas (não-negociáveis)

1. **Aluguel ≠ caução — nunca somar.** Sempre duas linhas com rótulos. Componente `MoneySplit` garante isso. Caução = R$ 50,00 fixos; aluguel = valor fixo **configurável por admin** (`VALOR_ALUGUEL` no protótipo é placeholder).
2. **Caução não é receita.** Relatório de receita (tela 11) considera só aluguel.
3. **Decisão humana sobre dinheiro retido.** O sistema **sugere**, nunca decide. Reter caução exige motivo (≥ texto significativo).
4. **Foto obrigatória** apenas em peça cadastrada pelo sistema (tela 9).
5. **CPF** valida dígitos e detecta duplicidade → reaproveita cadastro existente (tela 10). Dado sensível → LGPD, acesso só autenticado.
6. **Sem multa por atraso** — apenas sinalizar (badge vermelha + dias). Teatro é flexível.
7. **3 cliques** no máximo para operações da figurinista. Sem menus aninhados.

---

## 7. Notas visuais (Direção A)

- Tokens em `tokens.css` são a fonte da verdade. **Não hardcodar cores/fontes.**
- Índigo (`--tja-primary`) é **pontual** — CTA, link, ícone interativo, foco. Nunca fundo de seção grande. O painel escuro do login usa `--tja-text`, não índigo.
- Tipografia: **Source Serif 4** só em títulos (h1–h3); **Inter** em todo o resto.
- Estado **sempre** por cor **+** texto/ícone (acessibilidade).
- Cantos contidos (4–10px). Sombras com tom da marca diluído, nunca preto puro.

---

## 8. Fora de escopo (não implementar no MVP)

Recuperação de senha self-service, baixa formal de peça, histórico por locatário, recibo PDF, filtros combinados, export CSV/PDF, importação da planilha antiga, QR Code, notificações, app nativo. **Multa por atraso e conferência semestral não voltam** (premissas do cliente). Ver backlog no fim do `spec.md`.

---

*Handoff gerado ao fim da Fase 2b · Direção A · Junho/2026.*

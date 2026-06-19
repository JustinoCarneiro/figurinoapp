# Especificação: Slide Deck — Guia do Protótipo · Figurinos TJA

> **Destinatário:** Claude Design (ou agente especializado em layout/PDF)
> **Objetivo:** Gerar um documento de slides em formato PDF, A4 paisagem, que explica cada tela do protótipo do Sistema de Gestão de Figurinos do Theatro José de Alencar (TJA) a um público cliente não-técnico.

---

## 1. Contexto do projeto

O sistema TJA é um software interno de gestão de acervo, locações e caução de figurinos. O protótipo navegável já está publicado em `figurinos-tja-proto.vercel.app`. O manual serve para a cliente aprovar layout e fluxos antes do desenvolvimento do backend.

**Perfis de usuário do sistema:**
- **Figurinista** (Conceição Dantas) — operadora do dia a dia; sem proficiência técnica
- **Administração** (Raimundo Filho) — confirma pagamentos e decide sobre caução

**Credenciais de demonstração:**
| Usuário | Perfil | Senha |
|---------|--------|-------|
| `conceicao` | Figurinista | qualquer |
| `raimundo` | Administração | qualquer |

**URL do protótipo:** `https://figurinos-tja-proto.vercel.app`

---

## 2. Especificação técnica do documento

| Atributo | Valor |
|----------|-------|
| Formato final | PDF imprimível |
| Abordagem recomendada | HTML único → print do browser (Chrome/Chromium) |
| Dimensão de cada slide | **A4 paisagem** — 297mm × 210mm |
| Configuração de impressão | Tamanho: A4 · Orientação: Paisagem · Margens: Nenhuma |
| Classe CSS por slide | `.slide { width: 297mm; min-height: 210mm; page-break-after: always; }` |
| Print CSS obrigatório | `@page { size: A4 landscape; margin: 0; }` |
| Modo de cor para impressão | `-webkit-print-color-adjust: exact; print-color-adjust: exact;` no `body` |
| Total de slides | **12 slides** |
| Arquivo de saída | `src/manual.html` (servido junto ao protótipo no Vercel) |

---

## 3. Sistema visual (tokens de design TJA)

O manual deve usar a **identidade visual oficial** do sistema. Não inventar cores ou tipografias fora desta paleta.

### 3.1 Paleta de cores

```
FUNDOS
  --creme:         #F5F4F0   ← fundo padrão dos slides de conteúdo
  --creme-muted:   #E4E2D9   ← superfícies secundárias, zebrado de tabelas
  --branco:        #FFFFFF   ← cards, superfícies elevadas
  --navy:          #1A1A2E   ← slide de capa, slide de destaque

COR PRIMÁRIA
  --indigo:        #3A2D8F   ← títulos de seção, CTAs, slides de seção
  --indigo-soft:   #E2DEEF   ← fundos de chip/badge com cor primária

TEXTO
  --text:          #1A1A2E   ← texto principal
  --text-soft:     #4A4A5E   ← texto secundário, metadados
  --text-faint:    #8A8A9E   ← placeholder, legenda de gráfico

BORDAS
  --border:        #DCD9D0   ← divisores e bordas padrão

ESTADOS SEMÂNTICOS
  --success:       #2E7D5C   · --success-soft: #DDEEE5
  --warning:       #B8860B   · --warning-soft: #F5ECCC
  --danger:        #B53A3A   · --danger-soft:  #F2DCDC
  --info:          #4A5A7A   · --info-soft:    #DDE2EC
```

### 3.2 Tipografia

```
Fonte de títulos:  'Source Serif 4'  (Google Fonts)  — pesos 400 e 600
Fonte de corpo:    'Inter'           (Google Fonts)  — pesos 400, 500, 600, 700

Import:
  https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap

Escala tipográfica para o manual:
  Título de capa:    36pt  Source Serif 4 · weight 600
  Título de slide:   18pt  Source Serif 4 · weight 600
  Subtítulo:         13pt  Source Serif 4 · weight 600
  Corpo:             9.5pt Inter · weight 400
  Label/eyebrow:     8pt   Inter · weight 700 · uppercase · letter-spacing 0.12em
  Tabela:            8.5pt Inter
  Legenda:           7.5pt Inter · color: text-faint
```

### 3.3 Raios de canto

```
  Slides:       7px (o card do slide em si)
  Cards internos: 5–7px
  Badges/chips:   999px (pill)
  Tabelas:        4px
```

---

## 4. Anatomia de um slide

Cada slide é composto de:

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER (8–10mm de padding vertical)                                 │
│  [Logo TJA]  ·  [Eyebrow: nome da seção]                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  BODY (preenchimento flexível)                                      │
│                                                                     │
│  ┌─────────────────────────┐  ┌───────────────────────────────┐    │
│  │ COLUNA PRINCIPAL        │  │ COLUNA LATERAL / MOCKUP       │    │
│  │ (texto, bullets, tabela)│  │ (wireframe CSS, diagrama, etc)│    │
│  └─────────────────────────┘  └───────────────────────────────┘    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                             [n/12]  │
│  RODAPÉ (número da página, canto inferior direito)                  │
└─────────────────────────────────────────────────────────────────────┘
```

**Exceções:**
- Slide 01 (Capa) — sem header; layout centralizado livre, fundo `--navy`
- Slide 11 (Regra de Ouro) — slide de destaque; fundo `--indigo`, layout centrado
- O número da página fica sempre no canto inferior direito

### 4.1 Tipos de slide

| Tipo | Uso | Fundo |
|------|-----|-------|
| `slide-cover` | Capa do documento | `#1A1A2E` (navy) |
| `slide-section` | Slide de destaque/separador | `#3A2D8F` (indigo) |
| `slide-light` | Conteúdo padrão (maioria) | `#F5F4F0` (creme) |

### 4.2 Logo TJA (componente recorrente)

```
[TJA] Figurinos TJA
      Theatro José de Alencar · SECULT-CE

Estrutura:
  Ícone: box 28×28px · border-radius 5px · bg indigo · fonte serif · "TJA"
  Nome:  Inter 9.5pt · semibold
  Sub:   Inter 7pt · text-faint · uppercase · letter-spacing 0.04em
```

---

## 5. Especificação slide a slide

### Slide 01 — Capa

**Tipo:** `slide-cover` (fundo navy `#1A1A2E`)

**Estrutura:**
- Decoração geométrica no canto direito: dois triângulos em `rgba(255,255,255,0.04)` e `rgba(255,255,255,0.03)` criados com `clip-path: polygon(...)`, cobrindo a altura inteira do slide pelo lado direito. Efeito de sombra diagonal sutil.
- Layout em coluna, `justify-content: space-between` na altura total

**Conteúdo do topo:**
```
Logo TJA (versão branca — ícone com bg rgba(255,255,255,0.15) + borda rgba)
```

**Conteúdo central:**
```
Chip/tag:  "Protótipo de Layout · MVP"
           bg: rgba(255,255,255,0.1) · texto: rgba(255,255,255,0.55)
           border-radius 4px · font 8pt · uppercase · letter-spacing 0.12em
           margin-bottom 16px

Título:    "Guia do\nProtótipo"
           Source Serif 4 · 36pt · weight 600 · color #fff · max-width 200mm
           margin-bottom 12px

Subtítulo: "Documento de referência para a revisão e aprovação do layout
            do Sistema de Gestão de Figurinos do Theatro José de Alencar."
           Inter · 11pt · color rgba(255,255,255,0.65) · line-height 1.6
           max-width 170mm
```

**Rodapé:**
```
Esquerda:
  Label:  "Versão" (uppercase, 8pt, rgba(255,255,255,0.4))
  Valor:  "Fase 2b · Junho 2026" (9.5pt, rgba(255,255,255,0.7))

Direita:
  "12 telas · 2 perfis de usuário\nFortaleza · Ceará"
  (8pt, rgba(255,255,255,0.3), text-align right)
```

**Número de página:** `01` — cor `rgba(255,255,255,0.35)`

---

### Slide 02 — O que é o protótipo

**Tipo:** `slide-light`

**Layout:** 2 colunas — coluna principal + coluna lateral (88mm de largura fixa)

**Coluna principal:**

```
Título H2:  "O que é este protótipo?"  (cor: --indigo)

Parágrafo:  "Um protótipo navegável de alta fidelidade com todas as 12 telas 
             do sistema, criado para validar o layout e o fluxo antes do 
             desenvolvimento do backend."
             ("validar o layout e o fluxo" em <strong>)

Divisor horizontal

Subtítulo:  "O que está funcionando"
Lista de bullets (ponto círculo indigo, 9.5pt, cor text-soft):
  · Toda a navegação entre telas é clicável
  · Formulários com validação em tempo real (CPF, campos obrigatórios)
  · Dados de demonstração realistas
  · Modais de confirmação com fluxo completo
  · Exportação de Excel nas telas da administração
  · Estado salvo no browser — refresh não perde a tela

Divisor horizontal

Subtítulo:  "O que NÃO está neste protótipo"
Lista de bullets:
  · Banco de dados real — os dados somem ao fechar o guia
  · Autenticação de verdade — qualquer senha funciona
  · Fotos reais das peças — placeholders coloridos por enquanto
```

**Coluna lateral (88mm):**

```
Subtítulo:  "Estrutura geral"

Diagrama de organograma (boxes em CSS, sem imagem):
  Topo: "Sistema Figurinos TJA"
        bg: --indigo · text: white · border-radius 4px · text-align center

  Meio (grid 2 colunas):
    "👗 Figurinista / Conceição Dantas"  bg: --indigo-soft · color: indigo
    "📋 Administração / Raimundo Filho"  bg: --indigo-soft · color: indigo

  Base (grid 3 colunas, boxes menores, bg: --creme-muted):
    Acervo | Locação | Devolução
    Pagamento | Caução | Relatórios

Info box azul (info-soft + borda-left indigo 3px):
  "Como aprovar: navegue por todas as telas e sinalize o que deve mudar 
   no visual ou no fluxo. Não avalie os dados — eles são fictícios."

Box escura (bg: --navy · border-radius 7px):
  Label: "ACESSO AO PROTÓTIPO" (uppercase, tiny, rgba branca)
  URL:   "🔗 figurinos-tja-proto.vercel.app"  (9pt, bold, branco)
  Linha: conceicao → Figurinista   (código em bg rgba branca)
  Linha: raimundo → Administração  (código em bg rgba branca)
  Nota:  "Senha: qualquer combinação" (tiny, rgba branca)
```

---

### Slide 03 — Login + Home da Figurinista

**Tipo:** `slide-light`

**Layout:** 2 colunas iguais separadas por um divisor vertical (1px, --border)

**Coluna esquerda — Login (Tela 01):**

```
Chips de cabeçalho (linha horizontal):
  [Tela 01]  [Login]  [Ambos]
  (indigo-chip)       (neutro)

Descrição:
  "Ponto de entrada único do sistema. Layout em duas colunas: 
   identidade institucional à esquerda, formulário à direita."

Mockup CSS da tela de Login:
  Container com borda, border-radius 7px, overflow hidden
  ├── Barra de browser (22px, bg branco, 3 dots coloridos)
  └── Corpo do mockup (display flex, 2 metades):
       Metade esquerda (bg --navy):
         · 3 retângulos com bg rgba branca (widths: 60%, 80%, 70%)
         · Representam logo + título + descrição
       Metade direita (bg branco):
         · Retângulo 60% (label)
         · 2 borders (inputs de usuário e senha)
         · Retângulo sólido indigo (botão Entrar)

Bullets:
  · Coluna esquerda: identidade TJA (cor institucional)
  · Coluna direita: campos usuário + senha
  · Mensagem de erro visível ao errar credenciais
  · Dica de acesso para demonstração inclusa
```

**Coluna direita — Home Figurinista (Tela 02):**

```
Chips de cabeçalho:
  [Tela 02]  [Home da Figurinista]  [Figurinista] (chip verde)

Descrição:
  "Painel de ação simples com as 3 operações mais comuns. 
   Sem jargão técnico — botões grandes e descrições claras."

Mockup CSS da tela Home:
  Container com borda e border-radius 7px
  ├── Barra de browser (dots)
  └── Corpo:
       TopBar: "Figurinos TJA · Conceição Dantas"
       Bloco saudação: 2 retângulos (título + subtítulo)
       Alerta âmbar: "⚠ 1 locação atrasada" (bg warning-soft, borda warning)
       Grid 3 cards:
         Card 1 (borda indigo 1.5px): ícone indigo + "Registrar saída"
         Card 2 (borda padrão):       ícone soft + "Registrar devolução"
         Card 3 (borda padrão):       ícone soft + "Cadastrar peça"

Bullets:
  · Alerta laranja visível quando há locações atrasadas (clicável)
  · 3 cards de ação — "Registrar saída" em destaque primário
  · Botão discreto para ver o acervo completo
  · Zero jargão técnico — UX pautada pela figurinista
```

---

### Slide 04 — Home da Administração

**Tipo:** `slide-light`

**Layout:** 2 colunas — principal (texto + tabela) + lateral (88mm, mockup)

**Coluna principal:**

```
Chips de cabeçalho:
  [Tela 03]  [Home da Administração]  [Admin] (chip âmbar)

Subtítulo:
  "Painel denso com visão completa do estado do sistema. Métricas, 
   filas de trabalho e atalhos rápidos numa tela só."

Subtítulo menor: "Blocos da tela"

Tabela (3 colunas: Bloco | O que mostra | Ação):
  ┌──────────────┬────────────────────────────────────────┬──────────────────────────────────────┐
  │ 3 Métricas   │ Receita do mês, Peças fora, Loc. ativas│ Clique navega ao relatório            │
  │ Pagamentos   │ Locações aguardando pagamento           │ "Confirmar" abre tela de pagamentos  │
  │ Devoluções   │ Devoluções aguardando decisão de caução │ "Analisar" abre tela de caução       │
  │ 4 Atalhos    │ Acervo, Receita, Peças fora, Locatários│ Navegação direta                     │
  └──────────────┴────────────────────────────────────────┴──────────────────────────────────────┘
  Cabeçalho da tabela: bg --indigo, texto branco, uppercase, 7.5pt
```

**Coluna lateral (mockup):**

```
Mockup CSS da tela Home Admin:
  ├── Barra de browser
  └── Corpo:
       TopBar longa: "Figurinos TJA · Administração · Raimundo Filho"
       Grid 3 métricas (cards brancos com borda):
         [Receita Jun / R$ 1.015]  [Peças fora / 3]  [Loc. ativas / 2]
         Valor em 8pt bold indigo, label em 4.5pt soft
       Grid 2 filas de trabalho:
         Fila Pagamentos: lista 2 items (locatário + valor)
         Fila Devoluções: lista 2 items (1 normal, 1 em vermelho com "⚠ avaria")
       Grid 4 atalhos: [Acervo] [Receita] [Peças fora] [Locatários]
         bg --creme-muted, texto soft, font-size tiny

Info box verde (abaixo do mockup):
  "Ponto de atenção: Aluguel e caução aparecem sempre separados — 
   nunca somados. Esta é uma regra de negócio crítica do TJA."
```

---

### Slide 05 — Nova Locação

**Tipo:** `slide-light`

**Layout:** 2 colunas — principal (texto + steps) + lateral (88mm, mockup do wizard)

**Coluna principal:**

```
Chips: [Tela 04] [Nova Locação] [Figurinista] (chip verde)

Descrição:
  "Wizard em 3 passos guiados. A figurinista registra a saída das peças; 
   a administração confirma o pagamento depois."

Subtítulo: "3 passos do wizard"

3 Flow Steps (layout: número circulado + bloco de texto):
  ① Figurinos
    "Seleciona peças disponíveis. Busca por nome, categoria ou cor. 
     Filtro por categoria. Checkbox visual em cada linha."

  ② Locatário
    "Busca e seleciona o locatário cadastrado. Botão para cadastrar 
     novo locatário sem sair do fluxo."

  ③ Confirmar
    "Define data de devolução (obrigatório). Resumo completo da locação. 
     Botão 'Concluir locação'."

  Números: círculos 22px × 22px · bg --indigo · texto branco · Inter 8pt bold
```

**Coluna lateral (mockup do passo 1):**

```
Mockup CSS do wizard no passo 1:
  ├── Barra de browser
  └── Corpo:
       TopBar: "← Nova locação — Registrar saída de peças"
       Barra de progresso (step indicator):
         ● Figurinos ─────── ○ Locatário ─────── ○ Confirmar
         Passo ativo: círculo indigo preenchido + texto bold indigo
         Passos futuros: círculo --creme-muted + texto --soft
       Lista de peças (3 linhas):
         ☑ [thumb colorido] Vestido Belle Époque · Tam. M · Marfim  ← SELECIONADA
           (borda indigo, bg indigo-soft)
         ☐ [thumb colorido] Colete Vitoriano · Tam. M · Cinza
         ☐ [thumb colorido] Vestido Esmeralda · Tam. G · Verde
       Footer fixo (bg branco, borda topo):
         Aluguel: R$ 35,00  |  (divisor)  |  Caução: R$ 50,00   [Avançar →]
         Labels em uppercase tiny · Valores em 6.5pt bold · Botão bg indigo

Info box âmbar (abaixo do mockup):
  "Footer persistente: aluguel e caução ficam visíveis em todos os 3 passos, 
   sempre separados. A figurinista vê o total que o locatário vai pagar 
   em qualquer momento."
```

---

### Slide 06 — Pagamentos Pendentes

**Tipo:** `slide-light`

**Layout:** 2 colunas — principal (texto) + lateral (88mm, mockup)

**Coluna principal:**

```
Chips: [Tela 05] [Pagamentos Pendentes] [Admin] (chip âmbar)

Descrição:
  "Lista todas as locações aguardando confirmação de pagamento. 
   O admin confirma apenas quando recebe o dinheiro fisicamente."

Divisor

Subtítulo: "Funcionalidades"

Bullets:
  · Cards expansíveis — clique para ver detalhes do locatário e peças
  · Cabeçalho mostra total de aluguel e total de caução separados
  · Aviso azul lembra que caução não é receita
  · Modal de confirmação exibe breakdown aluguel ÷ caução antes de confirmar
  · Card confirmado desaparece da lista com animação
  · Estado vazio com botão "Voltar ao painel" quando tudo confirmado
  · Exportação em Excel com totais por coluna
```

**Coluna lateral (mockup):**

```
Mockup CSS da tela de pagamentos:
  ├── Barra de browser
  └── Corpo:
       TopBar longa: "← Pagamentos pendentes   Aluguel: R$70 | Caução: R$100  [Exportar Excel]"
       Info box azul: "ℹ Atenção: a caução é depósito reembolsável — não é receita."
       
       Card 1 — EXPANDIDO (borda indigo 1.5px):
         Cabeçalho: "Cia. Pavilhão da Magnólia"  +  "R$70"  +  badge âmbar "AGUARDANDO PGT"
         Corpo expandido (bg --creme):
           "2 peças · Devolução 23/06"
           Box cinza: "Aluguel (2×R$35): R$70  |  Caução: R$50"
           Botão verde alinhado à direita: "✓ Confirmar pagamento"
       
       Card 2 — FECHADO (borda padrão):
         "Mariana Qutinho"  +  "R$35"  +  badge âmbar "AGUARDANDO PGT"
```

---

### Slide 07 — Devolução (Telas 06 e 07)

**Tipo:** `slide-light`

**Layout:** 2 colunas iguais separadas por divisor vertical

**Coluna esquerda — Registrar Devolução (Tela 06):**

```
Chips: [Tela 06] [Registrar Devolução] [Figurinista] (chip verde)

Descrição:
  "A figurinista confere fisicamente cada peça que volta. 
   Dois estágios: buscar a locação → avaliar cada peça."

Bullets (texto seguido de seção especial):
  · Etapa A — busca a locação pelo nome do locatário ou nome da peça
  · Etapa B — para cada peça, escolhe uma avaliação:

Grid 3 colunas (as 3 opções de avaliação):
  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │ ✓ Devolvida OK   │  │ ⚠ Danificada     │  │ ✕ Não devolvida  │
  │ Voltou em bom    │  │ Voltou com avaria │  │ Peça não retornou│
  │ estado           │  │                  │  │                  │
  └──────────────────┘  └──────────────────┘  └──────────────────┘
  Bordas e textos nas cores semânticas: success / warning / danger

Bullets (continuação):
  · Campo de observação aparece para descrever avarias
  · Footer informa quantas peças foram avaliadas
  · "Enviar para administração" encaminha a decisão de caução
```

**Coluna direita — Devolução de Caução (Tela 07):**

```
Chips: [Tela 07] [Devolução de Caução] [Admin] (chip âmbar)

Descrição:
  "A administração vê as devoluções conferidas pela figurinista 
   e decide o destino da caução."

Info box âmbar:
  "Princípio do sistema: o sistema sugere, mas quem decide é sempre 
   um humano. O sistema nunca retém ou devolve caução automaticamente."

Bullets:
  · Card de devolução mostra avaliação da figurinista por peça
  · Sistema exibe sugestão: "devolver integral" (tudo OK) ou "há problemas — avalie"
  · Devolver caução integral — 1 clique + confirmação
  · Reter caução — abre modal exigindo motivo escrito (obrigatório)
  · Motivo fica registrado na locação para auditoria
  · Card processado fica opaco e desaparece após 1,2 segundos
```

---

### Slide 08 — Acervo + Cadastro de Peça

**Tipo:** `slide-light`

**Layout:** 2 colunas iguais separadas por divisor vertical

**Coluna esquerda — Acervo (Tela 08):**

```
Chips: [Tela 08] [Acervo] [Ambos] (chip neutro)

Descrição: "Galeria de todas as peças do acervo. Busca e filtros em tempo real."

Mockup CSS do Acervo (compact, ocupa parte do espaço disponível):
  ├── Barra de browser
  └── Corpo:
       TopBar: "← Acervo — Peças do acervo     [+ Cadastrar nova peça]"
       Barra de busca + filtros (linha horizontal):
         [🔍 Buscar...] [Todos 10·indigo] [Disponível 5] [Em uso] [Manutenção]
       Grid 4 colunas de mini-cards de peças:
         Card 1: foto placeholder creme/marfim (bg #e8e0ce) + "Vestido Belle Époque" + badge verde
         Card 2: foto placeholder bordô       (bg #7a1e2e) + "Casaca Veludo Bordô"  + badge indigo
         Card 3: foto placeholder verde       (bg #1a6b3c) + "Vestido Esmeralda"    + badge verde
         Card 4: foto placeholder vermelho    (bg #c0392b) + "Saia de Cancan"       + badge roxo/acento · opacity 0.6

Bullets:
  · Grid responsivo — clique na peça abre edição
  · Foto: placeholder colorido na cor da peça (foto real no sistema final)
  · Badge de estado em cada card (disponível / em uso / manutenção)
```

**Coluna direita — Cadastro de Peça (Tela 09):**

```
Chips: [Tela 09] [Cadastro de Peça] [Ambos] (chip neutro)

Descrição:
  "Formulário em 2 colunas: foto à esquerda, dados à direita. 
   Mesma tela serve para criar e editar."

Bullets:
  · Foto obrigatória para novas peças — opcional ao editar
  · Em modo edição: foto existente aparece com overlay "Trocar foto"
  · 3 modos de tamanho: Por letra (PP–GG) / Por número (36–48) / Único
  · Estado de conservação: Ótimo / Bom / Regular / Frágil
  · Localização no acervo: campo texto livre
  · Valor da locação fixo (R$ 35,00) — campo bloqueado
  · Footer fixo com "Salvar peça" / "Cancelar"

Info box azul:
  "Modo edição: ao clicar em qualquer peça no Acervo, o formulário abre 
   pré-preenchido com os dados dela. O título muda para 'Editar: [Nome da Peça]'."
```

---

### Slide 09 — Locatários + Relatórios

**Tipo:** `slide-light`

**Layout:** 3 colunas iguais separadas por divisores verticais

**Coluna 1 — Cadastro de Locatário (Tela 10):**

```
Chips: [Tela 10] [Cadastro de Locatário] [Ambos] (neutro)

Descrição:
  "Formulário com CPF validado, máscara de telefone e detecção de duplicidade."

Bullets:
  · CPF com validação dos dígitos verificadores em tempo real
  · Se CPF já cadastrado: aviso antes de salvar
  · Telefone: máscara automática (9 ou 10 dígitos)
  · E-mail opcional com validação de formato
  · Pode ser acessado no meio de uma locação sem perder o fluxo
```

**Coluna 2 — Relatório Receita (Tela 11):**

```
Chips: [Tela 11] [Relatório: Receita] [Admin] (âmbar)

Descrição: "Receita de aluguel — caução nunca entra."

Mockup do gráfico de barras (mini, CSS puro):
  6 barras verticais representando Jan–Jun
  Barra atual (Jun) em --indigo sólido, demais em --indigo-soft
  Altura proporcional aos valores: 980, 1120, 1435, 1260, 1680, 1015
  Labels de valor acima de cada barra, mês abaixo
  Barra mais alta: Mai (1680)

Bullets:
  · Gráfico de barras dos últimos 6 meses
  · 3 métricas: receita atual, média, acumulado no ano
  · Tabela com locações pagas no mês
  · Exportação em Excel (2 abas: Receita Mensal + Detalhamento)
```

**Coluna 3 — Relatório Peças Fora (Tela 12):**

```
Chips: [Tela 12] [Relatório: Peças Fora] [Admin] (âmbar)

Descrição:
  "Tabela de todas as peças atualmente fora do acervo — em uso por locatários."

Mockup da tabela (mini):
  Cabeçalho: Peça | Locatário | Saída | Situação   (bg --indigo, texto branco)
  Linha 1: "Capa Imperial Dourada" | "Cia. Pavilhão" | "09/06" | "No prazo" (verde)
  Linha 2: "Capa Imperial Dourada" | "Esc. Dança Lia" | "15/05" | "⏰ 5 dias" 
             (fundo --danger-soft, texto --danger, bold — linha atrasada)

Bullets:
  · Linhas vermelhas para peças com devolução atrasada
  · Filtro rápido "Ver só atrasadas" com contador
  · Clique na linha → tela de devolução de caução
  · Resumo: total fora vs. total atrasadas
  · Exportação em Excel
```

---

### Slide 10 — Máquina de estados da locação

**Tipo:** `slide-light`

**Layout:** coluna única (sem divisão lateral), conteúdo centralizado

**Conteúdo:**

```
Título H2: "Ciclo de vida de uma locação"  (cor --indigo)

Parágrafo:
  "Cada locação percorre um caminho definido de estados. O sistema só permite 
   transições válidas — isso garante que nenhuma peça saia sem pagamento 
   confirmado e nenhuma caução seja devolvida sem decisão explícita."

Diagrama de estados (box branco com borda e padding generoso):

  Fluxo principal (linha horizontal, setas →):

  ┌─────────────┐    ┌─────────────────────┐    ┌─────────┐    ┌──────────────────────┐    ┌────────────┐
  │  Reservada  │ →  │ Aguardando pagamento │ →  │ Em uso  │ →  │ Aguardando dec. caução│ →  │ Finalizada │
  └─────────────┘    └─────────────────────┘    └─────────┘    └──────────────────────┘    └────────────┘
   bg: indigo-soft        bg: warning-soft          indigo-soft      bg: success-soft          bg: creme-muted
   borda: indigo           borda: warning             borda: indigo    borda: success            borda: border

  Caminho alternativo (abaixo do "Aguardando dec."):
                                                                       ↓
                                                                ┌────────────┐    ┌────────────┐
                                               "ou"             │Caução retida│ →  │ Finalizada │
                                                                └────────────┘    └────────────┘
                                                                 bg: danger-soft   bg: creme-muted
                                                                 borda: danger     borda: border

Grid de 5 colunas explicativas (uma por estado):
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ Reservada    │ │ Aguard. pgt. │ │ Em uso       │ │ Aguard.caução│ │ Finalizada   │
  │ label+desc   │ │ label+desc   │ │ label+desc   │ │ label+desc   │ │ label+desc   │
  │ 👗 Figurinista│ │ 📋 Admin conf.│ │ 👗 Fig. confere│ │ 📋 Admin decide│ │ ✅ Concluído │
  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
  Labels: uppercase, 7.5pt, --soft
  Texto: 8.5pt, --text
  Ícone+papel: 7.5pt, --faint
```

---

### Slide 11 — Regra de ouro: Aluguel ≠ Caução

**Tipo:** `slide-section` (fundo --indigo `#3A2D8F`)

**Layout:** totalmente centralizado vertical e horizontalmente

```
Label topo:  "Regra de Negócio Crítica"
             Inter · 9pt · bold · uppercase · letter-spacing 0.12em
             color: rgba(255,255,255,0.45)

Linha central com 3 elementos:
  ┌────────────────────┐     ≠     ┌────────────────────┐
  │                    │           │                    │
  │     Aluguel        │           │      Caução        │
  │  Receita do teatro │           │ Depósito reembolsável│
  │ R$ 35,00 · config. │           │ R$ 50,00 · nunca é │
  │                    │           │    receita         │
  └────────────────────┘           └────────────────────┘

  Cada box:
    bg: rgba(255,255,255,0.12)
    border: 2px solid rgba(255,255,255,0.25)
    border-radius: 10px
    padding: 10mm 14mm

  "Aluguel" / "Caução": Source Serif 4 · 28pt · weight 600 · branco
  Subtítulo: Inter · 9pt · rgba(255,255,255,0.65)
  Detalhe: Inter · 8pt · rgba(255,255,255,0.4)

  Símbolo "≠":
    Source Serif 4 · 52pt · color rgba(255,255,255,0.25)

Parágrafo final:
  "Esta separação é enforçada em todas as telas do sistema:
   formulários, confirmações, relatórios e exportações de Excel.
   O sistema nunca soma os dois valores nem os chama de 'total a pagar'."
  Inter · 10pt · rgba(255,255,255,0.65) · line-height 1.7
  "todas" em negrito branco
```

**Número de página:** cor `rgba(255,255,255,0.35)`

---

### Slide 12 — Próximos passos

**Tipo:** `slide-light`

**Layout:** 2 colunas — principal + lateral (88mm)

**Coluna principal:**

```
Título H2: "O que aprovamos aqui?"  (cor --indigo)

Parágrafo:
  "Após revisar o protótipo, precisamos de feedback sobre 3 categorias:"

3 Info boxes empilhadas:
  Verde:  "✅ Layout e identidade visual
           As cores, tipografia, espaçamentos e hierarquia de informação estão corretos?"

  Azul:   "🔄 Fluxos e navegação
           O caminho entre as telas faz sentido? Faltou alguma tela ou ação?"

  Âmbar:  "📋 Regras de negócio
           Os valores, os rótulos e o comportamento do sistema refletem como o TJA funciona?"

Divisor

Subtítulo: "Após aprovação"

3 Flow Steps:
  [F3] Fase 3 — Blueprint técnico
       "Modelagem do banco de dados, APIs e módulos do Spring Boot."

  [F4] Fase 4 — Implementação
       "Backend Spring Boot + Postgres + frontend conectado ao banco real."

  [F5] Fase 5 — Homologação e deploy
       "Testes com dados reais do acervo. Deploy em produção no domínio do TJA."

  Números: circles 22px · bg --indigo · branco · texto "F3", "F4", "F5"
```

**Coluna lateral (88mm):**

```
Subtítulo: "Mapa das 12 telas"

Tabela compacta (3 colunas: # | Tela | Perfil):
  01 | Login                     | Ambos
  02 | Home da Figurinista       | Figurinista
  03 | Home da Administração     | Admin
  04 | Nova Locação              | Figurinista
  05 | Pagamentos Pendentes      | Admin
  06 | Registrar Devolução       | Figurinista
  07 | Devolução de Caução       | Admin
  08 | Acervo                    | Ambos
  09 | Cadastro de Peça          | Ambos
  10 | Cadastro de Locatário     | Ambos
  11 | Relatório: Receita        | Admin
  12 | Relatório: Peças Fora     | Admin
  
  Cabeçalho: bg --indigo, texto branco
  Fonte: 7.5pt

Box escura final (bg --navy, border-radius 7px):
  "ACESSO AO PROTÓTIPO" (label uppercase rgba branca)
  "🔗 figurinos-tja-proto.vercel.app" (bold, 9pt, branco)
  "Usuário figurinista: conceicao" (código em bg rgba, 7.5pt)
  "Usuário admin: raimundo"
  "Senha: qualquer combinação" (tiny, rgba)
```

---

## 6. Elementos visuais recorrentes

### 6.1 Chips de cabeçalho dos slides

Sempre usados no topo de cada coluna de conteúdo para identificar a tela:

```html
<!-- Exemplo de linha de chips -->
<span class="chip chip-indigo">Tela 04</span>  <!-- número da tela -->
<span class="h3-title">Nova Locação</span>      <!-- nome da tela -->
<span class="chip chip-success">Figurinista</span>  <!-- perfil -->

Cores por perfil:
  Ambos:       chip neutro (bg: --creme-muted, cor: --soft)
  Figurinista: chip verde  (bg: --success-soft, cor: --success)
  Admin:       chip âmbar  (bg: --warning-soft, cor: --warning)
```

### 6.2 Info boxes

Caixas coloridas com borda esquerda de 3px para destacar informações importantes:

```
Azul:   bg --info-soft   · borda-left --info    · texto --text
Verde:  bg --success-soft · borda-left --success · texto --text
Âmbar:  bg --warning-soft · borda-left --warning · texto --text
Vermelho: bg --danger-soft · borda-left --danger  · texto --text

Padding:  7px 10px
Radius:   5px
Font:     8.5pt · line-height 1.5
```

### 6.3 Flow Steps (passos numerados)

```
Layout: flex row, gap 8px
  · Círculo numerado: 22px × 22px · border-radius 50% · bg --indigo · branco · bold 8pt
  · Bloco de texto:
      Título: 9pt · bold · --text
      Desc:   8pt · --soft · margin-top 1px
```

### 6.4 Mockups CSS (wireframes de tela)

Representações simplificadas das telas do sistema para contextualização visual:

```
Container:
  border: 1.5px solid --border
  border-radius: 7px
  overflow: hidden
  background: --creme
  box-shadow: 0 2px 8px rgba(26,26,46,0.08)

Barra de browser:
  height: 22px · bg branco · border-bottom 1px --border
  3 dots: 6×6px circles (vermelho #ff5f57, laranja #febc2e, verde #28c840)

TopBar da aplicação:
  height: 18px · bg branco · border-bottom 1px --border · border-radius 4px
  texto: 6pt · bold · --indigo
  simula: "← Nome da Tela · Usuário"

Elementos internos (usar tamanhos em escala reduzida ~1:5):
  Retângulo sólido = botão (bg --indigo para CTA, outros neutros)
  Border somente   = input, card aberto, linha de lista
  Div colorida     = foto placeholder, badge, status
  Texto minúsculo  = labels visíveis em 4pt–6pt

Regra de escala: fonte máxima 6pt · altura de linha máxima 18px
```

### 6.5 Tabelas

```
Cabeçalho: bg --indigo · texto branco · padding 4px 8px
           font: 7.5pt · uppercase · letter-spacing 0.05em · semibold
Células:   padding 5px 8px · border-bottom 1px --border
Zebrado:   linhas pares com bg rgba(0,0,0,0.025)
Fonte:     8.5pt
```

### 6.6 Diagrama de estados

```
Cada caixa de estado:
  padding: 5px 10px · border-radius 5px · font 8pt bold · text-align center
  
Setas entre estados: "→" em Inter · 12pt · --faint

Cores por estado:
  Reservada:                bg --indigo-soft  · borda --indigo
  Aguardando pagamento:     bg --warning-soft · borda --warning
  Em uso:                   bg --indigo-soft  · borda --indigo
  Aguardando dec. caução:   bg --success-soft · borda --success
  Caução retida:            bg --danger-soft  · borda --danger
  Finalizada:               bg --creme-muted  · borda --border
```

---

## 7. CSS estrutural mínimo

```css
/* Importar fontes */
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');

/* Configuração de impressão */
body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  background: #2a2a3e; /* contraste entre slides na tela */
}

/* Um slide = uma página */
.slide {
  width: 297mm;
  min-height: 210mm;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 12mm auto; /* espaçamento na visualização em tela */
}

/* Print: remover margens externas */
@media print {
  body { background: white; }
  .slide {
    margin: 0;
    box-shadow: none;
    width: 100%;
    min-height: 100vh;
    page-break-after: always;
  }
  .slide:last-child { page-break-after: auto; }
}

/* Tamanho da página A4 paisagem */
@page {
  size: A4 landscape;
  margin: 0;
}
```

---

## 8. Instruções de geração do PDF

### 8.1 Via browser (método recomendado)

1. Abrir `figurinos-tja-proto.vercel.app/manual.html` no **Google Chrome**
2. Pressionar `Ctrl+P` (Windows/Linux) ou `Cmd+P` (Mac)
3. Configurar:
   - Destino: **"Salvar como PDF"**
   - Tamanho do papel: **A4**
   - Orientação: **Paisagem**
   - Margens: **Nenhuma**
   - Gráficos de fundo: **✅ Ativado** (crítico para preservar cores)
4. Clicar em **Salvar**

### 8.2 Via Puppeteer (automático, se disponível)

```js
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('http://localhost:PORT/manual.html', { waitUntil: 'networkidle0' });
await page.pdf({
  path: 'guia-prototipo-tja.pdf',
  format: 'A4',
  landscape: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  printBackground: true,
});
await browser.close();
```

---

## 9. Arquivo de saída

```
Localização:  /figurinos-tja/src/manual.html
URL pública:  https://figurinos-tja-proto.vercel.app/manual.html
Tamanho est.: 12 slides × ~17kb de HTML/CSS = ~200kb total
Dependências: Google Fonts (Inter + Source Serif 4) — fallback em system fonts
```

O arquivo deve ser **completamente autocontido** (sem JS, sem assets externos além das fontes). Todas as imagens e ícones devem ser representados via CSS puro ou caracteres Unicode.

---

## 10. Checklist de qualidade

Antes de entregar o PDF, verificar:

- [ ] Todas as 12 telas descritas neste documento aparecem no manual
- [ ] Nenhum slide transborda para a página seguinte (min-height 210mm suficiente)
- [ ] Cores de fundo aparecem na impressão (gráficos de fundo ativados)
- [ ] Fontes Google Fonts carregam — ou fallback system serif/sans legível
- [ ] Numeração de página de 01 a 12 presente em todos os slides
- [ ] Aluguel e caução nunca aparecem somados no documento
- [ ] Slide 11 (Regra de Ouro) usa fundo --indigo com todo o texto em branco
- [ ] Slide 01 (Capa) usa fundo --navy
- [ ] Todos os outros slides usam fundo --creme
- [ ] Mockups CSS representam fielmente o layout descrito em cada seção
- [ ] Info boxes e bullets usam as cores semânticas corretas (verde/âmbar/azul/vermelho)
- [ ] A URL `figurinos-tja-proto.vercel.app` e as credenciais aparecem nos slides 02 e 12

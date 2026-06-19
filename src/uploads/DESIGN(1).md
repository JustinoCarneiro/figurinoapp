# Identidade Visual — Sistema de Figurinos TJA

> Direção visual aprovada na **Fase 2a** da metodologia Onda-Dev. **Direção A — Institucional Confiável.** Este documento é a fonte da verdade visual do projeto. Toda decisão de UI consulta aqui antes do `tokens.css`.

## Conceito

A identidade é deliberadamente **sóbria e institucional**. Sem ornamento teatral, sem cor quente, sem peso editorial. É um sistema interno de governo — e a interface assume essa natureza com elegância.

O índigo profundo (`#3A2D8F`) é a cor de ação, presente discretamente em ícones do próprio site oficial do TJA. O grafite (`#1A1A2E`) é o texto. O creme neutro (`#F5F4F0`) é o fundo — nem branco gélido, nem creme quente; um neutro que descansa.

Tom geral: **calmo, confiável, atemporal**. O sistema deve desaparecer no fluxo de trabalho — a figurinista pensa em peças e locatários, não em interface. A personalidade vem da consistência e da clareza, não de elementos decorativos.

## Princípios de aplicação

1. **A figurinista é a usuária crítica.** Sênior, sem proficiência em tecnologia. As telas dela precisam de legibilidade brutal. Sem cinza-claro sobre creme, sem hierarquias sutis. **Quando hesitar entre contraste e elegância, escolha contraste.**

2. **Índigo é pontual, não dominante.** É a cor de **ação** — CTAs, links, ícones interativos, foco. Nunca como fundo de seções grandes. A maior parte da área visível é creme neutro.

3. **Paleta unificada.** Diferente de identidades com cor quente de acento, aqui o "acento" é apenas uma variação mais clara do mesmo índigo. Isso reforça o tom institucional — sistemas de governo respeitáveis raramente combinam famílias cromáticas diferentes.

4. **Cor semântica é separada da identidade.** Verde funcional, âmbar, vermelho de erro são reservados para **estados**, não para destaques estéticos. Nunca use verde como ornamento, nem âmbar como cor de seção.

## Paleta — quando usar cada cor

| Token | Hex | Onde usar |
|---|---|---|
| `--tja-bg` | `#F5F4F0` | Fundo da aplicação. **A maior parte da área visível.** |
| `--tja-bg-elevated` | `#FFFFFF` | Cards, modais, áreas que precisam destacar do fundo. |
| `--tja-bg-muted` | `#E4E2D9` | Listas zebradas, áreas secundárias. |
| `--tja-primary` | `#3A2D8F` | CTAs, links, títulos importantes, ícones interativos. |
| `--tja-accent` | `#5C4BB8` | Variação clara do primário — destaques secundários. |
| `--tja-text` | `#1A1A2E` | Texto principal. **Não use preto puro** — esse tom azulado é mais coerente. |
| `--tja-text-soft` | `#4A4A5E` | Labels, metadados (Sala · Tamanho · Data). |
| `--tja-border` | `#DCD9D0` | Divisores, contornos de card e input. |

## Tipografia

- **Source Serif 4** (serif) — apenas em **títulos** (h1, h2, h3) e momentos de boas-vindas (tela de login, header do sistema). Peso 600 para títulos. É uma serif moderna e geométrica, com presença sem ser ornamental.
- **Inter** (sans-serif) — todo o resto. Corpo, botões, inputs, labels, badges. Pesos 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

**Nunca misture as duas em texto corrido.** Source Serif em título, Inter em tudo abaixo. Se hesitar se um elemento é "título" ou "label destacado", é label → Inter semibold.

A escolha do par é deliberada: Inter foi desenhada especificamente para telas e interfaces densas, o que conversa diretamente com o uso real do sistema (a administração vai trabalhar com listas, tabelas, formulários).

## Estados da locação — cor por estado

A máquina de estados tem mapeamento de cor próprio (definido em `.badge-*` no `tokens.css`):

- **Disponível** → verde funcional (peça pronta pra sair)
- **Em uso** → índigo (peça está fora; conexão visual com "ação em curso")
- **Aguardando pagamento** → âmbar profissional (atenção, não erro)
- **Atrasada** → vermelho institucional (sinaliza, não pune — sem multa)
- **Em manutenção** → acento índigo claro (estado especial, não-comum)
- **Finalizada** → cinza-creme (histórico, fim de fluxo)

## Componentes-chave

**Botão primário** — Inter 600, índigo sólido, texto branco, raio 6px, altura mínima 44px. Cantos contidos (mais conservador do que botões muito arredondados). Hover escurece o índigo; ativo desce 1px.

**Card** — branco sobre creme neutro, borda 1px, raio 10px, padding 24px. Sombra discreta de tom índigo diluído — nunca preto puro.

**Input** — branco, borda creme-escura, raio 6px, altura 44px. Foco: borda índigo + anel índigo translúcido 3px.

**Badge de status** — pílula pequena, texto MAIÚSCULO com tracking generoso, fundo soft da família semântica. Sempre legível mesmo em densidade alta.

## Layout

- Largura máxima de conteúdo: 1280px.
- Largura máxima de prosa: 720px.
- Espaçamento em escala 4px (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).
- Cantos arredondados, mas contidos (4 / 6 / 10 / 14 px). Curvatura excessiva descaracteriza o tom institucional.

## Acessibilidade

- Contraste AA garantido por padrão na paleta:
  - `--tja-text` (`#1A1A2E`) sobre `--tja-bg` (`#F5F4F0`) → contraste alto.
  - `--tja-text-on-dark` sobre `--tja-primary` (`#3A2D8F`) → contraste alto.
- Áreas de toque mínimas 44×44px.
- Foco visível em **todo** elemento interativo via `--tja-shadow-focus`.
- Nunca comunicar status só por cor — sempre cor + texto/ícone.

## Do / Don't

**✓ Faça**
- Use índigo como cor de ação (botão, link, ícone interativo).
- Use creme neutro como tela base; branco só em superfícies elevadas.
- Mantenha hierarquia tipográfica clara: título serifado, corpo sans, label sans menor.
- Garanta contraste alto. A figurinista precisa enxergar com folga.
- Cantos contidos (4–10px). Generoso o suficiente pra ser moderno, restrito o suficiente pra ser institucional.

**✗ Evite**
- Índigo como fundo de seções grandes.
- Cores quentes (dourado, bordô, terracota, laranja). A paleta é unificada na família fria.
- Source Serif em texto de UI (label, botão, input).
- Sombras pretas (sempre cor da marca diluída).
- Misturar mais de uma fonte serifada.
- Adicionar cores fora desta paleta — quebra o tom institucional, e a coerência é o ativo principal desta direção.
- Cantos exageradamente arredondados (pill em containers grandes, raio 20+ em cards) — desfigura o caráter sistêmico.

## Fontes (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Versionamento

Este documento e o `tokens.css` evoluem juntos. Mudança em um exige atualização do outro.

---

*Sistema de Figurinos TJA · Direção Visual · v1.1 · Junho/2026. (Substitui v1.0, Direção B descartada.)*

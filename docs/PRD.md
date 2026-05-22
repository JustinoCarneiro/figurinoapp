# PRD — Sistema de Controle de Figurinos
## Teatro Estadual · Versão 1.0

> Documento de Requisitos de Produto. Fonte da verdade para todas as iterações de código.
> Qualquer mudança de escopo exige atualização deste documento antes de alterar o código.

---

## 1. Visão Geral

**Nome do sistema:** FigurinoApp  
**Objetivo:** Digitalizar o controle de empréstimo e devolução de figurinos do acervo do teatro estadual, substituindo controle manual (caderno/planilha) por um sistema web simples, acessível e legalmente conforme (LGPD).

**Problema central:** A operadora responsável pelo acervo não tem familiaridade com tecnologia. O sistema precisa ser operável com mínimo treinamento, erros recuperáveis e linguagem completamente clara.

**Resultado esperado:** Operadora consegue registrar um aluguel em menos de 3 cliques, sem ambiguidade de qual figurino está disponível e sem risco de perder histórico de locações.

---

## 2. Usuários e Personas

### Persona 1 — Operadora do Acervo (usuária primária)
- Senhora com pouca familiaridade com tecnologia
- Usa o sistema no balcão do teatro (desktop ou tablet)
- Precisa de: fonte grande, botões com ícone + texto, fluxos curtos, mensagens de erro em português claro, nada que "some" sem aviso
- **Nunca** deve ver jargão técnico (ex: "ID", "null", "404")

### Persona 2 — Locatário Interno
- Ator, figurinista ou funcionário do teatro
- Não usa o sistema diretamente; seus dados são registrados pela operadora

### Persona 3 — Locatário Externo
- Pessoa física ou grupo externo alugando para espetáculo, evento ou produção
- Não usa o sistema diretamente; seus dados são registrados pela operadora

---

## 3. Requisitos Funcionais

### RF01 — Autenticação da Operadora
- A operadora faz login com e-mail e senha
- Não há auto-cadastro; conta criada via seed ou painel admin
- Sessão persiste por 8h (jornada de trabalho)

### RF02 — Cadastro de Figurinos
- Campos: nome, código interno, categoria, tamanho, quantidade total, valor de aluguel (R$), estado de conservação, observações
- Categorias pré-definidas: Medieval, Contemporâneo, Fantasia, Infantil, Histórico, Outros
- Tamanhos: PP, P, M, G, GG, GGG, Único
- Estado: Ótimo, Bom, Regular, Em manutenção
- Foto opcional (upload)
- Figurino pode ter múltiplas unidades (ex: 3 unidades do "Traje Medieval Vermelho G")

### RF03 — Cadastro de Locatários
- Campos obrigatórios: nome completo, CPF, telefone/WhatsApp, e-mail
- Tipo: Interno (funcionário/ator) ou Externo
- CPF validado (formato e dígito verificador)
- Termo de consentimento LGPD exibido e aceito no momento do cadastro
- Locatário pode ter múltiplas locações ao longo do tempo

### RF04 — Registro de Aluguel
- Operadora seleciona: locatário (busca por nome ou CPF) + figurino(s) + data de devolução prevista
- **Precificação fixa:** R$ 10,00 por peça (aluguel) + R$ 50,00 de caução (fixo, independente da quantidade)
- Sistema calcula e exibe automaticamente: subtotal das peças + caução = total a receber
- Caução fica retida até devolução; se figurino devolvido sem danos, caução é liberada
- Registro gera número de protocolo único
- Quantidade disponível decrementada automaticamente
- Impressão/exportação do comprovante em PDF (simples, com dados da locação)

### RF05 — Devolução de Figurino
- Operadora busca locação pelo protocolo ou nome do locatário
- Marca como devolvido + informa estado na devolução
- Se estado piorou (ex: Bom → Regular), campo de observação obrigatório
- Data/hora real da devolução registrada automaticamente
- Quantidade disponível incrementada

### RF06 — Painel Principal (Dashboard)
- Visão em três blocos coloridos:
  - 🟢 Disponíveis: total de figurinos com unidades livres
  - 🟡 Alugados: total de locações ativas
  - 🔴 Atrasados: locações com devolução vencida
- Lista das locações atrasadas com destaque visual e nome do locatário
- Atalho rápido: "Novo Aluguel" e "Registrar Devolução" sempre visíveis

### RF07 — Alertas de Vencimento
- Figurinos com devolução prevista para hoje destacados em amarelo
- Figurinos com devolução vencida (já passou da data) destacados em vermelho
- Não há envio de e-mail/SMS nesta versão (fora do escopo v1)

### RF08 — Histórico de Locações
- Por figurino: todas as locações passadas, com locatário, datas e estado na devolução
- Por locatário: todas as locações, com figurinos, datas e valores
- Busca por período, locatário ou figurino

### RF09 — Relatório de Período
- Operadora seleciona data início e fim
- Sistema retorna: total de locações, valor arrecadado, figurinos mais alugados, locatários mais frequentes
- Exportação em PDF

---

## 4. Requisitos Não Funcionais

### RNF01 — Acessibilidade e UX (PRIORIDADE MÁXIMA)
- Fonte mínima: 18px em todo o sistema
- Botões com ícone + texto descritivo (nunca só ícone)
- Nenhuma ação destrutiva sem confirmação em linguagem clara
- Mensagens de erro em português simples (ex: "CPF inválido — verifique os números digitados")
- Fluxo máximo de 3 passos para qualquer ação principal
- Compatível com toque (tablet) e mouse (desktop)
- Cores de status acessíveis (não depender só de cor — usar ícone também)
- WCAG 2.1 nível AA

### RNF02 — Responsividade
- Funciona em desktop (1280px+), tablet (768px+) e celular (320px+)
- Layout adaptado por breakpoint: menu colapsável em mobile, cards empilhados, botões em largura total

### RNF03 — Performance
- Carregamento do dashboard em < 2s
- Busca de locatário por CPF em < 500ms

### RNF04 — Segurança
- Autenticação obrigatória em todas as rotas
- HTTPS obrigatório em produção
- CPF armazenado com hash (não em texto puro)
- Sem exposição de dados PII em logs
- Audit trail de todas as operações com PII

### RNF05 — Auto-hospedagem
- Deploy em servidor próprio do teatro (Docker)
- Banco de dados PostgreSQL local
- Sem dependência de serviços cloud pagos

---

## 5. Inventário de Dados Pessoais (LGPD)

| Dado | Finalidade | Base Legal (LGPD art. 7º) | Retenção | Sensível? |
|---|---|---|---|---|
| Nome completo | Identificação do locatário | Execução de contrato (V) | 5 anos após última locação | Não |
| CPF | Identificação legal e prevenção de fraude | Execução de contrato (V) | 5 anos após última locação | Não |
| Telefone/WhatsApp | Contato para devolução | Execução de contrato (V) | 5 anos após última locação | Não |
| E-mail | Contato e envio de comprovante | Execução de contrato (V) | 5 anos após última locação | Não |

**Nenhum dado sensível** (art. 5º, II) é coletado nesta versão.  
**Titular tem direito a:** acesso, correção, portabilidade, exclusão (após quitação de débitos).

---

## 6. Fora do Escopo (v1)

- App nativo iOS/Android (o sistema web é responsivo, mas não é app de loja)
- Envio de SMS/e-mail automático
- Integração com sistema financeiro/contábil do teatro
- Controle de múltiplas sedes
- Portal de auto-serviço para locatários
- Pagamento online

---

## 7. Fatiamento Vertical — Kanban Cards

Cada card é uma fatia entregável de ponta a ponta.
Ordem de prioridade para implementação:

### Épico 1 — Fundação

| ID | Card | Critério de Aceite |
|---|---|---|
| VS01 | Setup Wasp + login da operadora | Operadora faz login e é redirecionada ao dashboard. Rota protegida sem login redireciona para /login. |
| VS02 | CRUD de figurinos | Operadora cadastra, edita, lista e desativa figurino. Listagem mostra quantidade disponível. |
| VS03 | CRUD de locatários + consentimento LGPD | Operadora cadastra locatário com todos os campos. CPF validado. Termo de consentimento exibido e aceito. |

### Épico 2 — Core do Negócio

| ID | Card | Critério de Aceite |
|---|---|---|
| VS04 | Registro de aluguel | Operadora seleciona locatário + figurino(s) + data devolução. Protocolo gerado. Quantidade decrementada. |
| VS05 | Devolução de figurino | Operadora registra devolução. Estado atualizado. Quantidade incrementada. Data real registrada. |
| VS06 | Dashboard com status em tempo real | Dashboard mostra blocos verde/amarelo/vermelho corretos. Locações atrasadas listadas. |

### Épico 3 — Gestão

| ID | Card | Critério de Aceite |
|---|---|---|
| VS07 | Alertas de vencimento | Figurinos com devolução hoje em amarelo, atrasados em vermelho. Visível no dashboard sem ação. |
| VS08 | Histórico por figurino e locatário | Operadora acessa histórico completo de qualquer figurino ou locatário com filtro por período. |
| VS09 | Relatório de período + exportação PDF | Relatório calculado corretamente. PDF gerado com dados do período selecionado. |

### Épico 4 — LGPD e Privacidade

| ID | Card | Critério de Aceite |
|---|---|---|
| VS10 | Portal de privacidade (acesso + exportação) | Operadora exporta dados de qualquer locatário em arquivo legível. Exclusão soft disponível. |
| VS11 | Expurgo automático por TTL | Job agendado exclui permanentemente locatários sem locação há 5+ anos. Log de expurgo gerado. |

---

## 8. Premissas e Decisões Arquiteturais

- CPF armazenado como hash (bcrypt) — busca por CPF usa comparação de hash
- Protocolo de locação: formato `AAAA-NNNNN` (ano + sequencial)
- Soft delete em figurinos e locatários (nunca exclusão física exceto expurgo TTL)
- Audit trail em tabela separada (`AuditLog`) para toda operação com PII
- Foto de figurino: armazenada localmente em `/uploads`, não em CDN externo
- Sem multi-tenancy na v1 (um teatro, um banco)

---

*Documento gerado em: {{data}}*  
*Próxima revisão obrigatória: ao iniciar Épico 3*

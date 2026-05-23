# PIA — Privacy Impact Assessment
## FigurinoApp · Sistema de Controle de Figurinos — Teatro Estadual

> Relatório de Impacto à Proteção de Dados Pessoais (RIPD), conforme art. 38 da
> Lei nº 13.709/2018 (LGPD). Documento vivo — revisar a cada mudança de schema
> que toque dado pessoal e ao iniciar o Épico 3 (PRD §7).

**Versão:** 1.0
**Data:** 2026-05-22
**Responsável pelo tratamento (Controlador):** Teatro Estadual
**Elaboração:** Equipe de desenvolvimento FigurinoApp
**Fonte de requisitos:** `docs/PRD.md` seção 5 · `CLAUDE.md` seções 6 e 7

---

## 1. Contexto e escopo do tratamento

O FigurinoApp digitaliza o controle de empréstimo e devolução de figurinos do
acervo do teatro. Para registrar uma locação é necessário identificar o
locatário (interno ou externo) e mantê-lo como contato para a devolução.

O tratamento de dados pessoais é **acessório** à finalidade central do sistema
(controle de acervo) e limita-se ao **cadastro de locatários** (RF03) e ao seu
uso nas locações (RF04, RF05, RF08).

**Titulares de dados:** locatários do acervo — funcionários/atores do teatro
(internos) e pessoas físicas externas.

**Volume estimado:** baixo. Operação de balcão único, sem multi-tenancy (v1).

**Decisão automatizada / profiling:** não há. Nenhum tratamento produz decisão
automatizada sobre o titular (art. 20 LGPD não aplicável).

**Transferência internacional:** não há. Auto-hospedagem em servidor próprio do
teatro, banco PostgreSQL local, sem dependência de serviço cloud (RNF05).

---

## 2. Inventário de dados pessoais tratados

Todos os campos abaixo são **dados pessoais comuns**. **Nenhum dado pessoal
sensível** (art. 5º, II LGPD) é coletado nesta versão. Nenhum dado de criança
ou adolescente é tratado como público-alvo (locatários são maiores capazes que
firmam contrato de locação).

| Campo | Categoria | Origem | Obrigatório | Sensível? |
|---|---|---|---|---|
| `nome` | Identificação | Informado pelo titular à operadora | Sim | Não |
| `cpf` (hash bcrypt) | Identificação legal | Informado pelo titular à operadora | Sim | Não |
| `telefone` | Contato | Informado pelo titular à operadora | Sim | Não |
| `email` | Contato | Informado pelo titular à operadora | Sim | Não |

Princípio da **minimização** (art. 6º, III): coletam-se apenas os quatro campos
acima, todos justificados no PRD. É vedado adicionar campos extras (endereço,
RG, data de nascimento etc.) sem atualização prévia do PRD e deste PIA.

---

## 3. Análise por campo

### 3.1 Nome completo (`nome`)

- **Finalidade específica:** identificar o locatário no cadastro, nas locações e
  no comprovante; permitir busca da locação pela operadora (RF04, RF05).
- **Base legal:** art. 7º, V — execução de contrato de locação do qual o titular
  é parte, e procedimentos preliminares a ele relacionados.
- **Necessidade/proporcionalidade:** indispensável. Não há como executar nem
  comprovar o contrato de locação sem identificar a parte contratante.
- **Retenção:** 5 anos após a última locação do titular. Expurgo automático
  via job agendado (card VS11).
- **Quem tem acesso:** exclusivamente a operadora do acervo, autenticada
  (RF01). Sem acesso público, sem acesso de terceiros.
- **Compartilhamento:** nenhum. Dado não sai do servidor do teatro.

### 3.2 CPF (`cpf` — armazenado como hash bcrypt)

- **Finalidade específica:** identificação legal inequívoca do locatário e
  prevenção de fraude (evitar locação a identidades duplicadas/falsas).
- **Base legal:** art. 7º, V — execução de contrato.
- **Necessidade/proporcionalidade:** necessário como identificador legal único
  do contratante. O dado é validado (formato + dígito verificador) no momento
  da coleta (RF03).
- **Medida de proteção diferenciada:** o CPF **nunca é armazenado em texto
  puro**. É persistido como **hash bcrypt** (ADR-001, CLAUDE.md §6). O valor em
  claro existe apenas transitoriamente em memória durante a validação e o
  hashing, e não pode aparecer em log de console ou terminal (CLAUDE.md §6).
- **Retenção:** 5 anos após a última locação. Expurgo via VS11.
- **Quem tem acesso:** operadora autenticada. Mesmo a operadora **não visualiza
  o CPF em claro** após o cadastro — o hash não é reversível.
- **Ponto de atenção técnico (ver §5):** o PRD prevê "busca por CPF usa
  comparação de hash". bcrypt usa *salt* aleatório por registro, portanto não é
  possível buscar comparando hashes diretamente; a verificação exige
  `bcrypt.compare` registro a registro. **Não migrar para hash sem salt
  (ex.: SHA-256 puro) para viabilizar busca** — isso reduziria a proteção e
  permitiria ataque de dicionário sobre o espaço finito de CPFs válidos.

### 3.3 Telefone / WhatsApp (`telefone`)

- **Finalidade específica:** canal de contato com o locatário para tratativas
  de devolução (cobrança amigável de figurino, alinhamento de prazo).
- **Base legal:** art. 7º, V — execução de contrato.
- **Necessidade/proporcionalidade:** necessário. É o canal primário de contato
  para a devolução, etapa essencial do contrato de locação.
- **Retenção:** 5 anos após a última locação. Expurgo via VS11.
- **Quem tem acesso:** operadora autenticada.
- **Restrição de uso:** o contato destina-se exclusivamente à execução do
  contrato. Não há, na v1, envio automático de SMS/WhatsApp e é vedado uso para
  marketing ou qualquer finalidade diversa da pactuada (princípio da finalidade,
  art. 6º, I).

### 3.4 E-mail (`email`)

- **Finalidade específica:** contato com o locatário e envio/entrega do
  comprovante de locação (RF04).
- **Base legal:** art. 7º, V — execução de contrato.
- **Necessidade/proporcionalidade:** necessário como canal de contato e de
  entrega de comprovante.
- **Retenção:** 5 anos após a última locação. Expurgo via VS11.
- **Quem tem acesso:** operadora autenticada.
- **Restrição de uso:** mesma do telefone — uso restrito à execução do
  contrato, vedado marketing.

---

## 4. Ciclo de vida do dado

| Fase | Tratamento | Controle aplicado |
|---|---|---|
| Coleta | Operadora cadastra o locatário (RF03) | Validação Zod na fronteira; CPF validado; termo de consentimento LGPD exibido e aceito |
| Armazenamento | PostgreSQL local | CPF como hash bcrypt; banco em servidor próprio do teatro |
| Uso | Locação, devolução, histórico, comprovante | Acesso só por operadora autenticada; cada operação com PII registrada em `AuditLog` |
| Atualização | Edição de cadastro pela operadora | Operação registrada em `AuditLog` |
| Portabilidade/acesso | Exportação dos dados do titular (VS10) | Arquivo legível; operação auditada |
| Exclusão lógica | Soft delete (`deletedAt`) — VS10 | Dado deixa de ser exibido; mantido para integridade de histórico de locações |
| Exclusão definitiva | Expurgo por TTL — VS11 | Job agendado remove fisicamente locatários sem locação há 5+ anos; gera log de expurgo |

**Observação sobre o "termo de consentimento" (RF03):** o sistema exibe e
registra a ciência do titular quanto ao tratamento. A base legal efetiva,
contudo, é a **execução de contrato** (art. 7º, V) — não o consentimento
(art. 7º, I). Por isso o titular **não pode revogar** o tratamento enquanto
houver contrato/débito em aberto; o aceite registrado serve como prova de
**transparência e informação ao titular** (art. 9º), não como base legal
autônoma. Recomenda-se nomear o artefato como "Aviso de Privacidade aceito"
em vez de "consentimento" para evitar ambiguidade jurídica.

---

## 5. Avaliação de risco por campo

Escala — **Probabilidade:** Baixa / Média / Alta · **Impacto ao titular:**
Baixo / Médio / Alto · **Risco residual** = combinação após as medidas
aplicadas.

| Campo | Ameaça principal | Probabilidade | Impacto | Risco residual |
|---|---|---|---|---|
| `nome` | Vazamento / acesso indevido; correlação com outros dados | Baixa | Baixo–Médio | **Baixo** |
| `cpf` (hash) | Vazamento da base; tentativa de reverter o hash | Baixa | Baixo | **Baixo** |
| `cpf` (em claro, transitório) | Exposição em log/terminal durante validação | Baixa | Alto | **Médio** |
| `telefone` | Vazamento → contato indesejado / spam | Baixa | Médio | **Baixo–Médio** |
| `email` | Vazamento → phishing / contato indesejado | Baixa | Médio | **Baixo–Médio** |

### 5.1 Justificativa dos riscos

- **`nome` — Baixo.** Dado de baixa criticidade isolado. Acesso restrito a uma
  operadora autenticada, sem superfície pública. Combinável com os demais
  campos, mas o conjunto inteiro está sob o mesmo controle de acesso.

- **`cpf` (hash) — Baixo.** O armazenamento como hash bcrypt (com salt e custo
  computacional) torna a reversão inviável na prática, mesmo em caso de
  vazamento integral da base. É a medida de mitigação mais relevante do
  sistema.

- **`cpf` (em claro, transitório) — Médio.** Embora o CPF nunca seja
  *persistido* em claro, ele transita em memória durante a validação. O risco é
  exposição acidental em log de aplicação, mensagem de erro ou stack trace. A
  mitigação (proibição de PII em log — CLAUDE.md §6) é **organizacional/de
  código** e depende de disciplina; por isso o risco residual não cai a Baixo.
  **Controle exigido:** revisão de código e SAST (Semgrep) devem barrar
  qualquer `console.log`/logger que receba o CPF; mensagens de erro de CPF
  inválido não devem ecoar o valor digitado.

- **`telefone` / `email` — Baixo–Médio.** Baixa probabilidade de vazamento
  (acesso restrito, sem exposição pública). Impacto Médio porque, se vazados,
  habilitam contato indesejado, spam e phishing direcionado. Risco aceitável
  após os controles da §6.

### 5.2 Risco transversal — busca por CPF

Conforme §3.2, viabilizar "busca por CPF" pode tentar a equipe a substituir o
hash bcrypt por um hash determinístico sem salt. Isso elevaria o risco do campo
`cpf` de Baixo para **Alto** (CPF tem espaço finito e validável → ataque de
dicionário trivial sobre a base vazada).

**Recomendação:** se a busca por CPF for requisito de desempenho (RNF03 prevê
busca < 500 ms), adotar um **índice cego** — HMAC-SHA256 do CPF com chave
secreta mantida apenas no servidor (variável de ambiente, fora do banco),
armazenado em coluna separada e indexada, **mantendo** o hash bcrypt como dado
de verificação. Assim a busca é O(1) sem expor a base a ataque de dicionário
caso o banco — mas não a chave — seja comprometido. Decisão a registrar em ADR
ao implementar o card VS03/VS04.

---

## 6. Medidas técnicas e organizacionais de proteção

### 6.1 Técnicas

- **Autenticação obrigatória** em todas as rotas que manipulam dados pessoais
  (RNF04); autenticação gerenciada pelo Wasp, sem JWT/sessão manual.
- **CPF como hash bcrypt** — nunca em texto puro (ADR-001).
- **HTTPS obrigatório** em produção (RNF04).
- **Validação de entrada com Zod** em toda fronteira — action, query e
  formulário (CLAUDE.md §7).
- **Audit trail** (`AuditLog`): toda operação de leitura/escrita de PII registra
  quem fez, o quê, quando e o IP (ADR-006).
- **Soft delete** (`deletedAt`) em `Locatario` — exclusão lógica preserva
  integridade do histórico de locações.
- **Expurgo automático por TTL** — job agendado elimina fisicamente locatários
  sem locação há 5+ anos, com log de expurgo (VS11).
- **Proibição de PII em log** — nenhum dado pessoal pode aparecer em log de
  console, terminal ou stack trace (CLAUDE.md §6); mensagens de erro em
  português claro, sem ecoar o dado sensível.
- **SAST contínuo** — Semgrep via hook a cada escrita; zero findings críticos
  para merge. Exposição de PII em log/resposta de API é vulnerabilidade
  **bloqueadora** (CLAUDE.md §7).
- **Sem secrets em código** — chaves e credenciais em variáveis de ambiente;
  `.env` nunca comitado.
- **Auto-hospedagem** — banco PostgreSQL local, sem transferência a terceiros
  nem a outro país.

### 6.2 Organizacionais

- Acesso restrito a uma única operadora autenticada; sem perfil público.
- Termo/aviso de privacidade exibido e aceite registrado no cadastro (RF03).
- Atendimento aos direitos do titular via Portal de Privacidade (VS10).
- Revisão obrigatória deste PIA a cada migration que toque PII (checklist
  CLAUDE.md §6) e ao iniciar o Épico 3.
- Geração/atualização do ROPA (`docs/lgpd/ROPA.md`) quando o schema mudar.

---

## 7. Direitos dos titulares (arts. 18 e 9º LGPD)

| Direito | Como é atendido |
|---|---|
| Informação / transparência | Aviso de privacidade exibido no cadastro (RF03) |
| Acesso aos dados | Portal de Privacidade exporta os dados do locatário (VS10) |
| Correção | Edição do cadastro pela operadora; operação auditada |
| Portabilidade | Exportação em arquivo legível (VS10) |
| Eliminação | Soft delete (VS10) + expurgo definitivo por TTL (VS11) |
| Confirmação de tratamento | Consulta ao cadastro/histórico pela operadora |

**Limite à eliminação:** a exclusão a pedido do titular fica condicionada à
inexistência de débito/locação em aberto e à guarda mínima exigida para
defesa de direitos em contrato (art. 16, I e II LGPD). Daí a política de
retenção de 5 anos após a última locação.

---

## 8. Riscos residuais e plano de ação

| # | Risco residual | Nível | Ação | Card / Momento |
|---|---|---|---|---|
| R1 | CPF em claro exposto em log durante validação | Médio | Regra Semgrep dedicada + revisão de código barrando logger com CPF; teste que verifica ausência de PII em log | VS03 |
| R2 | Migração indevida para hash de CPF sem salt para viabilizar busca | Alto (se ocorrer) | Adotar índice cego HMAC com chave em env; registrar em ADR | VS03 / VS04 |
| R3 | "Consentimento" tratado como base legal, gerando expectativa de revogação | Baixo–Médio | Renomear artefato para "Aviso de Privacidade"; base legal = execução de contrato | VS03 |
| R4 | Retenção não cumprida por falha do job de expurgo | Médio | Job VS11 com log de expurgo + monitoramento de execução | VS11 |
| R5 | Acesso indevido por credencial fraca da operadora | Baixo–Médio | Política de senha forte; sessão de 8h; HTTPS | VS01 |

---

## 9. Conclusão

O tratamento de dados pessoais do FigurinoApp é **proporcional e necessário** à
finalidade contratual, restrito a quatro campos comuns, sem dados sensíveis, sem
decisão automatizada e sem transferência internacional. Com as medidas técnicas
e organizacionais previstas — com destaque para o hash bcrypt do CPF, o
`AuditLog` e o expurgo por TTL — o **risco residual global é BAIXO**.

A aprovação fica condicionada à execução das ações R1 a R5 nos cards indicados.
Os itens R1 e R2 são os mais relevantes e devem ser revisados no gate de
fechamento do card VS03.

**Próxima revisão obrigatória:** ao iniciar o Épico 3 (PRD §7) ou a qualquer
migration que altere campo de PII (CLAUDE.md §6) — o que ocorrer primeiro.

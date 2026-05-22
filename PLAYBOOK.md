# Playbook de Vibe Coding — Passo a Passo para Novos Projetos

> Manual de bolso, stack-agnóstico, baseado no Framework Corporativo de Vibe Coding (v2).
> Use como referência ao iniciar qualquer projeto novo com Antigravity + Claude Code.

---

## Filosofia em uma página

Vibe Coding estruturado **não é** aceitar código gerado por IA sem revisão. É um método em que o engenheiro vira orquestrador e o agente vira executor, dentro de trilhos rígidos. Quatro princípios sustentam todo o resto:

1. **Vertical Slicing** — implementar uma feature inteira de ponta a ponta (banco → API → UI → teste) por vez, nunca camadas horizontais.
2. **TDAD (Test-Driven Agentic Development)** — Red → Green → Refactor obrigatório. Sem teste falhando antes, o agente não escreve código de produção.
3. **Framework Opinativo** — usar uma stack que tome decisões arquiteturais por você, reduzindo o espaço de "criatividade" do LLM (origem de alucinações).
4. **Context Engineering** — o `CLAUDE.md` é o contrato inegociável do agente. Atualizado a cada decisão arquitetural.

Tudo abaixo serve a esses quatro pilares.

---

## Parte 1 — Setup único (uma vez por máquina)

### 1.1 Proxy Antigravity → Claude Code

Roteia chamadas do Claude Code pelos limites gratuitos do Antigravity:

```bash
npm install -g antigravity-claude-proxy
antigravity-claude-proxy auth   # OAuth com conta Google corporativa
antigravity-claude-proxy start  # sobe servidor local
```

No shell rc (`~/.zshrc` ou `~/.bashrc`):
```bash
export ANTHROPIC_BASE_URL="http://localhost:<porta-do-proxy>"
```

Se tiver várias contas Google, encadeie todas — vira load balancer e dribla rate limit.

### 1.2 Servidores MCP essenciais

Configure no `~/.claude/mcp.json` (ou via `claude mcp add`):

| MCP | Função |
|---|---|
| `kanban-mcp` | Gerencia o Planka (Kanban auto-hospedado) |
| `github-mcp` | Cria branches, PRs, gerencia issues |
| `figma-mcp` | Lê tokens e layouts do Figma |
| `openapi-mcp` | Ingere `swagger.json` → ferramentas tipadas pro agente |
| `playwright-mcp` | Testes E2E em browser headless |
| `docker-mcp` | Containers descartáveis para sandbox de testes |
| `k6-mcp-server` | Testes de carga e stress |
| `semgrep-guardian` | SAST ativo via post-write hook |
| `sonarqube-mcp` | Análise de qualidade (code smells, dívida técnica) |

### 1.3 Claude Code Skills

Instale globalmente:
- **OWASP Skill** — molda o raciocínio do agente para o OWASP Top 10

### 1.4 LGPD Sentinel AI (auditor local)

Pré-requisito: Ollama instalado.

```bash
ollama pull llama3.1                    # ou equivalente do seu hardware
# Instale o LGPD Sentinel AI conforme docs do projeto
```

Esse cara roda **offline**. PII jamais sai da sua máquina. Gera ROPA automaticamente.

### 1.5 Infraestrutura local

Suba o Planka via Docker Compose (5 min). Opcionalmente, SonarQube local — mas se preferir, use a Community Edition em container.

### 1.6 Checagem final

```bash
claude mcp list           # deve listar todos os MCPs acima
docker ps                 # Planka rodando
ollama list               # llama3.1 presente
```

Se tudo verde, você não toca nesse setup nunca mais. Vai pra Parte 2 quando começar projeto novo.

---

## Parte 2 — Bootstrap de projeto novo

### 2.1 Escolher o framework opinativo

A regra é: **quanto mais opinativo, menos coisa no `CLAUDE.md`**. Tabela de equivalências:

| Sua stack | Framework opinativo equivalente |
|---|---|
| React + Node + Prisma | **Wasp** (DSL declarativa) |
| Next.js | App Router + shadcn/ui + Drizzle |
| Angular + Java | Spring Boot + Angular Schematics rígidos |
| Python web | **Django** (já é opinativo nativamente) |
| Ruby | **Rails** |
| PHP | **Laravel** + Inertia/Livewire |
| Go | Buffalo ou GoFrame |

Se sua stack não tem framework opinativo natural, você **compensa engrossando o `CLAUDE.md`** com decisões arquiteturais inegociáveis (estrutura de pastas, ORM, validação, gerenciamento de estado etc).

### 2.2 Estrutura mínima do repositório

```
meu-projeto/
├── CLAUDE.md                   # contrato do agente
├── README.md                   # docs humanos
├── docs/
│   ├── PRD.md                  # requisitos
│   ├── decisions/              # ADRs (Architecture Decision Records)
│   ├── api/
│   │   └── swagger.json        # se houver API
│   └── lgpd/
│       ├── ROPA.md             # gerado pelo Sentinel
│       └── PIA.md              # se houver PII
├── tests/
│   ├── e2e/                    # Playwright
│   ├── unit/
│   └── load/                   # k6
├── docker-compose.test.yml     # sandbox de testes
└── (resto do seu framework)
```

### 2.3 Criar o `CLAUDE.md` base

Esse arquivo merece tratamento separado. Modelo a seguir em documento próprio. Princípio: descreve **stack, regras invioláveis, comandos do projeto e disciplina TDAD**.

### 2.4 Inicializar Planka e GitHub

No Claude Code:
> "Use o GitHub MCP pra criar repo `meu-projeto` privado e o kanban-mcp pra criar um board no Planka com o mesmo nome. Sincronize labels básicos: backlog, ready, in-progress, review, done."

---

## Parte 3 — Elicitação e Planejamento

### 3.1 Geração colaborativa do PRD

Prompt no Antigravity (sessão nova):

```
Vamos construir o PRD do projeto [nome].

Objetivo: [descrição em 2-3 linhas].

Faça perguntas até desambiguar:
- Requisitos funcionais (lista de features)
- Requisitos não-funcionais (performance, escalabilidade)
- Dados pessoais envolvidos (para análise LGPD)
- Critérios de aceite por feature
- Restrições técnicas conhecidas

Quando estiver completo, salve em docs/PRD.md.
Não comece a implementar nada.
```

**Não pule.** PRD ambíguo gera código alucinado.

### 3.2 PIA/DPIA se houver dados pessoais

Se o PRD identificou PII (CPF, e-mail, endereço, dados sensíveis):

```
Gere docs/lgpd/PIA.md (Privacy Impact Assessment) cobrindo:
- Quais dados pessoais serão tratados
- Base legal (art. 7º LGPD)
- Finalidade específica
- Período de retenção
- Quem terá acesso
- Medidas técnicas de proteção
- Avaliação de risco de cada tratamento
```

### 3.3 Fatiamento em Kanban automatizado

```
Leia docs/PRD.md. Use o kanban-mcp para criar épicos e cards no Planka.

Cada card deve:
- Ser uma fatia vertical (entregável de ponta a ponta)
- Ter critérios de aceite explícitos
- Ter estimativa de complexidade (P/M/G)
- Identificar se toca PII (label "lgpd")

Não crie cards de "criar banco de dados" ou "fazer frontend" isolados.
Cada card = uma feature do ponto de vista do usuário.
```

---

## Parte 4 — Por Card: Ciclo TDAD

A regra de ouro: **nenhum código de produção é escrito sem teste falhando antes**.

### 4.1 Selecionar o card

```
Use kanban-mcp pra pegar o próximo card "ready" do Planka. 
Leia critérios de aceite. Crie branch via github-mcp: 
feature/[id-card]-[slug-curto]
```

### 4.2 RED — Teste primeiro

```
Para o card [ID]:
1. Escreva o teste E2E (Playwright MCP) que valida o critério de aceite
2. Rode o teste e me mostre a falha
3. PARE. Não implemente nada ainda. Aguarde minha confirmação.
```

Você (humano) lê o teste. Confirma se reflete o que quer. **Esse é o gate humano mais importante.**

### 4.3 GREEN — Implementação mínima

```
Implemente o mínimo necessário para o teste passar. 
Ordem: schema → backend → frontend → integração.
Proibido adicionar código não exercitado por teste.
Proibido "já que estou aqui, vou adicionar X".
```

### 4.4 REFACTOR — Limpeza com rede

```
Com a suite verde, refatore:
- Extrair funções repetidas
- Renomear variáveis ambíguas
- Remover comentários óbvios
Rode a suite a cada mudança. Suite verde no fim. Sempre.
```

### 4.5 Gate de fechamento do card

```
Pra encerrar o card [ID]:
1. docker-mcp: sobe ambiente limpo
2. Rode suite completa no container
3. playwright-mcp: valida fluxos E2E
4. k6-mcp: se for rota crítica, 50 VUs/30s
5. semgrep-guardian: zero findings críticos
6. sonarqube-mcp: nenhum code smell novo de severidade ≥ major
7. lgpd-sentinel: se schema mudou, regenera ROPA
8. github-mcp: abre PR com checklist preenchido
9. Atualiza CLAUDE.md se houve decisão arquitetural
10. Cria docs/decisions/ADR-NNN.md se mudança não-trivial
11. Move card pra "review" no Planka
```

Se qualquer item falhar, o card volta pra "in-progress". Não negociável.

---

## Parte 5 — Manutenção da memória do projeto

Ao fim de cada sessão produtiva ou ao fechar épico:

```
Sintetize as decisões arquiteturais desta sessão.
- Atualize a seção "Decisões inegociáveis" do CLAUDE.md
- Crie/atualize ADRs em docs/decisions/
- Se descobriu nova convenção, documente nos exemplos do CLAUDE.md
```

A janela de contexto do LLM esgota. Sua documentação não.

---

## Parte 6 — Checklists rápidos

### LGPD / Privacy by Design (cole no PR)

- [ ] Todo campo do schema tem justificativa de coleta (minimização)
- [ ] PII sensível criptografada em repouso
- [ ] TTL/expurgo automático configurado (cron/job)
- [ ] Endpoint de exportação DSAR previsto
- [ ] Soft delete + hard delete agendado
- [ ] Audit trail em leitura/escrita de PII
- [ ] LGPD Sentinel scan limpo
- [ ] ROPA atualizado

### Segurança ativa (gate do agente)

- [ ] Semgrep Guardian: zero findings críticos
- [ ] SonarQube: nenhum novo code smell ≥ major
- [ ] OWASP Skill aplicada (sem alertas no raciocínio)
- [ ] Sem secrets em código (env vars + .env.example)
- [ ] Validação de entrada em toda fronteira (API, form, env)

### Performance (rotas críticas)

- [ ] k6 teste de carga com 50 VUs/30s passou
- [ ] P95 abaixo do SLA definido no PRD
- [ ] Queries N+1 verificadas (ORM logs)
- [ ] Índices conferidos no schema

---

## Anexo A — Quando usar cada MCP

| Cenário | MCP a invocar |
|---|---|
| "Criar card no quadro" | kanban-mcp |
| "Abrir PR / criar branch / comentar issue" | github-mcp |
| "Converter design X em componente" | figma-mcp |
| "Consumir API documentada em swagger" | openapi-mcp |
| "Validar fluxo de login na UI" | playwright-mcp |
| "Rodar teste em ambiente isolado" | docker-mcp |
| "Estressar endpoint" | k6-mcp |
| "Buscar vulnerabilidade nesse arquivo" | semgrep-guardian (já no hook) |
| "Avaliar qualidade do módulo X" | sonarqube-mcp |
| "Auditar conformidade LGPD" | lgpd-sentinel (CLI local) |

---

## Anexo B — Anti-padrões a evitar

| Anti-padrão | Por quê é ruim |
|---|---|
| "Cria o CRUD inteiro de uma vez" | Quebra vertical slicing, estoura contexto |
| Aceitar código sem rodar Playwright | Aceita o "caminho feliz" alucinado |
| `CLAUDE.md` genérico copiado de outro projeto | Perde a especificidade que reduz alucinação |
| Pular o PRD porque "é projeto pequeno" | Garante retrabalho 3x maior |
| Permitir agente instalar libs sem confirmar | Acúmulo de dependências fantasma |
| Usar Semgrep só no CI (não no hook) | Vulnerabilidade chega no repo antes de barrar |
| LGPD Sentinel só rodado no fim | Schema vira pesadelo retroativo |

---

## Anexo C — Quando algo dá errado

**Agente "esquece" a regra do TDAD:** repreenda diretamente no chat e cite a seção do CLAUDE.md. Se reincidente, refine a regra (deixe mais explícita, dê exemplo de violação).

**Semgrep bloqueando excessivamente:** revise se a regra faz sentido pro projeto. Customize `.semgrep.yml`. Não desabilite globalmente.

**Contexto da sessão saturado:** abra sessão nova, peça pra ler `CLAUDE.md` + ADRs relevantes antes de retomar.

**Card travado em "in-progress" há dias:** quebre em sub-cards. Vertical slicing exige cards pequenos. Se demora >1 dia, ele é grande demais.

**PR enorme:** sinal de violação do vertical slicing. Não merge. Quebre em PRs menores. Vibe Coding sem disciplina vira vibe debt.

---

## Resumo do ciclo, em uma frase

> Setup uma vez. Em todo projeto: framework opinativo + PRD + Kanban + ciclo TDAD por card + gate triplo (Docker/SAST/LGPD) + memória persistente. O agente codifica. Você arquiteta e revisa.

# CLAUDE.md — FigurinoApp
## Contrato inegociável do agente de IA

> Este arquivo é lido pelo agente a cada sessão. Toda decisão arquitetural tomada
> deve ser registrada aqui. Sem atualização deste arquivo, a decisão não existe.

---

## 1. Identidade do projeto

**Nome:** FigurinoApp  
**Domínio:** Controle de estoque e aluguel de figurinos — Teatro Estadual  
**Stack:** Wasp 0.x · React · Node.js · Prisma · PostgreSQL · Tailwind CSS · shadcn/ui  
**Repositório:** github.com/[org]/figurinoapp  
**PRD:** docs/PRD.md — leia antes de qualquer implementação  
**ADRs:** docs/decisions/ — leia os relevantes ao card atual  

---

## 2. Comandos do projeto

```bash
wasp start              # inicia dev server (frontend + backend juntos)
wasp db migrate-dev     # aplica migrations após mudança no schema.prisma
wasp db studio          # abre Prisma Studio (inspeção visual do banco)
wasp test               # roda suite de testes
wasp build              # gera build de produção
docker compose up -d    # sobe PostgreSQL local (obrigatório antes do wasp start)
```

Gerenciador de pacotes: **npm**. Nunca usar yarn ou pnpm neste projeto.

---

## 3. Arquitetura — regras invioláveis

### 3.1 Framework
- **Nunca** substituir Wasp por Next.js, Remix ou qualquer outro framework sem aprovação humana explícita
- Toda rota nova deve ser declarada em `main.wasp` antes de criar os arquivos
- Toda `action` e `query` deve ser declarada em `main.wasp` com suas `entities`
- Autenticação é gerenciada pelo Wasp — nunca implementar JWT ou sessão manualmente

### 3.2 Estrutura de arquivos
```
src/
  client/
    pages/          # componentes de página (um por rota)
    components/     # componentes reutilizáveis
    hooks/          # custom hooks
  server/
    actions/        # arquivos de actions (escrita)
    queries/        # arquivos de queries (leitura)
    lib/            # lógica de negócio pura (sem Prisma diretamente)
schema.prisma       # fonte da verdade do banco — nunca editar SQL diretamente
main.wasp           # fonte da verdade da aplicação
```

### 3.3 Dependências
- **Nunca** instalar biblioteca nova sem perguntar ao humano primeiro
- Bibliotecas aprovadas já no projeto: Tailwind CSS, shadcn/ui, zod, date-fns
- Validação de entrada: sempre Zod, em toda fronteira (action, query, formulário)
- Componentes UI: sempre shadcn/ui antes de criar componente custom

### 3.4 Banco de dados
- Toda alteração de schema exige migration (`wasp db migrate-dev`)
- **Nunca** usar `db push` em produção
- Soft delete obrigatório: toda entidade principal tem campo `deletedAt DateTime?`
- Hard delete proibido nas entidades: `User`, `Locatario`, `Locacao`, `AuditLog`

---

## 4. Disciplina TDAD — Test-Driven Agentic Development

Esta é a regra mais importante do projeto. Sem exceção.

```
ORDEM OBRIGATÓRIA POR CARD:

1. RED   → escrever o teste que falha (Playwright para E2E, vitest para unit)
2.        → mostrar a saída de falha ao humano e aguardar confirmação
3. GREEN  → implementar o mínimo para o teste passar
4.          → proibido escrever código não exercitado por algum teste
5. REFACTOR → limpar com suite verde
6.            → suite deve estar verde ao finalizar

Se sentir vontade de implementar antes do teste: PARE. Pergunte.
```

Quando o humano confirmar o teste (etapa 2), registre no card do Planka que o RED foi aprovado antes de prosseguir.

---

## 5. UX — regras específicas para a operadora

A usuária principal tem baixa familiaridade com tecnologia. Estas regras são tão importantes quanto a lógica de negócio:

- Fonte mínima: **18px** em todo texto visível ao usuário final
- Todo botão de ação tem: **ícone (Tabler outline) + texto descritivo**. Nunca só ícone
- Nenhuma ação destrutiva sem modal de confirmação com linguagem simples
- Mensagens de erro em português claro: nunca expor stack trace, código de erro ou termo técnico
  - ❌ "Error 422: Unprocessable Entity"
  - ✅ "CPF inválido — verifique os números digitados"
- Fluxo máximo de **3 passos** para qualquer ação principal
- Cores de status sempre acompanhadas de ícone (não depender só de cor)
- Responsivo: funciona em desktop (1280px+), tablet (768px+) e celular (320px+)

---

## 6. LGPD e Privacy by Design

Todo card que toca dado pessoal (nome, CPF, telefone, e-mail) deve:

- [ ] Aplicar minimização: coletar só o definido no PRD, sem campos extras
- [ ] CPF: armazenar como hash bcrypt — nunca em texto puro
- [ ] Registrar operação no `AuditLog` (quem fez, o quê, quando, IP)
- [ ] Garantir que dado não aparece em log de console ou terminal
- [ ] Verificar se soft delete está implementado para a entidade

Campos de PII no projeto: `nome`, `cpf` (hash), `telefone`, `email`  
Retenção: 5 anos após última locação (expurgo via job agendado — ver VS11)

Checklist obrigatório antes de qualquer migration que toque PII:
- [ ] Necessidade do campo está documentada no PRD
- [ ] Base legal está definida (execução de contrato, art. 7º V LGPD)
- [ ] Campo tem TTL ou política de expurgo definida
- [ ] AuditLog cobre operações neste campo

---

## 7. Segurança

- Semgrep roda via MCP a cada escrita — não desabilitar, não ignorar warnings
- Zero findings críticos aceitos no merge
- SonarQube MCP invocado ao fechar cada card para análise de qualidade
- Nenhuma secret, token ou senha em código — usar variáveis de ambiente
- Arquivo `.env` nunca comitado — apenas `.env.example` com valores fictícios
- Validação de entrada com Zod em toda fronteira (action, query, form)
- Nunca confiar em dados vindos do cliente sem revalidar no servidor

Vulnerabilidades bloqueadoras (impedem merge):
- SQL injection / prompt injection
- Exposição de PII em logs ou respostas de API
- Ausência de autenticação em rota que manipula dados
- Secret hardcoded em qualquer arquivo

---

## 8. Workflow Git

```
main          → produção — nunca commitar diretamente
dev           → integração — PRs mergeados aqui
feature/VS0X  → uma branch por card
```

Fluxo por card:
1. `git checkout -b feature/VS0X-slug-curto`
2. Ciclo TDAD completo
3. Gate de fechamento aprovado (testes + semgrep + sonarqube)
4. PR aberto via GitHub MCP com checklist preenchido
5. Merge somente após revisão humana

Mensagens de commit seguem Conventional Commits:
```
feat(figurinos): adicionar cadastro com categoria e tamanho
fix(locacao): corrigir cálculo de caução para múltiplas peças
test(e2e): adicionar teste de fluxo de devolução
```

---

## 9. Engenharia de contexto — disclosure progressivo

Para preservar a janela de contexto entre sessões:

- Leia `CLAUDE.md` completo ao iniciar qualquer sessão
- Leia apenas os ADRs relevantes ao card atual (não todos)
- Leia apenas os arquivos diretamente relacionados à tarefa
- Nunca sumarizar ou comprimir o `CLAUDE.md` — ele é a fonte de verdade
- Nunca refatorar arquivos fora do escopo do card atual
- Se o contexto estiver saturando, avise o humano antes de continuar

Ao encerrar cada card, registre em `docs/decisions/ADR-NNN.md`:
```markdown
# ADR-NNN: [título da decisão]
**Data:** YYYY-MM-DD
**Card:** VS0X
**Decisão:** [o que foi decidido]
**Motivo:** [por que foi decidido assim]
**Consequências:** [o que muda no projeto]
```

---

## 10. Decisões arquiteturais registradas

| ADR | Decisão | Card |
|---|---|---|
| ADR-001 | CPF armazenado como hash bcrypt, nunca texto puro | VS03 |
| ADR-002 | Soft delete em todas entidades principais | Fundação |
| ADR-003 | Protocolo de locação no formato AAAA-NNNNN | VS04 |
| ADR-004 | Fonte mínima 18px em todo o sistema | Fundação |
| ADR-005 | Caução fixa R$50,00 + R$10,00/peça calculado no servidor | VS04 |
| ADR-006 | AuditLog separado para toda operação com PII | VS03 |
| ADR-007 | `usernameAndPassword` em vez de `email` para login da operadora | VS01 |

*Atualize esta tabela a cada nova decisão tomada durante o desenvolvimento.*

---

## 11. Referências rápidas

- PRD completo: `docs/PRD.md`
- Cards do projeto: Planka board "FigurinoApp"
- Decisões arquiteturais: `docs/decisions/`
- LGPD — inventário de dados: seção 5 do PRD
- Checklist de fechamento de card: seção 4.5 do Playbook
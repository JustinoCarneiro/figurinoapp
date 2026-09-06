# Figurinos TJA — Contrato canônico de trabalho

## Objetivo

Sistema web multiusuário para gerir acervo, locações e caução do figurino do
Teatro José de Alencar (Fortaleza/CE). Escopo MVP: fluxo central de ponta a
ponta. Metodologia OndaDev — versão em `ONDA_VERSION`.

## Mapa do repositório

| Caminho | Finalidade |
| --- | --- |
| `CLAUDE.md` | Espec Viva: stack, perfil, princípios não-funcionais, épicos, máquina de estados da locação, convenções. |
| `spec.md` | Histórias de usuário completas e critérios de aceite (Fase 1). |
| `ROADMAP.md` | Blueprint técnico e ordem de entrega. |
| `design/` | Identidade visual e telas (Fase 2). |
| `src/` | Protótipo/telas (JSX + HTML) enquanto o backend não é construído. |
| `HANDOFF.md` (em `src/`) | Anotações de transferência da fase de design. |
| `.ondadev/` | Protocolo de failover de cota e template de handoff entre agentes. |
| `.agents/`, `.claude/` | Skills OndaDev dos agentes (nunca edite os destinos; a fonte é o `onda-starter`). |
| `.github/workflows/` | CI de secret scanning (gitleaks nos commits do PR). |

## Autoridade da informação

| Assunto | Fonte canônica | Papel das demais fontes |
| --- | --- | --- |
| Escopo, histórias e aceite | `CLAUDE.md` + `spec.md` | GitHub apenas reflete o trabalho. |
| Ordem técnica e progresso | `ROADMAP.md` | — |
| Decisão de arquitetura | `ROADMAP.md` + histórico Git | — |
| Código e histórico versionado | Git | GitHub registra PRs, revisão e CI. |

## Comandos verificados

```bash
# Protótipo estático (sem build): abrir src/index.html no navegador
# ou servir a pasta: python3 -m http.server 8000

# Checkpoint de handoff entre agentes (só metadados seguros)
bash scripts/ai-checkpoint.sh --stdout
```

O backend (Spring Boot · Postgres · Docker, ver `CLAUDE.md`) ainda não foi
construído; quando existir, registre aqui `mvn`, `docker compose` e a suíte de
testes reais. Não invente comandos.

## Fronteiras e convenções

- **Diretiva Primária (Fase 4):** não altere a sintaxe ou o comportamento de
  código existente sem um teste que justifique a quebra (ciclo TDD).
- **UX pautada pela figurinista** (sem proficiência técnica): botões grandes,
  fluxo linear, no máximo 3 cliques por operação comum. A UX da administração
  pode ser densa.
- **Aluguel ≠ caução** — nunca somar; aluguel é receita, caução é garantia.
- **Decisão humana sempre que envolve dinheiro retido** — o sistema sugere, o
  humano decide.
- **Estado ao vivo entre salas** — figurinista e administração veem o mesmo
  estado em tempo real.
- API REST `/api/v1`, JSON, erros padronizados.
- Preserve a separação spec → roadmap → ADR → código.
- Documentação em português claro; nomes técnicos no idioma da tecnologia.

## Segurança e classes de risco

Dado de documento do locatário é **sensível (LGPD)**. Nunca versione, exiba em
log ou cole em prompt: documentos/PII de locatários, credenciais de banco,
tokens ou `.env` real. Use `.env` local e exemplos sem segredos.

| Nível | Exemplos | Regra |
| --- | --- | --- |
| R0 | Leitura, docs, protótipo, testes locais | Executar e validar normalmente. |
| R1 | Código, dependência, schema, CI, configuração compartilhada | Declarar impacto, testar e pedir revisão de diff. |
| R2 | Produção, retenção/estorno de caução, PII de locatário, credenciais, deploy, exclusão | Exigir autorização explícita e alvo confirmado. |

A fronteira exata das classes de risco segue o `AGENTS.md` do `onda-starter`.

## Definition of Done

1. atende a uma história de `spec.md` com critérios verificáveis;
2. executa os testes e validações que existem, reportando o resultado;
3. atualiza `CLAUDE.md`, `spec.md` ou `ROADMAP.md` quando o contrato mudou;
4. não introduz segredo, credencial ou PII de locatário no repositório;
5. passa por revisão proporcional ao risco e deixa um diff compreensível;
6. registra handoff com mudanças, validações, decisões, riscos e pendências.

Não afirme que testes, CI, deploy ou sincronização passaram sem evidência.

## Revisão e handoff entre agentes

Claude e Codex seguem este arquivo como núcleo comum. Um autor por PR; o outro
revisa o diff quando o risco (R1/R2) exige. Quando a cota de um agente acaba, o
outro assume por handoff — protocolo na metodologia OndaDev 3.0 (`ONDA_VERSION`),
com `scripts/ai-checkpoint.sh` preenchendo `.ondadev/handoff/current.md`.

Síntese de handoff:

```text
Escopo: …
Mudanças: …
Validações executadas e resultado: …
Decisões/ADRs: …
Riscos, bloqueios e próximos passos: …
```

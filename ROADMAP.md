# ROADMAP — Blueprint Técnico · Sistema de Figurinos TJA

> Gerado na **Fase 3 (Blueprint)** da metodologia Onda-Dev · 2026-06-19.
> Insumos: `CLAUDE.md`, `spec.md`, `src/HANDOFF.md`, `design/tokens.css`.
> Artefato de referência para a Fase 4 (Implementação). Não alterar sem re-validar rastreabilidade.

---

## Status das Fases

| Fase | Descrição | Status | Artefato |
|------|-----------|--------|----------|
| 1 | Spec Viva | ✅ Concluído | `spec.md` |
| 2a | Identidade Visual | ✅ Concluído | `design/tokens.css` + `design/DESIGN.md` |
| 2b | Protótipo de Layout | ✅ Concluído | `src/Figurinos TJA.html` + `src/HANDOFF.md` |
| **3** | **Blueprint Técnico** | **✅ Este documento** | `ROADMAP.md` |
| 4 | Implementação | 🔜 A iniciar | módulos M01–M08 |
| 5 | Homologação & Deploy | 🔜 A iniciar | CI/CD + checklist |

---

## 1. Modelo de Dados

### Diagrama Entidade-Relacionamento

```
┌──────────────┐       ┌───────────────────┐       ┌──────────────┐
│   usuario    │       │     locacao        │       │  locatario   │
│──────────────│       │───────────────────│       │──────────────│
│ id (PK)      │◄──────│ criado_por (FK)   │──────►│ id (PK)      │
│ nome         │◄──────│ confirmado_por(FK)│       │ nome         │
│ login UNIQUE │◄──────│ conferida_por(FK) │       │ cpf UNIQUE   │
│ senha_hash   │       │ locatario_id (FK) │       │ telefone     │
│ perfil ENUM  │       │ status ENUM       │       │ email        │
│ ativo        │       │ data_prev_devoluc │       │ criado_em    │
│ criado_em    │       │ valor_aluguel     │       └──────────────┘
└──────────────┘       │ caucao (50.00)    │
                       │ aluguel_pago_em   │       ┌──────────────────────┐
                       │ caucao_recebida_em│       │  movimentacao_caucao │
                       │ devolucao_em      │       │──────────────────────│
                       │ criado_em         │◄──────│ locacao_id (FK UNIQ) │
                       │ atualizado_em     │       │ tipo ENUM            │
                       └─────────┬─────────┘       │ motivo TEXT          │
                                 │ 1:N              │ decidido_por (FK)    │
                       ┌─────────▼─────────┐       │ decidido_em          │
                       │   item_locacao    │       └──────────────────────┘
                       │───────────────────│
                       │ id (PK)           │       ┌──────────────────┐
                       │ locacao_id (FK)   │       │    peca          │
                       │ peca_id (FK)      │──────►│──────────────────│
                       │ status_devolucao  │       │ id (PK)          │
                       │ observacao TEXT   │       │ nome             │
                       └───────────────────┘       │ categoria        │
                                                   │ tamanho          │
┌────────────────────┐                             │ cor              │
│   configuracao     │                             │ material         │
│────────────────────│                             │ estado_conservac │
│ chave VARCHAR (PK) │                             │ localizacao      │
│ valor VARCHAR      │                             │ status ENUM      │
└────────────────────┘                             │ foto_url         │
                                                   │ criado_em        │
                                                   │ atualizado_em    │
                                                   └──────────────────┘
```

### Enumerações

| Enum | Valores |
|------|---------|
| `usuario.perfil` | `FIGURINISTA`, `ADMIN` |
| `peca.status` | `DISPONIVEL`, `EM_USO`, `EM_MANUTENCAO`, `NAO_DEVOLVIDA` |
| `locacao.status` | `AGUARDANDO_PAGAMENTO`, `EM_USO`, `AGUARDANDO_DEVOLUCAO_CAUCAO`, `CAUCAO_RETIDA`, `FINALIZADA` |
| `item_locacao.status_devolucao` | `OK`, `DANIFICADA`, `NAO_DEVOLVIDA` |
| `movimentacao_caucao.tipo` | `DEVOLVIDA`, `RETIDA` |

### Notas de Modelagem

- **CPF**: armazenar criptografado (AES-256) — dado sensível LGPD. Índice UNIQUE sobre hash separado para detecção de duplicidade sem expor o dado.
- **valor_aluguel** na locação: snapshot do valor vigente no momento da criação (preserva histórico se admin alterar a config futuramente).
- **caucao**: R$ 50,00 fixos — coluna na tabela para rastreabilidade, mesmo sendo constante no MVP.
- **configuracao**: chave `VALOR_ALUGUEL_POR_PECA` com valor inicial a definir com o cliente. Editável só por `ADMIN`.
- **foto_url**: caminho relativo ao volume Docker (`/uploads/pecas/{id}.jpg`). Upgrade para S3 é uma troca de implementação do `StorageService`, sem mudança de modelo.

---

## 2. Módulos e Pesos

| # | Módulo | Peso | Dias | Responsável |
|---|--------|------|------|-------------|
| M01 | Fundação (Spring Boot + Docker + CI skeleton) | Pequeno | 2d | Backend |
| M02 | Autenticação & Perfis | Pequeno | 2d | Full-stack |
| M03 | Acervo de Peças (CRUD + foto + busca) | Médio | 4d | Full-stack |
| M04 | Cadastro de Locatários | Pequeno | 2d | Full-stack |
| M05 | Locação — Fluxo de Saída | **Grande** | 5d | Full-stack |
| M06 | Devolução & Decisão de Caução | Médio | 4d | Full-stack |
| M07 | Relatórios em Tela | Pequeno | 2d | Full-stack |
| M08 | CI/CD & Hardening de Produção | Pequeno | 1d | DevOps |
| — | **Soma** | — | **22d** | — |

### Descrição de Cada Módulo

#### M01 · Fundação `2d`
- `docker-compose.yml`: serviços `app` (Spring Boot) + `db` (Postgres 16) + `uploads` (volume)
- `application.yml`: profiles `dev` / `prod`, datasource, CORS, error handler global
- Migração inicial Flyway: tabelas do modelo de dados
- GitHub Actions: pipeline build + test (sem deploy ainda)
- Health-check: `GET /api/v1/health → { status: "UP" }`

#### M02 · Autenticação & Perfis `2d`
- Spring Security + JWT (httpOnly cookie, expiração 8h)
- `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`
- Seed de usuários iniciais (figurinista + admin) via Flyway
- Frontend: tela Login (`screens/Login.jsx` → produção)
- Guard de rota por perfil (`/inicio` → FIGURINISTA, `/painel` → ADMIN)

#### M03 · Acervo de Peças `4d`
- CRUD completo de `peca` com upload de foto (multipart)
- Busca textual (`nome ILIKE`) + filtro por `status` — índice GIN no campo nome
- Bloqueio de edição de `localizacao` quando `status = EM_USO` (validação no service)
- Frontend: Acervo + CadastroPeca (criação e edição)

#### M04 · Cadastro de Locatários `2d`
- CRUD de `locatario` com CPF criptografado + hash para unicidade
- Detecção de duplicidade por CPF: retorna cadastro existente com HTTP 200
- Validação de dígitos verificadores do CPF no backend
- Frontend: CadastroLocatario

#### M05 · Locação — Fluxo de Saída `5d` ⚠️ _módulo de maior risco_
- Criar locação: valida peças `DISPONIVEL`, transição atômica de estados, snapshot de `valor_aluguel`
- Confirmar pagamento (ADMIN): valida locação `AGUARDANDO_PAGAMENTO`, transição peças para `EM_USO`
- Listagem por status com paginação
- Config de valor de aluguel: `GET/PUT /api/v1/config/valor-aluguel` (ADMIN)
- Frontend: NovaLocacao (wizard 3 passos) + PagamentosPendentes
- **Risco**: transações concorrentes (duas figurinistas adicionando a mesma peça). Mitigação: `SELECT FOR UPDATE` na peça dentro da transação de criação.

#### M06 · Devolução & Decisão de Caução `4d`
- Registrar devolução (FIGURINISTA): item por item, estado de cada peça, transição locação → `AGUARDANDO_DEVOLUCAO_CAUCAO`
- Decidir caução (ADMIN): `DEVOLVER` ou `RETER` (motivo obrigatório ao reter), registra `movimentacao_caucao`, finaliza locação
- Atualização de status das peças na devolução: `OK→DISPONIVEL`, `DANIFICADA→EM_MANUTENCAO`, `NAO_DEVOLVIDA→NAO_DEVOLVIDA`
- Frontend: RegistrarDevolucao + DevolucaoCaucao

#### M07 · Relatórios em Tela `2d`
- Receita do mês: soma `valor_aluguel` de locações `FINALIZADA` ou `CAUCAO_RETIDA` no período; **caução excluída**
- Peças fora: join `peca` × `item_locacao` onde peça.status ≠ `DISPONIVEL`, com dias de atraso calculados
- Frontend: RelatorioReceita + RelatorioPecasFora

#### M08 · CI/CD & Hardening `1d`
- GitHub Actions: build + testes → Docker build → push registry → deploy (VPS ou Railway)
- Variáveis de ambiente no deploy: `DB_URL`, `JWT_SECRET`, `UPLOADS_PATH`
- HTTPS via reverse proxy (Caddy ou nginx)
- Seed de produção: apenas admin inicial (senha temporária)

---

## 3. Contratos API-First

Base: `https://<host>/api/v1`. Autenticação: cookie `jwt` httpOnly em todas as rotas exceto `/auth/login`.
Erros padronizados: `{ "codigo": "PECA_NAO_DISPONIVEL", "mensagem": "..." }`.

### Auth

```
POST /auth/login
  Body:    { "login": "string", "senha": "string" }
  200:     { "perfil": "FIGURINISTA|ADMIN", "nome": "string" }
           + Set-Cookie: jwt=...; HttpOnly; SameSite=Strict
  401:     { "codigo": "CREDENCIAIS_INVALIDAS", "mensagem": "Usuário ou senha incorretos" }

POST /auth/logout
  200:     {} + limpa cookie

GET  /auth/me
  200:     { "id": 1, "nome": "string", "perfil": "FIGURINISTA|ADMIN" }
```

### Peças

```
GET  /pecas?q=string&status=DISPONIVEL&page=0&size=20
  200:     { "content": [PecaResumo], "totalElements": 150, "totalPages": 8 }

PecaResumo: { "id", "nome", "categoria", "tamanho", "status", "fotoUrl" }

POST /pecas                          (multipart/form-data)
  Fields:  nome*, categoria*, tamanho, cor, material, estadoConservacao,
           localizacao, foto* (obrigatória para peças novas)
  201:     Peca (completo)
  400:     { "codigo": "FOTO_OBRIGATORIA" } | { "codigo": "CAMPO_OBRIGATORIO", "campo": "nome" }

GET  /pecas/:id
  200:     Peca (completo)

PUT  /pecas/:id                      (multipart/form-data)
  200:     Peca atualizada
  409:     { "codigo": "LOCALIZACAO_BLOQUEADA" }   ← peça em uso

Peca (completo): { "id", "nome", "categoria", "tamanho", "cor", "material",
                   "estadoConservacao", "localizacao", "status", "fotoUrl",
                   "criadoEm", "atualizadoEm" }
```

### Locatários

```
GET  /locatarios?cpf=12345678901
  200:     Locatario | null           ← busca por CPF para detectar duplicidade

POST /locatarios
  Body:    { "nome": "string*", "cpf": "string*", "telefone": "string", "email": "string" }
  201:     Locatario (novo cadastro)
  200:     Locatario (CPF já existente — reaproveita)
  400:     { "codigo": "CPF_INVALIDO" }

GET  /locatarios/:id
  200:     Locatario

Locatario: { "id", "nome", "cpf" (mascarado: "***.***.***-XX"), "telefone", "email" }
```

### Locações

```
POST /locacoes                       (FIGURINISTA)
  Body:    { "locatarioId": 5,
             "dataPrevistaDevolucao": "2026-07-10",
             "pecasIds": [12, 14, 17] }
  201:     LocacaoDetalhe
  409:     { "codigo": "PECA_NAO_DISPONIVEL", "pecaId": 14 }

GET  /locacoes?status=AGUARDANDO_PAGAMENTO&page=0&size=20
  200:     { "content": [LocacaoResumo], "totalElements": 3 }

GET  /locacoes/:id
  200:     LocacaoDetalhe

POST /locacoes/:id/confirmar-pagamento  (ADMIN)
  Body:    {}                         ← valores já estão na locação
  200:     LocacaoDetalhe (status → EM_USO)
  409:     { "codigo": "STATUS_INVALIDO" }

POST /locacoes/:id/registrar-devolucao  (FIGURINISTA)
  Body:    { "itens": [
               { "pecaId": 12, "statusDevolucao": "OK", "observacao": null },
               { "pecaId": 14, "statusDevolucao": "DANIFICADA", "observacao": "Rasgo" }
             ] }
  200:     LocacaoDetalhe (status → AGUARDANDO_DEVOLUCAO_CAUCAO)
  409:     { "codigo": "STATUS_INVALIDO" }

POST /locacoes/:id/decidir-caucao    (ADMIN)
  Body:    { "decisao": "DEVOLVER|RETER", "motivo": "string" }
           (motivo obrigatório quando decisao=RETER, mínimo 10 caracteres)
  200:     LocacaoDetalhe (status → FINALIZADA | CAUCAO_RETIDA)
  400:     { "codigo": "MOTIVO_OBRIGATORIO" }

LocacaoResumo: { "id", "locatario": { "id", "nome" }, "status",
                 "dataPrevistaDevolucao", "valorAluguel", "caucao",
                 "diasAtraso": 0|N, "criadoEm" }

LocacaoDetalhe: LocacaoResumo + { "itens": [ItemLocacao],
                 "confirmadoPor": UsuarioRef|null,
                 "conferidaPor": UsuarioRef|null,
                 "movimentacaoCaucao": MovimentacaoCaucao|null }

ItemLocacao: { "peca": PecaResumo, "statusDevolucao": null|"OK|DANIFICADA|NAO_DEVOLVIDA",
               "observacao": null|string }
```

### Configuração

```
GET  /config/valor-aluguel
  200:     { "valor": 50.00 }

PUT  /config/valor-aluguel           (ADMIN)
  Body:    { "valor": 60.00 }
  200:     { "valor": 60.00 }
```

### Relatórios

```
GET  /relatorios/receita?mes=2026-06
  200:     { "mes": "2026-06",
             "totalAluguel": 750.00,
             "quantidadeLocacoes": 15,
             "locacoes": [{ "id", "locatario": { "nome" }, "valorAluguel",
                            "finalizadaEm" }] }
  ⚠️  Caução NÃO aparece — nunca é receita.

GET  /relatorios/pecas-fora
  200:     [{ "peca": PecaResumo,
               "locacao": { "id", "locatario": { "nome" }, "dataPrevistaDevolucao" },
               "diasAtraso": 0|N }]
```

---

## 4. Rastreabilidade — Módulos × Histórias

| História | Título resumido | M01 | M02 | M03 | M04 | M05 | M06 | M07 | M08 |
|----------|-----------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| H1.1 | Login / redirect por perfil | | ✅ | | | | | | |
| H1.2 | Home figurinista (3 botões) | | ✅ | | | | | | |
| H1.3 | Home admin (pendentes + métricas) | | ✅ | | | | | | |
| H2.1 | Cadastrar peça (campos obrigatórios) | | | ✅ | | | | | |
| H2.2 | Foto obrigatória em peça nova | | | ✅ | | | | | |
| H2.3 | Editar peça; bloquear localizacao em uso | | | ✅ | | | | | |
| H3.1 | Cadastrar locatário + dedup CPF | | | | ✅ | | | | |
| H3.2 | LGPD — CPF protegido (só autenticados) | | ✅ | | ✅ | | | | |
| H4.1 | Criar locação (seleção locatário + peças) | | | | | ✅ | | | |
| H4.2 | Confirmar pagamento (admin) | | | | | ✅ | | | |
| H4.3 | Indicador "aguardando admin" | | | | | ✅ | | | |
| H5.1 | Registrar devolução (figurinista) | | | | | | ✅ | | |
| H5.2 | Decidir caução (admin) | | | | | | ✅ | | |
| H6.1 | Busca por nome + filtro status | | | ✅ | | | | | |
| H7.1 | Receita do mês (só aluguel) | | | | | | | ✅ | |
| H7.2 | Peças fora do acervo | | | | | | | ✅ | |
| NFR · Infra | Docker + CI | ✅ | | | | | | | ✅ |
| NFR · Atraso | Sinalizar sem multa | | | | | ✅ | | ✅ | |

---

## 5. Decisões de Arquitetura

| Decisão | Escolha | Alternativa descartada | Motivo |
|---------|---------|----------------------|--------|
| Auth | JWT httpOnly cookie | Bearer Header | Evita XSS com acesso ao token via JS |
| Storage de foto | Volume Docker local | S3 desde o início | Simplifica MVP; `StorageService` é interface — troca por S3 sem mudar modelo |
| Busca textual | `ILIKE` Postgres | Elasticsearch | Acervo ≤ 2000 peças; latência < 1s sem índice de texto completo |
| Estado ao vivo | Polling 30s (frontend) | WebSocket | Suficiente para MVP; sem infra adicional |
| Criptografia CPF | AES-256-GCM + hash SHA-256 (unicidade) | BCrypt | AES é reversível (admin pode precisar exibir CPF completo); hash para índice UNIQUE |
| Concorrência na locação | `SELECT FOR UPDATE` na peça | Optimistic locking | Garante atomicidade sem retry no frontend |

---

## 6. Cálculo de Prazo

```
Fórmula: Tempo Fase 2 + Σ(Pesos F3 + F4) + 2d buffer

Fase 2 (Spec + Design + Layout): ~15 dias úteis (calibração)
Fase 3 (Blueprint — este doc):    1d
Fase 4 (Implementação M01–M08):  22d
Buffer:                           2d
                                 ───
Total Fase 3+4:                  25 dias úteis

Início: 2026-06-19 (sex) — hoje
```

| Módulo | Início | Término |
|--------|--------|---------|
| Fase 3 · Blueprint | 2026-06-19 | 2026-06-19 |
| M01 · Fundação | 2026-06-22 | 2026-06-23 |
| M02 · Autenticação | 2026-06-24 | 2026-06-25 |
| M03 · Acervo de Peças | 2026-06-26 | 2026-07-01 |
| M04 · Locatários | 2026-07-02 | 2026-07-03 |
| M05 · Locação ⚠️ | 2026-07-07 | 2026-07-11 |
| M06 · Devolução & Caução | 2026-07-14 | 2026-07-17 |
| M07 · Relatórios | 2026-07-18 | 2026-07-21 |
| M08 · CI/CD | 2026-07-22 | 2026-07-22 |
| Buffer | 2026-07-23 | 2026-07-24 |

> **Prazo de entrega estrito: 24 de julho de 2026 (sexta-feira)**

---

## 7. Estrutura de Projeto Alvo

```
figurinos-tja/
├─ backend/                          ← Spring Boot
│  ├─ src/main/java/br/gov/tja/figurinos/
│  │  ├─ auth/                       ← M02
│  │  ├─ peca/                       ← M03
│  │  ├─ locatario/                  ← M04
│  │  ├─ locacao/                    ← M05
│  │  ├─ devolucao/                  ← M06
│  │  ├─ relatorio/                  ← M07
│  │  ├─ config/                     ← M01 + config valor aluguel
│  │  └─ storage/                    ← StorageService (interface)
│  ├─ src/main/resources/
│  │  ├─ db/migration/               ← Flyway V1__init.sql, V2__seed_usuarios.sql
│  │  └─ application.yml
│  └─ Dockerfile
├─ frontend/                         ← React + TypeScript + Vite
│  ├─ src/
│  │  ├─ app/                        ← router + AppShell
│  │  ├─ components/                 ← primitivos de lib/components.jsx
│  │  ├─ features/                   ← screens de produção (ver HANDOFF §4)
│  │  ├─ api/                        ← cliente REST /api/v1
│  │  ├─ lib/
│  │  └─ design/                     ← tokens.css (copiar sem alterar)
│  └─ vite.config.ts
├─ docker-compose.yml                ← app + db + uploads volume
├─ docker-compose.prod.yml
├─ .github/workflows/ci.yml
├─ design/                           ← tokens.css, DESIGN.md (fonte da verdade)
└─ CLAUDE.md, spec.md, ROADMAP.md
```

---

*Blueprint gerado em 2026-06-19. Próximo passo: iniciar M01 · Fundação.*

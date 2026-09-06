@AGENTS.md

# Sistema de Gestão de Figurinos — Teatro José de Alencar (MVP)

Sistema web multiusuário para gerenciar acervo, locações e caução do figurino do TJA (Fortaleza/CE). **Escopo MVP** — fluxo central de ponta a ponta, pronto pra entrar em produção em ~3-4 semanas.

## Stack
- Backend: Spring Boot · Postgres · Docker
- Frontend: web responsivo (foco desktop) · identidade a ser criada na Fase 2a
- Deploy: CI/CD via GitHub Actions

## Perfil de projeto
Sistema interno · 2 perfis de usuário (figurinista, administração) · ambiente em rede · domínio público (TJA / SECULT-CE).

## Princípios (não-funcionais críticos)
- **UX pautada pela figurinista** (sem proficiência tech): botões grandes, fluxo linear, zero jargão, no máximo 3 cliques por operação comum.
- **UX da administração pode ser densa** (lidam com sistemas).
- **Estado ao vivo entre salas** — figurinista e administração veem o mesmo estado em tempo real.
- **Aluguel ≠ caução** — nunca somar. Aluguel é receita; caução é garantia.
- **Decisão humana sempre que envolve dinheiro retido** — sistema sugere, humano decide.
- **LGPD** — dado de documento do locatário é sensível.

## Épicos (MVP)
- E1 · Acesso & Permissões (figurinista, administração)
- E2 · Cadastro de Peças (acervo)
- E3 · Cadastro de Locatários (com documento)
- E4 · Locação (fluxo de saída: figurinista cria → admin confirma pagamento)
- E5 · Devolução (figurinista confere peça → admin devolve/retém caução)
- E6 · Busca básica (acervo)
- E7 · Relatórios essenciais em tela (peças fora, receita do mês)

## Máquina de estados da locação
```
reservada → aguardando_pagamento → em_uso → aguardando_devolucao_caucao → finalizada
                                            ↘ caucao_retida → finalizada
```

## Convenções
- API REST `/api/v1`, JSON, erros padronizados.
- Diretiva Primária na Fase 4: não alterar sintaxe de código existente.

## Ponteiros
- Histórias completas: `./docs/spec.md`
- Blueprint técnico: `./ROADMAP.md` (gerado na Fase 3)
- Identidade visual: `./design/tokens.css` + `./design/DESIGN.md` (gerados na Fase 2a)
- Backlog pós-MVP: ver seção final do `spec.md`

## Premissas confirmadas com o cliente
- Aluguel: valor fixo, configurável por admin.
- Caução: R$ 50,00 fixos por locação.
- Sem multa por atraso (teatro flexível) — sistema apenas sinaliza atraso.
- Retenção de caução: decisão manual da administração + motivo registrado.
- Foto: obrigatória só em peças cadastradas a partir do sistema.
- QR Code: fora do escopo (futuro).
- Importação da planilha antiga: fora do MVP.
- Conferência semestral: eliminada (estoque ao vivo).

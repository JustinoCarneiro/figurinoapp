# Especificação Viva — Sistema de Figurinos TJA (MVP)

Documento gerado na **Fase 1 (Spec Viva)** da metodologia Onda-Dev. Detalha cada épico do `CLAUDE.md` em histórias de usuário com critérios de aceite. **Escopo: MVP** — fluxo central de ponta a ponta. Pós-MVP listado no fim do documento.

---

## Contexto do domínio

O **Teatro José de Alencar (TJA)**, em Fortaleza/CE, possui um acervo de figurinos alugado para terceiros. Hoje o controle é em papel: a figurinista anota num recibo, a pessoa paga aluguel + caução de R$ 50,00 na administração e leva as peças. Na devolução, a figurinista confere e libera a devolução da caução pela administração. Conferência semestral é feita por bolsistas.

**Problema central:** processo manual, sem visibilidade em tempo real, conferência semestral cara, atrasos sem acompanhamento.

**Solução MVP:** sistema web em rede, com 2 perfis (figurinista e administração), que digitaliza o fluxo de locação e elimina a conferência semestral pelo estoque ao vivo.

**Persona principal:** figurinista atual — sênior, sem proficiência em tecnologia. **A UX dela é a restrição mais importante do projeto.**

---

## Atores

| Ator | Papel | Acesso |
|---|---|---|
| Figurinista | Cadastra peças, registra saídas, confere devoluções | Sala da figurinista (sistema web) |
| Administração | Confirma pagamentos, devolve ou retém caução, vê relatórios | Sala da administração (sistema web) |
| Locatário | Pessoa que aluga as peças | Não acessa o sistema; é cadastrado pela equipe |

---

## E1 · Acesso & Permissões

> **H1.1** Como *figurinista ou administração*, quero fazer login com usuário e senha para acessar o sistema com minhas permissões.

- Dado o formulário de login, quando informo credenciais inválidas, então o sistema barra e exibe "Usuário ou senha incorretos".
- Dado login bem-sucedido, então o sistema redireciona para a tela inicial correspondente ao meu perfil.

> **H1.2** Como *figurinista*, quero ver uma tela inicial simples com 3 botões grandes (Cadastrar peça · Registrar saída · Registrar devolução) para acessar as operações comuns sem me perder.

- Dado que sou figurinista, então a tela inicial tem no máximo 3 ações principais visíveis.

> **H1.3** Como *administração*, quero acesso a todas as funcionalidades + pagamentos pendentes + relatórios em tela.

---

## E2 · Cadastro de Peças

> **H2.1** Como *figurinista*, quero cadastrar uma peça com nome, categoria, tamanho, cor, material, estado de conservação e localização para ter o acervo organizado.

- Dado o formulário, quando salvo sem nome ou categoria, então o sistema barra.
- Dado o cadastro completo, então a peça nasce como `disponivel`.

> **H2.2** Como *figurinista*, quero anexar foto a cada peça nova cadastrada, para identificar visualmente.

- Dado peça cadastrada via sistema, quando salvo sem foto, então o sistema barra.

> **H2.3** Como *figurinista*, quero editar dados de uma peça (estado, localização, descrição) para refletir mudanças reais.

- Dado uma peça `em_uso`, quando tento mudar a localização, então o sistema bloqueia.

---

## E3 · Cadastro de Locatários

> **H3.1** Como *figurinista ou administração*, quero cadastrar uma pessoa com nome, documento (CPF), telefone e e-mail.

- Dado o formulário, quando informo CPF que já existe, então o sistema reaproveita o cadastro.
- Documento é obrigatório.

> **H3.2** Como *administração*, quero que dados pessoais do locatário fiquem protegidos (apenas usuários autenticados acessam), em conformidade com LGPD.

---

## E4 · Locação (saída de peças)

> **H4.1** Como *figurinista*, quero iniciar uma locação selecionando o locatário e as peças, com data de devolução prevista.

- Dado peças `disponiveis`, quando crio a locação, então cada peça vai para `reservada` e a locação para `aguardando_pagamento`.
- Dado uma peça não-disponível, quando tento adicionar, então o sistema bloqueia.
- Sistema calcula **total devido** = `qtd_pecas × valor_aluguel` + R$ 50 de caução.

> **H4.2** Como *administração*, quero ver locações `aguardando_pagamento` e confirmar quando o locatário paga, para liberar as peças.

- Dado confirmação, então peças vão para `em_uso` e locação para `em_uso`.
- Sistema registra: aluguel pago, caução recebida, data, admin responsável.

> **H4.3** Como *figurinista*, quero ver claramente quais locações estão `aguardando_pagamento` antes de liberar fisicamente as peças.

- Indicador visual: "Aguardando administração confirmar pagamento".

---

## E5 · Devolução

> **H5.1** Como *figurinista*, quero registrar a devolução, conferindo peça por peça e indicando estado (ok / danificada / não devolvida) + observações.

- Dado locação `em_uso`, quando registro devolução, então locação vai para `aguardando_devolucao_caucao`.
- Peças voltam para `disponivel`, `em_manutencao` ou `nao_devolvida` conforme avaliação.

> **H5.2** Como *administração*, quero ver locações `aguardando_devolucao_caucao` com a avaliação da figurinista, para devolver ou reter caução.

- Dado peças `ok`, sistema sugere "Devolver caução integral" (decisão final é da admin).
- Dado peças `danificadas` / `nao_devolvidas`, exige decisão explícita + motivo obrigatório.
- Decisão fechada → locação `finalizada`; movimentação financeira registrada.

---

## E6 · Busca

> **H6.1** Como *figurinista*, quero buscar peças por nome ou descrição, filtrando por estado (disponível/em uso), para localizar rápido.

- Resultados em até 1s para acervo de até 2000 peças.

---

## E7 · Relatórios essenciais (em tela)

> **H7.1** Como *administração*, quero ver receita de aluguel arrecadada no mês, em tela, para acompanhamento.

- Apenas valores de **aluguel** (caução nunca entra como receita).

> **H7.2** Como *administração*, quero ver lista de peças atualmente fora do acervo e suas locações, em tela.

---

## Definição de pronto

Cada história só fecha quando atende:

- **Belo** — bate com a identidade visual aprovada na Fase 2.
- **Fluido** — figurinista executa a operação em até 3 cliques; estados de erro e carregamento tratados.
- **Seguro** — testes verdes, dados de documento protegidos, sem regressão.

---

## Backlog pós-MVP

Histórias removidas do escopo inicial, organizadas por épico, para versões futuras (ou aditivo, se o teatro contratar):

**E1** · Recuperação de senha pelo próprio usuário (hoje: admin reseta manualmente).
**E2** · Baixa formal de peça (hoje: edita estado para "baixada"). Acervo histórico separado.
**E3** · Histórico de locações por locatário (tela). Log de acesso a dados sensíveis.
**E4** · Geração de recibo em PDF para impressão.
**E5** · Indicador visual de atraso na lista (contagem de dias).
**E6** · Filtros combinados (categoria + tamanho + cor).
**E7** · Relatório de caução retida; export CSV/PDF dos relatórios.
**Extras** · Importação da planilha antiga; QR Code nas peças; notificações por e-mail/WhatsApp; app mobile nativo.

---

## Itens deliberadamente fora do escopo (não voltam nem em versões futuras sem reavaliar)

- Multa por atraso (teatro é flexível — premissa do cliente).
- Conferência semestral (eliminada pelo estoque ao vivo — é a justificativa do projeto).

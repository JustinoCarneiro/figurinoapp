/* global React, Icon, Badge, BRL, METRICAS, LOCACOES, DEVOLUCOES, locatario */
// ============================================================
// Tela 3 — Home da Administração (H1.3) · Direção A
// ============================================================
function HomeAdmin({ user, go }) {
  const pendentes = LOCACOES.filter(l => l.estado === 'aguardando_pgto');
  const devolucoes = DEVOLUCOES;

  const metrics = [
    {
      label: 'Receita de aluguel · Junho',
      icon: 'coin', value: BRL(METRICAS.receitaMes),
      foot: 'Caução não entra como receita',
      key: 'relatorio-receita',
    },
    {
      label: 'Peças fora do acervo',
      icon: 'out', value: METRICAS.pecasFora,
      foot: 'Em uso por locatários agora',
      key: 'relatorio-pecas-fora',
    },
    {
      label: 'Locações ativas',
      icon: 'list', value: METRICAS.locacoesAtivas,
      foot: `${METRICAS.atrasadasHoje} com devolução atrasada`,
      key: null,
    },
  ];

  return (
    <div className="page">
      <div className="page-inner">

        {/* Cabeçalho */}
        <div className="between" style={{ marginBottom: 'var(--tja-space-6)', alignItems: 'flex-end' }}>
          <div>
            <p className="eyebrow">Administração</p>
            <h1 style={{ margin: 0 }}>Painel da administração</h1>
          </div>
          <div className="cluster" style={{ gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => go('cadastro-locatario')}
              style={{ fontSize: 'var(--tja-text-sm)' }}>
              <Icon name="user" size={16} /> Novo locatário
            </button>
            <button className="btn btn-primary" onClick={() => go('cadastro-peca')}
              style={{ fontSize: 'var(--tja-text-sm)' }}>
              <Icon name="plus" size={16} /> Cadastrar peça
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="metrics" style={{ marginBottom: 'var(--tja-space-6)' }}>
          {metrics.map((m) => (
            <button key={m.label} className="metric"
              onClick={() => m.key && go(m.key)}
              style={{ textAlign: 'left', cursor: m.key ? 'pointer' : 'default', font: 'inherit', border: 'none' }}>
              <div className="mlabel">
                <Icon name={m.icon} size={15} style={{ color: 'var(--tja-accent)' }} />
                {m.label}
              </div>
              <div className="mvalue">{m.value}</div>
              <div className="mfoot">{m.foot}</div>
              {m.key && (
                <div style={{ marginTop: 'var(--tja-space-3)', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--tja-primary)', fontSize: 'var(--tja-text-xs)', fontWeight: 600 }}>
                  Ver relatório <Icon name="chevron" size={13} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Filas de trabalho */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tja-space-5)', marginBottom: 'var(--tja-space-6)' }}>

          {/* Pagamentos pendentes */}
          <section className="panel">
            <div className="panel-head">
              <Icon name="coin" size={18} style={{ color: 'var(--tja-warning)' }} />
              <h3>Pagamentos pendentes</h3>
              <span className="topbar-spacer" />
              <span className="count">{pendentes.length}</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendentes.map((l) => {
                const loc = locatario(l.locatarioId);
                const aluguel = l.pecasIds.length * window.VALOR_ALUGUEL;
                return (
                  <div key={l.id} className="row" style={{ alignItems: 'flex-start' }}>
                    <div className="grow">
                      <div className="name">{loc.nome}</div>
                      <div className="meta">
                        <span><Icon name="tag" size={13} /> {l.pecasIds.length} {l.pecasIds.length === 1 ? 'peça' : 'peças'}</span>
                        <span><Icon name="calendar" size={13} /> devolução {l.previsao}</span>
                      </div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 20, fontSize: 'var(--tja-text-sm)' }}>
                        <span>
                          <span style={{ color: 'var(--tja-text-soft)' }}>Aluguel </span>
                          <strong className="tnum">{BRL(aluguel)}</strong>
                        </span>
                        <span>
                          <span style={{ color: 'var(--tja-text-soft)' }}>Caução </span>
                          <strong className="tnum">{BRL(window.VALOR_CAUCAO)}</strong>
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                      <Badge state="aguardando_pgto" />
                      <button className="btn btn-primary"
                        style={{ minHeight: 38, padding: '0 14px', fontSize: 'var(--tja-text-sm)' }}
                        onClick={() => go('pagamentos')}>
                        Confirmar
                      </button>
                    </div>
                  </div>
                );
              })}
              <button className="link-btn" onClick={() => go('pagamentos')} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                Abrir tela de pagamentos <Icon name="chevron" size={15} />
              </button>
            </div>
          </section>

          {/* Devoluções aguardando decisão */}
          <section className="panel">
            <div className="panel-head">
              <Icon name="in" size={18} style={{ color: 'var(--tja-primary)' }} />
              <h3>Devoluções a decidir</h3>
              <span className="topbar-spacer" />
              <span className="count">{devolucoes.length}</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {devolucoes.map((d) => {
                const loc = locatario(d.locatarioId);
                const temProblema = d.itens.some(i => i.avaliacao !== 'ok');
                return (
                  <div key={d.id} className="row" style={{ alignItems: 'flex-start' }}>
                    <div className="grow">
                      <div className="name">{loc.nome}</div>
                      <div className="meta">
                        <span><Icon name="tag" size={13} /> {d.itens.length} {d.itens.length === 1 ? 'peça' : 'peças'}</span>
                        <span><Icon name="user" size={13} /> por {d.conferidaPor.split(' ')[0]}</span>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        {temProblema
                          ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--tja-danger)', fontWeight: 600 }}>
                              <Icon name="alert" size={14} /> Peça com avaria — decisão necessária
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--tja-success)', fontWeight: 600 }}>
                              <Icon name="check" size={14} /> Tudo OK — sugestão: devolver caução
                            </span>
                          )}
                      </div>
                    </div>
                    <button className="btn btn-secondary"
                      style={{ minHeight: 38, padding: '0 14px', fontSize: 'var(--tja-text-sm)', flexShrink: 0 }}
                      onClick={() => go('devolucao-caucao')}>
                      Analisar
                    </button>
                  </div>
                );
              })}
              <button className="link-btn" onClick={() => go('devolucao-caucao')} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                Abrir tela de caução <Icon name="chevron" size={15} />
              </button>
            </div>
          </section>
        </div>

        {/* Atalhos */}
        <div>
          <div className="section-label">Atalhos</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--tja-space-3)' }}>
            {[
              { k: 'acervo', icon: 'box', t: 'Acervo de peças' },
              { k: 'relatorio-receita', icon: 'chart', t: 'Receita do mês' },
              { k: 'relatorio-pecas-fora', icon: 'list', t: 'Peças fora' },
              { k: 'cadastro-locatario', icon: 'user', t: 'Locatários' },
            ].map(s => (
              <button key={s.k} onClick={() => go(s.k)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                background: 'var(--tja-bg-elevated)', border: '1px solid var(--tja-border)',
                borderRadius: 'var(--tja-radius-md)', cursor: 'pointer', textAlign: 'left',
                fontSize: 'var(--tja-text-sm)', fontWeight: 600, color: 'var(--tja-text)',
                font: 'inherit', transition: 'border-color var(--tja-duration) var(--tja-ease)',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--tja-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--tja-border)'}>
                <span style={{
                  width: 36, height: 36, borderRadius: 'var(--tja-radius-sm)', flex: 'none',
                  background: 'var(--tja-primary-soft)', color: 'var(--tja-primary)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <Icon name={s.icon} size={18} />
                </span>
                {s.t}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

window.HomeAdmin = HomeAdmin;

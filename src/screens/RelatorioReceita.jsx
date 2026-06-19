/* global React, Icon, BRL, RECEITA_MESES, LOCACOES, VALOR_ALUGUEL */
// ============================================================
// Tela 11 — Relatório: Receita do mês (H7.1) · admin · Direção A
// APENAS aluguel — caução NUNCA entra. Gráfico de barras + total.
// ============================================================
function RelatorioReceita({ user, go }) {
  const meses = RECEITA_MESES;
  const max = Math.max(...meses.map(m => m.valor));
  const atual = meses[meses.length - 1];
  const anterior = meses[meses.length - 2];
  const variacao = ((atual.valor - anterior.valor) / anterior.valor) * 100;
  const totalAno = meses.reduce((s, m) => s + m.valor, 0);
  const media = Math.round(totalAno / meses.length);
  const subiu = variacao >= 0;

  // Locações que compõem a receita do mês corrente (pagas)
  const locacoesPagas = LOCACOES.filter(l => l.pagamento);

  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth: 980 }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)', marginBottom: 'var(--tja-space-6)' }}>
          <button className="btn btn-ghost" onClick={() => go('home')}
            style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Relatórios</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Receita de aluguel</h1>
          </div>
        </div>

        {/* Nota: caução nunca entra */}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          background: 'var(--tja-info-soft)', color: 'var(--tja-info)',
          border: '1px solid rgba(74,90,122,0.25)', borderRadius: 'var(--tja-radius-md)',
          padding: '12px 16px', fontSize: 'var(--tja-text-sm)', marginBottom: 'var(--tja-space-6)',
        }}>
          <Icon name="alert" size={16} style={{ flex: 'none', marginTop: 1 }} />
          <span style={{ color: 'var(--tja-text)' }}>
            Este relatório considera <strong>apenas valores de aluguel</strong>. A caução é um depósito reembolsável e nunca é contabilizada como receita.
          </span>
        </div>

        {/* Destaque do mês + métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-6)' }}>
          <div className="card" style={{ background: 'var(--tja-text)', border: 'none' }}>
            <div style={{ fontSize: 'var(--tja-text-sm)', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Receita de junho · mês corrente</div>
            <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-4xl)', color: '#fff', lineHeight: 1.1, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{BRL(atual.valor)}</div>
            <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--tja-text-sm)', fontWeight: 600, color: subiu ? '#7fd1a8' : '#e89b9b' }}>
              <Icon name={subiu ? 'chart' : 'chart'} size={15} />
              {subiu ? '+' : ''}{variacao.toFixed(0)}% em relação a maio
            </div>
          </div>
          <div className="card">
            <div className="mlabel" style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', fontWeight: 500 }}>Média mensal</div>
            <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-2xl)', color: 'var(--tja-primary)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{BRL(media)}</div>
            <div style={{ fontSize: 'var(--tja-text-xs)', color: 'var(--tja-text-soft)', marginTop: 2 }}>Últimos {meses.length} meses</div>
          </div>
          <div className="card">
            <div className="mlabel" style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', fontWeight: 500 }}>Acumulado no ano</div>
            <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-2xl)', color: 'var(--tja-primary)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{BRL(totalAno)}</div>
            <div style={{ fontSize: 'var(--tja-text-xs)', color: 'var(--tja-text-soft)', marginTop: 2 }}>Jan a Jun</div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="panel" style={{ marginBottom: 'var(--tja-space-6)' }}>
          <div className="panel-head">
            <Icon name="chart" size={18} style={{ color: 'var(--tja-primary)' }} />
            <h3>Receita por mês</h3>
          </div>
          <div className="panel-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--tja-space-4)', height: 240, padding: '0 var(--tja-space-2)' }}>
              {meses.map((m, i) => {
                const h = (m.valor / max) * 100;
                const isAtual = i === meses.length - 1;
                return (
                  <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: 'var(--tja-text-xs)', fontWeight: 700, color: isAtual ? 'var(--tja-primary)' : 'var(--tja-text-soft)', fontVariantNumeric: 'tabular-nums' }}>
                      {BRL(m.valor).replace('R$', '').trim()}
                    </div>
                    <div style={{
                      width: '100%', maxWidth: 64, height: `${h}%`, minHeight: 6,
                      borderRadius: 'var(--tja-radius-sm) var(--tja-radius-sm) 0 0',
                      background: isAtual ? 'var(--tja-primary)' : 'var(--tja-primary-soft)',
                      transition: 'height 0.4s var(--tja-ease)',
                    }} />
                    <div style={{ fontSize: 'var(--tja-text-sm)', fontWeight: isAtual ? 700 : 500, color: isAtual ? 'var(--tja-text)' : 'var(--tja-text-soft)' }}>{m.mes}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detalhamento do mês */}
        <div className="panel">
          <div className="panel-head">
            <Icon name="coin" size={18} style={{ color: 'var(--tja-primary)' }} />
            <h3>Locações pagas em junho</h3>
            <span className="topbar-spacer" />
            <span className="count">{locacoesPagas.length}</span>
          </div>
          <div style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--tja-border)' }}>
                  {['Locatário', 'Peças', 'Pago em', 'Aluguel'].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 3 ? 'right' : 'left', padding: 'var(--tja-space-3) var(--tja-space-5)', fontSize: 'var(--tja-text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tja-text-soft)', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {locacoesPagas.map((l, i) => {
                  const loc = window.locatario(l.locatarioId);
                  const aluguel = l.pecasIds.length * VALOR_ALUGUEL;
                  return (
                    <tr key={l.id} style={{ borderBottom: i < locacoesPagas.length - 1 ? '1px solid var(--tja-border-soft)' : 'none' }}>
                      <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', fontWeight: 600 }}>{loc.nome}</td>
                      <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', color: 'var(--tja-text-soft)' }}>{l.pecasIds.length}</td>
                      <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', color: 'var(--tja-text-soft)' }}>{l.pagamento.em}</td>
                      <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{BRL(aluguel)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

window.RelatorioReceita = RelatorioReceita;

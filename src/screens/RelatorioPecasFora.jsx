/* global React, Icon, Badge, LOCACOES, locatario, peca, exportXLSX */
// ============================================================
// Tela 12 — Relatório: Peças Fora (H7.2) · admin · Direção A
// Tabela: peça, locatário, saída, previsão, dias de atraso.
// Linhas atrasadas em vermelho soft.
// ============================================================
const { useMemo, useState } = React;

function RelatorioPecasFora({ user, go }) {
  const [soAtrasadas, setSoAtrasadas] = useState(false);

  // Achata locações ativas em linhas por peça
  const linhas = useMemo(() => {
    const out = [];
    LOCACOES.filter(l => l.estado === 'em_uso' || l.estado === 'atrasada').forEach(l => {
      const loc = locatario(l.locatarioId);
      l.pecasIds.forEach(pid => {
        const p = peca(pid);
        if (!p) return;
        out.push({
          locId: l.id, peca: p, locatario: loc,
          saida: l.criadaEm, previsao: l.previsao,
          atraso: l.estado === 'atrasada' ? (l.diasAtraso || 0) : 0,
          estado: l.estado,
        });
      });
    });
    return out;
  }, []);

  const filtradas = soAtrasadas ? linhas.filter(r => r.atraso > 0) : linhas;
  const nAtrasadas = linhas.filter(r => r.atraso > 0).length;

  function exportarExcel() {
    const dataStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const dataArq = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    exportXLSX([
      {
        name: 'Peças Fora',
        data: [
          ['TJA — Peças Fora do Acervo'],
          ['Gerado em: ' + dataStr],
          [],
          ['Peça', 'Categoria', 'Tamanho', 'Locatário', 'Data Saída', 'Devolução Prevista', 'Situação', 'Dias de Atraso'],
          ...linhas.map(r => [
            r.peca.nome,
            r.peca.categoria,
            r.peca.tamanho,
            r.locatario.nome,
            r.saida,
            r.previsao,
            r.atraso > 0 ? 'Atrasada' : 'No prazo',
            r.atraso > 0 ? r.atraso : '',
          ]),
        ],
      },
    ], `pecas-fora-tja-${dataArq}.xlsx`);
  }

  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth: 1040 }}>
        {/* Cabeçalho */}
        <div className="between" style={{ marginBottom: 'var(--tja-space-5)', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)' }}>
            <button className="btn btn-ghost" onClick={() => go('home')}
              style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
              <Icon name="arrowLeft" size={18} />
            </button>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>Relatórios</p>
              <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Peças fora do acervo</h1>
            </div>
          </div>
          {/* Ações */}
          <div style={{ display: 'flex', gap: 'var(--tja-space-2)' }}>
          <button className="btn btn-secondary" onClick={exportarExcel}
            style={{ fontSize: 'var(--tja-text-sm)' }}>
            <Icon name="download" size={16} /> Exportar Excel
          </button>
          {/* Toggle só atrasadas */}
          <button onClick={() => setSoAtrasadas(s => !s)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 var(--tja-space-4)',
              font: 'inherit', cursor: 'pointer', fontSize: 'var(--tja-text-sm)', fontWeight: 600,
              background: soAtrasadas ? 'var(--tja-danger-soft)' : 'var(--tja-bg-elevated)',
              color: soAtrasadas ? 'var(--tja-danger)' : 'var(--tja-text-soft)',
              border: soAtrasadas ? '1px solid var(--tja-danger)' : '1px solid var(--tja-border)',
              borderRadius: 'var(--tja-radius-md)',
            }}>
            <Icon name="clock" size={16} />
            {soAtrasadas ? 'Mostrando só atrasadas' : 'Ver só atrasadas'}
            <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: soAtrasadas ? 'var(--tja-danger)' : 'var(--tja-bg-muted)', color: soAtrasadas ? '#fff' : 'var(--tja-text-soft)' }}>{nAtrasadas}</span>
          </button>
          </div>
        </div>

        {/* Resumo */}
        <div style={{ display: 'flex', gap: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-5)' }}>
          <div className="card" style={{ flex: 1, padding: 'var(--tja-space-4) var(--tja-space-5)' }}>
            <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>Peças fora agora</div>
            <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-2xl)', color: 'var(--tja-primary)', fontVariantNumeric: 'tabular-nums' }}>{linhas.length}</div>
          </div>
          <div className="card" style={{ flex: 1, padding: 'var(--tja-space-4) var(--tja-space-5)' }}>
            <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>Com devolução atrasada</div>
            <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-2xl)', color: nAtrasadas > 0 ? 'var(--tja-danger)' : 'var(--tja-text-soft)', fontVariantNumeric: 'tabular-nums' }}>{nAtrasadas}</div>
          </div>
        </div>

        {/* Tabela */}
        <div className="panel">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--tja-border)', background: 'var(--tja-bg)' }}>
                {['Peça', 'Locatário', 'Saída', 'Devolução prevista', 'Situação'].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 4 ? 'right' : 'left', padding: 'var(--tja-space-3) var(--tja-space-5)', fontSize: 'var(--tja-text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tja-text-soft)', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((r, i) => {
                const atrasada = r.atraso > 0;
                return (
                  <tr key={r.locId + r.peca.id}
                    onClick={() => go('devolucao-caucao')}
                    style={{
                      borderBottom: i < filtradas.length - 1 ? '1px solid var(--tja-border-soft)' : 'none',
                      background: atrasada ? 'var(--tja-danger-soft)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background var(--tja-duration) var(--tja-ease)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = atrasada ? 'rgba(181,58,58,0.12)' : 'var(--tja-bg-muted)'}
                    onMouseLeave={e => e.currentTarget.style.background = atrasada ? 'var(--tja-danger-soft)' : 'transparent'}
                  >
                    <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)' }}>
                      <div style={{ fontWeight: 600 }}>{r.peca.nome}</div>
                      <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>{r.peca.categoria} · Tam. {r.peca.tamanho}</div>
                    </td>
                    <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)' }}>{r.locatario.nome}</td>
                    <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', color: 'var(--tja-text-soft)', fontVariantNumeric: 'tabular-nums' }}>{r.saida}</td>
                    <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', fontVariantNumeric: 'tabular-nums', color: atrasada ? 'var(--tja-danger)' : 'var(--tja-text-soft)', fontWeight: atrasada ? 600 : 400 }}>{r.previsao}</td>
                    <td style={{ padding: 'var(--tja-space-4) var(--tja-space-5)', textAlign: 'right' }}>
                      {atrasada
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--tja-danger)', fontWeight: 700, fontSize: 'var(--tja-text-sm)' }}>
                            <Icon name="clock" size={15} /> {r.atraso} {r.atraso === 1 ? 'dia' : 'dias'} de atraso
                          </span>
                        : <Badge state="em_uso" />}
                    </td>
                  </tr>
                );
              })}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 'var(--tja-space-7)', textAlign: 'center', color: 'var(--tja-text-soft)' }}>
                    {soAtrasadas ? 'Nenhuma peça atrasada. Tudo dentro do prazo.' : 'Nenhuma peça fora do acervo.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.RelatorioPecasFora = RelatorioPecasFora;

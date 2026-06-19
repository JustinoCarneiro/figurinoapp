/* global React, Icon, Badge, BRL, LOCACOES, LOCATARIOS, PECAS, VALOR_ALUGUEL, VALOR_CAUCAO, locatario, peca, exportXLSX */
// ============================================================
// Tela 5 — Pagamentos Pendentes (H4.2) · admin · Direção A
// Lista de locações aguardando pagamento.
// Confirmar → estado muda pra em_uso, some da lista.
// Aluguel e caução SEMPRE em linhas separadas.
// ============================================================
const { useState } = React;

function ConfirmModal({ locacao, loc, aluguel, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(26,26,46,0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', padding: 'var(--tja-space-6)' }}>
        <h3 style={{ margin: '0 0 var(--tja-space-2)' }}>Confirmar pagamento recebido?</h3>
        <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', lineHeight: 1.6 }}>
          Ao confirmar, as peças da locação <strong>{locacao.id}</strong> serão marcadas como <em>em uso</em>
          e esta entrada sairá da fila.
        </p>

        {/* Valores — separados */}
        <div style={{
          background: 'var(--tja-bg)', borderRadius: 'var(--tja-radius-md)',
          padding: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-5)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--tja-text-sm)' }}>
            <span style={{ color: 'var(--tja-text-soft)' }}>Aluguel ({locacao.pecasIds.length} × {BRL(VALOR_ALUGUEL)})</span>
            <strong className="tnum">{BRL(aluguel)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--tja-text-sm)' }}>
            <span style={{ color: 'var(--tja-text-soft)' }}>Caução (fixo)</span>
            <strong className="tnum">{BRL(VALOR_CAUCAO)}</strong>
          </div>
          <div style={{ height: 1, background: 'var(--tja-border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>
            <span>Total cobrado <span style={{ fontSize: 11 }}>(não é receita — caução é depósito)</span></span>
            <strong className="tnum" style={{ color: 'var(--tja-text)' }}>{BRL(aluguel + VALOR_CAUCAO)}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--tja-space-3)' }}>
          <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={onConfirm} style={{ flex: 1 }}>
            <Icon name="check" size={17} /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function PagamentosPendentes({ user, go }) {
  const [pendentes, setPendentes] = useState(
    LOCACOES.filter(l => l.estado === 'aguardando_pgto')
  );
  const [expandido, setExpandido] = useState(null);
  const [confirmando, setConfirmando] = useState(null);
  const [confirmados, setConfirmados] = useState([]);

  function confirmar(locacao) {
    setConfirmados(prev => [...prev, locacao.id]);
    setTimeout(() => {
      setPendentes(prev => prev.filter(l => l.id !== locacao.id));
      setConfirmando(null);
    }, 400);
  }

  const totalAluguel = pendentes.reduce((s, l) => s + l.pecasIds.length * VALOR_ALUGUEL, 0);
  const totalCaucao = pendentes.length * VALOR_CAUCAO;

  function exportarExcel() {
    const dataStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const dataArq = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    exportXLSX([
      {
        name: 'Pagamentos Pendentes',
        data: [
          ['TJA — Pagamentos Pendentes'],
          ['Gerado em: ' + dataStr],
          ['Nota: caução é depósito reembolsável, não é receita.'],
          [],
          ['Locação', 'Locatário', 'Nº Peças', 'Devolução Prevista', 'Aluguel (R$)', 'Caução (R$)'],
          ...pendentes.map(l => [
            l.id,
            locatario(l.locatarioId).nome,
            l.pecasIds.length,
            l.previsao,
            l.pecasIds.length * VALOR_ALUGUEL,
            VALOR_CAUCAO,
          ]),
          [],
          ['', 'TOTAL', '', '', totalAluguel, totalCaucao],
        ],
      },
    ], `pagamentos-pendentes-tja-${dataArq}.xlsx`);
  }

  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth: 900 }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)', marginBottom: 'var(--tja-space-6)' }}>
          <button className="btn btn-ghost" onClick={() => go('home')}
            style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Administração</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Pagamentos pendentes</h1>
          </div>
          {/* Resumo financeiro + exportar */}
          <div style={{ display: 'flex', gap: 'var(--tja-space-3)', alignItems: 'center' }}>
            {pendentes.length > 0 && (
              <div style={{
                display: 'flex', gap: 'var(--tja-space-5)', alignItems: 'center',
                padding: 'var(--tja-space-3) var(--tja-space-5)',
                background: 'var(--tja-bg-elevated)', border: '1px solid var(--tja-border)',
                borderRadius: 'var(--tja-radius-md)',
              }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tja-text-soft)', fontWeight: 600 }}>Aluguel a receber</div>
                  <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-xl)', fontVariantNumeric: 'tabular-nums' }}>{BRL(totalAluguel)}</div>
                </div>
                <div style={{ width: 1, height: 36, background: 'var(--tja-border)' }} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tja-text-soft)', fontWeight: 600 }}>Caução a receber</div>
                  <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-xl)', fontVariantNumeric: 'tabular-nums' }}>{BRL(totalCaucao)}</div>
                </div>
              </div>
            )}
            <button className="btn btn-secondary" onClick={exportarExcel}
              style={{ fontSize: 'var(--tja-text-sm)', flexShrink: 0 }}>
              <Icon name="download" size={16} /> Exportar Excel
            </button>
          </div>
        </div>

        {/* Aviso: caução não é receita */}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start',
          background: 'var(--tja-info-soft)', color: 'var(--tja-info)',
          border: '1px solid rgba(74,90,122,0.25)', borderRadius: 'var(--tja-radius-md)',
          padding: '12px 16px', fontSize: 'var(--tja-text-sm)', marginBottom: 'var(--tja-space-5)',
        }}>
          <Icon name="alert" size={16} style={{ flex: 'none', marginTop: 1 }} />
          <span>
            <strong>Atenção:</strong> a caução é um depósito reembolsável — nunca entra como receita no relatório financeiro.
            Confirme apenas quando o pagamento for recebido fisicamente.
          </span>
        </div>

        {/* Lista vazia */}
        {pendentes.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 'var(--tja-space-8)',
            color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-lg)',
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ width: 60, height: 60, borderRadius: 999, background: 'var(--tja-success-soft)', display: 'inline-grid', placeItems: 'center' }}>
                <Icon name="check" size={30} style={{ color: 'var(--tja-success)' }} />
              </span>
            </div>
            <strong style={{ color: 'var(--tja-text)' }}>Nenhum pagamento pendente.</strong>
            <p style={{ margin: '8px 0 16px', fontSize: 'var(--tja-text-base)' }}>Todos os pagamentos foram confirmados.</p>
            <button className="btn btn-primary" onClick={() => go('home')}>
              Voltar ao painel <Icon name="chevron" size={17} />
            </button>
          </div>
        )}

        {/* Cards de locação */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-4)' }}>
          {pendentes.map(l => {
            const loc = locatario(l.locatarioId);
            const pecas = l.pecasIds.map(id => peca(id)).filter(Boolean);
            const aluguel = pecas.length * VALOR_ALUGUEL;
            const aberto = expandido === l.id;
            const confirmado = confirmados.includes(l.id);

            return (
              <div key={l.id} className="panel"
                style={{
                  opacity: confirmado ? 0.5 : 1,
                  transition: 'opacity 0.3s',
                  border: aberto ? '1.5px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                }}>

                {/* Cabeçalho do card (sempre visível) */}
                <button onClick={() => setExpandido(aberto ? null : l.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)',
                    padding: 'var(--tja-space-4) var(--tja-space-5)', background: 'none', border: 'none',
                    cursor: 'pointer', font: 'inherit', textAlign: 'left',
                  }}>
                  {/* Avatar inicial */}
                  <span style={{
                    width: 44, height: 44, borderRadius: 999, flex: 'none',
                    background: 'var(--tja-primary-soft)', color: 'var(--tja-primary)',
                    display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 700,
                  }}>{loc.nome[0]}</span>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--tja-text-base)', color: 'var(--tja-text)' }}>{loc.nome}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 3, fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="tag" size={13} /> {pecas.length} {pecas.length === 1 ? 'peça' : 'peças'}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="calendar" size={13} /> Devolução {l.previsao}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--tja-text-faint)' }}>
                        <Icon name="list" size={13} /> {l.id}
                      </span>
                    </div>
                  </div>

                  {/* Valores resumidos */}
                  <div style={{ display: 'flex', gap: 'var(--tja-space-4)', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tja-text-soft)', fontWeight: 600 }}>Aluguel</div>
                      <div style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 'var(--tja-text-base)' }}>{BRL(aluguel)}</div>
                    </div>
                    <div style={{ width: 1, height: 28, background: 'var(--tja-border)' }} />
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tja-text-soft)', fontWeight: 600 }}>Caução</div>
                      <div style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 'var(--tja-text-base)' }}>{BRL(VALOR_CAUCAO)}</div>
                    </div>
                  </div>

                  <Badge state="aguardando_pgto" />

                  <Icon name={aberto ? 'chevronDown' : 'chevron'} size={18} style={{ color: 'var(--tja-text-soft)', flex: 'none', transform: aberto ? 'rotate(0)' : 'rotate(0)' }} />
                </button>

                {/* Detalhes expandidos */}
                {aberto && (
                  <div style={{ borderTop: '1px solid var(--tja-border)', padding: 'var(--tja-space-5)' }}>
                    {/* Dados do locatário */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tja-space-5)', marginBottom: 'var(--tja-space-5)' }}>
                      <div>
                        <div style={{ fontSize: 'var(--tja-text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tja-text-soft)', marginBottom: 10 }}>Locatário</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--tja-text-sm)' }}>
                          <div><strong>{loc.nome}</strong></div>
                          <div style={{ color: 'var(--tja-text-soft)' }}>{loc.cpf}</div>
                          <div style={{ color: 'var(--tja-text-soft)' }}>{loc.tel}</div>
                          <div style={{ color: 'var(--tja-text-soft)' }}>{loc.email}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--tja-text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tja-text-soft)', marginBottom: 10 }}>Peças da locação</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {pecas.map(p => (
                            <div key={p.id} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              fontSize: 'var(--tja-text-sm)', padding: '6px 0',
                              borderBottom: '1px solid var(--tja-border-soft)',
                            }}>
                              <div>
                                <div style={{ fontWeight: 500 }}>{p.nome}</div>
                                <div style={{ color: 'var(--tja-text-soft)', fontSize: 12 }}>{p.categoria} · Tam. {p.tamanho}</div>
                              </div>
                              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{BRL(VALOR_ALUGUEL)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown financeiro expandido */}
                    <div style={{
                      background: 'var(--tja-bg)', borderRadius: 'var(--tja-radius-md)',
                      padding: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-4)',
                    }}>
                      <div className="money-split">
                        <div className="money-line">
                          <span className="ml-label">Aluguel ({pecas.length} × {BRL(VALOR_ALUGUEL)})</span>
                          <span className="ml-value">{BRL(aluguel)}</span>
                        </div>
                        <div className="money-line">
                          <span className="ml-label">Caução (depósito reembolsável)</span>
                          <span className="ml-value">{BRL(VALOR_CAUCAO)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ação principal */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--tja-space-3)' }}>
                      <button className="btn btn-ghost" onClick={() => setExpandido(null)}
                        style={{ color: 'var(--tja-text-soft)' }}>
                        Fechar
                      </button>
                      <button className="btn btn-success"
                        onClick={() => setConfirmando(l)}
                        style={{ minHeight: 52, padding: '0 var(--tja-space-6)', fontSize: 'var(--tja-text-base)' }}>
                        <Icon name="check" size={18} /> Confirmar pagamento recebido
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de confirmação */}
      {confirmando && (
        <ConfirmModal
          locacao={confirmando}
          loc={locatario(confirmando.locatarioId)}
          aluguel={confirmando.pecasIds.length * VALOR_ALUGUEL}
          onConfirm={() => confirmar(confirmando)}
          onCancel={() => setConfirmando(null)} />
      )}
    </div>
  );
}

window.PagamentosPendentes = PagamentosPendentes;

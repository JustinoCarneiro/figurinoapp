/* global React, Icon, Badge, BRL, DEVOLUCOES, VALOR_CAUCAO, locatario, peca */
// ============================================================
// Tela 7 — Devolução de Caução (H5.2) · admin · Direção A
// Lista de devoluções a decidir. Decisão dupla:
//  • Devolver caução integral (verde) — sugerida se tudo OK
//  • Reter caução (vermelho) — exige motivo obrigatório
// Sistema SUGERE, nunca decide sozinho.
// ============================================================
const { useState } = React;

const AVAL_INFO = {
  ok: { label: 'Devolvida OK', state: 'disponivel', icon: 'check', cor: 'var(--tja-success)' },
  danificada: { label: 'Danificada', state: 'manutencao', icon: 'alert', cor: 'var(--tja-warning)' },
  nao_devolvida: { label: 'Não devolvida', state: 'nao_devolvida', icon: 'x', cor: 'var(--tja-danger)' },
};

function DecisaoModal({ devolucao, loc, tipo, onConfirm, onCancel }) {
  const [motivo, setMotivo] = useState('');
  const reter = tipo === 'reter';
  const podeConfirmar = !reter || motivo.trim().length >= 5;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(26,26,46,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 'var(--tja-space-6)' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 999, marginBottom: 'var(--tja-space-4)',
          background: reter ? 'var(--tja-danger-soft)' : 'var(--tja-success-soft)',
          color: reter ? 'var(--tja-danger)' : 'var(--tja-success)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={reter ? 'alert' : 'coin'} size={24} />
        </div>

        <h3 style={{ margin: '0 0 var(--tja-space-2)' }}>
          {reter ? 'Reter a caução?' : 'Devolver a caução integral?'}
        </h3>
        <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', lineHeight: 1.6 }}>
          {reter
            ? <>Você vai <strong>reter {BRL(devolucao.caucao)}</strong> da caução de <strong>{loc.nome}</strong>. Esta decisão é registrada e exige um motivo.</>
            : <>Você vai <strong>devolver {BRL(devolucao.caucao)}</strong> integralmente para <strong>{loc.nome}</strong>. A locação será finalizada.</>}
        </p>

        {reter && (
          <div className="field" style={{ marginBottom: 'var(--tja-space-5)' }}>
            <label>Motivo da retenção <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
            <textarea className="textarea" value={motivo} autoFocus
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ex.: Vestido Belle Époque devolvido com bainha descosturada e mancha. Custo estimado de reparo cobre a caução."
              rows={4}
              style={{ width: '100%', resize: 'vertical', minHeight: 'auto', padding: 'var(--tja-space-3) var(--tja-space-4)', lineHeight: 1.5 }} />
            <div className="hint">Mínimo de 5 caracteres. Este motivo fica registrado na locação.</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--tja-space-3)' }}>
          <button className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>Cancelar</button>
          <button
            className={reter ? 'btn btn-danger' : 'btn btn-success'}
            onClick={() => onConfirm(motivo)}
            disabled={!podeConfirmar}
            style={{ flex: 1.4 }}>
            <Icon name={reter ? 'alert' : 'check'} size={17} />
            {reter ? 'Confirmar retenção' : 'Confirmar devolução'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DevolucaoCaucao({ user, go }) {
  const [fila, setFila] = useState(DEVOLUCOES);
  const [decisao, setDecisao] = useState(null); // { devolucao, tipo }
  const [resolvidas, setResolvidas] = useState({}); // id → { tipo, motivo }

  function decidir(devolucao, tipo, motivo) {
    setResolvidas(prev => ({ ...prev, [devolucao.id]: { tipo, motivo } }));
    setDecisao(null);
    setTimeout(() => {
      setFila(prev => prev.filter(d => d.id !== devolucao.id));
    }, 1200);
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
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Administração</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Devolução de caução</h1>
          </div>
        </div>

        {/* Vazio */}
        {fila.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--tja-space-8)', color: 'var(--tja-text-soft)' }}>
            <span style={{ width: 60, height: 60, borderRadius: 999, background: 'var(--tja-success-soft)', display: 'inline-grid', placeItems: 'center', marginBottom: 12 }}>
              <Icon name="check" size={30} style={{ color: 'var(--tja-success)' }} />
            </span>
            <div><strong style={{ color: 'var(--tja-text)', fontSize: 'var(--tja-text-lg)' }}>Nenhuma devolução pendente.</strong></div>
            <p style={{ margin: '8px 0 0' }}>Todas as cauções foram decididas.</p>
          </div>
        )}

        {/* Cards de devolução */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-5)' }}>
          {fila.map(d => {
            const loc = locatario(d.locatarioId);
            const itens = d.itens.map(it => ({ ...it, peca: peca(it.pecaId) }));
            const temProblema = itens.some(it => it.avaliacao !== 'ok');
            const resolvida = resolvidas[d.id];

            return (
              <div key={d.id} className="panel"
                style={{
                  opacity: resolvida ? 0.55 : 1, transition: 'opacity 0.4s',
                  borderColor: resolvida ? (resolvida.tipo === 'reter' ? 'var(--tja-danger)' : 'var(--tja-success)') : 'var(--tja-border)',
                }}>
                {/* Cabeçalho */}
                <div className="panel-head">
                  <span style={{
                    width: 40, height: 40, borderRadius: 999, flex: 'none',
                    background: 'var(--tja-primary-soft)', color: 'var(--tja-primary)',
                    display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700,
                  }}>{loc.nome[0]}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--tja-text-lg)' }}>{loc.nome}</h3>
                    <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', display: 'flex', gap: 12 }}>
                      <span>{d.locacaoId}</span>
                      <span>Conferida por {d.conferidaPor.split(' ')[0]} em {d.conferidaEm}</span>
                    </div>
                  </div>
                  {/* Valor da caução */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tja-text-soft)', fontWeight: 600 }}>Caução</div>
                    <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-xl)', fontVariantNumeric: 'tabular-nums' }}>{BRL(d.caucao)}</div>
                  </div>
                </div>

                <div className="panel-body">
                  {/* Avaliação da figurinista */}
                  <div style={{ fontSize: 'var(--tja-text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tja-text-soft)', marginBottom: 'var(--tja-space-3)' }}>
                    Avaliação da figurinista
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-2)', marginBottom: 'var(--tja-space-5)' }}>
                    {itens.map(it => {
                      const info = AVAL_INFO[it.avaliacao];
                      return (
                        <div key={it.pecaId} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 'var(--tja-space-3)',
                          padding: 'var(--tja-space-3) var(--tja-space-4)',
                          background: it.avaliacao !== 'ok' ? 'var(--tja-bg)' : 'transparent',
                          border: '1px solid var(--tja-border)', borderRadius: 'var(--tja-radius-md)',
                        }}>
                          <span style={{
                            width: 26, height: 26, borderRadius: 999, flex: 'none', marginTop: 1,
                            background: info.cor, color: '#fff', display: 'grid', placeItems: 'center',
                          }}>
                            <Icon name={info.icon} size={14} />
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 600 }}>{it.peca?.nome}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: info.cor }}>{info.label}</span>
                            </div>
                            {it.obs && (
                              <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', marginTop: 4, fontStyle: 'italic' }}>
                                "{it.obs}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Já resolvida → mostra resultado */}
                  {resolvida ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: 'var(--tja-space-4)', borderRadius: 'var(--tja-radius-md)',
                      background: resolvida.tipo === 'reter' ? 'var(--tja-danger-soft)' : 'var(--tja-success-soft)',
                      color: resolvida.tipo === 'reter' ? 'var(--tja-danger)' : 'var(--tja-success)',
                      fontWeight: 600,
                    }}>
                      <Icon name={resolvida.tipo === 'reter' ? 'alert' : 'check'} size={18} />
                      {resolvida.tipo === 'reter'
                        ? `Caução de ${BRL(d.caucao)} retida.`
                        : `Caução de ${BRL(d.caucao)} devolvida integralmente.`}
                    </div>
                  ) : (
                    <>
                      {/* Sugestão do sistema */}
                      <div style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        padding: '12px 16px', marginBottom: 'var(--tja-space-4)',
                        borderRadius: 'var(--tja-radius-md)',
                        background: temProblema ? 'var(--tja-warning-soft)' : 'var(--tja-info-soft)',
                        color: temProblema ? 'var(--tja-warning)' : 'var(--tja-info)',
                        fontSize: 'var(--tja-text-sm)',
                      }}>
                        <Icon name="alert" size={16} style={{ flex: 'none', marginTop: 1 }} />
                        <span style={{ color: 'var(--tja-text)' }}>
                          {temProblema
                            ? <><strong>Há peças com problema.</strong> Avalie se o dano justifica reter a caução — a decisão é sua.</>
                            : <><strong>Sugestão do sistema:</strong> todas as peças voltaram OK. O recomendado é devolver a caução integral.</>}
                        </span>
                      </div>

                      {/* Decisão dupla */}
                      <div style={{ display: 'flex', gap: 'var(--tja-space-3)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-danger" onClick={() => setDecisao({ devolucao: d, tipo: 'reter' })}
                          style={{ minHeight: 52, padding: '0 var(--tja-space-5)' }}>
                          <Icon name="alert" size={17} /> Reter caução
                        </button>
                        <button className="btn btn-success" onClick={() => setDecisao({ devolucao: d, tipo: 'devolver' })}
                          style={{ minHeight: 52, padding: '0 var(--tja-space-6)' }}>
                          <Icon name="check" size={17} /> Devolver caução integral
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {decisao && (
        <DecisaoModal
          devolucao={decisao.devolucao}
          loc={locatario(decisao.devolucao.locatarioId)}
          tipo={decisao.tipo}
          onConfirm={(motivo) => decidir(decisao.devolucao, decisao.tipo, motivo)}
          onCancel={() => setDecisao(null)} />
      )}
    </div>
  );
}

window.DevolucaoCaucao = DevolucaoCaucao;

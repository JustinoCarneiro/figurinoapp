/* global React, Icon, Badge, BRL, LOCACOES, PECAS, VALOR_CAUCAO, locatario, peca */
// ============================================================
// Tela 6 — Registrar Devolução (H5.1) · figurinista · Direção A
// Etapa A: buscar locação ativa → Etapa B: conferir cada peça.
// 3 avaliações claras: Ok / Danificada / Não devolvida + obs.
// ============================================================
const { useState, useMemo } = React;

const AVALIACOES = [
  { key: 'ok', label: 'Devolvida OK', icon: 'check', cor: 'var(--tja-success)', soft: 'var(--tja-success-soft)', desc: 'Peça voltou em bom estado' },
  { key: 'danificada', label: 'Danificada', icon: 'alert', cor: 'var(--tja-warning)', soft: 'var(--tja-warning-soft)', desc: 'Voltou com avaria' },
  { key: 'nao_devolvida', label: 'Não devolvida', icon: 'x', cor: 'var(--tja-danger)', soft: 'var(--tja-danger-soft)', desc: 'Peça não retornou' },
];

// ---------- Etapa A: selecionar locação ativa ----------
function SelecionarLocacao({ onSelect, go }) {
  const [busca, setBusca] = useState('');
  const ativas = useMemo(() =>
    LOCACOES.filter(l => l.estado === 'em_uso' || l.estado === 'atrasada')
      .filter(l => {
        const loc = locatario(l.locatarioId);
        const pecasNomes = l.pecasIds.map(id => peca(id)?.nome || '').join(' ');
        const hay = (loc.nome + ' ' + pecasNomes + ' ' + l.id).toLowerCase();
        return hay.includes(busca.toLowerCase());
      }), [busca]);

  return (
    <div>
      <h2 style={{ margin: '0 0 var(--tja-space-2)' }}>Qual locação está voltando?</h2>
      <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-lg)' }}>
        Busque pelo nome do locatário ou pela peça emprestada.
      </p>

      <div className="input-icon" style={{ marginBottom: 'var(--tja-space-5)', maxWidth: 520 }}>
        <Icon name="search" size={17} />
        <input className="input" value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por locatário ou peça…" autoFocus />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-3)', maxWidth: 760 }}>
        {ativas.map(l => {
          const loc = locatario(l.locatarioId);
          const pecas = l.pecasIds.map(id => peca(id)).filter(Boolean);
          return (
            <button key={l.id} onClick={() => onSelect(l)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)',
                padding: 'var(--tja-space-4)', textAlign: 'left', font: 'inherit',
                background: 'var(--tja-bg-elevated)', border: '1px solid var(--tja-border)',
                borderRadius: 'var(--tja-radius-md)', cursor: 'pointer',
                transition: 'border-color var(--tja-duration) var(--tja-ease)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--tja-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--tja-border)'}>
              <span style={{
                width: 44, height: 44, borderRadius: 999, flex: 'none',
                background: 'var(--tja-primary-soft)', color: 'var(--tja-primary)',
                display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 700,
              }}>{loc.nome[0]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--tja-text)' }}>{loc.nome}</div>
                <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', marginTop: 3, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="tag" size={13} /> {pecas.map(p => p.nome).join(', ')}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={13} /> Devolução {l.previsao}</span>
                </div>
              </div>
              {l.estado === 'atrasada' && <Badge state="atrasada" />}
              {l.estado === 'em_uso' && <Badge state="em_uso" />}
              <Icon name="chevron" size={18} style={{ color: 'var(--tja-text-soft)', flex: 'none' }} />
            </button>
          );
        })}
        {ativas.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--tja-space-6)', color: 'var(--tja-text-soft)' }}>
            Nenhuma locação ativa encontrada{busca ? ` para "${busca}"` : ''}.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Etapa B: conferência ----------
function Conferencia({ locacao, onBack, onEnviar, loading }) {
  const loc = locatario(locacao.locatarioId);
  const pecas = locacao.pecasIds.map(id => peca(id)).filter(Boolean);
  const [avals, setAvals] = useState(() =>
    Object.fromEntries(pecas.map(p => [p.id, { avaliacao: null, obs: '' }]))
  );

  function setAval(id, avaliacao) {
    setAvals(prev => ({ ...prev, [id]: { ...prev[id], avaliacao } }));
  }
  function setObs(id, obs) {
    setAvals(prev => ({ ...prev, [id]: { ...prev[id], obs } }));
  }

  const todasAvaliadas = pecas.every(p => avals[p.id].avaliacao);
  const temProblema = pecas.some(p => avals[p.id].avaliacao && avals[p.id].avaliacao !== 'ok');

  return (
    <div style={{ paddingBottom: 100 }}>
      <button className="link-btn" onClick={onBack} style={{ marginBottom: 'var(--tja-space-4)' }}>
        <Icon name="arrowLeft" size={16} /> Escolher outra locação
      </button>

      {/* Cabeçalho da locação */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-5)' }}>
        <span style={{
          width: 48, height: 48, borderRadius: 999, flex: 'none',
          background: 'var(--tja-primary-soft)', color: 'var(--tja-primary)',
          display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 700,
        }}>{loc.nome[0]}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--tja-text-lg)' }}>{loc.nome}</div>
          <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', display: 'flex', gap: 14 }}>
            <span>{locacao.id}</span>
            <span>Saída em {locacao.criadaEm}</span>
            <span>Devolução prevista {locacao.previsao}</span>
          </div>
        </div>
        {locacao.estado === 'atrasada' && <Badge state="atrasada" />}
      </div>

      <h2 style={{ margin: '0 0 var(--tja-space-2)' }}>Confira cada peça</h2>
      <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-base)' }}>
        Marque como a peça voltou. Se houver avaria ou ausência, descreva no campo de observação.
      </p>

      {/* Lista de peças */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-4)' }}>
        {pecas.map((p, i) => {
          const cur = avals[p.id];
          const precisaObs = cur.avaliacao && cur.avaliacao !== 'ok';
          return (
            <div key={p.id} className="panel" style={{ padding: 'var(--tja-space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-4)' }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 'var(--tja-radius-sm)', flex: 'none',
                  background: 'var(--tja-bg-muted)', color: 'var(--tja-text-soft)',
                  display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700,
                }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--tja-text-base)' }}>{p.nome}</div>
                  <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>{p.categoria} · Tam. {p.tamanho} · {p.cor}</div>
                </div>
              </div>

              {/* 3 opções de avaliação */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--tja-space-3)' }}>
                {AVALIACOES.map(a => {
                  const ativo = cur.avaliacao === a.key;
                  return (
                    <button key={a.key} onClick={() => setAval(p.id, a.key)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
                        padding: 'var(--tja-space-4)', textAlign: 'left', font: 'inherit', cursor: 'pointer',
                        background: ativo ? a.soft : 'var(--tja-bg-elevated)',
                        border: ativo ? `1.5px solid ${a.cor}` : '1px solid var(--tja-border)',
                        borderRadius: 'var(--tja-radius-md)',
                        transition: 'border-color var(--tja-duration) var(--tja-ease), background var(--tja-duration) var(--tja-ease)',
                      }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: ativo ? a.cor : 'var(--tja-text)', fontWeight: 700, fontSize: 'var(--tja-text-sm)' }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 999, flex: 'none',
                          background: ativo ? a.cor : 'var(--tja-bg-muted)',
                          color: ativo ? '#fff' : 'var(--tja-text-faint)',
                          display: 'grid', placeItems: 'center',
                        }}>
                          <Icon name={a.icon} size={13} />
                        </span>
                        {a.label}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--tja-text-soft)', paddingLeft: 30 }}>{a.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Observação — aparece quando há problema, mas sempre disponível */}
              <div style={{ marginTop: 'var(--tja-space-4)' }}>
                <textarea
                  className="textarea"
                  value={cur.obs}
                  onChange={e => setObs(p.id, e.target.value)}
                  placeholder={precisaObs ? 'Descreva a avaria ou o ocorrido (recomendado)…' : 'Observação (opcional)…'}
                  rows={precisaObs ? 2 : 1}
                  style={{
                    width: '100%', resize: 'vertical', padding: 'var(--tja-space-3) var(--tja-space-4)',
                    minHeight: 'auto', lineHeight: 1.5,
                    borderColor: precisaObs ? a_border(cur.avaliacao) : 'var(--tja-border)',
                  }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer fixo */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--tja-bg-elevated)', borderTop: '1px solid var(--tja-border)',
        boxShadow: '0 -4px 16px rgba(26,26,46,0.08)', padding: '0 var(--tja-space-6)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)', minHeight: 72 }}>
          <div style={{ flex: 1, fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>
            {todasAvaliadas
              ? temProblema
                ? <span style={{ color: 'var(--tja-warning)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="alert" size={15} /> Há peças com avaria ou ausência — a administração decidirá sobre a caução.</span>
                : <span style={{ color: 'var(--tja-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={15} /> Todas as peças OK — caução deverá ser devolvida.</span>
              : `${pecas.filter(p => avals[p.id].avaliacao).length} de ${pecas.length} peças conferidas`}
          </div>
          <button className="btn btn-primary"
            onClick={() => onEnviar(avals)}
            disabled={!todasAvaliadas || loading}
            style={{ minHeight: 52, minWidth: 230, fontSize: 'var(--tja-text-base)' }}>
            {loading ? 'Enviando…' : <><Icon name="out" size={17} /> Enviar para administração</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function a_border(aval) {
  if (aval === 'danificada') return 'var(--tja-warning)';
  if (aval === 'nao_devolvida') return 'var(--tja-danger)';
  return 'var(--tja-border)';
}

// ---------- Sucesso ----------
function SucessoDevol({ loc, onNova, go }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', gap: 'var(--tja-space-5)' }}>
      <span style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--tja-success-soft)', color: 'var(--tja-success)', display: 'grid', placeItems: 'center' }}>
        <Icon name="check" size={38} />
      </span>
      <div>
        <h1 style={{ margin: '0 0 8px' }}>Conferência enviada!</h1>
        <p style={{ margin: 0, fontSize: 'var(--tja-text-lg)', color: 'var(--tja-text-soft)', maxWidth: 440 }}>
          A administração vai analisar a devolução de <strong style={{ color: 'var(--tja-text)' }}>{loc?.nome.split(' ')[0]}</strong> e
          decidir sobre a caução.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--tja-space-3)' }}>
        <button className="btn btn-secondary" onClick={onNova}><Icon name="in" size={17} /> Nova devolução</button>
        <button className="btn btn-primary" onClick={() => go('home')}>Voltar ao início <Icon name="chevron" size={17} /></button>
      </div>
    </div>
  );
}

// ---------- Principal ----------
function RegistrarDevolucao({ user, go }) {
  const [locacao, setLocacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function enviar(avals) {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  }
  function nova() { setLocacao(null); setDone(false); }

  const loc = locacao ? locatario(locacao.locatarioId) : null;

  return (
    <div className="page" style={{ paddingBottom: locacao && !done ? 100 : 'var(--tja-space-7)' }}>
      <div className="page-inner" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)', marginBottom: 'var(--tja-space-6)' }}>
          <button className="btn btn-ghost" onClick={() => go('home')}
            style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Devolução</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Registrar devolução</h1>
          </div>
        </div>

        {done
          ? <SucessoDevol loc={loc} onNova={nova} go={go} />
          : !locacao
            ? <SelecionarLocacao onSelect={setLocacao} go={go} />
            : <Conferencia locacao={locacao} onBack={() => setLocacao(null)} onEnviar={enviar} loading={loading} />}
      </div>
    </div>
  );
}

window.RegistrarDevolucao = RegistrarDevolucao;

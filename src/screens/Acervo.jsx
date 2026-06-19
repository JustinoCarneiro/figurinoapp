/* global React, Icon, Badge, PECAS, STATE_LABELS */
// ============================================================
// Tela 8 — Acervo (H6.1) · ambos · Direção A
// Grid de peças: foto, nome, estado, tamanho.
// Busca textual + filtro por estado. "Cadastrar nova peça".
// ============================================================
const { useState, useMemo } = React;

function PecaFoto({ peca }) {
  const [erro, setErro] = useState(false);
  return (
    <div style={{
      aspectRatio: '4 / 3', width: '100%', position: 'relative',
      background: 'var(--tja-bg-muted)',
      display: 'grid', placeItems: 'center', overflow: 'hidden',
      borderTopLeftRadius: 'var(--tja-radius-lg)', borderTopRightRadius: 'var(--tja-radius-lg)',
    }}>
      {peca.foto && !erro ? (
        <img
          src={peca.foto}
          alt={peca.nome}
          onError={() => setErro(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--tja-text-faint)' }}>
          <Icon name="hanger" size={34} />
          <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{peca.categoria}</span>
        </div>
      )}
    </div>
  );
}

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'disponivel', label: 'Disponível' },
  { key: 'em_uso', label: 'Em uso' },
  { key: 'manutencao', label: 'Em manutenção' },
];

function Acervo({ user, go }) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const pecas = useMemo(() =>
    PECAS.filter(p => {
      const matchFiltro = filtro === 'todos' || p.estado === filtro;
      const hay = (p.nome + ' ' + p.categoria + ' ' + p.cor + ' ' + p.material).toLowerCase();
      return matchFiltro && hay.includes(busca.toLowerCase());
    }), [busca, filtro]);

  const contagem = (k) => k === 'todos' ? PECAS.length : PECAS.filter(p => p.estado === k).length;

  return (
    <div className="page">
      <div className="page-inner">
        {/* Cabeçalho */}
        <div className="between" style={{ marginBottom: 'var(--tja-space-5)', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)' }}>
            <button className="btn btn-ghost" onClick={() => go('home')}
              style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
              <Icon name="arrowLeft" size={18} />
            </button>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>Acervo</p>
              <h1 style={{ margin: 0 }}>Peças do acervo</h1>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => go('cadastro-peca')}>
            <Icon name="plus" size={18} /> Cadastrar nova peça
          </button>
        </div>

        {/* Barra de busca + filtros */}
        <div style={{ display: 'flex', gap: 'var(--tja-space-4)', marginBottom: 'var(--tja-space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="input-icon" style={{ flex: 1, minWidth: 280, maxWidth: 440 }}>
            <Icon name="search" size={17} />
            <input className="input" value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome, categoria, cor…" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--tja-space-2)', flexWrap: 'wrap' }}>
            {FILTROS.map(f => {
              const ativo = filtro === f.key;
              return (
                <button key={f.key} onClick={() => setFiltro(f.key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '0 var(--tja-space-4)', height: 44, font: 'inherit', cursor: 'pointer',
                    fontSize: 'var(--tja-text-sm)', fontWeight: 600,
                    background: ativo ? 'var(--tja-primary)' : 'var(--tja-bg-elevated)',
                    color: ativo ? 'var(--tja-text-on-dark)' : 'var(--tja-text-soft)',
                    border: ativo ? '1px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                    borderRadius: 'var(--tja-radius-md)',
                  }}>
                  {f.label}
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
                    background: ativo ? 'rgba(255,255,255,0.2)' : 'var(--tja-bg-muted)',
                    color: ativo ? '#fff' : 'var(--tja-text-soft)',
                  }}>{contagem(f.key)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de peças */}
        {pecas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--tja-space-8)', color: 'var(--tja-text-soft)' }}>
            <Icon name="search" size={32} style={{ color: 'var(--tja-text-faint)' }} />
            <p style={{ margin: '12px 0 0', fontSize: 'var(--tja-text-lg)' }}>Nenhuma peça encontrada.</p>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--tja-text-sm)' }}>Tente outra busca ou filtro.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 'var(--tja-space-5)' }}>
            {pecas.map(p => (
              <button key={p.id} onClick={() => { window.__pecaEdit = p; go('cadastro-peca'); }}
                style={{
                  display: 'flex', flexDirection: 'column', textAlign: 'left', font: 'inherit', cursor: 'pointer',
                  background: 'var(--tja-bg-elevated)', border: '1px solid var(--tja-border)',
                  borderRadius: 'var(--tja-radius-lg)', overflow: 'hidden', padding: 0,
                  boxShadow: 'var(--tja-shadow-sm)',
                  transition: 'transform var(--tja-duration) var(--tja-ease), box-shadow var(--tja-duration) var(--tja-ease), border-color var(--tja-duration) var(--tja-ease)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--tja-shadow-md)'; e.currentTarget.style.borderColor = 'var(--tja-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--tja-shadow-sm)'; e.currentTarget.style.borderColor = 'var(--tja-border)'; }}>
                <PecaFoto peca={p} />
                <div style={{ padding: 'var(--tja-space-4)', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 'var(--tja-text-lg)', lineHeight: 1.2, color: 'var(--tja-text)' }}>{p.nome}</span>
                  </div>
                  <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span>Tam. {p.tamanho}</span>
                    <span>·</span>
                    <span>{p.cor}</span>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                    <Badge state={p.estado} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.Acervo = Acervo;

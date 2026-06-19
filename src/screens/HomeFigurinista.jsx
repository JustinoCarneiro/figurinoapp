/* global React, Icon, METRICAS */
// ============================================================
// Tela 2 — Home da Figurinista (H1.2) · Direção A
// ============================================================
function HomeFigurinista({ user, go }) {
  const atrasadas = METRICAS.atrasadasHoje;

  const acoes = [
    {
      key: 'nova-locacao', icon: 'out',
      titulo: 'Registrar saída',
      desc: 'Emprestar peças a um locatário.',
      primary: true,
    },
    {
      key: 'devolucao', icon: 'in',
      titulo: 'Registrar devolução',
      desc: 'Conferir peças que voltaram ao acervo.',
      primary: false,
    },
    {
      key: 'cadastro-peca', icon: 'plus',
      titulo: 'Cadastrar peça',
      desc: 'Adicionar um figurino ao acervo.',
      primary: false,
    },
  ];

  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth: 1020 }}>

        {/* Saudação */}
        <div style={{ marginBottom: 'var(--tja-space-7)' }}>
          <p className="eyebrow">Sala da Figurinista</p>
          <h1 style={{ fontSize: 'var(--tja-text-4xl)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Bom dia, {user.name.split(' ')[0]}
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--tja-text-lg)', color: 'var(--tja-text-soft)' }}>
            O que você quer fazer agora?
          </p>
        </div>

        {/* Alerta de atrasadas — cor + texto + ícone */}
        {atrasadas > 0 && (
          <button onClick={() => go('relatorio-pecas-fora')} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--tja-warning-soft)', color: 'var(--tja-text)',
            border: '1px solid rgba(184,134,11,0.3)',
            borderRadius: 'var(--tja-radius-md)',
            padding: '14px 18px', marginBottom: 'var(--tja-space-6)',
            cursor: 'pointer', textAlign: 'left', font: 'inherit',
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 'var(--tja-radius-sm)',
              flex: 'none', background: 'var(--tja-warning)', color: '#fff',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name="clock" size={18} />
            </span>
            <span style={{ flex: 1, fontSize: 'var(--tja-text-base)' }}>
              <strong>{atrasadas} {atrasadas === 1 ? 'locação atrasada' : 'locações atrasadas'}</strong>
              {' — '}<span style={{ color: 'var(--tja-text-soft)' }}>passou da data de devolução prevista.</span>
            </span>
            <span style={{ color: 'var(--tja-warning)', fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Ver lista <Icon name="chevron" size={15} />
            </span>
          </button>
        )}

        {/* 3 cards de ação */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--tja-space-5)' }}>
          {acoes.map((a) => (
            <button key={a.key} onClick={() => go(a.key)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                gap: 20, background: 'var(--tja-bg-elevated)',
                border: a.primary ? '1.5px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                borderRadius: 'var(--tja-radius-lg)', padding: '28px 26px',
                cursor: 'pointer', textAlign: 'left', minHeight: 210,
                boxShadow: a.primary ? 'var(--tja-shadow-md)' : 'var(--tja-shadow-sm)',
                transition: 'transform var(--tja-duration) var(--tja-ease), box-shadow var(--tja-duration) var(--tja-ease), border-color var(--tja-duration) var(--tja-ease)',
                font: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--tja-shadow-md)'; e.currentTarget.style.borderColor = 'var(--tja-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = a.primary ? 'var(--tja-shadow-md)' : 'var(--tja-shadow-sm)'; e.currentTarget.style.borderColor = a.primary ? 'var(--tja-primary)' : 'var(--tja-border)'; }}>

              <span style={{
                width: 52, height: 52, borderRadius: 'var(--tja-radius-md)', flex: 'none',
                background: a.primary ? 'var(--tja-primary)' : 'var(--tja-primary-soft)',
                color: a.primary ? 'var(--tja-text-on-dark)' : 'var(--tja-primary)',
                display: 'grid', placeItems: 'center',
              }}>
                <Icon name={a.icon} size={26} />
              </span>

              <span style={{ flex: 1 }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--tja-font-display)', fontWeight: 600,
                  fontSize: 'var(--tja-text-2xl)', color: 'var(--tja-text)', lineHeight: 1.2,
                }}>{a.titulo}</span>
                <span style={{
                  display: 'block', marginTop: 8,
                  color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-base)', lineHeight: 1.5,
                }}>{a.desc}</span>
              </span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--tja-primary)', fontWeight: 600, fontSize: 'var(--tja-text-sm)' }}>
                Começar <Icon name="chevron" size={16} />
              </span>
            </button>
          ))}
        </div>

        {/* Atalho secundário */}
        <div style={{ textAlign: 'center', marginTop: 'var(--tja-space-6)' }}>
          <button className="link-btn" onClick={() => go('acervo')}
            style={{ fontSize: 'var(--tja-text-base)' }}>
            <Icon name="search" size={17} /> Procurar uma peça no acervo
          </button>
        </div>
      </div>
    </div>
  );
}

window.HomeFigurinista = HomeFigurinista;

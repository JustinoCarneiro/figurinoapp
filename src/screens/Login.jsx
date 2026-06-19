/* global React, Icon, Emblem, Field, USERS */
// ============================================================
// Tela 1 — Login (H1.1) · Direção A: Institucional Confiável
// ============================================================
function Login({ onLogin }) {
  const { useState } = React;
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function entrar(e) {
    e.preventDefault();
    const u = usuario.trim().toLowerCase();
    if (!u || !senha) { setErro('Preencha usuário e senha para entrar.'); return; }
    if (u.startsWith('rai') || u.startsWith('adm')) { onLogin(USERS.admin); return; }
    if (u.startsWith('con') || u.startsWith('fig')) { onLogin(USERS.figurinista); return; }
    setErro('Usuário ou senha incorretos. Tente novamente ou procure a administração.');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.1fr', background: 'var(--tja-bg)' }}>

      {/* Painel esquerdo — identidade institucional sóbria */}
      <aside style={{
        background: 'var(--tja-text)',   /* #1A1A2E — quase-preto azulado, NÃO índigo */
        padding: '56px 60px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Topo: emblema + nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Versão branca do emblema no painel escuro */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="rgba(255,255,255,0.10)" />
            <rect x="1" y="1" width="38" height="38" rx="7" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="20" y="27" textAnchor="middle"
              fontFamily="'Source Serif 4', Georgia, serif"
              fontWeight="600" fontSize="17" fill="white" letterSpacing="0.5">TJA</text>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--tja-font-display)', fontWeight: 600, fontSize: 18, color: '#fff', lineHeight: 1.1 }}>Figurinos TJA</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>Theatro José de Alencar</div>
          </div>
        </div>

        {/* Centro: descrição */}
        <div>
          <div style={{
            display: 'inline-block', padding: '4px 12px',
            background: 'rgba(255,255,255,0.08)', borderRadius: 4,
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 24,
          }}>Sistema de Gestão · MVP</div>
          <h1 style={{
            fontFamily: 'var(--tja-font-display)', fontWeight: 600,
            fontSize: 40, lineHeight: 1.15, margin: '0 0 20px',
            color: '#fff', letterSpacing: '-0.01em',
          }}>
            Acervo,<br />locações<br />e devoluções.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.62)', margin: 0, maxWidth: 340 }}>
            A ferramenta interna que conecta a sala da figurinista
            à administração do teatro — sem planilha, sem papel.
          </p>
        </div>

        {/* Rodapé */}
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
          Fortaleza · Ceará · SECULT-CE
        </div>
      </aside>

      {/* Painel direito — formulário */}
      <main style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 56px', background: 'var(--tja-bg-elevated)',
      }}>
        <form onSubmit={entrar} style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontFamily: 'var(--tja-font-display)', fontSize: 30, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Entrar no sistema
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: 15, color: 'var(--tja-text-soft)', lineHeight: 1.5 }}>
            Use seu usuário e senha do teatro.
          </p>

          <div className="stack" style={{ gap: 20 }}>
            <Field label="Usuário">
              <div className="input-icon">
                <Icon name="user" size={17} />
                <input className="input" value={usuario} autoFocus
                  onChange={e => { setUsuario(e.target.value); setErro(''); }}
                  placeholder="seu.usuario" autoComplete="username" />
              </div>
            </Field>

            <Field label="Senha">
              <div className="input-icon">
                <Icon name="lock" size={17} />
                <input className="input" type="password" value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(''); }}
                  placeholder="••••••••" autoComplete="current-password" />
              </div>
            </Field>

            {erro && (
              <div role="alert" style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                background: 'var(--tja-danger-soft)', color: 'var(--tja-danger)',
                border: '1px solid rgba(181,58,58,0.25)',
                borderRadius: 'var(--tja-radius-md)',
                padding: '12px 14px', fontSize: 14, fontWeight: 600,
              }}>
                <Icon name="alert" size={17} style={{ flex: 'none', marginTop: 1 }} />
                <span>{erro}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: 4 }}>
              Entrar
            </button>
          </div>

          <p style={{ fontSize: 13, marginTop: 20, color: 'var(--tja-text-soft)', lineHeight: 1.6 }}>
            Esqueceu a senha? Fale com a administração — o acesso é redefinido por lá.
          </p>

          <div style={{
            marginTop: 28, paddingTop: 18,
            borderTop: '1px solid var(--tja-border)',
            fontSize: 12.5, color: 'var(--tja-text-faint)', lineHeight: 1.8,
          }}>
            <strong style={{ color: 'var(--tja-text-soft)', fontWeight: 600 }}>Demonstração:</strong>{' '}
            <code style={{ fontFamily: 'var(--tja-font-mono)', color: 'var(--tja-primary)' }}>conceicao</code> → figurinista{' · '}
            <code style={{ fontFamily: 'var(--tja-font-mono)', color: 'var(--tja-primary)' }}>raimundo</code> → administração.{' '}
            Senha: qualquer.
          </div>
        </form>
      </main>
    </div>
  );
}

window.Login = Login;

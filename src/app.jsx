/* global React, ReactDOM, TopBar, Login, HomeFigurinista, HomeAdmin, Icon */
// ============================================================
// Figurinos TJA — App shell + roteador + navegador de protótipo
// ============================================================
const { useState, useEffect } = React;

// Registro das 12 telas (ordem do briefing). built=false → placeholder.
const SCREENS = [
  { key: 'login', n: 1, bloco: 'Acesso e Home', nome: 'Login', perfil: 'ambos', built: true },
  { key: 'home-figurinista', n: 2, bloco: 'Acesso e Home', nome: 'Home da Figurinista', perfil: 'figurinista', built: true },
  { key: 'home-admin', n: 3, bloco: 'Acesso e Home', nome: 'Home da Administração', perfil: 'admin', built: true },
  { key: 'nova-locacao', n: 4, bloco: 'Fluxo de Locação', nome: 'Nova Locação', perfil: 'figurinista', built: true },
  { key: 'pagamentos', n: 5, bloco: 'Fluxo de Locação', nome: 'Pagamentos Pendentes', perfil: 'admin', built: true },
  { key: 'devolucao', n: 6, bloco: 'Fluxo de Devolução', nome: 'Registrar Devolução', perfil: 'figurinista', built: true },
  { key: 'devolucao-caucao', n: 7, bloco: 'Fluxo de Devolução', nome: 'Devolução de Caução', perfil: 'admin', built: true },
  { key: 'acervo', n: 8, bloco: 'Cadastros', nome: 'Acervo', perfil: 'ambos', built: true },
  { key: 'cadastro-peca', n: 9, bloco: 'Cadastros', nome: 'Cadastro de Peça', perfil: 'figurinista', built: true },
  { key: 'cadastro-locatario', n: 10, bloco: 'Cadastros', nome: 'Cadastro de Locatário', perfil: 'ambos', built: true },
  { key: 'relatorio-receita', n: 11, bloco: 'Relatórios', nome: 'Receita do mês', perfil: 'admin', built: true },
  { key: 'relatorio-pecas-fora', n: 12, bloco: 'Relatórios', nome: 'Peças Fora', perfil: 'admin', built: true },
];
const screenByKey = (k) => SCREENS.find(s => s.key === k);

function Placeholder({ scr, go }) {
  return (
    <div className="page">
      <div className="page-narrow" style={{ textAlign: 'center', paddingTop: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          background: 'var(--tja-bg-muted)', color: 'var(--tja-text-soft)', borderRadius: 999,
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18,
        }}>
          Tela {String(scr.n).padStart(2, '0')} · {scr.bloco}
        </div>
        <h1 style={{ fontSize: 'var(--tja-text-3xl)', margin: '0 0 10px' }}>{scr.nome}</h1>
        <p className="muted" style={{ fontSize: 'var(--tja-text-lg)', maxWidth: 520, margin: '0 auto 28px' }}>
          Esta tela entra num próximo bloco da Fase 2b. O Bloco 1 (Login, Home da Figurinista
          e Home da Administração) já está pronto para sua validação.
        </p>
        <button className="btn btn-secondary" onClick={() => go('home')}>
          <Icon name="arrowLeft" size={18} /> Voltar para o início
        </button>
      </div>
    </div>
  );
}

function ProtoNav({ current, user, onJump }) {
  const [open, setOpen] = useState(false);
  const groups = [...new Set(SCREENS.map(s => s.bloco))];
  return (
    <>
      <button className="proto-fab" onClick={() => setOpen(o => !o)}>
        <Icon name={open ? 'x' : 'list'} size={18} /> Telas do protótipo
      </button>
      {open && (
        <div className="proto-panel">
          <div className="ph">
            <span className="t">Navegação · 12 telas</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tja-text-soft)' }}>
              <Icon name="x" size={16} />
            </button>
          </div>
          <div className="proto-list">
            {groups.map(g => (
              <div key={g}>
                <div className="proto-group">{g}</div>
                {SCREENS.filter(s => s.bloco === g).map(s => (
                  <button key={s.key} className={'proto-item' + (current === s.key ? ' active' : '')}
                    onClick={() => { onJump(s.key); setOpen(false); }}>
                    <span className="nidx">{s.n}</span>
                    <span style={{ flex: 1 }}>{s.nome}</span>
                    {!s.built && <span style={{ fontSize: 10, color: 'var(--tja-text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>em breve</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');

  // Persistência leve da posição no protótipo (refresh-friendly).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tja_proto') || 'null');
      if (saved && saved.user) { setUser(saved.user); setScreen(saved.screen || 'home'); }
    } catch (e) { /* noop */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('tja_proto', JSON.stringify({ user, screen })); } catch (e) { /* noop */ }
  }, [user, screen]);

  function go(key) {
    if (key === 'home') { setScreen(user && user.perfil === 'admin' ? 'home-admin' : 'home-figurinista'); return; }
    setScreen(key);
  }
  function login(u) { setUser(u); setScreen(u.perfil === 'admin' ? 'home-admin' : 'home-figurinista'); }
  function logout() { setUser(null); setScreen('login'); }

  function jump(key) {
    // Navegador do protótipo: pode pular pra qualquer tela, garantindo sessão.
    if (key === 'login') { logout(); return; }
    const scr = screenByKey(key);
    if (!user) { setUser(scr && scr.perfil === 'admin' ? window.USERS.admin : window.USERS.figurinista); }
    else if (scr && scr.perfil !== 'ambos' && scr.perfil !== user.perfil) {
      setUser(scr.perfil === 'admin' ? window.USERS.admin : window.USERS.figurinista);
    }
    setScreen(key);
  }

  const scr = screenByKey(screen);
  const isLogin = screen === 'login' || !user;

  let body;
  if (isLogin) {
    body = <Login onLogin={login} />;
  } else if (screen === 'home-figurinista') {
    body = <HomeFigurinista user={user} go={go} />;
  } else if (screen === 'home-admin') {
    body = <HomeAdmin user={user} go={go} />;
  } else if (screen === 'nova-locacao') {
    body = <NovaLocacao user={user} go={go} />;
  } else if (screen === 'pagamentos') {
    body = <PagamentosPendentes user={user} go={go} />;
  } else if (screen === 'devolucao') {
    body = <RegistrarDevolucao user={user} go={go} />;
  } else if (screen === 'devolucao-caucao') {
    body = <DevolucaoCaucao user={user} go={go} />;
  } else if (screen === 'acervo') {
    body = <Acervo user={user} go={go} />;
  } else if (screen === 'cadastro-peca') {
    body = <CadastroPeca user={user} go={go} />;
  } else if (screen === 'cadastro-locatario') {
    body = <CadastroLocatario user={user} go={go} />;
  } else if (screen === 'relatorio-receita') {
    body = <RelatorioReceita user={user} go={go} />;
  } else if (screen === 'relatorio-pecas-fora') {
    body = <RelatorioPecasFora user={user} go={go} />;
  } else if (scr && scr.built) {
    const Comp = window[scr.comp];
    body = Comp ? <Comp user={user} go={go} /> : <Placeholder scr={scr} go={go} />;
  } else {
    body = <Placeholder scr={scr || screenByKey('home-figurinista')} go={go} />;
  }

  return (
    <div className="app">
      {!isLogin && <TopBar user={user} onLogout={logout} onHome={() => go('home')} />}
      {body}
      <ProtoNav current={screen} user={user} onJump={jump} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

/* global React, Icon, LOCATARIOS */
// ============================================================
// Tela 10 — Cadastro de Locatário (H3.1) · Direção A
// Nome, CPF, telefone, e-mail. CPF valida formato + duplicidade.
// ============================================================
const { useState } = React;

// Máscara de CPF
function maskCPF(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
// Validação de dígitos verificadores do CPF
function cpfValido(cpf) {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(d[i]) * (10 - i);
  let r = (soma * 10) % 11; if (r === 10) r = 0;
  if (r !== parseInt(d[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(d[i]) * (11 - i);
  r = (soma * 10) % 11; if (r === 10) r = 0;
  return r === parseInt(d[10]);
}
function maskTel(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function CadastroLocatario({ user, go }) {
  const [form, setForm] = useState({ nome: '', cpf: '', tel: '', email: '' });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Duplicidade em tempo real
  const cpfDigits = form.cpf.replace(/\D/g, '');
  const duplicado = cpfDigits.length === 11 &&
    LOCATARIOS.find(l => l.cpf.replace(/\D/g, '') === cpfDigits);

  function set(campo, valor) {
    let v = valor;
    if (campo === 'cpf') v = maskCPF(valor);
    if (campo === 'tel') v = maskTel(valor);
    setForm(f => ({ ...f, [campo]: v }));
    setErros(e => ({ ...e, [campo]: null }));
  }

  function salvar() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome completo.';
    if (!form.cpf.trim()) e.cpf = 'Informe o CPF.';
    else if (!cpfValido(form.cpf)) e.cpf = 'Este CPF não é válido. Confira os números.';
    else if (duplicado) e.cpf = `Este CPF já está cadastrado para ${duplicado.nome}.`;
    if (!form.tel.trim()) e.tel = 'Informe um telefone para contato.';
    if (form.email && !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'E-mail inválido.';
    if (Object.keys(e).length) { setErros(e); return; }

    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  }

  if (done) {
    return (
      <div className="page">
        <div className="page-inner" style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', gap: 'var(--tja-space-5)' }}>
            <span style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--tja-success-soft)', color: 'var(--tja-success)', display: 'grid', placeItems: 'center' }}>
              <Icon name="check" size={38} />
            </span>
            <div>
              <h1 style={{ margin: '0 0 8px' }}>Locatário cadastrado!</h1>
              <p style={{ margin: 0, fontSize: 'var(--tja-text-lg)', color: 'var(--tja-text-soft)' }}>
                <strong style={{ color: 'var(--tja-text)' }}>{form.nome}</strong> já pode alugar peças do acervo.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--tja-space-3)' }}>
              <button className="btn btn-secondary" onClick={() => { setForm({ nome: '', cpf: '', tel: '', email: '' }); setDone(false); }}>
                <Icon name="plus" size={17} /> Cadastrar outro
              </button>
              <button className="btn btn-primary" onClick={() => go(user.perfil === 'figurinista' ? 'nova-locacao' : 'home')}>
                {user.perfil === 'figurinista' ? 'Voltar à locação' : 'Voltar ao início'} <Icon name="chevron" size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth: 620 }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)', marginBottom: 'var(--tja-space-6)' }}>
          <button className="btn btn-ghost" onClick={() => go('home')}
            style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Locatários</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Cadastrar locatário</h1>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-5)' }}>
          <div className="field">
            <label>Nome completo <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
            <input className="input" value={form.nome} onChange={e => set('nome', e.target.value)}
              placeholder="Nome da pessoa ou companhia" autoFocus
              style={{ borderColor: erros.nome ? 'var(--tja-danger)' : undefined }} />
            {erros.nome && <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{erros.nome}</div>}
          </div>

          <div className="field">
            <label>CPF <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
            <input className="input tnum" value={form.cpf} onChange={e => set('cpf', e.target.value)}
              placeholder="000.000.000-00" inputMode="numeric"
              style={{ borderColor: erros.cpf ? 'var(--tja-danger)' : duplicado ? 'var(--tja-warning)' : undefined }} />
            {erros.cpf
              ? <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="alert" size={14} /> {erros.cpf}</div>
              : duplicado
                ? <div className="hint" style={{ color: 'var(--tja-warning)', fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="alert" size={14} /> Já existe um cadastro com este CPF: {duplicado.nome}.</div>
                : cpfDigits.length === 11 && cpfValido(form.cpf)
                  ? <div className="hint" style={{ color: 'var(--tja-success)', fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="check" size={14} /> CPF válido.</div>
                  : <div className="hint">Verificamos o CPF automaticamente para evitar cadastros duplicados.</div>}
          </div>

          <div className="field">
            <label>Telefone <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
            <input className="input tnum" value={form.tel} onChange={e => set('tel', e.target.value)}
              placeholder="(85) 99999-9999" inputMode="numeric"
              style={{ borderColor: erros.tel ? 'var(--tja-danger)' : undefined }} />
            {erros.tel && <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{erros.tel}</div>}
          </div>

          <div className="field">
            <label>E-mail <span style={{ color: 'var(--tja-text-faint)', fontWeight: 400 }}>(opcional)</span></label>
            <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="email@exemplo.com.br"
              style={{ borderColor: erros.email ? 'var(--tja-danger)' : undefined }} />
            {erros.email && <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{erros.email}</div>}
          </div>

          <div style={{ display: 'flex', gap: 'var(--tja-space-3)', justifyContent: 'flex-end', paddingTop: 'var(--tja-space-2)' }}>
            <button className="btn btn-ghost" onClick={() => go('home')} style={{ color: 'var(--tja-text-soft)' }}>Cancelar</button>
            <button className="btn btn-primary" onClick={salvar} disabled={loading}
              style={{ minHeight: 52, minWidth: 200, fontSize: 'var(--tja-text-base)' }}>
              {loading ? 'Salvando…' : <><Icon name="check" size={17} /> Cadastrar locatário</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.CadastroLocatario = CadastroLocatario;

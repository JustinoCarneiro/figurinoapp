/* global React, Icon */
// ============================================================
// Tela 9 — Cadastro / Edição de Peça (H2.1/H2.2/H2.3) · Direção A
// 2 colunas: foto à esquerda, dados à direita. Foto obrigatória em novas.
// ============================================================
const { useState } = React;

const CATEGORIAS = ['Vestido', 'Casaca', 'Capa', 'Saia', 'Colete', 'Terno', 'Calça', 'Túnica', 'Acessório', 'Roupa de baixo', 'Calçado'];
const TAM_LETRA = ['PP', 'P', 'M', 'G', 'GG'];
const TAM_NUMERO = ['36', '38', '40', '42', '44', '46', '48'];
const CONSERVACAO = ['Ótimo', 'Bom', 'Regular', 'Frágil'];
const VALOR_LOCACAO_FIXO = 10; // tabelado — R$ 10,00 por figurino

function CadastroPeca({ user, go }) {
  const [form, setForm] = useState({
    nome: '', categoria: '', tamanhoModo: 'letra', tamanho: '', cor: '', material: '',
    conservacao: 'Bom', local: '',
  });
  const [foto, setFoto] = useState(null);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
    setErros(e => ({ ...e, [campo]: null }));
  }

  function setModo(modo) {
    setForm(f => ({ ...f, tamanhoModo: modo, tamanho: modo === 'unico' ? 'Único' : '' }));
    setErros(e => ({ ...e, tamanho: null }));
  }

  function onFoto(e) {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(URL.createObjectURL(file));
      setErros(er => ({ ...er, foto: null }));
    }
  }

  function salvar() {
    const novosErros = {};
    if (!foto) novosErros.foto = 'A foto é obrigatória para cadastrar uma peça.';
    if (!form.nome.trim()) novosErros.nome = 'Dê um nome à peça.';
    if (!form.categoria) novosErros.categoria = 'Escolha uma categoria.';
    if (!form.tamanho) novosErros.tamanho = 'Informe o tamanho.';
    // Localização e Material são opcionais — não barram o salvamento.
    if (Object.keys(novosErros).length) { setErros(novosErros); return; }

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
              <h1 style={{ margin: '0 0 8px' }}>Peça cadastrada!</h1>
              <p style={{ margin: 0, fontSize: 'var(--tja-text-lg)', color: 'var(--tja-text-soft)' }}>
                <strong style={{ color: 'var(--tja-text)' }}>{form.nome}</strong> já está disponível no acervo.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--tja-space-3)' }}>
              <button className="btn btn-secondary" onClick={() => { setForm({ nome: '', categoria: '', tamanhoModo: 'letra', tamanho: '', cor: '', material: '', conservacao: 'Bom', local: '' }); setFoto(null); setDone(false); }}>
                <Icon name="plus" size={17} /> Cadastrar outra
              </button>
              <button className="btn btn-primary" onClick={() => go('acervo')}>
                Ver no acervo <Icon name="chevron" size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      <div className="page-inner" style={{ maxWidth: 980 }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)', marginBottom: 'var(--tja-space-6)' }}>
          <button className="btn btn-ghost" onClick={() => go(user.perfil === 'figurinista' ? 'home' : 'acervo')}
            style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Acervo</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Cadastrar nova peça</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--tja-space-6)', alignItems: 'start' }}>
          {/* Coluna esquerda: foto */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--tja-text-sm)', fontWeight: 600, marginBottom: 'var(--tja-space-2)' }}>
              Foto da peça <span style={{ color: 'var(--tja-danger)' }}>*</span>
            </label>
            <label style={{
              display: 'block', borderRadius: 'var(--tja-radius-lg)',
              border: erros.foto ? '2px dashed var(--tja-danger)' : foto ? '1px solid var(--tja-border)' : '2px dashed var(--tja-border)',
              background: 'var(--tja-bg-muted)',
              cursor: 'pointer', overflow: 'hidden', position: 'relative',
              aspectRatio: foto ? 'auto' : '4 / 5', minHeight: foto ? 'auto' : undefined,
            }}>
              <input type="file" accept="image/*" onChange={onFoto} style={{ display: 'none' }} />
              {foto && (
                <img src={foto} alt="Prévia da peça" style={{ display: 'block', width: '100%', height: 'auto' }} />
              )}
              {!foto && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--tja-text-soft)', padding: 20, textAlign: 'center' }}>
                  <span style={{ width: 52, height: 52, borderRadius: 'var(--tja-radius-md)', background: 'var(--tja-bg-elevated)', color: 'var(--tja-primary)', display: 'grid', placeItems: 'center', border: '1px solid var(--tja-border)' }}>
                    <Icon name="camera" size={26} />
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text)' }}>Adicionar foto</span>
                  <span style={{ fontSize: 12 }}>Toque para escolher uma imagem da peça</span>
                </div>
              )}
              {foto && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px', background: 'linear-gradient(transparent, rgba(26,26,46,0.7))', display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 'var(--tja-text-sm)', fontWeight: 600 }}>
                  <Icon name="edit" size={15} /> Trocar foto
                </div>
              )}
            </label>
            {erros.foto && <div style={{ color: 'var(--tja-danger)', fontSize: 'var(--tja-text-sm)', fontWeight: 600, marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="alert" size={15} /> {erros.foto}</div>}
          </div>

          {/* Coluna direita: dados */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-5)' }}>
            <div className="field">
              <label>Nome da peça <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
              <input className="input" value={form.nome} onChange={e => set('nome', e.target.value)}
                placeholder="Ex.: Vestido Belle Époque"
                style={{ borderColor: erros.nome ? 'var(--tja-danger)' : undefined }} />
              {erros.nome && <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{erros.nome}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tja-space-4)' }}>
              <div className="field">
                <label>Categoria <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
                <select className="select" value={form.categoria} onChange={e => set('categoria', e.target.value)}
                  style={{ borderColor: erros.categoria ? 'var(--tja-danger)' : undefined }}>
                  <option value="">Selecione…</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {erros.categoria && <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{erros.categoria}</div>}
              </div>
              <div className="field">
                <label>Cor</label>
                <input className="input" value={form.cor} onChange={e => set('cor', e.target.value)} placeholder="Ex.: Marfim" />
              </div>
            </div>

            {/* Tamanho — 3 modos: Letra / Número / Único */}
            <div className="field">
              <label>Tamanho <span style={{ color: 'var(--tja-danger)' }}>*</span></label>
              <div style={{ display: 'flex', gap: 'var(--tja-space-2)', marginBottom: 'var(--tja-space-2)' }}>
                {[{ k: 'letra', t: 'Por letra' }, { k: 'numero', t: 'Por número' }, { k: 'unico', t: 'Único' }].map(m => {
                  const ativo = form.tamanhoModo === m.k;
                  return (
                    <button key={m.k} type="button" onClick={() => setModo(m.k)}
                      style={{
                        flex: 1, height: 40, font: 'inherit', cursor: 'pointer',
                        fontSize: 'var(--tja-text-sm)', fontWeight: 600,
                        background: ativo ? 'var(--tja-primary)' : 'var(--tja-bg-elevated)',
                        color: ativo ? 'var(--tja-text-on-dark)' : 'var(--tja-text-soft)',
                        border: ativo ? '1px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                        borderRadius: 'var(--tja-radius-md)',
                      }}>{m.t}</button>
                  );
                })}
              </div>

              {form.tamanhoModo === 'unico' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 var(--tja-space-4)', background: 'var(--tja-primary-soft)', color: 'var(--tja-primary)', borderRadius: 'var(--tja-radius-md)', fontSize: 'var(--tja-text-sm)', fontWeight: 600 }}>
                  <Icon name="check" size={16} /> Tamanho único
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--tja-space-2)', flexWrap: 'wrap' }}>
                  {(form.tamanhoModo === 'letra' ? TAM_LETRA : TAM_NUMERO).map(t => {
                    const ativo = form.tamanho === t;
                    return (
                      <button key={t} type="button" onClick={() => set('tamanho', t)}
                        style={{
                          minWidth: 48, height: 44, padding: '0 var(--tja-space-3)', font: 'inherit', cursor: 'pointer',
                          fontSize: 'var(--tja-text-base)', fontWeight: 700,
                          background: ativo ? 'var(--tja-primary-soft)' : 'var(--tja-bg-elevated)',
                          color: ativo ? 'var(--tja-primary)' : 'var(--tja-text-soft)',
                          border: ativo ? '1.5px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                          borderRadius: 'var(--tja-radius-md)',
                        }}>{t}</button>
                    );
                  })}
                </div>
              )}
              {erros.tamanho && <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{erros.tamanho}</div>}
            </div>

            <div className="field">
              <label>Material <span style={{ color: 'var(--tja-text-faint)', fontWeight: 400 }}>(opcional)</span></label>
              <input className="input" value={form.material} onChange={e => set('material', e.target.value)} placeholder="Ex.: Renda e cetim" />
            </div>

            <div className="field">
              <label>Estado de conservação</label>
              <div style={{ display: 'flex', gap: 'var(--tja-space-2)' }}>
                {CONSERVACAO.map(c => {
                  const ativo = form.conservacao === c;
                  return (
                    <button key={c} type="button" onClick={() => set('conservacao', c)}
                      style={{
                        flex: 1, height: 44, font: 'inherit', cursor: 'pointer',
                        fontSize: 'var(--tja-text-sm)', fontWeight: 600,
                        background: ativo ? 'var(--tja-primary-soft)' : 'var(--tja-bg-elevated)',
                        color: ativo ? 'var(--tja-primary)' : 'var(--tja-text-soft)',
                        border: ativo ? '1.5px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                        borderRadius: 'var(--tja-radius-md)',
                      }}>{c}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tja-space-4)' }}>
              <div className="field">
                <label>Localização no acervo <span style={{ color: 'var(--tja-text-faint)', fontWeight: 400 }}>(opcional)</span></label>
                <div className="input-icon">
                  <Icon name="box" size={17} />
                  <input className="input" value={form.local} onChange={e => set('local', e.target.value)}
                    placeholder="Ex.: Arara A · Prateleira 2" />
                </div>
              </div>
              <div className="field">
                <label>Valor da locação</label>
                <div className="input-icon">
                  <Icon name="coin" size={17} />
                  <input className="input tnum" value="R$ 10,00" disabled readOnly
                    style={{ background: 'var(--tja-bg-muted)', color: 'var(--tja-text-soft)', cursor: 'not-allowed' }} />
                </div>
                <div className="hint">Valor tabelado — fixo para todo novo figurino.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixo */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--tja-bg-elevated)', borderTop: '1px solid var(--tja-border)',
        boxShadow: '0 -4px 16px rgba(26,26,46,0.08)', padding: '0 var(--tja-space-6)',
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)', minHeight: 72 }}>
          <div style={{ flex: 1, fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>
            Campos com <span style={{ color: 'var(--tja-danger)' }}>*</span> são obrigatórios.
          </div>
          <button className="btn btn-ghost" onClick={() => go('acervo')} style={{ color: 'var(--tja-text-soft)' }}>Cancelar</button>
          <button className="btn btn-primary" onClick={salvar} disabled={loading}
            style={{ minHeight: 52, minWidth: 180, fontSize: 'var(--tja-text-base)' }}>
            {loading ? 'Salvando…' : <><Icon name="check" size={17} /> Salvar peça</>}
          </button>
        </div>
      </div>
    </div>
  );
}

window.CadastroPeca = CadastroPeca;

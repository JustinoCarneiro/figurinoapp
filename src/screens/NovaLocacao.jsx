/* global React, Icon, Badge, BRL, LOCATARIOS, PECAS, VALOR_ALUGUEL, VALOR_CAUCAO */
// ============================================================
// Tela 4 — Nova Locação (H4.1) · figurinista · Direção A
// Wizard 3 passos: ① Locatário → ② Peças → ③ Data + Confirmar
// Footer persistente com aluguel e caução SEMPRE separados.
// ============================================================
const { useState, useMemo } = React;

// ---------- Indicador de passo ----------
function StepBar({ current }) {
  const steps = [
    { n: 1, label: 'Figurinos' },
    { n: 2, label: 'Locatário' },
    { n: 3, label: 'Confirmar' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 'var(--tja-space-6)' }}>
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 32, height: 32, borderRadius: 999, flex: 'none',
                display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700,
                background: done ? 'var(--tja-success)' : active ? 'var(--tja-primary)' : 'var(--tja-bg-muted)',
                color: done || active ? 'var(--tja-text-on-dark)' : 'var(--tja-text-soft)',
                transition: 'background 0.2s',
              }}>
                {done ? <Icon name="check" size={16} /> : s.n}
              </span>
              <span style={{
                fontSize: 'var(--tja-text-sm)', fontWeight: active ? 700 : 500,
                color: active ? 'var(--tja-text)' : done ? 'var(--tja-success)' : 'var(--tja-text-soft)',
              }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? 'var(--tja-success)' : 'var(--tja-border)', margin: '0 var(--tja-space-3)', minWidth: 32 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------- Footer persistente ----------
function LocacaoFooter({ locatario, pecasSel, step, onBack, onNext, loading }) {
  const nPecas = pecasSel.length;
  const aluguel = nPecas * VALOR_ALUGUEL;
  const caucao = VALOR_CAUCAO;
  const isLast = step === 3;
  const canNext =
    (step === 1 && nPecas > 0) ||
    (step === 2 && !!locatario) ||
    step === 3;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--tja-bg-elevated)', borderTop: '1px solid var(--tja-border)',
      boxShadow: '0 -4px 16px rgba(26,26,46,0.08)',
      padding: '0 var(--tja-space-6)',
    }}>
      <div style={{ maxWidth: 'var(--tja-max-content)', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--tja-space-5)', minHeight: 72 }}>

        {/* Estado corrente */}
        <div style={{ flex: 1, display: 'flex', gap: 'var(--tja-space-5)', alignItems: 'center', flexWrap: 'wrap' }}>
          {locatario && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="user" size={15} style={{ color: 'var(--tja-text-soft)' }} />
              <span style={{ fontSize: 'var(--tja-text-sm)', fontWeight: 600, color: 'var(--tja-text)' }}>{locatario.nome.split(' ')[0]} {locatario.nome.split(' ')[1]}</span>
            </div>
          )}
          {nPecas > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="tag" size={15} style={{ color: 'var(--tja-text-soft)' }} />
              <span style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>
                <strong style={{ color: 'var(--tja-text)' }}>{nPecas}</strong> {nPecas === 1 ? 'peça' : 'peças'}
              </span>
            </div>
          )}
        </div>

        {/* Valores — SEMPRE separados */}
        {nPecas > 0 && (
          <div style={{ display: 'flex', gap: 'var(--tja-space-6)', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--tja-text-xs)', color: 'var(--tja-text-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Aluguel</div>
              <div style={{ fontSize: 'var(--tja-text-xl)', fontFamily: 'var(--tja-font-display)', fontWeight: 600, color: 'var(--tja-text)', fontVariantNumeric: 'tabular-nums' }}>{BRL(aluguel)}</div>
              <div style={{ fontSize: 11, color: 'var(--tja-text-faint)' }}>{nPecas} × {BRL(VALOR_ALUGUEL)}</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--tja-border)' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--tja-text-xs)', color: 'var(--tja-text-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Caução</div>
              <div style={{ fontSize: 'var(--tja-text-xl)', fontFamily: 'var(--tja-font-display)', fontWeight: 600, color: 'var(--tja-text)', fontVariantNumeric: 'tabular-nums' }}>{BRL(caucao)}</div>
              <div style={{ fontSize: 11, color: 'var(--tja-text-faint)' }}>Fixo por locação</div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div style={{ display: 'flex', gap: 'var(--tja-space-3)', flexShrink: 0 }}>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={onBack} style={{ minHeight: 48 }}>
              <Icon name="arrowLeft" size={17} /> Voltar
            </button>
          )}
          <button className="btn btn-primary" onClick={onNext}
            disabled={!canNext || loading}
            style={{ minHeight: 48, minWidth: 160, fontSize: 'var(--tja-text-base)' }}>
            {loading
              ? 'Salvando…'
              : isLast
                ? <><Icon name="check" size={17} /> Concluir locação</>
                : <>Avançar <Icon name="chevron" size={17} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Passo 1: Locatário ----------
function Passo1({ locatario, setLocatario, go }) {
  const [busca, setBusca] = useState('');
  const filtrados = useMemo(() =>
    LOCATARIOS.filter(l =>
      l.nome.toLowerCase().includes(busca.toLowerCase()) ||
      l.cpf.includes(busca) ||
      l.email.toLowerCase().includes(busca.toLowerCase())
    ), [busca]);

  return (
    <div>
      <h2 style={{ margin: '0 0 var(--tja-space-2)' }}>Quem está alugando?</h2>
      <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-lg)' }}>
        Selecione um locatário já cadastrado ou cadastre um novo.
      </p>

      <div className="input-icon" style={{ marginBottom: 'var(--tja-space-4)', maxWidth: 520 }}>
        <Icon name="search" size={17} />
        <input className="input" value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, CPF ou e-mail…" autoFocus />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-3)', maxWidth: 640 }}>
        {filtrados.map(l => (
          <button key={l.id} onClick={() => setLocatario(l)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)',
              padding: 'var(--tja-space-4)', textAlign: 'left', font: 'inherit',
              background: locatario?.id === l.id ? 'var(--tja-primary-soft)' : 'var(--tja-bg-elevated)',
              border: locatario?.id === l.id ? '1.5px solid var(--tja-primary)' : '1px solid var(--tja-border)',
              borderRadius: 'var(--tja-radius-md)', cursor: 'pointer',
              transition: 'border-color var(--tja-duration) var(--tja-ease)',
            }}>
            <span style={{
              width: 42, height: 42, borderRadius: 999, flex: 'none',
              background: locatario?.id === l.id ? 'var(--tja-primary)' : 'var(--tja-bg-muted)',
              color: locatario?.id === l.id ? 'var(--tja-text-on-dark)' : 'var(--tja-text-soft)',
              display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700,
            }}>{l.nome[0]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--tja-text)' }}>{l.nome}</div>
              <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', marginTop: 2, display: 'flex', gap: 16 }}>
                <span>{l.cpf}</span>
                <span>{l.tel}</span>
              </div>
            </div>
            {locatario?.id === l.id && (
              <span style={{ color: 'var(--tja-primary)' }}><Icon name="check" size={20} /></span>
            )}
          </button>
        ))}

        {filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--tja-space-6)', color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-base)' }}>
            Nenhum locatário encontrado para "{busca}".
          </div>
        )}
      </div>

      <div style={{ marginTop: 'var(--tja-space-5)', maxWidth: 640 }}>
        <button className="btn btn-secondary" onClick={() => go('cadastro-locatario')}>
          <Icon name="plus" size={17} /> Cadastrar novo locatário
        </button>
      </div>
    </div>
  );
}

// ---------- Miniatura de peça (placeholder de foto) ----------
function PecaThumb({ peca, size = 56 }) {
  return (
    <span style={{
      width: size, height: size, flex: 'none', borderRadius: 'var(--tja-radius-sm)',
      background: 'var(--tja-bg-muted)', display: 'grid', placeItems: 'center',
      color: 'var(--tja-text-faint)', overflow: 'hidden',
    }}>
      <Icon name="hanger" size={Math.round(size * 0.42)} />
    </span>
  );
}

// ---------- Passo 2: Peças ----------
function Passo2({ pecasSel, setPecasSel }) {
  const [busca, setBusca] = useState('');
  const [filtroCat, setFiltroCat] = useState('todas');

  // Categorias presentes entre as peças disponíveis
  const categorias = useMemo(() => {
    const set = [...new Set(PECAS.filter(p => p.estado === 'disponivel').map(p => p.categoria))];
    return set.sort();
  }, []);

  const disponiveis = useMemo(() =>
    PECAS.filter(p => p.estado === 'disponivel' &&
      (filtroCat === 'todas' || p.categoria === filtroCat) &&
      (p.nome.toLowerCase().includes(busca.toLowerCase()) ||
       p.categoria.toLowerCase().includes(busca.toLowerCase()) ||
       p.cor.toLowerCase().includes(busca.toLowerCase()))
    ), [busca, filtroCat]);

  const contaCat = (cat) =>
    PECAS.filter(p => p.estado === 'disponivel' && (cat === 'todas' || p.categoria === cat)).length;

  function toggle(p) {
    setPecasSel(prev =>
      prev.some(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]
    );
  }
  const sel = (id) => pecasSel.some(p => p.id === id);

  return (
    <div>
      <h2 style={{ margin: '0 0 var(--tja-space-2)' }}>Quais peças?</h2>
      <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-lg)' }}>
        Selecione as peças disponíveis para esta locação.
      </p>

      <div className="input-icon" style={{ marginBottom: 'var(--tja-space-4)', maxWidth: 520 }}>
        <Icon name="search" size={17} />
        <input className="input" value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, categoria ou cor…" autoFocus />
      </div>

      {/* Filtros por categoria */}
      <div style={{ display: 'flex', gap: 'var(--tja-space-2)', flexWrap: 'wrap', marginBottom: 'var(--tja-space-4)', maxWidth: 760 }}>
        {['todas', ...categorias].map(cat => {
          const ativo = filtroCat === cat;
          return (
            <button key={cat} onClick={() => setFiltroCat(cat)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '0 var(--tja-space-3)', height: 38, font: 'inherit', cursor: 'pointer',
                fontSize: 'var(--tja-text-sm)', fontWeight: 600,
                background: ativo ? 'var(--tja-primary)' : 'var(--tja-bg-elevated)',
                color: ativo ? 'var(--tja-text-on-dark)' : 'var(--tja-text-soft)',
                border: ativo ? '1px solid var(--tja-primary)' : '1px solid var(--tja-border)',
                borderRadius: 'var(--tja-radius-md)',
              }}>
              {cat === 'todas' ? 'Todas' : cat}
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                background: ativo ? 'rgba(255,255,255,0.2)' : 'var(--tja-bg-muted)',
                color: ativo ? '#fff' : 'var(--tja-text-soft)',
              }}>{contaCat(cat)}</span>
            </button>
          );
        })}
      </div>

      {pecasSel.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          padding: 'var(--tja-space-3) var(--tja-space-4)',
          background: 'var(--tja-primary-soft)', borderRadius: 'var(--tja-radius-md)',
          marginBottom: 'var(--tja-space-4)', maxWidth: 760,
        }}>
          <span style={{ fontSize: 'var(--tja-text-sm)', fontWeight: 700, color: 'var(--tja-primary)' }}>
            {pecasSel.length} {pecasSel.length === 1 ? 'peça selecionada:' : 'peças selecionadas:'}
          </span>
          {pecasSel.map(p => (
            <span key={p.id} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 999,
              background: 'var(--tja-primary)', color: 'var(--tja-text-on-dark)',
              fontSize: 'var(--tja-text-xs)', fontWeight: 600,
            }}>
              {p.nome}
              <button onClick={() => toggle(p)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)', padding: 0, display: 'flex', alignItems: 'center',
              }}>
                <Icon name="x" size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-2)', maxWidth: 760 }}>
        {disponiveis.map(p => (
          <button key={p.id} onClick={() => toggle(p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--tja-space-4)',
              padding: 'var(--tja-space-3) var(--tja-space-4)', textAlign: 'left', font: 'inherit',
              background: sel(p.id) ? 'var(--tja-primary-soft)' : 'var(--tja-bg-elevated)',
              border: sel(p.id) ? '1.5px solid var(--tja-primary)' : '1px solid var(--tja-border)',
              borderRadius: 'var(--tja-radius-md)', cursor: 'pointer',
              transition: 'border-color var(--tja-duration) var(--tja-ease), background var(--tja-duration) var(--tja-ease)',
            }}>
            {/* Checkbox visual */}
            <span style={{
              width: 22, height: 22, borderRadius: 5, flex: 'none',
              border: sel(p.id) ? 'none' : '2px solid var(--tja-border)',
              background: sel(p.id) ? 'var(--tja-primary)' : 'transparent',
              display: 'grid', placeItems: 'center', color: 'var(--tja-text-on-dark)',
            }}>
              {sel(p.id) && <Icon name="check" size={14} />}
            </span>
            <PecaThumb peca={p} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--tja-text)' }}>{p.nome}</div>
              <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', marginTop: 2, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span>{p.categoria}</span>
                <span>Tam. {p.tamanho}</span>
                <span>{p.cor}</span>
                <span style={{ color: 'var(--tja-text-faint)' }}>{p.local}</span>
              </div>
            </div>
            <Badge state="disponivel" />
          </button>
        ))}

        {disponiveis.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--tja-space-6)', color: 'var(--tja-text-soft)' }}>
            {busca ? `Nenhuma peça disponível para "${busca}".` : 'Nenhuma peça disponível no acervo.'}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Passo 3: Data + Resumo ----------
function Passo3({ locatario, pecasSel, dataDevol, setDataDevol }) {
  const aluguel = pecasSel.length * VALOR_ALUGUEL;
  const caucao = VALOR_CAUCAO;

  // Mínimo: amanhã
  const minDate = (() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--tja-space-6)', alignItems: 'start' }}>
      {/* Coluna esquerda: data */}
      <div>
        <h2 style={{ margin: '0 0 var(--tja-space-2)' }}>Data de devolução</h2>
        <p style={{ margin: '0 0 var(--tja-space-5)', color: 'var(--tja-text-soft)', fontSize: 'var(--tja-text-lg)' }}>
          Confirme quando as peças serão devolvidas.
        </p>
        <div className="field" style={{ maxWidth: 300 }}>
          <label>Data prevista de devolução</label>
          <input className="input" type="date" value={dataDevol}
            min={minDate}
            onChange={e => setDataDevol(e.target.value)}
            style={{ fontFamily: 'var(--tja-font-body)', fontSize: 'var(--tja-text-base)' }} />
          <div className="hint">O locatário deverá devolver as peças até esta data.</div>
        </div>
      </div>

      {/* Coluna direita: resumo da locação */}
      <div className="card" style={{ padding: 'var(--tja-space-5)' }}>
        <div style={{ fontSize: 'var(--tja-text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tja-text-soft)', marginBottom: 'var(--tja-space-4)' }}>
          Resumo da locação
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tja-space-3)' }}>
          {/* Locatário */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Icon name="user" size={16} style={{ color: 'var(--tja-text-soft)', marginTop: 1, flex: 'none' }} />
            <div>
              <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>Locatário</div>
              <div style={{ fontWeight: 600 }}>{locatario?.nome}</div>
              <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>{locatario?.cpf}</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--tja-border)' }} />

          {/* Peças */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Icon name="tag" size={16} style={{ color: 'var(--tja-text-soft)', marginTop: 1, flex: 'none' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)', marginBottom: 6 }}>
                {pecasSel.length} {pecasSel.length === 1 ? 'peça' : 'peças'}
              </div>
              {pecasSel.map(p => (
                <div key={p.id} style={{ fontSize: 'var(--tja-text-sm)', padding: '3px 0', borderBottom: '1px solid var(--tja-border-soft)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{p.nome}</span>
                  <span style={{ color: 'var(--tja-text-soft)' }}>Tam. {p.tamanho}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--tja-border)' }} />

          {/* Valores SEMPRE separados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>
                Aluguel <span style={{ fontSize: 11 }}>({pecasSel.length} × {BRL(VALOR_ALUGUEL)})</span>
              </span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{BRL(aluguel)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>Caução <span style={{ fontSize: 11 }}>(fixo)</span></span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{BRL(caucao)}</span>
            </div>
          </div>

          {dataDevol && (
            <>
              <div style={{ height: 1, background: 'var(--tja-border)' }} />
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Icon name="calendar" size={16} style={{ color: 'var(--tja-text-soft)', flex: 'none' }} />
                <div>
                  <div style={{ fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>Devolução prevista</div>
                  <div style={{ fontWeight: 600 }}>
                    {new Date(dataDevol + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Sucesso ----------
function Sucesso({ locatario, pecasSel, onNova, go }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', gap: 'var(--tja-space-5)' }}>
      <span style={{
        width: 72, height: 72, borderRadius: 999,
        background: 'var(--tja-success-soft)', color: 'var(--tja-success)',
        display: 'grid', placeItems: 'center',
      }}>
        <Icon name="check" size={38} />
      </span>
      <div>
        <h1 style={{ margin: '0 0 8px' }}>Locação registrada!</h1>
        <p style={{ margin: 0, fontSize: 'var(--tja-text-lg)', color: 'var(--tja-text-soft)', maxWidth: 400 }}>
          As peças saíram para <strong style={{ color: 'var(--tja-text)' }}>{locatario?.nome.split(' ')[0]}</strong>.
          A administração receberá a cobrança para confirmar o pagamento.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--tja-space-3)' }}>
        <button className="btn btn-secondary" onClick={onNova}>
          <Icon name="plus" size={17} /> Nova locação
        </button>
        <button className="btn btn-primary" onClick={() => go('home')}>
          Voltar ao início <Icon name="chevron" size={17} />
        </button>
      </div>
    </div>
  );
}

// ---------- Componente principal ----------
function NovaLocacao({ user, go }) {
  const [step, setStep] = useState(1);
  const [locatario, setLocatario] = useState(null);
  const [pecasSel, setPecasSel] = useState([]);
  const [dataDevol, setDataDevol] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function next() {
    if (step < 3) { setStep(s => s + 1); return; }
    // Passo 3: concluir
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  }
  function back() { setStep(s => s - 1); }
  function nova() { setStep(1); setLocatario(null); setPecasSel([]); setDataDevol(''); setDone(false); }

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      <div className="page-inner" style={{ maxWidth: 900 }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tja-space-3)', marginBottom: 'var(--tja-space-5)' }}>
          <button className="btn btn-ghost" onClick={() => go('home')}
            style={{ minHeight: 40, padding: '0 10px', color: 'var(--tja-text-soft)' }}>
            <Icon name="arrowLeft" size={18} />
          </button>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Nova locação</p>
            <h1 style={{ margin: 0, fontSize: 'var(--tja-text-2xl)' }}>Registrar saída de peças</h1>
          </div>
        </div>

        {!done && <StepBar current={step} />}

        {done
          ? <Sucesso locatario={locatario} pecasSel={pecasSel} onNova={nova} go={go} />
          : step === 1 ? <Passo2 pecasSel={pecasSel} setPecasSel={setPecasSel} />
          : step === 2 ? <Passo1 locatario={locatario} setLocatario={setLocatario} go={go} />
          : <Passo3 locatario={locatario} pecasSel={pecasSel} dataDevol={dataDevol} setDataDevol={setDataDevol} />}
      </div>

      {!done && (
        <LocacaoFooter
          locatario={locatario} pecasSel={pecasSel}
          step={step} onBack={back} onNext={next} loading={loading} />
      )}
    </div>
  );
}

window.NovaLocacao = NovaLocacao;

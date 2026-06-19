/* global React */
// ============================================================
// Figurinos TJA — componentes compartilhados · Direção A
// ============================================================
const { useState } = React;

const BRL = (n) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---------- Ícones de linha (currentColor, stroke) ----------
const ICONS = {
  plus: 'M12 5v14M5 12h14',
  tag: 'M3.5 3.5h7l9 9a2 2 0 0 1 0 2.8l-4.2 4.2a2 2 0 0 1-2.8 0l-9-9V3.5zM7.5 7.5h.01',
  out: 'M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5M10 17l5-5-5-5M15 12H3',
  in: 'M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5M8 17l-5-5 5-5M3 12h12',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  user: 'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  alert: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v10M14.5 9.3c-.6-.6-1.6-.9-2.5-.9-1.4 0-2.5.7-2.5 1.8 0 2.4 5 1.2 5 3.6 0 1.1-1.1 1.8-2.5 1.8-.9 0-1.9-.3-2.5-.9',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  box: 'M21 8 12 3 3 8m18 0v8l-9 5-9-5V8m18 0-9 5m0 0L3 8m9 5v8',
  chevron: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  calendar: 'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  chart: 'M3 3v18h18M8 16v-5M13 16V8M18 16v-9',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  camera: 'M14.5 4l1.5 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2h5zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  hanger: 'M12 3a2 2 0 0 0-1 3.7c.6.4 1 .8 1 1.3 0 .6-.4 1-1 1.4L3.5 14a1.6 1.6 0 0 0 .9 3h15.2a1.6 1.6 0 0 0 .9-3L13 9.4',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  table: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18',
};

function Icon({ name, size = 20, style, className }) {
  const d = ICONS[name] || '';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" style={style} className={className} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  );
}

// ---------- Emblema TJA — Direção A: índigo institucional ----------
function Emblem({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Theatro José de Alencar">
      <rect width="40" height="40" rx="8" fill="var(--tja-primary)" />
      <text x="20" y="27" textAnchor="middle"
        fontFamily="'Source Serif 4', Georgia, serif"
        fontWeight="600" fontSize="17"
        fill="var(--tja-text-on-dark)" letterSpacing="0.5">TJA</text>
    </svg>
  );
}

// ---------- Badge de estado ----------
const STATE_LABELS = {
  disponivel: 'Disponível', em_uso: 'Em uso', aguardando_pgto: 'Aguardando pagamento',
  atrasada: 'Atrasada', manutencao: 'Em manutenção', finalizada: 'Finalizada',
  reservada: 'Reservada', nao_devolvida: 'Não devolvida',
};
const STATE_CLASS = {
  disponivel: 'badge-disponivel', em_uso: 'badge-em-uso', aguardando_pgto: 'badge-aguardando-pgto',
  atrasada: 'badge-atrasada', manutencao: 'badge-manutencao', finalizada: 'badge-finalizada',
  reservada: 'badge-aguardando-pgto', nao_devolvida: 'badge-atrasada',
};
const STATE_DOT = {
  disponivel: 'var(--tja-success)', em_uso: 'var(--tja-primary)', aguardando_pgto: 'var(--tja-warning)',
  atrasada: 'var(--tja-danger)', manutencao: 'var(--tja-accent)', finalizada: 'var(--tja-text-faint)',
  reservada: 'var(--tja-warning)', nao_devolvida: 'var(--tja-danger)',
};
function Badge({ state, label }) {
  return (
    <span className={'badge ' + (STATE_CLASS[state] || 'badge-finalizada')}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: STATE_DOT[state] || 'var(--tja-text-faint)', flex: 'none', display: 'inline-block' }} />
      {label || STATE_LABELS[state] || state}
    </span>
  );
}

// ---------- TopBar ----------
function TopBar({ user, onLogout, onHome }) {
  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <header className="topbar">
      <button className="topbar-brand" onClick={onHome}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Emblem size={36} />
        <div style={{ textAlign: 'left' }}>
          <div className="name">Figurinos TJA</div>
          <div className="sub">Theatro José de Alencar</div>
        </div>
      </button>
      <div className="topbar-spacer" />
      <div className="topbar-user">
        <div className="who">
          <div className="role">{user.role}</div>
          <div className="nm">{user.name}</div>
        </div>
        <div className="avatar">{initials}</div>
        <button className="btn btn-ghost" onClick={onLogout}
          style={{ minHeight: 36, padding: '0 12px', fontSize: 'var(--tja-text-sm)', color: 'var(--tja-text-soft)' }}>
          <Icon name="logout" size={16} /> Sair
        </button>
      </div>
    </header>
  );
}

// ---------- Field ----------
function Field({ label, hint, error, children }) {
  return (
    <div className={'field' + (error ? ' field-error' : '')}>
      {label && <label>{label}</label>}
      {children}
      {error
        ? <div className="hint" style={{ color: 'var(--tja-danger)', fontWeight: 600 }}>{error}</div>
        : hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

// ---------- Exportação Excel (SheetJS) ----------
function exportXLSX(sheets, filename) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, data }) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  XLSX.writeFile(wb, filename);
}

Object.assign(window, { BRL, Icon, Emblem, Badge, TopBar, Field, STATE_LABELS, STATE_CLASS, exportXLSX });

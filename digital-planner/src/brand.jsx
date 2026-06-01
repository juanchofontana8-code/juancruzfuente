// ─────────────────────────────────────────────
// PLANNERFY · Sistema de marca
// ─────────────────────────────────────────────
const BRAND = {
  font: {
    serif: "'Cormorant Garamond', Georgia, serif",
    sans:  "'Manrope', sans-serif",
    mono:  "'JetBrains Mono', monospace",
  },
  cream:     '#F5EFE6',
  creamDeep: '#EDE4D2',
  paper:     '#FAF6EE',
  ink:       '#2B2622',
  ink2:      '#5A4F45',
  ink3:      '#8C8275',
  ink4:      '#B8AE9D',
  line:      '#D8CFC0',
  lineSoft:  '#E8DFD0',
};

const ACCENTS = [
  { key: 'greige',  name: 'Greige',  hex: '#C9BBA0' },
  { key: 'salvia',  name: 'Salvia',  hex: '#A8B895' },
  { key: 'lavanda', name: 'Lavanda', hex: '#B6A8C4' },
  { key: 'cielo',   name: 'Cielo',   hex: '#A7BACA' },
  { key: 'rubor',   name: 'Rubor',   hex: '#D2A99A' },
  { key: 'arcilla', name: 'Arcilla', hex: '#C99577' },
];

function tint(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function darken(hex, amt) {
  const h = hex.replace('#', '');
  let r = parseInt(h.slice(0, 2), 16);
  let g = parseInt(h.slice(2, 4), 16);
  let b = parseInt(h.slice(4, 6), 16);
  r = Math.max(0, Math.round(r * (1 - amt)));
  g = Math.max(0, Math.round(g * (1 - amt)));
  b = Math.max(0, Math.round(b * (1 - amt)));
  return `rgb(${r},${g},${b})`;
}

const SettingsContext = React.createContext(null);
const useSettings = () => React.useContext(SettingsContext);

function useAccent() {
  const s = React.useContext(SettingsContext);
  const found = ACCENTS.find(a => a.key === s.accent) || ACCENTS[0];
  return found.hex;
}

// ── usePersist · useState con respaldo en localStorage ──
// key: string único por campo, p.ej. 'daily|clima'
function usePersist(key, init) {
  const full = `lp:plannerfy:${key}`;
  const stored = (() => {
    try {
      const v = localStorage.getItem(full);
      return v !== null ? JSON.parse(v) : init;
    } catch { return init; }
  })();
  const [val, raw] = React.useState(stored);
  const set = React.useCallback((v) => {
    raw(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      try { localStorage.setItem(full, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [full]);
  return [val, set];
}

const DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DIAS_LETRA  = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function semanaDelAnio(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const diff = date - firstThursday;
  return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

Object.assign(window, {
  BRAND, ACCENTS, tint, darken,
  SettingsContext, useSettings, useAccent, usePersist,
  DIAS_LARGOS, DIAS_CORTOS, DIAS_LETRA, MESES, MESES_CORTOS, semanaDelAnio, fmtDate,
});

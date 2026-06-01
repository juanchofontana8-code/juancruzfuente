// ─────────────────────────────────────────────
// PLANNERFY · App shell
// ─────────────────────────────────────────────
const VIEWS = [
  { key: 'hoy',       label: 'Hoy',       comp: ViewDaily },
  { key: 'agenda',    label: 'Agenda',    comp: ViewAgenda },
  { key: 'semana',    label: 'Semana',    comp: ViewWeekly },
  { key: 'mes',       label: 'Mes',       comp: ViewMonthly },
  { key: 'anio',      label: 'Año',       comp: ViewYearly },
  { key: 'habitos',   label: 'Hábitos & Finanzas', comp: ViewHabits },
  { key: 'bienestar', label: 'Bienestar', comp: ViewWellness },
];

const DOC_ID = 'plannerfy';

// ── Utilidades de datos ──
function exportData() {
  const data = { app: DOC_ID, version: 1, fecha: new Date().toISOString(), datos: {} };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`lp:${DOC_ID}:`)) {
        try { data.datos[k] = JSON.parse(localStorage.getItem(k)); } catch {}
      }
    }
  } catch {}
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${DOC_ID}-datos.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.datos && typeof data.datos === 'object') {
        Object.entries(data.datos).forEach(([k, v]) => {
          try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
        });
        window.location.reload();
      } else {
        alert('Archivo no válido o sin datos.');
      }
    } catch { alert('No se pudo leer el archivo.'); }
  };
  reader.readAsText(file);
}

function clearView(viewKey) {
  if (!confirm(`¿Borrar todos los datos de la vista «${VIEWS.find(v => v.key === viewKey)?.label}»?`)) return;
  const prefix = `lp:${DOC_ID}:${viewKey}|`;
  const toRemove = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
  } catch {}
  window.location.reload();
}

function clearAll() {
  if (!confirm('¿Borrar TODOS los datos del planner? Esta acción no se puede deshacer.')) return;
  const prefix = `lp:${DOC_ID}:`;
  const toRemove = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
  } catch {}
  window.location.reload();
}

// ── NavBar ──
function NavBar({ current, onChange, onOpenSettings, onExport, onImportClick, onClearView, onClearAll }) {
  const accent = useAccent();
  const importRef = React.useRef(null);
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: tint(BRAND.cream, 0.92), backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${BRAND.line}`,
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 16, height: 66 }}>
        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, flex: '0 0 auto' }}>
          <span style={{ width: 9, height: 9, borderRadius: 99, background: accent, display: 'inline-block', transform: 'translateY(-2px)' }} />
          <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 26, color: BRAND.ink, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>PLANNERFY</span>
        </div>

        {/* Tabs de vista */}
        <div style={{ flex: 1, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {VIEWS.map(v => {
            const on = current === v.key;
            return (
              <button key={v.key} onClick={() => onChange(v.key)}
                style={{
                  position: 'relative', padding: '8px 14px', borderRadius: 8,
                  fontFamily: BRAND.font.sans, fontWeight: on ? 600 : 400, fontSize: 14,
                  color: on ? BRAND.ink : BRAND.ink3,
                  background: on ? tint(accent, 0.16) : 'transparent',
                  transition: 'all 150ms ease', whiteSpace: 'nowrap',
                }}>{v.label}</button>
            );
          })}
        </div>

        {/* Utilidades */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
          <ToolBtn title="Exportar datos" onClick={onExport}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </ToolBtn>
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ''; }} />
          <ToolBtn title="Importar datos" onClick={() => importRef.current.click()}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </ToolBtn>
          <ToolBtn title={`Borrar vista actual (${VIEWS.find(v => v.key === current)?.label})`} onClick={() => clearView(current)}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Borrar todo el planner" onClick={clearAll} danger>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
            </svg>
          </ToolBtn>
          <ToolBtn title="Imprimir / Guardar PDF" onClick={() => window.print()}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
          </ToolBtn>
          <div style={{ width: 1, height: 24, background: BRAND.lineSoft, margin: '0 4px' }} />
          <button onClick={onOpenSettings} title="Ajustes" style={{
            width: 38, height: 38, borderRadius: 99, border: `1px solid ${BRAND.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.ink2,
            background: 'transparent', transition: 'all 150ms ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

function ToolBtn({ title, onClick, danger, children }) {
  const accent = useAccent();
  const [h, setH] = React.useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 34, height: 34, borderRadius: 8,
        border: `1px solid ${h ? (danger ? '#D97070' : accent) : BRAND.lineSoft}`,
        background: h ? (danger ? 'rgba(185,80,80,0.08)' : tint(accent, 0.1)) : 'transparent',
        color: h ? (danger ? '#C05050' : darken(accent, 0.2)) : BRAND.ink3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms ease',
      }}>{children}</button>
  );
}

// ── Panel de configuración ──
function SettingsModal({ open, onClose }) {
  const s = useSettings();
  const accent = useAccent();
  const [draft, setDraft] = React.useState(s.habits.join('\n'));
  React.useEffect(() => { if (open) setDraft(s.habits.join('\n')); }, [open]);
  if (!open) return null;

  const saveHabits = (txt) => {
    setDraft(txt);
    s.setHabits(txt.split('\n').map(x => x.trim()).filter(Boolean));
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(43,38,34,0.28)',
      backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end',
      animation: 'viewIn 180ms ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 420, maxWidth: '92vw', height: '100%', background: BRAND.paper,
        borderLeft: `1px solid ${BRAND.line}`, padding: '34px 34px 40px', overflowY: 'auto',
        boxShadow: '-30px 0 60px rgba(43,38,34,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontFamily: BRAND.font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 36, color: BRAND.ink }}>Ajustes</h2>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 99, border: `1px solid ${BRAND.line}`, color: BRAND.ink2, fontSize: 15 }}>✕</button>
        </div>

        {/* Acento */}
        <div style={{ marginBottom: 32 }}>
          <Eyebrow text="Color de acento" style={{ marginBottom: 16 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {ACCENTS.map(a => {
              const on = s.accent === a.key;
              return (
                <button key={a.key} onClick={() => s.setAccent(a.key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 8px', borderRadius: 10,
                    border: `1px solid ${on ? a.hex : BRAND.lineSoft}`,
                    background: on ? tint(a.hex, 0.14) : 'transparent', transition: 'all 150ms ease',
                  }}>
                  <span style={{ width: 40, height: 40, borderRadius: 99, background: a.hex, display: 'block', border: on ? `2px solid ${BRAND.paper}` : 'none', boxShadow: on ? `0 0 0 2px ${a.hex}` : 'none' }} />
                  <span style={{ fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: on ? BRAND.ink : BRAND.ink3 }}>{a.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inicio de semana */}
        <div style={{ marginBottom: 32 }}>
          <Eyebrow text="Inicio de semana" style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', background: BRAND.creamDeep, borderRadius: 9, padding: 4 }}>
            {[['lunes', 'Lunes'], ['domingo', 'Domingo']].map(([v, l]) => (
              <button key={v} onClick={() => s.setWeekStart(v)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 6, fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 14,
                  background: s.weekStart === v ? accent : 'transparent',
                  color: s.weekStart === v ? BRAND.paper : BRAND.ink2, transition: 'all 150ms ease',
                }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Nombre */}
        <div style={{ marginBottom: 32 }}>
          <Eyebrow text="Tu nombre" style={{ marginBottom: 14 }} />
          <input value={s.userName} onChange={(e) => s.setUserName(e.target.value)} placeholder="¿Cómo te llamas?"
            style={{ width: '100%', border: 'none', borderBottom: `1px solid ${BRAND.line}`, background: 'transparent', padding: '6px 0', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, color: BRAND.ink }} />
          <p style={{ margin: '8px 0 0', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12.5, color: BRAND.ink3 }}>Aparecerá en el saludo: «Buenos días, {s.userName || '___'}.»</p>
        </div>

        {/* Hábitos */}
        <div>
          <Eyebrow text="Tus hábitos diarios" style={{ marginBottom: 14 }} />
          <p style={{ margin: '0 0 10px', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12.5, color: BRAND.ink3 }}>Uno por línea. Se repiten en Hoy y Semana.</p>
          <textarea value={draft} onChange={(e) => saveHabits(e.target.value)} rows={6}
            style={{ width: '100%', border: `1px solid ${BRAND.lineSoft}`, borderRadius: 8, background: BRAND.cream, padding: 12, fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: BRAND.ink }} />
        </div>
      </div>
    </div>
  );
}

function saludo() {
  const h = new Date().getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 13) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function App() {
  // Ajustes persistentes
  const [accent,    setAccentRaw]    = usePersist('settings|accent',    'arcilla');
  const [weekStart, setWeekStartRaw] = usePersist('settings|weekStart', 'lunes');
  const [userName,  setUserNameRaw]  = usePersist('settings|userName',  '');
  const [habits,    setHabitsRaw]    = usePersist('settings|habits',    ['Agua 2L', 'Ejercicio', 'Lectura', 'Meditar', 'Dormir bien']);

  // UI (no persiste)
  const [current,      setCurrent]      = React.useState('hoy');
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [anim,         setAnim]         = React.useState(false);

  React.useEffect(() => {
    setAnim(true);
    const t = setTimeout(() => setAnim(false), 260);
    return () => clearTimeout(t);
  }, [current]);

  // Navegación por teclado ← →
  React.useEffect(() => {
    const onKey = (e) => {
      if (settingsOpen) return;
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const idx = VIEWS.findIndex(v => v.key === current);
      if (e.key === 'ArrowRight') setCurrent(VIEWS[(idx + 1) % VIEWS.length].key);
      if (e.key === 'ArrowLeft')  setCurrent(VIEWS[(idx - 1 + VIEWS.length) % VIEWS.length].key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, settingsOpen]);

  const ctx = {
    accent,    setAccent:    setAccentRaw,
    weekStart, setWeekStart: setWeekStartRaw,
    userName,  setUserName:  setUserNameRaw,
    habits,    setHabits:    setHabitsRaw,
  };
  const View = VIEWS.find(v => v.key === current).comp;
  const accentHex = (ACCENTS.find(a => a.key === accent) || ACCENTS[0]).hex;

  return (
    <SettingsContext.Provider value={ctx}>
      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; opacity: 0; cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 22px; height: 22px; opacity: 0; border: none; cursor: pointer; }
        input::placeholder, textarea::placeholder { color: ${BRAND.ink4}; opacity: 1; }
        ::selection { background: ${tint(accentHex, 0.3)}; }
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white; }
          body::before { display: none; }
          main { animation: none !important; }
        }
      `}</style>

      <NavBar
        current={current}
        onChange={setCurrent}
        onOpenSettings={() => setSettingsOpen(true)}
        onExport={exportData}
        onImportClick={() => {}}
        onClearView={() => clearView(current)}
        onClearAll={clearAll}
      />

      {current === 'hoy' && (
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '26px 48px 0' }}>
          <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, color: BRAND.ink2 }}>
            {saludo()}{userName ? `, ${userName}` : ''}.
          </span>
        </div>
      )}

      <main key={current} className={anim ? 'view-anim' : ''}>
        <View />
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </SettingsContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

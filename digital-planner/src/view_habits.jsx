// ─────────────────────────────────────────────
// Vista 5 · HÁBITOS & FINANZAS
// ─────────────────────────────────────────────
function ViewHabits() {
  const [tab, setTab] = React.useState('habitos');
  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '40px 48px 80px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, flexWrap: 'wrap', gap: 20 }}>
        <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 52, lineHeight: 1, color: BRAND.ink }}>
          {tab === 'habitos' ? 'Hábitos' : 'Finanzas'}
        </h1>
        <SubTabs tabs={[['habitos', 'Hábitos'], ['finanzas', 'Finanzas']]} current={tab} onChange={setTab} />
      </header>
      {tab === 'habitos' ? <SubHabitos /> : <SubFinanzas />}
    </div>
  );
}

function SubTabs({ tabs, current, onChange }) {
  const accent = useAccent();
  return (
    <div style={{ display: 'flex', background: BRAND.creamDeep, borderRadius: 9, padding: 3 }}>
      {tabs.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)}
          style={{
            padding: '9px 22px', borderRadius: 7, fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 14,
            background: current === v ? accent : 'transparent',
            color: current === v ? BRAND.paper : BRAND.ink2, transition: 'all 150ms ease',
          }}>{l}</button>
      ))}
    </div>
  );
}

// ── Sub-vista Hábitos ──
function SubHabitos() {
  const accent = useAccent();
  const DEFAULT_HABITS = ['Despertar 7am', 'Agua 2L', 'Ejercicio', 'Lectura', 'Meditar', 'Sin azúcar', 'Pasos 10k', 'Vitaminas', 'Diario', 'Sin pantallas', 'Dormir 23h'];
  const CARITAS = ['😔', '😕', '🙂', '😊', '🤩'];

  const [habits, setHabits] = usePersist('habits|habits', DEFAULT_HABITS);
  const [marks,  setMarks]  = usePersist('habits|marks',  DEFAULT_HABITS.map(() => Array(31).fill(false)));
  const [animo,  setAnimo]  = usePersist('habits|animo',  null);
  const [frase,  setFrase]  = usePersist('habits|frase',  '');

  // Auto-grow: sincroniza filas si el usuario añadió hábitos
  const normalizedMarks = habits.map((_, hi) => marks[hi] || Array(31).fill(false));

  return (
    <div>
      <Eyebrow text="Tracker mensual · 31 días" style={{ marginBottom: 18 }} />
      <div style={{ background: BRAND.paper, border: `1px solid ${BRAND.lineSoft}`, borderRadius: 12, padding: 20, marginBottom: 30 }}>
        <HabitGrid habits={habits} days={31} marks={normalizedMarks} showSum cell={22} firstColWidth={140}
          onLabelChange={(i, v) => setHabits(h => h.map((x, j) => j === i ? v : x))}
          onToggle={(hi, di) => setMarks(m => {
            const next = normalizedMarks.map(r => [...r]);
            next[hi][di] = !next[hi][di];
            return next;
          })} />
        <AddBtn onClick={() => {
          setHabits(h => [...h, '']);
          setMarks(m => [...normalizedMarks, Array(31).fill(false)]);
        }} label="Añadir hábito" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 8 }}>Ánimo del mes</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {CARITAS.map((c, i) => (
              <button key={i} onClick={() => setAnimo(i)}
                style={{ fontSize: 28, opacity: animo === i ? 1 : 0.28, filter: animo === i ? 'none' : 'grayscale(0.5)', transition: 'opacity 140ms ease', padding: 0 }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 4 }}>Cómo me sentí</div>
          <input value={frase} onChange={(e) => setFrase(e.target.value)} placeholder="Una frase para resumir el mes…"
            style={{ width: '100%', border: 'none', borderBottom: `1px solid ${BRAND.lineSoft}`, background: 'transparent', padding: '6px 0', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, color: BRAND.ink }} />
        </div>
      </div>
    </div>
  );
}

// ── Sub-vista Finanzas ──
function SubFinanzas() {
  const accent = useAccent();
  const CATS_DEFAULT = ['Vivienda', 'Comida', 'Transporte', 'Ocio', 'Salud', 'Ahorro', 'Suscripciones', 'Otros'];

  const [entra,  setEntra]  = usePersist('finanzas|entra',  '');
  const [sale,   setSale]   = usePersist('finanzas|sale',   '');
  const [cats,   setCats]   = usePersist('finanzas|cats',   CATS_DEFAULT.map(n => ({ n, ppto: '', gasto: '' })));
  const [ledger, setLedger] = usePersist('finanzas|ledger', Array.from({ length: 12 }, () => ({ f: '', d: '', c: '', i: '' })));

  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? 0 : n; };
  const queda = num(entra) - num(sale);
  const ledgerTotal = ledger.reduce((a, r) => a + num(r.i), 0);
  const fmt = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const bigCell = (label, value, onChange, computed) => (
    <div style={{ flex: 1, background: tint(accent, 0.14), border: `1px solid ${tint(accent, 0.34)}`, borderRadius: 12, padding: '22px 24px' }}>
      <div style={{ fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: darken(accent, 0.28), marginBottom: 10 }}>{label}</div>
      {computed ? (
        <div style={{ fontFamily: BRAND.font.serif, fontWeight: 600, fontSize: 46, color: BRAND.ink, lineHeight: 1 }}>
          {fmt(value)}<span style={{ fontSize: 24, color: BRAND.ink3 }}> €</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" inputMode="decimal"
            style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontWeight: 600, fontSize: 46, color: BRAND.ink, lineHeight: 1 }} />
          <span style={{ fontFamily: BRAND.font.serif, fontSize: 24, color: BRAND.ink3 }}>€</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 36 }}>
        {bigCell('Entra', entra, setEntra)}
        {bigCell('Sale', sale, setSale)}
        {bigCell('Queda', queda, null, true)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 44, alignItems: 'start' }}>
        {/* Categorías */}
        <section>
          <Eyebrow text="Categorías de gasto" style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cats.map((c, i) => {
              const p = num(c.ppto), g = num(c.gasto);
              const pct = p > 0 ? Math.round((g / p) * 100) : 0;
              const over = pct > 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, gap: 12 }}>
                    <span style={{ fontFamily: BRAND.font.sans, fontWeight: 400, fontSize: 14, color: BRAND.ink, minWidth: 90 }}>{c.n}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input value={c.gasto} onChange={(e) => setCats(a => a.map((x, j) => j === i ? { ...x, gasto: e.target.value } : x))} placeholder="0"
                        style={{ width: 46, textAlign: 'right', border: 'none', background: 'transparent', fontFamily: BRAND.font.mono, fontSize: 12.5, color: over ? '#B5564B' : BRAND.ink }} />
                      <span style={{ fontFamily: BRAND.font.mono, fontSize: 11, color: BRAND.ink4 }}>/</span>
                      <input value={c.ppto} onChange={(e) => setCats(a => a.map((x, j) => j === i ? { ...x, ppto: e.target.value } : x))} placeholder="0"
                        style={{ width: 46, border: 'none', background: 'transparent', fontFamily: BRAND.font.mono, fontSize: 12.5, color: BRAND.ink3 }} />
                      <span style={{ fontFamily: BRAND.font.mono, fontSize: 11, color: over ? '#B5564B' : BRAND.ink3, minWidth: 38, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                  <ProgressBar value={Math.min(g, p || g)} max={p || g || 1} showPct={false} height={5} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Ledger */}
        <section>
          <Eyebrow text="Registro de gastos" style={{ marginBottom: 18 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 96px 70px', gap: 0, fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.ink3, paddingBottom: 8, borderBottom: `1px solid ${BRAND.line}` }}>
            <span>Fecha</span><span>Descripción</span><span>Categoría</span><span style={{ textAlign: 'right' }}>Importe</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ledger.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr 96px 70px', gap: 0, alignItems: 'center', borderBottom: `1px solid ${BRAND.lineSoft}` }}>
                <input value={r.f} placeholder="—" onChange={(e) => setLedger(a => a.map((x, j) => j === i ? { ...x, f: e.target.value } : x))}
                  style={{ border: 'none', background: 'transparent', padding: '8px 0', fontFamily: BRAND.font.mono, fontSize: 12, color: BRAND.ink2 }} />
                <input value={r.d} placeholder="…" onChange={(e) => setLedger(a => a.map((x, j) => j === i ? { ...x, d: e.target.value } : x))}
                  style={{ border: 'none', background: 'transparent', padding: '8px 0', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 13.5, color: BRAND.ink }} />
                <input value={r.c} placeholder="…" onChange={(e) => setLedger(a => a.map((x, j) => j === i ? { ...x, c: e.target.value } : x))}
                  style={{ border: 'none', background: 'transparent', padding: '8px 0', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12.5, color: BRAND.ink2 }} />
                <input value={r.i} placeholder="0" onChange={(e) => {
                  setLedger(a => {
                    const next = a.map((x, j) => j === i ? { ...x, i: e.target.value } : x);
                    // auto-grow: si es la última fila y tiene contenido, añade otra
                    if (i === a.length - 1 && e.target.value.trim()) {
                      return [...next, { f: '', d: '', c: '', i: '' }];
                    }
                    return next;
                  });
                }}
                  style={{ border: 'none', background: 'transparent', padding: '8px 0', textAlign: 'right', fontFamily: BRAND.font.mono, fontSize: 12.5, color: BRAND.ink }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <AddBtn onClick={() => setLedger(a => [...a, { f: '', d: '', c: '', i: '' }])} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3 }}>Total</span>
              <span style={{ fontFamily: BRAND.font.serif, fontWeight: 600, fontSize: 28, color: darken(accent, 0.28) }}>{fmt(ledgerTotal)} €</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { ViewHabits, SubTabs, SubHabitos, SubFinanzas });

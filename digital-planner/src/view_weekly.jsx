// ─────────────────────────────────────────────
// Vista 2 · SEMANA (Weekly)
// ─────────────────────────────────────────────
function ViewWeekly() {
  const s = useSettings();
  const accent = useAccent();
  const today = new Date();

  const semHabitos = ['Moverme', 'Leer', 'Agua 2L', 'Sin pantallas'];

  const [tareas,   setTareas]   = usePersist('weekly|tareas',   Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => ({ t: '', d: false }))));
  const [top3,     setTop3]     = usePersist('weekly|top3',     ['', '', '']);
  const [habMarks, setHabMarks] = usePersist('weekly|habMarks', semHabitos.map(() => Array(7).fill(false)));
  const [notas,    setNotas]    = usePersist('weekly|notas',    '');

  const lunesPrimero = s.weekStart === 'lunes';
  const orden = lunesPrimero ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  const baseDate = new Date(today);
  const offset = lunesPrimero ? ((today.getDay() + 6) % 7) : today.getDay();
  baseDate.setDate(today.getDate() - offset);

  const semana = semanaDelAnio(today);

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '40px 48px 80px' }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: BRAND.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 6 }}>Vista semanal</div>
          <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontSize: 52, lineHeight: 1.05, color: BRAND.ink, whiteSpace: 'nowrap' }}>
            Semana {semana} <span style={{ fontStyle: 'italic', color: BRAND.ink2 }}>· {MESES[today.getMonth()]} {today.getFullYear()}</span>
          </h1>
        </div>
        <WeekStartToggle />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, marginBottom: 28 }}>
        {orden.map((dow, ci) => {
          const d = new Date(baseDate);
          d.setDate(baseDate.getDate() + ci);
          const finde = dow === 0 || dow === 6;
          const esHoy = d.toDateString() === today.toDateString();
          return (
            <div key={ci} style={{
              background: finde ? BRAND.creamDeep : BRAND.paper,
              border: `1px solid ${esHoy ? accent : BRAND.lineSoft}`,
              borderRadius: 10, padding: 14, minHeight: 280, minWidth: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${BRAND.lineSoft}` }}>
                <span style={{ fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: esHoy ? darken(accent, 0.28) : BRAND.ink3 }}>{DIAS_CORTOS[dow]}</span>
                <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 30, color: esHoy ? darken(accent, 0.28) : BRAND.ink }}>{d.getDate()}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {(tareas[ci] || []).map((it, ti) => (
                  <CB key={ti} size={14} checked={it.d} strike label={it.t} placeholder="·"
                    onChange={(v) => setTareas(a => a.map((col, j) => j === ci ? col.map((x, k) => k === ti ? { ...x, d: v } : x) : col))}
                    onLabelChange={(v) => setTareas(a => a.map((col, j) => j === ci ? col.map((x, k) => k === ti ? { ...x, t: v } : x) : col))} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.4fr 1fr', gap: 28, alignItems: 'start' }}>
        <section>
          <Eyebrow text="Top 3 de la semana" style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {top3.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 38, color: BRAND.ink3, width: 28, lineHeight: 1 }}>{i + 1}</span>
                <InputLine value={t} onChange={(v) => setTop3(a => a.map((x, j) => j === i ? v : x))} placeholder="Objetivo destacado…" size={16} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Eyebrow text="Hábitos semanales" style={{ marginBottom: 16 }} />
          <HabitGrid habits={semHabitos} days={7} marks={habMarks}
            dayLabels={orden.map(d => DIAS_LETRA[d])}
            firstColWidth={108} cell={30}
            onToggle={(hi, di) => setHabMarks(m => m.map((row, r) => r === hi ? row.map((x, c) => c === di ? !x : x) : row))} />
        </section>

        <section>
          <Eyebrow text="Notas de la semana" style={{ marginBottom: 16 }} />
          <div style={{
            backgroundImage: `repeating-linear-gradient(${BRAND.lineSoft} 0 1px, transparent 1px 30px)`,
            backgroundPosition: '0 30px',
            border: `1px solid ${BRAND.lineSoft}`, borderRadius: 10, padding: '6px 14px', minHeight: 160,
          }}>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Pensamientos sueltos…"
              style={{ width: '100%', minHeight: 150, border: 'none', background: 'transparent', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 15, lineHeight: '30px', color: BRAND.ink }} />
          </div>
        </section>
      </div>
    </div>
  );
}

function WeekStartToggle() {
  const s = useSettings();
  const accent = useAccent();
  const opts = [['lunes', 'Lunes'], ['domingo', 'Domingo']];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: BRAND.ink3 }}>Inicio</span>
      <div style={{ display: 'flex', background: BRAND.creamDeep, borderRadius: 8, padding: 3 }}>
        {opts.map(([v, l]) => (
          <button key={v} onClick={() => s.setWeekStart(v)}
            style={{
              padding: '6px 14px', borderRadius: 6, fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 12.5,
              background: s.weekStart === v ? accent : 'transparent',
              color: s.weekStart === v ? BRAND.paper : BRAND.ink2, transition: 'all 150ms ease',
            }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ViewWeekly, WeekStartToggle });

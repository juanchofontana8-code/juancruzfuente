// ─────────────────────────────────────────────
// Vista 6 · BIENESTAR
// ─────────────────────────────────────────────
function ViewWellness() {
  const s = useSettings();
  const accent = useAccent();

  const lunesPrimero = s.weekStart === 'lunes';
  const orden = lunesPrimero ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  const slots = ['Desayuno', 'Almuerzo', 'Cena', 'Snacks'];
  const AUTOCARE = ['Caminar', 'Estirar', 'Leer', 'Baño', 'Llamar', 'Pausa'];

  const [meals,   setMeals]   = usePersist('wellness|meals',   Array.from({ length: 7 }, () => ({ Desayuno: '', Almuerzo: '', Cena: '', Snacks: '' })));
  const [compraA, setCompraA] = usePersist('wellness|compraA', Array.from({ length: 6 }, () => ({ t: '', d: false })));
  const [compraB, setCompraB] = usePersist('wellness|compraB', Array.from({ length: 6 }, () => ({ t: '', d: false })));
  const [aguaSem, setAguaSem] = usePersist('wellness|aguaSem', Array(7).fill(0));
  const [cuerpo,  setCuerpo]  = usePersist('wellness|cuerpo',  { Energía: 6, Estrés: 4, Descanso: 7 });
  const [care,    setCare]    = usePersist('wellness|care',    AUTOCARE.map(a => ({ act: a, dur: '', d: false })));

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '40px 48px 80px' }}>
      <header style={{ marginBottom: 34 }}>
        <div style={{ fontFamily: BRAND.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 6 }}>Cuidado personal</div>
        <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 56, lineHeight: 1, color: BRAND.ink }}>Bienestar</h1>
      </header>

      {/* Meal planner */}
      <section style={{ marginBottom: 44 }}>
        <Eyebrow text="Menú de la semana" style={{ marginBottom: 18 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '92px repeat(7, minmax(0, 1fr))', gap: 8 }}>
          <div />
          {orden.map((dow, i) => (
            <div key={i} style={{ textAlign: 'center', fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.ink3, paddingBottom: 4 }}>{DIAS_CORTOS[dow]}</div>
          ))}
          {slots.map(slot => (
            <React.Fragment key={slot}>
              <div style={{ display: 'flex', alignItems: 'center', fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 12.5, color: BRAND.ink2 }}>{slot}</div>
              {orden.map((dow, ci) => (
                <div key={ci} style={{ background: BRAND.paper, border: `1px solid ${BRAND.lineSoft}`, borderRadius: 8, minHeight: 56, minWidth: 0 }}>
                  <textarea value={(meals[ci] || {})[slot] || ''} onChange={(e) => setMeals(m => m.map((x, j) => j === ci ? { ...x, [slot]: e.target.value } : x))} placeholder="…"
                    style={{ width: '100%', height: 56, border: 'none', background: 'transparent', padding: '8px 9px', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12, lineHeight: 1.3, color: BRAND.ink }} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 44, alignItems: 'start', marginBottom: 44 }}>
        {/* Lista de compras */}
        <section>
          <Eyebrow text="Lista de compras" style={{ marginBottom: 16 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[[compraA, setCompraA, 'compraA'], [compraB, setCompraB, 'compraB']].map(([list, setList, key]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {list.map((it, i) => (
                  <CB key={i} size={14} checked={it.d} strike label={it.t} placeholder="Artículo…"
                    onChange={(v) => setList(a => a.map((x, j) => j === i ? { ...x, d: v } : x))}
                    onLabelChange={(v) => setList(a => a.map((x, j) => j === i ? { ...x, t: v } : x))} />
                ))}
                <AddBtn onClick={() => setList(a => [...a, { t: '', d: false }])} />
              </div>
            ))}
          </div>
        </section>

        {/* Chequeo corporal */}
        <section>
          <Eyebrow text="Chequeo corporal" style={{ marginBottom: 18 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {Object.keys(cuerpo).map(k => (
              <div key={k}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontFamily: BRAND.font.sans, fontWeight: 400, fontSize: 15, color: BRAND.ink }}>{k}</span>
                  <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 30, color: darken(accent, 0.28), lineHeight: 1 }}>{cuerpo[k]}<span style={{ fontSize: 15, color: BRAND.ink4 }}>/10</span></span>
                </div>
                <Slider value={cuerpo[k]} onChange={(v) => setCuerpo(c => ({ ...c, [k]: v }))} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Agua semanal */}
      <section style={{ marginBottom: 44 }}>
        <Eyebrow text="Agua semanal" style={{ marginBottom: 18 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
          {orden.map((dow, ci) => (
            <div key={ci} style={{ background: BRAND.paper, border: `1px solid ${BRAND.lineSoft}`, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 12 }}>{DIAS_CORTOS[dow]}</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <WaterTracker filled={aguaSem[ci] || 0} total={8} size={15}
                  onToggle={(i) => setAguaSem(a => a.map((x, j) => j === ci ? (i + 1 === x ? i : i + 1) : x))} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Autocuidado */}
      <section>
        <Eyebrow text="Autocuidado" style={{ marginBottom: 18 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {care.map((c, i) => (
            <div key={i} style={{
              background: c.d ? tint(accent, 0.13) : BRAND.paper,
              border: `1px solid ${c.d ? tint(accent, 0.34) : BRAND.lineSoft}`,
              borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 160ms ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <CareIcon idx={i} />
                <CB checked={c.d} onChange={(v) => setCare(a => a.map((x, j) => j === i ? { ...x, d: v } : x))} />
              </div>
              <input value={c.act} onChange={(e) => setCare(a => a.map((x, j) => j === i ? { ...x, act: e.target.value } : x))} placeholder="Actividad…"
                style={{ border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 20, color: BRAND.ink }} />
              <input value={c.dur} onChange={(e) => setCare(a => a.map((x, j) => j === i ? { ...x, dur: e.target.value } : x))} placeholder="Duración…"
                style={{ border: 'none', background: 'transparent', fontFamily: BRAND.font.mono, fontSize: 12, color: BRAND.ink3 }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Slider({ value, onChange }) {
  const accent = useAccent();
  const pct = (value / 10) * 100;
  return (
    <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 99, background: BRAND.lineSoft }} />
      <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 6, borderRadius: 99, background: accent }} />
      <input type="range" min={0} max={10} step={1} value={value} onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ position: 'absolute', left: 0, right: 0, width: '100%', margin: 0, appearance: 'none', WebkitAppearance: 'none', background: 'transparent', height: 22, cursor: 'pointer' }} />
      <span style={{
        position: 'absolute', left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: 99,
        background: BRAND.paper, border: `2px solid ${accent}`, pointerEvents: 'none',
      }} />
    </div>
  );
}

function CareIcon({ idx }) {
  const accent = useAccent();
  const p = { fill: 'none', stroke: darken(accent, 0.22), strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = [
    <path key="a" {...p} d="M6 20l3-7 4 2 5-9" />,
    <g key="b" {...p}><path d="M12 4v8" /><path d="M8 8l4-4 4 4" /><circle cx="12" cy="17" r="3" /></g>,
    <path key="c" {...p} d="M5 5h11a2 2 0 0 1 2 2v12H7a2 2 0 0 1-2-2V5Z M5 5v14" />,
    <path key="d" {...p} d="M4 14h16M6 14V9a3 3 0 0 1 6 0M18 14l1 5H5l1-5" />,
    <path key="e" {...p} d="M5 4h4l1 5-2 1a11 11 0 0 0 5 5l1-2 5 1v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    <g key="f" {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></g>,
  ];
  return <svg width={22} height={22} viewBox="0 0 24 24">{icons[idx % icons.length]}</svg>;
}

Object.assign(window, { ViewWellness, Slider, CareIcon });

// ─────────────────────────────────────────────
// Vista 4 · AÑO (Yearly)
// ─────────────────────────────────────────────
function ViewYearly() {
  const s = useSettings();
  const accent = useAccent();
  const year = new Date().getFullYear();

  const AREAS = ['Cuerpo', 'Mente', 'Dinero', 'Oficio', 'Hogar', 'Gente', 'Alegría'];

  const [palabra, setPalabra] = usePersist('yearly|palabra', '');
  const [marked,  setMarked]  = usePersist('yearly|marked',  {});
  const [metas,   setMetas]   = usePersist('yearly|metas',   AREAS.map(() => ''));
  const [soltar,  setSoltar]  = usePersist('yearly|soltar',  Array.from({ length: 5 }, () => ({ t: '', d: false })));

  const toggleMark = (mi, day) => setMarked(m => {
    const arr = m[mi] || [];
    return { ...m, [mi]: arr.includes(day) ? arr.filter(x => x !== day) : [...arr, day] };
  });

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '40px 48px 80px' }}>
      <header style={{ marginBottom: 34 }}>
        <div style={{ fontFamily: BRAND.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 6 }}>Vista anual</div>
        <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 72, lineHeight: 1, color: BRAND.ink }}>{year}</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 44, alignItems: 'start' }}>
        {/* Lateral izquierdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Card tintBg pad={22}>
            <div style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 6 }}>Palabra del año</div>
            <input value={palabra} onChange={(e) => setPalabra(e.target.value)} placeholder="…"
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 42, color: BRAND.ink, lineHeight: 1.1 }} />
          </Card>

          <section>
            <Eyebrow text="Metas por área" style={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {AREAS.map((a, i) => (
                <div key={i}>
                  <div style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: darken(accent, 0.2), marginBottom: 2 }}>{a}</div>
                  <InputLine value={metas[i] || ''} onChange={(v) => setMetas(m => m.map((x, j) => j === i ? v : x))} placeholder="Una intención…" size={14} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow text="Soltar este año" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {soltar.map((it, i) => (
                <CB key={i} checked={it.d} strike label={it.t} placeholder="Dejar atrás…"
                  onChange={(v) => setSoltar(a => a.map((x, j) => j === i ? { ...x, d: v } : x))}
                  onLabelChange={(v) => setSoltar(a => a.map((x, j) => j === i ? { ...x, t: v } : x))} />
              ))}
            </div>
          </section>
        </div>

        {/* 12 mini-calendarios 4×3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26 }}>
          {Array.from({ length: 12 }).map((_, mi) => (
            <MiniCal key={mi} monthIdx={mi} year={year} marked={marked[mi] || []} weekStart={s.weekStart}
              onMark={(d) => toggleMark(mi, d)} />
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ViewYearly });

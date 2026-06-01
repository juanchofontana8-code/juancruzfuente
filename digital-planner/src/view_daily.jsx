// ─────────────────────────────────────────────
// Vista 1 · HOY (Daily) — datos por fecha
// ─────────────────────────────────────────────
function ViewDaily() {
  const s = useSettings();
  const accent = useAccent();
  const today = new Date();

  // Offset de días desde hoy (0 = hoy, -1 = ayer, …)
  const [dayOffset, setDayOffset] = usePersist('daily|dayOffset', 0);

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dayOffset);
  const dateKey = fmtDate(targetDate); // "YYYY-MM-DD"

  const isToday = dateKey === fmtDate(today);

  // Todos los datos del día se guardan en un único objeto por fecha
  const DEFAULTS = {
    clima: '22° despejado',
    sueno: '7h 40m',
    animo: 2,
    agua: 3,
    tres: ['', '', ''],
    tresDone: [false, false, false],
    foco: '',
    todo: Array.from({ length: 8 }, () => ({ t: '', d: false })),
    agenda: {},
    comidas: { Desayuno: '', Almuerzo: '', Cena: '', Snacks: '' },
    habitos: [],
    momento: '',
    gratitud: ['', '', ''],
  };

  const [allDays, setAllDays] = usePersist('daily|byDate', {});
  const day = { ...DEFAULTS, ...(allDays[dateKey] || {}) };

  function setField(field, value) {
    setAllDays(prev => ({
      ...prev,
      [dateKey]: { ...DEFAULTS, ...(prev[dateKey] || {}), [field]: value },
    }));
  }

  const { clima, sueno, animo, agua, tres, tresDone, foco, todo, agenda, comidas, habitos, momento, gratitud } = day;

  const ANIMOS = ['😔', '😕', '🙂', '😊', '🤩'];
  const horas = Array.from({ length: 17 }, (_, i) => i + 6); // 6 → 22

  const fecha = targetDate.getDate();
  const diaSemana = DIAS_LARGOS[targetDate.getDay()];
  const mes = MESES[targetDate.getMonth()];

  const labelCol = { fontFamily: BRAND.font.mono, fontSize: 9.5, color: BRAND.ink3, letterSpacing: '0.1em', textTransform: 'uppercase' };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 48px 80px' }}>
      {/* Encabezado */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 34 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <NavArrow dir="‹" onClick={() => setDayOffset(o => o - 1)} />
            <span style={{ fontFamily: BRAND.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.ink3 }}>
              {diaSemana} · Semana {String(semanaDelAnio(targetDate)).padStart(2, '0')}
            </span>
            <NavArrow dir="›" onClick={() => setDayOffset(o => o + 1)} disabled={isToday} />
            {!isToday && (
              <button onClick={() => setDayOffset(0)}
                style={{ fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: BRAND.ink3, border: `1px solid ${BRAND.line}`, borderRadius: 99, padding: '4px 12px', marginLeft: 4 }}>
                Hoy
              </button>
            )}
          </div>
          <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 76, lineHeight: 0.95, color: BRAND.ink, whiteSpace: 'nowrap' }}>
            {fecha} <span style={{ fontStyle: 'normal', fontSize: 40, color: BRAND.ink2 }}>de {mes}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Widget icon="sun" label="Clima">
            <input value={clima} onChange={(e) => setField('clima', e.target.value)}
              style={{ border: 'none', background: 'transparent', width: 120, fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 15, color: BRAND.ink }} />
          </Widget>
          <Widget icon="heart" label="Ánimo">
            <div style={{ display: 'flex', gap: 4 }}>
              {ANIMOS.map((em, i) => (
                <button key={i} onClick={() => setField('animo', i)}
                  style={{ fontSize: 17, opacity: animo === i ? 1 : 0.28, filter: animo === i ? 'none' : 'grayscale(0.4)', transition: 'opacity 140ms ease', padding: 0 }}>{em}</button>
              ))}
            </div>
          </Widget>
          <Widget icon="moon" label="Sueño">
            <input value={sueno} onChange={(e) => setField('sueno', e.target.value)}
              style={{ border: 'none', background: 'transparent', width: 70, fontFamily: BRAND.font.mono, fontWeight: 500, fontSize: 15, color: BRAND.ink }} />
          </Widget>
          <Widget icon="drop" label="Agua">
            <WaterTracker filled={agua} total={8} size={17} onToggle={(i) => setField('agua', i + 1 === agua ? i : i + 1)} />
          </Widget>
        </div>
      </header>

      {/* 3 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr 1fr', gap: 30, alignItems: 'start' }}>

        {/* Columna izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <section>
            <Eyebrow text="Las 3 del día" style={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tres.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 26, color: BRAND.ink3, width: 22 }}>{i + 1}</span>
                  <CB checked={tresDone[i] || false} onChange={(v) => setField('tresDone', tresDone.map((x, j) => j === i ? v : x))} />
                  <input value={t} placeholder="…" onChange={(e) => setField('tres', tres.map((x, j) => j === i ? e.target.value : x))}
                    style={{ flex: 1, border: 'none', borderBottom: `1px solid ${BRAND.lineSoft}`, background: 'transparent', padding: '4px 0', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 16, color: (tresDone[i] || false) ? BRAND.ink3 : BRAND.ink, textDecoration: (tresDone[i] || false) ? 'line-through' : 'none' }} />
                </div>
              ))}
            </div>
          </section>

          <Card tintBg pad={20}>
            <div style={{ ...labelCol, marginBottom: 8 }}>Foco del día</div>
            <textarea value={foco} onChange={(e) => setField('foco', e.target.value)} rows={2} placeholder="¿Qué hará hoy memorable?"
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, lineHeight: 1.3, color: BRAND.ink }} />
          </Card>

          <section>
            <Eyebrow text="To-do" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todo.map((it, i) => (
                <CB key={i} checked={it.d} strike
                  onChange={(v) => setField('todo', todo.map((x, j) => j === i ? { ...x, d: v } : x))}
                  label={it.t} placeholder="Tarea…"
                  onLabelChange={(v) => setField('todo', todo.map((x, j) => j === i ? { ...x, t: v } : x))} />
              ))}
            </div>
            <AddBtn onClick={() => setField('todo', [...todo, { t: '', d: false }])} />
          </section>
        </div>

        {/* Columna central · agenda */}
        <section>
          <Eyebrow text="Agenda" style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {horas.map(h => (
              <AgendaSlot key={h} hour={h} event={agenda[h] || ''} onChange={(v) => setField('agenda', { ...agenda, [h]: v })} />
            ))}
          </div>
        </section>

        {/* Columna derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <section>
            <Eyebrow text="Comidas" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.keys(comidas).map(k => (
                <div key={k}>
                  <div style={{ ...labelCol, marginBottom: 2 }}>{k}</div>
                  <InputLine value={comidas[k]} onChange={(v) => setField('comidas', { ...comidas, [k]: v })} placeholder="…" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow text="Hábitos" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {s.habits.map((h, i) => (
                <CB key={i} checked={habitos[i] || false} label={h}
                  onChange={(v) => { const n = [...habitos]; n[i] = v; setField('habitos', n); }} />
              ))}
            </div>
          </section>

          <div style={{ border: `1px dashed ${BRAND.line}`, borderRadius: 10, padding: 18 }}>
            <div style={{ ...labelCol, marginBottom: 6 }}>Momento destacado</div>
            <textarea value={momento} onChange={(e) => setField('momento', e.target.value)} rows={2} placeholder="Algo que quieras recordar…"
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.35, color: BRAND.ink }} />
          </div>

          <section>
            <Eyebrow text="Gratitud" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gratitud.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: accent, flex: '0 0 auto' }} />
                  <InputLine value={g} onChange={(v) => setField('gratitud', gratitud.map((x, j) => j === i ? v : x))} placeholder="Gracias por…" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Widget({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <LineIcon name={icon} />
        <span style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3 }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

function LineIcon({ name, size = 15 }) {
  const c = BRAND.ink2;
  const p = { fill: 'none', stroke: c, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    sun: <g {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></g>,
    heart: <path {...p} d="M12 20s-7-4.5-7-9.5a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6C19 15.5 12 20 12 20Z" />,
    moon: <path {...p} d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
    drop: <path {...p} d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{icons[name]}</svg>;
}

Object.assign(window, { ViewDaily, Widget, LineIcon });

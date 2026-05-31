// ─────────────────────────────────────────────
// Vista 1 · HOY (Daily)
// ─────────────────────────────────────────────
function ViewDaily() {
  const s = useSettings();
  const accent = useAccent();
  const today = new Date();

  const [clima,    setClima]    = usePersist('daily|clima',    '22° despejado');
  const [sueno,    setSueno]    = usePersist('daily|sueno',    '7h 40m');
  const [animo,    setAnimo]    = usePersist('daily|animo',    2);
  const [agua,     setAgua]     = usePersist('daily|agua',     3);
  const [tres,     setTres]     = usePersist('daily|tres',     ['', '', '']);
  const [tresDone, setTresDone] = usePersist('daily|tresDone', [false, false, false]);
  const [foco,     setFoco]     = usePersist('daily|foco',     '');
  const [todo,     setTodo]     = usePersist('daily|todo',     Array.from({ length: 8 }, () => ({ t: '', d: false })));
  const [agenda,   setAgenda]   = usePersist('daily|agenda',   {});
  const [comidas,  setComidas]  = usePersist('daily|comidas',  { Desayuno: '', Almuerzo: '', Cena: '', Snacks: '' });
  const [habitos,  setHabitos]  = usePersist('daily|habitos',  []);
  const [momento,  setMomento]  = usePersist('daily|momento',  '');
  const [gratitud, setGratitud] = usePersist('daily|gratitud', ['', '', '']);

  const ANIMOS = ['😔', '😕', '🙂', '😊', '🤩'];
  const horas = Array.from({ length: 17 }, (_, i) => i + 6); // 6 → 22

  const fecha = today.getDate();
  const diaSemana = DIAS_LARGOS[today.getDay()];
  const mes = MESES[today.getMonth()];

  const labelCol = { fontFamily: BRAND.font.mono, fontSize: 9.5, color: BRAND.ink3, letterSpacing: '0.1em', textTransform: 'uppercase' };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 48px 80px' }}>
      {/* Encabezado */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 34 }}>
        <div>
          <div style={{ fontFamily: BRAND.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 8 }}>
            {diaSemana} · Semana {String(semanaDelAnio(today)).padStart(2, '0')}
          </div>
          <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 76, lineHeight: 0.95, color: BRAND.ink, whiteSpace: 'nowrap' }}>
            {fecha} <span style={{ fontStyle: 'normal', fontSize: 40, color: BRAND.ink2 }}>de {mes}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Widget icon="sun" label="Clima">
            <input value={clima} onChange={(e) => setClima(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: 120, fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 15, color: BRAND.ink }} />
          </Widget>
          <Widget icon="heart" label="Ánimo">
            <div style={{ display: 'flex', gap: 4 }}>
              {ANIMOS.map((em, i) => (
                <button key={i} onClick={() => setAnimo(i)}
                  style={{ fontSize: 17, opacity: animo === i ? 1 : 0.28, filter: animo === i ? 'none' : 'grayscale(0.4)', transition: 'opacity 140ms ease', padding: 0 }}>{em}</button>
              ))}
            </div>
          </Widget>
          <Widget icon="moon" label="Sueño">
            <input value={sueno} onChange={(e) => setSueno(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: 70, fontFamily: BRAND.font.mono, fontWeight: 500, fontSize: 15, color: BRAND.ink }} />
          </Widget>
          <Widget icon="drop" label="Agua">
            <WaterTracker filled={agua} total={8} size={17} onToggle={(i) => setAgua(i + 1 === agua ? i : i + 1)} />
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
                  <CB checked={tresDone[i] || false} onChange={(v) => setTresDone(a => a.map((x, j) => j === i ? v : x))} />
                  <input value={t} placeholder="…" onChange={(e) => setTres(a => a.map((x, j) => j === i ? e.target.value : x))}
                    style={{ flex: 1, border: 'none', borderBottom: `1px solid ${BRAND.lineSoft}`, background: 'transparent', padding: '4px 0', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 16, color: (tresDone[i] || false) ? BRAND.ink3 : BRAND.ink, textDecoration: (tresDone[i] || false) ? 'line-through' : 'none' }} />
                </div>
              ))}
            </div>
          </section>

          <Card tintBg pad={20}>
            <div style={{ ...labelCol, marginBottom: 8 }}>Foco del día</div>
            <textarea value={foco} onChange={(e) => setFoco(e.target.value)} rows={2} placeholder="¿Qué hará hoy memorable?"
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, lineHeight: 1.3, color: BRAND.ink }} />
          </Card>

          <section>
            <Eyebrow text="To-do" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todo.map((it, i) => (
                <CB key={i} checked={it.d} strike
                  onChange={(v) => setTodo(a => a.map((x, j) => j === i ? { ...x, d: v } : x))}
                  label={it.t} placeholder="Tarea…"
                  onLabelChange={(v) => setTodo(a => a.map((x, j) => j === i ? { ...x, t: v } : x))} />
              ))}
            </div>
            <AddBtn onClick={() => setTodo(a => [...a, { t: '', d: false }])} />
          </section>
        </div>

        {/* Columna central · agenda */}
        <section>
          <Eyebrow text="Agenda" style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {horas.map(h => (
              <AgendaSlot key={h} hour={h} event={agenda[h] || ''} onChange={(v) => setAgenda(a => ({ ...a, [h]: v }))} />
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
                  <InputLine value={comidas[k]} onChange={(v) => setComidas(c => ({ ...c, [k]: v }))} placeholder="…" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow text="Hábitos" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {s.habits.map((h, i) => (
                <CB key={i} checked={habitos[i] || false} label={h}
                  onChange={(v) => setHabitos(a => { const n = [...a]; n[i] = v; return n; })} />
              ))}
            </div>
          </section>

          <div style={{ border: `1px dashed ${BRAND.line}`, borderRadius: 10, padding: 18 }}>
            <div style={{ ...labelCol, marginBottom: 6 }}>Momento destacado</div>
            <textarea value={momento} onChange={(e) => setMomento(e.target.value)} rows={2} placeholder="Algo que quieras recordar…"
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.35, color: BRAND.ink }} />
          </div>

          <section>
            <Eyebrow text="Gratitud" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gratitud.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: accent, flex: '0 0 auto' }} />
                  <InputLine value={g} onChange={(v) => setGratitud(a => a.map((x, j) => j === i ? v : x))} placeholder="Gracias por…" />
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

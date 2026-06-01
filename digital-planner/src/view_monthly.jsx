// ─────────────────────────────────────────────
// Vista 3 · MES (Monthly)
// ─────────────────────────────────────────────
function ViewMonthly() {
  const s = useSettings();
  const accent = useAccent();
  const today = new Date();

  const monthHabits = ['Ejercicio', 'Lectura', 'Meditar', 'Escribir'];

  const [cursor,      setCursor]      = usePersist('monthly|cursor',      { m: today.getMonth(), y: today.getFullYear() });
  // tareasDia: "y-m-d" → [{t, d}]  (también se usan como chips en el grid)
  const [tareasDia,   setTareasDia]   = usePersist('monthly|tareasDia',   {});
  const [foco,        setFoco]        = usePersist('monthly|foco',        '');
  const [prioridades, setPrioridades] = usePersist('monthly|prioridades', Array.from({ length: 5 }, () => ({ t: '', d: false })));
  const [pagos,       setPagos]       = usePersist('monthly|pagos',       Array.from({ length: 5 }, () => ({ dia: '', desc: '', d: false })));
  const [habCount,    setHabCount]    = usePersist('monthly|habCount',    monthHabits.map(() => 0));
  const [reflexion,   setReflexion]   = usePersist('monthly|reflexion',   ['', '', '']);
  const [popover,     setPopover]     = React.useState(null);
  const [picker,      setPicker]      = React.useState(false);
  // Datos de HOY para mostrar punto en días con registro
  const [allDays]                     = usePersist('daily|byDate', {});

  const lunesPrimero = s.weekStart === 'lunes';
  const heads = lunesPrimero ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const first = new Date(cursor.y, cursor.m, 1);
  let startDay = first.getDay();
  if (lunesPrimero) startDay = (startDay + 6) % 7;
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const totalCells = 42;
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < totalCells) cells.push(null);

  const dayKey = (d) => `${cursor.y}-${cursor.m}-${d}`;
  const move = (dir) => { setPopover(null); setCursor(c => {
    let m = c.m + dir, y = c.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    return { m, y };
  }); };
  const dowOf = (d) => {
    let dow = new Date(cursor.y, cursor.m, d).getDay();
    return lunesPrimero ? (dow + 6) % 7 : dow;
  };

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '40px 48px 80px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, position: 'relative' }}>
        <button onClick={() => setPicker(p => !p)} title="Ir a otro mes" style={{ display: 'flex', alignItems: 'baseline', gap: 14, textAlign: 'left' }}>
          <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 58, lineHeight: 1.05, color: BRAND.ink }}>{MESES[cursor.m]}</h1>
          <span style={{ fontFamily: BRAND.font.mono, fontSize: 18, color: BRAND.ink3 }}>{cursor.y}</span>
          <span style={{ fontFamily: BRAND.font.serif, fontSize: 22, color: BRAND.ink3, transform: picker ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }}>⌄</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!(cursor.m === today.getMonth() && cursor.y === today.getFullYear()) && (
            <button onClick={() => { setCursor({ m: today.getMonth(), y: today.getFullYear() }); setPicker(false); }}
              style={{ fontFamily: BRAND.font.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: darken(accent, 0.2), border: `1px solid ${BRAND.line}`, borderRadius: 99, padding: '7px 14px' }}>Hoy</button>
          )}
          <NavArrow dir="‹" onClick={() => move(-1)} />
          <NavArrow dir="›" onClick={() => move(1)} />
        </div>

        {picker && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 40, width: 360, background: BRAND.paper, border: `1px solid ${tint(accent, 0.4)}`, borderRadius: 12, padding: 18, boxShadow: '0 20px 50px rgba(43,38,34,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <button onClick={() => setCursor(c => ({ ...c, y: c.y - 1 }))} style={{ fontFamily: BRAND.font.serif, fontSize: 22, color: BRAND.ink2, width: 28 }}>‹</button>
              <span style={{ fontFamily: BRAND.font.mono, fontSize: 16, letterSpacing: '0.05em', color: BRAND.ink }}>{cursor.y}</span>
              <button onClick={() => setCursor(c => ({ ...c, y: c.y + 1 }))} style={{ fontFamily: BRAND.font.serif, fontSize: 22, color: BRAND.ink2, width: 28 }}>›</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {MESES_CORTOS.map((mc, mi) => {
                const on = mi === cursor.m;
                return (
                  <button key={mi} onClick={() => { setPopover(null); setCursor(c => ({ ...c, m: mi })); setPicker(false); }}
                    style={{
                      padding: '10px 0', borderRadius: 8, fontFamily: BRAND.font.sans, fontWeight: on ? 600 : 400, fontSize: 13.5,
                      color: on ? BRAND.paper : BRAND.ink2,
                      background: on ? accent : 'transparent',
                      border: `1px solid ${on ? accent : BRAND.lineSoft}`, transition: 'all 130ms ease',
                    }}>{mc}</button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* Calendario */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
            {heads.map((h, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.1em', color: BRAND.ink3 }}>{h}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, position: 'relative' }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={'e' + i} style={{ aspectRatio: '1 / 0.92' }} />;
              const finde = dowOf(d) >= 5;
              const esHoy = d === today.getDate() && cursor.m === today.getMonth() && cursor.y === today.getFullYear();
              const tareas = (tareasDia[dayKey(d)] || []);
              const pendientes = tareas.filter(x => x.t && x.t.trim() && !x.d);
              const hayTareas = tareas.some(x => x.t && x.t.trim());
              const isOpen = popover === d;
              const isoKey = fmtDate(new Date(cursor.y, cursor.m, d));
              const tieneRegistro = !!(allDays[isoKey] && (allDays[isoKey].foco || allDays[isoKey].momento || (allDays[isoKey].tres || []).some(t => t)));
              return (
                <button key={'d' + i} onClick={() => setPopover(isOpen ? null : d)}
                  style={{
                    aspectRatio: '1 / 0.92', borderRadius: 8, padding: '7px 9px', textAlign: 'left',
                    border: `1px solid ${isOpen ? accent : (esHoy ? accent : BRAND.lineSoft)}`,
                    background: isOpen ? tint(accent, 0.1) : (esHoy ? tint(accent, 0.16) : (finde ? BRAND.creamDeep : BRAND.paper)),
                    display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', overflow: 'hidden',
                    transition: 'all 120ms ease',
                  }}>
                  <span style={{ fontFamily: BRAND.font.mono, fontSize: 13, color: esHoy ? darken(accent, 0.3) : BRAND.ink2, fontWeight: esHoy ? 500 : 400 }}>{d}</span>
                  {pendientes.slice(0, 2).map((t, k) => (
                    <span key={k} style={{ fontFamily: BRAND.font.sans, fontSize: 9.5, color: BRAND.ink2, background: tint(accent, 0.22), borderRadius: 3, padding: '1px 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.t}</span>
                  ))}
                  {tareas.filter(x => x.t && x.t.trim()).length > 2 && (
                    <span style={{ fontFamily: BRAND.font.mono, fontSize: 8.5, color: BRAND.ink3 }}>+{tareas.filter(x => x.t && x.t.trim()).length - 2}</span>
                  )}
                  {hayTareas && tareas.every(x => !x.t || x.d) && (
                    <span style={{ position: 'absolute', bottom: 6, right: 7, width: 7, height: 7, borderRadius: 99, background: accent, opacity: 0.5 }} />
                  )}
                  {tieneRegistro && (
                    <span title="Tiene registro en Hoy" style={{ position: 'absolute', top: 6, right: 7, width: 6, height: 6, borderRadius: 99, background: '#7BA8C4', opacity: 0.85 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel de tareas del día */}
          {popover !== null && (() => {
            const key = dayKey(popover);
            const lista = tareasDia[key] || [{ t: '', d: false }];
            const setLista = (next) => setTareasDia(prev => ({ ...prev, [key]: next }));
            const dowName = DIAS_LARGOS[new Date(cursor.y, cursor.m, popover).getDay()];
            const completadas = lista.filter(x => x.t && x.d).length;
            const total = lista.filter(x => x.t).length;
            return (
              <div style={{ marginTop: 14, background: BRAND.paper, border: `1px solid ${tint(accent, 0.45)}`, borderRadius: 12, padding: '18px 20px', boxShadow: '0 8px 32px rgba(43,38,34,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, color: BRAND.ink }}>
                      {dowName} {popover} de {MESES[cursor.m]}
                    </span>
                    {total > 0 && (
                      <span style={{ fontFamily: BRAND.font.mono, fontSize: 10, color: BRAND.ink3 }}>{completadas}/{total}</span>
                    )}
                  </div>
                  <button onClick={() => setPopover(null)} style={{ fontFamily: BRAND.font.mono, fontSize: 11, color: BRAND.ink3, padding: '4px 8px', borderRadius: 6, border: `1px solid ${BRAND.lineSoft}` }}>cerrar ✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {lista.map((item, k) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CB
                        checked={item.d}
                        strike
                        label={item.t}
                        placeholder={`Tarea ${k + 1}…`}
                        onChange={(v) => setLista(lista.map((x, j) => j === k ? { ...x, d: v } : x))}
                        onLabelChange={(v) => setLista(lista.map((x, j) => j === k ? { ...x, t: v } : x))}
                      />
                      {lista.length > 1 && (
                        <button onClick={() => setLista(lista.filter((_, j) => j !== k))}
                          title="Quitar" style={{ fontFamily: BRAND.font.mono, fontSize: 13, color: BRAND.ink4, flex: '0 0 auto', width: 18, opacity: 0.6 }}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <AddBtn onClick={() => setLista([...lista, { t: '', d: false }])} label="Añadir tarea" />
              </div>
            );
          })()}
        </div>

        {/* Lateral derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Card tintBg pad={20}>
            <div style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 8 }}>Foco del mes</div>
            <textarea value={foco} onChange={(e) => setFoco(e.target.value)} rows={2} placeholder="La intención que guía el mes…"
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: BRAND.font.serif, fontStyle: 'italic', fontSize: 22, lineHeight: 1.3, color: BRAND.ink }} />
          </Card>

          <section>
            <Eyebrow text="Prioridades" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prioridades.map((p, i) => (
                <CB key={i} checked={p.d} strike label={p.t} placeholder="Prioridad…"
                  onChange={(v) => setPrioridades(a => a.map((x, j) => j === i ? { ...x, d: v } : x))}
                  onLabelChange={(v) => setPrioridades(a => a.map((x, j) => j === i ? { ...x, t: v } : x))} />
              ))}
            </div>
          </section>

          <section>
            <Eyebrow text="Pagos del mes" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {pagos.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input value={p.dia} placeholder="01" maxLength={2} onChange={(e) => setPagos(a => a.map((x, j) => j === i ? { ...x, dia: e.target.value } : x))}
                    style={{ width: 32, textAlign: 'center', border: `1px solid ${BRAND.lineSoft}`, borderRadius: 6, background: BRAND.cream, padding: '4px 0', fontFamily: BRAND.font.mono, fontSize: 12, color: BRAND.ink2 }} />
                  <input value={p.desc} placeholder="Descripción…" onChange={(e) => setPagos(a => a.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))}
                    style={{ flex: 1, border: 'none', borderBottom: `1px solid ${BRAND.lineSoft}`, background: 'transparent', padding: '4px 0', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 14, color: p.d ? BRAND.ink3 : BRAND.ink, textDecoration: p.d ? 'line-through' : 'none' }} />
                  <CB checked={p.d} onChange={(v) => setPagos(a => a.map((x, j) => j === i ? { ...x, d: v } : x))} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow text="Hábitos del mes" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {monthHabits.map((h, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 14, color: BRAND.ink }}>{h}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setHabCount(c => c.map((x, j) => j === i ? Math.max(0, x - 1) : x))} style={{ fontFamily: BRAND.font.mono, fontSize: 15, color: BRAND.ink3, width: 16 }}>−</button>
                      <span style={{ fontFamily: BRAND.font.mono, fontSize: 12, color: BRAND.ink2, minWidth: 38, textAlign: 'center' }}>{habCount[i] || 0}/31</span>
                      <button onClick={() => setHabCount(c => c.map((x, j) => j === i ? Math.min(31, x + 1) : x))} style={{ fontFamily: BRAND.font.mono, fontSize: 15, color: darken(accent, 0.2), width: 16 }}>+</button>
                    </div>
                  </div>
                  <ProgressBar value={habCount[i] || 0} max={31} showPct={false} height={5} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <Eyebrow text="Reflexión del mes" style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reflexion.map((r, i) => (
                <InputLine key={i} value={r} onChange={(v) => setReflexion(a => a.map((x, j) => j === i ? v : x))} placeholder="…" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function NavArrow({ dir, onClick }) {
  const accent = useAccent();
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 40, height: 40, borderRadius: 99, border: `1px solid ${h ? accent : BRAND.line}`,
        background: h ? tint(accent, 0.12) : 'transparent', color: BRAND.ink2,
        fontFamily: BRAND.font.serif, fontSize: 24, lineHeight: 1, transition: 'all 150ms ease',
      }}>{dir}</button>
  );
}

Object.assign(window, { ViewMonthly, NavArrow });

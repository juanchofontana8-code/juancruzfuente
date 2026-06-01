// ─────────────────────────────────────────────
// Vista 7 · AGENDA (Day calendar)
// ─────────────────────────────────────────────
function ViewAgenda() {
  const s = useSettings();
  const accent = useAccent();
  const today = new Date();

  // Fecha seleccionada como string "YYYY-MM-DD"
  const todayKey = dateKey(today);
  const [selKey, setSelKey] = usePersist('agenda|selKey', todayKey);
  // Eventos: {"YYYY-MM-DD": {6:[{t,desc}], 7:[...], ...}}
  const [eventos, setEventos] = usePersist('agenda|eventos', {});
  // Mes visible en el mini-calendario
  const selDate = parseKey(selKey);
  const [miniCursor, setMiniCursor] = React.useState({ m: selDate.getMonth(), y: selDate.getFullYear() });

  const horas = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 – 23:00

  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function parseKey(k) {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function moveDay(n) {
    const d = parseKey(selKey);
    d.setDate(d.getDate() + n);
    const nk = dateKey(d);
    setSelKey(nk);
    setMiniCursor({ m: d.getMonth(), y: d.getFullYear() });
  }
  function goToKey(k) {
    const d = parseKey(k);
    setSelKey(k);
    setMiniCursor({ m: d.getMonth(), y: d.getFullYear() });
  }

  const evDay = eventos[selKey] || {};
  const setEvDay = (next) => setEventos(prev => ({ ...prev, [selKey]: next }));

  const addEvent = (h) => {
    const list = evDay[h] || [];
    setEvDay({ ...evDay, [h]: [...list, { t: '', desc: '' }] });
  };
  const updateEvent = (h, i, field, val) => {
    const list = (evDay[h] || []).map((x, j) => j === i ? { ...x, [field]: val } : x);
    setEvDay({ ...evDay, [h]: list });
  };
  const removeEvent = (h, i) => {
    const list = (evDay[h] || []).filter((_, j) => j !== i);
    const next = { ...evDay };
    if (list.length === 0) delete next[h]; else next[h] = list;
    setEvDay(next);
  };

  // Mini calendario
  const lunesPrimero = s.weekStart === 'lunes';
  const heads = lunesPrimero ? ['L','M','X','J','V','S','D'] : ['D','L','M','X','J','V','S'];
  const firstOfMonth = new Date(miniCursor.y, miniCursor.m, 1);
  let startDay = firstOfMonth.getDay();
  if (lunesPrimero) startDay = (startDay + 6) % 7;
  const daysInMonth = new Date(miniCursor.y, miniCursor.m + 1, 0).getDate();
  const miniCells = [];
  for (let i = 0; i < startDay; i++) miniCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) miniCells.push(d);

  const miniKey = (d) => `${miniCursor.y}-${String(miniCursor.m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const moveMini = (dir) => setMiniCursor(c => {
    let m = c.m + dir, y = c.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    return { m, y };
  });

  // Formato de cabecera del día seleccionado
  const diaNombre = DIAS_LARGOS[selDate.getDay()];
  const esHoy = selKey === todayKey;
  const semana = semanaDelAnio(selDate);

  // Cuenta total de eventos del día para el badge
  const totalEv = Object.values(evDay).reduce((a, list) => a + list.filter(x => x.t.trim()).length, 0);

  return (
    <div style={{ maxWidth: 1340, margin: '0 auto', padding: '40px 48px 80px' }}>
      {/* Cabecera */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 36 }}>
        <div>
          <div style={{ fontFamily: BRAND.font.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 8 }}>
            {diaNombre} · Semana {String(semana).padStart(2, '0')}
            {esHoy && <span style={{ marginLeft: 12, color: accent, fontWeight: 600 }}>· Hoy</span>}
          </div>
          <h1 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontStyle: 'italic', fontSize: 72, lineHeight: 0.95, color: BRAND.ink, whiteSpace: 'nowrap' }}>
            {selDate.getDate()} <span style={{ fontStyle: 'normal', fontSize: 40, color: BRAND.ink2 }}>de {MESES[selDate.getMonth()]} {selDate.getFullYear()}</span>
          </h1>
        </div>

        {/* Navegación */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!esHoy && (
            <button onClick={() => goToKey(todayKey)}
              style={{ fontFamily: BRAND.font.mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: darken(accent, 0.2), border: `1px solid ${BRAND.line}`, borderRadius: 99, padding: '7px 14px' }}>
              Hoy
            </button>
          )}
          <NavArrow dir="‹" onClick={() => moveDay(-1)} />
          <NavArrow dir="›" onClick={() => moveDay(1)} />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 44, alignItems: 'start' }}>

        {/* ── Columna principal: horarios ── */}
        <div style={{ background: BRAND.paper, border: `1px solid ${BRAND.lineSoft}`, borderRadius: 14, overflow: 'hidden' }}>
          {horas.map((h, idx) => {
            const list = evDay[h] || [];
            const hasContent = list.some(x => x.t.trim() || x.desc.trim());
            return (
              <div key={h} style={{
                display: 'grid', gridTemplateColumns: '56px 1fr',
                borderBottom: idx < horas.length - 1 ? `1px solid ${BRAND.lineSoft}` : 'none',
                minHeight: 52,
              }}>
                {/* Hora */}
                <div style={{
                  fontFamily: BRAND.font.mono, fontSize: 11, color: BRAND.ink3,
                  padding: '14px 0 0 16px', borderRight: `1px solid ${BRAND.lineSoft}`,
                  background: BRAND.cream, userSelect: 'none',
                }}>
                  {String(h).padStart(2,'0')}:00
                </div>

                {/* Contenido del slot */}
                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {list.map((ev, i) => (
                    <div key={i} style={{
                      background: tint(accent, 0.13), border: `1px solid ${tint(accent, 0.32)}`,
                      borderLeft: `3px solid ${accent}`,
                      borderRadius: 7, padding: '7px 10px',
                      display: 'flex', flexDirection: 'column', gap: 4,
                      position: 'relative',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          value={ev.t}
                          placeholder="Título del evento…"
                          onChange={(e) => updateEvent(h, i, 't', e.target.value)}
                          style={{
                            flex: 1, border: 'none', background: 'transparent',
                            fontFamily: BRAND.font.sans, fontWeight: 500, fontSize: 14, color: BRAND.ink,
                          }}
                        />
                        <button onClick={() => removeEvent(h, i)}
                          title="Eliminar" style={{ color: BRAND.ink4, fontSize: 14, lineHeight: 1, opacity: 0.7, flex: '0 0 auto' }}>✕</button>
                      </div>
                      <input
                        value={ev.desc}
                        placeholder="Notas (opcional)…"
                        onChange={(e) => updateEvent(h, i, 'desc', e.target.value)}
                        style={{
                          border: 'none', background: 'transparent',
                          fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12.5, color: BRAND.ink2,
                          width: '100%',
                        }}
                      />
                    </div>
                  ))}

                  {/* Botón + añadir */}
                  <button onClick={() => addEvent(h)} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '3px 0',
                    fontFamily: BRAND.font.mono, fontSize: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: hasContent ? darken(accent, 0.18) : BRAND.ink4,
                    opacity: hasContent ? 1 : 0,
                    transition: 'opacity 150ms ease',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = hasContent ? 1 : 0}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 99,
                      border: `1px solid ${BRAND.line}`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, color: darken(accent, 0.2),
                    }}>+</span>
                    Añadir
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Columna lateral: mini calendario ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Resumen del día */}
          {totalEv > 0 && (
            <Card tintBg pad={16}>
              <div style={{ fontFamily: BRAND.font.mono, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.ink3, marginBottom: 10 }}>
                {totalEv} evento{totalEv > 1 ? 's' : ''} hoy
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {horas.flatMap(h => (evDay[h] || []).filter(x => x.t.trim()).map((ev, i) => (
                  <div key={`${h}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: BRAND.font.mono, fontSize: 10, color: BRAND.ink3, flex: '0 0 auto', minWidth: 34 }}>
                      {String(h).padStart(2,'0')}:00
                    </span>
                    <span style={{ fontFamily: BRAND.font.sans, fontWeight: 400, fontSize: 13, color: BRAND.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.t}
                    </span>
                  </div>
                )))}
              </div>
            </Card>
          )}

          {/* Mini calendario */}
          <div style={{ background: BRAND.paper, border: `1px solid ${BRAND.lineSoft}`, borderRadius: 12, padding: 18 }}>
            {/* Cabecera mes */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <button onClick={() => moveMini(-1)} style={{ fontFamily: BRAND.font.serif, fontSize: 20, color: BRAND.ink2, width: 26 }}>‹</button>
              <span style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: BRAND.ink }}>
                {MESES_CORTOS[miniCursor.m]} {miniCursor.y}
              </span>
              <button onClick={() => moveMini(1)} style={{ fontFamily: BRAND.font.serif, fontSize: 20, color: BRAND.ink2, width: 26 }}>›</button>
            </div>

            {/* Grid días */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {heads.map((h, i) => (
                <div key={i} style={{ textAlign: 'center', fontFamily: BRAND.font.mono, fontSize: 8.5, color: BRAND.ink4, paddingBottom: 4 }}>{h}</div>
              ))}
              {miniCells.map((d, i) => {
                if (d === null) return <div key={'e' + i} />;
                const k = miniKey(d);
                const isSelected = k === selKey;
                const isToday = k === todayKey;
                const hasEv = eventos[k] && Object.values(eventos[k]).some(list => list.some(x => x.t.trim()));
                return (
                  <button key={i} onClick={() => goToKey(k)}
                    style={{
                      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 6, border: isToday && !isSelected ? `1.5px solid ${tint(accent, 0.6)}` : 'none',
                      background: isSelected ? accent : 'transparent',
                      color: isSelected ? BRAND.paper : BRAND.ink2,
                      fontFamily: BRAND.font.mono, fontSize: 11, fontWeight: isToday ? 600 : 400,
                      position: 'relative', transition: 'all 120ms ease',
                    }}>
                    {d}
                    {hasEv && !isSelected && (
                      <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: 99, background: accent }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ViewAgenda });

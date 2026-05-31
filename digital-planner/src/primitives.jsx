// ─────────────────────────────────────────────
// PLANNERFY · Primitivos reutilizables
// ─────────────────────────────────────────────
const { useState, useRef, useEffect } = React;

// ── CB · checkbox 14×14 con marca diagonal en acento ──
function CB({ checked, onChange, label, onLabelChange, placeholder, size = 16, strike = false }) {
  const accent = useAccent();
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minWidth: 0 }}>
      <span
        onClick={(e) => { e.preventDefault(); onChange && onChange(!checked); }}
        style={{
          flex: '0 0 auto',
          width: size, height: size,
          borderRadius: 4,
          border: `1.5px solid ${checked ? accent : BRAND.line}`,
          background: checked ? accent : 'transparent',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 160ms ease',
        }}
      >
        {checked && (
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 12 12" fill="none">
            <path d="M2 6.4L4.6 9L10 3" stroke={BRAND.paper} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {onLabelChange !== undefined ? (
        <input
          value={label}
          placeholder={placeholder}
          onChange={(e) => onLabelChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0, border: 'none', background: 'transparent',
            fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 15,
            color: checked ? BRAND.ink3 : BRAND.ink,
            textDecoration: (strike && checked) ? 'line-through' : 'none',
          }}
        />
      ) : (label !== undefined ? (
        <span style={{
          fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 15,
          color: checked ? BRAND.ink3 : BRAND.ink, whiteSpace: 'nowrap',
          textDecoration: (strike && checked) ? 'line-through' : 'none',
        }}>{label}</span>
      ) : null)}
    </label>
  );
}

// ── Eyebrow · monospace pequeño uppercase con hairline ──
function Eyebrow({ text, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      <span style={{
        fontFamily: BRAND.font.mono, fontSize: 10.5, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: BRAND.ink3, whiteSpace: 'nowrap',
      }}>{text}</span>
      <span style={{ flex: 1, height: 1, background: BRAND.lineSoft }} />
    </div>
  );
}

// ── ProgressBar · barra fina con porcentaje ──
function ProgressBar({ value, max, showPct = true, height = 6 }) {
  const accent = useAccent();
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height, background: BRAND.lineSoft, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 99, transition: 'width 220ms ease' }} />
      </div>
      {showPct && (
        <span style={{ fontFamily: BRAND.font.mono, fontSize: 11, color: BRAND.ink3, minWidth: 34, textAlign: 'right' }}>{pct}%</span>
      )}
    </div>
  );
}

// ── InputLine · input con sólo línea inferior hairline ──
function InputLine({ value, onChange, placeholder, italic = false, mono = false, size = 15, weight = 300, align = 'left', color, strike = false }) {
  const accent = useAccent();
  const [focus, setFocus] = useState(false);
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', border: 'none', background: 'transparent',
        borderBottom: `1px solid ${focus ? accent : BRAND.lineSoft}`,
        padding: '5px 0', fontSize: size, fontWeight: weight, textAlign: align,
        fontFamily: mono ? BRAND.font.mono : (italic ? BRAND.font.serif : BRAND.font.sans),
        fontStyle: italic ? 'italic' : 'normal',
        color: color || BRAND.ink,
        textDecoration: strike ? 'line-through' : 'none',
        transition: 'border-color 160ms ease',
      }}
    />
  );
}

// ── Card · fondo tint, padding 16, sin sombra ──
function Card({ children, tintBg = false, pad = 18, style }) {
  const accent = useAccent();
  return (
    <div style={{
      background: tintBg ? tint(accent, 0.14) : BRAND.paper,
      border: `1px solid ${tintBg ? tint(accent, 0.32) : BRAND.lineSoft}`,
      borderRadius: 10, padding: pad, ...style,
    }}>{children}</div>
  );
}

// ── WaterTracker · vasos como gotas SVG clicables ──
function WaterTracker({ filled, total, onToggle, size = 22 }) {
  const accent = useAccent();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled;
        return (
          <button key={i} onClick={() => onToggle(i)} title={`Vaso ${i + 1}`}
            style={{ padding: 0, lineHeight: 0, transition: 'transform 120ms ease' }}>
            <svg width={size} height={size * 1.18} viewBox="0 0 24 28">
              <path d="M12 1 C12 1 3 12 3 18 a9 9 0 0 0 18 0 C21 12 12 1 12 1 Z"
                fill={on ? accent : 'transparent'}
                stroke={on ? accent : BRAND.line} strokeWidth="1.4" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// ── HabitGrid · rejilla hábitos × días ──
function HabitGrid({ habits, days, marks, onToggle, onLabelChange, dayLabels, showSum = false, firstColWidth = 132, cell = 26 }) {
  const accent = useAccent();
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `${firstColWidth}px repeat(${days}, ${cell}px)${showSum ? ` ${cell + 6}px` : ''}`, gap: 4, minWidth: 'min-content' }}>
        {/* fila cabecera */}
        <div />
        {Array.from({ length: days }).map((_, d) => (
          <div key={'h' + d} style={{ textAlign: 'center', fontFamily: BRAND.font.mono, fontSize: 9.5, color: BRAND.ink3, paddingBottom: 4 }}>
            {dayLabels ? dayLabels[d] : d + 1}
          </div>
        ))}
        {showSum && <div style={{ textAlign: 'center', fontFamily: BRAND.font.mono, fontSize: 9.5, color: BRAND.ink3, paddingBottom: 4 }}>Σ</div>}

        {habits.map((hab, hi) => {
          const sum = (marks[hi] || []).filter(Boolean).length;
          return (
            <React.Fragment key={'r' + hi}>
              {onLabelChange ? (
                <input value={hab} onChange={(e) => onLabelChange(hi, e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12.5, color: BRAND.ink, paddingRight: 8, minWidth: 0 }} />
              ) : (
                <div style={{ fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 12.5, color: BRAND.ink, display: 'flex', alignItems: 'center', paddingRight: 8 }}>{hab}</div>
              )}
              {Array.from({ length: days }).map((_, d) => {
                const on = marks[hi] && marks[hi][d];
                return (
                  <button key={d} onClick={() => onToggle(hi, d)}
                    style={{
                      height: cell, borderRadius: 5,
                      border: `1px solid ${on ? accent : BRAND.lineSoft}`,
                      background: on ? accent : BRAND.cream,
                      transition: 'all 130ms ease',
                    }} />
                );
              })}
              {showSum && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BRAND.font.mono, fontSize: 12, fontWeight: 500, color: sum > 0 ? darken(accent, 0.28) : BRAND.ink4 }}>{sum}</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── AgendaSlot · franja de agenda horaria ──
function AgendaSlot({ hour, event, onChange }) {
  const accent = useAccent();
  const has = event && event.trim().length > 0;
  const label = `${String(hour).padStart(2, '0')}:00`;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr', alignItems: 'stretch', gap: 10, minHeight: 34 }}>
      <div style={{ fontFamily: BRAND.font.mono, fontSize: 10.5, color: BRAND.ink3, paddingTop: 9, textAlign: 'right' }}>{label}</div>
      <div style={{
        borderTop: `1px solid ${BRAND.lineSoft}`,
        background: has ? tint(accent, 0.13) : 'transparent',
        borderLeft: has ? `2.5px solid ${accent}` : '2.5px solid transparent',
        borderRadius: has ? '0 6px 6px 0' : 0,
        transition: 'background 160ms ease',
      }}>
        <input value={event} placeholder="" onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', border: 'none', background: 'transparent', padding: '8px 10px', fontFamily: BRAND.font.sans, fontWeight: 300, fontSize: 13.5, color: BRAND.ink }} />
      </div>
    </div>
  );
}

// ── MiniCal · mini-calendario del año ──
function MiniCal({ monthIdx, year, marked, onMark, weekStart }) {
  const accent = useAccent();
  const first = new Date(year, monthIdx, 1);
  let startDay = first.getDay(); // 0 = domingo
  if (weekStart === 'lunes') startDay = (startDay + 6) % 7;
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const heads = weekStart === 'lunes'
    ? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    : ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ fontFamily: BRAND.font.serif, fontStyle: 'italic', fontWeight: 500, fontSize: 19, color: BRAND.ink, marginBottom: 8 }}>{MESES[monthIdx]}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {heads.map((h, i) => (
          <div key={'h' + i} style={{ textAlign: 'center', fontFamily: BRAND.font.mono, fontSize: 8.5, color: BRAND.ink4, paddingBottom: 2 }}>{h}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={'e' + i} />;
          const on = marked && marked.includes(d);
          return (
            <button key={'d' + i} onClick={() => onMark(d)}
              style={{
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 5, border: 'none',
                background: on ? accent : 'transparent',
                color: on ? BRAND.paper : BRAND.ink2,
                fontFamily: BRAND.font.mono, fontSize: 9.5,
                transition: 'all 120ms ease',
              }}>{d}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── AddBtn · botón (+) discreto ──
function AddBtn({ onClick, label = 'Añadir' }) {
  const accent = useAccent();
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 8,
      fontFamily: BRAND.font.mono, fontSize: 10.5, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: BRAND.ink3,
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 99, border: `1px solid ${BRAND.line}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: darken(accent, 0.2), lineHeight: 1,
      }}>+</span>
      {label}
    </button>
  );
}

// ── SectionTitle · título serif de sección ──
function SectionTitle({ children, size = 26 }) {
  return (
    <h2 style={{ margin: 0, fontFamily: BRAND.font.serif, fontWeight: 500, fontSize: size, color: BRAND.ink, letterSpacing: '0.005em' }}>{children}</h2>
  );
}

Object.assign(window, {
  CB, Eyebrow, ProgressBar, InputLine, Card,
  WaterTracker, HabitGrid, AgendaSlot, MiniCal, AddBtn, SectionTitle,
});

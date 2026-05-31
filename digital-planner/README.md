# Mi Planner — Web App autónoma

Planner personal interactivo generado a partir del handoff de diseño.
Todo el contenido que escribas se guarda automáticamente en el navegador.

## Generar el HTML

```bash
npm install && npm run build:planner
```

El archivo final aparece en `out/mi-planner.html`.

## Abrir el planner

Haz doble clic en `out/mi-planner.html` — se abre con doble clic en Chrome, Safari (iPad incluido) y Firefox. No necesita conexión a internet.

## Vistas disponibles

| Vista | Contenido |
|---|---|
| **Hoy** | Fecha, clima, ánimo, sueño, agua, las 3 del día, agenda por horas, to-do, comidas, hábitos, momento destacado, gratitud |
| **Semana** | 7 columnas de tareas, top 3, hábitos semanales (tracker), notas |
| **Mes** | Calendario con eventos por día, foco, prioridades, pagos, hábitos del mes, reflexión |
| **Año** | Palabra del año, metas por área, lista "soltar", 12 mini-calendarios marcables |
| **Hábitos & Finanzas** | Tracker de hábitos 31 días × N hábitos · Finanzas (entra/sale/queda, categorías con presupuesto, registro de gastos auto-creciente) |
| **Bienestar** | Menú semanal, lista de compras, chequeo corporal (sliders), agua semanal, autocuidado |

## Navegar

- Clic en las pestañas de la barra superior.
- Teclas **← →** cuando el foco no está en un campo de texto.

## Barra de utilidades (iconos en la esquina derecha de la barra)

| Icono | Acción |
|---|---|
| ↓ Exportar | Descarga un JSON con todos tus datos (`mi-planner-datos.json`) |
| ↑ Importar | Carga un JSON exportado previamente y recarga |
| 🗑 Borrar vista | Borra solo los datos de la vista activa (pide confirmación) |
| ⊘ Borrar todo | Borra todos los datos del planner (pide confirmación) |
| 🖨 Imprimir | Imprime / guarda como PDF (la barra de navegación se oculta automáticamente) |
| ⚙ Ajustes | Abre el panel lateral: color de acento, inicio de semana, tu nombre y tus hábitos personalizados |

## Persistencia

- Todo lo que escribas se guarda en `localStorage` bajo el prefijo `lp:mi-planner:`.
- Al recargar o reabrir el archivo, los datos se restauran automáticamente.
- Los datos son locales al navegador; para trasladarlos a otro dispositivo usa Exportar / Importar.

## Color de acento

En **Ajustes** (icono ⚙) puedes elegir entre seis acentos: Greige, Salvia, Lavanda, Cielo, Rubor y Arcilla. La elección persiste entre sesiones.

## Imprimir / PDF

Ctrl+P (Cmd+P en Mac) abre el diálogo de impresión. La barra de navegación desaparece; el contenido se imprime en A4 horizontal. Para mejores resultados, selecciona «Sin márgenes» y «Escalar al 100%» en el diálogo del navegador.

## Cambiar textos o idioma

Edita los literales en los archivos `src/*.jsx` y vuelve a ejecutar `npm run build:planner`. El idioma de la interfaz es castellano; para cambiar a otro idioma sustituye los textos en los JSX y en las constantes de `src/brand.jsx` (arrays `DIAS_*`, `MESES`, `MESES_CORTOS`).

## Estructura del proyecto

```
digital-planner/
├── package.json
├── build/
│   └── build-planner.mjs    ← script de build
├── src/
│   ├── brand.jsx             ← tokens, paleta, usePersist
│   ├── primitives.jsx        ← componentes reutilizables
│   ├── view_daily.jsx        ← vista Hoy
│   ├── view_weekly.jsx       ← vista Semana
│   ├── view_monthly.jsx      ← vista Mes
│   ├── view_yearly.jsx       ← vista Año
│   ├── view_habits.jsx       ← vista Hábitos & Finanzas
│   ├── view_wellness.jsx     ← vista Bienestar
│   └── app.jsx               ← shell, NavBar, ajustes, export/import
├── assets/fonts/
│   └── fonts-inline.css      ← caché de fuentes woff2 en base64
└── out/
    └── mi-planner.html       ← entregable final
```

## Notas de diseño

- El planner usa la fecha actual como referencia (no es una agenda anual fija): las vistas de Hoy y Semana siempre muestran el día/semana en curso.
- La vista Año muestra el año en curso con mini-calendarios para marcar días destacados.
- El registro de gastos (ledger) crece automáticamente al rellenar la última fila; las filas añadidas persisten.
- Los hábitos personalizados (Ajustes → "Tus hábitos diarios") se reflejan en la vista Hoy.

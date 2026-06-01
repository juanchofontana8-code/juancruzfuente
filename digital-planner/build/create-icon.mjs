// Genera el ícono de Plannerfy (512×512 PNG) usando sharp + SVG inline
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'assets', 'icons', 'icon.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Fondo con esquinas redondeadas, color tinta del planner -->
  <rect width="512" height="512" rx="110" ry="110" fill="#2B2622"/>
  <!-- Punto acento arcilla, igual que en la NavBar -->
  <circle cx="256" cy="128" r="28" fill="#C99577"/>
  <!-- Nombre en serif itálica -->
  <text
    x="256" y="300"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="148"
    font-style="italic"
    font-weight="bold"
    text-anchor="middle"
    fill="#FAF6EE"
    letter-spacing="-4">P</text>
  <!-- Subtítulo monospace pequeño -->
  <text
    x="256" y="376"
    font-family="'Courier New', Courier, monospace"
    font-size="38"
    font-weight="400"
    text-anchor="middle"
    fill="#8C8275"
    letter-spacing="10">LANNERFY</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(OUT);

console.log('✓  Icon generated →', OUT);

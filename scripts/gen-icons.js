const sharp = require('sharp');
const fs = require('fs');

const AMBER = '#FFB020';
const AMBER_DIM = '#7A5A1E';
const WHITE = '#E8EAED';
const BG_DARK = '#0B0E11';
const BG_MID = '#1a2028';

// Builds the ring + tick marks + ascending-bars glyph, centered at (512,512),
// scaled by `scale` (1 = full size, used for the plain icon; smaller for the
// Android adaptive icon so it survives circular/squircle masking).
function buildMark(scale) {
  const cx = 512, cy = 512;
  const ringR = 300;
  const ringW = 48;

  // 12 tick marks radiating around the ring, evenly spaced.
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const rInner = 366;
    const rOuter = 400;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${AMBER}" stroke-width="14" stroke-linecap="round" opacity="0.55"/>`;
  }

  // 4 ascending bars (financial-growth cue), tallest bar in amber as an accent.
  const barW = 70, gap = 20;
  const baseline = 672;
  const heights = [120, 190, 260, 330];
  const startX = cx - (4 * barW + 3 * gap) / 2;
  let bars = '';
  heights.forEach((h, i) => {
    const x = startX + i * (barW + gap);
    const y = baseline - h;
    const color = i === heights.length - 1 ? AMBER : WHITE;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="10" fill="${color}"/>`;
  });

  const ring = `<circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="${AMBER}" stroke-width="${ringW}"/>`;

  return `<g transform="translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})">${ticks}${ring}${bars}</g>`;
}

function iconSvg() {
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stop-color="${BG_MID}"/>
        <stop offset="100%" stop-color="${BG_DARK}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#bg)"/>
    ${buildMark(1)}
  </svg>`;
}

function adaptiveIconSvg() {
  // Transparent background — app.json already supplies the solid
  // background color layer for Android adaptive icons. Content is
  // scaled down so it survives circular/squircle launcher masking.
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    ${buildMark(0.72)}
  </svg>`;
}

function splashSvg() {
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stop-color="${BG_MID}"/>
        <stop offset="100%" stop-color="${BG_DARK}"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#bg)"/>
    ${buildMark(0.82)}
    <text x="512" y="860" text-anchor="middle" font-family="monospace" font-weight="700" font-size="72" letter-spacing="6" fill="${WHITE}">FUSE</text>
  </svg>`;
}

async function run() {
  await sharp(Buffer.from(iconSvg())).png().toFile('assets/icon.png');
  await sharp(Buffer.from(adaptiveIconSvg())).png().toFile('assets/adaptive-icon.png');
  await sharp(Buffer.from(splashSvg())).png().toFile('assets/splash.png');
  console.log('done');
}

run().catch((e) => { console.error(e); process.exit(1); });

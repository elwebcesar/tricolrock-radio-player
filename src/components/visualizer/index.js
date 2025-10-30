/**
 * Visualizer Component: Create a audio visualizer that adapts to the music being played
 * @module visualizer
*/

// Checks if an element is visible in the current viewport
function isElementVisible(el) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
}

/**
 * Starts audio visualizer
 * @param {HTMLCanvasElement} canvas - Canvas element where the visualizer will be rendered
 * @param {Analyser} analyser - Analyser object from the AudioContext API
 * @param {string|string[]} stationColor - Color or colors of the visualizer
 * @param {string[]} DEFAULT_COLOURS - Default colors of the visualizer
*/
export function startVisualizer(canvas, analyser, stationColor, DEFAULT_COLOURS) {
  // color validation
  let colours;
  let isSingleColor = false;

  if (typeof stationColor === 'string') {
    colours = [stationColor, stationColor, stationColor];
    isSingleColor = true;
  } else if (Array.isArray(stationColor) && stationColor.length >= 3) {
    colours = stationColor.slice(0, 3);
  } else {
    colours = DEFAULT_COLOURS;
  }

  // sanitiza hex
  colours = colours.map(c =>
    /^#[0-9A-Fa-f]{6}$/.test(c) ? c : DEFAULT_COLOURS[colours.indexOf(c)] || '#ffffff'
  );

  // console.log('🎨 Colores visualizador:', colours);

  // ---- setup canvas ----
  const ctx       = canvas.getContext('2d');
  const dpr       = window.devicePixelRatio || 1;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const prev    = Array.from({ length: 3 }, () => new Float32Array(bufferLength).fill(0));

  // ---- visual parameters ----
  const LINE_COUNT = 3;
  const LINE_GAP   = 18;
  const LINE_WIDTH = 10;
  const AMP        = 1.4;
  const SMOOTH     = 0.10;

  function draw() {
    if (!isElementVisible(canvas)) { requestAnimationFrame(draw); return; }

    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    analyser.getByteTimeDomainData(dataArray);
    ctx.clearRect(0, 0, cssW, cssH);

    const slice = cssW / bufferLength;
    const midY  = cssH / 2;

    for (let l = 0; l < LINE_COUNT; l++) {
      const lineY = midY + (l - 1) * LINE_GAP;
      const step  = l === 1 ? 1 : 4;
      const ampNow = l === 1 ? AMP * 1.6 : AMP;

      const grad = ctx.createLinearGradient(0, 0, cssW, 0);
      const colorWithOpacity = (isSingleColor && (l === 0 || l === 2))
        ? colours[l] + '80'   // 50 % opacity
        : colours[l];

      grad.addColorStop(0, 'transparent');
      grad.addColorStop(l === 1 ? 0.10 : 0.25, colorWithOpacity);
      grad.addColorStop(0.9, colorWithOpacity);
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.lineWidth   = LINE_WIDTH;
      ctx.strokeStyle = grad;
      ctx.lineJoin    = 'round';

      let x = 0;
      for (let i = 0; i < bufferLength; i += step) {
        const v      = (dataArray[i] - 128) / 128;
        const target = v * ampNow * cssH;
        prev[l][i]  += (target - prev[l][i]) * SMOOTH;
        const y      = lineY - prev[l][i];

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += slice * step;
      }
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }

  draw();
  // console.log('🎨 Start Visualizer');
}

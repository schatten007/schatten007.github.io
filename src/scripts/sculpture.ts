export function mountSculpture() {
  const exhibit = document.querySelector<HTMLElement>('.signal-exhibit');
  const canvas = exhibit?.querySelector<HTMLCanvasElement>('canvas');
  const button = exhibit?.querySelector<HTMLButtonElement>('.motion-toggle');
  const context = canvas?.getContext('2d');
  if (!exhibit || !canvas || !context || !button) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let saved = '';
  try { saved = localStorage.getItem('fieldbook-motion') ?? ''; } catch { /* Storage is optional. */ }
  let paused = reduced.matches || saved === 'paused';
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let phase = 0;
  let width = 520;
  let height = 490;
  let pointerX = 0;
  let pointerY = 0;
  let easedX = 0;
  let easedY = 0;

  type Point = { x: number; y: number; z: number };
  const mesh: Point[][] = [];
  const torus = (u: number, v: number): Point => ({
    x: (131 + 58 * Math.cos(v)) * Math.cos(u),
    y: (131 + 58 * Math.cos(v)) * Math.sin(u),
    z: 58 * Math.sin(v),
  });
  for (let ring = 0; ring < 48; ring++) {
    mesh.push(Array.from({ length: 65 }, (_, i) => torus(ring / 48 * Math.PI * 2, i / 64 * Math.PI * 2)));
  }
  for (let loop = 0; loop < 24; loop++) {
    mesh.push(Array.from({ length: 129 }, (_, i) => torus(i / 128 * Math.PI * 2, loop / 24 * Math.PI * 2)));
  }

  function draw() {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width / 490, height / 440);
    const ax = .78 + easedY * .23 + Math.sin(phase * .48) * .12;
    const ay = -.28 + easedX * .25;
    const az = -.53 + phase * .12;
    const project = (point: Point) => {
      const y1 = point.y * Math.cos(ax) - point.z * Math.sin(ax);
      const z1 = point.y * Math.sin(ax) + point.z * Math.cos(ax);
      const x2 = point.x * Math.cos(ay) + z1 * Math.sin(ay);
      const z2 = -point.x * Math.sin(ay) + z1 * Math.cos(ay);
      const x3 = x2 * Math.cos(az) - y1 * Math.sin(az);
      const y3 = x2 * Math.sin(az) + y1 * Math.cos(az);
      const perspective = 850 / (850 - z2);
      return { x: width / 2 + x3 * scale * perspective, y: height / 2 + y3 * scale * perspective, z: z2 };
    };
    const projected = mesh.map(line => {
      const points = line.map(project);
      return { points, depth: points.reduce((sum, p) => sum + p.z, 0) / points.length };
    }).sort((a, b) => a.depth - b.depth);
    context.lineWidth = .7;
    for (const { points, depth } of projected) {
      const opacity = Math.min(.83, Math.max(.13, .4 + depth / 270));
      context.strokeStyle = `rgba(255, 90, 38, ${opacity})`;
      context.beginPath();
      points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
      context.stroke();
    }
  }

  function animate(time: number) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (time - lastTime >= 1000 / 30) {
      phase += Math.min((time - lastTime) / 1000, .05);
      lastTime = time;
      easedX += (pointerX - easedX) * .035;
      easedY += (pointerY - easedY) * .035;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    button?.setAttribute('aria-pressed', String(paused));
    button?.setAttribute('aria-label', paused ? 'Play sculpture animation' : 'Pause sculpture animation');
    const symbol = button?.querySelector('[data-motion-icon]');
    if (symbol) symbol.textContent = paused ? '▷' : 'Ⅱ';
    exhibit?.setAttribute('data-motion', paused ? 'paused' : 'running');
    if (!paused && visible && !document.hidden) {
      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }

  new ResizeObserver(() => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
    exhibit.classList.add('canvas-ready');
  }).observe(canvas);

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: .05 }).observe(exhibit);
  exhibit.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = exhibit.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
  });
  exhibit.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('fieldbook-motion', paused ? 'paused' : 'running'); } catch { /* Keep the local control working. */ }
    sync();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) paused = true; sync(); });
  document.addEventListener('visibilitychange', sync);
  sync();
}

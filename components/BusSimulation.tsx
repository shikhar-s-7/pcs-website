"use client";

import { useEffect, useRef } from "react";

const ASH = "#c2bdb4";
const SIGNAL = "#ff4d00";
const GRAPHITE = "#3a3833";

const NOMINAL_HZ = 50;
const DIP_HZ = 0.18;
const STEP_PERIOD = 8;

/** Right gutter on the waveform plot for the A / B / C labels. */
const LABEL_GUTTER = 22;

type Readouts = {
  freq: HTMLElement | null;
  voltage: HTMLElement | null;
  rocof: HTMLElement | null;
};

function dipAt(cycle: number) {
  const attack = 1 - Math.exp(-cycle / 0.07);
  const recover = Math.exp(-cycle / 0.62);
  return DIP_HZ * attack * recover;
}

function draw(
  canvas: HTMLCanvasElement,
  time: number,
  readouts: Readouts,
  reduced: boolean,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;
  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.lineJoin = "round";
  ctx.lineCap = "butt";

  const cycle = reduced ? 3 : time % STEP_PERIOD;
  const dip = reduced ? 0 : dipAt(cycle);
  const previousDip = reduced ? 0 : dipAt(Math.max(0, cycle - 1 / 60));
  const frequency = NOMINAL_HZ - dip;
  const rocof = (previousDip - dip) * 60;
  const voltage = 1 - dip * 0.45;

  if (readouts.freq) readouts.freq.textContent = frequency.toFixed(2);
  if (readouts.voltage) readouts.voltage.textContent = voltage.toFixed(3);
  if (readouts.rocof) {
    const sign = rocof >= 0 ? "+" : "−";
    readouts.rocof.textContent = `${sign}${Math.abs(rocof).toFixed(2)}`;
  }

  const visual = reduced ? 4.2 : time * 2.4 * (frequency / NOMINAL_HZ);

  // Layout: waveforms on top, phasor directly beneath, centred on the same plot width.
  const plotTop = 6;
  const plotHeight = height * 0.4;
  const plotRight = width - LABEL_GUTTER;
  const mid = plotTop + plotHeight / 2;
  const amp = plotHeight * 0.4;

  // Zero axis.
  ctx.strokeStyle = GRAPHITE;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(plotRight, mid);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // A solid Ash, B dimmer Ash, C dashed Signal at low opacity. Distinct without color.
  const phases = [
    { name: "A", color: ASH, alpha: 1, dash: [] as number[], shift: 0 },
    { name: "B", color: ASH, alpha: 0.6, dash: [] as number[], shift: (2 * Math.PI) / 3 },
    { name: "C", color: SIGNAL, alpha: 0.55, dash: [4, 3], shift: (4 * Math.PI) / 3 },
  ];

  const family = getComputedStyle(canvas).fontFamily;
  ctx.font = `10px ${family}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  for (const phase of phases) {
    const yAt = (x: number) => {
      const angle = visual - (x / plotRight) * Math.PI * 6 + phase.shift;
      return mid - Math.sin(angle) * amp * voltage;
    };
    ctx.strokeStyle = phase.color;
    ctx.globalAlpha = phase.alpha;
    ctx.setLineDash(phase.dash);
    ctx.beginPath();
    for (let x = 0; x <= plotRight; x += 2) {
      const y = yAt(x);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = phase.color;
    ctx.fillText(phase.name, plotRight + 8, yAt(plotRight));
    ctx.globalAlpha = 1;
  }

  // Phasor.
  const phasorTop = plotTop + plotHeight + 18;
  const phasorBottom = height - 6;
  const radius = Math.max(20, (phasorBottom - phasorTop) / 2 - 6);
  const cx = plotRight / 2;
  const cy = (phasorTop + phasorBottom) / 2;

  // Axes: Graphite.
  ctx.strokeStyle = GRAPHITE;
  ctx.beginPath();
  ctx.moveTo(cx - radius - 6, cy);
  ctx.lineTo(cx + radius + 6, cy);
  ctx.moveTo(cx, cy - radius - 6);
  ctx.lineTo(cx, cy + radius + 6);
  ctx.stroke();

  // Circle: Ash at 0.5, ticks every 30 degrees.
  ctx.strokeStyle = ASH;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  for (let deg = 0; deg < 360; deg += 30) {
    const a = (deg * Math.PI) / 180;
    const major = deg % 90 === 0;
    const inner = radius - (major ? 7 : 4);
    ctx.moveTo(cx + Math.cos(a) * inner, cy - Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * radius, cy - Math.sin(a) * radius);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  const reach = radius * voltage;
  const point = (angle: number): [number, number] => [
    cx + Math.cos(angle) * reach,
    cy - Math.sin(angle) * reach,
  ];

  // Faint trail arc behind the vector, fading out.
  const segments = 24;
  const segment = 0.045;
  ctx.strokeStyle = SIGNAL;
  for (let i = 0; i < segments; i += 1) {
    const [x1, y1] = point(visual - i * segment);
    const [x2, y2] = point(visual - (i + 1) * segment);
    ctx.globalAlpha = 0.35 * (1 - i / segments);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Vector and tip: Signal, full opacity.
  const [tipX, tipY] = point(visual);
  ctx.strokeStyle = SIGNAL;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.fillStyle = SIGNAL;
  ctx.beginPath();
  ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
  ctx.fill();
}

const tick = "pointer-events-none absolute h-2 w-2 border-ash";

export function BusSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const freqRef = useRef<HTMLSpanElement>(null);
  const voltageRef = useRef<HTMLSpanElement>(null);
  const rocofRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readouts: Readouts = {
      freq: freqRef.current,
      voltage: voltageRef.current,
      rocof: rocofRef.current,
    };
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      draw(canvas, now / 1000, readouts, reducedQuery.matches);
      if (!reducedQuery.matches) frameRef.current = requestAnimationFrame(frame);
    };

    const start = () => {
      running = true;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };

    const onMotion = () => {
      if (running) start();
    };
    reducedQuery.addEventListener("change", onMotion);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      reducedQuery.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <figure className="relative min-h-0 border border-graphite bg-[#16150f] p-4 md:p-5">
      <span className={`${tick} -top-px -left-px border-t border-l`} />
      <span className={`${tick} -top-px -right-px border-t border-r`} />
      <span className={`${tick} -bottom-px -left-px border-b border-l`} />
      <span className={`${tick} -right-px -bottom-px border-r border-b`} />
      <figcaption className="font-mono text-label text-muted">ILLUSTRATIVE SIMULATION</figcaption>
      <canvas ref={canvasRef} className="mt-3 h-60 w-full font-mono md:h-80" />
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-label">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">FREQ</dt>
          <dd>
            <span ref={freqRef}>50.00</span> Hz
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">V pu</dt>
          <dd ref={voltageRef}>1.000</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">ROCOF</dt>
          <dd>
            <span ref={rocofRef}>+0.00</span> Hz/s
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">MODE</dt>
          <dd>GRID-FORMING</dd>
        </div>
      </dl>
    </figure>
  );
}

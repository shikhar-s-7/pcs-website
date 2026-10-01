"use client";

import { useEffect, useRef } from "react";

const PAPER = "#e9e5db";
const ASH = "#c2bdb4";
const DIM = "#8a8478";
const SIGNAL = "#ff4d00";
const LINE = "#3a3833";

const NOMINAL_HZ = 50;
const DIP_HZ = 0.18;
const STEP_PERIOD = 8;

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

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
  const plotTop = 8;
  const plotHeight = height * 0.46;
  const mid = plotTop + plotHeight / 2;
  const amp = plotHeight * 0.38;

  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(width, mid);
  ctx.stroke();

  const phases = [
    { color: PAPER, shift: 0 },
    { color: ASH, shift: (2 * Math.PI) / 3 },
    { color: DIM, shift: (4 * Math.PI) / 3 },
  ];

  for (const phase of phases) {
    ctx.strokeStyle = phase.color;
    ctx.beginPath();
    for (let x = 0; x <= width; x += 2) {
      const angle = visual - (x / width) * Math.PI * 6 + phase.shift;
      const y = mid - Math.sin(angle) * amp * voltage;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const cx = width * 0.78;
  const cy = plotTop + plotHeight + (height - plotTop - plotHeight) * 0.58;
  const radius = Math.min(width, height) * 0.16;
  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.stroke();

  const tipX = cx + Math.cos(visual) * radius * voltage;
  const tipY = cy - Math.sin(visual) * radius * voltage;
  ctx.strokeStyle = SIGNAL;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.fillStyle = SIGNAL;
  ctx.fillRect(tipX - 1.5, tipY - 1.5, 3, 3);
}

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

    const tick = (now: number) => {
      if (!running) return;
      draw(canvas, now / 1000, readouts, reducedQuery.matches);
      if (!reducedQuery.matches) frameRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      running = true;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(tick);
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
    <figure className="relative min-h-0">
      <figcaption className="font-mono text-label text-muted">ILLUSTRATIVE SIMULATION</figcaption>
      <canvas ref={canvasRef} className="mt-3 h-52 w-full md:h-72" />
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

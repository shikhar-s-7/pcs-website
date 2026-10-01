"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { F0, T_STEP, simulateVsg, type VsgTrace } from "@/lib/vsg";

const ASH = "#c2bdb4";
const LINE = "#3a3833";
const SIGNAL = "#ff4d00";

const DEFAULTS = { H: 4, D: 0.1, loadStep: 0.2 };
/** Top of the load-step slider. The stress preset uses it. */
const STRESS_STEP = 0.35;
/** "Settled" means staying inside F0 ± this many Hz. */
const SETTLE_BAND = 0.02;

/** Seconds from the load step until f stays inside the band. null = not settled by end of run. */
function settleTime(trace: VsgTrace) {
  let lastOutside = -1;
  trace.points.forEach((point, index) => {
    if (point.t >= T_STEP && Math.abs(point.f - F0) > SETTLE_BAND) lastOutside = index;
  });
  if (lastOutside < 0) return 0;
  if (lastOutside >= trace.points.length - 1) return null;
  return trace.points[lastOutside + 1].t - T_STEP;
}

function drawPlot(canvas: HTMLCanvasElement, following: VsgTrace, forming: VsgTrace) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.font = "12px ui-monospace, monospace";
  const font = getComputedStyle(canvas).font;
  if (font) ctx.font = font;

  // Top band holds the axis title. Right pad keeps the last x label inside the canvas.
  const padL = 52;
  const padR = 30;
  const padT = 30;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const freqs = [...following.points, ...forming.points].map((point) => point.f);
  let yMin = Math.min(F0 - 0.15, ...freqs);
  let yMax = Math.max(F0 + 0.05, ...freqs);
  const padY = Math.max(0.02, (yMax - yMin) * 0.12);
  yMin -= padY;
  yMax += padY;

  const xOf = (t: number) => padL + (t / 20) * plotW;
  const yOf = (f: number) => padT + ((yMax - f) / (yMax - yMin)) * plotH;

  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 4; i += 1) {
    const f = yMin + ((yMax - yMin) * i) / 4;
    const y = yOf(f);
    ctx.strokeStyle = LINE;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
    ctx.fillStyle = ASH;
    ctx.fillText(f.toFixed(2), padL - 8, y);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = ASH;
  for (let t = 0; t <= 20; t += 5) {
    ctx.fillText(String(t), xOf(t), padT + plotH + 8);
  }

  const trace = (data: VsgTrace, color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    data.points.forEach((point, index) => {
      const x = xOf(point.t);
      const y = yOf(point.f);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };
  trace(following, ASH);
  trace(forming, SIGNAL);

  const low = forming.points.reduce((best, point) => (point.f < best.f ? point : best));
  ctx.fillStyle = SIGNAL;
  ctx.fillRect(xOf(low.t) - 2, yOf(low.f) - 2, 4, 4);

  // Direct labels. Following sits just above its flat line; forming sits right of its trough.
  ctx.textBaseline = "bottom";
  ctx.textAlign = "right";
  ctx.fillStyle = ASH;
  ctx.fillText("Grid-following", padL + plotW, yOf(F0) - 6);
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = SIGNAL;
  ctx.fillText("Grid-forming", Math.min(xOf(low.t) + 10, padL + plotW - 90), yOf(low.f) + 6);

  // Axis titles: Hz above the plot, s at the end of the x axis.
  ctx.fillStyle = ASH;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText("Hz", 8, 4);
  ctx.textAlign = "right";
  ctx.fillText("s", width - 2, padT + plotH + 8);
}

export function VsgDemo() {
  const [H, setH] = useState(DEFAULTS.H);
  const [D, setD] = useState(DEFAULTS.D);
  const [loadStep, setLoadStep] = useState(DEFAULTS.loadStep);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Same parameters, both inverter modes. The integrator is unchanged.
  const following = useMemo(() => simulateVsg({ H, D, loadStep, mode: "gfl" }), [H, D, loadStep]);
  const forming = useMemo(() => simulateVsg({ H, D, loadStep, mode: "gfm" }), [H, D, loadStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => drawPlot(canvas, following, forming);
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [following, forming]);

  const reset = () => {
    setH(DEFAULTS.H);
    setD(DEFAULTS.D);
    setLoadStep(DEFAULTS.loadStep);
  };

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
      <div className="grid touch-pan-y content-start gap-6 md:col-span-4">
        <p className="font-mono text-label text-muted">ILLUSTRATIVE SIMULATION</p>
        <HardwareSlider
          label="Inertia: how hard it resists change"
          sub="H"
          unit="s"
          min={0.5}
          max={8}
          step={0.1}
          value={H}
          onChange={setH}
        />
        <HardwareSlider
          label="Damping: how fast it settles"
          sub="D"
          unit="pu·s/rad"
          min={0.01}
          max={0.4}
          step={0.01}
          value={D}
          onChange={setD}
        />
        <HardwareSlider
          label="Load step: size of the sudden demand jump"
          sub="ΔP"
          unit="pu"
          min={0.05}
          max={STRESS_STEP}
          step={0.01}
          value={loadStep}
          onChange={setLoadStep}
        />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-line" onClick={reset}>
            Reset
          </button>
          <button type="button" className="btn btn-line" onClick={() => setLoadStep(STRESS_STEP)}>
            Stress test
          </button>
        </div>
      </div>

      <div className="md:col-span-8">
        <canvas ref={canvasRef} className="font-mono aspect-[16/10] h-auto w-full touch-pan-y text-label" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Readout
            name="Grid-following"
            swatch={ASH}
            nadir={following.nadir}
            settle={settleTime(following)}
          />
          <Readout
            name="Grid-forming"
            swatch={SIGNAL}
            nadir={forming.nadir}
            settle={settleTime(forming)}
          />
        </div>
      </div>

      <div className="md:col-span-12">
        <MathDisclosure />
      </div>
    </div>
  );
}

function Readout({
  name,
  swatch,
  nadir,
  settle,
}: {
  name: string;
  swatch: string;
  nadir: number;
  settle: number | null;
}) {
  return (
    <div className="hairline-t pt-4">
      <p className="flex items-center gap-2 font-mono text-label uppercase">
        <span aria-hidden="true" className="inline-block h-px w-6" style={{ background: swatch, height: 2 }} />
        {name}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-4 font-mono">
        <div>
          <dt className="text-label text-muted uppercase">Lowest frequency</dt>
          <dd className="mt-1 text-[1.5rem] leading-none">{nadir.toFixed(3)} Hz</dd>
        </div>
        <div>
          <dt className="text-label text-muted uppercase">Time to settle</dt>
          <dd className="mt-1 text-[1.5rem] leading-none">
            {settle === null ? "> 18 s" : `${settle.toFixed(1)} s`}
          </dd>
        </div>
      </dl>
      <p className="mt-2 font-mono text-label text-muted">
        Settled = within ±{SETTLE_BAND} Hz of {F0} Hz
      </p>
    </div>
  );
}

function MathDisclosure() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="hairline-t hairline-b">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-mono text-label uppercase"
      >
        <span>SHOW THE MATH (FOR ENGINEERS)</span>
        <span aria-hidden="true" className="text-signal-text">
          {open ? "−" : "+"}
        </span>
      </button>
      <div id={panelId} hidden={!open} className="pb-8">
        <p className="font-mono text-[1.25rem]">J dω/dt = Pm − Pe − D(ω − ω0)</p>
        <dl className="mt-6 grid max-w-[70ch] gap-3 text-small">
          {[
            ["J", "Inertia coefficient. J = 2H / ω0, so H in seconds sets how much speed energy is stored."],
            ["ω", "Rotor speed the inverter emulates. Frequency f = ω / 2π."],
            ["ω0", "Nominal speed, the value that corresponds to 50 Hz."],
            ["Pm", "Power going in. Held constant."],
            ["Pe", "Power going out to the grid. The load step raises it."],
            ["D", "Damping. Power pushed back against any speed error."],
          ].map(([symbol, meaning]) => (
            <div key={symbol} className="grid grid-cols-[3rem_1fr] gap-3">
              <dt className="font-mono">{symbol}</dt>
              <dd className="text-muted">{meaning}</dd>
            </div>
          ))}
        </dl>
        <dl className="mt-6 grid max-w-[70ch] gap-3 text-small">
          <div className="grid grid-cols-[3rem_1fr] gap-3">
            <dt className="font-mono">ROCOF</dt>
            <dd className="text-muted">Rate of change of frequency, df/dt in Hz/s.</dd>
          </div>
          <div className="grid grid-cols-[3rem_1fr] gap-3">
            <dt className="font-mono">Nadir</dt>
            <dd className="text-muted">Lowest frequency reached after the load step.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function HardwareSlider({
  label,
  sub,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="grid gap-1">
        <span className="text-small">{label}</span>
        <span className="flex justify-between font-mono text-label text-muted">
          <span>{sub}</span>
          <span className="text-fg">
            {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
          </span>
        </span>
      </span>
      <input
        className="hw-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

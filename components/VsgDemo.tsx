"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { F0, simulateVsg, type VsgMode, type VsgTrace } from "@/lib/vsg";

const PAPER = "#e9e5db";
const ASH = "#c2bdb4";
const LINE = "#3a3833";
const SIGNAL = "#ff4d00";
const INK = "#100f0c";

function drawPlot(canvas: HTMLCanvasElement, trace: VsgTrace) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

  const padL = 52;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const freqs = trace.points.map((point) => point.f);
  let yMin = Math.min(F0 - 0.15, ...freqs);
  let yMax = Math.max(F0 + 0.05, ...freqs);
  const padY = Math.max(0.02, (yMax - yMin) * 0.12);
  yMin -= padY;
  yMax += padY;

  const xOf = (t: number) => padL + (t / 20) * plotW;
  const yOf = (f: number) => padT + ((yMax - f) / (yMax - yMin)) * plotH;

  ctx.strokeStyle = LINE;
  ctx.fillStyle = ASH;
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
  for (let t = 0; t <= 20; t += 5) {
    const x = xOf(t);
    ctx.fillStyle = ASH;
    ctx.fillText(String(t), x, padT + plotH + 8);
  }

  ctx.strokeStyle = PAPER;
  ctx.beginPath();
  trace.points.forEach((point, index) => {
    const x = xOf(point.t);
    const y = yOf(point.f);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  const nadirPoint = trace.points.reduce((best, point) => (point.f < best.f ? point : best));
  const nx = xOf(nadirPoint.t);
  const ny = yOf(nadirPoint.f);
  ctx.fillStyle = SIGNAL;
  ctx.fillRect(nx - 2, ny - 2, 4, 4);

  ctx.fillStyle = ASH;
  ctx.textAlign = "left";
  ctx.fillText("Hz", 8, padT);
  ctx.textAlign = "right";
  ctx.fillText("s", padL + plotW, padT + plotH + 8);
  ctx.fillStyle = INK;
}

export function VsgDemo() {
  const [H, setH] = useState(4);
  const [D, setD] = useState(0.1);
  const [loadStep, setLoadStep] = useState(0.2);
  const [mode, setMode] = useState<VsgMode>("gfm");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const trace = useMemo(
    () => simulateVsg({ H, D, loadStep, mode }),
    [H, D, loadStep, mode],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => drawPlot(canvas, trace);
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [trace]);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
      <div className="grid gap-6 md:col-span-4">
        <p className="font-mono text-label text-muted">ILLUSTRATIVE SIMULATION</p>
        <p className="font-mono text-small text-muted">
          J dω/dt = Pm − Pe − D(ω − ω0)
        </p>
        <HardwareSlider
          label="Inertia H"
          unit="s"
          min={0.5}
          max={8}
          step={0.1}
          value={H}
          onChange={setH}
        />
        <HardwareSlider
          label="Damping D"
          unit="pu·s/rad"
          min={0.01}
          max={0.4}
          step={0.01}
          value={D}
          onChange={setD}
        />
        <HardwareSlider
          label="Load step"
          unit="pu"
          min={0.05}
          max={0.35}
          step={0.01}
          value={loadStep}
          onChange={setLoadStep}
        />
        <div>
          <p className="font-mono text-label text-muted">Mode</p>
          <div className="mt-2 grid grid-cols-2">
            <ModeButton
              pressed={mode === "gfl"}
              onClick={() => setMode("gfl")}
            >
              Grid-following
            </ModeButton>
            <ModeButton
              pressed={mode === "gfm"}
              onClick={() => setMode("gfm")}
            >
              Grid-forming
            </ModeButton>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 font-mono text-label">
          <div>
            <dt className="text-muted">ROCOF</dt>
            <dd className="mt-1 text-data text-[1.5rem]">{trace.rocof.toFixed(2)} Hz/s</dd>
          </div>
          <div>
            <dt className="text-muted">Nadir</dt>
            <dd className="mt-1 text-data text-[1.5rem]">{trace.nadir.toFixed(3)} Hz</dd>
          </div>
        </dl>
      </div>
      <div className="md:col-span-8">
        <canvas ref={canvasRef} className="font-mono h-80 w-full text-label" />
      </div>
    </div>
  );
}

function HardwareSlider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex justify-between font-mono text-label text-muted">
        <span>{label}</span>
        <span className="text-fg">
          {value.toFixed(step < 0.1 ? 2 : 1)} {unit}
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

function ModeButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`font-mono text-label uppercase ${pressed ? "btn btn-signal" : "btn btn-line"}`}
    >
      {children}
    </button>
  );
}

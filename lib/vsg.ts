/**
 * Illustrative VSG. Not a product measurement. No values from /content.
 *
 * Swing equation, power in per-unit, speed in electrical rad/s:
 *
 *   J dω/dt = Pm − Pe − D (ω − ω0)
 *
 * Inertia constant H (seconds) is the stored kinetic energy at rated speed,
 * divided by rated power. That fixes J:
 *
 *   J = 2H / ω0
 *
 * so the same law is the standard form (2H/ω0) dω/dt = ΔP.
 *
 * Angle advances with the speed error:
 *
 *   dδ/dt = ω − ω0
 *
 * Electrical power on a stiff bus:
 *
 *   Pe = Pmax sin(δ) + ΔP(t)
 *
 * ΔP is the load step. After it, δ moves until Pe = Pm again and ω returns
 * to ω0. The trough of f(t) is the nadir. ROCOF is df/dt.
 *
 * Grid-following does not swing. ω is locked to ω0, so ROCOF is 0 and the
 * nadir is f0.
 */

export const F0 = 50;
export const OMEGA0 = 2 * Math.PI * F0;
const PMAX = 1.2;
const PM = 0.5;
const T_END = 20;
const T_STEP = 2;
const DT = 0.001;
const SAMPLE = 0.02;

export type VsgMode = "gfm" | "gfl";

export type VsgParams = {
  /** Inertia constant H, seconds. */
  H: number;
  /** Damping, pu power per rad/s of speed error. */
  D: number;
  /** Added electrical load at t = 2 s, pu. */
  loadStep: number;
  mode: VsgMode;
};

export type VsgPoint = {
  t: number;
  /** Hz */
  f: number;
  /** Hz/s */
  rocof: number;
};

export type VsgTrace = {
  points: VsgPoint[];
  /** Most negative df/dt, Hz/s. */
  rocof: number;
  /** Lowest frequency, Hz. */
  nadir: number;
};

type State = {
  delta: number;
  omega: number;
};

/** J = 2H / ω0. */
export function inertiaCoefficient(H: number) {
  return (2 * Math.max(H, 0.05)) / OMEGA0;
}

function derivatives(state: State, params: VsgParams, peStep: number): State {
  const J = inertiaCoefficient(params.H);
  const pe = PMAX * Math.sin(state.delta) + peStep;
  const dDelta = state.omega - OMEGA0;
  const dOmega = (PM - pe - params.D * (state.omega - OMEGA0)) / J;
  return { delta: dDelta, omega: dOmega };
}

/** Explicit midpoint (RK2). One step of the swing equation. */
function rk2(state: State, dt: number, deriv: (s: State) => State): State {
  const k1 = deriv(state);
  const mid: State = {
    delta: state.delta + k1.delta * dt,
    omega: state.omega + k1.omega * dt,
  };
  const k2 = deriv(mid);
  return {
    delta: state.delta + 0.5 * (k1.delta + k2.delta) * dt,
    omega: state.omega + 0.5 * (k1.omega + k2.omega) * dt,
  };
}

function equilibriumDelta() {
  return Math.asin(PM / PMAX);
}

export function simulateVsg(params: VsgParams): VsgTrace {
  const points: VsgPoint[] = [];
  let nadir = F0;
  let rocof = 0;

  if (params.mode === "gfl") {
    for (let t = 0; t <= T_END + 1e-9; t += SAMPLE) {
      points.push({ t, f: F0, rocof: 0 });
    }
    return { points, rocof: 0, nadir: F0 };
  }

  let state: State = { delta: equilibriumDelta(), omega: OMEGA0 };
  let previousF = F0;

  for (let step = 0, t = 0; t <= T_END + 1e-9; step += 1, t = step * DT) {
    const peStep = t >= T_STEP ? params.loadStep : 0;
    const deriv = (s: State) => derivatives(s, params, peStep);
    const next = rk2(state, DT, deriv);
    const f = next.omega / (2 * Math.PI);
    const df = (f - previousF) / DT;

    if (t >= T_STEP && f < nadir) nadir = f;
    if (t >= T_STEP && df < rocof) rocof = df;

    if (step % Math.round(SAMPLE / DT) === 0) {
      points.push({ t, f, rocof: df });
    }

    previousF = f;
    state = next;

    if (!Number.isFinite(f) || Math.abs(f - F0) > 5) {
      break;
    }
  }

  return { points, rocof, nadir };
}

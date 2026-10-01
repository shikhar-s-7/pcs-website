"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const DARK = "#1b1a17";
const EDGE = "#ff4d00";

type Vec3 = [number, number, number];

const PARTS: { label: string; home: Vec3; explode: Vec3 }[] = [
  { label: "DC input", home: [0, 0.72, 0], explode: [-0.15, 1.3, 0.35] },
  { label: "Converter stage", home: [0, 0.28, 0], explode: [0.2, 0.72, 0.15] },
  { label: "LCL filter", home: [0, -0.12, 0.02], explode: [-0.1, -0.05, 0.45] },
  { label: "Control board", home: [0, -0.42, 0.08], explode: [0.35, -0.72, 0.2] },
  { label: "AC output", home: [0, -0.72, 0], explode: [0, -1.3, 0.3] },
];

function Box({
  size,
  position = [0, 0, 0],
  color = DARK,
}: {
  size: Vec3;
  position?: Vec3;
  color?: string;
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size]);
  useEffect(() => () => edges.dispose(), [edges]);
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={EDGE} />
      </lineSegments>
    </group>
  );
}

function Can({
  radius,
  height,
  position = [0, 0, 0],
}: {
  radius: number;
  height: number;
  position?: Vec3;
}) {
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.CylinderGeometry(radius, radius, height, 10)),
    [radius, height],
  );
  useEffect(() => () => edges.dispose(), [edges]);
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 10]} />
        <meshStandardMaterial color={DARK} roughness={1} metalness={0} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={EDGE} />
      </lineSegments>
    </group>
  );
}

function DcInput() {
  return (
    <group>
      <Box size={[0.78, 0.14, 0.36]} />
      <Can radius={0.045} height={0.16} position={[-0.18, 0.14, 0]} />
      <Can radius={0.045} height={0.16} position={[0.18, 0.14, 0]} />
    </group>
  );
}

function Converter() {
  return (
    <group>
      {[-0.26, 0, 0.26].map((x) => (
        <Box key={x} size={[0.2, 0.46, 0.3]} position={[x, 0, 0]} />
      ))}
    </group>
  );
}

function Lcl() {
  return (
    <group>
      {[-0.22, 0, 0.22].map((x) => (
        <Can key={x} radius={0.07} height={0.24} position={[x, 0.06, 0]} />
      ))}
      <Box size={[0.62, 0.08, 0.18]} position={[0, -0.12, 0.08]} />
    </group>
  );
}

function ControlBoard() {
  return (
    <group>
      <Box size={[0.8, 0.025, 0.42]} />
      <Box size={[0.12, 0.04, 0.08]} position={[0.28, 0.03, 0.1]} color="#1c1b18" />
    </group>
  );
}

function AcOutput() {
  return (
    <group>
      <Box size={[0.78, 0.16, 0.32]} />
      {[-0.18, 0, 0.18].map((x) => (
        <Box key={x} size={[0.03, 0.02, 0.42]} position={[x, 0.09, 0.12]} />
      ))}
    </group>
  );
}

const BODIES = [DcInput, Converter, Lcl, ControlBoard, AcOutput];

function Assembly({
  progress,
  groups,
}: {
  progress: React.RefObject<number>;
  groups: React.RefObject<(THREE.Group | null)[]>;
}) {
  const spin = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.18;
    const t = progress.current ?? 0;
    groups.current?.forEach((group, index) => {
      if (!group) return;
      const home = PARTS[index].home;
      const away = PARTS[index].explode;
      group.position.set(
        THREE.MathUtils.lerp(home[0], away[0], t),
        THREE.MathUtils.lerp(home[1], away[1], t),
        THREE.MathUtils.lerp(home[2], away[2], t),
      );
    });
  });

  return (
    <group ref={spin} rotation={[0, -0.5, 0]}>
      {BODIES.map((Body, index) => (
        <group
          key={PARTS[index].label}
          ref={(node) => {
            if (!groups.current) return;
            groups.current[index] = node;
          }}
          position={PARTS[index].home}
        >
          <Body />
        </group>
      ))}
    </group>
  );
}

function CalloutSync({
  progress,
  groups,
  lines,
  labels,
  wrap,
}: {
  progress: React.RefObject<number>;
  groups: React.RefObject<(THREE.Group | null)[]>;
  lines: React.RefObject<(SVGLineElement | null)[]>;
  labels: React.RefObject<(HTMLDivElement | null)[]>;
  wrap: React.RefObject<HTMLDivElement | null>;
}) {
  const { camera } = useThree();
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const box = wrap.current;
    if (!box) return;
    const width = box.clientWidth;
    // Narrow screens list the parts below the model instead of drawing leader lines.
    if (width < 768) return;
    const height = box.clientHeight;
    const show = (progress.current ?? 0) > 0.12 ? "1" : "0";
    groups.current?.forEach((group, index) => {
      const line = lines.current?.[index];
      const label = labels.current?.[index];
      if (!group || !line || !label) return;
      group.getWorldPosition(point);
      point.project(camera);
      const x = (point.x * 0.5 + 0.5) * width;
      const y = (-point.y * 0.5 + 0.5) * height;
      const labelX = width * 0.78;
      const labelY = height * (0.18 + index * 0.14);
      line.setAttribute("x1", x.toFixed(1));
      line.setAttribute("y1", y.toFixed(1));
      line.setAttribute("x2", String(labelX));
      line.setAttribute("y2", String(labelY));
      line.style.opacity = show;
      label.style.transform = `translate(${labelX + 8}px, ${labelY - 6}px)`;
      label.style.opacity = show;
    });
  });

  return null;
}

export default function PcsScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [antialias] = useState(() => (navigator.hardwareConcurrency ?? 8) > 4);
  const progress = useRef(0);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const lines = useRef<(SVGLineElement | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  // Stop rendering while the model is off screen.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "100px 0px" },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // clamp(): assembled at page load even when the box starts on screen.
      const trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "clamp(top 75%)",
        end: "clamp(bottom 35%)",
        scrub: 0.6,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      return () => trigger.kill();
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
        <p className="pointer-events-none absolute top-4 left-5 z-10 font-mono text-label text-muted md:left-8">
          CONCEPT RENDER
        </p>
        {/* Stage: the model. On narrow screens the part list sits below it. */}
        <div ref={stageRef} className="absolute inset-x-0 top-0 bottom-36 md:bottom-0">
        <Canvas
          frameloop={visible ? "always" : "never"}
          style={{ touchAction: "pan-y" }}
          camera={{ position: [2.6, 1.6, 3.5], fov: 34 }}
          dpr={[1, 1.5]}
          gl={{ antialias, alpha: true, powerPreference: "low-power" }}
          onCreated={({ camera, gl }) => {
            camera.lookAt(0, 0, 0);
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 3]} intensity={0.85} />
          <Assembly progress={progress} groups={groups} />
          <CalloutSync
            progress={progress}
            groups={groups}
            lines={lines}
            labels={labels}
            wrap={stageRef}
          />
        </Canvas>
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          aria-hidden="true"
        >
          {PARTS.map((part, index) => (
            <line
              key={part.label}
              ref={(node) => {
                lines.current[index] = node;
              }}
              stroke="#c2bdb4"
              strokeWidth="1"
            />
          ))}
        </svg>
        {PARTS.map((part, index) => (
          <div
            key={part.label}
            ref={(node) => {
              labels.current[index] = node;
            }}
            className="pointer-events-none absolute top-0 left-0 hidden font-mono text-label whitespace-nowrap text-paper opacity-0 md:block"
          >
            {part.label}
          </div>
        ))}
        </div>
        <ol className="gutter absolute inset-x-0 bottom-0 grid h-36 grid-cols-2 content-center gap-x-4 gap-y-2 font-mono text-label text-paper uppercase md:hidden">
          {PARTS.map((part, index) => (
            <li key={part.label} className="hairline-t flex gap-2 pt-2">
              <span className="text-muted">{String(index + 1).padStart(2, "0")}</span>
              {part.label}
            </li>
          ))}
        </ol>
    </div>
  );
}

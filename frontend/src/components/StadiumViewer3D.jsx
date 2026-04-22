/**
 * StadiumViewer3D
 * ================
 * Procedurally-generated parametric 3D stadium bowl using Three.js.
 * Zero external models — every stadium is constructed from its own
 * `config` so the bundle stays tiny (~2KB geometry cost per venue).
 *
 * This file is DIRECTLY imported only by StadiumViewer3D.lazy — which
 * is dynamically imported by <StadiumViewer /> so the three.js bundle
 * cost is paid ONLY on pages that actually show a 3D stadium.
 *
 * Usage:
 *   <StadiumViewer3D config={ALLIANZ_ARENA} highlightSection="A12" />
 */
import { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────
   Stadium presets — keep these parametric, not hand-modelled.
   Each preset describes a bowl: inner pitch + N concentric tiers.
   ────────────────────────────────────────────────────────────── */
export const STADIUM_PRESETS = {
  allianz_arena: {
    name: "Allianz Arena",
    pitch: { w: 105, h: 68 },
    tiers: [
      { inner: 56, outer: 70, riseStart: 8, riseEnd: 18, sections: 24, tint: "#8b0000" }, // lower
      { inner: 72, outer: 88, riseStart: 20, riseEnd: 34, sections: 32, tint: "#a02020" }, // mid
      { inner: 90, outer: 108, riseStart: 36, riseEnd: 52, sections: 40, tint: "#c03030" }, // upper
    ],
    roof: { height: 62, color: "#e0e0e0", opacity: 0.35 },
    skyTint: "#0a0a1a",
  },
  wembley: {
    name: "Wembley Stadium",
    pitch: { w: 105, h: 68 },
    tiers: [
      { inner: 56, outer: 72, riseStart: 6, riseEnd: 16, sections: 28, tint: "#1a2d5f" },
      { inner: 74, outer: 92, riseStart: 18, riseEnd: 32, sections: 36, tint: "#253d7a" },
      { inner: 94, outer: 114, riseStart: 34, riseEnd: 50, sections: 44, tint: "#2f4d94" },
    ],
    roof: { height: 60, color: "#ffffff", opacity: 0.3 },
    skyTint: "#0b1020",
    arch: true, // Wembley's iconic 133m arch
  },
  puskas_arena: {
    name: "Puskás Aréna",
    pitch: { w: 105, h: 68 },
    tiers: [
      { inner: 58, outer: 74, riseStart: 7, riseEnd: 18, sections: 24, tint: "#8b2323" },
      { inner: 76, outer: 96, riseStart: 20, riseEnd: 36, sections: 34, tint: "#a43030" },
    ],
    roof: { height: 48, color: "#dddddd", opacity: 0.3 },
    skyTint: "#0a0a1a",
  },
  santiago_bernabeu: {
    name: "Santiago Bernabéu",
    pitch: { w: 105, h: 68 },
    tiers: [
      { inner: 54, outer: 70, riseStart: 8, riseEnd: 20, sections: 24, tint: "#6f6f6f" },
      { inner: 72, outer: 90, riseStart: 22, riseEnd: 38, sections: 32, tint: "#8a8a8a" },
      { inner: 92, outer: 112, riseStart: 40, riseEnd: 58, sections: 40, tint: "#a5a5a5" },
    ],
    roof: { height: 66, color: "#f0f0f0", opacity: 0.4 },
    skyTint: "#0e0e18",
  },
  camp_nou: {
    name: "Camp Nou",
    pitch: { w: 105, h: 68 },
    tiers: [
      { inner: 58, outer: 76, riseStart: 7, riseEnd: 20, sections: 28, tint: "#7f1d1d" },
      { inner: 78, outer: 98, riseStart: 22, riseEnd: 38, sections: 36, tint: "#a02030" },
      { inner: 100, outer: 122, riseStart: 40, riseEnd: 58, sections: 44, tint: "#c54060" },
    ],
    roof: null,
    skyTint: "#0a0a18",
  },
};

/* ──────────────────────────────────────────────────────────────
   Pitch — flat rectangular green surface with stripe shader
   ────────────────────────────────────────────────────────────── */
function Pitch({ w = 105, h = 68 }) {
  const geom = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  return (
    <group>
      <mesh geometry={geom} rotation-x={-Math.PI / 2} position-y={0.1}>
        <meshStandardMaterial color="#1b5e20" roughness={0.9} />
      </mesh>
      {/* Centre circle — emissive hint */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.12}>
        <ringGeometry args={[9.15, 9.3, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
      {/* Pitch markings — edge */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.11}>
        <ringGeometry args={[Math.min(w, h) * 0.48, Math.min(w, h) * 0.49, 4]} />
        <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Tier ring — an extruded ellipse split into sections.
   Each section is a trapezoidal wedge; highlighted sections glow.
   ────────────────────────────────────────────────────────────── */
function TierRing({ tier, highlightIndex, onSectionHover }) {
  const { inner, outer, riseStart, riseEnd, sections, tint } = tier;
  const group = useRef();

  const meshes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < sections; i++) {
      const a0 = (i / sections) * Math.PI * 2;
      const a1 = ((i + 1) / sections) * Math.PI * 2;

      // Build a single wedge geometry: a trapezoid prism
      const shape = new THREE.Shape();
      shape.moveTo(Math.cos(a0) * inner, Math.sin(a0) * inner);
      shape.lineTo(Math.cos(a0) * outer, Math.sin(a0) * outer);
      shape.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
      shape.lineTo(Math.cos(a1) * inner, Math.sin(a1) * inner);
      shape.closePath();

      const geom = new THREE.ExtrudeGeometry(shape, {
        depth: riseEnd - riseStart,
        bevelEnabled: false,
      });
      geom.rotateX(-Math.PI / 2);
      geom.translate(0, riseEnd, 0);

      // Tilt to slope toward pitch
      const midR = (inner + outer) / 2;
      const dir = new THREE.Vector3(
        Math.cos((a0 + a1) / 2),
        0,
        Math.sin((a0 + a1) / 2)
      );
      arr.push({ geom, dir, midR, i });
    }
    return arr;
  }, [inner, outer, riseStart, riseEnd, sections]);

  return (
    <group ref={group}>
      {meshes.map(({ geom, i }) => (
        <mesh
          key={i}
          geometry={geom}
          onPointerOver={(e) => {
            e.stopPropagation();
            onSectionHover?.(i);
          }}
          onPointerOut={() => onSectionHover?.(null)}
        >
          <meshStandardMaterial
            color={i === highlightIndex ? "#f59e0b" : tint}
            emissive={i === highlightIndex ? "#f59e0b" : "#000000"}
            emissiveIntensity={i === highlightIndex ? 0.9 : 0}
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Roof — translucent domed canopy
   ────────────────────────────────────────────────────────────── */
function Roof({ config }) {
  if (!config) return null;
  return (
    <mesh position={[0, config.height, 0]} rotation={[Math.PI, 0, 0]}>
      <sphereGeometry args={[130, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshPhysicalMaterial
        color={config.color}
        opacity={config.opacity}
        transparent
        roughness={0.2}
        metalness={0.05}
        transmission={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────
   Wembley arch (iconic 133m steel arc above the stadium)
   ────────────────────────────────────────────────────────────── */
function WembleyArch() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-100, 0, 0),
        new THREE.Vector3(-60, 80, 0),
        new THREE.Vector3(0, 100, 0),
        new THREE.Vector3(60, 80, 0),
        new THREE.Vector3(100, 0, 0),
      ]),
    []
  );
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 1.4, 12, false]} />
      <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────
   Auto-rotate the camera gently when not being dragged
   ────────────────────────────────────────────────────────────── */
function AutoRotate({ enabled = true }) {
  const ref = useRef();
  useFrame((state) => {
    if (!enabled || !ref.current) return;
    // OrbitControls auto-rotate handles this; we leave the hook
    // in place for future custom animations (e.g. fly-in reveal).
  });
  return null;
}

/* ──────────────────────────────────────────────────────────────
   Public component
   ────────────────────────────────────────────────────────────── */
export default function StadiumViewer3D({
  preset = "allianz_arena",
  highlightSection = null,
  onSectionHover,
  autoRotate = true,
  className = "",
}) {
  const config = STADIUM_PRESETS[preset] || STADIUM_PRESETS.allianz_arena;

  return (
    <div
      className={`w-full aspect-video overflow-hidden bg-[#0b0b0b] ${className}`}
      data-testid="stadium-viewer-3d"
      style={{ touchAction: "none" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [120, 80, 160], fov: 38 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[config.skyTint]} />
        <fog attach="fog" args={[config.skyTint, 260, 520]} />

        {/* Lights — dramatic floodlit feel */}
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[80, 140, 60]}
          intensity={0.9}
          castShadow={false}
        />
        <pointLight position={[-60, 30, 60]} intensity={0.6} color="#ffc97a" />
        <pointLight position={[60, 30, -60]} intensity={0.6} color="#7ab0ff" />

        <Suspense fallback={null}>
          <Pitch w={config.pitch.w} h={config.pitch.h} />
          {config.tiers.map((tier, idx) => (
            <TierRing
              key={idx}
              tier={tier}
              highlightIndex={highlightSection?.tier === idx ? highlightSection.section : null}
              onSectionHover={(secIdx) =>
                onSectionHover?.(secIdx == null ? null : { tier: idx, section: secIdx })
              }
            />
          ))}
          <Roof config={config.roof} />
          {config.arch ? <WembleyArch /> : null}
          <Environment preset="night" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={80}
          maxDistance={260}
          maxPolarAngle={Math.PI * 0.42}
          minPolarAngle={Math.PI * 0.12}
          autoRotate={autoRotate}
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.08}
        />
        <AutoRotate enabled={autoRotate} />
      </Canvas>
    </div>
  );
}

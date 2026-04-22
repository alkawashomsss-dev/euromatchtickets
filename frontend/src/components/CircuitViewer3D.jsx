/**
 * CircuitViewer3D
 * ================
 * Procedurally-generated F1 / MotoGP circuit renderer.
 * Each circuit is a list of 2D points (x,z) normalized to a 200x200 plot.
 * We extrude a ribbon along the curve to create the asphalt, then draw
 * kerbs along both sides and a subtle environment.
 *
 * Lazy-loaded — same as StadiumViewer3D.
 */
import { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────
   Circuit presets — each is 24 control points sampled from the
   real track plan and normalised to the [-100, 100] range.
   These are hand-curated to resemble the real layouts while
   keeping the point count low for fast rendering.
   ────────────────────────────────────────────────────────────── */
export const CIRCUIT_PRESETS = {
  monaco: {
    name: "Circuit de Monaco",
    length_km: 3.337,
    track_color: "#1a1a1a",
    kerb_colors: ["#e10600", "#ffffff"],
    sky: "#1a2a4a",
    points: [
      [0, 70], [20, 60], [40, 55], [55, 45], [60, 28], [55, 10],
      [40, -5], [20, -15], [0, -25], [-20, -35], [-40, -40],
      [-55, -30], [-60, -12], [-55, 4], [-45, 20], [-50, 38],
      [-60, 52], [-55, 68], [-35, 75], [-15, 78], [5, 78], [15, 75],
    ],
  },
  silverstone: {
    name: "Silverstone Circuit",
    length_km: 5.891,
    track_color: "#1a1a1a",
    kerb_colors: ["#e10600", "#ffffff"],
    sky: "#0e1a2c",
    points: [
      [0, 80], [30, 78], [55, 70], [75, 50], [80, 25], [65, 0],
      [40, -15], [10, -25], [-20, -30], [-50, -25], [-75, -10],
      [-85, 15], [-80, 40], [-60, 55], [-35, 62], [-10, 70],
      [-15, 85], [-30, 88], [-5, 92], [10, 88], [5, 82], [-2, 80],
    ],
  },
  monza: {
    name: "Autodromo Nazionale di Monza",
    length_km: 5.793,
    track_color: "#1a1a1a",
    kerb_colors: ["#008c45", "#ffffff"],
    sky: "#0e1020",
    points: [
      [-80, 0], [-60, 20], [-30, 30], [0, 28], [30, 22], [55, 10],
      [75, -10], [80, -35], [65, -55], [35, -62], [0, -60], [-35, -55],
      [-65, -40], [-82, -18], [-88, 5], [-82, 28], [-90, 45], [-82, 62],
      [-60, 70], [-30, 66], [0, 58], [-40, 40],
    ],
  },
  spa: {
    name: "Spa-Francorchamps",
    length_km: 7.004,
    track_color: "#1a1a1a",
    kerb_colors: ["#e10600", "#ffffff"],
    sky: "#0a1426",
    points: [
      [0, 70], [25, 65], [50, 50], [70, 25], [75, -5], [60, -30],
      [35, -45], [5, -50], [-25, -45], [-55, -30], [-78, -5],
      [-85, 25], [-75, 55], [-50, 75], [-20, 82], [10, 80], [-5, 75],
      [-20, 85], [-40, 90], [-20, 95], [0, 90], [10, 80],
    ],
  },
  zandvoort: {
    name: "Circuit Zandvoort",
    length_km: 4.259,
    track_color: "#1a1a1a",
    kerb_colors: ["#ff6b00", "#ffffff"],
    sky: "#0c1a2e",
    points: [
      [0, 75], [22, 70], [45, 55], [60, 30], [60, 5], [50, -20],
      [30, -35], [5, -40], [-22, -35], [-45, -20], [-58, 5],
      [-60, 30], [-50, 50], [-60, 68], [-40, 82], [-15, 85],
      [-8, 78], [-5, 80], [0, 82], [5, 78], [2, 76], [0, 75],
    ],
  },
};

/* ──────────────────────────────────────────────────────────────
   Track — a tube extruded along the control curve
   ────────────────────────────────────────────────────────────── */
function Track({ points, color, width = 6 }) {
  const [trackGeom, kerbGeom] = useMemo(() => {
    const v = points.map(([x, z]) => new THREE.Vector3(x, 0.5, z));
    const c = new THREE.CatmullRomCurve3(v, true, "catmullrom", 0.5);
    // Main asphalt ribbon as a flat tube (elliptical so it sits flat)
    const track = new THREE.TubeGeometry(c, 260, width / 2, 8, true);
    // Scale Y way down so the tube becomes a flat ribbon, not a round pipe
    track.scale(1, 0.06, 1);
    // Kerb ribbon just beside — wider tube, flatter
    const kerb = new THREE.TubeGeometry(c, 260, width / 2 + 0.8, 8, true);
    kerb.scale(1, 0.02, 1);
    return [track, kerb];
  }, [points, width]);

  return (
    <group>
      <mesh geometry={kerbGeom} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#e10600" roughness={0.8} />
      </mesh>
      <mesh geometry={trackGeom} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   Terrain — grass ground plane under the track
   ────────────────────────────────────────────────────────────── */
function Terrain() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.05}>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color="#0c2c0c" roughness={0.95} />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────
   Start/Finish Line — striped chequered marker on the track
   ────────────────────────────────────────────────────────────── */
function StartLine({ points }) {
  const [pos, rot] = useMemo(() => {
    const v = points.map(([x, z]) => new THREE.Vector3(x, 0, z));
    const c = new THREE.CatmullRomCurve3(v, true, "catmullrom", 0.5);
    const p = c.getPoint(0);
    const t = c.getTangent(0);
    const yaw = Math.atan2(t.x, t.z);
    return [[p.x, 0.25, p.z], yaw];
  }, [points]);

  return (
    <mesh position={pos} rotation={[0, rot, 0]}>
      <boxGeometry args={[6, 0.05, 1.6]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────
   Public component
   ────────────────────────────────────────────────────────────── */
export default function CircuitViewer3D({
  preset = "monaco",
  autoRotate = true,
  className = "",
}) {
  const config = CIRCUIT_PRESETS[preset] || CIRCUIT_PRESETS.monaco;

  return (
    <div
      className={`w-full aspect-video overflow-hidden bg-[#0a1426] ${className}`}
      data-testid="circuit-viewer-3d"
      style={{ touchAction: "none" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [140, 120, 180], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[config.sky]} />

        <ambientLight intensity={1.0} />
        <directionalLight
          position={[80, 160, 60]}
          intensity={1.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-80, 80, -60]}
          intensity={0.6}
          color="#8ab0ff"
        />
        <hemisphereLight args={["#4a5a7f", "#0c2c0c", 0.8]} />

        <Suspense fallback={null}>
          <Terrain />
          <Track points={config.points} color="#2a2a2a" />
          <StartLine points={config.points} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={100}
          maxDistance={350}
          maxPolarAngle={Math.PI * 0.45}
          minPolarAngle={Math.PI * 0.1}
          autoRotate={autoRotate}
          autoRotateSpeed={0.45}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}

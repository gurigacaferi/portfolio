import React, { useRef, useState, Suspense, useCallback, useEffect, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

/**
 * Interactive vignette of the Victorian three-box block system:
 * Blocks AB and BC: at most one train per block (LTL safety).
 * Visitor can dispatch a train; signals turn green only for a clear next block.
 */

class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="railway-scene-fallback">
          <p>3D preview unavailable in this browser.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const BLOCK_AB = { min: -3.2, max: -0.2 };
const BLOCK_BC = { min: -0.2, max: 2.8 };
const TRAIN_SPEED = 1.15;

function Track() {
  return (
    <group>
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.2, 0.55]} />
        <meshStandardMaterial color="#5c4a3a" roughness={1} />
      </mesh>
      {[-0.12, 0.12].map((z) => (
        <mesh key={z} position={[0, 0.01, z]}>
          <boxGeometry args={[7.0, 0.04, 0.04]} />
          <meshStandardMaterial color="#9aa3ad" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[-3.2 + i * 0.38, -0.02, 0]}>
          <boxGeometry args={[0.08, 0.05, 0.42]} />
          <meshStandardMaterial color="#3d2e22" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function SignalPost({ position, aspectRef, which }) {
  const lampRef = useRef();
  const lightRef = useRef();

  useFrame(() => {
    const aspect = aspectRef.current?.[which] || "danger";
    const lamp = aspect === "clear" ? "#30d158" : "#ff453a";
    if (lampRef.current) {
      lampRef.current.material.color.set(lamp);
      lampRef.current.material.emissive.set(lamp);
    }
    if (lightRef.current) lightRef.current.color.set(lamp);
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
        <meshStandardMaterial color="#2c2c2e" />
      </mesh>
      <mesh position={[0, 0.78, 0.08]}>
        <boxGeometry args={[0.22, 0.34, 0.12]} />
        <meshStandardMaterial color="#1c1c1e" />
      </mesh>
      <mesh ref={lampRef} position={[0, 0.86, 0.16]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#ff453a" emissive="#ff453a" emissiveIntensity={0.85} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.86, 0.3]} color="#ff453a" intensity={0.55} distance={1.8} />
    </group>
  );
}

function SignalBox({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.45]} />
        <meshStandardMaterial color="#6b5344" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[0.62, 0.08, 0.52]} />
        <meshStandardMaterial color="#4a372c" />
      </mesh>
      <mesh position={[0, 0.32, 0.23]}>
        <planeGeometry args={[0.22, 0.16]} />
        <meshBasicMaterial color="#f0e6c8" />
      </mesh>
    </group>
  );
}

function Train({ progressRef, runningRef }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const progress = progressRef.current;
    const running = runningRef.current;
    const x = -3.0 + progress * 5.6;
    ref.current.visible = running || progress > 0.001;
    ref.current.position.x = x;
    if (running) {
      ref.current.rotation.z = Math.sin(performance.now() * 0.02) * 0.015;
    } else {
      ref.current.rotation.z = 0;
    }
  });

  return (
    <group ref={ref} position={[-3.0, 0.12, 0]} visible={false}>
      <mesh>
        <boxGeometry args={[0.55, 0.28, 0.28]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0.18, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.16, 0.24]} />
        <meshStandardMaterial color="#0f2a6b" />
      </mesh>
      <mesh position={[-0.12, 0.22, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.26]} />
        <meshStandardMaterial color="#172554" />
      </mesh>
      {[-0.16, 0.16].map((ox) =>
        [-0.12, 0.12].map((oz) => (
          <mesh key={`${ox}-${oz}`} position={[ox, -0.12, oz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
            <meshStandardMaterial color="#1c1c1e" />
          </mesh>
        ))
      )}
    </group>
  );
}

function BlockMarkers() {
  return (
    <group>
      <mesh position={[(BLOCK_AB.min + BLOCK_AB.max) / 2, 0.02, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BLOCK_AB.max - BLOCK_AB.min - 0.15, 0.08]} />
        <meshBasicMaterial color="#78716c" transparent opacity={0.55} />
      </mesh>
      <mesh position={[(BLOCK_BC.min + BLOCK_BC.max) / 2, 0.02, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BLOCK_BC.max - BLOCK_BC.min - 0.15, 0.08]} />
        <meshBasicMaterial color="#a8a29e" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function RailwayWorld({ runningRef, progressRef, aspectRef, onPhase, reduceMotion }) {
  const lastPhase = useRef("");

  useFrame((_, dt) => {
    if (!runningRef.current || reduceMotion) return;

    progressRef.current = Math.min(1, progressRef.current + (dt * TRAIN_SPEED) / 5.6);
    const progress = progressRef.current;
    const x = -3.0 + progress * 5.6;
    const inAB = x >= BLOCK_AB.min && x < BLOCK_AB.max;
    const inBC = x >= BLOCK_BC.min && x <= BLOCK_BC.max;

    aspectRef.current = {
      ab: inAB || x < BLOCK_AB.min ? "clear" : "danger",
      bc: inBC || (inAB && x > BLOCK_AB.max - 0.9) ? "clear" : "danger"
    };

    let phase = "ab";
    if (progress >= 0.98) phase = "done";
    else if (inBC) phase = "bc";

    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      onPhase(phase);
    }

    if (progress >= 1) {
      runningRef.current = false;
      progressRef.current = 0;
      aspectRef.current = { ab: "danger", bc: "danger" };
      lastPhase.current = "idle";
      onPhase("idle");
    }
  });

  return (
    <>
      <color attach="background" args={["#1a1a1e"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={0.85} />
      <directionalLight position={[-2, 3, -2]} intensity={0.25} color="#93c5fd" />

      <Track />
      <BlockMarkers />
      <SignalBox position={[-3.4, 0, -0.85]} />
      <SignalBox position={[-0.2, 0, -0.85]} />
      <SignalBox position={[2.8, 0, -0.85]} />
      <SignalPost position={[-3.15, 0, 0.55]} aspectRef={aspectRef} which="ab" />
      <SignalPost position={[-0.15, 0, 0.55]} aspectRef={aspectRef} which="bc" />
      <Train progressRef={progressRef} runningRef={runningRef} />

      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#2a2420" roughness={1} />
      </mesh>
    </>
  );
}

const PHASE_COPY = {
  idle: "Idle: block AB and BC clear",
  ab: "Occupying AB · BC reserved clear · at most one train",
  bc: "Hand-off complete · occupying BC · AB released",
  done: "Train exited C · protocol reset · no counterexample",
  start: "Train entering AB · signal clear · LTL safety holds"
};

export default function RailwayScene() {
  const reduceMotion = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(PHASE_COPY.idle);

  const runningRef = useRef(false);
  const progressRef = useRef(0);
  const aspectRef = useRef({ ab: "danger", bc: "danger" });

  const onPhase = useCallback((phase) => {
    setStatus(PHASE_COPY[phase] || PHASE_COPY.idle);
    if (phase === "idle" || phase === "done") setRunning(false);
  }, []);

  const dispatch = useCallback(() => {
    if (runningRef.current) return;
    progressRef.current = 0;
    runningRef.current = true;
    aspectRef.current = { ab: "clear", bc: "danger" };
    setRunning(true);
    setStatus(PHASE_COPY.start);
  }, []);

  // Reduced-motion: skip animation, jump to done message
  useEffect(() => {
    if (!reduceMotion || !running) return;
    const t = setTimeout(() => {
      runningRef.current = false;
      progressRef.current = 0;
      setRunning(false);
      setStatus(PHASE_COPY.done);
    }, 600);
    return () => clearTimeout(t);
  }, [reduceMotion, running]);

  return (
    <WebGLBoundary>
      <div className="railway-scene">
        <div className="railway-scene-canvas">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0.2, 2.8, 4.2], fov: 38, near: 0.1, far: 40 }}
            gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
            onCreated={({ camera }) => {
              camera.lookAt(0, 0.2, 0);
            }}
            frameloop={reduceMotion && !running ? "demand" : "always"}
          >
            <Suspense fallback={null}>
              <RailwayWorld
                runningRef={runningRef}
                progressRef={progressRef}
                aspectRef={aspectRef}
                onPhase={onPhase}
                reduceMotion={!!reduceMotion}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="railway-scene-bar">
          <div className="railway-scene-meta">
            <span className="railway-scene-label">Block protocol</span>
            <span className="railway-scene-status">{status}</span>
          </div>
          <button
            type="button"
            className="mac-btn"
            style={{ fontSize: 12, flexShrink: 0 }}
            onClick={dispatch}
            disabled={running}
          >
            {running ? "Running…" : "Dispatch train"}
          </button>
        </div>
        <p className="railway-scene-caption">
          Safety (LTL): at most one train in AB or BC. Green = clear to enter; red = danger.
        </p>
      </div>
    </WebGLBoundary>
  );
}

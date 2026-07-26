import React, { useMemo, useRef, Suspense, useEffect, useState, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { PRESENT_YEAR } from "../configs/portfolio";
import { useIsMobileLayout } from "../hooks/useMediaQuery";

class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function Hill({ position, scale, color, opacity }) {
  return (
    <mesh position={position} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1, 48]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function SkyParticles({ count, warmth, animate }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = Math.random() * 7 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!animate || !ref.current) return;
    const t = state.clock.elapsedTime * 0.04;
    ref.current.rotation.y = t * 0.15;
    ref.current.position.x = Math.sin(t) * 0.15;
  });

  const color = warmth > 0.55 ? "#fff4d6" : warmth > 0.3 ? "#e8f0ff" : "#c8d4f0";

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.55 + warmth * 0.2}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Sun({ warmth, animate }) {
  const ref = useRef();
  useFrame((state) => {
    if (!animate || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = 1.15 + Math.sin(t * 0.35) * 0.04;
  });

  const sunColor = warmth > 0.5 ? "#ffd56a" : warmth > 0.25 ? "#ffb347" : "#c9a06a";
  const glowColor = warmth > 0.5 ? "#ffecb0" : "#e8c98a";

  return (
    <group ref={ref} position={[2.4, 1.2, -3]}>
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={sunColor} transparent opacity={0.85} />
      </mesh>
      <mesh scale={1.85}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene({ pastFactor, animate }) {
  const warmth = 1 - pastFactor;
  const particleCount = Math.round(40 + warmth * 90);
  const hillWarm = pastFactor > 0.5 ? "#6a4520" : "#8a5222";
  const hillCool = pastFactor > 0.5 ? "#4a3828" : "#7a4818";

  return (
    <>
      <ambientLight intensity={0.6} />
      <Sun warmth={warmth} animate={animate} />
      <SkyParticles count={particleCount} warmth={warmth} animate={animate} />
      <group position={[0, -2.1, 0]}>
        <Hill position={[-3.2, 0, 0.2]} scale={[4.2, 1.4, 1]} color={hillCool} opacity={0.45} />
        <Hill position={[0.4, 0, 0]} scale={[5.5, 1.6, 1]} color={hillWarm} opacity={0.5} />
        <Hill position={[3.5, 0, 0.15]} scale={[3.8, 1.3, 1]} color={hillCool} opacity={0.42} />
      </group>
    </>
  );
}

function usePageVisible() {
  const [visible, setVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState !== "hidden"
  );
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return visible;
}

/**
 * Living wallpaper layer. Parent passes timeMachineYear.
 * Falls back to CSS wallpaper alone when reduced-motion or WebGL fails.
 */
export default function WallpaperCanvas({ timeMachineYear }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileLayout();
  const pageVisible = usePageVisible();

  const pastFactor = Math.min(1, Math.max(0, (PRESENT_YEAR - timeMachineYear) / (PRESENT_YEAR - 2022)));
  const animate = !reduceMotion && pageVisible;

  if (reduceMotion) return null;

  return (
    <div className="wallpaper-canvas" aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [0, 0.6, 6.5], fov: 42, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
          frameloop={animate ? "always" : "demand"}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <Scene pastFactor={pastFactor} animate={animate} />
          </Suspense>
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}

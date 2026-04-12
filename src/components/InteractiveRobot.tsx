"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Sparkles, useProgress } from "@react-three/drei";
import * as THREE from "three";

type InteractiveRobotProps = {
  variant?: "hero" | "plain";
};

function ColorCore() {
  const group = useRef<THREE.Group>(null);
  const ringOuter = useRef<THREE.Mesh>(null);
  const ringMid = useRef<THREE.Mesh>(null);
  const ringInner = useRef<THREE.Mesh>(null);
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    const targetYaw = state.pointer.x * 0.45;
    const targetPitch = state.pointer.y * 0.22;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetYaw, 3.8, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -targetPitch, 3.2, delta);
    group.current.position.y = Math.sin(t * 1.4) * 0.09;

    if (ringOuter.current) {
      ringOuter.current.rotation.z += delta * 0.65;
      ringOuter.current.rotation.x += delta * 0.12;
    }
    if (ringMid.current) {
      ringMid.current.rotation.y -= delta * 0.78;
    }
    if (ringInner.current) {
      ringInner.current.rotation.x += delta * 0.84;
    }

    if (coreMaterial.current) {
      const hue = (0.56 + Math.sin(t * 0.35) * 0.08 + 1) % 1;
      const emissiveHue = (0.05 + Math.sin(t * 0.23) * 0.04 + 1) % 1;

      coreMaterial.current.color.setHSL(hue, 0.86, 0.57);
      coreMaterial.current.emissive.setHSL(emissiveHue, 0.85, 0.34);
    }
  });

  const orbitCount = 12;

  return (
    <group ref={group} scale={1.05}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[0.95, 3]} />
        <meshStandardMaterial
          ref={coreMaterial}
          color="#26bfff"
          emissive="#ff8334"
          emissiveIntensity={1}
          roughness={0.2}
          metalness={0.55}
        />
      </mesh>

      <mesh ref={ringOuter} rotation={[Math.PI / 2.8, 0.25, 0]} castShadow>
        <torusGeometry args={[1.32, 0.045, 20, 150]} />
        <meshStandardMaterial
          color="#16ddff"
          emissive="#16ddff"
          emissiveIntensity={1.25}
          roughness={0.22}
          metalness={0.65}
        />
      </mesh>

      <mesh ref={ringMid} rotation={[0.55, Math.PI / 2.6, 0]} castShadow>
        <torusGeometry args={[1.62, 0.034, 20, 150]} />
        <meshStandardMaterial
          color="#ff9e4a"
          emissive="#ff9e4a"
          emissiveIntensity={1.05}
          roughness={0.28}
          metalness={0.5}
        />
      </mesh>

      <mesh ref={ringInner} rotation={[0.18, 0.42, Math.PI / 2.3]} castShadow>
        <torusGeometry args={[1.9, 0.028, 20, 120]} />
        <meshStandardMaterial
          color="#8b7dff"
          emissive="#8b7dff"
          emissiveIntensity={0.88}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      {Array.from({ length: orbitCount }).map((_, index) => {
        const angle = (index / orbitCount) * Math.PI * 2;
        const radius = 2.2 + (index % 3 === 0 ? 0.15 : 0);
        const y = Math.sin(angle * 1.6) * 0.36;
        const color = index % 2 === 0 ? "#6ee7ff" : "#ffb866";
        const scale = index % 4 === 0 ? 0.12 : 0.09;

        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
            scale={scale}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.06}
              roughness={0.32}
              metalness={0.4}
            />
          </mesh>
        );
      })}

      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.9, 80]} />
        <meshStandardMaterial color="#0b1430" transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="rounded-full border border-cyan-200/35 bg-black/70 px-3 py-1 text-xs font-mono tracking-[0.2em] text-cyan-100">
        {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function InteractiveRobot({ variant = "plain" }: InteractiveRobotProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        isHero
          ? "rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#1a0a2a] via-[#071330] to-[#160a14] shadow-[0_22px_95px_rgba(77,214,255,0.18)]"
          : ""
      }`}
    >
      {isHero && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,221,255,0.22),transparent_44%),radial-gradient(circle_at_84%_20%,rgba(255,146,76,0.2),transparent_46%),radial-gradient(circle_at_52%_100%,rgba(255,70,145,0.16),transparent_58%)]" />
          <div className="pointer-events-none absolute -top-24 right-8 h-56 w-56 rounded-full bg-orange-300/14 blur-3xl" />
        </>
      )}

      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.5, 6.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.16;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <color attach="background" args={["#050816"]} />
        <fog attach="fog" args={["#050816", 6.5, 13]} />

        <Suspense fallback={<SceneLoader />}>
          <ambientLight intensity={0.52} />
          <hemisphereLight intensity={0.65} color="#8ae8ff" groundColor="#100b1f" />
          <directionalLight
            castShadow
            position={[4.8, 6, 3.1]}
            intensity={1.8}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-3.4, 1.9, 2.7]} intensity={1.15} color="#29dfff" />
          <pointLight position={[2.9, -0.2, -2.7]} intensity={0.7} color="#ff8a43" />
          <pointLight position={[0, 2.2, -3.2]} intensity={0.5} color="#a18bff" />
          <Sparkles count={84} scale={[7, 3.5, 7]} size={2.6} speed={0.35} opacity={0.32} color="#8ce9ff" />

          <ColorCore />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.07}
            autoRotate
            autoRotateSpeed={0.22}
            minPolarAngle={Math.PI / 2.35}
            maxPolarAngle={Math.PI / 1.95}
            minAzimuthAngle={-Math.PI / 3.5}
            maxAzimuthAngle={Math.PI / 3.5}
          />
        </Suspense>
      </Canvas>

      {isHero && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050816] via-[#050816]/70 to-transparent" />
          <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-cyan-200/30 bg-black/45 px-3 py-1 text-[10px] font-mono tracking-[0.22em] text-cyan-100/85 backdrop-blur-sm">
            COLOR CORE
          </div>
          <div className="pointer-events-none absolute right-4 bottom-4 rounded-full border border-orange-200/25 bg-black/45 px-3 py-1 text-[10px] font-mono tracking-[0.18em] text-orange-100/80 backdrop-blur-sm">
            DRAG TO SPIN
          </div>
        </>
      )}
    </div>
  );
}

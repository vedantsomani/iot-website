"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple robot head component
function RobotHead() {
    const groupRef = useRef<THREE.Group>(null);
    const eyeLeftRef = useRef<THREE.Mesh>(null);
    const eyeRightRef = useRef<THREE.Mesh>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Idle animation
    useFrame((state) => {
        if (groupRef.current) {
            // Subtle floating motion
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
        }

        // Eyes follow mouse
        if (eyeLeftRef.current && eyeRightRef.current) {
            const targetX = mousePos.x * 0.15;
            const targetY = mousePos.y * 0.1;
            eyeLeftRef.current.position.x = -0.25 + targetX;
            eyeLeftRef.current.position.y = 0.15 + targetY;
            eyeRightRef.current.position.x = 0.25 + targetX;
            eyeRightRef.current.position.y = 0.15 + targetY;
        }
    });

    const neonBlue = useMemo(() => new THREE.Color('#00D4FF'), []);
    const neonPurple = useMemo(() => new THREE.Color('#BD00FF'), []);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef}>
                {/* Main head */}
                <mesh>
                    <boxGeometry args={[1.2, 1, 0.8]} />
                    <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Face plate */}
                <mesh position={[0, 0, 0.41]}>
                    <boxGeometry args={[1, 0.8, 0.05]} />
                    <meshStandardMaterial color="#0f0f1a" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Eye sockets */}
                <mesh position={[-0.25, 0.15, 0.44]}>
                    <circleGeometry args={[0.18, 32]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
                <mesh position={[0.25, 0.15, 0.44]}>
                    <circleGeometry args={[0.18, 32]} />
                    <meshStandardMaterial color="#000" />
                </mesh>

                {/* Eyes (glowing) */}
                <mesh ref={eyeLeftRef} position={[-0.25, 0.15, 0.45]}>
                    <circleGeometry args={[0.1, 32]} />
                    <meshStandardMaterial emissive={neonBlue} emissiveIntensity={2} color={neonBlue} />
                </mesh>
                <mesh ref={eyeRightRef} position={[0.25, 0.15, 0.45]}>
                    <circleGeometry args={[0.1, 32]} />
                    <meshStandardMaterial emissive={neonBlue} emissiveIntensity={2} color={neonBlue} />
                </mesh>

                {/* Mouth (LED strip) */}
                <mesh position={[0, -0.2, 0.44]}>
                    <boxGeometry args={[0.5, 0.08, 0.02]} />
                    <meshStandardMaterial emissive={neonPurple} emissiveIntensity={1.5} color={neonPurple} />
                </mesh>

                {/* Antenna */}
                <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.4]} />
                    <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.95, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial emissive={neonBlue} emissiveIntensity={2} color={neonBlue} />
                </mesh>

                {/* Ear panels */}
                <mesh position={[-0.65, 0, 0]}>
                    <boxGeometry args={[0.1, 0.5, 0.3]} />
                    <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0.65, 0, 0]}>
                    <boxGeometry args={[0.1, 0.5, 0.3]} />
                    <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>
        </Float>
    );
}

export default function RobotMascot() {
    const [isMobile, setIsMobile] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Check if mobile or low performance
        const checkDevice = () => {
            const isMobileDevice = window.innerWidth < 768 || 'ontouchstart' in window;
            setIsMobile(isMobileDevice);

            // Disable on mobile to save performance
            if (isMobileDevice) {
                setShouldRender(false);
            }
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Fallback for mobile: simple animated SVG
    if (!shouldRender || isMobile) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 animate-bounce">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Simple robot face SVG */}
                        <rect x="20" y="20" width="60" height="50" rx="5" fill="#1a1a2e" stroke="#00D4FF" strokeWidth="2" />
                        <circle cx="35" cy="40" r="8" fill="#00D4FF" className="animate-pulse" />
                        <circle cx="65" cy="40" r="8" fill="#00D4FF" className="animate-pulse" />
                        <rect x="35" y="55" width="30" height="5" rx="2" fill="#BD00FF" />
                        <line x1="50" y1="10" x2="50" y2="20" stroke="#333" strokeWidth="3" />
                        <circle cx="50" cy="8" r="4" fill="#00D4FF" className="animate-pulse" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 3], fov: 50 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#BD00FF" />
                <RobotHead />
            </Canvas>
        </div>
    );
}

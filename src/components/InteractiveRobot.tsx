"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function RobotHead({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
    const headRef = useRef<THREE.Group>(null);
    const eyeLeftRef = useRef<THREE.Mesh>(null);
    const eyeRightRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!headRef.current) return;

        // Smoothly interpolate mouse position for head rotation
        const targetX = (state.mouse.x * Math.PI) / 4;
        const targetY = (state.mouse.y * Math.PI) / 4;

        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetY, 0.1);

        // Blink effect
        /*
        if (Math.random() > 0.995) {
           // Simple scale blink logic could go here if using spring values
        }
        */
    });

    return (
        <group ref={headRef}>
            {/* Main Head Shape - Cyberpunk Helmet Style */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.2, 1, 1.2]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Face Plate */}
            <mesh position={[0, 0, 0.61]}>
                <planeGeometry args={[1, 0.8]} />
                <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Glowing Eyes */}
            <mesh ref={eyeLeftRef} position={[-0.25, 0.1, 0.62]}>
                <circleGeometry args={[0.15, 32]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>
            <mesh ref={eyeRightRef} position={[0.25, 0.1, 0.62]}>
                <circleGeometry args={[0.15, 32]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>

            {/* Antennae */}
            <mesh position={[-0.6, 0.6, 0]} rotation={[0, 0, 0.5]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.6, 0.6, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Glowing accents on side */}
            <mesh position={[0.61, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.8, 0.1]} />
                <meshBasicMaterial color="#a855f7" toneMapped={false} />
            </mesh>
            <mesh position={[-0.61, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[0.8, 0.1]} />
                <meshBasicMaterial color="#a855f7" toneMapped={false} />
            </mesh>
        </group>
    );
}

function RobotBody() {
    return (
        <group position={[0, -1.5, 0]}>
            {/* Torso */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.4, 0.2, 1, 8]} />
                <meshStandardMaterial color="#222" metalness={0.8} />
            </mesh>

            {/* Shoulders */}
            <mesh position={[-0.8, 0.8, 0]}>
                <sphereGeometry args={[0.4]} />
                <meshStandardMaterial color="#333" metalness={0.7} />
            </mesh>
            <mesh position={[0.8, 0.8, 0]}>
                <sphereGeometry args={[0.4]} />
                <meshStandardMaterial color="#333" metalness={0.7} />
            </mesh>

            {/* Core Reactor */}
            <mesh position={[0, 0.5, 0.35]}>
                <circleGeometry args={[0.2]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>
            <pointLight position={[0, 0.5, 0.5]} color="#00ffff" intensity={2} distance={2} />
        </group>
    );
}

function Scene() {
    const mouse = useRef<[number, number]>([0, 0]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4c1d95" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <RobotBody />
                <RobotHead mouse={mouse} />
            </Float>

            <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.5} color="#00ffff" />
        </>
    );
}

export default function InteractiveRobot() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Scene />
            </Canvas>
        </div>
    );
}

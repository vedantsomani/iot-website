"use client";

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Grid } from '@react-three/drei';
import InteractiveRobot from '@/components/InteractiveRobot';
import { FileUp, Box, ChevronRight, Cuboid, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// Placeholder projects list
const projects = [
    { id: 'custom', name: 'Upload Blueprint', file: null, type: 'upload' },
    { id: 'drone', name: 'Fire Fighting Drone', file: '/models/drone-preview.glb', type: 'preset' },
    { id: 'rover', name: 'Mars Rover Mk.II', file: '/models/rover-preview.glb', type: 'preset' },
    { id: 'arm', name: 'Robotic Arm 6DOF', file: '/models/arm-preview.glb', type: 'preset' },
    { id: 'esp', name: 'ESP32 Smart Hub', file: '/models/hub-preview.glb', type: 'preset' },
];

export default function TwinPage() {
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadUserFile(e.dataTransfer.files[0]);
        }
    };

    const loadUserFile = (file: File) => {
        if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
            setIsLoading(true);
            const url = URL.createObjectURL(file);
            // Simulate loading delay
            setTimeout(() => {
                setModelUrl(url);
                setSelectedProject('custom');
                setIsLoading(false);
            }, 800);
        } else {
            alert("Please upload a .glb or .gltf file");
        }
    };

    const handleProjectSelect = (project: typeof projects[0]) => {
        if (project.type === 'upload') {
            setSelectedProject('custom');
            setModelUrl(null); // Reset to allow drag/drop or showing default
            return;
        }

        setSelectedProject(project.id);
        setIsLoading(true);

        // Simulating fetch of a preset model
        // In a real app, these would be real paths. 
        // For now, we'll just show the robot or a placeholder if the file doesn't exist
        // But to make it feel real, we'll reset the model URL so it falls back to the "Default" (Robot) 
        // or a specific placeholder view.

        setTimeout(() => {
            // Since we don't have actual GLB files for these, we'll just clear the URL 
            // causing it to render the InteractiveRobot (as a placeholder for "Viewer")
            // In a real implementation: setModelUrl(project.file);
            setModelUrl(null);
            setIsLoading(false);
        }, 600);
    };

    function UserModel({ url }: { url: string }) {
        const { scene } = useGLTF(url);
        return <primitive object={scene} />;
    }

    return (
        <div
            className="flex w-full h-screen bg-black overflow-hidden"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {/* Sidebar Removed as per request */}


            {/* Main Viewer Area */}
            <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-black">
                {/* Drag Overlay */}
                {dragActive && (
                    <div className="absolute inset-0 z-50 bg-neon-blue/20 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-neon-blue m-8 rounded-3xl">
                        <div className="text-4xl font-bold text-white flex flex-col items-center">
                            <FileUp className="w-16 h-16 mb-4" />
                            DROP .GLB FILE TO IMPORT
                        </div>
                    </div>
                )}

                {/* Loading State */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <div className="text-neon-blue font-mono tracking-widest">LOADING 3D ASSETS...</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* header overlay */}
                <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-orbitron">{selectedProject ? projects.find(p => p.id === selectedProject)?.name : 'Viewer Idle'}</h2>
                        <p className="text-neon-blue/70 text-sm font-mono">{selectedProject ? 'Interactive Mode // Orbit Controls Enabled' : 'Waiting for input...'}</p>
                    </div>
                    <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-gray-400">
                        {modelUrl ? 'CUSTOM_MODEL_LOADED' : 'DEFAULT_RENDERER'}
                    </div>
                </div>

                <div className="w-full h-full">
                    {modelUrl ? (
                        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
                            <color attach="background" args={['#050505']} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />

                            <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />

                            <Stage environment="city" intensity={0.5} adjustCamera>
                                <UserModel url={modelUrl} />
                            </Stage>
                            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
                        </Canvas>
                    ) : (
                        // Fallback to the interactive robot if no custom model
                        <InteractiveRobot />
                    )}
                </div>

                {/* Overlay Grid/UI elements */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>
        </div>
    );
}

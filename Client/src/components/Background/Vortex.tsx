import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VortexParticles = ({ particleCount = 5000, color = "#2979FF" }) => {
    const points = useRef<THREE.Points>(null!);
    const { viewport } = useThree();

    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const speeds = new Float32Array(particleCount);
        const radii = new Float32Array(particleCount);
        const angles = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            radii[i] = Math.random() * 8 + 2;
            angles[i] = Math.random() * Math.PI * 2;
            speeds[i] = 0.01 + Math.random() * 0.02;

            positions[i * 3] = Math.cos(angles[i]) * radii[i];
            positions[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return { positions, speeds, radii, angles };
    }, [particleCount]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const pos = points.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            particles.angles[i] += particles.speeds[i] * 0.5;
            const r = particles.radii[i];
            const a = particles.angles[i];

            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 1] = Math.sin(a) * r;
            pos[i * 3 + 2] = Math.sin(time * 0.5 + r) * 2;
        }
        points.current.geometry.attributes.position.needsUpdate = true;
        points.current.rotation.z = time * 0.05;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={color}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
};

export default function Vortex() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <color attach="background" args={['#020a18']} />
                <VortexParticles />
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    );
}

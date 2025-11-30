import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Background3DProps {
  primaryColor: string;
  secondaryColor: string;
  analyser?: AnalyserNode | null;
}

const AnimatedSphere: React.FC<{ 
  primaryColor: string; 
  secondaryColor: string;
  analyser?: AnalyserNode | null;
}> = ({ primaryColor, secondaryColor, analyser }) => {
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const dataArray = useRef(new Uint8Array(32)); // Small buffer for performance
  
  const targetColor = new THREE.Color(primaryColor);
  
  useFrame((state, delta) => {
    // 1. Color Transition
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, delta * 2);
    }

    // 2. Audio Reactivity
    let bass = 0;
    if (analyser) {
      analyser.getByteFrequencyData(dataArray.current);
      // Average the lower frequencies (bass)
      const lowerFrequencies = dataArray.current.slice(0, 8);
      const sum = lowerFrequencies.reduce((a, b) => a + b, 0);
      bass = sum / lowerFrequencies.length; 
    }

    // Normalize bass (0-255) to a usable factor (0-1)
    const normalizedBass = bass / 255;

    // Apply reactivity
    if (materialRef.current) {
        // Base distortion is 0.4, adds up based on bass
        const targetDistort = 0.4 + (normalizedBass * 0.8); 
        // Interpolate current distort to target for smoothness
        materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.2);
    }

    if (meshRef.current) {
        // Pulse scale with beat
        const targetScale = 2.4 + (normalizedBass * 0.6);
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.3);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.4}>
        <MeshDistortMaterial
          ref={materialRef}
          color={primaryColor}
          envMapIntensity={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          metalness={0.1}
          roughness={0.3}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
};

const AmbientLightRig: React.FC<{ color: string }> = ({ color }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetColor = new THREE.Color(color);

  useFrame((state, delta) => {
    if (lightRef.current) {
      lightRef.current.color.lerp(targetColor, delta * 1.5);
    }
  });

  return (
    <>
      {/* @ts-ignore */}
      <ambientLight intensity={0.5} />
      {/* @ts-ignore */}
      <pointLight ref={lightRef} position={[10, 10, 10]} intensity={1.5} />
      {/* @ts-ignore */}
      <pointLight position={[-10, -10, -5]} color="#ffffff" intensity={0.5} />
    </>
  );
};

export const Background3D: React.FC<Background3DProps> = ({ primaryColor, secondaryColor, analyser }) => {
  return (
    <div className="fixed inset-0 z-0 bg-black transition-colors duration-1000">
        <div 
            className="absolute inset-0 opacity-20 transition-colors duration-1000"
            style={{ 
                background: `radial-gradient(circle at 30% 50%, ${primaryColor}, transparent 60%)` 
            }}
        />
        
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <AmbientLightRig color={secondaryColor} />
        <AnimatedSphere 
            primaryColor={primaryColor} 
            secondaryColor={secondaryColor} 
            analyser={analyser}
        />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        {/* @ts-ignore */}
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
};
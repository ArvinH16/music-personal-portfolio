import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Background3DProps {
  primaryColor: string;
  secondaryColor: string;
  analyser?: AnalyserNode | null;
}

const useAudioLevel = (analyser?: AnalyserNode | null) => {
  const [level, setLevel] = useState(0.12);

  useEffect(() => {
    let raf = 0;
    let smoothed = level;
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const update = () => {
      let nextLevel = 0.12;

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const bandSize = Math.max(12, Math.floor(dataArray.length * 0.18));
        const bassBins = dataArray.subarray(0, bandSize);
        const sum = bassBins.reduce((a, b) => a + b, 0);
        nextLevel = sum / (bassBins.length * 255);
      } else {
        // Idle breathing when no analyser is active
        const t = Date.now() * 0.001;
        nextLevel = 0.1 + (Math.sin(t * 0.6) + 1) * 0.07;
      }

      smoothed = THREE.MathUtils.lerp(smoothed, nextLevel, 0.18);
      setLevel(smoothed);
      raf = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(raf);
  }, [analyser]);

  return level;
};

const AnimatedSphere: React.FC<{ 
  primaryColor: string; 
  accentColor: string;
  audioLevel: number;
}> = ({ primaryColor, accentColor, audioLevel }) => {
  const outerMaterialRef = useRef<any>(null);
  const innerMaterialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const targetColor = new THREE.Color(primaryColor);
  const targetEmissive = new THREE.Color(accentColor);
  
  useFrame((state, delta) => {
    const beat = Math.min(1, Math.pow(audioLevel * 1.6, 1.1));

    if (outerMaterialRef.current) {
      outerMaterialRef.current.color.lerp(targetColor, delta * 2);
      outerMaterialRef.current.emissive?.lerp(targetEmissive, delta * 1.5);
      const targetDistort = 0.18 + (beat * 0.6);
      outerMaterialRef.current.distort = THREE.MathUtils.lerp(outerMaterialRef.current.distort, targetDistort, 0.14);
      outerMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        outerMaterialRef.current.emissiveIntensity ?? 0.6,
        0.7 + beat * 0.9,
        0.16
      );
      outerMaterialRef.current.roughness = THREE.MathUtils.lerp(
        outerMaterialRef.current.roughness ?? 0.3,
        0.32 - beat * 0.14,
        0.08
      );
    }

    if (innerMaterialRef.current) {
      const targetDistort = 0.08 + beat * 0.25;
      innerMaterialRef.current.distort = THREE.MathUtils.lerp(innerMaterialRef.current.distort, targetDistort, 0.2);
      innerMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        innerMaterialRef.current.emissiveIntensity ?? 1,
        1.2 + beat * 1.4,
        0.18
      );
    }

    if (meshRef.current) {
        const targetScale = 1.35 + (beat * 0.55);
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        meshRef.current.rotation.y += delta * (0.14 + beat * 0.24);
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    if (innerRef.current) {
      const targetScale = 0.75 + beat * 0.22;
      innerRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
      innerRef.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.35}>
          <MeshDistortMaterial
            ref={outerMaterialRef}
            color={primaryColor}
            envMapIntensity={0.28}
            clearcoat={0.6}
            clearcoatRoughness={0.16}
            metalness={0.3}
            emissive={accentColor}
            emissiveIntensity={0.7}
            roughness={0.32}
            distort={0.18}
            speed={1.8}
            transparent
            opacity={0.9}
          />
        </Sphere>
        <Sphere ref={innerRef} args={[0.8, 48, 48]} scale={0.8} position={[0, 0, -0.12]}>
          <MeshDistortMaterial
            ref={innerMaterialRef}
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={1.2}
            roughness={0.15}
            metalness={0.5}
            distort={0.12}
            speed={2.2}
            transparent
            opacity={0.75}
          />
        </Sphere>
      </group>
    </Float>
  );
};

const AmbientLightRig: React.FC<{ color: string; audioLevel: number }> = ({ color, audioLevel }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetColor = new THREE.Color(color);

  useFrame((state, delta) => {
    if (lightRef.current) {
      lightRef.current.color.lerp(targetColor, delta * 1.5);
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        1.1 + audioLevel * 1.1,
        0.1
      );
    }
  });

  return (
    <>
      {/* @ts-ignore */}
      <ambientLight intensity={0.45 + audioLevel * 0.25} />
      {/* @ts-ignore */}
      <pointLight ref={lightRef} position={[10, 10, 10]} intensity={1.5} />
      {/* @ts-ignore */}
      <pointLight position={[-10, -10, -5]} color="#ffffff" intensity={0.5} />
    </>
  );
};

export const Background3D: React.FC<Background3DProps> = ({ primaryColor, secondaryColor, analyser }) => {
  const audioLevel = useAudioLevel(analyser);
  const glowScale = 0.86 + audioLevel * 0.28;
  const glowBlur = 70 + audioLevel * 40;

  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#03040a] via-[#05070f] to-[#04050a] transition-colors duration-1000">
        <div 
          className="absolute inset-0 opacity-30 blur-[80px] mix-blend-screen transition-transform duration-700"
          style={{ 
            background: `radial-gradient(circle at 40% 50%, ${primaryColor} 0%, transparent 50%), radial-gradient(circle at 70% 40%, ${secondaryColor} 0%, transparent 55%)`,
            transform: `scale(${glowScale})`,
            filter: `blur(${glowBlur}px)`
          }}
        />
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-700 pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at 50% 55%, ${primaryColor} 5%, transparent 65%)`,
            transform: `scale(${1 + audioLevel * 0.15})`
          }}
        />
        
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* @ts-ignore */}
        <color attach="background" args={['#050505']} />
        <AmbientLightRig color={secondaryColor} audioLevel={audioLevel} />
        <AnimatedSphere 
            primaryColor={primaryColor} 
            accentColor={secondaryColor} 
            audioLevel={audioLevel}
        />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        {/* @ts-ignore */}
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
};

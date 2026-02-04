import React from 'react';
import { Canvas } from '@react-three/fiber';

const Character = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Torso */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 1.4, 32]} />
        <meshStandardMaterial color="#2F4A6A" />
      </mesh>

      {/* Vest */}
      <mesh position={[0, 0.1, 0.55]}>
        <boxGeometry args={[0.9, 0.9, 0.2]} />
        <meshStandardMaterial color="#D69A3A" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#F0B48A" />
      </mesh>

      {/* Beard */}
      <mesh position={[0, 0.9, 0.15]} scale={[1.1, 0.9, 0.8]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#2B1F1A" />
      </mesh>

      {/* Hat brim */}
      <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.12, 16, 64]} />
        <meshStandardMaterial color="#2A221C" />
      </mesh>

      {/* Hat top */}
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.45, 32]} />
        <meshStandardMaterial color="#2A221C" />
      </mesh>

      {/* Bandana */}
      <mesh position={[0.55, 1.2, -0.1]} rotation={[0, 0, 0.6]}>
        <coneGeometry args={[0.2, 0.35, 16]} />
        <meshStandardMaterial color="#C9573C" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.18, 1.25, 0.45]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.18, 1.25, 0.45]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.9, 0.4, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 16]} />
        <meshStandardMaterial color="#2F4A6A" />
      </mesh>

      {/* Right arm raised */}
      <mesh position={[0.9, 0.9, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.12, 0.12, 1.1, 16]} />
        <meshStandardMaterial color="#2F4A6A" />
      </mesh>

      {/* Hand */}
      <mesh position={[1.35, 1.5, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#F0B48A" />
      </mesh>
    </group>
  );
};

const PricingCharacter3D: React.FC = () => {
  return (
    <div className="w-full h-[420px] md:h-[520px]">
      <Canvas camera={{ position: [0, 0.4, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1} />
        <directionalLight position={[-3, 2, 2]} intensity={0.4} />
        <Character />
      </Canvas>
    </div>
  );
};

export default PricingCharacter3D;

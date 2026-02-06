import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';

import pirateModelUrl from '@pirate/_public_thor_and_the_midgard_serpent-transformed.glb?url';

const PirateModel: React.FC = () => {
  const { scene } = useGLTF(pirateModelUrl);
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const { pointer, camera } = useThree();
  const hasLoggedVisibility = useRef(false);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 180;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);


  }, [scene]);

  useFrame(() => {
    const targetX = pointer.y * 0.9;
    const targetY = pointer.x * 1.4;
    targetRotation.current.set(targetX, targetY, 0);
    scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, targetRotation.current.x, 0.12);
    scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, targetRotation.current.y, 0.12);
    if (!hasLoggedVisibility.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const frustum = new THREE.Frustum();
      const projView = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(projView);

      hasLoggedVisibility.current = true;
    }
  });

  return <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />;
};

const Rig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outer.current && inner.current) {
      outer.current.position.y = THREE.MathUtils.lerp(outer.current.position.y, 0, 0.05);
      inner.current.position.z = 2 + -Math.sin(t / 3) * 4;
      inner.current.position.y = -2 + Math.sin(t / 2) * 1.2;
    }
  });

  return (
    <group position={[0, -100, 0]} ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
};

const CanvasDiagnostics: React.FC = () => {
  const { size } = useThree();

  useEffect(() => {

  }, [size.width, size.height]);

  return null;
};

const PirateScene: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    const containerStyle = containerRef.current
      ? window.getComputedStyle(containerRef.current)
      : null;

    if (containerRef.current) {
      requestAnimationFrame(() => {
        const rafRect = containerRef.current?.getBoundingClientRect();

      });
    }
  }, []);

  useEffect(() => {
    fetch(pirateModelUrl, { method: 'GET' })
      .then((res) => {

      })
      .catch((error) => {

      });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-white ${className || ''}`}
    >
      <Canvas
        linear
        camera={{ position: [0, 10, 20], fov: 65 }}
        onCreated={({ gl, size, camera }) => {

        }}
      >
        <color attach="background" args={[0xffffff]} />
        <fog attach="fog" args={[0xffffff, 10, 60]} />
        <ambientLight intensity={4} />
        <Suspense fallback={null}>
          <Rig>
            <PirateModel />
          </Rig>
        </Suspense>
        <CanvasDiagnostics />
        <Environment preset="sunset" />
        <OrbitControls enableZoom enablePan={false} />
      </Canvas>
    </div>
  );
};

useGLTF.preload(pirateModelUrl);

export default PirateScene;

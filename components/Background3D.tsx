import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import { Physics, useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";

const rfs = THREE.MathUtils.randFloatSpread;
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const baubleMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  roughness: 0,
  envMapIntensity: 1,
});

const SPHERE_COUNT = 40;

// Global mouse position tracker (normalized -1 to 1)
const mousePosition = { x: 0, y: 0 };

function Clump({
  mat = new THREE.Matrix4(),
  vec = new THREE.Vector3(),
}: {
  mat?: THREE.Matrix4;
  vec?: THREE.Vector3;
}) {
  const texture = useTexture("/cross.jpg");
  const physicsReadyRef = useRef(false);

  const [ref, api] = useSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(20), rfs(20), rfs(20)],
  }));

  // Wait for physics to initialize before applying forces
  useEffect(() => {
    const timer = setTimeout(() => {
      physicsReadyRef.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useFrame(() => {
    if (!ref.current || !physicsReadyRef.current) return;

    for (let i = 0; i < SPHERE_COUNT; i++) {
      ref.current.getMatrixAt(i, mat);
      api.at(i).applyForce(
        vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-40).toArray(),
        [0, 0, 0]
      );
    }
  });

  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[sphereGeometry, baubleMaterial, SPHERE_COUNT]}
      material-map={texture}
    />
  );
}

function Pointer() {
  const viewport = useThree((state) => state.viewport);
  const [ref, api] = useSphere<THREE.Mesh>(() => ({
    type: "Kinematic",
    args: [3],
    position: [0, 0, 0],
  }));

  useFrame(() => {
    api.position.set(
      (mousePosition.x * viewport.width) / 2,
      (mousePosition.y * viewport.height) / 2,
      0
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={1}
        angle={0.2}
        penumbra={1}
        position={[30, 30, 30]}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <Physics gravity={[0, 2, 0]} iterations={10}>
        <Pointer />
        <Clump />
      </Physics>
      <Environment files="/adamsbridge.hdr" />
    </>
  );
}

function CameraZoom({ isTransitioning }: { isTransitioning: boolean }) {
  const { camera } = useThree();
  const zoomProgress = useRef(0);

  useFrame((state, delta) => {
    if (isTransitioning && zoomProgress.current < 1) {
      zoomProgress.current += delta * 2; // Zoom speed
      const progress = Math.min(zoomProgress.current, 1);
      // Ease-in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      camera.position.z = 20 - (eased * 19); // Zoom from 20 to 1
      camera.updateProjectionMatrix();
    } else if (!isTransitioning && zoomProgress.current > 0) {
      zoomProgress.current = 0;
      camera.position.z = 20;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function Background3D({ isTransitioning = false }: { isTransitioning?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <Scene />
        <CameraZoom isTransitioning={isTransitioning} />
      </Canvas>
    </div>
  );
}

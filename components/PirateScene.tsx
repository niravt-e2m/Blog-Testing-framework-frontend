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
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H4',location:'PirateScene.tsx:14',message:'gltf_bounds',data:{size:{x:size.x,y:size.y,z:size.z},center:{x:center.x,y:center.y,z:center.z}},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 180;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H5',location:'PirateScene.tsx:22',message:'gltf_scale_applied',data:{maxDim,targetSize,scale,position:{x:scene.position.x,y:scene.position.y,z:scene.position.z}},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H8',location:'PirateScene.tsx:26',message:'scene_matrix_state',data:{needsUpdate:scene.matrixWorldNeedsUpdate,scale:{x:scene.scale.x,y:scene.scale.y,z:scene.scale.z},rotation:{x:scene.rotation.x,y:scene.rotation.y,z:scene.rotation.z}},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
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
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H9',location:'PirateScene.tsx:39',message:'model_frustum_check',data:{intersects:frustum.intersectsBox(box),boxMin:{x:box.min.x,y:box.min.y,z:box.min.z},boxMax:{x:box.max.x,y:box.max.y,z:box.max.z}},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      hasLoggedVisibility.current = true;
    }
  });
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H3',location:'PirateScene.tsx:10',message:'gltf_scene_ready',data:{children:scene?.children?.length || 0},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log
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
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H10',location:'PirateScene.tsx:75',message:'canvas_size_change',data:{width:size.width,height:size.height},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
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
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H1',location:'PirateScene.tsx:20',message:'container_rect',data:{width:rect?.width,height:rect?.height,background:containerStyle?.backgroundColor},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    if (containerRef.current) {
      requestAnimationFrame(() => {
        const rafRect = containerRef.current?.getBoundingClientRect();
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H6',location:'PirateScene.tsx:27',message:'container_rect_raf',data:{width:rafRect?.width,height:rafRect?.height},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
      });
    }
  }, []);

  useEffect(() => {
    fetch(pirateModelUrl, { method: 'GET' })
      .then((res) => {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'PirateScene.tsx:28',message:'model_fetch',data:{ok:res.ok,status:res.status,contentType:res.headers.get('content-type')},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
      })
      .catch((error) => {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'PirateScene.tsx:35',message:'model_fetch_error',data:{error:String(error)},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
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
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/e75ea0fa-bba9-4144-9a73-0a4737346593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H7',location:'PirateScene.tsx:44',message:'r3f_created',data:{width:size.width,height:size.height,pixelRatio:gl.getPixelRatio(),cameraZ:camera.position.z},timestamp:Date.now()})}).catch(()=>{});
          // #endregion agent log
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

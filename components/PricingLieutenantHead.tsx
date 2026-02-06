import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { MeshStandardMaterial, SRGBColorSpace } from 'three';

const LieutenantHeadModel: React.FC = () => {
  const { scene } = useGLTF('/lieutenantHead/lieutenantHead.gltf');
  const textures = useTexture({
    headDiffuse: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_head_diffuse.jpg',
    headNormal: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_head_normal.jpg',
    headAO: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_head_ao.jpg',
    bodyDiffuse: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_Body_diffuse.jpg',
    bodyNormal: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_body_normal.jpg',
    bodyAO: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_Body_ao.jpg',
    jacketDiffuse: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_jacket_diffuse.jpg',
    jacketNormal: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_jacket_normal.jpg',
    jacketAO: '/lieutenantHead/Assets/Models/PBR/lieutenantHead/Textures/Lieutenant_jacket_ao.jpg',
  });

  useEffect(() => {


    const texList = [
      textures.headDiffuse,
      textures.headNormal,
      textures.headAO,
      textures.bodyDiffuse,
      textures.bodyNormal,
      textures.bodyAO,
      textures.jacketDiffuse,
      textures.jacketNormal,
      textures.jacketAO,
    ];



    texList.forEach((tex) => {
      tex.flipY = false;
    });

    textures.headDiffuse.colorSpace = SRGBColorSpace;
    textures.bodyDiffuse.colorSpace = SRGBColorSpace;
    textures.jacketDiffuse.colorSpace = SRGBColorSpace;

    const applyMaterial = (mesh: any, material: MeshStandardMaterial) => {
      if (mesh.geometry?.attributes?.uv && !mesh.geometry.attributes.uv2) {
        mesh.geometry.setAttribute('uv2', mesh.geometry.attributes.uv);
      }
      mesh.material = material;
      mesh.material.needsUpdate = true;
    };

    const headMaterial = new MeshStandardMaterial({
      map: textures.headDiffuse,
      normalMap: textures.headNormal,
      aoMap: textures.headAO,
      roughness: 0.9,
      metalness: 0,
      aoMapIntensity: 1,
    });

    const bodyMaterial = new MeshStandardMaterial({
      map: textures.bodyDiffuse,
      normalMap: textures.bodyNormal,
      aoMap: textures.bodyAO,
      roughness: 0.9,
      metalness: 0,
      aoMapIntensity: 1,
    });

    const jacketMaterial = new MeshStandardMaterial({
      map: textures.jacketDiffuse,
      normalMap: textures.jacketNormal,
      aoMap: textures.jacketAO,
      roughness: 0.9,
      metalness: 0,
      aoMapIntensity: 1,
    });

    const meshInfo: any[] = [];
    const unmatchedMeshes: any[] = [];
    const appliedMaterials: any[] = [];

    scene.traverse((child) => {
      if ((child as any).isMesh) {
        const mesh = child as any;
        const name = (mesh.name || '').toLowerCase();
        const materialName = (mesh.material?.name || '').toLowerCase();
        const originalName = mesh.name || '';
        const origMatName = mesh.material?.name || '';

        meshInfo.push({ meshName: originalName, materialName: origMatName, lowerName: name, lowerMatName: materialName });

        // Match by material name (when loaded) OR by mesh name (fallback)
        // Head: includes head, eyes, soft (tubes/pipes), lens
        // Jacket: includes jacket
        // Body: includes body, bandages
        const isHead = materialName.includes('lieutenant_head') ||
          materialName.includes('lens') ||
          name.includes('head') ||
          name.includes('eyes') ||
          name.includes('soft') ||
          name.includes('lens');
        const isJacket = materialName.includes('lieutenant_jacket') ||
          name.includes('jacket');
        const isBody = materialName.includes('body') ||
          name.includes('body') ||
          name.includes('bandages');

        if (isHead) {
          applyMaterial(mesh, headMaterial);
          appliedMaterials.push({ mesh: originalName, applied: 'head' });
        } else if (isJacket) {
          applyMaterial(mesh, jacketMaterial);
          appliedMaterials.push({ mesh: originalName, applied: 'jacket' });
        } else if (isBody) {
          applyMaterial(mesh, bodyMaterial);
          appliedMaterials.push({ mesh: originalName, applied: 'body' });
        } else {
          // Fallback: apply head material to any unmatched mesh
          applyMaterial(mesh, headMaterial);
          unmatchedMeshes.push({ meshName: originalName, materialName: origMatName });
          appliedMaterials.push({ mesh: originalName, applied: 'head-fallback' });
        }
      }
    });






  }, [scene, textures]);

  return (
    <primitive object={scene} scale={1.6} position={[0, -1.2, 0]} rotation={[0, Math.PI, 0]} />
  );
};

const PricingLieutenantHead: React.FC = () => {
  return (
    <div className="w-full h-[420px] md:h-[520px]">
      <Canvas camera={{ position: [0, 0.4, 3.8], fov: 40 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1} />
        <directionalLight position={[-3, 2, 2]} intensity={0.5} />
        <LieutenantHeadModel />
        <Environment preset="city" />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
};

export default PricingLieutenantHead;

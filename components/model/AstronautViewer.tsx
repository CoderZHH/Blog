"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const gltf = useGLTF("/model/astronaut.glb");
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return <primitive object={scene} />;
}

useGLTF.preload("/model/astronaut.glb");

export function AstronautViewer() {
  return (
    <div className="h-full w-full overflow-hidden">
      <Canvas camera={{ position: [0, 0.16, 4.35], fov: 32 }} gl={{ alpha: true }}>
        <ambientLight intensity={2.2} />
        <directionalLight position={[4, 6, 8]} intensity={2.8} />
        <directionalLight position={[-4, -2, -6]} intensity={1.3} />
        <Suspense fallback={null}>
          <Center>
            <group position={[-0.12, -0.62, 0]} rotation={[0, Math.PI / 7.4, 0]} scale={1.18}>
              <Model />
            </group>
          </Center>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

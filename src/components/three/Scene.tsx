'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import { CameraController } from './CameraController';
import { ImagePlane } from './ImagePlane';
import { GalleryEnvironment } from './GalleryEnvironment';
import { WarpEffect } from './WarpEffect';
import { products } from '@/data/products';

function SceneContent() {
  return (
    <>

      <CameraController />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#FFF5E6"
      />

      <GalleryEnvironment />

      {products.map((product) => (
        <ImagePlane key={product.id} product={product} />
      ))}

      <WarpEffect />

      <Preload all />
    </>
  );
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
        style={{ touchAction: 'none' }}
        shadows
      >
        <color attach="background" args={['#FAFAFA']} />
        <fog attach="fog" args={['#FAFAFA', 12, 28]} />

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

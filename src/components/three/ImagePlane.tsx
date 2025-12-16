'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { Product } from '@/data/products';
import { useStore } from '@/store/useStore';

interface ImagePlaneProps {
  product: Product;
}

export function ImagePlane({ product }: ImagePlaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const { setCursorState, travelToProduct, travelState, focusedProduct } = useStore();

  const texture = useTexture(product.image);

  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  const isFocused = focusedProduct?.id === product.id;

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    if (travelState === 'idle') {
      const time = state.clock.elapsedTime;
      groupRef.current.position.y =
        product.position[1] + Math.sin(time * 0.5 + product.position[2]) * 0.05;
    }

    const scale = hovered ? 1.05 : 1;
    targetScale.set(scale, scale, scale);
    meshRef.current.scale.lerp(targetScale, 0.1);

    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

    if (meshRef.current) {
      meshRef.current.rotation.x = currentRotation.current.x;
      meshRef.current.rotation.y = currentRotation.current.y;
    }

    if (frameRef.current) {
      frameRef.current.rotation.x = currentRotation.current.x * 0.5;
      frameRef.current.rotation.y = currentRotation.current.y * 0.5;
    }

    if (glowRef.current && (hovered || isFocused)) {
      const pulse = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  const handlePointerOver = () => {
    if (travelState === 'traveling') return;
    setHovered(true);
    setCursorState('hover', 'VIEW');
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    setCursorState('default');
    document.body.style.cursor = 'none';

    targetRotation.current.x = 0;
    targetRotation.current.y = 0;
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!hovered || travelState === 'traveling') return;

    const uv = e.uv;
    if (!uv) return;

    const tiltX = (uv.y - 0.5) * 0.15;
    const tiltY = (uv.x - 0.5) * -0.15;

    targetRotation.current.x = tiltX;
    targetRotation.current.y = tiltY;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (travelState === 'traveling') return;

    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: 0.95,
        y: 0.95,
        z: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }

    travelToProduct(product);
  };

  return (
    <group ref={groupRef} position={product.position} rotation={product.rotation}>
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        <boxGeometry args={[2.5, 3, 0.3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {(hovered || isFocused) && (
        <mesh ref={glowRef} position={[0, 0, -0.08]}>
          <planeGeometry args={[2.8, 3.3]} />
          <meshBasicMaterial color="#C9A66B" transparent opacity={0.15} />
        </mesh>
      )}

      <mesh ref={frameRef} position={[0, 0, -0.05]}>
        <boxGeometry args={[2.3, 2.8, 0.1]} />
        <meshStandardMaterial
          color={hovered ? '#2A2A2A' : '#1A1A1A'}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.1, 2.6]} />
        <meshStandardMaterial color="#FAFAFA" />
      </mesh>

      <mesh ref={meshRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[1.8, 2.3]} />
        <meshStandardMaterial
          map={texture}
          transparent
          toneMapped={false}
          emissive={hovered ? '#C9A66B' : '#000000'}
          emissiveIntensity={hovered ? 0.05 : 0}
        />
      </mesh>

      {hovered && (
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[2.35, 2.85]} />
          <meshBasicMaterial color="#C9A66B" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

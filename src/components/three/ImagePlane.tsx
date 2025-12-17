'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { Product } from '@/data/products';
import { useStore } from '@/store/useStore';

interface ImagePlaneProps {
  product: Product;
}

// 제품별 스타일리시 텍스처 생성
function useProductTexture(product: Product): THREE.Texture {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 배경 그라데이션
      const bgGradient = ctx.createLinearGradient(0, 0, 512, 768);
      bgGradient.addColorStop(0, '#1a1a2e');
      bgGradient.addColorStop(1, '#0f0f1a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 512, 768);

      // 카테고리별 색상 설정
      const categoryColors: Record<string, { primary: string; accent: string }> = {
        tops: { primary: '#f5f5f5', accent: '#c9a66b' },
        bottoms: { primary: '#2c3e50', accent: '#3498db' },
        outerwear: { primary: '#34495e', accent: '#e74c3c' },
      };
      const colors = categoryColors[product.category] || categoryColors.tops;

      // 의류 실루엣 그리기
      ctx.fillStyle = colors.primary;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;

      if (product.category === 'tops') {
        // 셔츠/상의 모양
        ctx.beginPath();
        ctx.moveTo(156, 180);
        ctx.lineTo(206, 130); // 왼쪽 어깨
        ctx.lineTo(256, 150); // 목
        ctx.lineTo(306, 130); // 오른쪽 어깨
        ctx.lineTo(356, 180);
        ctx.lineTo(356, 520);
        ctx.lineTo(156, 520);
        ctx.closePath();
        ctx.fill();

        // 칼라
        ctx.fillStyle = '#e8e8e8';
        ctx.beginPath();
        ctx.moveTo(206, 130);
        ctx.lineTo(256, 160);
        ctx.lineTo(306, 130);
        ctx.lineTo(256, 110);
        ctx.closePath();
        ctx.fill();

        // 버튼 라인
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(256, 170);
        ctx.lineTo(256, 500);
        ctx.stroke();
      } else if (product.category === 'bottoms') {
        // 바지 모양
        ctx.beginPath();
        ctx.moveTo(156, 150);
        ctx.lineTo(356, 150);
        ctx.lineTo(356, 200);
        ctx.lineTo(306, 560);
        ctx.lineTo(266, 560);
        ctx.lineTo(256, 350);
        ctx.lineTo(246, 560);
        ctx.lineTo(206, 560);
        ctx.lineTo(156, 200);
        ctx.closePath();
        ctx.fill();

        // 벨트 라인
        ctx.fillStyle = colors.accent;
        ctx.fillRect(156, 150, 200, 15);
      } else {
        // 아우터/코트 모양
        ctx.beginPath();
        ctx.moveTo(126, 180);
        ctx.lineTo(186, 120);
        ctx.lineTo(256, 140);
        ctx.lineTo(326, 120);
        ctx.lineTo(386, 180);
        ctx.lineTo(386, 560);
        ctx.lineTo(126, 560);
        ctx.closePath();
        ctx.fill();

        // 라펠
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(186, 120);
        ctx.lineTo(256, 200);
        ctx.lineTo(256, 140);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(326, 120);
        ctx.lineTo(256, 200);
        ctx.lineTo(256, 140);
        ctx.closePath();
        ctx.fill();

        // 단추
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(230, 350, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(230, 420, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 악센트 라인
      ctx.shadowBlur = 0;
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, 620);
      ctx.lineTo(412, 620);
      ctx.stroke();

      // 제품명
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 28px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(product.name.toUpperCase(), 256, 670);

      // 카테고리
      ctx.fillStyle = colors.accent;
      ctx.font = '300 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(product.category.toUpperCase(), 256, 700);

      // 가격
      if (product.price) {
        ctx.fillStyle = '#888';
        ctx.font = '400 20px system-ui, -apple-system, sans-serif';
        ctx.fillText(product.price, 256, 730);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
    }

    return () => {
      texture?.dispose();
    };
  }, [product.id, product.name, product.category, product.price]);

  // 기본 텍스처 반환 (로딩 중)
  return texture || new THREE.Texture();
}

export function ImagePlane({ product }: ImagePlaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const { setCursorState, travelToProduct, travelState, focusedProduct } = useStore();

  const texture = useProductTexture(product);

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

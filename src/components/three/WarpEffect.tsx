'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

const PARTICLE_COUNT = 150;
const TRAIL_COUNT = 80;

function createParticleData() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 6;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

    velocities[i * 3] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i * 3 + 2] = -0.8 - Math.random() * 1.5;

    sizes[i] = 0.02 + Math.random() * 0.04;
  }

  return { positions, velocities, sizes };
}

function createTrailData() {
  const positions = new Float32Array(TRAIL_COUNT * 3);
  const sizes = new Float32Array(TRAIL_COUNT);

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.5 + Math.random() * 2;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
    positions[i * 3 + 2] = Math.random() * 20 - 10;

    sizes[i] = 0.01 + Math.random() * 0.02;
  }

  return { positions, sizes };
}

const mainParticleData = createParticleData();
const trailParticleData = createTrailData();

const mainGeometry = new THREE.BufferGeometry();
mainGeometry.setAttribute('position', new THREE.BufferAttribute(mainParticleData.positions.slice(), 3));
mainGeometry.setAttribute('size', new THREE.BufferAttribute(mainParticleData.sizes, 1));

const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailParticleData.positions.slice(), 3));
trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailParticleData.sizes, 1));

export function WarpEffect() {
  const mainPointsRef = useRef<THREE.Points>(null);
  const trailPointsRef = useRef<THREE.Points>(null);
  const { isWarping, travelState } = useStore();
  const { camera } = useThree();

  const fadeRef = useRef(0);

  useFrame((state, delta) => {
    if (travelState === 'traveling') {
      fadeRef.current = Math.min(fadeRef.current + delta * 3, 1);
    } else {
      fadeRef.current = Math.max(fadeRef.current - delta * 2, 0);
    }

    if (fadeRef.current <= 0) return;

    if (mainPointsRef.current && isWarping) {
      const posAttr = mainPointsRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArray[i * 3] += mainParticleData.velocities[i * 3] * delta * 20;
        posArray[i * 3 + 1] += mainParticleData.velocities[i * 3 + 1] * delta * 20;
        posArray[i * 3 + 2] += mainParticleData.velocities[i * 3 + 2] * delta * 40;

        if (posArray[i * 3 + 2] < camera.position.z - 15) {
          posArray[i * 3 + 2] = camera.position.z + 15;
          const angle = Math.random() * Math.PI * 2;
          const radius = 1.5 + Math.random() * 6;
          posArray[i * 3] = Math.cos(angle) * radius;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 5;
        }
      }

      posAttr.needsUpdate = true;

      mainPointsRef.current.position.z = camera.position.z;
    }

    if (trailPointsRef.current && isWarping) {
      const posAttr = trailPointsRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < TRAIL_COUNT; i++) {
        posArray[i * 3 + 2] -= delta * 60;

        if (posArray[i * 3 + 2] < -10) {
          posArray[i * 3 + 2] = 10;
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.5 + Math.random() * 2;
          posArray[i * 3] = Math.cos(angle) * radius;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 3;
        }
      }

      posAttr.needsUpdate = true;

      trailPointsRef.current.position.z = camera.position.z;
    }

    if (mainPointsRef.current) {
      (mainPointsRef.current.material as THREE.PointsMaterial).opacity = fadeRef.current * 0.7;
    }
    if (trailPointsRef.current) {
      (trailPointsRef.current.material as THREE.PointsMaterial).opacity = fadeRef.current * 0.5;
    }
  });

  const shouldRender = travelState === 'traveling' || fadeRef.current > 0;

  if (!shouldRender) return null;

  return (
    <group>
      <points ref={mainPointsRef} geometry={mainGeometry}>
        <pointsMaterial
          size={0.06}
          color="#C9A66B"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={trailPointsRef} geometry={trailGeometry}>
        <pointsMaterial
          size={0.03}
          color="#FFFFFF"
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

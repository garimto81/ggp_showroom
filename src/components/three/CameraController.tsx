'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import { gsap } from 'gsap';
import * as THREE from 'three';

export function CameraController() {
  const { camera } = useThree();
  const { cameraTarget, setTravelState, setIsWarping } = useStore();

  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);
  const prevTarget = useRef(cameraTarget);

  useEffect(() => {
    if (
      prevTarget.current.position[0] === cameraTarget.position[0] &&
      prevTarget.current.position[1] === cameraTarget.position[1] &&
      prevTarget.current.position[2] === cameraTarget.position[2]
    ) {
      return;
    }

    prevTarget.current = cameraTarget;

    const tl = gsap.timeline({
      onComplete: () => {
        setTravelState('arrived');
        setIsWarping(false);
      },
    });

    tl.to(
      camera.position,
      {
        x: cameraTarget.position[0],
        y: cameraTarget.position[1],
        z: cameraTarget.position[2],
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => {
          lookAtTarget.lerp(
            new THREE.Vector3(
              cameraTarget.lookAt[0],
              cameraTarget.lookAt[1],
              cameraTarget.lookAt[2]
            ),
            0.08
          );
          camera.lookAt(lookAtTarget);
        },
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [camera, cameraTarget, lookAtTarget, setTravelState, setIsWarping]);

  useEffect(() => {
    camera.position.set(...cameraTarget.position);
    lookAtTarget.set(...cameraTarget.lookAt);
    camera.lookAt(lookAtTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

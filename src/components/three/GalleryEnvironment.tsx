'use client';

export function GalleryEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[12, 24]} />
        <meshStandardMaterial color="#E8E8E8" />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, -4]}>
        <planeGeometry args={[12, 24]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      <mesh position={[-6, 2, -4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[24, 4]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>

      <mesh position={[6, 2, -4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[24, 4]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>

      <mesh position={[0, 2, -16]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#F0F0F0" />
      </mesh>

      <mesh position={[-3, 3.8, 0]}>
        <boxGeometry args={[0.1, 0.1, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <mesh position={[3, 3.8, 0]}>
        <boxGeometry args={[0.1, 0.1, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {[-4, 0, 4].map((z, i) => (
        <group key={`light-group-${i}`}>
          <spotLight
            position={[-3, 3.5, z]}
            angle={0.4}
            penumbra={0.5}
            intensity={0.8}
            color="#FFF5E6"
          />
          <spotLight
            position={[3, 3.5, z]}
            angle={0.4}
            penumbra={0.5}
            intensity={0.8}
            color="#FFF5E6"
          />
        </group>
      ))}
    </group>
  );
}

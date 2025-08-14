import React from 'react';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Ground } from './Ground';
import { ROOM_SIZE, WALL_HEIGHT } from '../constants';


export const Scene: React.FC = () => {

  const wallConfigs = [
    { position: [0, WALL_HEIGHT / 2, -ROOM_SIZE / 2], rotation: [0, 0, 0] }, // Back
    { position: [0, WALL_HEIGHT / 2, ROOM_SIZE / 2], rotation: [0, Math.PI, 0] }, // Front
    { position: [-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0], rotation: [0, Math.PI / 2, 0] }, // Left
    { position: [ROOM_SIZE / 2, WALL_HEIGHT / 2, 0], rotation: [0, -Math.PI / 2, 0] }, // Right
  ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, WALL_HEIGHT * 0.8, 5]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Ground />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid
        position={[0, WALL_HEIGHT - 0.01, 0]}
        args={[ROOM_SIZE, ROOM_SIZE]}
        infiniteGrid={false}
        fadeDistance={12}
        sectionColor={"#c9c9c9"}
        cellColor={"#d9d9d9"}
      />

      {/* Walls */}
      {wallConfigs.map((config, index) => (
         <mesh key={index} position={config.position as any} rotation={config.rotation as any} receiveShadow>
            <planeGeometry args={[ROOM_SIZE, WALL_HEIGHT]} />
            <meshStandardMaterial color="#ffffff" side={THREE.BackSide} />
         </mesh>
      ))}
    </>
  );
};

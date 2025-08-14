import React, { useEffect, useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayerControls } from '../hooks/useKeyboardControls';
import { PLAYER_SPEED, PLAYER_HEIGHT, ROOM_SIZE } from '../constants';
import { GameState } from '../types';

interface PlayerProps {
  gameState: GameState;
  isLocked: boolean;
  onPointerLockChange: (isLocked: boolean) => void;
}

export const Player: React.FC<PlayerProps> = ({ gameState, isLocked, onPointerLockChange }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const controls = usePlayerControls();
  const velocity = useRef(new THREE.Vector3());
  const moveDirection = new THREE.Vector3();

  useEffect(() => {
    // Programmatically unlock when a page is open or at the start screen
    if ((gameState === GameState.PAGE_VIEW || gameState === GameState.START) && isLocked) {
      controlsRef.current?.unlock();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Use 'T' to toggle mouse look
      if (e.key.toLowerCase() === 't' && (gameState === GameState.EXPLORING || gameState === GameState.MENU)) {
        if (isLocked) {
          controlsRef.current?.unlock();
        } else {
          controlsRef.current?.lock();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, isLocked]);

  const handleLock = useCallback(() => {
    onPointerLockChange(true);
  }, [onPointerLockChange]);

  const handleUnlock = useCallback(() => {
    onPointerLockChange(false);
  }, [onPointerLockChange]);

  useFrame((_, delta) => {
    const canMove = gameState === GameState.EXPLORING || gameState === GameState.MENU;

    if (!canMove) {
      velocity.current.set(0, 0, 0);
      return;
    }
    
    // Decceleration
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    moveDirection.z = Number(controls.forward) - Number(controls.backward);
    moveDirection.x = Number(controls.right) - Number(controls.left);
    moveDirection.normalize();

    if (controls.forward || controls.backward) {
      velocity.current.z -= moveDirection.z * PLAYER_SPEED * 10.0 * delta;
    }
    if (controls.left || controls.right) {
      velocity.current.x -= moveDirection.x * PLAYER_SPEED * 10.0 * delta;
    }
    
    if (controlsRef.current) {
        controlsRef.current.moveRight(-velocity.current.x * delta);
        controlsRef.current.moveForward(-velocity.current.z * delta);
        
        // Collision detection
        const halfRoomSize = ROOM_SIZE / 2;
        const playerPadding = 0.5; // Prevents camera from clipping into the wall

        camera.position.x = THREE.MathUtils.clamp(
            camera.position.x,
            -halfRoomSize + playerPadding,
            halfRoomSize - playerPadding
        );
        camera.position.z = THREE.MathUtils.clamp(
            camera.position.z,
            -halfRoomSize + playerPadding,
            halfRoomSize - playerPadding
        );
    }

    // Keep player at a fixed height
    camera.position.y = PLAYER_HEIGHT;
  });

  return <PointerLockControls ref={controlsRef} onLock={handleLock} onUnlock={handleUnlock} />;
};
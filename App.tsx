import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Player } from './components/Player';
import { RadialMenu } from './components/RadialMenu';
import { ImmersivePage } from './components/ImmersivePage';
import { VRController } from './components/VRController';
import { GameState, PageContent } from './types';
import { PAGES } from './constants';


export default function App(): React.ReactNode {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [activePage, setActivePage] = useState<PageContent | null>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [pageDistance, setPageDistance] = useState(4);
  const [isVRMode, setIsVRMode] = useState(false);

  const handleStart = useCallback(() => {
    setGameState(GameState.EXPLORING);
  }, []);

  const handleOpenMenu = useCallback(() => {
    if (gameState === GameState.EXPLORING) {
      setGameState(GameState.MENU);
    } else if (gameState === GameState.MENU) {
      setGameState(GameState.EXPLORING);
    }
  }, [gameState]);

  const handleSelectPage = useCallback((page: PageContent) => {
    setActivePage(page);
    setGameState(GameState.PAGE_VIEW);
  }, []);

  const handleClosePage = useCallback(() => {
    setActivePage(null);
    setGameState(GameState.EXPLORING);
  }, []);

  const handlePointerLockChange = useCallback((isLocked: boolean) => {
    setIsPointerLocked(isLocked);
  }, []);

  const handleVRSessionStart = useCallback(() => {
    setGameState(GameState.VR_MODE);
    setIsVRMode(true);
  }, []);

  const handleVRSessionEnd = useCallback(() => {
    setGameState(GameState.EXPLORING);
    setIsVRMode(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        handleOpenMenu();
      }
      if (e.key === 'Escape') {
        if (gameState === GameState.PAGE_VIEW) {
          handleClosePage();
        } else if (gameState === GameState.MENU) {
          setGameState(GameState.EXPLORING);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleClosePage, handleOpenMenu]);

  return (
    <div className="w-screen h-screen bg-black">
      {gameState === GameState.START && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
          <h1 className="text-5xl font-bold mb-4">Immersive Explorer</h1>
          <p className="text-lg mb-8">Use WASD to move. Press 'M' to open the menu. Click to begin.</p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Exploring
          </button>
        </div>
      )}

      {gameState === GameState.EXPLORING && !isPointerLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white pointer-events-none">
            <h2 className="text-4xl font-bold animate-pulse">Click or Press 'T' to Look</h2>
            <p className="text-lg mt-2">Use WASD to move, 'M' for menu, 'Esc' to release control</p>
        </div>
      )}

      <Canvas shadows camera={{ fov: 75, position: [0, 1.6, 5] }}>
          <Scene />
          {!isVRMode && (
            <Player 
              gameState={gameState}
              isLocked={isPointerLocked}
              onPointerLockChange={handlePointerLockChange}
            />
          )}
          <VRController 
            gameState={gameState}
            onVRSessionStart={handleVRSessionStart}
            onVRSessionEnd={handleVRSessionEnd}
          />
          {gameState === GameState.MENU && <RadialMenu onSelectPage={handleSelectPage} />}
          {gameState === GameState.PAGE_VIEW && activePage && (
            <ImmersivePage
              content={activePage}
              onClose={handleClosePage}
              pageDistance={pageDistance}
              setPageDistance={setPageDistance}
            />
          )}
      </Canvas>
    </div>
  );
}
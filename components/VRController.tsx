import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GameState } from '../types';

interface VRControllerProps {
  gameState: GameState;
  onVRSessionStart: () => void;
  onVRSessionEnd: () => void;
}

// Create a VR button that can be triggered with keyboard
export const VRController: React.FC<VRControllerProps> = ({ 
  gameState, 
  onVRSessionStart, 
  onVRSessionEnd 
}) => {
  const { camera } = useThree();
  const vrButtonRef = useRef<HTMLButtonElement | null>(null);
  const originalPosition = useRef<[number, number, number]>([0, 0, 0]);
  const sessionRef = useRef<XRSession | null>(null);
  
  // Create VR button and handle VR session
  useEffect(() => {
    // Store original position
    originalPosition.current = [camera.position.x, camera.position.y, camera.position.z];
    
    // Check if WebXR is supported
    if ('xr' in navigator) {
      // Create a custom VR button
      const vrButton = document.createElement('button');
      vrButton.textContent = 'Enter VR';
      vrButton.style.position = 'absolute';
      vrButton.style.bottom = '20px';
      vrButton.style.right = '20px';
      vrButton.style.padding = '12px 24px';
      vrButton.style.background = '#4F46E5';
      vrButton.style.color = 'white';
      vrButton.style.border = 'none';
      vrButton.style.borderRadius = '4px';
      vrButton.style.fontWeight = 'bold';
      vrButton.style.zIndex = '100';
      vrButton.style.cursor = 'pointer';
      
      // Handle VR session
      vrButton.addEventListener('click', async () => {
        try {
          if (!sessionRef.current) {
            // Request a new XR session
            const session = await (navigator as any).xr.requestSession('immersive-vr', {
              optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
            });
            
            sessionRef.current = session;
            vrButton.textContent = 'Exit VR';
            onVRSessionStart();
            
            // Handle session end
            session.addEventListener('end', () => {
              sessionRef.current = null;
              vrButton.textContent = 'Enter VR';
              onVRSessionEnd();
              
              // Restore camera position
              camera.position.set(
                originalPosition.current[0],
                originalPosition.current[1],
                originalPosition.current[2]
              );
            });
          } else {
            // End current session
            await sessionRef.current.end();
            sessionRef.current = null;
            vrButton.textContent = 'Enter VR';
          }
        } catch (error) {
          console.error('Error with XR session:', error);
          alert('VR not supported or not available. Make sure your Oculus Quest is connected properly.');
        }
      });
      
      document.body.appendChild(vrButton);
      vrButtonRef.current = vrButton;
    } else {
      // WebXR not supported
      const warningDiv = document.createElement('div');
      warningDiv.textContent = 'WebXR not supported in this browser';
      warningDiv.style.position = 'absolute';
      warningDiv.style.bottom = '20px';
      warningDiv.style.right = '20px';
      warningDiv.style.padding = '12px';
      warningDiv.style.background = '#EF4444';
      warningDiv.style.color = 'white';
      warningDiv.style.borderRadius = '4px';
      warningDiv.style.zIndex = '100';
      document.body.appendChild(warningDiv);
      
      vrButtonRef.current = warningDiv as any;
    }
    
    return () => {
      if (vrButtonRef.current) {
        document.body.removeChild(vrButtonRef.current);
      }
      
      if (sessionRef.current) {
        sessionRef.current.end().catch(console.error);
      }
    };
  }, [camera, onVRSessionStart, onVRSessionEnd]);
  
  // Handle key press to toggle VR (V key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'v' && vrButtonRef.current) {
        vrButtonRef.current.click();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // No 3D elements to render directly - we're just managing the VR session
  return null;
};

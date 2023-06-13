/* eslint-disable react/no-unknown-property */

import React, { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import useGame from '../stores/useGame';
import { GameStatus } from '../interfaces/GameStatus';

const Camera: React.FC = () => {
  const status = useGame((state) => state.status);
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (status === GameStatus.NotConnected) {
      cameraControlsRef.current?.setLookAt(-1, 2, 6, 0, 1, 0, true);
    }
    if (status === GameStatus.Ready) {
      cameraControlsRef.current?.setLookAt(1, 1, 5, 0, 0.5, 0, true);
    }
    if (status === GameStatus.Playing) {
      cameraControlsRef.current?.setLookAt(0, 9, -12, 0, -4, 15, true);
    }
    if (status === GameStatus.Ended) {
      cameraControlsRef.current?.setLookAt(0, 9, -12, 0, -4, 15, true);
    }
  }, [status]);

  return (
    <>
      <CameraControls ref={cameraControlsRef} />
    </>
  );
};

export default Camera;

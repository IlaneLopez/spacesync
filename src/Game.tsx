/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Ship from './components/Ship';
import {
  Environment,
  KeyboardControls,
  PerspectiveCamera,
} from '@react-three/drei';
import Ground from './components/Ground';
import Obstacles from './components/Obstacles';
import { Group } from 'three';
import Interface from './components/Interface';
import useGame from './stores/useGame';
import { GameStatus } from './interfaces/GameStatus';
import Camera from './components/Camera';
// import { Perf } from 'r3f-perf';

function Game() {
  const [ship, setShip] = useState<Group | null>(null);
  const status = useGame((state) => state.status);
  const lowFPS = useGame((state) => state.lowFPS);

  return (
    <>
      <Interface />
      <KeyboardControls
        map={[
          { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        ]}
      >
        <Canvas>
          {/* <Perf /> */}
          <Camera />
          <Environment preset="city" />
          {/* <Perf position="top-right" /> */}
          <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />
          <color args={[0, 0, 0]} attach="background" />
          <ambientLight intensity={0.2} />
          <directionalLight position={[-10, 0, -5]} intensity={1} color="red" />
          <directionalLight
            position={[-1, -2, -5]}
            intensity={0.2}
            color="#0c8cbf"
          />
          {!lowFPS && <Ground />}
          <Ship setShip={setShip} positionX={0} />
          {ship && status === GameStatus.Playing && <Obstacles ship={ship} />}
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default Game;

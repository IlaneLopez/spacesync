/* eslint-disable react/no-unknown-property */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  Float,
  SpotLight,
  useGLTF,
  useKeyboardControls,
} from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import {
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SpotLight as Light,
  Vector3,
} from 'three';
import { useFrame } from '@react-three/fiber';
import useGameControls from '../stores/useGameControls';
import useGame from '../stores/useGame';
import { GameStatus } from '../interfaces/GameStatus';

type GLTFResult = GLTF & {
  materials: {
    Mat0: MeshStandardMaterial;
    Mat1: MeshStandardMaterial;
    Mat2: MeshStandardMaterial;
    Window_Frame: MeshStandardMaterial;
    Mat4: MeshStandardMaterial;
    Window: MeshStandardMaterial;
  };
  nodes: {
    Cube005: Mesh;
    Cube005_2: Mesh;
    Cube005_1: Mesh;
    Cube005_3: Mesh;
    Cube005_4: Mesh;
    Cube005_6: Mesh;
  };
};

interface ShipProps {
  positionX: number;
  setShip: (ship: Group) => void;
}

const SMOOTHNESS = 7;
const TRANSLATION_SPEED_BASE = 3.5;
const X_POSITION_LIMITE = 7;
const Ship: React.FC<ShipProps> = (props) => {
  const { nodes, materials } = useGLTF('/models/spaceship.gltf') as GLTFResult;
  const ship = useRef<Group | null>(null);
  const light = useRef<Light | null>(null);
  const [updateState, setUpdateState] = useState<boolean>(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const forceUpdate = useCallback(() => setUpdateState(!updateState), []);
  const left = useGameControls((state) => state.left);
  const right = useGameControls((state) => state.right);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const status = useGame((state) => state.status);

  useLayoutEffect(() => {
    Object.values(materials).forEach((material) => {
      material.roughness = 0;
    });
    forceUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { leftward, rightward } = getKeys();
    if (ship?.current?.position) {
      if ((leftward || left) && ship.current.position.x < X_POSITION_LIMITE) {
        const currentPos = new Vector3();
        currentPos.copy(ship.current.position);
        currentPos.x += TRANSLATION_SPEED_BASE;
        ship.current.position.lerp(currentPos, SMOOTHNESS * delta);
      }
      // If the right arrow is pressed, move the ship to the right
      if (
        (rightward || right) &&
        ship.current.position.x > -X_POSITION_LIMITE
      ) {
        const currentPos = new Vector3();
        currentPos.copy(ship.current.position);
        currentPos.x -= TRANSLATION_SPEED_BASE;
        ship.current.position.lerp(currentPos, SMOOTHNESS * delta);
        forceUpdate();
      }
      /* ANTI CHEAT */
      if (ship.current.position.x > X_POSITION_LIMITE + 0.1) {
        ship.current.position.x = X_POSITION_LIMITE - 0.1;
      } else if (ship.current.position.x < -X_POSITION_LIMITE - 0.1) {
        ship.current.position.x = -X_POSITION_LIMITE + 0.1;
      }
      props.setShip(ship.current);
      if (status !== GameStatus.Playing) {
        if (ship.current.position.x > 0.3) {
          ship.current.position.x = ship.current.position.x - 0.001;
        } else if (ship.current.position.x < 0.3) {
          ship.current.position.x = ship.current.position.x + 0.001;
        }
      }
    }
  });

  return (
    <Float
      position={[props.positionX, 2, 0]}
      floatIntensity={2}
      rotationIntensity={0}
    >
      <group ref={ship}>
        <group name="lights">
          <SpotLight
            volumetric={false}
            target={ship.current as Object3D}
            color={'#ff40b3'}
            intensity={1.5}
            angle={0.6}
            distance={100}
            penumbra={0.5}
            position={[5, 5, 0]}
            castShadow
            shadow-bias={-0.0001}
            // opacity={0}
          />

          <SpotLight
            volumetric={false}
            target={ship.current as Object3D}
            castShadow
            ref={light}
            penumbra={0.5}
            distance={100}
            angle={0.6}
            // attenuation={5}
            position={[-5, 5, 0]}
            // anglePower={4}
            color={'#237fff'}
            intensity={2}
            // opacity={0}
            shadow-bias={-0.0001}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005.geometry}
          material={materials.Mat0}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005_1.geometry}
          material={materials.Mat1}
          material-color="black"
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005_2.geometry}
          material={materials.Mat2}
          material-envMapIntensity={0.2}
          material-color="black"
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005_3.geometry}
          material={materials.Window_Frame}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005_4.geometry}
          material={materials.Mat4}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube005_6.geometry}
          material={materials.Window}
        />
      </group>
    </Float>
  );
};

useGLTF.preload('/models/spaceship.gltf');

export default Ship;

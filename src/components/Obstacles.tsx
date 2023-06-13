/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box3, BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import useGame from '../stores/useGame';

const MAX_OBSTACLES_ROW = 10;
const FINAL_POSITION = -10;
const SPACE_BETWEEN_ROWS = 11;
const INITIAL_POSITION =
  FINAL_POSITION - SPACE_BETWEEN_ROWS + MAX_OBSTACLES_ROW * SPACE_BETWEEN_ROWS;

interface ObstaclesProps {
  ship: Group;
}

function detectCollision(obstacles: Group[], ship: Group): boolean {
  const shipBox = new Box3().setFromObject(ship);
  let collisionDetected = false;
  obstacles.forEach((row) => {
    row.children.forEach((obstacle) => {
      if (obstacle.visible === true) {
        const obstacleBox = new Box3().setFromObject(obstacle);
        if (obstacleBox.intersectsBox(shipBox)) {
          collisionDetected = true;
        }
      }
    });
  });

  return collisionDetected;
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function generateObstacleRow(): Group {
  const obstaclesRow: Group = new Group();
  const maxObstacles = 2;
  for (let i = -1; i < maxObstacles; i++) {
    const mesh = new Mesh();
    mesh.geometry = new BoxGeometry(4, 5, 1);
    mesh.material = new MeshStandardMaterial();
    mesh.position.x = i * 6;
    mesh.position.y = 0;
    // if (getRandomInt(1) === 1) {
    obstaclesRow.add(mesh);
    // }
  }
  obstaclesRow.position.z = 200;
  return obstaclesRow;
}

function randomizeRow(row: Group): Group {
  for (let i = 0; i < row.children.length; i++) {
    row.children[i].visible = true;
  }
  const firstChildrenHidden: number = getRandomInt(3);
  row.children[firstChildrenHidden].visible = false;
  let secondChildrenHidden: number = getRandomInt(6);
  while (secondChildrenHidden === firstChildrenHidden) {
    secondChildrenHidden = getRandomInt(row.children.length * 2);
  }
  if (
    Array.from(Array(row.children.length).keys()).includes(secondChildrenHidden)
  ) {
    row.children[secondChildrenHidden].visible = false;
  }

  return row;
}

const Obstacles: React.FC<ObstaclesProps> = (props) => {
  const obstaclesRef = useRef<Group[]>([]);
  const [updateState, setUpdateState] = useState<boolean>(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const forceUpdate = useCallback(() => setUpdateState(!updateState), []);
  const increase = useGame((state) => state.increase);
  const end = useGame((state) => state.end);
  const speed = useGame((state) => state.speed);
  const [canCollide, setCanCollide] = useState<boolean>(false);
  const [gameIsPaused, setGameIsPaused] = useState<boolean>(false);

  useEffect(() => {
    // when the user loses focus
    window.addEventListener('blur', () => {
      setGameIsPaused(true);
    });

    // when the user's focus is back to your tab (website) again
    window.addEventListener('focus', () => {
      setGameIsPaused(false);
    });
  });

  useFrame((state, delta) => {
    if (!obstaclesRef.current.length) {
      for (let i = 0; i < MAX_OBSTACLES_ROW; i++) {
        const newRow: Group = randomizeRow(generateObstacleRow());
        newRow.position.z =
          2 * SPACE_BETWEEN_ROWS + (i + 1) * SPACE_BETWEEN_ROWS;
        obstaclesRef.current.unshift(newRow);
      }
      forceUpdate();
    }

    for (let i = 0; i < obstaclesRef.current.length; i++) {
      if (!gameIsPaused) {
        obstaclesRef.current[i].position.z -= speed * delta;
        if (obstaclesRef.current[i].position.z < FINAL_POSITION) {
          obstaclesRef.current[i].position.z =
            INITIAL_POSITION + SPACE_BETWEEN_ROWS;
          randomizeRow(obstaclesRef.current[i]);
          increase(1);
        }
      }
    }

    if (canCollide && detectCollision(obstaclesRef.current, props.ship)) {
      end();
    }

    if (
      !canCollide &&
      obstaclesRef.current.length > 0 &&
      obstaclesRef.current[0].position.z < 115
    ) {
      setCanCollide(true);
    }
  });

  return (
    <group>
      {obstaclesRef.current.map((row, i) => (
        <primitive key={i} object={row}></primitive>
      ))}
    </group>
  );
};

export default Obstacles;

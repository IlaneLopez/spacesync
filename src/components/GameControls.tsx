import React from 'react';
import useGameControls from '../stores/useGameControls';

const GameControls: React.FC = () => {
  const moveToLeft = useGameControls((state) => state.moveToLeft);
  const moveToRight = useGameControls((state) => state.moveToRight);
  const stopMoveToLeft = useGameControls((state) => state.stopMoveToLeft);
  const stopMoveToRight = useGameControls((state) => state.stopMoveToRight);
  const left = useGameControls((state) => state.left);
  const right = useGameControls((state) => state.right);

  return (
    <div className="arrows-controls">
      <button
        onTouchStart={moveToLeft}
        onTouchEnd={stopMoveToLeft}
        className={`control ${left ? 'touched' : ''}`}
      >
        {'<'}
      </button>
      <button
        onTouchStart={moveToRight}
        onTouchEnd={stopMoveToRight}
        className={`control ${right ? 'touched' : ''}`}
      >
        {'>'}
      </button>
    </div>
  );
};

export default GameControls;

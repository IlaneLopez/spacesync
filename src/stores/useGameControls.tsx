import { create } from 'zustand';
import { GameStatus } from '../interfaces/GameStatus';
import { Player } from '../interfaces/Player';

interface GameControlsState {
  left: boolean;
  right: boolean;
  moveToLeft: () => void;
  stopMoveToLeft: () => void;
  moveToRight: () => void;
  stopMoveToRight: () => void;
}

const useGameControls = create<GameControlsState>((set) => {
  return {
    left: false,
    right: false,

    stopMoveToLeft: () => {
      set(() => {
        return { left: false };
      });
    },
    stopMoveToRight: () => {
      set(() => {
        return { right: false };
      });
    },
    moveToLeft: () => {
      set(() => {
        return { left: true, right: false };
      });
    },
    moveToRight: () => {
      set(() => {
        return { left: false, right: true };
      });
    },
  };
});

export default useGameControls;

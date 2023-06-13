import { create } from 'zustand';
import { GameStatus } from '../interfaces/GameStatus';
import { Player } from '../interfaces/Player';

const BASE_SPEED = 5;

interface GameState {
  leaderboard: Player[];
  pot: number;
  status: GameStatus;
  speed: number;
  increase: (by: number) => void;
  start: () => void;
  restart: () => void;
  end: () => void;
  connect: () => void;
  disconnect: () => void;
  setIsScoreSubmited: (isSubmited: boolean) => void;
  setUserBestScore: (newBestScore: number) => void;
  isScoreSubmited: boolean;
  score: number;
  userBestScore: number;
  setLeaderboard: (leaderboard: Player[]) => void;
  setLowFPSMode: (lowFPS: boolean) => void;
  lowFPS: boolean;
  setPot: (pot: number) => void;
  home: () => void;
}

const useGame = create<GameState>((set) => {
  return {
    lowFPS: false,
    leaderboard: [],
    pot: 0,
    status: GameStatus.NotConnected,
    score: 0,
    speed: BASE_SPEED,
    userBestScore: 0,
    isScoreSubmited: false,
    setIsScoreSubmited: (isSubmited: boolean) => {
      set(() => {
        return { isScoreSubmited: isSubmited };
      });
    },
    setLowFPSMode: (lowFPS: boolean) => {
      set(() => {
        return { lowFPS };
      });
    },

    setLeaderboard: (leaderboard: Player[]) => {
      set(() => {
        return { leaderboard };
      });
    },
    setUserBestScore: (newBestScore: number) => {
      set(() => {
        return { userBestScore: newBestScore };
      });
    },
    setPot: (newPot: number) => {
      set(() => {
        return { pot: newPot };
      });
    },
    increase: (by: number) => {
      set((state) => {
        return { score: state.score + by, speed: state.speed + 0.1 };
      });
    },
    connect: () => {
      set((state) => {
        if (state.status === GameStatus.NotConnected) {
          return { status: GameStatus.Ready };
        }
        return {};
      });
    },

    home: () => {
      set((state) => {
        if (state.status === GameStatus.Ended) {
          return { status: GameStatus.Ready };
        }
        return {};
      });
    },
    disconnect: () => {
      set(() => {
        return { status: GameStatus.NotConnected, score: 0, speed: 1 };
      });
    },
    start: () => {
      set((state) => {
        if (state.status === GameStatus.Ready) {
          return {
            status: GameStatus.Playing,
            score: 0,
            speed: BASE_SPEED,
            isScoreSubmited: false,
          };
        }
        return {};
      });
    },
    end: () => {
      set((state) => {
        if (state.status === GameStatus.Playing) {
          return { status: GameStatus.Ended, speed: BASE_SPEED };
        }
        return {};
      });
    },
    restart: () => {
      set((state) => {
        if (state.status === GameStatus.Ended) {
          return {
            status: GameStatus.Playing,
            score: 0,
            speed: BASE_SPEED,
            isScoreSubmited: false,
          };
        }
        return {};
      });
    },
  };
});

export default useGame;

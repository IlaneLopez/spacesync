import { ResponseContract } from './ResponseContract';

export interface ResponsePodium extends ResponseContract {
  data: {
    scores: number[];
    addresses: string[];
    reward: number;
  };
}

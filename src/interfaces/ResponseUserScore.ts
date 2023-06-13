import { ResponseContract } from './ResponseContract';

export interface ResponseUserScore extends ResponseContract {
  data: number;
  refetch: () => Promise<any>;
}

export type {
  AlgorithmDto,
  AlgorithmCreateDto,
  AlgorithmUpdateDto,
} from 'backend';

export interface PageResult<T> {
  list: T[];
  total: number;
}

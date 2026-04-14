import type {
  AlgorithmCreateDto,
  AlgorithmDto,
  AlgorithmUpdateDto,
  PageResult,
} from './types';

export const algorithmApi = {
  getById: (id: number) => window.ipcRenderer.invoke('algorithmGetById', id) as Promise<AlgorithmDto | null>,
  getAll: () => window.ipcRenderer.invoke('algorithmGetAll') as Promise<AlgorithmDto[]>,
  getPage: (page: number, pageSize: number, keyword?: string) =>
    window.ipcRenderer.invoke('algorithmGetPage', page, pageSize, keyword) as Promise<PageResult<AlgorithmDto>>,
  create: (dto: AlgorithmCreateDto) => window.ipcRenderer.invoke('algorithmCreate', dto) as Promise<AlgorithmDto>,
  update: (dto: AlgorithmUpdateDto) => window.ipcRenderer.invoke('algorithmUpdate', dto) as Promise<AlgorithmDto>,
  delete: (id: number) => window.ipcRenderer.invoke('algorithmDelete', id) as Promise<boolean>,
};

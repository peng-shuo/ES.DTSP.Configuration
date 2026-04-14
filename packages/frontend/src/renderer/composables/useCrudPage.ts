import { ref } from 'vue';

type PageResult<T> = {
  list: T[];
  total: number;
};

export const useCrudPage = <T>(
  fetcher: (args: { page: number; pageSize: number; keyword: string }) => Promise<PageResult<T>>,
  options?: { onError?: (error: unknown) => void },
) => {
  const tableData = ref<T[]>([]);
  const loading = ref(false);
  const keyword = ref('');
  const page = ref(1);
  const pageSize = ref(10);
  const itemCount = ref(0);

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await fetcher({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
      });
      tableData.value = res.list;
      itemCount.value = res.total;
    } catch (error) {
      tableData.value = [];
      itemCount.value = 0;
      options?.onError?.(error);
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = async () => {
    page.value = 1;
    await fetchData();
  };

  const handleReset = async () => {
    keyword.value = '';
    page.value = 1;
    await fetchData();
  };

  const handlePageChange = async (nextPage: number) => {
    page.value = nextPage;
    await fetchData();
  };

  const handlePageSizeChange = async (nextPageSize: number) => {
    page.value = 1;
    pageSize.value = nextPageSize;
    await fetchData();
  };

  const handleDeleteAndRefresh = async (deleter: () => Promise<unknown>) => {
    await deleter();
    if (tableData.value.length === 1 && page.value > 1) {
      page.value -= 1;
    }
    await fetchData();
  };

  return {
    tableData,
    loading,
    keyword,
    page,
    pageSize,
    itemCount,
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteAndRefresh,
  };
};

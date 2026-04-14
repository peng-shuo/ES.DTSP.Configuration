import { ref } from 'vue';

export const useCrudDialogs = <T>() => {
  const showAddDialog = ref(false);
  const showDetailDialog = ref(false);
  const currentEditRow = ref<T | null>(null);
  const currentDetailId = ref<number | null>(null);

  const openCreate = () => {
    currentEditRow.value = null;
    showAddDialog.value = true;
  };

  const openEdit = (row: T) => {
    currentEditRow.value = { ...row };
    showAddDialog.value = true;
  };

  const openDetail = (id?: number | null) => {
    currentDetailId.value = id ?? null;
    showDetailDialog.value = true;
  };

  return {
    showAddDialog,
    showDetailDialog,
    currentEditRow,
    currentDetailId,
    openCreate,
    openEdit,
    openDetail,
  };
};

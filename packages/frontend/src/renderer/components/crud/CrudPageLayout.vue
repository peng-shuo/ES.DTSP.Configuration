<script setup lang="ts">
import { computed } from 'vue';
import type { DataTableColumns } from 'naive-ui';

const props = withDefaults(
  defineProps<{
    columns: DataTableColumns<any>;
    data: any[];
    loading?: boolean;
    page: number;
    pageSize: number;
    itemCount: number;
    rowKey?: string;
    scrollX?: number;
    showPagination?: boolean;
  }>(),
  {
    loading: false,
    rowKey: 'id',
    scrollX: 1000,
    showPagination: true,
  },
);

const emit = defineEmits<{
  'update:page': [page: number];
  'update:pageSize': [pageSize: number];
}>();

const rowKeyFn = computed(() => (row: any) => row?.[props.rowKey] ?? JSON.stringify(row));

const onPageChange = (page: number) => {
  emit('update:page', page);
};

const onPageSizeChange = (pageSize: number) => {
  emit('update:page', 1);
  emit('update:pageSize', pageSize);
};
</script>

<template>
  <div class="crud-layout">
    <div v-if="$slots.actions" class="crud-actions">
      <n-space>
        <slot name="actions" />
      </n-space>
    </div>

    <div v-if="$slots.query" class="crud-query">
      <slot name="query" />
    </div>

    <div class="crud-table">
      <n-data-table
        class="h-full"
        :columns="columns"
        :data="data"
        :loading="loading"
        :bordered="false"
        :scroll-x="scrollX"
        :row-key="rowKeyFn"
        flex-height
      />
    </div>

    <div v-if="showPagination" class="crud-pagination">
      <n-pagination
        :page="page"
        :page-size="pageSize"
        :item-count="itemCount"
        show-quick-jumper
        show-size-picker
        :page-sizes="[10, 20, 50, 100]"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      >
        <template #goto>跳至</template>
      </n-pagination>
    </div>

    <slot name="dialogs" />
  </div>
</template>

<style scoped>
.crud-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.crud-actions {
  margin-bottom: 12px;
}

.crud-query {
  margin-bottom: 12px;
}

.crud-table {
  flex: 1;
  min-height: 0;
}

.crud-pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>

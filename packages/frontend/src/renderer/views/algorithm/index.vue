<script setup lang="ts">
import { onMounted, h } from 'vue';
import { NButton, NSpace, useMessage } from 'naive-ui';
import type { AlgorithmDto } from '../../api/types';
import AddDialog from './addDialog.vue';
import DetailDialog from './detailDialog.vue';
import CrudPageLayout from '../../components/crud/CrudPageLayout.vue';
import CrudQueryBar from '../../components/crud/CrudQueryBar.vue';
import { useCrudPage } from '../../composables/useCrudPage';
import { useCrudDialogs } from '../../composables/useCrudDialogs';

import { getErrorMessage } from '../../utils/error';
import { algorithmApi } from '../../api';

const message = useMessage();

const {
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
} = useCrudPage<AlgorithmDto>(
  async ({ page, pageSize, keyword }) =>
    algorithmApi.getPage(page, pageSize, keyword || undefined),
  {
    onError: (e) => {
      message.error(getErrorMessage(e));
    },
  },
);

const {
  showAddDialog,
  showDetailDialog,
  currentEditRow,
  currentDetailId,
  openCreate,
  openEdit,
  openDetail,
} = useCrudDialogs<AlgorithmDto>();

const columns = [
  {
    title: '序号',
    key: 'seq',
    render(_row: AlgorithmDto, index: number) {
      return (page.value - 1) * pageSize.value + index + 1;
    },
  },
  { title: '名称', key: 'name' },
  { title: '标识', key: 'code' },
  { title: '排序', key: 'sort' },
  {
    title: '操作',
    key: 'actions',
    render(row: AlgorithmDto) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              { size: 'small', onClick: () => openDetail(row.id) },
              { default: () => '详情' },
            ),
            h(
              NButton,
              { size: 'small', onClick: () => openEdit(row) },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => deleteRecord(row.id!),
              },
              { default: () => '删除' },
            ),
          ],
        },
      );
    },
  },
];

const deleteRecord = async (id: number) => {
  try {
    await handleDeleteAndRefresh(() => algorithmApi.delete(id));
    message.success('删除成功');
  } catch (e: any) {
    message.error(`删除失败: ${getErrorMessage(e)}`);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <CrudPageLayout
    :columns="columns"
    :data="tableData"
    :loading="loading"
    :page="page"
    :page-size="pageSize"
    :item-count="itemCount"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  >
    <template #actions>
      <n-button type="info" @click="fetchData">刷新数据</n-button>
      <n-button type="primary" @click="openCreate">新增算法</n-button>
    </template>

    <template #query>
      <CrudQueryBar
        :keyword="keyword"
        placeholder="按名称/标识搜索"
        @update:keyword="(val) => (keyword = val)"
        @search="handleSearch"
        @reset="handleReset"
      />
    </template>

    <template #dialogs>
      <AddDialog
        v-model:show="showAddDialog"
        :edit-data="currentEditRow"
        @refresh="fetchData"
      />

      <DetailDialog
        v-model:show="showDetailDialog"
        :record-id="currentDetailId"
      />
    </template>
  </CrudPageLayout>
</template>

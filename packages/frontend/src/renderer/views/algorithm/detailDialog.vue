<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import type { AlgorithmDto } from '../../api/types';
import { getErrorMessage } from '../../utils/error';
import { algorithmApi } from '../../api';

const show = defineModel<boolean>('show', { required: true });

const props = defineProps<{
  recordId: number | null;
}>();

const message = useMessage();
const detailData = ref<AlgorithmDto | null>(null);
const loading = ref(false);

watch(
  () => show.value,
  async (val) => {
    if (val && props.recordId !== null) {
      loading.value = true;
      try {
        detailData.value = await algorithmApi.getById(props.recordId);
      } catch (e: any) {
        message.error(`获取详情失败: ${getErrorMessage(e)}`);
      } finally {
        loading.value = false;
      }
    } else {
      detailData.value = null;
    }
  },
);

const handleClose = () => {
  show.value = false;
};
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :style="{ width: '600px', minWidth: '600px', maxWidth: '600px' }"
    title="算法详情"
  >
    <n-spin :show="loading">
      <n-descriptions
        v-if="detailData"
        bordered
        :column="2"
        label-placement="left"
        class="mt-4"
      >
        <n-descriptions-item label="ID">
          {{ detailData.id }}
        </n-descriptions-item>
        <n-descriptions-item label="名称">
          {{ detailData.name }}
        </n-descriptions-item>
        <n-descriptions-item label="标识">
          {{ detailData.code }}
        </n-descriptions-item>
        <n-descriptions-item label="描述">
          {{ detailData.desc || '无' }}
        </n-descriptions-item>
        <n-descriptions-item label="排序">
          {{ detailData.sort }}
        </n-descriptions-item>
      </n-descriptions>
      <n-empty v-else description="暂无数据" class="mt-4" />
    </n-spin>
    <template #footer>
      <n-space justify="end">
        <n-button type="primary" @click="handleClose">关闭</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

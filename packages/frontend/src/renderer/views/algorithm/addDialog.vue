<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useMessage } from 'naive-ui';
import type {
  AlgorithmCreateDto,
  AlgorithmDto,
  AlgorithmUpdateDto,
} from '../../api/types';

const show = defineModel<boolean>('show', { required: true });

const props = defineProps<{
  editData: AlgorithmDto | null;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

import { getErrorMessage } from '../../utils/error';
import { algorithmApi } from '../../api';

const message = useMessage();

const formData = reactive<{
  id: number | null;
  name: string;
  code: string;
  desc: string;
  sort: number;
}>({
  id: null,
  name: '',
  code: '',
  desc: '',
  sort: 0,
});

watch(
  () => show.value,
  (val) => {
    if (val) {
      if (props.editData) {
        formData.id = props.editData.id ?? null;
        formData.name = props.editData.name;
        formData.code = props.editData.code;
        formData.desc = props.editData.desc ?? '';
        formData.sort = props.editData.sort;
      } else {
        formData.id = null;
        formData.name = '';
        formData.code = '';
        formData.desc = '';
        formData.sort = 0;
      }
    }
  },
);

const handleClose = () => {
  show.value = false;
};

const handleSave = async () => {
  try {
    if (formData.id !== null) {
      const payload: AlgorithmUpdateDto = {
        id: formData.id,
        name: formData.name,
        code: formData.code,
        desc: formData.desc || undefined,
        sort: formData.sort,
      };
      await algorithmApi.update(payload);
    } else {
      const payload: AlgorithmCreateDto = {
        name: formData.name,
        code: formData.code,
        desc: formData.desc || undefined,
        sort: formData.sort,
      };
      await algorithmApi.create(payload);
    }
    show.value = false;
    message.success('保存成功');
    emit('refresh');
  } catch (e: any) {
    message.error(getErrorMessage(e));
  }
};
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :style="{ width: '500px', minWidth: '500px', maxWidth: '500px' }"
    :title="formData.id !== null ? '编辑算法' : '新增算法'"
  >
    <n-form
      :model="formData"
      label-placement="left"
      label-width="80"
      class="mt-4"
    >
      <n-form-item label="名称">
        <n-input v-model:value="formData.name" placeholder="请输入名称" />
      </n-form-item>
      <n-form-item label="标识">
        <n-input v-model:value="formData.code" placeholder="请输入标识" />
      </n-form-item>
      <n-form-item label="描述">
        <n-input
          v-model:value="formData.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入描述"
        />
      </n-form-item>
      <n-form-item label="排序">
        <n-input-number v-model:value="formData.sort" class="w-full" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button @click="handleClose">取消</n-button>
        <n-button type="primary" @click="handleSave">保存</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

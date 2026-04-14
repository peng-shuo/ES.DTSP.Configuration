<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    keyword: string;
    placeholder?: string;
    width?: number;
  }>(),
  {
    placeholder: '请输入关键字',
    width: 260,
  },
);

const emit = defineEmits<{
  'update:keyword': [value: string];
  search: [];
  reset: [];
}>();

const handleKeywordChange = (value: string) => {
  emit('update:keyword', value);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search');
  }
};
</script>

<template>
  <n-space>
    <n-input
      :value="props.keyword"
      clearable
      :placeholder="props.placeholder"
      :style="{ width: `${props.width}px` }"
      @update:value="handleKeywordChange"
      @keydown="handleKeydown"
    />
    <n-button type="primary" @click="$emit('search')">搜索</n-button>
    <n-button @click="$emit('reset')">重置</n-button>
  </n-space>
</template>

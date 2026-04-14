<script setup lang="ts">
import { ref } from 'vue';
import type { DropdownOption } from 'naive-ui';
import { useRouter } from 'vue-router';
import {
  closeHistoryTab,
  closeHistoryTabsToRight,
  closeOtherHistoryTabs,
  historyActiveKey,
  historyTabs,
} from '../../stores/historyTabsStore';

const router = useRouter();
const showContextMenu = ref(false);
const contextX = ref(0);
const contextY = ref(0);
const currentContextKey = ref('');

const contextOptions: DropdownOption[] = [
  { label: '关闭其他标签', key: 'closeOthers' },
  { label: '关闭右侧标签', key: 'closeRight' },
];

const handleSelect = (key: string) => {
  const target = historyTabs.value.find((item) => item.key === key);
  if (!target) return;
  void router.push(target.path);
};

const handleClose = (key: string) => {
  const nextPath = closeHistoryTab(key);
  if (nextPath) {
    void router.push(nextPath);
  }
};

const openContextMenu = (event: MouseEvent, key: string) => {
  event.preventDefault();
  currentContextKey.value = key;
  contextX.value = event.clientX;
  contextY.value = event.clientY;
  showContextMenu.value = true;
};

const handleContextSelect = (action: string) => {
  const key = currentContextKey.value;
  if (!key) return;
  if (action === 'closeOthers') {
    closeOtherHistoryTabs(key);
    void router.push(key);
    return;
  }
  if (action === 'closeRight') {
    closeHistoryTabsToRight(key);
  }
};
</script>

<template>
  <div class="history-tabs-bar">
    <n-space :size="8" :wrap="false" class="history-tabs-scroll">
      <n-tag
        v-for="tab in historyTabs"
        :key="tab.key"
        :type="historyActiveKey === tab.key ? 'primary' : 'default'"
        :closable="tab.closable"
        class="history-tab"
        round
        @click="handleSelect(tab.key)"
        @close.stop="handleClose(tab.key)"
        @contextmenu="openContextMenu($event, tab.key)"
      >
        {{ tab.title }}
      </n-tag>
    </n-space>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :show="showContextMenu"
      :x="contextX"
      :y="contextY"
      :options="contextOptions"
      @clickoutside="showContextMenu = false"
      @select="
        (key: string) => {
          showContextMenu = false;
          handleContextSelect(String(key));
        }
      "
    />
  </div>
</template>

<style scoped>
.history-tabs-bar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.history-tabs-scroll {
  width: 100%;
  overflow-x: auto;
}

.history-tab {
  cursor: pointer;
  user-select: none;
}
</style>

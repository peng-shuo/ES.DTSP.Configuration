<script setup lang="ts">
import { computed, h, onMounted, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { NIcon, type MenuOption } from 'naive-ui';
import { GitNetworkOutline } from '@vicons/ionicons5';
import HistoryTabsBar from '../components/history/HistoryTabsBar.vue';
import {
  initHistoryTabs,
  syncHistoryTabByRoute,
} from '../stores/historyTabsStore';

const route = useRoute();
const router = useRouter();

const renderIcon = (icon: any) => () =>
  h(NIcon, null, { default: () => h(icon) });

const menuOptions = computed<MenuOption[]>(() => [
  {
    key: '/algorithm',
    icon: renderIcon(GitNetworkOutline),
    label: () =>
      h(RouterLink, { to: '/algorithm' }, { default: () => '算法管理' }),
  },
]);

const selectedKey = computed(() => {
  const hit = menuOptions.value.find((item) =>
    route.path.startsWith(String(item.key)),
  );
  return hit ? String(hit.key) : '/algorithm';
});

const pageTitle = computed(() => String(route.meta.title ?? '图元配置中心'));

const handleMenuSelect = (key: string) => {
  void router.push(key);
};

onMounted(async () => {
  const validPaths = new Set(router.getRoutes().map((item) => item.path));
  initHistoryTabs(validPaths);
  syncHistoryTabByRoute(route);
});

watch(
  () => route.fullPath,
  () => {
    syncHistoryTabByRoute(route);
  },
);
</script>

<template>
  <n-layout has-sider class="h-screen w-full">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
    >
      <div class="px-4 py-5 text-base font-semibold text-gray-800">
        图元配置中心
      </div>
      <n-menu
        :value="selectedKey"
        :options="menuOptions"
        @update:value="handleMenuSelect"
      />
    </n-layout-sider>
    <n-layout>
      <n-layout-header
        bordered
        class="h-14 px-6 flex items-center text-lg font-medium"
      >
        {{ pageTitle }}
      </n-layout-header>
      <HistoryTabsBar />
      <n-layout-content
        class="p-4 bg-gray-50 overflow-hidden"
        content-style="height: calc(100vh - 156px);"
      >
        <div class="h-full min-h-0">
          <RouterView v-slot="{ Component }">
            <transition name="route-fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </RouterView>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.route-fade-enter-active,
.route-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.route-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.route-fade-leave-to {
  opacity: 1;
  transform: translateY(-4px);
}
</style>

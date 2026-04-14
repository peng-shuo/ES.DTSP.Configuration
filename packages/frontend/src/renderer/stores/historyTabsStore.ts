import { computed, ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

type HistoryTab = {
  key: string;
  path: string;
  title: string;
  closable: boolean;
};

const STORAGE_KEY = 'graphic-manager-history-tabs';
const DEFAULT_TAB: HistoryTab = {
  key: '/algorithm',
  path: '/algorithm',
  title: '分类管理',
  closable: false,
};

/** 根路径重定向（如 / -> /algorithm），不应单独出现在标签栏 */
const isRedirectRootPath = (path: string) => path === '/' || path === '';

const tabs = ref<HistoryTab[]>([DEFAULT_TAB]);
const activeKey = ref(DEFAULT_TAB.key);
let initialized = false;

const normalizeTitle = (route: RouteLocationNormalizedLoaded) => {
  const metaTitle = route.meta?.title;
  if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle;
  if (typeof route.name === 'string' && route.name.trim()) return route.name;
  return route.path;
};

const persist = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      tabs: tabs.value,
      activeKey: activeKey.value,
    }),
  );
};

export const historyTabs = computed(() => tabs.value);
export const historyActiveKey = computed(() => activeKey.value);

export const initHistoryTabs = (validPaths: Set<string>) => {
  if (initialized) return;
  initialized = true;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    persist();
    return;
  }
  try {
    const parsed = JSON.parse(raw) as { tabs?: HistoryTab[]; activeKey?: string };
    const savedTabs = (parsed.tabs ?? []).filter(
      (tab) => validPaths.has(tab.path) && !isRedirectRootPath(tab.path),
    );
    const mergedTabs: HistoryTab[] = [DEFAULT_TAB];
    for (const tab of savedTabs) {
      if (tab.path === DEFAULT_TAB.path) continue;
      mergedTabs.push({
        key: tab.path,
        path: tab.path,
        title: tab.title || tab.path,
        closable: true,
      });
    }
    tabs.value = mergedTabs;
    let savedActive = typeof parsed.activeKey === 'string' ? parsed.activeKey : DEFAULT_TAB.key;
    if (isRedirectRootPath(savedActive)) {
      savedActive = DEFAULT_TAB.key;
    }
    activeKey.value = mergedTabs.some((t) => t.key === savedActive) ? savedActive : DEFAULT_TAB.key;
    persist();
  } catch {
    tabs.value = [DEFAULT_TAB];
    activeKey.value = DEFAULT_TAB.key;
    persist();
  }
};

export const syncHistoryTabByRoute = (route: RouteLocationNormalizedLoaded) => {
  tabs.value = tabs.value.filter((t) => !isRedirectRootPath(t.path));

  const key = isRedirectRootPath(route.path) ? DEFAULT_TAB.path : route.path;
  const title = isRedirectRootPath(route.path) ? DEFAULT_TAB.title : normalizeTitle(route);
  const index = tabs.value.findIndex((item) => item.key === key);
  if (index >= 0) {
    tabs.value[index] = { ...tabs.value[index], title };
  } else {
    tabs.value.push({
      key,
      path: key,
      title,
      closable: key !== DEFAULT_TAB.key,
    });
  }
  activeKey.value = key;
  persist();
};

export const activateHistoryTab = (key: string) => {
  activeKey.value = key;
  persist();
};

export const closeHistoryTab = (key: string) => {
  const index = tabs.value.findIndex((item) => item.key === key);
  if (index < 0) return activeKey.value;
  if (!tabs.value[index].closable) return activeKey.value;

  const wasActive = activeKey.value === key;
  tabs.value.splice(index, 1);

  if (!tabs.value.some((item) => item.key === DEFAULT_TAB.key)) {
    tabs.value.unshift(DEFAULT_TAB);
  }

  if (!wasActive) {
    persist();
    return activeKey.value;
  }

  const next = tabs.value[index - 1] ?? tabs.value[0] ?? DEFAULT_TAB;
  activeKey.value = next.key;
  persist();
  return next.path;
};

export const closeOtherHistoryTabs = (key: string) => {
  const current = tabs.value.find((item) => item.key === key);
  if (!current) return;
  tabs.value = [DEFAULT_TAB];
  if (current.key !== DEFAULT_TAB.key) {
    tabs.value.push({ ...current, closable: true });
  }
  activeKey.value = current.key;
  persist();
};

export const closeHistoryTabsToRight = (key: string) => {
  const index = tabs.value.findIndex((item) => item.key === key);
  if (index < 0) return;
  const kept = tabs.value.slice(0, index + 1);
  if (!kept.some((item) => item.key === DEFAULT_TAB.key)) {
    kept.unshift(DEFAULT_TAB);
  }
  tabs.value = kept;
  if (!tabs.value.some((item) => item.key === activeKey.value)) {
    activeKey.value = key;
  }
  persist();
};

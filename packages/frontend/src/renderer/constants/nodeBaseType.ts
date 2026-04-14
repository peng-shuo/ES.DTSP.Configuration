export type NodeBaseType = 'system' | 'custom';

export const NODE_BASE_TYPE_SELECT_OPTIONS: { label: string; value: NodeBaseType }[] = [
  { label: '自定义 (custom)', value: 'custom' },
  { label: '系统 (system)', value: 'system' },
];

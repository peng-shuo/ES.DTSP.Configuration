const ERROR_MESSAGE_MAP: Array<{ keyword: string; message: string }> = [
  { keyword: 'ALGORITHM_IN_USE', message: '算法已被图元使用，无法删除' },
  { keyword: 'Cannot delete system nodes', message: '系统图元不允许删除' },
  { keyword: 'Cannot delete special or default categories', message: '默认分类或特殊分类不允许删除' },
];

const CUSTOM_ERROR_MARKER = 'Custom Error: ';

/** 从 Electron IPC / N-API 嵌套错误里取出后端业务文案 */
function stripIpcAndNapiWrappers(message: string): string {
  const customIdx = message.lastIndexOf(CUSTOM_ERROR_MARKER);
  if (customIdx !== -1) {
    return message.slice(customIdx + CUSTOM_ERROR_MARKER.length).trim();
  }

  const invokeMatch = message.match(
    /^Error invoking remote method '[^']+':\s*(.*)$/s,
  );
  let rest = invokeMatch ? invokeMatch[1].trim() : message;

  while (/^Error:\s*/i.test(rest)) {
    rest = rest.replace(/^Error:\s*/i, '').trim();
  }

  return rest.replace(/^NapiError:\s*/i, '').trim();
}

export const getErrorMessage = (error: unknown, fallback = '操作失败，请稍后重试') => {
  const raw =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : String(error ?? '');

  const unwrapped = stripIpcAndNapiWrappers(raw);

  for (const item of ERROR_MESSAGE_MAP) {
    if (unwrapped.includes(item.keyword) || raw.includes(item.keyword)) {
      return item.message;
    }
  }

  const cleaned = unwrapped
    .replace(/^Error:\s*/i, '')
    .replace(/^NapiError:\s*/i, '')
    .trim();

  return cleaned || fallback;
};

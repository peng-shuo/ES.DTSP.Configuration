<template>
  <div class="h-full min-h-0 flex flex-col">
    <div v-if="$slots.actions" class="mb-4">
      <n-space>
        <slot name="actions" />
      </n-space>
    </div>

    <slot />

    <slot name="dialogs" />
  </div>
</template>

<script setup lang="ts">
import DefaultLayout from './layouts/defaultLayout.vue';
</script>

<template>
  <n-config-provider class="h-full w-full">
    <n-message-provider>
      <n-dialog-provider>
        <DefaultLayout />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

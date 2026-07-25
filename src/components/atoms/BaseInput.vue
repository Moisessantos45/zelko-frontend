<template>
  <input v-model="model" v-bind="$attrs" :class="inputClasses" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const model = defineModel<string | number | null | boolean>();
const attrs = useAttrs();

const inputClasses = computed(() => {
  if (attrs.type === 'checkbox') {
    return 'h-4 w-4 rounded border-(--color-border) text-(--color-primary) focus:ring-2 focus:ring-(--color-primary) transition-all duration-150 cursor-pointer accent-(--color-primary)';
  }
  return 'block w-full px-3 py-2 border border-(--color-border) rounded-lg text-sm text-(--color-ink) bg-(--color-surface) hover:border-(--color-ink-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary-subtle) focus:border-(--color-primary) placeholder:text-(--color-ink-muted) transition-all duration-150';
});
</script>

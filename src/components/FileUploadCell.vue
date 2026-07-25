<template>
  <label class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border cursor-pointer hover:bg-(--color-surface-alt) transition-colors" style="border-color: var(--color-border); color: var(--color-ink-secondary);">
    <Upload class="w-3 h-3" /> {{ label }}
    <input type="file" class="hidden" />
  </label>
</template>

<script setup lang="ts">
import { Upload } from 'lucide-vue-next';
defineProps<{ label: string }>();
</script>

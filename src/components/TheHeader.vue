<template>
  <div class="flex items-center justify-center py-6 px-4 border-b border-(--color-border) bg-(--color-surface)">
    <RouterLink to="/admin" class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-(--color-primary)">
        <FileText class="w-4 h-4 text-(--color-accent)" />
      </div>
      <span class="font-extrabold text-lg text-(--color-ink) tracking-tight">
        Zelko
      </span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
</script>

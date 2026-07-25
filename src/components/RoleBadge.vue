<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-(--color-surface-alt) text-(--color-ink-secondary) border border-(--color-border)">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ role: string }>();

const map: Record<string, string> = {
  admin: 'Admin',
  jefe: 'Jefe',
  empleado: 'Empleado',
};

const label = computed(() => map[props.role] ?? props.role);
</script>

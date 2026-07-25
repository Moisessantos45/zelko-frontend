<template>
  <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-ink-secondary)">
    <span class="w-1.5 h-1.5 rounded-full" :class="colorClass"></span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>();

const config: Record<string, { label: string; class: string }> = {
  en_proceso:  { label: 'En Proceso',  class: 'bg-blue-500' },
  revision:    { label: 'Revisión',    class: 'bg-amber-500' },
  completado:  { label: 'Completado',  class: 'bg-green-600' },
  cancelado:   { label: 'Cancelado',   class: 'bg-red-500' },
  rechazado:   { label: 'Rechazado',   class: 'bg-red-500' },
  aceptado:    { label: 'Aceptado',    class: 'bg-green-600' },
  aceptada:    { label: 'Aceptada',    class: 'bg-green-600' },
  no_pagado:   { label: 'No Pagado',   class: 'bg-red-500' },
  pagado:      { label: 'Pagado',      class: 'bg-green-600' },
};

const label = computed(() => config[props.status]?.label ?? props.status);
const colorClass = computed(() => config[props.status]?.class ?? 'bg-gray-400');
</script>

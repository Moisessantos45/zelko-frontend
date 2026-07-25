<template>
  <label :for="id" class="block text-xs font-semibold text-(--color-ink) mb-1.5">
    {{ label }}
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  id: string;
}
defineProps<Props>();
</script>

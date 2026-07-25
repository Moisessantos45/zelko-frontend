<template>
  <div v-if="displayMessage" class="px-4 py-3 rounded-lg text-sm font-medium border mb-4"
    :class="isError ? 'bg-(--color-danger-subtle) text-(--color-danger) border-(--color-danger)/20' : 'bg-(--color-success-subtle) text-(--color-success) border-(--color-success)/20'">
    {{ displayMessage }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  message?: string;
  msg?: string;
  type?: string;
  error?: boolean;
}>();

const displayMessage = computed(() => props.message || props.msg || '');
const isError = computed(() => props.type === 'error' || props.error === true);
</script>

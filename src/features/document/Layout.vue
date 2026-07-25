<template>
  <div class="flex flex-col h-screen bg-(--color-bg) font-sans overflow-hidden">
    <LoadingSpinner v-if="loading" />

    <template v-else-if="authenticated">
      <header class="flex items-center justify-between h-13 px-4 bg-(--color-surface) border-b border-(--color-border) gap-3 shrink-0 z-10">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text-sm font-bold text-(--color-ink) tracking-tight">Zelko</span>
          </div>
          <div class="w-px h-5 bg-(--color-border)" />
          <RouterLink :to="{ name: 'home' }" class="text-xs text-(--color-ink-secondary) hover:text-(--color-ink) transition-colors no-underline">
            Mis documentos
          </RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs text-(--color-ink-secondary)">{{ userData.firstName }}</span>
          <RouterLink :to="{ name: 'profile' }" class="w-7 h-7 rounded-full bg-(--color-primary) flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity">
            {{ userInitials }}
          </RouterLink>
          <button @click="logout" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-(--color-ink-secondary) hover:bg-(--color-surface-alt) hover:text-(--color-ink) transition-colors border border-(--color-border) cursor-pointer">
            <LogOut :size="13" />
            Salir
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-auto">
        <RouterView />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { LogOut } from 'lucide-vue-next';
import LoadingSpinner from '@/components/molecules/LoadingSpinner.vue';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { authData, authenticated, loading, alertMessage } = storeToRefs(authStore);
const { userData } = storeToRefs(userStore);

const userInitials = computed(() => {
  const first = userData.value.firstName?.charAt(0) || '';
  const last = userData.value.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'U';
});

const logout = async () => {
  await authStore.logout();
  if (!alertMessage.value.error) {
    router.replace('/login');
  }
};

onMounted(async () => {
  await authStore.getSession();
  if (authData.value.fullProfile) {
    userStore.getUser();
  }
});

watch(authenticated, (isAuthenticated) => {
  if (isAuthenticated && authData.value.fullProfile) {
    userStore.getUser();
  }
});
</script>
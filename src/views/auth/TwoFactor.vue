<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg) font-sans">
    <TheHeader />

    <main class="flex-1 flex flex-col items-center justify-center px-5 py-12">
      <div v-if="!isTwoFactorEnabled" class="w-full max-w-md p-8 bg-(--color-surface) rounded-xl border border-(--color-border) shadow-(--shadow-card) text-center">
        <div class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h1 class="font-bold text-xl text-(--color-ink) tracking-tight mb-2">Seguridad 2FA</h1>
        <p class="text-sm text-(--color-ink-secondary) mb-6">
          Puedes activar la autenticación de dos factores para proteger tu cuenta.
        </p>

        <button @click="handleNext" type="button"
          class="w-full px-4 py-2.5 border border-(--color-border) text-(--color-ink-secondary) hover:text-(--color-ink) font-semibold text-sm rounded-lg hover:bg-(--color-surface-alt) transition-colors cursor-pointer">
          Configurar más tarde (Omitir por ahora)
        </button>
        <p class="text-xs text-(--color-ink-muted) mt-4">
          Si decides omitirlo ahora, podrás configurarlo en cualquier momento desde tu perfil.
        </p>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";
import { ShieldCheck } from 'lucide-vue-next';
import TheHeader from '@/components/TheHeader.vue';
import useAuthStore from '@/store/auth';

const router = useRouter();
const useAuth = useAuthStore();
const { authData } = storeToRefs(useAuth);

const isTwoFactorEnabled = computed(() => authData.value.twoFactorEnabled);

const handleNext = () => {
  router.push({
    name: authData.value.fullProfile ? "home" : "profile",
  });
};

onMounted(() => {
  useAuth.getSession();
});
</script>
<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg)">
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-5 py-12">
      <div v-if="!loading"
        class="w-full max-w-md bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden">

        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0">
          <div
            class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-xl text-(--color-ink) tracking-tight mb-2">
            Verifica tu cuenta
          </h1>
          <AppAlert v-if="alertMessage.msg" :error="alertMessage.error" :msg="alertMessage.msg" />
        </div>

        <div class="px-6 pb-10 sm:px-10 shrink-0">
          <div class="flex justify-center text-center text-sm text-(--color-ink-secondary)">
            <p>
              Hemos enviado un correo de confirmación a tu dirección de email. Por favor, revisa tu bandeja de entrada y
              haz clic en el enlace de verificación para activar tu cuenta.
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-(--color-border) text-center">
            <RouterLink :to="{ name: 'login' }"
              class="font-semibold text-sm text-(--color-ink-secondary) hover:text-(--color-primary) hover:underline transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft class="w-4 h-4" />
              Volver al inicio de sesión
            </RouterLink>
          </div>
        </div>

      </div>
      <div v-else
        class="w-full max-w-md bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden p-8 text-center">
        <Loader2 class="w-10 h-10 text-(--color-primary) animate-spin mx-auto mb-4" />
        <p class="text-sm font-medium text-(--color-ink-secondary)">
          Verificando tu cuenta, por favor espera...
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-vue-next';
import TheHeader from '@/components/TheHeader.vue';
import AppAlert from '@/components/AppAlert.vue';
import useAuthStore from '@/store/auth';

const route = useRoute();

const authStore = useAuthStore();
const { alertMessage, loading } = storeToRefs(authStore);

watch(
  () => route.params.token,
  (newToken) => {
    if (typeof newToken === 'string') {
      authStore.verifyAccount(newToken);
    }
  },
  { immediate: true }
);
</script>
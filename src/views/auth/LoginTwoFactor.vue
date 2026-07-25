<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg) font-sans">
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-5 py-12">
      <div
        class="w-full max-w-md bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden relative">

        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0 border-b border-(--color-border)">
          <div
            class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
            <Lock class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-xl text-(--color-ink) tracking-tight mb-2">Verificación 2FA</h1>
          <p class="text-sm text-(--color-ink-secondary) max-w-sm mx-auto">
            Ingresa el código TOTP de 6 dígitos para completar tu inicio de sesión.
          </p>
        </div>

        <div class="px-6 py-8 sm:px-10">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <InputField label="Código de verificación" id="code" required type="text" inputmode="numeric" v-model="code"
              placeholder="123456" />

            <div class="pt-4 border-t border-(--color-border) flex flex-col gap-2">
              <button type="submit" :disabled="loading" :class="[
                'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 cursor-pointer',
                !loading ? 'bg-(--color-primary) hover:bg-(--color-primary-hover) text-white' : 'opacity-70 bg-(--color-primary) text-white cursor-not-allowed'
              ]">
                Verificar código
              </button>

              <RouterLink to="/"
                class="w-full py-2.5 px-4 border border-(--color-border) rounded-lg text-sm font-semibold text-center text-(--color-ink-secondary) bg-(--color-surface) hover:bg-(--color-surface-alt) hover:text-(--color-ink) transition-colors cursor-pointer">
                Volver al inicio de sesión
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { Lock } from 'lucide-vue-next';
import InputField from "@/components/molecules/InputField.vue";
import TheHeader from '@/components/TheHeader.vue';
import useAuthStore from "@/store/auth";

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const code = ref("");

const isExpiredPreAuthSessionMessage = (message: string) => {
  const normalizedMessage = message.toLowerCase();
  return normalizedMessage.includes("pre-autenticación") ||
    normalizedMessage.includes("sesión expirada") ||
    normalizedMessage.includes("session expired") ||
    normalizedMessage.includes("invalid pre-auth") ||
    normalizedMessage.includes("pre_auth");
};

const handleSubmit = async () => {
  const result = await authStore.verifyLoginTwoFactor(code.value.trim());

  if (!result.isSuccess) {
    const msg = result.getError?.msg || "Error al verificar el código 2FA.";
    toast.error(msg);

    if (isExpiredPreAuthSessionMessage(msg)) {
      toast.info("Tu sesión temporal expiró. Inicia sesión nuevamente.");
      router.push({ name: "login" });
    }

    return;
  }

  await authStore.getSession();

  toast.success("¡Verificación 2FA completada! Redirigiendo...");

  if (authStore.authData.firstSession && !authStore.authData.twoFactorEnabled) {
    router.push({ name: "generate-two-factor" });
    return;
  }

  router.push({
    name: authStore.authData.fullProfile ? "system-select" : "perfil",
  });
};
</script>

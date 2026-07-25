<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg) font-sans" itemscope itemtype="https://schema.org/WebPage">
    <meta itemprop="name" content="Iniciar Sesión - Zelko" />
    <meta itemprop="description"
      content="Inicia sesion en Zelko para gestionar tus documentos y clientes de forma profesional." />
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-5 py-12">
      <div
        class="w-full max-w-md bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden">
        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0 border-b border-(--color-border)">
          <div
            class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
            <User2 class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-xl text-(--color-ink) tracking-tight mb-2">
            Iniciar Sesión
          </h1>
          <p class="text-sm text-(--color-ink-secondary)">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>
        </div>

        <div class="px-6 py-8 sm:px-10">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <InputField label="Correo electrónico" id="email" required type="email" inputmode="email" v-model="email"
              placeholder="admin@cotizaerp.com" />

            <InputField label="Contraseña" id="password" required type="password" inputmode="text" v-model="password"
              placeholder="••••••••" />

            <div class="flex items-center justify-end pt-1">
              <RouterLink to="/forgot-password"
                class="text-sm font-semibold text-(--color-ink-secondary) hover:text-(--color-primary) hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </RouterLink>
            </div>

            <div class="pt-4 border-t border-(--color-border) flex flex-col gap-4">
              <div v-if="accountNotVerified"
                class="bg-(--color-surface-alt) rounded-lg border border-(--color-border) p-4 space-y-3">
                <p class="text-sm font-semibold text-(--color-ink)">
                  Tu cuenta aún no ha sido verificada.
                </p>
                <button type="button" @click="resendVerification"
                  class="px-4 py-2 bg-(--color-surface) hover:bg-(--color-surface-alt) border border-(--color-border) text-(--color-ink) text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer">
                  Reenviar correo de verificación
                </button>
              </div>

              <button type="submit" :disabled="loading" :class="[
                'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 cursor-pointer',
                !loading ? 'bg-(--color-primary) hover:bg-(--color-primary-hover) text-white' : 'opacity-70 bg-(--color-primary) text-white cursor-not-allowed'
              ]">
                Autorizar Acceso
              </button>
            </div>
          </form>
        </div>

        <div class="px-6 py-6 border-t border-(--color-border) bg-(--color-surface-alt) text-center sm:px-8">
          <p class="text-sm text-(--color-ink-secondary)">
            ¿Aún no tienes una cuenta?
            <RouterLink to="/register" class="text-(--color-primary) font-semibold hover:text-(--color-primary-hover) hover:underline transition-colors ml-1">
              Regístrate aquí
            </RouterLink>
          </p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { User2 } from "lucide-vue-next";
import InputField from "@/components/molecules/InputField.vue";
import TheHeader from '@/components/TheHeader.vue';
import useAuthStore from "@/store/auth";

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const { accountNotVerified, loading } = storeToRefs(authStore);

const email = ref("");
const password = ref("");

const handleSubmit = async () => {
  const result = await authStore.login(email.value, password.value);
  if (!result.isSuccess) {
    toast.error(result.getError?.msg || "Error al iniciar sesión. Por favor, intenta nuevamente.");
    return;
  }

  await authStore.getSession();
  toast.success("¡Inicio de sesión exitoso! Redirigiendo...");

  router.push({
    name: authStore.authData.fullProfile ? "home" : "profile",
  });
};

const resendVerification = () => {
  authStore.forwardEmailVerification(email.value);
};

</script>
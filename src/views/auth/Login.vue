<template>
  <div class="min-h-screen flex flex-col bg-[#f1f3f5] font-sans" itemscope itemtype="https://schema.org/WebPage">
    <meta itemprop="name" content="Iniciar Sesión - Zelko" />
    <meta itemprop="description" content="Inicia sesión en Zelko para gestionar tus documentos LaTeX y Typst de forma profesional." />
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div class="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden flex flex-col">
        <div class="px-6 pt-9 pb-6 text-center sm:px-10 shrink-0 border-b border-gray-100">
          <div class="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <LogIn class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-2xl text-gray-900 tracking-tight mb-1">
            Iniciar Sesión
          </h1>
          <p class="text-xs sm:text-sm text-gray-500">
            Ingresa tus credenciales para acceder a tus documentos.
          </p>
        </div>

        <div class="px-6 py-7 sm:px-10">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <InputField
              label="Correo electrónico"
              id="email"
              required
              type="email"
              inputmode="email"
              v-model="email"
              placeholder="tu@correo.com"
            />

            <InputField
              label="Contraseña"
              id="password"
              required
              type="password"
              inputmode="text"
              v-model="password"
              placeholder="••••••••"
            />

            <div class="flex items-center justify-end pt-0.5">
              <RouterLink
                to="/forgot-password"
                class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors no-underline">
                ¿Olvidaste tu contraseña?
              </RouterLink>
            </div>

            <div class="pt-3 flex flex-col gap-3">
              <div
                v-if="accountNotVerified"
                class="bg-amber-50 rounded-xl border border-amber-200/70 p-3.5 space-y-2">
                <p class="text-xs font-semibold text-amber-800">
                  Tu cuenta aún no ha sido verificada.
                </p>
                <button
                  type="button"
                  @click="resendVerification"
                  class="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer">
                  Reenviar correo de verificación
                </button>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex justify-center items-center gap-2 cursor-pointer shadow-xs bg-[#059669] hover:bg-[#047857] text-white disabled:opacity-60 disabled:cursor-not-allowed border-none">
                <span
                  v-if="loading"
                  class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span v-else>Iniciar Sesión</span>
              </button>
            </div>
          </form>
        </div>

        <div class="px-6 py-5 border-t border-gray-100 bg-gray-50/70 text-center sm:px-8">
          <p class="text-xs sm:text-sm text-gray-500">
            ¿Aún no tienes una cuenta?
            <RouterLink
              to="/register"
              class="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors ml-1 no-underline">
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
import { LogIn } from "lucide-vue-next";
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

<template>
  <div class="min-h-screen flex flex-col bg-[#f1f3f5] font-sans" itemscope itemtype="https://schema.org/WebPage">
    <meta itemprop="name" content="Crear Cuenta - Zelko" />
    <meta itemprop="description" content="Regístrate en Zelko para gestionar y editar tus documentos LaTeX y Typst." />
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
      <div class="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden flex flex-col">
        <div class="px-6 pt-9 pb-6 text-center sm:px-8 border-b border-gray-100">
          <div class="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <UserPlus2 class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-2xl text-gray-900 mb-1 tracking-tight">Crear Cuenta</h1>
          <p class="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Únete a Zelko y comienza a editar tus documentos en LaTeX y Typst.
          </p>
        </div>

        <div class="px-6 py-7 sm:px-8">
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

            <InputField
              label="Confirmar Contraseña"
              id="confirmPassword"
              required
              type="password"
              inputmode="text"
              v-model="confirmPassword"
              placeholder="••••••••"
            />

            <div class="pt-2 flex flex-col gap-4">
              <AppAlert v-if="alertMessage.msg" :msg="alertMessage.msg" :error="alertMessage.error" />

              <div class="bg-gray-50/80 rounded-xl border border-gray-100 p-4 space-y-2.5">
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Requisitos de seguridad</p>
                <ul class="space-y-1.5 list-none p-0 m-0">
                  <li
                    v-for="req in requirements"
                    :key="req.label"
                    class="flex items-center gap-2 text-xs font-medium"
                    :class="req.met ? 'text-emerald-700 font-semibold' : 'text-gray-500'">
                    <Check class="h-3.5 w-3.5 text-emerald-600 shrink-0" v-if="req.met" />
                    <span class="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 ml-1 mr-1" v-else></span>
                    {{ req.label }}
                  </li>
                </ul>
              </div>

              <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-1">
                <RouterLink
                  to="/"
                  class="inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors no-underline">
                  Cancelar
                </RouterLink>
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex justify-center items-center py-2.5 px-6 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs bg-[#059669] hover:bg-[#047857] text-white disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer">
                  <span
                    v-if="loading"
                    class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span v-else>Crear Cuenta</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="px-6 py-5 border-t border-gray-100 bg-gray-50/70 text-center sm:px-8">
          <p class="text-xs sm:text-sm text-gray-500">
            ¿Ya tienes una cuenta registrada?
            <RouterLink
              to="/"
              class="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors ml-1 no-underline">
              Inicia sesión aquí
            </RouterLink>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { UserPlus2, Check } from 'lucide-vue-next';
import InputField from '@/components/molecules/InputField.vue';
import TheHeader from '@/components/TheHeader.vue';
import AppAlert from '@/components/AppAlert.vue';
import useAuthStore from '@/store/auth';

const router = useRouter();
const useAuth = useAuthStore();
const toast = useToast();

const { alertMessage, loading } = storeToRefs(useAuth);

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const requirements = computed(() => [
  { label: 'Mínimo 8 caracteres', met: password.value.length >= 8 },
  { label: 'Al menos un número', met: /\d/.test(password.value) },
  { label: 'Una letra mayúscula', met: /[A-Z]/.test(password.value) },
  { label: 'Un carácter especial (@, #, $)', met: /[@#$%^&*!]/.test(password.value) },
]);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    useAuth.setAlertMessage({ error: true, msg: "Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente." });
    return;
  }

  const result = await useAuth.register(email.value, password.value);
  if (result.isSuccess) {
    toast.success("¡Registro exitoso! Por favor, verifica tu correo electrónico.");
    router.push("/");
  } else {
    toast.error(alertMessage.value?.msg || "Error al registrar. Por favor, intenta nuevamente.");
  }
};
</script>

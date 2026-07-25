<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg) font-sans">
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-5 py-12">
      <div
        class="w-full max-w-md bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden relative">

        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0 border-b border-(--color-border)">
          <div
            class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
            <LockKeyhole class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-xl text-(--color-ink) tracking-tight mb-2">
            Cambiar Contraseña
          </h1>
          <p class="text-sm text-(--color-ink-secondary)">
            Ingresa tu nueva clave de acceso para asegurar tu cuenta.
          </p>
        </div>

        <div class="px-6 py-8 sm:px-10">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <InputField label="Ingresa tu nueva contraseña" id="newPassword" required type="password" inputmode="text"
              v-model="newPassword" placeholder="••••••••" />

            <InputField label="Confirmar Contraseña" id="confirmPassword" required type="password" inputmode="text"
              v-model="confirmPassword" placeholder="••••••••" />

            <div class="bg-(--color-surface-alt) rounded-lg border border-(--color-border) p-4 space-y-3">
              <p class="text-xs font-semibold text-(--color-ink) uppercase tracking-wider">
                Requisitos de seguridad
              </p>
              <ul class="space-y-2">
                <li v-for="req in requirements" :key="req.label"
                  class="flex items-center gap-2 text-sm text-(--color-ink-secondary) font-medium">
                  <Check class="h-4 w-4 text-(--color-primary) shrink-0" v-if="req.met" />
                  <span class="w-1.5 h-1.5 rounded-full bg-(--color-ink-muted) shrink-0 ml-1.5 mr-1" v-else></span>
                  {{ req.label }}
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-(--color-border) flex flex-col gap-2">
              <button type="submit" :disabled="loading" :class="[
                'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 cursor-pointer',
                !loading ? 'bg-(--color-primary) hover:bg-(--color-primary-hover) text-white' : 'opacity-70 bg-(--color-primary) text-white cursor-not-allowed'
              ]">
                Actualizar Contraseña
              </button>

              <RouterLink :to="{ name: 'login' }"
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import { LockKeyhole, Check } from 'lucide-vue-next';
import InputField from '@/components/molecules/InputField.vue';
import TheHeader from '@/components/TheHeader.vue';
import useAuthStore from '@/store/auth';

const toast = useToast();
const route = useRoute();
const newPassword = ref('');
const confirmPassword = ref('');

const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);

const setToast = (message: string, isError = false) => {
  if (isError) {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

const requirements = computed(() => [
  { label: 'Mínimo 8 caracteres', met: newPassword.value.length >= 8 },
  { label: 'Al menos un número', met: /\d/.test(newPassword.value) },
  { label: 'Una letra mayúscula', met: /[A-Z]/.test(newPassword.value) },
  { label: 'Un carácter especial (@, #, $)', met: /[@#$%^&*!]/.test(newPassword.value) },
]);

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    setToast("Las contraseñas no coinciden.", true);
    return;
  }

  const token = route.params.token ?? "";
  if (token.toString().length === 0 || !token || typeof token !== 'string') {
    setToast('Token de recuperación no válido.', true);
    return;
  }

  const result = await authStore.resetPassword(token, newPassword.value);
  if (result.isSuccess) {
    setToast(result.getMessage || "Contraseña actualizada exitosamente.");
  } else {
    setToast(result.getError?.msg || "Error al actualizar la contraseña.", true);
  }
};
</script>
<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg) font-sans">
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-5 py-12">
      <div
        class="w-full max-w-md bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden">
        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0 border-b border-(--color-border)">
          <div
            class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
            <Mail class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-xl text-(--color-ink) tracking-tight mb-2">
            Recuperar Contraseña
          </h1>
          <p class="text-sm text-(--color-ink-secondary)">
            Ingresa tu correo registrado y te enviaremos instrucciones para recuperar tu cuenta.
          </p>
        </div>

        <div class="px-6 py-8 sm:px-10 shrink-0">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-1.5">
              <label for="email" class="block text-xs font-semibold text-(--color-ink) mb-1">
                Correo de Recuperación
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-ink-muted)">
                  <Mail class="h-4.5 w-4.5" />
                </div>
                <input id="email" type="email" autocomplete="email" placeholder="usuario@ejemplo.com" v-model="email"
                  class="block w-full pl-10 pr-4 py-2 border border-(--color-border) rounded-lg text-sm text-(--color-ink) bg-(--color-surface) placeholder:text-(--color-ink-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary-subtle) focus:border-(--color-primary) transition-all"
                  required />
              </div>
            </div>

            <div class="pt-2">
              <button type="submit"
                class="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors bg-(--color-primary) hover:bg-(--color-primary-hover) text-white cursor-pointer">
                Verificar Correo
              </button>
            </div>
          </form>

          <div class="mt-6 pt-6 border-t border-(--color-border)">
            <p class="text-center text-sm">
              <RouterLink :to="{ name: 'login' }"
                class="font-semibold text-(--color-ink-secondary) hover:text-(--color-primary) hover:underline transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft class="w-4 h-4" />
                Volver al inicio de sesión
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { Mail, ArrowLeft } from 'lucide-vue-next';
import TheHeader from '@/components/TheHeader.vue';
import useAuthStore from '@/store/auth';

const toast = useToast();
const authStore = useAuthStore();
const email = ref('');

const handleSubmit = async () => {
  const result = await authStore.forgotPassword(email.value);
  if (result.isSuccess) {
    toast.success(result.getMessage || "Correo de recuperación enviado exitosamente.");
  } else {
    toast.error(result.getError?.msg || "Error al enviar el correo de recuperación.");
  }
};
</script>
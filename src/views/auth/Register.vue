<template>
  <div class="min-h-screen flex flex-col bg-(--color-bg) font-sans" itemscope itemtype="https://schema.org/WebPage">
    <meta itemprop="name" content="Crear Cuenta - Zelko" />
    <meta itemprop="description" content="Regístrate en Zelko para gestionar tus cotizaciones y clientes." />
    <TheHeader />

    <main class="flex-1 flex items-center justify-center px-5 py-12">
      <div class="w-full max-w-lg bg-(--color-surface) rounded-xl shadow-(--shadow-card) border border-(--color-border) overflow-hidden relative">
        <div class="px-6 pt-10 pb-6 text-center sm:px-8 border-b border-(--color-border)">
          <div class="w-12 h-12 bg-(--color-primary-subtle) text-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-6 border border-(--color-primary)/20">
            <UserPlus2 class="w-6 h-6" />
          </div>
          <h1 class="font-bold text-xl text-(--color-ink) mb-1.5 tracking-tight">Crear Cuenta</h1>
          <p class="text-sm text-(--color-ink-secondary) max-w-sm mx-auto">
            Crea tu cuenta en Zelko completando el formulario.
          </p>
        </div>

        <div class="px-6 py-7 sm:px-8">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <InputField label="Ingresa tu correo electrónico" id="email" required type="email"
              inputmode="email" v-model="email" placeholder="admin@cotizaerp.com" />

            <InputField label="Ingresa tu contraseña" id="password" required type="password"
              inputmode="text" v-model="password" placeholder="••••••••" />

            <InputField label="Confirmar Contraseña" id="confirmPassword" required type="password"
              inputmode="text" v-model="confirmPassword" placeholder="••••••••" />

            <div class="pt-4 border-t border-(--color-border) flex flex-col gap-4">
              <AppAlert v-if="alertMessage.msg" :msg="alertMessage.msg" :error="alertMessage.error" />

              <div class="bg-(--color-surface-alt) rounded-lg border border-(--color-border) p-4 space-y-3">
                <p class="text-xs font-semibold text-(--color-ink) uppercase tracking-wider">Requisitos de seguridad</p>
                <ul class="space-y-2">
                  <li v-for="req in requirements" :key="req.label"
                    class="flex items-center gap-2 text-sm text-(--color-ink-secondary) font-medium">
                    <Check class="h-4 w-4 text-(--color-primary) shrink-0" v-if="req.met" />
                    <span class="w-1.5 h-1.5 rounded-full bg-(--color-ink-muted) shrink-0 ml-1.5 mr-1" v-else></span>
                    {{ req.label }}
                  </li>
                </ul>
              </div>

              <div class="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <RouterLink to="/"
                  class="flex justify-center items-center py-2.5 px-4 border border-(--color-border) rounded-lg text-sm font-semibold text-(--color-ink-secondary) bg-(--color-surface) hover:bg-(--color-surface-alt) transition-colors cursor-pointer">
                  Cancelar
                </RouterLink>
                <button type="submit" :disabled="loading" :class="[
                  'flex justify-center items-center py-2.5 px-6 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
                  !loading ? 'bg-(--color-primary) hover:bg-(--color-primary-hover) text-white' : 'opacity-70 bg-(--color-primary) text-white cursor-not-allowed'
                ]">
                  Registrarse
                </button>
              </div>
            </div>

          </form>
        </div>

        <div class="px-6 py-6 border-t border-(--color-border) bg-(--color-surface-alt) text-center sm:px-8">
          <p class="text-sm text-(--color-ink-secondary)">
            ¿Ya estás registrado en la plataforma?
            <RouterLink to="/"
              class="text-(--color-primary) font-semibold hover:text-(--color-primary-hover) hover:underline transition-colors ml-1">
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

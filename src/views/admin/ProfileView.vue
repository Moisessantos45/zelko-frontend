<template>
  <div class="p-6 max-w-2xl mx-auto flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <RouterLink :to="{ name: 'home' }"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-(--color-ink-secondary) hover:bg-(--color-surface) hover:text-(--color-ink) transition-colors">
        <ArrowLeft :size="16" />
      </RouterLink>
      <div>
        <h1 class="text-base font-bold text-(--color-ink)">Mi perfil</h1>
        <p class="text-xs text-(--color-ink-secondary)">{{ authData.email }}</p>
      </div>
    </div>

    <div class="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-(--color-border)">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-(--color-primary) flex items-center justify-center text-white text-base font-bold shrink-0">
            {{ userInitials }}
          </div>
          <div>
            <p class="text-sm font-semibold text-(--color-ink)">
              {{ userData.firstName }} {{ userData.lastName }}
            </p>
            <p class="text-xs text-(--color-ink-secondary)">{{ authData.email }}</p>
          </div>
        </div>
      </div>

      <div class="p-5 flex flex-col gap-4">
        <p class="text-xs font-semibold text-(--color-ink-secondary) uppercase tracking-wider">
          Información personal
        </p>
        <div class="grid grid-cols-2 gap-4">
          <InputField label="Nombre" id="firstName" v-model="userData.firstName" placeholder="Nombre" />
          <InputField label="Apellido" id="lastName" v-model="userData.lastName" placeholder="Apellido" />
        </div>
        <div class="flex justify-end">
          <button @click="handleClick" :disabled="loading"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-(--color-primary) hover:bg-(--color-primary-hover) disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-none">
            <span v-if="loading"
              class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>

    <div class="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-(--color-border)">
        <p class="text-sm font-semibold text-(--color-ink)">Cambiar contraseña</p>
      </div>
      <div class="p-5 flex flex-col gap-4">
        <InputField label="Contraseña actual" id="currentPassword" v-model="currentPassword" type="password"
          placeholder="••••••••" />
        <InputField label="Nueva contraseña" id="newPassword" v-model="newPassword" type="password"
          placeholder="••••••••" />
        <div class="flex justify-end">
          <button @click="handleUpdatePassword" :disabled="passwordLoading"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-(--color-ink) bg-(--color-surface-alt) border border-(--color-border) hover:bg-(--color-surface-alt) disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
            <span v-if="passwordLoading"
              class="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            Actualizar contraseña
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { ArrowLeft } from 'lucide-vue-next';
import InputField from '@/components/molecules/InputField.vue';
import useUserStore from '@/store/user';
import useAuthStore from '@/store/auth';

const toast = useToast();
const userStore = useUserStore();
const authStore = useAuthStore();
const { userData, loading } = storeToRefs(userStore);
const { authData } = storeToRefs(authStore);

const currentPassword = ref('');
const newPassword = ref('');
const passwordLoading = ref(false);

const userInitials = computed(() => {
  const first = userData.value.firstName?.charAt(0) || '';
  const last = userData.value.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'U';
});

const handleClick = async () => {
  const result = await (userData.value.id ? userStore.updateUser() : userStore.addUser());
  if (result.isSuccess) {
    toast.success("Información del usuario actualizada correctamente.");
  } else {
    toast.error("Error al actualizar la información del organizador.");
  }
};

const handleUpdatePassword = async () => {
  if (!currentPassword.value.trim() || !newPassword.value.trim()) {
    toast.error('Debes completar la contraseña actual y la nueva contraseña.');
    return;
  }
  passwordLoading.value = true;
  const result = await authStore.updatePassword(currentPassword.value, newPassword.value);
  passwordLoading.value = false;
  if (result.isSuccess) {
    toast.success('Contraseña actualizada correctamente.');
    currentPassword.value = '';
    newPassword.value = '';
  } else {
    toast.error(result.getError?.msg || 'No se pudo actualizar la contraseña.');
  }
};
</script>
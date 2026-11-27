<template>
  <div class="h-screen w-screen bg-(--color-bg) font-sans overflow-hidden">
    <LoadingSpinner v-if="loading" />

    <template v-else-if="authenticated">
      <div v-if="isEditorView" class="h-full w-full overflow-hidden flex flex-col">
        <RouterView />
      </div>

      <div v-else class="h-full w-full p-0 flex items-center justify-center overflow-hidden">
        <div
          class="w-full h-full bg-white border-0 sm:border border-gray-200/90 flex flex-col md:flex-row overflow-hidden relative">
          
          <div class="md:hidden h-14 bg-white border-b border-gray-100 px-4 flex items-center justify-between shrink-0 z-20">
            <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 no-underline">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <span class="text-base font-bold text-gray-900 tracking-tight">Zelko</span>
            </RouterLink>

            <div class="flex items-center gap-2">
              <button
                @click="openNewDocumentModal"
                type="button"
                class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] shadow-xs cursor-pointer border-none">
                <Plus :size="14" />
                <span>Nuevo</span>
              </button>

              <button
                @click="mobileDrawerOpen = !mobileDrawerOpen"
                type="button"
                class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
                title="Abrir menú">
                <Menu :size="20" />
              </button>
            </div>
          </div>

          <div
            v-if="mobileDrawerOpen"
            class="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
            @click="mobileDrawerOpen = false"></div>

          <aside
            class="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 flex flex-col justify-between overflow-y-auto md:static md:inset-auto md:shadow-none md:translate-x-0 shrink-0"
            :class="[
              mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
              sidebarCollapsed ? 'md:w-18 md:p-3' : 'md:w-64 md:p-4 lg:p-5',
              'p-5'
            ]">
            
            <div class="flex flex-col gap-5">
              <div class="flex items-center justify-between" :class="{ 'md:justify-center': sidebarCollapsed }">
                <RouterLink :to="{ name: 'home' }" @click="mobileDrawerOpen = false" class="flex items-center gap-2.5 no-underline">
                  <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <span v-if="!sidebarCollapsed" class="text-base font-bold text-gray-900 tracking-tight">Zelko</span>
                </RouterLink>

                <div class="flex items-center gap-1">
                  <button
                    @click="sidebarCollapsed = !sidebarCollapsed"
                    type="button"
                    :title="sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'"
                    class="hidden md:inline-flex p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">
                    <PanelLeftClose v-if="!sidebarCollapsed" :size="16" />
                    <PanelLeftOpen v-else :size="16" />
                  </button>

                  <button
                    @click="mobileDrawerOpen = false"
                    type="button"
                    class="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">
                    <X :size="18" />
                  </button>
                </div>
              </div>

              <button
                @click="handleCreateButton"
                type="button"
                :title="'Nuevo documento'"
                class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-2xs cursor-pointer">
                <Plus :size="15" class="text-gray-600 shrink-0" />
                <span v-if="!sidebarCollapsed" class="truncate">Nuevo documento</span>
              </button>

              <nav class="flex flex-col gap-1">
                <RouterLink
                  :to="{ name: 'home' }"
                  @click="mobileDrawerOpen = false"
                  class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold no-underline transition-all"
                  :class="route.name === 'home' ? 'bg-[#e6f7f0] text-[#059669]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                  :title="'Documentos'">
                  <FileText :size="16" class="shrink-0" />
                  <span v-if="!sidebarCollapsed">Documentos</span>
                </RouterLink>

                <RouterLink
                  :to="{ name: 'profile' }"
                  @click="mobileDrawerOpen = false"
                  class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium no-underline transition-all"
                  :class="route.name === 'profile' ? 'bg-[#e6f7f0] text-[#059669] font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                  :title="'Mi Perfil'">
                  <User :size="16" class="shrink-0" />
                  <span v-if="!sidebarCollapsed">Mi Perfil</span>
                </RouterLink>
              </nav>
            </div>

            <div class="flex flex-col gap-4 mt-6">
              <div
                class="relative flex items-center justify-between pt-3 border-t border-gray-100"
                :class="{ 'md:justify-center': sidebarCollapsed }">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div
                    class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {{ userInitials }}
                  </div>
                  <div v-if="!sidebarCollapsed" class="min-w-0 flex flex-col text-left">
                    <span class="text-xs font-semibold text-gray-900 truncate">
                      {{ userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : 'Usuario' }}
                    </span>
                    <span class="text-[11px] text-gray-400 truncate">
                      {{ authData.email || 'usuario@zelko.app' }}
                    </span>
                  </div>
                </div>

                <div v-if="!sidebarCollapsed" class="relative">
                  <button
                    @click="showUserMenu = !showUserMenu"
                    type="button"
                    title="Opciones de usuario"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">
                    <MoreHorizontal :size="15" />
                  </button>

                  <div
                    v-if="showUserMenu"
                    class="absolute bottom-full right-0 mb-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30 flex flex-col">
                    <RouterLink
                      :to="{ name: 'profile' }"
                      @click="showUserMenu = false; mobileDrawerOpen = false;"
                      class="px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 no-underline">
                      <User :size="14" />
                      Ver perfil
                    </RouterLink>
                    <button
                      @click="handleLogout"
                      type="button"
                      class="px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 text-left cursor-pointer border-none bg-transparent">
                      <LogOut :size="14" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main class="flex-1 h-full overflow-y-auto bg-white flex flex-col">
            <RouterView />
          </main>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  FileText,
  User,
  LogOut,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
  Menu,
  X
} from 'lucide-vue-next';
import LoadingSpinner from '@/components/molecules/LoadingSpinner.vue';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';
import useDocumentStore from '@/store/document';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const documentStore = useDocumentStore();

const { authData, authenticated, loading, alertMessage } = storeToRefs(authStore);
const { userData } = storeToRefs(userStore);

const sidebarCollapsed = ref(false);
const mobileDrawerOpen = ref(false);
const showUserMenu = ref(false);

const isEditorView = computed(() => {
  return route.name === 'document' || route.name === 'document-typst';
});

const userInitials = computed(() => {
  const first = userData.value.firstName?.charAt(0) || '';
  const last = userData.value.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'U';
});

const openNewDocumentModal = () => {
  if (route.name !== 'home') {
    router.push({ name: 'home' }).then(() => {
      documentStore.showCreateModal = true;
    });
  } else {
    documentStore.showCreateModal = true;
  }
};

const handleCreateButton = () => {
  mobileDrawerOpen.value = false;
  openNewDocumentModal();
};

const handleLogout = async () => {
  showUserMenu.value = false;
  mobileDrawerOpen.value = false;
  await authStore.logout();
  if (!alertMessage.value.error) {
    router.replace({ name: 'login' });
  }
};

onMounted(async () => {
  await authStore.getSession();
  if (authData.value.fullProfile) {
    userStore.getUser();
  }
});

watch(authenticated, (isAuthenticated) => {
  if (isAuthenticated && authData.value.fullProfile) {
    userStore.getUser();
  }
});
</script>

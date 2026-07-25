<template>
  <div class="p-6 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-bold text-(--color-ink)">Mis documentos</h1>
        <p class="text-xs text-(--color-ink-secondary) mt-0.5">
          {{ documentList.length }} documento{{ documentList.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <button @click="showModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-(--color-primary) hover:bg-(--color-primary-hover) transition-colors cursor-pointer border-none">
        <Plus :size="14" />
        Nuevo documento
      </button>
    </div>

    <div v-if="documentLoading" class="flex flex-col gap-3">
      <div v-for="n in 3" :key="n"
        class="h-20 rounded-xl bg-(--color-surface) border border-(--color-border) animate-pulse" />
    </div>

    <div v-else-if="documentList.length === 0"
      class="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div
        class="w-14 h-14 rounded-2xl bg-(--color-surface) border border-(--color-border) flex items-center justify-center">
        <FileText :size="24" class="text-(--color-ink-secondary)" />
      </div>
      <div>
        <p class="text-sm font-semibold text-(--color-ink)">Sin documentos</p>
        <p class="text-xs text-(--color-ink-secondary) mt-1">Crea tu primer documento LaTeX</p>
      </div>
      <button @click="showModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-(--color-primary) hover:bg-(--color-primary-hover) transition-colors cursor-pointer border-none">
        <Plus :size="14" />
        Crear documento
      </button>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div v-for="doc in documentList" :key="doc.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-(--color-surface) border border-(--color-border) rounded-xl hover:bg-(--color-surface-alt) hover:border-(--color-primary)/30 transition-all group">
        <RouterLink :to="{ name: 'document', params: { slug: doc.slug } }"
          class="flex items-center gap-3 min-w-0 flex-1 no-underline">
          <div class="w-9 h-9 rounded-lg bg-(--color-primary)/10 flex items-center justify-center shrink-0">
            <FileText :size="16" class="text-(--color-primary)" />
          </div>
          <div class="min-w-0">
            <p
              class="text-sm font-semibold text-(--color-ink) truncate group-hover:text-(--color-primary) transition-colors">
              {{ doc.title }}
            </p>
            <p class="text-xs text-(--color-ink-secondary) mt-0.5">{{ doc.updatedAt }}</p>
          </div>
        </RouterLink>

        <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto" @click.stop.prevent>
          <button @click.stop.prevent="copyUrl(doc.url, doc.slug)" type="button" title="Copiar URL"
            class="inline-flex items-center justify-center p-2 rounded-lg text-(--color-ink-secondary) hover:text-(--color-ink) bg-(--color-surface) hover:bg-(--color-surface-alt) border border-(--color-border) transition-all cursor-pointer">
            <Check v-if="copiedSlug === doc.slug" :size="14" class="text-green-600" />
            <Copy v-else :size="14" />
          </button>

          <div class="w-36">
            <DynamicDropdown :modelValue="doc.visibilityId" :options="visibilityOptions" defaultLabel="Visibilidad"
              :icon="Eye" @change="(val) => changeVisibility(doc.slug, val)" />
          </div>

          <RouterLink :to="{ name: 'document', params: { slug: doc.slug } }"
            class="p-1 text-(--color-ink-secondary) hover:text-(--color-ink) transition-colors">
            <ChevronRight :size="16" />
          </RouterLink>
        </div>
      </div>
    </div>

    <BaseModal :hidden="showModal" title="Nuevo documento" confirm-label="Crear"
      :disabled="!newTitle.trim() || documentLoading" @cancel="closeModal" @confirm="handleCreate">
      <div class="flex flex-col gap-1.5">
        <InputField label="Título" id="newTitle" v-model="newTitle" placeholder="Ej. Tesis de grado"
          @keyup.enter="handleCreate" />
      </div>
    </BaseModal>

    <PageNavigator v-if="paginated.totalPages > 1" :total="paginated.total" :page="paginated.page"
      :totalPages="paginated.totalPages" :changePage="changePage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { Plus, FileText, ChevronRight, Copy, Check, Eye } from 'lucide-vue-next';
import BaseModal from '@/components/molecules/BaseModal.vue';
import PageNavigator from "@/components/molecules/PageNavigator.vue";
import InputField from "@/components/molecules/InputField.vue";
import DynamicDropdown from "@/components/atoms/DynamicDropdown.vue";
import useDocumentStore from '@/store/document';

const router = useRouter();
const toast = useToast();
const documentStore = useDocumentStore();
const { documentList, visibilityDropdownOptions, visibilityList, documentLoading, documentForm, paginated } = storeToRefs(documentStore);

const showModal = ref(false);
const newTitle = ref('');
const copiedSlug = ref<string | null>(null);

const visibilityOptions = computed(() => {
  if (visibilityList.value && visibilityList.value.length > 0) {
    return visibilityList.value.map((item) => ({
      id: item.id,
      label: item.name,
    }));
  }
  return visibilityDropdownOptions.value.filter((opt) => opt.id !== 0);
});

const getData = async () => {
  await Promise.all([
    documentStore.getDocumentList(),
    documentStore.getVisibilityList()
  ]);
};

const copyUrl = async (url: string, slug: string) => {
  if (!url) {
    toast.error('El documento no tiene una URL asignada.');
    return;
  }
  try {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    copiedSlug.value = slug;
    toast.success('URL copiada al portapapeles.');
    setTimeout(() => {
      if (copiedSlug.value === slug) {
        copiedSlug.value = null;
      }
    }, 2000);
  } catch (err) {
    toast.error('No se pudo copiar la URL.');
  }
};

const changePage = (newPage: number) => {
  if (newPage < 1) return;
  if (newPage > paginated.value.totalPages) return;

  paginated.value.page = newPage;

  getData();
};

const closeModal = () => {
  showModal.value = false;
  newTitle.value = '';
};

const handleCreate = async () => {
  if (!newTitle.value.trim()) return;
  const result = await documentStore.createDocument(newTitle.value.trim(), '');
  if (result.isSuccess) {
    toast.success('Documento creado correctamente.');
    closeModal();
    router.push({ name: 'document', params: { slug: documentForm.value.slug } });
  } else {
    toast.error(result.getError?.msg || 'Error al crear el documento.');
  }
};

const changeVisibility = async (slug: string, visibilityId: number | string | undefined) => {
  const parsedVisibility = visibilityId !== undefined ? parseInt(visibilityId.toString(), 10) : 0;

  const result = await documentStore.updateDocumentVisibility(slug, parsedVisibility);
  if (result.isSuccess) {
    toast.success(result.getMessage || 'Visibilidad del documento actualizada correctamente.');
  } else {
    toast.error(result.getError?.msg || 'Error al actualizar la visibilidad del documento.');
  }
};

onMounted(() => {
  getData();
});
</script>

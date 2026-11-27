<template>
  <div class="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-7xl mx-auto w-full">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Documentos</h1>
        <p class="text-xs text-gray-500 mt-0.5 sm:mt-1">
          {{ filteredDocuments.length }} de {{ documentList.length }} documento{{ documentList.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <button
        @click="documentStore.showCreateModal = true"
        type="button"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] shadow-xs transition-colors cursor-pointer border-none shrink-0">
        <Plus :size="15" />
        Nuevo documento
      </button>
    </div>

    <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <Search :size="16" class="text-gray-400 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por título..."
            class="text-xs text-gray-800 placeholder:text-gray-400 bg-transparent border-none outline-none w-full focus:ring-0"
          />
        </div>

        <div class="flex items-center gap-1.5 shrink-0 self-start sm:self-auto overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            @click="filterType = 'all'"
            type="button"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border-none shrink-0"
            :class="filterType === 'all' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700 bg-transparent'">
            Todos
          </button>
          <button
            @click="filterType = 'latex'"
            type="button"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border-none shrink-0"
            :class="filterType === 'latex' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-500 hover:text-gray-700 bg-transparent'">
            LaTeX
          </button>
          <button
            @click="filterType = 'typst'"
            type="button"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border-none shrink-0"
            :class="filterType === 'typst' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-500 hover:text-gray-700 bg-transparent'">
            Typst
          </button>
        </div>
      </div>

      <div v-if="documentLoading" class="p-4 sm:p-6 flex flex-col gap-3">
        <div v-for="n in 4" :key="n" class="h-14 sm:h-12 rounded-xl bg-gray-50 animate-pulse border border-gray-100" />
      </div>

      <div
        v-else-if="filteredDocuments.length === 0"
        class="flex flex-col items-center justify-center py-16 sm:py-20 gap-4 text-center px-4">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center">
          <FileText :size="24" class="text-gray-400" />
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">
            {{ searchQuery ? 'No se encontraron documentos' : 'Sin documentos creados' }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            {{ searchQuery ? 'Prueba con otro término de búsqueda' : 'Crea tu primer documento en formato LaTeX o Typst' }}
          </p>
        </div>
        <button
          v-if="!searchQuery"
          @click="documentStore.showCreateModal = true"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] shadow-xs transition-colors cursor-pointer border-none">
          <Plus :size="14" />
          Crear documento
        </button>
      </div>

      <div v-else>
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr class="border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider">
                <th class="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th class="py-3 px-4 font-semibold">Nombre</th>
                <th class="py-3 px-4 font-semibold">Visibilidad</th>
                <th class="py-3 px-4 font-semibold">Tipo</th>
                <th class="py-3 px-4 font-semibold">Estado</th>
                <th class="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-xs">
              <tr
                v-for="doc in filteredDocuments"
                :key="doc.id"
                class="hover:bg-gray-50/70 transition-colors group">
                <td class="py-3.5 px-4 text-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </td>

                <td class="py-3.5 px-4">
                  <RouterLink
                    :to="doc.typeDocument === 'typst' ? { name: 'document-typst', params: { slug: doc.slug } } : { name: 'document', params: { slug: doc.slug } }"
                    class="no-underline flex flex-col">
                    <span class="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate max-w-xs md:max-w-md">
                      {{ doc.title }}
                    </span>
                    <span class="text-[11px] text-gray-400 mt-0.5">
                      Modificado {{ doc.updatedAt }}
                    </span>
                  </RouterLink>
                </td>

                <td class="py-3.5 px-4">
                  <div class="w-32 sm:w-36">
                    <DynamicDropdown
                      :modelValue="doc.visibilityId"
                      :options="visibilityOptions"
                      defaultLabel="Visibilidad"
                      :icon="Eye"
                      @change="(val) => changeVisibility(doc.slug, val)"
                    />
                  </div>
                </td>

                <td class="py-3.5 px-4">
                  <span
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border inline-flex items-center gap-1.5 shrink-0"
                    :class="doc.typeDocument === 'typst' ? 'bg-amber-50 text-amber-700 border-amber-200/80' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'">
                    <span class="w-1.5 h-1.5 rounded-full" :class="doc.typeDocument === 'typst' ? 'bg-amber-500' : 'bg-emerald-500'"></span>
                    {{ doc.typeDocument === 'typst' ? 'Typst' : 'LaTeX' }}
                  </span>
                </td>

                <td class="py-3.5 px-4">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Listo
                  </span>
                </td>

                <td class="py-3.5 px-4 text-right">
                  <div class="inline-flex items-center gap-1">
                    <button
                      @click.stop.prevent="copyUrl(doc.url, doc.slug)"
                      type="button"
                      title="Copiar enlace"
                      class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">
                      <Check v-if="copiedSlug === doc.slug" :size="14" class="text-emerald-600" />
                      <Copy v-else :size="14" />
                    </button>

                    <RouterLink
                      :to="doc.typeDocument === 'typst' ? { name: 'document-typst', params: { slug: doc.slug } } : { name: 'document', params: { slug: doc.slug } }"
                      title="Abrir editor"
                      class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                      <ChevronRight :size="15" />
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sm:hidden divide-y divide-gray-100">
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="p-4 flex flex-col gap-3 hover:bg-gray-50/70 transition-colors">
            
            <div class="flex items-start justify-between gap-2">
              <RouterLink
                :to="doc.typeDocument === 'typst' ? { name: 'document-typst', params: { slug: doc.slug } } : { name: 'document', params: { slug: doc.slug } }"
                class="no-underline flex-1 min-w-0">
                <span class="text-sm font-bold text-gray-900 block truncate">
                  {{ doc.title }}
                </span>
                <span class="text-[11px] text-gray-400 block mt-0.5">
                  {{ doc.updatedAt }}
                </span>
              </RouterLink>

              <span
                class="px-2 py-0.5 rounded-md text-[10px] font-semibold border inline-flex items-center gap-1 shrink-0"
                :class="doc.typeDocument === 'typst' ? 'bg-amber-50 text-amber-700 border-amber-200/80' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'">
                <span class="w-1 h-1 rounded-full" :class="doc.typeDocument === 'typst' ? 'bg-amber-500' : 'bg-emerald-500'"></span>
                {{ doc.typeDocument === 'typst' ? 'Typst' : 'LaTeX' }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2 pt-1 border-t border-gray-50">
              <div class="w-32">
                <DynamicDropdown
                  :modelValue="doc.visibilityId"
                  :options="visibilityOptions"
                  defaultLabel="Visibilidad"
                  :icon="Eye"
                  @change="(val) => changeVisibility(doc.slug, val)"
                />
              </div>

              <div class="flex items-center gap-1">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Listo
                </span>

                <button
                  @click.stop.prevent="copyUrl(doc.url, doc.slug)"
                  type="button"
                  title="Copiar enlace"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent">
                  <Check v-if="copiedSlug === doc.slug" :size="14" class="text-emerald-600" />
                  <Copy v-else :size="14" />
                </button>

                <RouterLink
                  :to="doc.typeDocument === 'typst' ? { name: 'document-typst', params: { slug: doc.slug } } : { name: 'document', params: { slug: doc.slug } }"
                  class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors inline-flex items-center justify-center">
                  <ChevronRight :size="16" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="paginated.totalPages > 1" class="px-4 sm:px-5 py-3 border-t border-gray-100 flex justify-center sm:justify-end">
        <PageNavigator
          :total="paginated.total"
          :page="paginated.page"
          :totalPages="paginated.totalPages"
          :changePage="changePage"
        />
      </div>
    </div>

    <BaseModal
      :hidden="documentStore.showCreateModal"
      title="Nuevo documento"
      confirm-label="Crear documento"
      :disabled="!newTitle.trim() || documentLoading"
      @cancel="closeModal"
      @confirm="handleCreate">
      <div class="flex flex-col gap-4">
        <InputField
          label="Título del documento"
          id="newTitle"
          v-model="newTitle"
          placeholder="Ej. Tesis de grado, Reporte mensual..."
          @keyup.enter="handleCreate"
        />

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-gray-700">Formato del documento</label>
          <DynamicDropdown
            v-model="selectedTypeDocument"
            :options="typeDocumentOptions"
            defaultLabel="Selecciona un formato"
          />
          <p class="text-[11px] text-gray-400">
            {{ selectedTypeDocument === 'typst' ? 'Typst es un motor tipográfico moderno, rápido y amigable.' : 'LaTeX es el estándar clásico para documentos científicos y académicos.' }}
          </p>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import {
  Plus,
  FileText,
  ChevronRight,
  Copy,
  Check,
  Eye,
  Search
} from 'lucide-vue-next';
import BaseModal from '@/components/molecules/BaseModal.vue';
import PageNavigator from "@/components/molecules/PageNavigator.vue";
import InputField from "@/components/molecules/InputField.vue";
import DynamicDropdown from "@/components/atoms/DynamicDropdown.vue";
import useDocumentStore, { latexDefaultTemplate, typstDefaultTemplate } from '@/store/document';

const router = useRouter();
const toast = useToast();
const documentStore = useDocumentStore();
const { documentList, visibilityDropdownOptions, visibilityList, documentLoading, documentForm, paginated } = storeToRefs(documentStore);

const newTitle = ref('');
const selectedTypeDocument = ref<string>('latex');
const copiedSlug = ref<string | null>(null);
const searchQuery = ref('');
const filterType = ref<'all' | 'latex' | 'typst'>('all');

const typeDocumentOptions = [
  { id: 'latex', label: 'LaTeX (.tex)' },
  { id: 'typst', label: 'Typst (.typ)' },
];

const filteredDocuments = computed(() => {
  return documentList.value.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.trim().toLowerCase());
    const matchesType =
      filterType.value === 'all' ||
      (filterType.value === 'latex' && (doc.typeDocument === 'latex' || !doc.typeDocument)) ||
      (filterType.value === 'typst' && doc.typeDocument === 'typst');
    return matchesSearch && matchesType;
  });
});

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
  documentStore.showCreateModal = false;
  newTitle.value = '';
  selectedTypeDocument.value = 'latex';
};

const handleCreate = async () => {
  if (!newTitle.value.trim()) return;
  const docType = selectedTypeDocument.value || 'latex';
  const defaultContent = docType === 'typst' ? typstDefaultTemplate : latexDefaultTemplate;
  const result = await documentStore.createDocument(newTitle.value.trim(), defaultContent, docType);
  if (result.isSuccess) {
    toast.success('Documento creado correctamente.');
    closeModal();
    if (docType === 'typst') {
      router.push({ name: 'document-typst', params: { slug: documentForm.value.slug } });
    } else {
      router.push({ name: 'document', params: { slug: documentForm.value.slug } });
    }
  } else {
    toast.error(result.getError?.msg || 'Error al crear el documento.');
  }
};

const changeVisibility = async (slug: string, visibilityId: number | string | undefined) => {
  const parsedVisibility = visibilityId !== undefined ? parseInt(visibilityId.toString(), 10) : 0;
  const result = await documentStore.updateDocumentVisibility(slug, parsedVisibility);
  if (result.isSuccess) {
    toast.success(result.getMessage || 'Visibilidad actualizada correctamente.');
  } else {
    toast.error(result.getError?.msg || 'Error al actualizar visibilidad.');
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="flex flex-col h-full bg-[#f1f3f5] font-sans overflow-hidden">
    <div
      v-if="documentStore.documentLoading"
      class="absolute inset-0 z-50 bg-black/15 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        class="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-lg text-sm text-gray-800">
        <span
          class="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
        Cargando documento...
      </div>
    </div>

    <header class="h-13 bg-white border-b border-gray-200/90 px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2 z-10">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <RouterLink
          :to="{ name: 'home' }"
          class="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors no-underline shrink-0">
          <ChevronLeft :size="14" />
          <span class="hidden sm:inline">Mis documentos</span>
          <span class="sm:hidden">Volver</span>
        </RouterLink>

        <span class="text-xs text-gray-300 hidden md:inline">/</span>

        <span class="text-xs font-medium text-gray-500 truncate hidden md:inline max-w-xs">
          {{ documentStore.documentDetails.title || 'Sin título' }}
        </span>
      </div>

      <div class="md:hidden flex items-center bg-gray-100 p-0.5 rounded-xl">
        <button
          @click="activeMobileTab = 'editor'"
          type="button"
          class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer border-none"
          :class="activeMobileTab === 'editor' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 bg-transparent'">
          Editor
        </button>
        <button
          @click="activeMobileTab = 'preview'"
          type="button"
          class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer border-none"
          :class="activeMobileTab === 'preview' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 bg-transparent'">
          Vista previa
        </button>
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          @click="copyUrl"
          type="button"
          title="Copiar URL"
          class="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border-none">
          <Check v-if="copied" :size="13" class="text-emerald-600" />
          <Copy v-else :size="13" />
          <span class="hidden lg:inline">{{ copied ? 'Copiado' : 'Copiar URL' }}</span>
        </button>

        <button
          @click="handleSave"
          :disabled="documentStore.documentLoading"
          type="button"
          title="Guardar documento"
          class="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors cursor-pointer border-none">
          <span
            v-if="documentStore.documentLoading"
            class="w-3 h-3 border-2 border-gray-400/40 border-t-gray-700 rounded-full animate-spin" />
          <Save v-else :size="13" />
          <span class="hidden sm:inline">Guardar</span>
        </button>

        <button
          @click="handleCompile"
          :disabled="documentStore.isCompiling"
          type="button"
          class="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] shadow-xs disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer border-none">
          <span
            v-if="documentStore.isCompiling"
            class="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
          <Play v-else :size="12" class="fill-current" />
          <span>{{ documentStore.isCompiling ? 'Compilando...' : 'Compilar' }}</span>
        </button>
      </div>
    </header>

    <div class="h-10 bg-white border-b border-gray-200/80 px-3 sm:px-4 flex items-center justify-between shrink-0 gap-1 overflow-x-auto no-scrollbar">
      <div class="flex items-center gap-0.5 shrink-0">
        <button
          @click="insertSnippet('\\section{', '}')"
          type="button"
          title="Encabezado 1 (Sección)"
          class="px-2 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          H1
        </button>
        <button
          @click="insertSnippet('\\subsection{', '}')"
          type="button"
          title="Encabezado 2 (Subsección)"
          class="px-2 py-1 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          H2
        </button>

        <div class="w-px h-4 bg-gray-200 mx-1" />

        <button
          @click="insertSnippet('\\textbf{', '}')"
          type="button"
          title="Negrita"
          class="p-1.5 font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          <Bold :size="14" />
        </button>
        <button
          @click="insertSnippet('\\textit{', '}')"
          type="button"
          title="Cursiva"
          class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          <Italic :size="14" />
        </button>
        <button
          @click="insertSnippet('\\underline{', '}')"
          type="button"
          title="Subrayado"
          class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          <Underline :size="14" />
        </button>

        <div class="w-px h-4 bg-gray-200 mx-1" />

        <button
          @click="insertSnippet('\\begin{itemize}\n  \\item ', '\n\\end{itemize}')"
          type="button"
          title="Lista con viñetas"
          class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          <List :size="14" />
        </button>
        <button
          @click="insertSnippet('\\begin{quote}\n', '\n\\end{quote}')"
          type="button"
          title="Cita"
          class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          <Quote :size="14" />
        </button>
        <button
          @click="insertSnippet('\\begin{equation}\n  ', '\n\\end{equation}')"
          type="button"
          title="Ecuación matemática"
          class="px-2 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          f(x)
        </button>
        <button
          @click="insertSnippet('\\begin{verbatim}\n', '\n\\end{verbatim}')"
          type="button"
          title="Bloque de código"
          class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border-none bg-transparent">
          <Code :size="14" />
        </button>
      </div>

      <div class="hidden sm:flex items-center gap-2 text-xs text-gray-400 shrink-0">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/80">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Editor LaTeX
        </span>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden bg-white relative">
      <div
        class="h-full flex-col overflow-hidden"
        :class="[
          'md:flex',
          activeMobileTab === 'editor' ? 'flex w-full md:w-auto' : 'hidden md:flex'
        ]"
        :style="isDesktop ? { width: leftWidth + 'px', flex: 'none' } : { width: '100%' }">
        <DocumentEditorPane ref="editorPaneRef" />
      </div>

      <div
        v-if="splitView"
        class="hidden md:flex items-center justify-center cursor-col-resize w-2 bg-gray-50 hover:bg-gray-100 transition-colors z-10 shrink-0 border-x border-gray-200/80"
        @mousedown="startDrag">
        <div class="w-0.5 h-6 bg-gray-300 rounded-full pointer-events-none"></div>
      </div>

      <div
        class="h-full flex-col overflow-hidden"
        :class="[
          'md:flex md:flex-1',
          activeMobileTab === 'preview' ? 'flex w-full' : 'hidden md:flex'
        ]">
        <DocumentPreviewPane />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
  ChevronLeft,
  Copy,
  Check,
  Save,
  Play,
  Bold,
  Italic,
  Underline,
  List,
  Quote,
  Code
} from 'lucide-vue-next';
import DocumentEditorPane from '@/features/document/DocumentEditorPane.vue';
import DocumentPreviewPane from '@/features/document/DocumentPreviewPane.vue';
import useDocumentStore, { latexDefaultTemplate } from '@/store/document';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const documentStore = useDocumentStore();

const editorPaneRef = ref<InstanceType<typeof DocumentEditorPane> | null>(null);
const copied = ref(false);
const activeMobileTab = ref<'editor' | 'preview'>('editor');
const isDesktop = ref(false);

const slug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
);

const splitView = ref(true);
const leftWidth = ref(0);
let dragging = false;
let startX = 0;
let startWidth = 0;

const insertSnippet = (before: string, after: string = '') => {
  activeMobileTab.value = 'editor';
  if (editorPaneRef.value && typeof editorPaneRef.value.insertText === 'function') {
    editorPaneRef.value.insertText(before, after);
  }
};

const copyUrl = async () => {
  const url = documentStore.documentDetails.url;
  if (!url) {
    toast.error('El documento no tiene una URL asignada.');
    return;
  }
  try {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    copied.value = true;
    toast.success('URL copiada al portapapeles.');
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    toast.error('No se pudo copiar la URL.');
  }
};

const handleSave = async () => {
  const result = await documentStore.updateDocument(
    slug.value,
    documentStore.documentDetails.title,
    documentStore.source,
  );
  if (result.isSuccess) {
    toast.success('Documento guardado correctamente.');
  } else {
    toast.error(result.getError?.msg || 'Error al guardar el documento.');
  }
};

const handleCompile = async () => {
  const result = await documentStore.compileLatex(undefined, slug.value);
  if (result.ok) {
    toast.success('Documento compilado correctamente.');
  } else {
    toast.error('Error al compilar el documento.');
  }
};

const getData = async () => {
  const result = await documentStore.getDocumentDetails(slug.value);
  if (!result.isSuccess) {
    toast.error('No se pudo cargar el documento.');
    router.replace({ name: 'home' });
    return;
  }

  if (documentStore.documentDetails.typeDocument === 'typst') {
    router.replace({ name: 'document-typst', params: { slug: slug.value } });
    return;
  }

  if (documentStore.documentDetails.content.trim() !== '') {
    documentStore.source = documentStore.documentDetails.content;
    await documentStore.compileLatex(undefined, slug.value);
  } else {
    documentStore.source = latexDefaultTemplate;
    await documentStore.compileLatex(undefined, slug.value);
  }
};

const updateDimensions = () => {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) {
    leftWidth.value = Math.floor(window.innerWidth / 2);
  }
};

const onMouseMove = (e: MouseEvent) => {
  if (!dragging) return;
  const delta = e.clientX - startX;
  leftWidth.value = Math.max(250, Math.min(startWidth + delta, window.innerWidth - 250));
};

const stopDrag = () => {
  dragging = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopDrag);
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
};

const startDrag = (e: MouseEvent) => {
  dragging = true;
  startX = e.clientX;
  startWidth = leftWidth.value;
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', stopDrag);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';
};

onMounted(() => {
  updateDimensions();
  window.addEventListener('resize', updateDimensions);
  getData();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDimensions);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopDrag);
});
</script>

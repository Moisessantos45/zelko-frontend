<template>
  <div class="flex flex-col h-full bg-(--color-bg) font-sans overflow-hidden">
    <div v-if="documentStore.documentLoading"
      class="absolute inset-0 z-50 bg-black/10 backdrop-blur-xs flex items-center justify-center">
      <div
        class="flex items-center gap-3 px-5 py-3 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-lg text-sm text-(--color-ink)">
        <span
          class="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        Cargando documento Typst...
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <TypstEditorPane :style="{ width: leftWidth + 'px', flex: 'none' }" />

      <div v-if="splitView"
        class="hidden md:flex items-center justify-center cursor-col-resize w-2 bg-(--color-surface) hover:bg-(--color-surface-alt) transition-colors z-10 shrink-0 border-x border-(--color-border)"
        @mousedown="startDrag">
        <div class="w-0.5 h-full bg-(--color-border) pointer-events-none"></div>
      </div>

      <TypstPreviewPane v-if="splitView" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import TypstEditorPane from '@/features/document/TypstEditorPane.vue';
import TypstPreviewPane from '@/features/document/TypstPreviewPane.vue';
import useDocumentStore, { typstDefaultTemplate } from '@/store/document';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const documentStore = useDocumentStore();

const slug = computed(() =>
  typeof route.params.slug === 'string' ? route.params.slug : '',
);

const splitView = ref(true);
const leftWidth = ref(0);
let dragging = false;
let startX = 0;
let startWidth = 0;

const getData = async () => {
  const result = await documentStore.getDocumentDetails(slug.value);
  if (!result.isSuccess) {
    toast.error('No se pudo cargar el documento.');
    router.replace({ name: 'home' });
    return;
  }

  if (documentStore.documentDetails.typeDocument === 'latex') {
    router.replace({ name: 'document', params: { slug: slug.value } });
    return;
  }

  if (documentStore.documentDetails.content.trim() !== '') {
    documentStore.source = documentStore.documentDetails.content;
    await documentStore.compileTypst(undefined, slug.value);
  } else {
    documentStore.source = typstDefaultTemplate;
    await documentStore.compileTypst(undefined, slug.value);
  }
};

const onMouseMove = (e: MouseEvent) => {
  if (!dragging) return;
  const delta = e.clientX - startX;
  leftWidth.value = Math.max(200, Math.min(startWidth + delta, window.innerWidth - 200));
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
  leftWidth.value = Math.floor(window.innerWidth / 2);
  getData();
});

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopDrag);
});
</script>

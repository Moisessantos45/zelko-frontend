<template>
  <section class="flex flex-col flex-1 overflow-hidden min-w-0 border-l border-(--color-border)">
    <div
      class="flex items-center justify-between h-9 px-3 bg-(--color-surface) border-b border-(--color-border) shrink-0 gap-2">
      <span class="text-xs text-(--color-ink-muted)">
        Pág. {{ pageCount > 0 ? '1 / ' + pageCount : '1' }}
      </span>

      <div class="flex items-center gap-1">
        <button @click="zoomOut"
          class="flex items-center justify-center w-6 h-6 rounded text-(--color-ink-secondary) hover:bg-(--color-surface-alt) transition-colors"
          title="Alejar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <span class="text-[10px] font-mono text-(--color-ink-muted) w-10 text-center select-none">
          {{ Math.round(zoom * 100) }}%
        </span>
        <button @click="zoomIn"
          class="flex items-center justify-center w-6 h-6 rounded text-(--color-ink-secondary) hover:bg-(--color-surface-alt) transition-colors"
          title="Acercar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button @click="zoomFit"
          class="flex items-center justify-center w-6 h-6 rounded text-(--color-ink-secondary) hover:bg-(--color-surface-alt) transition-colors ml-1"
          title="Ajustar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
        <button @click="compileAndPreview" :disabled="documentStore.isCompiling"
          class="ml-1 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-hover) transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          title="Compilar">
          <svg v-if="!documentStore.isCompiling" width="11" height="11" viewBox="0 0 24 24" fill="none">
            <polygon points="5,3 19,12 5,21" fill="currentColor" />
          </svg>
          <span v-else class="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
          {{ documentStore.isCompiling ? 'Compilando…' : 'Compilar' }}
        </button>
        <button @click="handleSave" :disabled="documentStore.documentLoading"
          class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-hover) transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer"
          title="Guardar">
          <span v-if="documentStore.documentLoading"
            class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <Save v-else :size="13" />
          Guardar
        </button>
      </div>

      <div class="flex items-center gap-2">
        <a v-if="documentStore.pdfUrl" :href="documentStore.pdfUrl" download="documento.pdf" target="_blank"
          class="flex items-center justify-center w-6 h-6 rounded text-(--color-ink-secondary) hover:bg-(--color-surface-alt) transition-colors"
          title="Descargar PDF">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <div v-else class="w-6 h-6"></div>
      </div>
    </div>

    <div class="flex-1 overflow-auto bg-(--color-surface-alt) flex flex-col items-center p-6 relative">
      <div v-if="documentStore.isCompiling"
        class="absolute inset-0 bg-(--color-surface-alt)/90 flex flex-col items-center justify-center gap-3 z-10">
        <span
          class="w-8 h-8 rounded-full border-3 border-(--color-border) border-t-(--color-primary) animate-spin"></span>
        <p class="text-xs text-(--color-ink-secondary) font-medium">Compilando documento…</p>
      </div>

      <div id="pdf-container" ref="pdfContainer" class="flex flex-col items-center gap-6"
        :class="{ hidden: !documentStore.compiledOk || !documentStore.pdfUrl }"></div>

      <div v-if="!documentStore.compiledOk && documentStore.errorLog"
        class="w-full max-w-2xl p-5 bg-red-950/90 text-red-200 border border-red-800/80 rounded-xl font-mono text-xs overflow-auto shadow-lg self-center">
        <div class="flex items-center gap-2 mb-3 text-red-400 font-bold text-sm border-b border-red-800/50 pb-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Error de Compilación LaTeX
        </div>
        <pre class="whitespace-pre-wrap leading-relaxed select-text">{{ documentStore.errorLog }}</pre>
      </div>

      <div v-if="!documentStore.pdfUrl && documentStore.compiledOk"
        class="w-full max-w-xl min-h-full bg-white rounded shadow-md border border-(--color-border) px-14 py-14">
        <h1 class="text-xl font-bold text-(--color-ink) text-center mb-1">Mi Documento</h1>
        <p class="text-xs text-(--color-ink-muted) text-center mb-6">Usuario · {{ today }}</p>

        <div class="border-l-2 border-(--color-primary) pl-4 py-2 bg-(--color-primary-subtle) rounded-r-lg mb-6">
          <p class="text-[10px] font-bold uppercase tracking-widest text-(--color-primary) mb-1">Resumen</p>
          <p class="text-xs text-(--color-ink-secondary) leading-relaxed">
            Este es el resumen del documento. Aquí puedes
            describir brevemente el contenido principal de tu trabajo.</p>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-(--color-ink) border-b border-(--color-border) pb-1.5 mb-2">1. Introducción
          </h2>
          <p class="text-xs text-(--color-ink-secondary) leading-relaxed">
            Escribe aquí la introducción de tu documento.
            Puedes usar <strong>negrita</strong>, <em>cursiva</em> y mucho más.</p>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-(--color-ink) border-b border-(--color-border) pb-1.5 mb-2">
            2. Metodología
          </h2>
          <h3 class="text-xs font-semibold text-(--color-ink-secondary) mb-1.5">
            2.1 Primer Apartado</h3>
          <p class="text-xs text-(--color-ink-secondary) leading-relaxed mb-2">
            El contenido de tu sección va aquí. Incluye ecuaciones como:
          </p>
          <div class="text-center italic text-sm text-(--color-ink) bg-(--color-surface-alt) rounded-lg py-2 px-4 mb-3">
            E = mc²</div>
          <h3 class="text-xs font-semibold text-(--color-ink-secondary) mb-1.5">2.2 Segundo Apartado</h3>
          <ul class="list-disc pl-5 text-xs text-(--color-ink-secondary) leading-relaxed space-y-0.5">
            <li>Primer elemento</li>
            <li>Segundo elemento</li>
            <li>Tercer elemento</li>
          </ul>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-(--color-ink) border-b border-(--color-border) pb-1.5 mb-2">
            3. Resultados
          </h2>
          <p class="text-xs text-(--color-ink-secondary) leading-relaxed">
            Los resultados de tu investigación van aquí.
          </p>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-(--color-ink) border-b border-(--color-border) pb-1.5 mb-2">4. Conclusiones
          </h2>
          <p class="text-xs text-(--color-ink-secondary) leading-relaxed">Escribe tus conclusiones finales.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Save } from 'lucide-vue-next'
import useDocumentStore from '@/store/document'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

const route = useRoute()
const toast = useToast()
const documentStore = useDocumentStore()
const pdfContainer = ref<HTMLElement | null>(null)
const pageCount = ref(1)
const zoom = ref(0.75)

const handleSave = async () => {
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  const result = await documentStore.updateDocument(
    slug,
    documentStore.documentDetails.title,
    documentStore.source,
  )
  if (result.isSuccess) {
    toast.success('Documento guardado correctamente.')
  } else {
    toast.error(result.getError?.msg || 'Error al guardar el documento.')
  }
}

const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

const ZOOM_MIN = 0.25
const ZOOM_MAX = 3
const ZOOM_STEP = 0.15

function zoomIn() {
  zoom.value = Math.min(ZOOM_MAX, +(zoom.value + ZOOM_STEP).toFixed(2))
}

function zoomOut() {
  zoom.value = Math.max(ZOOM_MIN, +(zoom.value - ZOOM_STEP).toFixed(2))
}

function zoomFit() {
  zoom.value = 0.75
}

watch(zoom, () => {
  if (documentStore.pdfUrl) {
    renderPDF(documentStore.pdfUrl)
  }
})

watch(
  () => documentStore.pdfUrl,
  (newUrl) => {
    if (newUrl) {
      renderPDF(newUrl)
    }
  },
)

async function renderPDF(url: string) {
  try {
    const pdf = await pdfjsLib.getDocument({ url }).promise
    pageCount.value = pdf.numPages

    const container = pdfContainer.value
    if (!container) return

    container.innerHTML = ''
    const scale = zoom.value

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.className = 'bg-white rounded shadow-md border border-(--color-border) my-2'
      const context = canvas.getContext('2d')

      if (!context) continue

      canvas.width = viewport.width
      canvas.height = viewport.height
      container.appendChild(canvas)

      await page.render({
        canvasContext: context,
        canvas,
        viewport,
      }).promise
    }
  } catch (err) {
    console.error('Error al renderizar el PDF con PDF.js:', err)
  }
}

async function compileAndPreview() {
  const result = await documentStore.compileLatex()

  if (!result.ok || !result.pdfUrl) {
    console.error(result.log || result.error)
    return
  }

  await renderPDF(result.pdfUrl)
}
</script>

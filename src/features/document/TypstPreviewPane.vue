<template>
  <section class="flex flex-col flex-1 overflow-hidden min-w-0 bg-[#f8fafc]">
    <div
      class="flex items-center justify-between h-10 px-4 bg-white border-b border-gray-200/80 shrink-0 gap-2">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
          Typst Preview
        </span>
        <span class="text-xs text-gray-400">
          Pág. {{ pageCount > 0 ? '1 / ' + pageCount : '1' }}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="zoomOut"
          type="button"
          class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
          title="Alejar">
          <Minus :size="13" />
        </button>

        <span class="text-xs font-mono text-gray-600 w-12 text-center select-none font-medium">
          {{ Math.round(zoom * 100) }}%
        </span>

        <button
          @click="zoomIn"
          type="button"
          class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
          title="Acercar">
          <Plus :size="13" />
        </button>

        <button
          @click="zoomFit"
          type="button"
          class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors ml-0.5 cursor-pointer border-none bg-transparent"
          title="Ajustar zoom">
          <Maximize2 :size="12" />
        </button>

        <div class="w-px h-4 bg-gray-200 mx-1.5" />

        <a
          v-if="documentStore.pdfUrl"
          :href="documentStore.pdfUrl"
          download="documento.pdf"
          target="_blank"
          class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Descargar PDF">
          <Download :size="13" />
        </a>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-3 sm:p-6 flex flex-col items-center relative">
      <div
        v-if="documentStore.isCompiling"
        class="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
        <span
          class="w-8 h-8 rounded-full border-3 border-gray-200 border-t-amber-600 animate-spin"></span>
        <p class="text-xs text-gray-600 font-semibold">Compilando documento Typst...</p>
      </div>

      <div
        id="pdf-container"
        ref="pdfContainer"
        class="flex flex-col items-center gap-6"
        :class="{ hidden: !documentStore.compiledOk || !documentStore.pdfUrl }"></div>

      <div
        v-if="!documentStore.compiledOk && documentStore.errorLog"
        class="w-full max-w-2xl p-5 bg-red-950/90 text-red-200 border border-red-800/80 rounded-2xl font-mono text-xs overflow-auto shadow-lg self-center">
        <div class="flex items-center gap-2 mb-3 text-red-400 font-bold text-sm border-b border-red-800/50 pb-2">
          <AlertCircle :size="16" />
          <span>Error de Compilación Typst</span>
        </div>
        <pre class="whitespace-pre-wrap leading-relaxed select-text">{{ documentStore.errorLog }}</pre>
      </div>

      <div
        v-if="!documentStore.pdfUrl && documentStore.compiledOk"
        class="w-full max-w-xl min-h-full bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 sm:p-8 md:p-12 relative flex flex-col">
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-1">
          {{ documentStore.documentDetails.title || 'Mi Documento Typst' }}
        </h1>
        <p class="text-xs text-gray-400 text-center mb-6">Usuario · {{ today }}</p>

        <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 mb-6">
          <MessageSquare :size="13" class="text-gray-400" />
          <span class="font-medium text-gray-600">Documento Typst listo para compilar</span>
        </div>

        <div class="p-3 bg-gray-50 rounded-xl mb-6 border border-gray-100">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">Resumen</p>
          <p class="text-xs text-gray-600 leading-relaxed">
            Este es el resumen del documento Typst. Aquí puedes describir brevemente el contenido principal de tu trabajo.
          </p>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5 mb-2">
            1. Introducción
          </h2>
          <p class="text-xs text-gray-600 leading-relaxed">
            Escribe aquí la introducción de tu documento. Puedes usar <strong>negrita</strong>, <em>cursiva</em> y mucho más.
          </p>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5 mb-2">
            2. Metodología
          </h2>
          <h3 class="text-xs font-semibold text-gray-700 mb-1.5">
            2.1 Primer Apartado
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed mb-2">
            El contenido de tu sección va aquí. Incluye ecuaciones como:
          </p>
          <div class="text-center italic text-sm text-gray-800 bg-gray-50 rounded-xl py-2.5 px-4 mb-3 border border-gray-100 font-mono">
            $ E = m c^2 $
          </div>
          <h3 class="text-xs font-semibold text-gray-700 mb-1.5">
            2.2 Segundo Apartado
          </h3>
          <ul class="list-disc pl-5 text-xs text-gray-600 leading-relaxed space-y-0.5">
            <li>Primer elemento</li>
            <li>Segundo elemento</li>
            <li>Tercer elemento</li>
          </ul>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5 mb-2">
            3. Resultados
          </h2>
          <p class="text-xs text-gray-600 leading-relaxed">
            Los resultados de tu investigación van aquí.
          </p>
        </div>

        <div class="mb-5">
          <h2 class="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5 mb-2">
            4. Conclusiones
          </h2>
          <p class="text-xs text-gray-600 leading-relaxed">
            Escribe tus conclusiones finales.
          </p>
        </div>

        <div class="mt-auto pt-6 flex justify-end">
          <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-600">
            Ready
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Minus,
  Plus,
  Maximize2,
  Download,
  AlertCircle,
  MessageSquare
} from 'lucide-vue-next'
import useDocumentStore from '@/store/document'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker()

const documentStore = useDocumentStore()
const pdfContainer = ref<HTMLElement | null>(null)
const pageCount = ref(1)
const zoom = ref(0.75)

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
      canvas.className = 'bg-white rounded-xl shadow-md border border-gray-200/90 my-2'
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
</script>

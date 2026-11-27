<template>
  <section class="flex flex-col flex-1 overflow-hidden min-w-0 bg-white">
    <div class="px-4 sm:px-6 pt-3 sm:pt-5 pb-3 flex flex-col gap-2.5 sm:gap-3 shrink-0 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <span class="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-[#0f4b3e] text-white shadow-2xs">
          LaTeX
        </span>

        <span class="text-xs text-gray-400 font-mono">{{ lineCount }} líneas</span>
      </div>

      <div class="flex items-center justify-between text-xs text-gray-500 pt-0.5 sm:pt-1">
        <div class="flex items-center gap-1.5">
          <span class="text-gray-400">Asignado a:</span>
          <span class="font-medium text-gray-800">Usuario</span>
        </div>

        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
            :class="documentStore.compiledOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 'bg-red-50 text-red-700 border-red-200/80'">
            <span class="w-1.5 h-1.5 rounded-full" :class="documentStore.compiledOk ? 'bg-emerald-600' : 'bg-red-600'"></span>
            {{ documentStore.compiledOk ? 'Compilado' : 'Error' }}
          </span>
        </div>
      </div>

      <div>
        <input
          v-model="documentStore.documentDetails.title"
          type="text"
          placeholder="Nombre del documento"
          class="text-lg sm:text-xl font-bold text-gray-900 border-none outline-none focus:ring-0 bg-transparent w-full p-0 placeholder:text-gray-300"
        />
      </div>
    </div>

    <div ref="editorEl" class="flex-1 overflow-hidden" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useDocumentStore from '@/store/document'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { latex } from 'codemirror-lang-latex'
import { tags } from '@lezer/highlight'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'

const zelkoTheme = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: '#ffffff',
    color: '#09090b',
  },
  '.cm-content': {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    lineHeight: '1.6',
    caretColor: '#059669',
    padding: '16px 20px',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#059669',
  },
  '.cm-activeLine': {
    backgroundColor: '#f0fdf4',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: '#dcfce7',
  },
  '.cm-gutters': {
    backgroundColor: '#ffffff',
    color: '#94a3b8',
    borderRight: '1px solid #f1f5f9',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f0fdf4',
    color: '#059669',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 10px 0 16px',
    minWidth: '3.5em',
  },
  '.cm-matchingBracket': {
    backgroundColor: '#dcfce7',
    outline: '1px solid #86efac',
  },
  '.cm-searchMatch': {
    backgroundColor: '#fef9c3',
    outline: '1px solid #ca8a04',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#fde68a',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
})

const zelkoHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#059669', fontWeight: '600' },
  { tag: tags.controlKeyword, color: '#059669', fontWeight: '600' },
  { tag: tags.operator, color: '#64748b' },
  { tag: tags.special(tags.variableName), color: '#059669' },
  { tag: tags.typeName, color: '#ca8a04' },
  { tag: tags.atom, color: '#ca8a04' },
  { tag: tags.number, color: '#ca8a04' },
  { tag: tags.definition(tags.variableName), color: '#0284c7' },
  { tag: tags.string, color: '#047857' },
  { tag: tags.special(tags.string), color: '#047857' },
  { tag: tags.comment, color: '#94a3b8', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#0f172a' },
  { tag: tags.tagName, color: '#0284c7' },
  { tag: tags.bracket, color: '#64748b' },
  { tag: tags.heading, color: '#059669', fontWeight: '700' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: '700' },
])

const documentStore = useDocumentStore()
const editorEl = ref<HTMLElement | null>(null)
const editorView = ref<EditorView | null>(null)
const syncingFromEditor = ref(false)

const lineCount = computed(() => documentStore.source.split('\n').length)

const insertText = (before: string, after: string = '') => {
  if (!editorView.value) return
  const view = editorView.value
  const { from, to } = view.state.selection.main
  const selectedText = view.state.sliceDoc(from, to)
  const replacement = before + (selectedText || '') + after
  view.dispatch({
    changes: { from, to, insert: replacement },
    selection: { anchor: from + before.length + (selectedText ? selectedText.length : 0) },
  })
  view.focus()
}

onMounted(() => {
  if (!editorEl.value) return

  editorView.value = new EditorView({
    state: EditorState.create({
      doc: documentStore.source,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        latex(),
        zelkoTheme,
        syntaxHighlighting(zelkoHighlight),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            syncingFromEditor.value = true
            documentStore.source = update.state.doc.toString()
            syncingFromEditor.value = false
          }
        }),
      ],
    }),
    parent: editorEl.value,
  })
})

watch(() => documentStore.source, (newVal) => {
  if (syncingFromEditor.value || !editorView.value) return
  const current = editorView.value.state.doc.toString()
  if (current !== newVal) {
    editorView.value.dispatch({
      changes: { from: 0, to: current.length, insert: newVal },
    })
  }
})

onUnmounted(() => {
  editorView.value?.destroy()
})

defineExpose({
  insertText,
})
</script>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
}
</style>

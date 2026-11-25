<template>
  <section class="flex flex-col flex-1 overflow-hidden min-w-0">
    <div
      class="flex items-center justify-between h-9 px-3 bg-(--color-surface) border-b border-(--color-border) gap-2 shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <input
          v-model="documentStore.documentDetails.title"
          type="text"
          placeholder="Sin título"
          class="text-xs font-semibold text-(--color-ink) bg-(--color-surface-alt) border border-(--color-border) rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-(--color-primary) focus:border-(--color-primary) transition-colors placeholder:text-(--color-ink-muted) min-w-0 max-w-xs sm:max-w-sm truncate"
        />
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 bg-amber-100 text-amber-700 border border-amber-200">
          Typst
        </span>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
          :class="documentStore.compiledOk ? 'bg-(--color-success-subtle) text-(--color-success)' : 'bg-(--color-danger-subtle) text-(--color-danger)'">
          {{ documentStore.compiledOk ? 'Compilado' : 'Error' }}
        </span>
      </div>
      <span class="text-xs text-(--color-ink-muted) shrink-0">{{ lineCount }} líneas</span>
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
import { typstLanguage } from './typstLanguage'
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
    caretColor: '#15803d',
    padding: '12px 0',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#15803d',
  },
  '.cm-activeLine': {
    backgroundColor: '#f0fdf4',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: '#dcfce7',
  },
  '.cm-gutters': {
    backgroundColor: '#fafafa',
    color: '#a1a1aa',
    borderRight: '1px solid #e4e4e7',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f0fdf4',
    color: '#15803d',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 12px',
    minWidth: '3em',
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
  '.cm-foldPlaceholder': {
    backgroundColor: '#f4f4f5',
    color: '#52525b',
    border: '1px solid #e4e4e7',
  },
  '.cm-tooltip': {
    backgroundColor: '#ffffff',
    border: '1px solid #e4e4e7',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
  },
  '.cm-tooltip-autocomplete ul li[aria-selected]': {
    backgroundColor: '#f0fdf4',
    color: '#09090b',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
})

const zelkoHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#15803d', fontWeight: '600' },
  { tag: tags.controlKeyword, color: '#15803d', fontWeight: '600' },
  { tag: tags.operator, color: '#52525b' },
  { tag: tags.special(tags.variableName), color: '#15803d' },
  { tag: tags.typeName, color: '#ca8a04' },
  { tag: tags.atom, color: '#ca8a04' },
  { tag: tags.number, color: '#ca8a04' },
  { tag: tags.definition(tags.variableName), color: '#2563eb' },
  { tag: tags.string, color: '#166534' },
  { tag: tags.special(tags.string), color: '#166534' },
  { tag: tags.comment, color: '#a1a1aa', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#09090b' },
  { tag: tags.tagName, color: '#2563eb' },
  { tag: tags.bracket, color: '#52525b' },
  { tag: tags.meta, color: '#a1a1aa' },
  { tag: tags.link, color: '#2563eb', textDecoration: 'underline' },
  { tag: tags.heading, color: '#15803d', fontWeight: '700' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: '700' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.bool, color: '#ca8a04' },
  { tag: tags.null, color: '#a1a1aa' },
  { tag: tags.className, color: '#ca8a04' },
  { tag: tags.propertyName, color: '#2563eb' },
  { tag: tags.function(tags.variableName), color: '#2563eb' },
  { tag: tags.namespace, color: '#ca8a04' },
])

const documentStore = useDocumentStore()
const editorEl = ref<HTMLElement | null>(null)
const editorView = ref<EditorView | null>(null)
const syncingFromEditor = ref(false)

const lineCount = computed(() => documentStore.source.split('\n').length)

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
        typstLanguage,
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
</script>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
}
</style>

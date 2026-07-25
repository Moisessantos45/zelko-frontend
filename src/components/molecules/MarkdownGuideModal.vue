<template>
	<BaseModal
		:hidden="show"
		title="Guía de Formato Markdown"
		:hide-footer="true"
		width="550px"
		@cancel="$emit('close')"
	>
		<div class="flex flex-col gap-4 text-left">
			<p class="text-sm text-(--color-ink-secondary)">
				Puedes usar Markdown para dar formato al texto de tus descripciones, notas y comentarios. Aquí tienes los formatos más comunes soportados:
			</p>

			<div class="overflow-x-auto rounded-lg border border-(--color-border)">
				<table class="w-full text-xs border-collapse">
					<thead>
						<tr class="bg-(--color-surface-alt) border-b border-(--color-border)">
							<th class="p-2.5 font-bold text-(--color-ink) w-[45%] text-left">Formato a escribir</th>
							<th class="p-2.5 font-bold text-(--color-ink) text-left">Resultado visual</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)"># Título Grande</td>
							<td class="p-2.5 text-base font-bold text-(--color-ink)">Título Grande</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">## Título Mediano</td>
							<td class="p-2.5 text-sm font-bold text-(--color-ink)">Título Mediano</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">**texto en negrita**</td>
							<td class="p-2.5 font-bold text-(--color-ink)">texto en negrita</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">*texto en cursiva*</td>
							<td class="p-2.5 italic text-(--color-ink-secondary)">texto en cursiva</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">- Elemento de lista</td>
							<td class="p-2.5 text-(--color-ink-secondary)">
								<ul class="list-disc pl-4"><li>Elemento de lista</li></ul>
							</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">1. Elemento ordenado</td>
							<td class="p-2.5 text-(--color-ink-secondary)">
								<ol class="list-decimal pl-4"><li>Elemento ordenado</li></ol>
							</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">[Enlace](https://...)</td>
							<td class="p-2.5 text-(--color-primary) underline">Enlace</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">`código en línea`</td>
							<td class="p-2.5">
								<code class="bg-(--color-surface-alt) px-1 py-0.5 rounded text-xs text-(--color-danger)">código en línea</code>
							</td>
						</tr>
						<tr class="border-b border-(--color-border)">
							<td class="p-2.5 font-mono text-(--color-ink-secondary)">&gt; Texto citado</td>
							<td class="p-2.5 border-l-2 border-(--color-primary) pl-2 italic text-(--color-ink-muted)">
								Texto citado
							</td>
						</tr>
						<tr>
							<td class="p-2.5 font-mono text-(--color-ink-secondary) whitespace-pre-wrap">```js
const x = 10;
```</td>
							<td class="p-2.5">
								<pre class="bg-(--color-surface-alt) p-1.5 rounded text-[10px] border border-(--color-border) font-mono">const x = 10;</pre>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="flex justify-end mt-2">
				<button
					type="button"
					@click="$emit('close')"
					class="px-4 py-2 text-xs font-semibold text-white bg-(--color-primary) hover:bg-(--color-primary-hover) rounded-lg transition-colors cursor-pointer outline-none border-none"
				>
					Entendido
				</button>
			</div>
		</div>
	</BaseModal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";

defineProps<{
	show: boolean;
}>();

defineEmits(["close"]);
</script>

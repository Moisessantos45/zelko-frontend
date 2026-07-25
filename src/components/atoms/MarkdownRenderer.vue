<template>
	<div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import DOMPurify from "dompurify";
import { marked } from "marked";
import { computed } from "vue";

const props = defineProps<{
	content?: string;
}>();

const renderedHtml = computed(() => {
	if (!props.content) return "";
	try {
		const rawHtml = marked.parse(props.content, { async: false }) as string;
		return DOMPurify.sanitize(rawHtml);
	} catch (error) {
		console.error("Error rendering markdown:", error);
		return props.content;
	}
});
</script>

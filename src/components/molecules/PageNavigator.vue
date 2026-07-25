<template>
    <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-5 sm:px-1 px-5">
        <button id="prev-page" :disabled="page <= 1"
            class="flex items-center gap-1.5 bg-transparent border border-(--color-border) rounded-lg sm:px-4 px-3 sm:py-2 py-1.5 text-sm text-(--color-ink-secondary) hover:text-(--color-ink) hover:border-(--color-ink-muted) transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            @click="changePage(page - 1)">
            <ChevronLeft :size="16" />
            Anterior
        </button>

        <div class="flex items-center gap-1">
            <button v-for="item in visiblePages" :key="item" :id="`page-${item}`"
                class="w-9 h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                :class="item === page
                    ? 'bg-(--color-primary) text-(--color-accent) border border-(--color-primary) font-semibold shadow-sm'
                    : 'bg-transparent border border-transparent text-(--color-ink-secondary) hover:border-(--color-border) hover:text-(--color-ink)'"
                @click="changePage(item)">
                {{ item }}
            </button>
        </div>

        <button id="next-page" :disabled="page >= totalPages"
            class="flex items-center gap-1.5 bg-transparent border border-(--color-border) rounded-lg sm:px-4 px-3 sm:py-2 py-1.5 text-sm text-(--color-ink-secondary) hover:text-(--color-ink) hover:border-(--color-ink-muted) transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            @click="changePage(page + 1)">
            Siguiente
            <ChevronRight :size="16" />
        </button>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
    total: number;
    page: number;
    totalPages: number;
    changePage: (page: number) => void;
}>();


const visiblePages = computed(() => {
    const total = props.totalPages
    const current = props.page
    const pages: number[] = []
    const delta = 2
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        pages.push(i)
    }
    return pages
})


</script>
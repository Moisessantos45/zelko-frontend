<template>
    <header class="h-16 px-8 flex items-center justify-between ml:justify-end z-30 bg-(--color-surface)/80 backdrop-blur-md border-b border-(--color-border)">

        <button @click="$emit('toggle-sidebar')" class="w-9 h-9 rounded-xl flex items-center justify-center text-(--color-ink-secondary)
                       border border-(--color-border) bg-(--color-surface-alt)
                       transition-colors hover:text-(--color-primary) hover:border-(--color-primary)/25 outline-none
                       ml:hidden shrink-0 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75"
                stroke="currentColor" class="w-4.5 h-4.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <button @click="$emit('logout')"
            class="ml-2 px-4 py-2 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer">
            Cerrar sesión
        </button>

    </header>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    userName: string;
    image: string;
}>();

defineEmits<{
    (e: 'toggle-sidebar'): void;
    (e: 'logout'): void;
}>();
</script>
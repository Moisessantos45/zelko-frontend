<template>
    <div :class="[...resolvedWrapperClass, isCheckbox ? 'flex items-center gap-2 cursor-pointer py-1' : 'flex flex-col gap-1.5']">
        <template v-if="isCheckbox">
            <InputAtom :id="id" :required="required" v-model="model" v-bind="$attrs" />
            <LabelAtom v-if="label" :label="label" :id="id" class="mb-0! select-none cursor-pointer text-sm font-medium" />
        </template>
        <template v-else>
            <LabelAtom v-if="label" :label="label" :id="id" />
            <InputAtom :id="id" :required="required" v-model="model" v-bind="$attrs" />
        </template>
    </div>
</template>

<script setup lang="ts">
import InputAtom from '@/components/atoms/BaseInput.vue';
import LabelAtom from '@/components/atoms/BaseLabel.vue';
import { computed, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

interface Props {
    label: string;
    id: string;
    required?: boolean;
    className?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
    required: false,
    className: '',
    label: ''
})

const attrs = useAttrs();
const isCheckbox = computed(() => attrs.type === 'checkbox');

const resolvedWrapperClass = computed(() =>
    Array.isArray(props.className) ? props.className : [props.className]
)

const model = defineModel<string | number | null | boolean>();
</script>

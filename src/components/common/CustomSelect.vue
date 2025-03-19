<template>
    <div class="custom-select-component">
        <button class="custom-select" ref="customSelectRef" type="button">
            <div class="selected-item">
                <slot name="selected-item">
                    <img :src="customValue?.icon" v-if="customValue?.icon" />
                    {{ customValue?.[selectedLabel] || noSelectedTitle }}
                </slot>
            </div>
    
            <div class="option-menu" :style="optionMenuStyles">
                <slot name="option-menu">
                    <div class="option" v-for="(option, index) in options" :key="index"
                        @click="selectOption(option)"
                    >
                        <img :src="option.icon" v-if="option.icon" />
                        {{ option[label] }}
                    </div>
                </slot>
            </div>
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["update:modelValue", "change"]);

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => null
    },
    noSelectedTitle: {
        type: String,
        default: "Select..."
    },
    options: {
        type: Array,
        default: () => []
    },
    placement: {
        type: String,
        default: "right"
    },
    label: {
        type: String,
        default: "title"
    },
    selectedLabel: {
        type: String,
        default: "title"
    },
    optionValue: {
        type: String,
        default: "value"
    },
    nullWithEmptyValue: {
        type: Boolean,
        default: false
    }
});

const customSelectRef = ref(null);

// const customList = ref([
//     { title: "EN", value: "en" },
//     { title: "VI", value: "vi" }
// ]);

const customValue = computed({
    get() {
        // return props.modelValue;
        return props.options?.find(option => option.value === props.modelValue?.value) || props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", props.nullWithEmptyValue && !newValue?.value ? null : newValue);
        if(props.modelValue?.[props.optionValue] !== newValue?.[props.optionValue]) {
            emit("change");
        }
    }
});

const optionMenuStyles = computed(() => {
    let result = {};
    if(props.placement == "left") {
        result.left = 0;
        result.textAlign = "left";
    }
    if(props.placement == "right") {
        result.right = 0;
        result.textAlign = "right";
    }
    return result;
});

const selectOption = (option) => {
    customValue.value = option;
    customSelectRef.value?.blur?.();
}

defineExpose({ selectOption });
</script>
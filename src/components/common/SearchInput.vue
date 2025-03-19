<template>
    <div class="search">
        <div class="search-input" @click="inputRef?.focus()">
            <input
                v-model="keyword"
                :placeholder="placeholder || $t('global.search_placeholder')"
                :disabled="disabled"
            />
            <img src="@/assets/images/rabbit/icons/magnify.svg" class="search-input-icon" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useGameStore } from "@/stores/game";
import { useDebounce } from "@/utils/debounce";
import { connectServer, connectGameServer } from "@/utils/server";
import Server from "@/components/common/Server.vue";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
    placeholder: {
        type: String,
        default: ""
    },
    disabled: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: ""
    }
});

const keyword = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits("update:modelValue", newValue);
    }
});
</script>
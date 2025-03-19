<template>
    <div class="progress-bar-component">
        <div class="filled" :style="filledStyles"></div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    total: {
        type: Number,
        default: 1
    },
    remain: {
        type: Number,
        default: 0
    }
});

const remainPercentage = computed(() => props.remain / props.total * 100);
const filledColor = computed(() => remainPercentage.value > 50 ? "#0D9D00" : (remainPercentage.value > 25 ? "#EDBC22" : "#AD1519"));
const filledStyles = computed(() => ({
    width: remainPercentage.value ? `${remainPercentage.value}%` : "4px",
    backgroundColor: filledColor.value
}));
</script>
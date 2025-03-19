<template>
    <div class="payment-top">
        <div class="payment-top-icon" @click="emits('back')">
            <img src="@/assets/images/rabbit/icons/arrow-right.svg" />
        </div>
        <div>
            <p class="payment-top-title">{{ title }}</p>
            <p class="payment-top-subtitle">{{ subtitle }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    subtitle: String
});

const emits = defineEmits(["back"]);
</script>

<style lang="scss">
.payment-top {
    --icon-size: 32px;
    display: flex;
    &-icon {
        width: var(--icon-size);
        min-width: var(--icon-size);
        height: var(--icon-size);
        border: 1px solid #707070;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 16px;
        transform: rotate(180deg);
    }
    &-title {
        font-size: var(--text-xl);
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
    }
    &-subtitle {
        font-size: var(--text-xs);
        color: #707070;
    }
}
</style>
<template>
    <div class="switch">
        <input type="checkbox" class="switch-input" v-model="value" />
        <div class="switch-box"></div>
        <label class="switch-label">{{ label }}</label>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    modelValue: Boolean,
    label: {
        type: String,
        default: ""
    }
});

const emits = defineEmits(["update:modelValue"]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits("update:modelValue", newValue);
    }
})
</script>

<style lang="scss">
.switch {
    --color: #707070;

    position: relative;
    display: flex;
    align-items: center;
    min-width: 102px;

    &-input {
        position: absolute;
        inset: 0;
        width: 100%;
        outline: none;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;

        &:checked {

            &+.switch-box,
            &~.switch-label {
                --color: var(--primary);
            }

            &+.switch-box {
                &::before {
                    left: calc(100% - 3px);
                    transform: translate(-100%, -50%);
                }
            }
        }
    }

    &-box,
    &-label {
        pointer-events: none;
    }

    &-box {
        width: 45px;
        height: 24px;
        background-color: transparent;
        border: 1px solid var(--color);
        border-radius: 28px;
        outline: none;
        transition: 0.5s;
        position: relative;

        &::before {
            content: '';
            width: 16px;
            height: 16px;
            background-color: var(--color);
            border-radius: 28px;
            position: absolute;
            top: 50%;
            left: 3px;
            transform: translateY(-50%);
            transition: var(--transition);
        }
    }

    &-label {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--color);
        margin-left: 4px;
    }
}
</style>
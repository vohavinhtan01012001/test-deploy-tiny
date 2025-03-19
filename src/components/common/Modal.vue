<template>
    <div class="modal-component" :class="visible ? 'visible' : 'invisible'" v-if="existed">
        <div class="layout" @click="close"></div>
        <div class="flex flex-col modal" :class="{ 'visible': visible }">
            <div class="flex items-center modal-header">
                <p class="modal-title">{{ title }}</p>
                <div class="icon-btn close-btn" @click="closeFromIcon">
                    <img src="@/assets/images/rabbit/icons/close.svg" />
                </div>
            </div>
            <div class="modal-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["closed", "close-from-icon"]);

const props = defineProps({
    solidBackground: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ""
    }
});

const visible = ref(false);
const existed = ref(false);

const open = () => {
    visible.value = true;
    existed.value = true;
    document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
}

const close = () => {
    visible.value = false;
    document.getElementsByTagName("body")[0].classList.remove("overflow-hidden");
    emit("closed");
    setTimeout(() => {
        existed.value = false;
    }, 300);
}

const closeFromIcon = () => {
    close();
    emit("close-from-icon");
}

defineExpose({ open, close });
</script>

<style lang="scss">
.modal-component {
    --header-height: 118px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1111;

    .layout {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(72, 71, 72, 0.65);
    }

    &.invisible {
        pointer-events: none;
        opacity: 0;
        transition-delay: 0.15s;
    }

    &.visible {
        opacity: 1;
    }

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1000;
        overflow: hidden;
        opacity: 0;
        transform: translate(-50%, -50%);
        padding: 10px;
        border-radius: 16px;
        max-width: calc(100% - 40px);
        background: #141414;
        transition: 0.15s ease-out;
        transition-delay: 0.1s;
        animation: hide .7s forwards;

        &.visible {
            animation: show .7s;
            display: flex;
            top: 50%;
            opacity: 1;
        }

        .modal-content {
            position: relative;
            overflow: auto;
            padding: 0 10px;
            min-height: 200px;
        }

        .modal-title {
            font-size: 24px;
            font-weight: 700;
        }

        .close-btn {
            background: transparent;
            margin-left: auto;
        }

        @keyframes show {
            0% {
                top: -200px;
            }

            60% {
                top: calc(50% + 20px);
            }

            100% {
                top: 50%;
            }
        }

        @keyframes hide {
            0% {
                top: 50%;
            }

            ;

            100% {
                top: -200px;
            }

            ;
        }
    }
}
</style>
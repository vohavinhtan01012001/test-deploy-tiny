<template>
    <div class="search-modal-component" :class="visible ? 'visible' : 'invisible'">
        <div class="layout" :class="{'has-bg': solidBackground}" @click="close"></div>
        <div class="flex flex-col modal" :class="{'visible' : visible, 'solid-bg': solidBackground}">
            <div class="modal-content">
                <GlobalSearchSelect ref="globalSearchSelectRef" @server-connected="visible = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import GlobalSearchSelect from "@/components/common/GlobalSearchSelect.vue";

const emit = defineEmits(["closed", "close-from-icon"]);

const props = defineProps({
    solidBackground: {
        type: Boolean,
        default: false
    }
});

const visible = ref(false);
const globalSearchSelectRef = ref(null);

const open = async () => {
    visible.value = true;
    document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
    await nextTick();
    globalSearchSelectRef.value?.focus();
}

const close = () => {
    visible.value = false;
    document.getElementsByTagName("body")[0].classList.remove("overflow-hidden");
    emit("closed");
}

const closeFromIcon = () => {
    close();
    emit("close-from-icon");
}

defineExpose({ open, close });
</script>

<style lang="scss">
.search-modal-component {
    --header-height: 118px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    // z-index: 1111;
    z-index: 1000;
    .layout {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        &.has-bg {
            background: rgba(0, 1, 23, 0.8);
            backdrop-filter: blur(10px);
        }
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
        left: 50%;
        z-index: 1000;
        overflow: hidden;
        opacity: 0;
        transform: translate(-50%, 0);
        // padding: 10px;
        border-radius: 10px;
        max-width: calc(100% - 40px);
        width: 593px;
        // background: rgba(0, 1, 23, 0.8);
        backdrop-filter: blur(5px);
        transition: 0.15s ease-out;
        transition-delay: 0.1s;
        &.visible {
            display: flex;
            opacity: 1;
        }
        .modal-content {
            position: relative;
            overflow: auto;
            // padding: 0 10px;
        }
    }
}
</style>
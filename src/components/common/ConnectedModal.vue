<template>
    <modal class="renew-inform-modal" solid-background ref="modalRef" @closed="handleDisconnect">
        <div class="flex-center flex-col renew-inform-content">
            <p class="svn-avo-bold text-2xl text-center mb-10">
                Bạn đã kết nối server {{ selectedServer?.name }}<br />
                Hãy mở game và cảm nhận!
            </p>
            <button class="btn btn-primary" @click="close">
                <span class="text-lg btn-text">OK</span>
            </button>
        </div>
    </modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServerStore } from "@/stores/server";
import Modal from "@/components/common/Modal.vue";

const emit = defineEmits("disconnect");

const serverStore = useServerStore();

const modalRef = ref(null);
const selectedServer = computed(() => serverStore.selectedServer);

const open = () => {
    modalRef.value?.open();
}

const close = () => {
    modalRef.value?.close();
}

const handleDisconnect = () => {
    emit("disconnect");
}

defineExpose({ open, close });
</script>

<style lang="scss">
.renew-inform-modal {
    .modal {
        width: 706px;
        .renew-inform-content {
            padding: 56px 0 68px;
        }
    }
}
</style>
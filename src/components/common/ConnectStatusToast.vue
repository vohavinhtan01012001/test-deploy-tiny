<template>
    <div class="toast-component p-2 px-4" v-if="status">
        <div class="flex items-center">
            <template v-if="status == 'ping'">
                <div class="icon loading"></div>
                <p>{{ $t("global.ping_waiting") }}</p>
            </template>
            <template v-if="status == 'restore'">
                <div class="icon loading"></div>
                <p>{{ $t("global.reconnecting") }}</p>
            </template>
            <template v-if="status == 'connected'">
                <img src="@/assets/images/icons/check-circle-success.svg" class="icon success-icon" />
                <p>{{ $t("global.connected_toast") }}</p>
                <template v-if="isConnected && selectedServer">
                    <p>&nbsp;-&nbsp;{{ selectedServer.name || selectedServer.tiny_name }} ({{ selectedServer.country_code || selectedServer.tiny_country }})</p>
                </template>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useServerStore } from "@/stores/server";

const serverStore = useServerStore();

const status = computed(() => serverStore.toastStatus);
const isConnected = computed(() => serverStore.isConnected);
const selectedServer = computed(() => serverStore.selectedServer);
</script>

<style lang="scss">
.toast-component {
    --icon-width: 20px;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 1, 23, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    z-index: 100;

    .icon {
        margin-right: 0.75rem;
    }

    .loading {
        width: var(--icon-width);
        --b: 4px; /* the border thickness */
        aspect-ratio: 1;
        border-radius: 50%;
        padding: 1px;
        background: conic-gradient(#0000 10%,#FFFFFF) content-box;
        mask:
            repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg),
            radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
        -webkit-mask:
            repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg),
            radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
        -webkit-mask-composite: destination-in;
        mask-composite: intersect;
        animation:s4 1s infinite steps(10);
    }
    @keyframes s4 {to{transform: rotate(1turn)}}

    .success-icon {
        width: var(--icon-width);
        transition: 0.3s ease-in-out;
        animation: bounce 0.3s linear;
    }
    @keyframes bounce {0%{transform: scale(0.7)}50%{transform: scale(1.3)}100%{transform: scale(1)}}
}
</style>
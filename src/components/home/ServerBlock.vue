<template>
    <div class="flex flex-col server-block">
        <div class="flex flex-col content-block server-block-recent" v-if="recentServers?.length">
            <p class="text-base font-semibold mb-4">
                {{ $t("home.recent_server") }}
                <span class="block-count server-block-count" v-if="recentServers.length">{{ String(recentServers.length).padStart(2, "0") }}</span>
            </p>
            <QuickServerSelect
                :servers="recentServersReverse"
                @connect="handleQuickConnect"
            />
        </div>

        <div class="content-block server-block-select">
            <p class="text-sm mb-1">{{ $t("home.select_server") }}</p>
            <ServerSelect
                :servers="servers"
                v-model="currentServer"
                class="mb-4"
            />

            <div class="server-block-recommend" v-if="!recentServers?.length && recommendServers?.length">
                <p class="text-sm mb-2">{{ $t("home.recommend_server") }}</p>
                <QuickServerSelect
                    :servers="recommendServers"
                    @connect="handleQuickConnect"
                />
            </div>

            <button class="btn btn-primary server-block-connect" @click="handleConnect">
                {{ $t("global.connect_btn") }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect, onBeforeMount, watch } from "vue";
import { connectServer } from "@/utils/server";
import { useServerStore } from "@/stores/server";
import { getStorageItem, setStorageItem } from '@/utils/storage';
import ServerSelect from "@/components/home/ServerSelect.vue";
import QuickServerSelect from "@/components/home/QuickServerSelect.vue";

const serverStore = useServerStore();

const currentServer = ref(null);
const isFirstTime = ref(true);
const recentServers = ref([]);

const servers = computed(() => serverStore.serverList);
const isConnected = computed(() => serverStore.isConnected);
const selectedServer = computed(() => serverStore.selectedServer);
const machineId = computed(() => serverStore.machineId);

const recentServersReverse = computed(() => recentServers.value?.slice()?.reverse());
const recommendServers = computed(() => servers.value?.sort((a, b) => a.ping - b.ping)?.slice(0, 4));

const handleQuickConnect = (server) => {
    currentServer.value = server;
    handleConnect();
}

const handleConnect = () => {
    if(!currentServer.value) return;

    connectServer(currentServer.value);
}

const restoreConnection = () => {
    serverStore.getSelectedServerFromStorage();

    if(!isConnected.value && selectedServer.value) {
        serverStore.setToastStatus("restore");
        currentServer.value = { ...selectedServer.value };
        handleConnect();
    }
}

const setRecentServers = (server) => {
    if(!server) return;
    recentServers.value = (recentServers.value || []).filter?.(item => item.id !== server?.id);
    recentServers.value.push(server);
    setStorageItem("recentServers", recentServers.value);
}

watchEffect(() => {
    if(machineId.value && isFirstTime.value && servers.value?.length) {
        isFirstTime.value = false;
        restoreConnection();
    }
});

watchEffect(() => {
    if(isConnected.value && selectedServer.value) {
        currentServer.value = { ...selectedServer.value };
        // setRecentServers(currentServer.value);
    }
});

watch(selectedServer, () => {
    setRecentServers(selectedServer.value);
}, { immediate: true, deep: true });

onBeforeMount(async () => {
    const storageRecentServers = await getStorageItem("recentServers");
    recentServers.value = storageRecentServers || [];
});
</script>
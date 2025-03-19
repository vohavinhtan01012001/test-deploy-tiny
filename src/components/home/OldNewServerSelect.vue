<template>
    <div class="new-server-select-component">
        <p class="svn-agency-fb-bold uppercase mb-1.5">{{ $t("home.select_server") }}</p>
        <div class="flex justify-center relative mt-6 mb-4">
            <!-- <custom-select class="server-select" ref="customSelectRef" v-model="currentServer"
                no-selected-title="Click vào đây để lựa chọn server">
                <template #selected-item>
                    <div class="w-full flex items-center" v-if="currentServer">
                        <img :src="'https://flagsapi.com/' + currentServer.country_code + '/flat/64.png'" class="flag-img"
                            v-if="currentServer.country_code && currentServer.country_code != 'EU' && currentServer.country_code != 'UK'"
                            :alt="currentServer.country_code" />
                        <img src="@/assets/images/flag.png" class="flag-img" v-else />
                        <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ currentServer.name || "Unknown" }}</p>
                        <p class="text-xs ml-2.5 country-code">{{ currentServer.country_code || "Unknown" }}</p>
                        <p class="text-xs ml-2.5 ping">{{ currentServer.ping || "Unknown" }} ms</p>
                    </div>
                </template>
                <template #option-menu>
                    <div class="flex items-center server-item" v-for="(server, index) in serverList" :key="index"
                        @click="customSelectRef?.selectOption(server)">
                        <img :src="'https://flagsapi.com/' + server.country_code + '/flat/64.png'" class="flag-img"
                            v-if="server.country_code && server.country_code != 'EU' && server.country_code != 'UK'"
                            :alt="server.country_code" />
                        <img src="@/assets/images/flag.png" class="flag-img" v-else />
                        <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ server.name || "Unknown" }}</p>
                        <p class="text-xs ml-2.5 country-code">{{ server.country_code || "Unknown" }}</p>
                        <p class="text-xs ml-2.5 ping">{{ server.ping || "Unknown" }} ms</p>
                    </div>
                </template>
            </custom-select> -->
            <v-select v-model="currentServer" :options="serverList" @open="handleOpen" @close="handleClose" label="name"
                class="server-v-select" :clearable="false" :placeholder="$t('home.click_to_select_server_placeholder')"
                :class="{ 'empty': !currentServer }">
                <template #selected-option="{ name, country_code, ping }">
                    <div class="w-full selected-item">
                        <div class="flex items-center">
                            <img :src="'https://flagsapi.com/' + country_code + '/flat/64.png'" class="flag-img"
                                v-if="country_code && country_code != 'EU' && country_code != 'UK'" :alt="country_code" />
                            <img src="@/assets/images/flag.png" class="flag-img" v-else />
                            <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ name || "Unknown" }}</p>
                        </div>
                        <p class="text-xs ml-2.5 country-code">{{ country_code || "Unknown" }}</p>
                        <div class="svn-avo-bold text-xs flex items-center ml-2.5" :class="getPingStyle(ping)">
<!--                            <img src="@/assets/images/icons/wifi.svg" class="mr-1.5" />-->
                            <span>
                                {{ ping || "Unknown" }}ms
                            </span>
                        </div>
                    </div>
                </template>
                <template #option="{ name, country_code, ping, is_favorite, id }">
                    <div class="w-full server-item">
                        <div class="flex items-center">
                            <div @click.stop="updateFavoriteServer(id)">
                                <img src="@/assets/images/icons/heart-filled-primary.svg" class="heart-icon" v-if="is_favorite" />
                                <img src="@/assets/images/icons/heart-primary.svg" class="heart-icon" v-else />
                            </div>
                            <img :src="'https://flagsapi.com/' + country_code + '/flat/64.png'" class="flag-img"
                                v-if="country_code && country_code != 'EU' && country_code != 'UK'" :alt="country_code" />
                            <img src="@/assets/images/flag.png" class="flag-img" v-else />
                            <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ name || "Unknown" }}</p>
                        </div>
                        <p class="text-xs ml-2.5 country-code">{{ country_code || "Unknown" }}</p>
                        <div class="svn-avo-bold text-10px flex items-center ml-2.5" :class="getPingStyle(ping)">
<!--                            <img src="@/assets/images/icons/wifi.svg" class="mr-1.5" />-->
                            <span>
                                {{ ping || "Unknown" }} ms
                            </span>
                        </div>
                    </div>
                </template>
                <template #open-indicator="{ attributes }">
                    <img src="@/assets/images/icons/triangle-down-blue.svg" v-bind="attributes" />
                </template>
                <!-- <template #no-options="{ search, searching, loading }"> -->
                <template #no-options>
                    {{ $t("home.wait_for_getting_server") }} 
                </template>
            </v-select>
            <button class="btn btn-primary connect-btn" :class="{ 'btn-disabled': !currentServer }"
                :disabled="!currentServer" @click="handleConnect">
                <span class="btn-text">{{ $t("global.connect_btn") }}</span>
            </button>
        </div>
    </div>

    <!-- <connected-modal ref="connectedModalRef" @disconnect="handleDisconnect" /> -->
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, watchEffect } from "vue";
import { useGameStore } from "@/stores/game";
import { useServerStore } from "@/stores/server";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { useUserStore } from "@/stores/user";
import ConnectedModal from "@/components/common/ConnectedModal.vue";
import CustomSelect from "@/components/common/CustomSelect.vue";

const gameStore = useGameStore();
const serverStore = useServerStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const connectedModalRef = ref(null);
const currentServer = ref(null);
const customSelectRef = ref(null);

const serverList = computed(() => getSortedServerListByFavorite(serverStore.serverList));
// const serverList = computed(() => ([...Array(10)].map((_, index) => ({
//     id: index,
//     name: "Vietnam " + index,
//     country_code: "UK",
//     ping: 20
// }))));
const isConnected = computed(() => serverStore.isConnected);
const selectedServer = computed(() => serverStore.selectedServer);
const machineId = computed(() => serverStore.machineId);
const userInfo = computed(() => userStore.userInfo);

const getSortedServerListByFavorite = (server_list) => {
    if(!server_list?.length) return [];

    let list = [...server_list];

    const favoriteIds = userInfo.value?.favorite_servers || [];
    let favoriteServers = [];

    for(let i = 0; i < list.length;) {
        if(favoriteIds.includes(list[i].id)) {
            favoriteServers.push({ ...list[i], is_favorite: true });
            list.splice(i, 1);
        } else {
            list[i].is_favorite = false;
            i++;
        }
    }

    return [...favoriteServers, ...list];
}

const handleConnect = async () => {
    // if (window.navigator.userAgent.includes("Web")) {
    //     window.open("https://www.youtube.com/watch?v=Azt9Lx9NU1k", "_blank");
    // } else if ((window.navigator.userAgent.includes("EdgGapWindow"))) {
    //     alert("connect");
    // }

    try {
        loadingStore.open();
        await serverStore.connectServer(currentServer.value);
    } finally {
        loadingStore.close();
    }
}

const restoreConnection = () => {
    serverStore.getSelectedServerFromStorage();

    if(!isConnected.value && selectedServer.value) {
        serverStore.setToastStatus("restore");
        currentServer.value = { ...selectedServer.value };
        handleConnect();
    }
}

const isFirstTime = ref(true);

watchEffect(() => {
    if(machineId.value && isFirstTime.value && serverList.value?.length) {
        isFirstTime.value = false;
        restoreConnection();
    }
});

const handleDisconnect = () => {
    serverStore.setConnectStatus(false);
}
const handleOpen = () => {
    serverStore.setChoosingServerOpen(true);
}
const handleClose = () => {
    serverStore.setChoosingServerOpen(false);
}
const getPingStyle = (ping) => {
    if (ping) {
        if (ping <= 90) {
            return 'ping-low';
        } else if (ping <= 150) {
            return 'ping-medium';
        }
    }
    return 'ping';
}
const updateFavoriteServer = async (id) => {
    try {
        if(!serverList.value?.length) return;
    
        const server = serverList.value?.find(_server => _server.id === id);
        if(!server) return;

        loadingStore.open();

        const data = {
            server_id: id,
            status: server.is_favorite ? "inactive" : "active"
        }

        await serverStore.updateFavoriteServer(data);

        userStore.getUserInfo();
    } catch(error) {
        snackbarStore.add({ message: error?.message || error?.error || "Update favorite server failed!" });
    } finally {
        loadingStore.close();
    }
}
</script>
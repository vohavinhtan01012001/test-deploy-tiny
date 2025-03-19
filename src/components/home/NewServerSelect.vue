<template>
    <div class="new-new-server-select-component">
        <p class="svn-agency-fb-bold uppercase mb-1.5">{{ $t("home.select_server") }}</p>
        <div class="flex justify-center relative mt-6 mb-4">
            <button
                ref="buttonRef"
                type="button"
                class="custom-select-button"
                :class="{active: isMenuVisible}"
                @blur="onButtonBlur"
                @focus="onButtonFocus"
            >
                <div class="custom-select-input" @click="inputRef?.focus()">
                    <div class="w-full selected-item" v-show="currentServer && !isMenuVisible">
                        <div class="flex items-center">
                            <img :src="getServerFlag(currentServer)?.src" :alt="getServerFlag(currentServer)?.alt" class="flag-img" />
                            <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ currentServer?.name || "Unknown" }}</p>
                        </div>
                        <p class="text-xs ml-2.5 country-code">{{ currentServer?.country_code || "Unknown" }}</p>
                        <div class="svn-avo-bold text-xs flex items-center ml-2.5" :class="getServerPingStyle(currentServer?.ping)">
                            <span>
                                {{ currentServer?.ping || "Unknown" }}ms
                            </span>
                        </div>
                    </div>
                    <input
                        :placeholder="$t('home.click_to_select_server_placeholder')"
                        v-show="!(currentServer && !isMenuVisible)"
                        @focus="onInputFocus"
                        @blur="onInputBlur"
                        v-model="keyword"
                        ref="inputRef"
                    />
                    <img src="@/assets/images/icons/triangle-down-blue.svg" class="triangle-icon" />
                </div>
                <div class="custom-select-menu">
                    <div class="menu-content">
                        <div
                            v-for="(group, index) in serverListGroup"
                            :key="index"
                            class="server-group"
                            :class="{'open': openedGroup?.name === group.name}"
                        >
                            <div class="server-group-header" @click="handleSelectGroup(group)">
                                <div class="w-full server-item" :class="{'active': group.items?.some(item => item.id === currentServer?.id)}">
                                    <div class="flex items-center">
                                        <div class="ml-2" @click.stop="handleToggleFavoriteGroup(group)">
                                            <img src="@/assets/images/icons/heart-filled-primary.svg" class="heart-icon" v-if="group.is_favorite" />
                                            <img src="@/assets/images/icons/heart-primary.svg" class="heart-icon" v-else />
                                        </div>
                                        <img :src="getServerFlag(group.items?.[0])?.src" :alt="getServerFlag(group.items?.[0])?.alt" class="flag-img" />
                                        <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ group.name || "Unknown" }}</p>
                                    </div>
                                    <p class="text-xs ml-2.5 country-code">{{ group.items?.[0]?.country_code || "Unknown" }}</p>
                                    <div class="collapse-btn" @click.stop="handleToggleGroup(group)">
                                        <div class="collapse-icon"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="server-group-content">
                                <div
                                    v-for="(item) in group.items"
                                    :key="item.id"
                                    class="w-full server-item"
                                    @click="handleSelectItem(item)"
                                >
                                    <div class="flex items-center ml-14">
                                        <img :src="getServerFlag(item)?.src" :alt="getServerFlag(item)?.alt" class="flag-img" />
                                        <p class="svn-avo-bold text-lg ml-2.5 server-name">{{ item.name || "Unknown" }}</p>
                                    </div>
                                    <p class="text-xs ml-2.5 country-code">{{ item.country_code || "Unknown" }}</p>
                                    <div class="svn-avo-bold text-10px flex items-center ml-2.5" :class="getServerPingStyle(item.ping)">
                                        <span>
                                            {{ item.ping || "Unknown" }} ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!serverListGroup?.length && !rawServerList?.length">{{ $t("home.wait_for_getting_server") }} </div>
                        <div v-else-if="!serverListGroup?.length">{{ $t("global.no_data_available") }}</div>
                    </div>
                </div>
            </button>
            <button class="btn btn-primary connect-btn" :class="{ 'btn-disabled': !currentServer }"
                :disabled="!currentServer" @click="handleConnect">
                <span class="btn-text">{{ $t("global.connect_btn") }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useServerStore } from "@/stores/server";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { useUserStore } from "@/stores/user";
import { getServerFlag, getServerPingStyle } from "@/utils/server";

const serverStore = useServerStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const currentServer = ref(null);
const isButtonFocus = ref(false);
const isInputFocus = ref(false);
const openedGroup = ref(null);
const keyword = ref("");
const inputRef = ref(null);
const buttonRef = ref(null);

const rawServerList = computed(() => serverStore.serverList);
const serverList = computed(() => getFavoriteList(serverStore.serverList)?.filter(server => 
        !keyword.value || server.name.toLowerCase()?.includes(keyword.value.toLowerCase()) ||
        server.country_code.toLowerCase()?.includes(keyword.value.toLowerCase())
    )
);
const isConnected = computed(() => serverStore.isConnected);
const selectedServer = computed(() => serverStore.selectedServer);
const machineId = computed(() => serverStore.machineId);
const userInfo = computed(() => userStore.userInfo);
const isMenuVisible = computed(() => isButtonFocus.value || isInputFocus.value);
const serverListGroup = computed(() => {
    if(!serverList.value?.length) return [];
    let tempObj = {};
    let keys = [];
    serverList.value.forEach(server => {
        let tiny_city = server.tiny_city?.trim?.();
        let key = tiny_city || "Others";
        if(!keys.includes(key)) keys.push(key);
        tempObj[key] = [...(tempObj[key] || []), server];
    });

    return keys.map(key => ({
        name: key,
        items: tempObj[key] || [],
        is_favorite: (tempObj[key] || []).some(item => item.is_favorite)
    }));
});

const handleCloseMenu = () => {
    onButtonBlur();
    onInputBlur();
}

const onButtonFocus = () => {
    isButtonFocus.value = true;
}

const onInputFocus = () => {
    isInputFocus.value = true;
}

const onButtonBlur = () => {
    setTimeout(() => {
        isButtonFocus.value = false;
    }, 200);
}

const onInputBlur = () => {
    setTimeout(() => {
        isInputFocus.value = false;
    }, 500);
}

const getMinPingServer = (group) => {
    if(!group?.items?.length) return null;
    let result = group.items[0];
    for(let item of group.items) {
        if(item?.ping < result?.ping) {
            result = item;
        }
    }
    return result;
}

const handleSelectItem = (item) => {
    currentServer.value = item;
    buttonRef.value?.blur();
    handleCloseMenu();
}

const handleSelectGroup = (group, closeMenu = true) => {
    currentServer.value = getMinPingServer(group);
    
    if(closeMenu) {
        buttonRef.value?.blur();
        handleCloseMenu();
    }
    if(openedGroup.value != currentServer.value) {
        openedGroup.value = null;
    }
}

const handleToggleGroup = (group) => {
    let oldGroup = { ...openedGroup.value };
    handleSelectGroup(group, false);
    openedGroup.value = oldGroup?.name == group?.name ? null : group;
}

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

const getFavoriteList = (server_list) => {
    if(!server_list?.length) return [];
    const list = [...server_list];
    const favoriteIds = userInfo.value?.favorite_servers || [];
    for(let server of list) {
        server.is_favorite = favoriteIds.includes(server.id);
    }
    return list;
}

const handleConnect = async () => {
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

watchEffect(() => {
    if(!isMenuVisible.value) keyword.value = "";
});

watchEffect(() => {
    if(isConnected.value && selectedServer.value) {
        currentServer.value = { ...selectedServer.value };
    }
});

const handleOpen = () => {
    serverStore.setChoosingServerOpen(true);
}
const handleClose = () => {
    serverStore.setChoosingServerOpen(false);
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

const handleToggleFavoriteGroup = (group) => {
    const favoriteServers = group?.items?.filter(server => server.is_favorite);

    if(!favoriteServers?.length) {
        const minPingServer = getMinPingServer(group);
        if(minPingServer) {
            updateFavoriteServer(minPingServer.id);
        }
    } else {
        favoriteServers.forEach(server => updateFavoriteServer(server.id));
    }
}
</script>

<style lang="scss">
.new-new-server-select-component {
    --select-radius: 10px;
    .custom-select {
        &-button {
            position: relative;
            flex-grow: 1;
            padding: 0;
            outline: none;
            border: none;
            color: var(--primary);
            margin-right: 12px;
            &.active {
                .custom-select-input {
                    .triangle-icon {
                        transform: translateY(-50%) rotate(180deg);
                    }
                }
                .custom-select-menu {
                    display: block;
                }
            }

            .server-item {
                padding: 8px 12px;
            }
            .server-item, .selected-item {
                color: #000355;
                display: grid;
                grid-template-columns: 2fr 1fr 1fr;
            }
            .heart-icon {
                min-width: 20px;
                transform: translate(-10px, 1px);
                transition: 0.3s ease-in-out;
                &:hover {
                    transform: translate(-10px, 1px) scale(1.03);
                }
            }
            .flag-img {
                max-height: 29.32px;
            }
            .server-name {
                flex-grow: 1.5;
                text-align: left;
            }
            .country-code {
                flex-grow: 2;
                font-family: "SVN-Avo", sans-serif;
                font-weight: 400 !important;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ping {
                flex-grow: 1;
                color: #EC0E0E;
                text-align: right;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .ping-low {
                flex-grow: 1;
                color: #329932;
                text-align: right;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .ping-medium {
                flex-grow: 1;
                color: #ffc019;
                text-align: right;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .server-info {
                text-align: left;
            }
        }
        &-input {
            width: 100%;
            background: #FFFFFF;
            border-radius: var(--select-radius);
            border: 1px solid rgba(60, 60, 60, 0.26);
            overflow: hidden;
            .selected-item {
                min-height: 43px;
                pointer-events: none;
                padding-left: 20px;
                padding-right: 40px;
            }
            input {
                position: relative;
                width: 100%;
                outline: none;
                padding: 11px 40px 13px 16px;
                border: none;
                color: var(--primary);
                &::placeholder {
                    color: var(--primary);
                }
            }
            .triangle-icon {
                position: absolute;
                top: 50%;
                right: 16px;
                transform: translateY(-50%);
                transition: 0.3s ease;
            }
        }
        &-menu {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            width: 100%;
            max-height: 300px;
            padding: 16px 12px;
            background-color: #F2F1FC;
            border-radius: var(--select-radius);
            z-index: 20;
            overflow: auto;
            display: none;
            .server-item {
                padding: 8px 12px;
                &:hover, &.active {
                    background: #ddd;
                }
            }
        }
    }
    .server-group {
        &-header {
            .collapse-btn {
                padding: 0 8px;
                background: #FFFFFF;
                border-radius: 4px;
                width: max-content;
                height: max-content;
                margin-left: auto;
            }
            .collapse-icon {
                border-style: solid;
                border-width: 2px 2px 0 0;
                display: inline-block;
                height: 10px;
                width: 10px;
                position: relative;
                transform: rotate(135deg) translate(-3px, 3px);
                transition: 0.3s ease;
                transform-origin: center;
            }
        }
        &-content {
            height: 0;
            overflow: hidden;
            transition: height 0.3s ease;
            .server-item, .selected-item {
                grid-template-columns: 1.4fr 1fr 1fr;
            }
            .server-name {
                font-size: 14px;
            }
        }
        &.open {
            .server-group-header {
                .collapse-icon {
                    transform: rotate(-45deg);
                }
                .server-item {
                    background: #ddd;
                }
            }
            .server-group-content {
                height: auto;
            }
        }
    }
    .connect-btn {
        margin-right: 7px;
    }
}
</style>
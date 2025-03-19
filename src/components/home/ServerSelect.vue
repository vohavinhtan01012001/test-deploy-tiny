<template>
    <button ref="buttonRef" class="server-select" :class="{ active: isMenuVisible }" @blur="onButtonBlur"
        @focus="onButtonFocus">
        <div class="server-select-input" @click="inputRef?.focus()">
            <div class="server-select-current-server" v-show="currentServer && !isMenuVisible">
                <Server :server="currentServer" no-auto-connect />
            </div>
            <input ref="inputRef" v-model="keyword" :placeholder="`${$t('home.select_server_placeholder')}...`" @focus="onInputFocus"
                @blur="onInputBlur" v-show="!(currentServer && !isMenuVisible)" />
            <img src="@/assets/images/rabbit/icons/triangle-down.svg" class="server-select-input-icon" />
        </div>
        <div class="server-select-menu">
            <div class="server-select-menu-content">
                <template v-if="serverList?.length">
                    <!-- <Server v-for="server in serverList" :key="server.id" :server="server" no-auto-connect showPing
                        @click="handleSelectServer(server)" /> -->
                    <div v-for="(group, index) in serverListGroup" :key="index" class="server-group"
                        :class="{ 'open': openedGroup?.name === group.name }">
                        <div class="server-group-header" @click="handleSelectGroup(group)"
                            :class="{ 'active': group.items?.some(item => item.id === currentServer?.id) }">
                            <Server :server="group.items?.[0]" :title="group.name" no-auto-connect />
                            <div class="collapse-btn" @click.stop="handleToggleGroup(group)">
                                <div class="collapse-icon"></div>
                            </div>
                        </div>
                        <div class="server-group-content">
                            <Server v-for="server in group.items" :key="server.id" :server="server" no-auto-connect
                                showPing @click="handleSelectServer(server)" />
                        </div>
                    </div>
                </template>
                <div class="text-white p-1" v-else>
                    {{ status === "ping" ? $t("home.wait_for_getting_server") : $t("global.no_data_available") }}
                </div>
            </div>
        </div>
    </button>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useServerStore } from "@/stores/server";
import Server from "@/components/common/Server.vue";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
    modelValue: Object,
    servers: Array
});

const serverStore = useServerStore();

const keyword = ref("");
const isButtonFocus = ref(false);
const isInputFocus = ref(false);
const inputRef = ref(null);
const buttonRef = ref(null);
const openedGroup = ref(null);

const isMenuVisible = computed(() => isButtonFocus.value || isInputFocus.value);
const currentServer = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits("update:modelValue", newValue);
    }
});
const serverList = computed(() => props.servers?.filter(server =>
    !keyword.value || server.name.toLowerCase()?.includes(keyword.value.toLowerCase()) ||
    server.country_code.toLowerCase()?.includes(keyword.value.toLowerCase())));
const serverListGroup = computed(() => {
    if (!serverList.value?.length) return [];
    let tempObj = {};
    let keys = [];
    serverList.value.forEach(server => {
        let tiny_city = server.tiny_city?.trim?.();
        let key = tiny_city || "Others";
        if (!keys.includes(key)) keys.push(key);
        tempObj[key] = [...(tempObj[key] || []), server];
    });

    return keys.map(key => ({
        name: key,
        items: tempObj[key] || [],
        is_favorite: (tempObj[key] || []).some(item => item.is_favorite)
    }));
});
const status = computed(() => serverStore.toastStatus);

const handleCloseMenu = () => {
    buttonRef.value?.blur();
    inputRef.value?.blur();
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
    }, 100);
}

const onInputBlur = () => {
    setTimeout(() => {
        isInputFocus.value = false;
    }, 300);
}

const getMinPingServer = (group) => {
    if (!group?.items?.length) return null;
    let result = group.items[0];
    for (let item of group.items) {
        if (item?.ping < result?.ping) {
            result = item;
        }
    }
    return result;
}

const handleSelectServer = (server) => {
    currentServer.value = server;
    handleCloseMenu();
}

const handleSelectGroup = (group, closeMenu = true) => {
    currentServer.value = getMinPingServer(group);

    if (closeMenu) {
        buttonRef.value?.blur();
        handleCloseMenu();
    }
    if (openedGroup.value != currentServer.value) {
        openedGroup.value = null;
    }
}

const handleToggleGroup = (group) => {
    let oldGroup = { ...openedGroup.value };
    handleSelectGroup(group, false);
    openedGroup.value = oldGroup?.name == group?.name ? null : group;
}

watchEffect(() => {
    if (!isMenuVisible.value) keyword.value = "";
});
</script>
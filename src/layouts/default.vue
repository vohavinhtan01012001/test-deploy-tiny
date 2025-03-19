<template>
    <div class="layout-container">
        <div class="background-layout">
            <img src="@/assets/images/rabbit/ellipse-home.png" class="ellipse" />
        </div>
        <aside>
            <slot name="aside" />
        </aside>
        <div class="main-view">
            <header>
                <slot name="header" />
            </header>
            <main>
                <slot />
            </main>
        </div>

        <connect-status-toast />
    </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";
import { useLoadingStore } from "@/stores/loading";
import { useServerStore } from "@/stores/server";
import { useRoute } from "vue-router";

import ConnectStatusToast from "@/components/common/ConnectStatusToast.vue";

const userStore = useUserStore();
const loadingStore = useLoadingStore();
const serverStore = useServerStore();
const route = useRoute();

onBeforeMount(async () => {
    if (userStore.token) {
        try {
            loadingStore.open();
            await userStore.getUserInfo();
            // await serverStore.initialServerList();
            // await serverStore.pingTinyCore();
            // setInterval(() => {
            //     serverStore.getServerList();
            // }, 5000)
            loadingStore.close();
        } catch (error) {
            console.log("Error: ", error);
            userStore.logout();
            loadingStore.close();
            window.location.href = "/login";
        }

        try {
            if (userStore.isWebPlatform) return;
            loadingStore.open();
            await serverStore.initialServerList();
            await serverStore.pingTinyCore();
            serverStore.getVipServerList();
            setInterval(() => {
                if (route.fullPath == "/") {
                    serverStore.getServerList();
                }
            }, 5000);
        } catch(error) {
            console.log("Error: ", error);
        } finally {
            loadingStore.close();
        }
    }
});
</script>
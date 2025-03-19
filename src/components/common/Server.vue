<template>
    <div class="server" :class="{ 'no-auto-connect': noAutoConnect }">
        <img :src="getServerFlag(server)?.src" :alt="getServerFlag(server)?.alt" class="server-flag" />
        <div class="server-text">
            <p class="server-name">{{ title || server?.name || "Unknown" }}</p>
            <p class="server-country-code">{{ server?.country_code || "Unknown" }}</p>
        </div>
        <div class="flex items-center server-ping" v-if="showPing">
            <img src="@/assets/images/rabbit/icons/wifi.svg" />
            <span :class="getServerPingStyle(server?.ping)">{{ server?.ping }}ms</span>
        </div>
        <img src="@/assets/images/rabbit/icons/arrow-right-primary.svg" class="server-auto-connect-arrow" />
    </div>
</template>

<script setup>
import { getServerFlag, getServerPingStyle } from "@/utils/server";

const props = defineProps({
    server: Object,
    showPing: Boolean,
    noAutoConnect: Boolean,
    title: String
})
</script>

<style lang="scss">
.server {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid transparent;
    border-radius: 16px;
    user-select: none;
    cursor: pointer;
    transition: var(--transition);

    &-flag {
        width: 32px;
        max-width: 32px;
    }

    &-text {
        margin: 0 8px;
    }

    &-name {
        font-size: var(--text-sm);
        font-weight: 700;
        color: white;
        margin-bottom: 4px;
    }

    &-country-code {
        font-size: var(--text-2xs);
        color: #99999A;
        text-align: left;
    }

    &-ping {
        margin-left: auto;

        span {
            font-size: var(--text-xs);
            margin-left: 4px;
        }
    }

    &-auto-connect-arrow {
        transform: translateX(10px);
        opacity: 0;
        width: 0;
        margin-left: 8px;
        transition: var(--transition);
    }

    &.no-auto-connect {
        &:hover {
            background: #484748;
        }
    }

    &:not(.no-auto-connect) {
        &:hover {
            border-color: var(--primary);

            .server-auto-connect-arrow {
                transform: translateX(0);
                opacity: 1;
                width: 24px;
            }
        }
    }
}
</style>
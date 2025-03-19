<template>
    <div class="w-full giftcode">
        <div class="w-full content-block">
            <div class="flex items-center justify-between mb-4">
                <!-- <p class="text-base font-semibold mr-3">Khuyến mãi đặc biệt</p>
                <div class="flex items-center cursor-pointer">
                    <span class="giftcode-filter">Bộ lọc</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.00012 7C7.86751 7 7.74034 7.05268 7.64657 7.14645C7.5528 7.24022 7.50012 7.36739 7.50012 7.5V13.5C7.50012 13.6326 7.5528 13.7598 7.64657 13.8536C7.74034 13.9473 7.86751 14 8.00012 14C8.13273 14 8.25991 13.9473 8.35368 13.8536C8.44744 13.7598 8.50012 13.6326 8.50012 13.5V7.5C8.50012 7.36739 8.44744 7.24022 8.35367 7.14645C8.25991 7.05268 8.13273 7 8.00012 7V7Z" fill="#707070"/>
                        <path d="M12.5001 12C12.4345 12 12.3694 12.0129 12.3088 12.0381C12.2481 12.0632 12.193 12.1 12.1466 12.1465C12.1001 12.1929 12.0633 12.248 12.0382 12.3087C12.013 12.3693 12.0001 12.4344 12.0001 12.5L12.0002 13.5C12.0002 13.6326 12.0529 13.7598 12.1467 13.8536C12.2404 13.9473 12.3676 14 12.5002 14C12.6328 14 12.76 13.9473 12.8538 13.8535C12.9475 13.7598 13.0002 13.6326 13.0002 13.5L13.0001 12.5C13.0001 12.3674 12.9474 12.2402 12.8537 12.1464C12.7599 12.0527 12.6327 12 12.5001 12Z" fill="#707070"/>
                        <path d="M14.0001 10H13.0001L13.0002 2.5C13.0002 2.36739 12.9475 2.24021 12.8537 2.14645C12.76 2.05268 12.6328 2 12.5002 2C12.3676 2 12.2404 2.05268 12.1466 2.14645C12.0529 2.24021 12.0002 2.36739 12.0002 2.5L12.0001 10H11.0001C10.8675 10 10.7403 10.0527 10.6466 10.1464C10.5528 10.2402 10.5001 10.3674 10.5001 10.5C10.5001 10.6326 10.5528 10.7598 10.6466 10.8536C10.7403 10.9473 10.8675 11 11.0001 11H14.0001C14.1327 11 14.2599 10.9473 14.3537 10.8536C14.4474 10.7598 14.5001 10.6326 14.5001 10.5C14.5001 10.3674 14.4474 10.2402 14.3537 10.1464C14.2599 10.0527 14.1327 10 14.0001 10Z" fill="#707070"/>
                        <path d="M3.50003 10C3.36742 10 3.24025 10.0527 3.14648 10.1465C3.05272 10.2402 3.00004 10.3674 3.00003 10.5L3 13.5C3 13.6326 3.05268 13.7598 3.14645 13.8536C3.24021 13.9473 3.36739 14 3.5 14C3.63261 14 3.75979 13.9473 3.85355 13.8536C3.94732 13.7598 4 13.6326 4 13.5L4.00003 10.5C4.00003 10.3674 3.94735 10.2402 3.85358 10.1464C3.75981 10.0527 3.63264 10 3.50003 10Z" fill="#707070"/>
                        <path d="M5.00012 8H4.00012L4.00009 2.5C4.00009 2.36739 3.94741 2.24021 3.85364 2.14645C3.75988 2.05268 3.6327 2 3.50009 2C3.36748 2 3.24031 2.05268 3.14654 2.14645C3.05277 2.24021 3.00009 2.36739 3.00009 2.5L3.00012 8H2.00012C1.86751 8 1.74034 8.05268 1.64657 8.14645C1.5528 8.24022 1.50012 8.36739 1.50012 8.5C1.50012 8.63261 1.5528 8.75979 1.64657 8.85355C1.74034 8.94732 1.86751 9 2.00012 9H5.00012C5.13273 9 5.25991 8.94732 5.35368 8.85355C5.44744 8.75979 5.50012 8.63261 5.50012 8.5C5.50012 8.36739 5.44744 8.24022 5.35368 8.14645C5.25991 8.05268 5.13273 8 5.00012 8V8Z" fill="#707070"/>
                        <path d="M9.50012 5H8.50012V2.5C8.50012 2.36739 8.44744 2.24021 8.35368 2.14645C8.25991 2.05268 8.13273 2 8.00012 2C7.86751 2 7.74034 2.05268 7.64657 2.14645C7.5528 2.24021 7.50012 2.36739 7.50012 2.5V5H6.50012C6.36751 5 6.24034 5.05268 6.14657 5.14645C6.0528 5.24021 6.00012 5.36739 6.00012 5.5C6.00012 5.63261 6.0528 5.75979 6.14657 5.85355C6.24034 5.94732 6.36751 6 6.50012 6H9.50012C9.63273 6 9.75991 5.94732 9.85368 5.85355C9.94744 5.75979 10.0001 5.63261 10.0001 5.5C10.0001 5.36739 9.94744 5.24021 9.85368 5.14645C9.75991 5.05268 9.63273 5 9.50012 5Z" fill="#707070"/>
                    </svg>
                </div> -->
                <p class="text-base font-semibold mr-3">{{ $t("order.giftcode") }}</p>
            </div>
            <div class="flex items-center gap-1 point-block">
                <img src="@/assets/images/coin.png" class="coin-icon" />
                <p class="text-sm text-white mb-0">{{ $t("order.your_point") }}</p>
                <p class="share-text ml-auto">{{ userInfo?.balance || 0 }} TP</p>
            </div>
            <div class="giftcode-list">
                <template v-if="giftcodeList?.length">
                    <GiftcodeItem v-for="(giftcode, index) in giftcodeList" :bg-index="Math.round(index % 5)"
                        :giftcode="giftcode" :key="index" @done="handleReloadData" />
                </template>
                <template v-else>
                    {{ $t("global.no_data_available") }}
                </template>
            </div>
        </div>
    </div>

</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useGiftcodeStore } from "@/stores/giftcode";
import { useLoadingStore } from "@/stores/loading";
import GiftcodeItem from "@/components/giftcode/GiftcodeItem.vue";

const userStore = useUserStore();
const giftcodeStore = useGiftcodeStore();
const loadingStore = useLoadingStore();

const userInfo = computed(() => userStore.userInfo);
const giftcodeList = computed(() => giftcodeStore.giftcodeList);

const getUserInfo = async () => {
    try {
        loadingStore.open();
        await userStore.getUserInfo();
    } catch (error) {
        console.log("Error", error);
    } finally {
        loadingStore.close();
    }
}

const handleReloadData = async () => {
    await getUserInfo();
}
</script>
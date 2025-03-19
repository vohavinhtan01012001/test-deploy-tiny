<template>
    <div class="w-full content-block">
        <div class="flex items-center mb-4">
            <p class="text-base font-semibold text-white">{{ $t("share.your_voucher") }}</p>
            <span class="block-count ml-2">{{ giftcodeList?.length ? String(giftcodeList.length).padStart(2, '0') : 0
                }}</span>
            <button class="btn btn-primary text-sm font-semibold ml-auto" style="min-width: 79px"
                @click="router.push('/giftcode')">{{ $t("order.exchange_point") }}</button>
        </div>
        <div class="share-gift">
            <div class="share-gift-item" v-for="(giftcode, index) in giftcodeList" :key="index">
                <GiftcodeItem :giftcode="{ ...giftcode, data: tryParseJson(giftcode.item_detail)?.data }" is-own-gift
                    @done="handleReloadData" />
            </div>
        </div>
    </div>
</template>

<script setup>
import GiftcodeItem from "@/components/giftcode/GiftcodeItem.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { tryParseJson } from "@/utils/json.js";
import { useOrderStore } from "@/stores/order";
import { useUserStore } from "@/stores/user";
import { useLoadingStore } from "@/stores/loading";

const router = useRouter();
const orderStore = useOrderStore();
const loadingStore = useLoadingStore();
const userStore = useUserStore();

const orderHistory = computed(() => orderStore.orderHistory?.data || []);
const allGiftcodeList = computed(() => orderHistory.value?.reduce((acc, order) => ([
    ...acc,
    ...(
        (order.order_item || [])?.reduce((_acc, item) => [..._acc, ...(item.giftcode || [])], [])
    )])
    , []));
const giftcodeList = computed(() => allGiftcodeList.value?.filter(giftcode => giftcode.status === "NOT_USED_YET"));

const getOrderHistory = async () => {
    try {
        loadingStore.open();

        let params = {
            page: 1,
            "per-page": 100,
            order_status: "SUCCESS"
        }

        await orderStore.getOrderHistory(params);

        console.log("orderHistory: ", orderHistory.value);
        console.log("giftcodeList: ", giftcodeList.value);
    } catch (error) {
        console.log("Get order history error: ", error);
    } finally {
        loadingStore.close();
    }
}

getOrderHistory();

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
    await getOrderHistory();
}
</script>
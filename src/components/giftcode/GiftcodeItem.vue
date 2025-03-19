<template>
    <div class="giftcode-item" :class="{ 'not-full': isOwnGift }" v-if="giftcode">
        <div class="giftcode-item-top">
            <img :src="bg" class="giftcode-item-bg" />
            <p class="giftcode-item-duration">{{ $t("store.day", Number(duration)) }}</p>
            <p class="giftcode-item-price">{{ formatPrice(price) }}<span>/TP</span></p>
            <button class="giftcode-item-button" @click="handleOpenShareModal">{{ btnTitle }}</button>
        </div>
        <div class="giftcode-item-bottom">
            <p class="giftcode-item-name">{{ giftcode.name }}</p>
            <div class="flex items-center">
                <span class="giftcode-item-credit-text">{{ formatPrice(price) }} TP</span>
                <!-- <img src="@/assets/images/rabbit/icons/credit.svg" class="giftcode-item-credit-icon" /> -->
            </div>
        </div>
    </div>
    <BuyGiftCodeModal ref="giftCodeConfirmModalRef" @accept="handleSubmit" />
</template>
<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatPrice } from "@/utils/price.js";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";
import { useLoadingStore } from "@/stores/loading";
import { useGiftcodeStore } from "@/stores/giftcode";
import { useOrderStore } from "@/stores/order";
import BuyGiftCodeModal from "../common/BuyGiftCodeModal.vue";

import Bg1 from "@/assets/images/rabbit/gift-bg-1.png";
import Bg2 from "@/assets/images/rabbit/gift-bg-2.png";
import Bg3 from "@/assets/images/rabbit/gift-bg-3.png";
import Bg4 from "@/assets/images/rabbit/gift-bg-4.png";
import Bg5 from "@/assets/images/rabbit/gift-bg-5.png";

const images = [Bg1, Bg2, Bg3, Bg4, Bg5];
const emit = defineEmits(['open-modal', 'done']);

const props = defineProps({
    bgIndex: {
        type: Number,
        default: 1
    },
    isOwnGift: {
        type: Boolean,
        default: false
    },
    giftcode: {
        type: Object,
        default: null
    }
});

const { t } = useI18n();

const userStore = useUserStore();
const snackbarStore = useSnackbarStore();
const loadingStore = useLoadingStore();
const giftcodeStore = useGiftcodeStore();
const orderStore = useOrderStore();

const errorMessage = ref("");
const giftCodeConfirmModalRef = ref();
const userBalance = computed(() => Number(userStore.userInfo?.balance || 0));
const bg = computed(() => images[props.bgIndex]);
const btnTitle = computed(() => props.isOwnGift ? t("order.use") : t("order.exchange_point"));
const duration = computed(() => JSON.parse(props.giftcode?.data)?.duration || 0);
const price = computed(() => props.giftcode?.price || props.giftcode?.value || 0);
const itemId = computed(()=>props.giftcode?.id)

const handleOpenShareModal = () => {
    // emit("open-modal");
    if (!props.isOwnGift && userBalance.value < Number(props.giftcode?.price || 0)) {
        return snackbarStore.add({ message: t("order.not_enough_point"), type: "danger" });
    }
    giftCodeConfirmModalRef.value?.open({ isOwnGift: props.isOwnGift, giftcode: props.giftcode });
};

const submitOrder = async () => {
    await orderStore.submitOrder({
        item_id: itemId.value,
        quantity:1
    });
    snackbarStore.add({ message: t("order.exchange_point_success") });
}

const buyGiftcode = async () => {
    if (!itemId) return Promise.resolve(1);
    await submitOrder();
}

const checkGiftcodeInfo = async () => {
    await giftcodeStore.checkGiftcodeInfo({
        code: props.giftcode?.code,
        security_code: props.giftcode?.security_code
    });
}

const redeemGiftcode = async () => {
    await giftcodeStore.redeemGiftcode({
        code: props.giftcode?.code,
        security_code: props.giftcode?.security_code
    });
    snackbarStore.add({ message: t("order.redeem_success_message") });
}

const useGiftcode = async () => {
    await checkGiftcodeInfo();
    await redeemGiftcode();
}

const handleSubmit = async () => {
    try {
        loadingStore.open();

        if (!props.isOwnGift) {
            await buyGiftcode();
        } else {
            await useGiftcode();
        }

        emit("done");
    } catch (error) {
        console.log("Error: ", error);
        errorMessage.value = error.message || error.error || "";
    } finally {
        loadingStore.close();
    }
}
</script>
<style lang="scss">
.giftcode-item {
    position: relative;
    overflow: hidden;
    transition: opacity 0.3s ease-in-out;

    &-top {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.1);
            pointer-events: none;
            opacity: 0;
            z-index: 1;
        }
    }

    /* Nút sử dụng */
    .giftcode-item-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 28px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        z-index: 10;
        color: #F04E4C;

        &:hover {
            background-color: #ddd;
        }
    }

    &:hover {

        .giftcode-item-top::before,
        .giftcode-item-button {
            opacity: 1;
        }

        .giftcode-item-bottom {
            color: var(--primary);
        }
    }
}
</style>
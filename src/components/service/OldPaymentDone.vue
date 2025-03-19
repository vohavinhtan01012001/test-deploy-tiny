<template>
    <div class="payment-select-component">
        <p class="gradient-text text-center uppercase mx-auto mb-6 title-text">{{ $t("service.payment") }}</p>

        <div class="p-2 selected-service-payment">
            <selected-service-info />
            <div class="payment-done">
                <p class="svn-avo-bold text-lg text-center payment-done-title" v-if="paymentInfo">{{ paymentMessage }}</p>

                <img src="@/assets/images/icons/check-circle-success.svg" class="success-icon" />

                <div class="payment-result">
                    <div class="flex items-center justify-between">
                        <p class="text-xs mr-3 done-label">{{ $t("service.payment_method") }}</p>
                        <img :src="paymentLogo" v-if="paymentLogo" />
                    </div>
                    <div class="divider"></div>
                    <div class="flex items-center justify-between">
                        <p class="text-xs mr-3 done-label">{{ $t("service.amount") }}</p>
                        <p class="svn-avo-bold text-sm price-text">
                            <template v-if="paymentInfo?.type?.includes('paypal')">
                                <span class="text-underline">$</span>{{ paymentInfo?.amount || 0 }}
                            </template>
                            <template v-else>
                                {{ formatPrice(paymentInfo?.amount || 0) }} <span class="text-underline">đ</span>
                            </template>
                        </p>
                    </div>
                </div>
                <div class="flex-center" v-if="paymentInfo">
                    <button v-if="paymentInfo.resultCode == 0"  class="btn btn-primary" @click="goToHome">
                        <span class="uppercase btn-text">{{ $t("service.go_back_home") }}</span>
                    </button>
                    <button v-else class="btn btn-primary" @click="refresh">
                        <span class="uppercase btn-text">{{ $t("service.pay_again") }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePaymentStore } from "@/stores/payment";
import { useLoadingStore } from "@/stores/loading";
import { formatPrice } from "@/utils/price.js";
import ZalopayLogo from "@/assets/images/zalopay.svg";
import BankingLogo from "@/assets/images/banking.svg";
import MomoLogo from "@/assets/images/momo.svg";
import VISALogo from "@/assets/images/visa.svg";
import PaypalLogo from "@/assets/images/paypal.svg";
import SelectedServiceInfo from "@/components/service/SelectedServiceInfo.vue";

const router = useRouter();
const paymentStore = usePaymentStore();
const loadingStore = useLoadingStore();

const paymentInfo = ref(null);

// const activeOption = ref({ id: 2, title: "MoMo", value: "momo", logo: MomoLogo });
const paymentLogo = ref(null);
const paymentMessage = ref("");

const goToHome = () => {
    router.push("/");
}

const refresh = () => {
    router.push("/");
}

const getPaymentLogo = (info) => {
    if(info && info.type) {
        switch(info.type) {
            case "momo": return MomoLogo;
            case "paypal": return PaypalLogo;
            case "visa": return VISALogo;
            case "bank_transfer": return BankingLogo;
            case "zalopay": return ZalopayLogo;
        }
    }
    return BankingLogo;
}

const setPaymentInfo = async (value) => {
    paymentInfo.value = value;
    paymentMessage.value = paymentInfo.value.message;
    paymentLogo.value = getPaymentLogo(value);
    console.log({value});
    if(value.type == "paypal") return;
    try {
        loadingStore.open();
        // await paymentStore.updatePayment({type: "momo", ...paymentInfo.value});
        await paymentStore.updatePayment(paymentInfo.value);
    } finally {
        loadingStore.close();
    }
}

onBeforeUnmount(() => {
    paymentStore.setDonePaymentInfo(null);
});

defineExpose({ setPaymentInfo });
</script>

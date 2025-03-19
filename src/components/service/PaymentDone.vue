<template>
    <div class="payment-done">
        <div class="content-block payment-done-block">
            <PaymentTop
                class="payment-done-top"
                @back="goBack"
            />
            <div class="payment-done-bottom">
                <img src="@/assets/images/rabbit/icons/check-success.svg" class="payment-done-icon" />
                <p class="payment-done-title">{{ paymentMessage || "Thanh toán thành công" }}</p>
                <p class="payment-done-subtitle">Đơn hàng của bạn đã được ghi nhận. Bạn sẽ nhận được mail xác nhận chi tiết đơn đặt hàng của bạn.</p>
                <button class="btn btn-primary" @click="goToHome">
                    {{ $t("service.go_back_home") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePaymentStore } from "@/stores/payment";
import { useLoadingStore } from "@/stores/loading";
// import { formatPrice } from "@/utils/price.js";
import PaymentTop from "@/components/service/PaymentTop.vue";

const router = useRouter();
const paymentStore = usePaymentStore();
const loadingStore = useLoadingStore();

const paymentInfo = ref(null);
const paymentMessage = ref("");

const goBack = () => {
    serviceStore.setActiveView("service");
}

const goToHome = () => {
    router.push("/");
}

const setPaymentInfo = async (value) => {
    paymentInfo.value = value;
    paymentMessage.value = paymentInfo.value.message;
    console.log({value});
    if(value.type == "paypal") return;
    try {
        loadingStore.open();
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
<template>
    <div class="service-view">
        <service-select @payment="goToPayment" key="service" v-if="activeView == 'service'" />
        <payment-select key="payment" v-if="activeView == 'payment'" @done="handleDonePayment" />
        <payment-done key="payment-done" ref="paymentDoneRef" v-if="activeView == 'payment-done'" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useServiceStore } from "@/stores/service";
import ServiceSelect from "@/components/service/ServiceSelect.vue";
import PaymentSelect from "@/components/service/PaymentSelect.vue";
import PaymentDone from "@/components/service/PaymentDone.vue";

const route = useRoute();
const serviceStore = useServiceStore();
const paymentDoneRef = ref(null);

const activeView = computed(() => serviceStore.activeView);

onMounted(() => {    
    getPaymentInfo();
});

const goToPayment = () => {
    serviceStore.setActiveView("payment");
}

const getPaymentInfo = async () => {
    if(route.query?.view == "payment-done") {
        let paymentType = route.query["payment-type"];
        // serviceStore.setActiveView("payment-done");

        // await nextTick();
        // paymentDoneRef.value?.setPaymentInfo({ ...route.query, type: paymentType });

        handleDonePayment({ ...route.query, type: paymentType });
    }
}

const handleDonePayment = async (value) => {
    serviceStore.setActiveView("payment-done");
    await nextTick();
        paymentDoneRef.value?.setPaymentInfo(value);
}
</script>
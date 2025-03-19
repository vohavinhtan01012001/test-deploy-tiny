<template>
    <div class="selected-service" v-if="currentService">
        <p class="svn-agency-fb-bold text-28px uppercase gradient-text mb-2 duration">
            {{ currentService.title }}
            <span
                class="svn-agency-fb-bold text-xl uppercase"
                v-if="
                    isAddingTimeVisible && 
                    !currentPaymentOption?.value?.includes?.('paypal') &&
                    !donePaymentInfo?.type?.includes?.('paypal')
                "
            >
                {{ currentService.adding_time_title }}
            </span>
        </p>
        <p class="svn-avo-bold text-2xl mb-4 price">{{ isEn ? formatUSDPrice(currentService.usd_price) : (formatPrice(currentService.price) + "đ") }}</p>
        <div class="service-option-list" v-if="currentService.options?.length">
            <div class="flex items-center option" v-for="(option, index) in currentService.options" :key="index">
                <img src="@/assets/images/icons/lightning.svg" class="mr-1.5 lightning" />
                <p class="text-xs">{{ option }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useServiceStore } from "@/stores/service";
import { usePaymentStore } from "@/stores/payment";
import { formatPrice, formatUSDPrice } from "@/utils/price.js";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const serviceStore = useServiceStore();
const paymentStore = usePaymentStore();

const currentService = computed(() => serviceStore.currentService);
const isAddingTimeVisible = computed(() => serviceStore.isAddingTimeVisible);
const currentPaymentOption = computed(() => paymentStore.currentPaymentOption);
const donePaymentInfo = computed(() => paymentStore.donePaymentInfo);

const isEn = computed(() => i18n.locale.value == "en");
</script>

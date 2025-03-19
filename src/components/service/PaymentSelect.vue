<template>
    <div class="payment-select" v-if="currentService">
        <div class="content-block payment-select-block">
            <PaymentTop :title="$t('service.payment_method')" :subtitle="$t('service.payment_subtitle')"
                class="payment-select-top" @back="goBack" />

            <div class="payment-select-grid">
                <div class="payment-select-left">
                    <div class="p-4 payment-select-left-top">
                        <p class="text-2xs text-primary mb-3">{{ $t("service.payment_cart") }}</p>
                        <div class="payment-select-row text-white">
                            <p class="text-sm">{{ $t("service.payment_package") }}</p>
                            <p class="text-lg font-bold">{{ currentService.title }}</p>
                        </div>
                    </div>
                    <div class="px-4 pt-4 pb-1 payment-select-left-middle">
                        <div class="payment-select-row text-9a mb-3">
                            <p class="text-xs">{{ $t("service.subtotal") }}</p>
                            <p class="text-sm">{{ isEn ? formatUSDPrice(currentService.usd_old_price) :
                                (formatPrice(currentService.old_price) + "đ") }}</p>
                        </div>
                        <div class="payment-select-row text-9a mb-3" v-if="discountNumber">
                            <p class="text-xs">{{ $t("service.discount") }}</p>
                            <p class="text-sm font-bold text-primary">-{{ discountText }}</p>
                        </div>
                    </div>
                    <div class="text-9a px-4 py-6 payment-select-left-bottom">
                        <div class="payment-select-row">
                            <p class="text-xs font-bold">{{ $t("service.total") }}</p>
                            <div>
                                <p class="text-base font-bold text-white">{{ isEn ?
                                    formatUSDPrice(currentService.usd_price) : (formatPrice(currentService.price) + "đ")
                                    }}</p>
                                <p class="text-2xs">{{ currentService.title }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="payment-select-right">
                    <div v-for="(option, index) in paymentOptions" :key="index" class="payment-select-option"
                        :class="{ active: activeOption?.value == option.value }">
                        <div class="payment-select-option-top" @click="activeOption = option">
                            <img src="@/assets/images/rabbit/icons/radio.svg"
                                v-show="activeOption?.value == option.value" />
                            <img src="@/assets/images/rabbit/icons/radio-blank.svg"
                                v-show="activeOption?.value !== option.value" />
                            <p class="payment-select-option-top-title">{{ option.title }}</p>
                            <img :src="option.logo" class="payment-select-option-top-logo" />
                        </div>
                        <div class="payment-select-option-bottom">
                            <div class="payment-select-option-content"
                                :class="{ active: activeOption?.value == option.value }">
                                <div v-if="activeOption?.value == option.value">
                                    <div v-if="activeOption.value == 'bank_transfer'">
                                        <p class="text-xs form-title">{{ $t("service.transfer_info") }}</p>

                                        <template v-if="activeOption?.initialPaymentInfo?.id">
                                            <img
                                                :src="`https://img.vietqr.io/image/vcb-0441000740673-compact2.jpg?amount=${currentService.price}&addInfo=TINY${activeOption?.initialPaymentInfo?.id}TINY&accountName=LE%20TRONG%20HIEU`" />

                                            <p class="count-down-timer"
                                                :class="{ 'animate-blink': !countdownTimerVisible && countdownTimerDisplay }">
                                                {{ countdownTimerDisplay }} <span class="visibility-hidden">0</span></p>
                                            <div>
                                                <div class="flex items-center amount-text">
                                                    <div>{{ $t("service.content") }}:</div>
                                                    <div class="text-sm price-text"
                                                        v-if="activeOption?.initialPaymentInfo?.id">TINY{{
                                                            activeOption.initialPaymentInfo.id }}TINY</div>
                                                </div>
                                                <div class="flex items-center amount-text">
                                                    <div>{{ $t("service.amount") }}:</div>
                                                    <div class="text-sm price-text">{{ isEn ?
                                                        formatUSDPrice(currentService.usd_price) :
                                                        (formatPrice(currentService.price) + "đ") }}
                                                    </div>
                                                </div>
                                                <div class="flex items-center amount-text">
                                                    <div>{{ $t("service.bank") }}:</div>
                                                    <div class="text-sm price-text">VCB</div>
                                                </div>
                                                <div class="flex items-center amount-text">
                                                    <div>{{ $t("service.account_holder") }}:</div>
                                                    <div class="text-sm price-text">LE TRONG HIEU</div>
                                                </div>
                                                <div class="flex items-center amount-text">
                                                    <div>{{ $t("service.bank_account") }}:</div>
                                                    <div class="text-sm price-text">0441000740673</div>
                                                </div>
                                                <div class="flex items-center amount-text">
                                                    <div>{{ $t("service.extended_days") }}:</div>
                                                    <div class="text-sm price-text">{{ currentService.title }}
                                                        {{ isAddingTimeVisible ? currentService.adding_time_title : ""
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div v-if="activeOption.value == 'paypal_subscription'">
                                        <p class="svn-avo-bold text-xs form-title">{{
                                            $t("service.paypal_subscription_title") }} {{ $t("service.month",
                                                currentService?.duration) }}</p>
                                        <div id="paypal-subscription-button" class="mt-10 mb-3 paypal-button"></div>
                                        <p class="amount-text text-center">
                                            {{ $t("service.amount") }}:
                                            <span class="svn-avo-bold text-sm price-text"><span
                                                    class="text-underline">$</span>{{
                                                        currentService.usd_price }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BannerSwiper />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePaymentStore } from "@/stores/payment";
import { useLoadingStore } from "@/stores/loading";
import { useServiceStore } from "@/stores/service";
import { formatPrice, formatUSDPrice } from "@/utils/price.js";
import { useI18n } from "vue-i18n";
import ZalopayLogo from "@/assets/images/zalopay.svg";
import BankingLogo from "@/assets/images/banking.svg";
import MomoLogo from "@/assets/images/momo.svg";
import VISALogo from "@/assets/images/visa.svg";
import PaypalLogo from "@/assets/images/paypal.svg";
// import QrcodeVue from "qrcode.vue";
import SelectedServiceInfo from "@/components/service/SelectedServiceInfo.vue";
import PaymentTop from "@/components/service/PaymentTop.vue";
import BannerSwiper from "../common/BannerSwiper.vue";

const i18n = useI18n();
const emit = defineEmits(["done"]);

const router = useRouter();
const paymentStore = usePaymentStore();
const loadingStore = useLoadingStore();
const serviceStore = useServiceStore();

const paymentOptions = ref([
    // { id: 1, title: "Zalopay", value: "zalopay", logo: ZalopayLogo },
    { id: 1, title: "Banking", value: "bank_transfer", logo: BankingLogo, initialPaymentInfo: null },
    // { id: 2, title: "MoMo", value: "momo", logo: MomoLogo, initialPaymentInfo: null },
    // { id: 3, title: "VISA", value: "visa", logo: VISALogo, initialPaymentInfo: null },
    // { id: 4, title: "Paypal", value: "paypal", logo: PaypalLogo, initialPaymentInfo: null },
    { id: 4, title: "Paypal", value: "paypal_subscription", logo: PaypalLogo, initialPaymentInfo: null },
]);

const activeOption = ref({ id: 1, title: "Banking", value: "bank_transfer", logo: BankingLogo, initialPaymentInfo: null });

const COUNTDOWN_DURATION = 60 * 5;
const countdownTimerDisplay = ref("");
const countdownTimerVisible = ref(false);
const countdownTimerInterval = ref();

const initialPaymentInfo = computed(() => paymentStore.initialPaymentInfo);
const currentService = computed(() => serviceStore.currentService);
const isAddingTimeVisible = computed(() => serviceStore.isAddingTimeVisible);
const discountNumber = computed(() => isEn.value ?
    (currentService.value?.usd_old_price - currentService.value?.usd_price) :
    (currentService.value?.old_price - currentService.value?.price)
);
const discountText = computed(() => isEn.value ?
    formatUSDPrice(currentService.value?.usd_old_price - currentService.value?.usd_price) :
    (formatPrice(currentService.value?.old_price - currentService.value?.price) + "đ")
);
const orderDetail = computed(() => paymentStore.orderDetail);

const isEn = computed(() => i18n.locale.value == "en");

watch(() => isEn.value, () => {
    if (isEn.value) {
        activeOption.value = { ...(paymentOptions.value?.find(option => option.value === "paypal_subscription") || paymentOptions.value?.[0] || null) };
    } else {
        activeOption.value = { ...(paymentOptions.value?.[0] || null) };
    }
}, { immediate: true });

watch(() => activeOption.value, () => {
    paymentStore.setCurrentPaymentOption(activeOption.value);
}, { immediate: true, deep: true });

const goBack = () => {
    serviceStore.setActiveView("service");
}

const startTimer = (duration) => {
    clearInterval(countdownTimerInterval.value);
    countdownTimerVisible.value = true;
    let timer = duration, minutes, seconds;
    countdownTimerInterval.value = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        countdownTimerDisplay.value = "00:" + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        if (timer <= 0) {
            clearInterval(countdownTimerInterval.value);
            countdownTimerVisible.value = false;
            countdownTimerDisplay.value = "00:00:00";
        }
    }, 1000);
}

const initializePayment = async () => {
    if (!currentService.value?.price) return;
    let callbackUrl = window.location.origin + "/service?view=payment-done&payment-type=" + activeOption.value.value;
    let response = null;
    try {
        let data = {
            type: activeOption.value.value,
            amount: currentService.value.price,
            callback_url: callbackUrl
        }
        if (activeOption.value?.value?.includes("paypal")) {
            data.amount = currentService.value.usd_price * 100
        }
        if (activeOption.value?.value == "paypal_subscription") {
            switch (data.amount) {
                case 499:
                    data.plan_id = "P-066575462H128702VMVD4O4I";
                    break;
                case 1199:
                    data.plan_id = "P-29P73532AM743411DMVD4O4Q";
                    break;
                case 2099:
                    data.plan_id = "P-8GW12049KY6812446MVD4O4Y";
                    break;
            }
        }
        console.log("data: ", data);
        loadingStore.open();
        response = await paymentStore.initializePayment(data);

        let currentOptionIndex = paymentOptions.value.findIndex(item => item.id == activeOption.value?.id);
        if (currentOptionIndex != -1) {
            paymentOptions.value[currentOptionIndex].initialPaymentInfo = initialPaymentInfo.value;
            activeOption.value.initialPaymentInfo = initialPaymentInfo.value;
        }

        if (activeOption.value?.value == "bank_transfer") {
            startTimer(COUNTDOWN_DURATION);
            checkOrderStatus();
        }
    } finally {
        loadingStore.close();
        // console.log(initialPaymentInfo.value);
    }
    return response?.id;
}

const goToMoMoPayment = () => {
    if (initialPaymentInfo.value?.payUrl) {
        window.location.href = initialPaymentInfo.value.payUrl;
    }
}

const resetPaymentData = () => {
    if (paymentOptions.value?.length) {
        paymentOptions.value = paymentOptions.value.map((item) => ({ ...item, initialPaymentInfo: null }));
    }
    if (activeOption.value?.initialPaymentInfo) {
        activeOption.value.initialPaymentInfo = null;
    }
}

var timeout = 0;
const setScript = () => {
    return new Promise(async (resolve) => {
        try {
            // let clientId = "test";
            //Production key
            let clientId = "AcrzVYnM08LFxniag-DBNtm3VbkZzGvP3to8FDTMpViWvAb1Ibcs4m5t9OOq4j4qi6qzXULonXClqQHX";
            let buttons = document.querySelectorAll(".paypal-button");
            if (buttons?.length) {
                buttons.forEach(button => button.innerHTML = "");
            }
            // let awaitResolve = resolve;
            let currentScript = document.getElementById("myScript");
            if (myButton?.length) {
                // myButton.close();
                myButton.forEach(button => button?.close?.());
                myButton?.close?.();
                myButton = [];
            }
            if (currentScript) {
                currentScript.remove();
            }

            let script = document.createElement("script");
            script.id = "myScript";
            script.async = true;
            // script.type = "module";
            if (activeOption.value?.value == "paypal") {
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&enable-funding=venmo,paylater`;
            } else {
                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&vault=true&intent=subscription&enable-funding=card&disable-funding=paylater`;
            }

            // document.body.appendChild(script);
            document.head.appendChild(script);

            script.onload = () => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    resolve?.(true);
                }, 500);
            }
        } catch (error) {
            console.log("Error: ", error);
            resolve?.(false);
        }
    })
}

var myButton = [];

const createPaypalPayment = async () => {
    const FUNDING_SOURCES = [
        // // EDIT FUNDING SOURCES
        paypal.FUNDING.PAYPAL,
        //   paypal.FUNDING.PAYLATER,
        //   paypal.FUNDING.VENMO,
        paypal.FUNDING.CARD
    ];
    const onApprove = async (data, actions) => {
        try {
            // const response = await fetch(`https://tiny-backend.xuantan97.com/api/end-user/payment/update-data`, {
            //     method: "POST",
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer elcyT1RZbWgwNDNNbFpkNWZlcTZ3N2NMb3VHaThDQlF5OVBybkFGSw=='
            //     },
            //     body: JSON.stringify({ type: 'paypal', amount: '1000', orderId: data.orderID })
            // });

            // const details = await response.json();
            loadingStore.open();
            var response = null;
            if (activeOption.value?.value == "paypal") {
                response = await paymentStore.updatePayment({ type: "paypal", amount: currentService.value?.usd_price * 100, orderId: data.orderID });
            } else if (activeOption.value?.value == "paypal_subscription") {
                response = await paymentStore.updatePayment({ type: "paypal_subscription", amount: currentService.value?.usd_price * 100, subscriptionId: data.subscriptionID, data });
            }
            const details = response?.data;
            loadingStore.close();
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            // This example reads a v2/checkout/orders capture response, propagated from the server
            // You could use a different API or structure for your 'orderData'
            const errorDetail = Array.isArray(details.details) && details.details[0];

            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                return actions.restart();
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
            }

            if (errorDetail) {
                let msg = 'Sorry, your transaction could not be processed.';
                msg += errorDetail.description ? ' ' + errorDetail.description : '';
                msg += details.debug_id ? ' (' + details.debug_id + ')' : '';
                alert(msg);
            }

            if (details?.status == "SUCCESS") {
                let resultData = {
                    message: "Thành công.",
                    amount: currentService.value?.usd_price,
                    type: activeOption.value?.value || "paypal"
                }

                emit("done", resultData);
            }


            // Successful capture! For demo purposes:
            // console.log('Capture result', details, JSON.stringify(details, null, 2));
            // const transaction = details.purchase_units[0].payments.captures[0];
            // alert('Transaction ' + transaction.status + ': ' + transaction.id + 'See console for all available details');
        } catch (error) {
            console.error(error);
            // Handle the error or display an appropriate error message to the user
        }
    }
    myButton = [];
    FUNDING_SOURCES.forEach(fundingSource => {
        if (activeOption.value?.value == "paypal") {
            let button = paypal.Buttons({
                fundingSource,
                style: {
                    layout: 'vertical',
                    shape: 'rect',
                    color: (fundingSource == paypal.FUNDING.PAYLATER) ? 'gold' : '',
                },
                async createOrder() {
                    return initializePayment();
                },
                onApprove,
            }).render("#paypal-button");
            myButton.push(button);
        } else if (activeOption.value?.value == "paypal_subscription") {
            let button = paypal.Buttons({
                fundingSource,
                style: {
                    layout: 'vertical',
                    shape: 'rect',
                    color: (fundingSource == paypal.FUNDING.PAYLATER) ? 'gold' : '',
                },
                async createSubscription() {
                    return initializePayment();
                },
                onApprove,
            }).render("#paypal-subscription-button");
            myButton.push(button);
        }
    });
}

const getOrderDetail = async () => {
    try {
        if (!initialPaymentInfo.value) return;
        await paymentStore.getOrderDetail({ order_id: initialPaymentInfo.value.id });
    } catch (error) {
        console.log("Error: ", error);
    }
}

const statusTimeout = ref();

const checkOrderStatus = async () => {
    clearTimeout(statusTimeout.value);
    await getOrderDetail();

    if (orderDetail.value?.order_status === "SUCCESS") {
        let resultData = {
            message: "Thanh toán thành công",
            amount: currentService.value?.price,
            type: activeOption.value?.value || "bank_transfer",
            resultCode: 0
        }

        emit("done", resultData);
    } else {
        statusTimeout.value = setTimeout(() => {
            checkOrderStatus();
        }, 2000);
    }
}

watch(() => [activeOption.value?.value, currentService.value?.id], async (newValue, oldValue) => {
    // if(activeOption.value && !activeOption.value.initialPaymentInfo) {
    //     if(!activeOption.value.value?.includes("paypal")) {
    //         initializePayment();
    //     } else {
    //         await setScript();
    //         await nextTick();
    //         createPaypalPayment();
    //     }
    // }
    if (newValue?.[0] == oldValue?.[0] && newValue?.[1] == oldValue?.[1]) return;
    if (!activeOption.value.value?.includes("paypal")) {
        countdownTimerDisplay.value = "";
        if (activeOption.value && !activeOption.value.initialPaymentInfo) {
            initializePayment();
        }
    } else {
        await setScript();
        await nextTick();
        createPaypalPayment();
    }
}, { immediate: true, deep: true });

watch(() => currentService.value?.id, (newValue, oldValue) => {
    if (newValue === oldValue) return;
    resetPaymentData();
}, { deep: true });

onBeforeUnmount(() => {
    clearTimeout(statusTimeout.value);
    clearInterval(countdownTimerInterval.value);
});
</script>

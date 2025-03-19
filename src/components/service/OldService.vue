<template>
    <div class="service-component" :class="{'shadow': !outlineButton}" v-if="service">
        <p class="svn-agency-fb-bold text-28px uppercase gradient-text text-center mx-auto duration">
            {{ service.title }}
            <span class="svn-agency-fb-bold text-xl uppercase" v-if="isAddingTimeVisible">{{ service.adding_time_title }}</span>
        </p>
        <p class="svn-avo-bold text-xs discount-tag" v-if="serviceDiscount">-{{ serviceDiscount }}%</p>
        <div class="service-info">
            <div class="mb-1 price-group" :class="{'has-discount': serviceDiscount}">
                <p class="text-xs line-through text-center old-price" v-if="serviceDiscount && service.old_price">{{ isEn ? formatUSDPrice(service.usd_old_price) : (formatPrice(service.old_price) + "đ") }}</p>
                <img src="@/assets/images/symmetry-light.svg" class="symmetry-light" />
                <p class="svn-avo-bold text-2xl price">{{ isEn ? formatUSDPrice(service.usd_price) : (formatPrice(service.price) + "đ") }}</p>
            </div>
            <div class="option-list" v-if="service.options?.length">
                <div class="flex items-center option" v-for="(option, index) in service.options" :key="index">
                    <img src="@/assets/images/icons/lightning.svg" class="mr-1.5 lightning" />
                    <p class="text-xs">{{ option }}</p>
                </div>
            </div>
            <div class="flex-center">
                <button class="btn w-full" :class="buttonClasses" @click="goToPayment">
                    <span class="btn-text">{{ $t("service.pay_now") }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useServiceStore } from "@/stores/service";
import { formatPrice, formatUSDPrice } from "@/utils/price.js";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const emit = defineEmits(["payment"]);
const props = defineProps({
    outlineButton: {
        type: Boolean,
        default: true
    },
    service: {
        type: Object,
        default: null
    }
});

const serviceStore = useServiceStore();

const isAddingTimeVisible = computed(() => serviceStore.isAddingTimeVisible);

const buttonClasses = computed(() => ({
    "btn-primary": !props.outlineButton,
    "btn-outline-primary": props.outlineButton
}));

const serviceDiscount = computed(() => {
    if(!props.service ||
        !props.service.old_price ||
        props.service.price == props.service.old_price
    ) {
        return 0;
    }

    return Math.round((1 - props.service.price / props.service.old_price) * 100);
});

const isEn = computed(() => i18n.locale.value == "en");

const goToPayment = () => {
    serviceStore.setCurrentService(props.service);
    emit("payment");
}
</script>

<style lang="scss">
.service-component {
    // background: rgba(255, 255, 255, 0.1);
    background: #0f1f67;
    mix-blend-mode: color;
    // box-shadow: inset 0px 0px 10px rgba(125, 208, 255, 0.5);
    border-radius: 5px;
    * {
        user-select: none;
    }
    &.shadow {
        mix-blend-mode: overlay;
        // box-shadow: inset 0px 0px 10px rgba(125, 208, 255, 0.5);
        box-shadow: 0px 0px 10px 0px rgba(125, 208, 255, 0.50) inset;
    }
    .duration {
        padding: 19px;
    }
    .discount-tag {
        position: absolute;
        top: 5px;
        left: 5px;
        padding: 3px;
        min-height: 23px;
        min-width: 44px;
        border-radius: 5px;
        background: #F46262;
        text-shadow: 0px 1px 2px rgba(47, 1, 1, 0.50);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .service-info {
        padding: 0 37px 28px;
        background: linear-gradient(180deg, #000355 0%, rgba(0, 3, 85, 0) 100%);
        border-radius: 5px 50px 5px 5px;
        .price-group {
            // mix-blend-mode: screen;
            position: relative;
            padding-top: 4px;
            padding-bottom: 4px;
            &.has-discount {
                padding-top: 8px;
                padding-bottom: 0px;
                .old-price {
                    position: absolute;
                    top: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            .symmetry-light {
                // position: absolute;
                // top: 0;
                // left: 0;
                margin-left: -27px;
                margin-right: -27px;
                width: calc(100% + 54px);
                max-width: calc(100% + 54px);
                mix-blend-mode: screen;
            }
            .price {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: max-content;
                text-shadow: 0px 0px 10px #3486FF;
            }
        }

        .option-list {
            margin-bottom: 20px;
            .option {
                &:not(:last-of-type) {
                    margin-bottom: 7px;
                }
                .lightning {
                    max-height: 7.17px;
                }
            }
        }
    }
}
</style>
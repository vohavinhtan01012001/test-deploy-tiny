<template>
  <div class="service" :class="{ active }" v-if="service">
    <div class="service-top">
      <p class="service-subtitle">
        {{ service.title }}
        <span class="service-adding-time" v-if="isAddingTimeVisible">{{
          service.adding_time_title
        }}</span>
      </p>
      <div class="service-discount" v-if="serviceDiscount">
        {{ serviceDiscount }}% {{ $t("service.off") }}
      </div>
    </div>
    <p class="service-title">
      {{
        isVi
          ? formatPrice(service.price) + "đ"
          : formatUSDPrice(service.usd_price)
      }}/
      <span>{{ service.title }}</span>
    </p>
    <div class="service-options" v-if="service.options?.length">
      <div
        class="service-options-item"
        v-for="(option, index) in service.options"
        :key="index"
      >
        <img
          src="@/assets/images/rabbit/icons/check.svg"
          class="service-options-item-icon"
        />
        <p class="service-options-item-text">{{ option }}</p>
      </div>
    </div>
    <div class="service-action">
      <button class="btn" :class="buttonClasses" @click="goToPayment">
        <span>
          {{ $t("service.pay_now") }}
        </span>
      </button>
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
  active: {
    type: Boolean,
    default: true,
  },
  service: {
    type: Object,
    default: null,
  },
});

const serviceStore = useServiceStore();

console.log(props.service);

const isAddingTimeVisible = computed(() => serviceStore.isAddingTimeVisible);

const buttonClasses = computed(() => ({
  "btn-primary": props.active,
  "btn-outline-primary": !props.active,
}));

const serviceDiscount = computed(() => {
  if (
    !props.service ||
    !props.service.old_price ||
    props.service.price == props.service.old_price
  ) {
    return 0;
  }

  return Math.round((1 - props.service.price / props.service.old_price) * 100);
});

const isVi = computed(() => i18n.locale.value == "vi");

const goToPayment = () => {
  serviceStore.setCurrentService(props.service);
  emit("payment");
};
</script>

<style lang="scss">
.service {
  --padding: 16px;
  --bg: #141414;

  border-radius: 16px;
  background: var(--bg);
  color: white;

  &-top {
    display: flex;
    align-items: center;
    padding: var(--padding) var(--padding) 0;
    min-height: 51px;
  }

  &-subtitle {
    font-size: var(--text-base);
    font-weight: 600;
    color: #d6d6d6;
    margin-right: 12px;
  }

  &-adding-time {
    font-size: var(--text-xs);
  }

  &-discount {
    font-size: var(--text-xs);
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 28px;
    border: 1px solid #26e3d2;
    color: #26e3d2;
    width: max-content;
    margin-left: auto;
    white-space: nowrap;
  }

  &-title {
    font-size: 24px;
    font-weight: 700;
    color: #d6d6d6;
    padding: 16px var(--padding);
    span {
      font-size: 14px;
      font-weight: 400;
      color: #707070;
    }
  }

  &-options {
    padding-top: 16px;
    margin: 0 var(--padding);
    border-top: 1px solid #484748;
    &-item {
      display: flex;
      align-items: center;
      &:not(:last-of-type) {
        margin-bottom: 8px;
      }
      &-icon {
        margin-right: 8px;
      }
      &-text {
        font-size: var(--text-xs);
        color: #99999a;
      }
    }
  }

  &-action {
    width: 100%;
    padding: 16px var(--padding) var(--padding);
    .btn {
      font-size: var(--text-base);
      font-weight: 600;
      width: 100%;
      padding: 12px;
      filter: none;
    }
  }

  .btn-outline-primary {
    --color: var(--primary);
    background: var(--color);
    mix-blend-mode: screen;

    &::after {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background: black;
    }

    span {
      color: black;
      background: var(--color);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      z-index: 1;
    }

    &:hover {
      --color: var(--primary-gradient);
    }
  }

  &.active {
    --padding: 24px;
    --bg: white;
    .service-subtitle {
      color: #141414;
    }
    .service-discount {
      color: #212121;
      background: #26e3d2;
    }
    .service-title {
      color: var(--primary);
    }
    .service-options {
      border-color: #d6d6d6;
      &-item {
        &-text {
          color: #484748;
        }
      }
    }
    .service-action {
      .btn {
        padding: 16px;
      }
    }
  }
}
</style>

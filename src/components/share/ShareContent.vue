<template>
  <div class="w-full share">
    <BannerIntroduce />
    <div class="share-giftcode">
      <div class="w-full content-block">
        <div class="flex items-start gap-3">
          <img src="@/assets/images/coin.png" class="" />
          <div class="flex flex-col">
            <p class="text-base font-semibold text-white mb-2">
              {{ $t("order.your_point") }}
            </p>
            <div class="flex items-center">
              <p class="share-text">{{ userInfo?.balance || 0 }} TP</p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full content-block">
        <p class="text-base font-semibold text-white mb-4">
          {{ $t("share.share_code") }}
        </p>
        <div class="flex items-center">
          <input :value="shareCode" class="share-input" readonly />
          <button class="btn btn-primary ml-3" @click="shareGiftCodeModal">
            <div class="flex-center px-2 py-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 10C10.6664 9.99988 10.3363 10.0667 10.029 10.1965C9.72181 10.3264 9.44376 10.5165 9.21137 10.7558L6.33027 8.90366C6.55655 8.32247 6.55655 7.67753 6.33027 7.09634L9.21137 5.2442C9.64387 5.68662 10.2252 5.95271 10.8427 5.99089C11.4603 6.02907 12.07 5.83662 12.5537 5.45085C13.0374 5.06507 13.3606 4.51344 13.4608 3.9029C13.5609 3.29235 13.4308 2.66638 13.0956 2.14631C12.7605 1.62624 12.2442 1.24912 11.6468 1.08805C11.0495 0.926982 10.4136 0.993439 9.86241 1.27454C9.31125 1.55564 8.88409 2.03136 8.66372 2.60948C8.44336 3.18761 8.44548 3.82696 8.66968 4.40361L5.78855 6.25577C5.44161 5.89953 4.99631 5.65484 4.50958 5.553C4.02285 5.45115 3.51681 5.49677 3.05615 5.68402C2.59548 5.87128 2.20112 6.19166 1.92349 6.60421C1.64585 7.01676 1.49756 7.50273 1.49756 8C1.49756 8.49727 1.64585 8.98324 1.92349 9.39579C2.20112 9.80834 2.59548 10.1287 3.05615 10.316C3.51681 10.5032 4.02285 10.5489 4.50958 10.447C4.99631 10.3452 5.44161 10.1005 5.78855 9.74423L8.66969 11.5964C8.4768 12.0941 8.44833 12.6406 8.58843 13.1557C8.72854 13.6707 9.02987 14.1275 9.44831 14.4589C9.86674 14.7904 10.3803 14.9792 10.9138 14.9977C11.4473 15.0162 11.9727 14.8634 12.4131 14.5617C12.8534 14.26 13.1857 13.8253 13.3611 13.3211C13.5366 12.8169 13.546 12.2699 13.388 11.76C13.2301 11.2501 12.913 10.8041 12.4833 10.4874C12.0536 10.1707 11.5338 9.99991 11 10V10Z"
                  fill="currentColor"
                />
              </svg>
              <span class="text-base font-semicold ml-2">{{
                $t("share.share")
              }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="w-full content-block">
      <p class="text-base font-semibold text-white mb-4">
        {{ $t("share.steps_to_get_voucher") }}
      </p>
      <div class="share-step">
        <div class="share-step-item" v-for="(step, index) in steps">
          <div class="share-step-item-index">{{ index + 1 }}</div>
          <p class="share-step-item-text">{{ step }}</p>
        </div>
      </div>
    </div>

    <ShareGiftcode />
  </div>
  <ShareGiftCodeModal ref="shareGiftCodeRef" />
</template>

<script setup>
import ShareGiftcode from "@/components/share/ShareGiftcode.vue";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import ShareGiftCodeModal from "@/components/common/ShareGiftCodeModal.vue";
import BannerIntroduce from "../common/BannerIntroduce.vue";

const { t } = useI18n();

const userStore = useUserStore();
const shareGiftCodeRef = ref();

const userInfo = computed(() => userStore.userInfo);
const shareCode = computed(() => userInfo.value?.created_by || "");

const steps = computed(() => [
  t("share.step_1"),
  t("share.step_2"),
  t("share.step_3"),
  t("share.step_4"),
]);

const shareGiftCodeModal = () => {
  shareGiftCodeRef.value?.open();
};
</script>

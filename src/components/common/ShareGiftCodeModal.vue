<template>
  <modal class="buy-giftcode-modal" :title="$t('share.share_code')" ref="modalRef" @close-from-icon="close">
    <div class="flex flex-col">
      <p class="share-content text-base">{{ $t("share.your_code_is") }}</p>
      <div class="code-box">
        <span>{{ refCode }}</span>
        <button @click="copyCode" class="copy-button">
          <img :src="copy" alt="" class="w-full h-full object-cover">
        </button>
      </div>
      <p class="share-content text-base">{{ $t("share.share_to_get_vouchers") }}</p>
      <div class="share-media gap-3">
        <div v-for="(item, index) in socials" :key="index" class="flex flex-col items-center gap-2 cursor-pointer"
          @click="item.handler">
          <img :src="item.image" alt="">
          <p class="">{{ item.text }}</p>
        </div>
      </div>
      <div class="flex items-center w-full gap-3 ">
        <button class="w-full btn btn-cancel" @click="close">
          {{ $t("share.cancel") }}
        </button>
        <button class="w-full btn btn-primary" @click="close">
          {{ $t("share.accept") }}
        </button>
      </div>
    </div>
  </modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useSnackbarStore } from "@/stores/snackbar";
import { useShareLink } from "vue3-social-sharing";
import { useI18n } from "vue-i18n";

import Modal from "@/components/common/Modal.vue";
import copy from "@/assets/images/copy.png";

import facebook from "@/assets/images/facebook.png";
import twitter from "@/assets/images/twitter.png";
import telegram from "@/assets/images/telegram.png";
import email from "@/assets/images/gmail.png";

const { t } = useI18n();

const { shareLink } = useShareLink();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();

const socialShare = (network) => {
  if (!network) return;

  shareLink({
    network,
    url: shareUrl.value
  });
}

const modalRef = ref(null);

const userInfo = computed(() => userStore.userInfo);
const refCode = computed(() => userInfo.value?.ref_code || "");
const account = computed(() => userInfo.value?.account || "");
const shareUrl = computed(() => window.location.origin + "/register?aff=" + (refCode.value || account.value));
const socials = computed(() => ([
  {
    image: facebook,
    text: 'Facebook',
    handler: () => socialShare("facebook")
  },
  {
    image: twitter,
    text: 'Twitter',
    handler: () => socialShare("twitter")
  },
  {
    image: telegram,
    text: 'Telegram',
    handler: () => socialShare("telegram")
  },
  {
    image: email,
    text: 'Email',
    handler: () => socialShare("email")
  },
]));

const copyCode = () => {
  navigator.clipboard.writeText(refCode.value).then(() => {
    snackbarStore.add({ message: t("share.copied") });
  });
};


const open = () => {
  modalRef.value?.open();
}

const close = () => {
  modalRef.value?.close();
}

defineExpose({ open, close });
</script>

<style lang="scss">
.buy-giftcode-modal {
  .modal {
    width: 386px;
    padding: 0;

    .modal-header {
      padding: 32px;
    }

    .modal-content {
      padding: 0 32px 32px;
      min-height: auto;

      p {
        margin-bottom: 12px;
      }

      .btn {
        padding: 12px;

        &-cancel {
          border: 1px solid white;
          color: white;
        }
      }
    }
  }

  .share-code {
    padding: 0 45px;
    margin-bottom: 32px;

    .giftcode-item-top {
      min-height: 104px;
    }
  }

  .share-content {
    margin-bottom: 12px;
  }

  .code-box {
    border: 1px solid #99999A;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 16px;

    span {
      font-size: 24px;
      margin-right: 10px;
      font-weight: bold;
    }
  }

  .share-media {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .share-text {
    margin-bottom: 15px;
    font-size: 14px;
  }

  .share-icons {
    display: flex;
    justify-content: space-around;
    gap: 10px;

    .share-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #333;
      color: #fff;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s;

      &:hover {
        background-color: #444;
      }

      &.facebook {
        background-color: #1877f2;
      }

      &.twitter {
        background-color: #1da1f2;
      }

      &.telegram {
        background-color: #0088cc;
      }

      &.email {
        background-color: #d93025;
      }
    }
  }
}
</style>
<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { formatPrice, formatUSDPrice } from "@/utils/price.js";
import { getRGBColor } from "@/utils/color.js";
import { useServiceStore } from "@/stores/service";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import { useSnackbarStore } from "@/stores/snackbar";
import { useLoadingStore } from "@/stores/loading";
import { useGiftcodeStore } from "@/stores/giftcode";
import { isJSONString } from "@/utils/json";

import HomeIcon from "@/assets/images/rabbit/icons/home.svg";
import TagIcon from "@/assets/images/rabbit/icons/tag.svg";
import GiftIcon from "@/assets/images/rabbit/icons/gift.svg";
import HelpIcon from "@/assets/images/rabbit/icons/help-circle.svg";
import ShareIcon from "@/assets/images/rabbit/icons/share-network.svg";
import SettingIcon from "@/assets/images/rabbit/icons/setting.svg";

import HomePrimaryIcon from "@/assets/images/rabbit/icons/home-primary.svg";
import TagPrimaryIcon from "@/assets/images/rabbit/icons/tag-primary.svg";
import GiftPrimaryIcon from "@/assets/images/rabbit/icons/gift-primary.svg";
import HelpPrimaryIcon from "@/assets/images/rabbit/icons/help-circle-primary.svg";
import SharePrimaryIcon from "@/assets/images/rabbit/icons/share-network-primary.svg";
import SettingPrimaryIcon from "@/assets/images/rabbit/icons/setting-primary.svg";

import srcBestChoiceCN from "@/assets/images/rabbit/best-choice-cn.png"
import srcBestChoiceEN from "@/assets/images/rabbit/best-choice-en.png"
import srcBestChoiceID from "@/assets/images/rabbit/best-choice-id.png"
import srcBestChoiceMY from "@/assets/images/rabbit/best-choice-my.png"
import srcBestChoiceTH from "@/assets/images/rabbit/best-choice-thai.png"
import srcBestChoiceVN from "@/assets/images/rabbit/best-choice-vn.png"

import ProgressBar from "@/components/common/ProgressBar.vue";
import dayjs from "dayjs";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const serviceStore = useServiceStore();
const userStore = useUserStore();
const snackbarStore = useSnackbarStore();
const loadingStore = useLoadingStore();
const giftcodeStore = useGiftcodeStore();
const isDrawerOpen = ref(true);
const isWebPlatform = computed(() => userStore.isWebPlatform);
const giftcodeList = computed(() => giftcodeStore.giftcodeList || []);
const navItemList = computed(() => {
  let result = [
    {
      title: t("global.home"),
      name: "home",
      icon: HomeIcon,
      active_icon: HomePrimaryIcon,
      path: "/",
      count: 0,
    },
    {
      title: t("global.services"),
      name: "service",
      icon: TagIcon,
      active_icon: TagPrimaryIcon,
      path: "/service",
      count: 0,
    },
    {
      title: t("global.giftcode"),
      name: "giftcode",
      icon: GiftIcon,
      active_icon: GiftPrimaryIcon,
      path: "/giftcode",
      count: giftcodeList.value?.length,
    },
    {
      title: t("global.support"),
      name: "support",
      icon: HelpIcon,
      active_icon: HelpPrimaryIcon,
      path: "/support",
      count: 0,
    },
    {
      title: t("global.share"),
      name: "share",
      icon: ShareIcon,
      active_icon: SharePrimaryIcon,
      path: "/share",
      count: 0,
    },
    {
      title: t("global.setting"),
      name: "setting",
      icon: SettingIcon,
      active_icon: SettingPrimaryIcon,
      path: "/",
      count: 0,
      children: [
        {
          title: t("global.profile"),
          name: "profile",
          handler: goToProfile,
        },
        {
          title: t("global.refresh"),
          name: "refresh",
          handler: handleRefresh,
        },
        {
          title: t("global.logout"),
          name: "logout",
          handler: handleLogout,
        },
      ],
    },
  ];

  // if(!isWebPlatform.value) {
  //     result.unshift({ title: t("global.home"), name: "home", path: "/" });
  // }
  return result;
});

// const activeItem = ref({ title: t("global.home"), name: "home", path: "/" });
const activeItem = ref(null);

const recommendServiceList = computed(() => serviceStore.recommendServiceList);
const isAddingTimeVisible = computed(() => serviceStore.isAddingTimeVisible);
const userInfo = computed(() => userStore.userInfo);
const remainingValue = computed(() => userStore.remainingValue);

const dayTotal = computed(() => {
  let extra = 200;
  if (userInfo.value) {
    let duration = dayjs(userInfo.value.ngayhethan).diff(
      dayjs(userInfo.value.ngaydangky),
      "day"
    );
    return (duration > 1 ? duration : 1) + extra;
  }
  return 1 + extra;
});

const isEn = computed(() => locale.value == "en");

const srcBestChoice = computed(() => {
  switch (locale.value) {
    case "zh":
      return srcBestChoiceCN;
    case "id":
      return srcBestChoiceID;
    case "ms":
      return srcBestChoiceMY;
    case "th":
      return srcBestChoiceTH;
    case "vi":
      return srcBestChoiceVN;
    default:
      return srcBestChoiceEN;
  }
});

const paypalSubscriptionBillingInfo = computed(() => {
  if (isJSONString(userInfo.value?.paypal_subscription?.billing_info)) {
    return JSON.parse(userInfo.value.paypal_subscription.billing_info);
  }
  return null;
});

const isPaypalSubscriptionAvailable = computed(() => {
  if (!userInfo.value?.paypal_subscription) return false;
  if (userInfo.value.paypal_subscription.status !== "ACTIVE") return false;
  if (
    !paypalSubscriptionBillingInfo.value?.next_billing_time ||
    dayjs(paypalSubscriptionBillingInfo.value?.next_billing_time).diff(
      dayjs(),
      "day"
    ) < 0
  )
    return false;
  return true;
});

const formatDate = (date) => {
  if (!date) return "N/A";
  return dayjs(date).format("MM/DD/YYYY");
};

const goToItem = (item) => {
  activeItem.value = item;
  router.push(item.path);
};

const handleLogout = () => {
  userStore.logout();
};

const handleRefresh = () => {
  window.location.reload();
};

const goToProfile = () => {
  router.push("/profile");
};

const goToService = () => {
  router.push("/service");
};

const selectService = (service) => {
  serviceStore.setCurrentService(service);
};

const handleVerifyEmail = async () => {
  try {
    loadingStore.open();
    await userStore.resendVerify();
    snackbarStore.add({ message: "Verification email has been sent!" });
  } catch (error) {
    console.log("Error: ", error);
    snackbarStore.add({
      message: "Sending verification email failed!",
      type: "danger",
    });
  } finally {
    loadingStore.close();
  }
};

onMounted(async () => {
  const isDrawer = await getStorageItem("isDrawer");
  if (typeof isDrawer === "boolean") isDrawerOpen.value = isDrawer;
});

watch(
  () => route,
  () => {
    if (route?.name && navItemList.value?.length) {
      activeItem.value = navItemList.value.find(
        (item) => item.name == route.name || route.meta?.parent == item.name
      );
    }
  },
  { immediate: true, deep: true }
);

watch(isDrawerOpen, (newValue) => {
  setStorageItem("isDrawer", String(newValue));
});
</script>

<template>
  <div class="the-drawer" :class="{ open: isDrawerOpen }">
    <div class="the-drawer-top">
      <div class="cursor-pointer the-drawer-logo" @click="router.push('/')">
        <img src="@/assets/images/rabbit/logo.png" v-show="isDrawerOpen" />
        <img src="@/assets/images/rabbit/rabbit.png" v-show="!isDrawerOpen" />
      </div>
      <div
        class="cursor-pointer the-drawer-toggle"
        @click="isDrawerOpen = !isDrawerOpen"
      >
        <img src="@/assets/images/rabbit/icons/sidebar-toggle.svg" />
      </div>
    </div>

    <!-- <div class="cursor-pointer avatar" @click="router.push('/profile')">
            <img :src="userInfo.avatar" class="absolute-full rounded-full" v-if="userInfo?.avatar" />
            <img src="@/assets/images/avatar.png" class="absolute-full" v-else />
        </div>
        <p class="svn-rex user-name">{{ userInfo?.full_name }}</p>
        <p class="text-xs user-id">{{ $t("global.id") }}: {{ userInfo?.id }}</p>

        <div class="remaining-block">
            <div v-if="!isPaypalSubscriptionAvailable">
                <p class="text-xs remaining-total">{{ remainingText }}</p>
                <progress-bar :total="dayTotal" :remain="remainingValue" />
            </div>
            <p class="text-xs text-center mt-3 verify-email-text cursor-pointer" v-if="!userInfo?.email_verified" @click="handleVerifyEmail"><span class="text-sm">⚠</span> Verify Email</p>
            <div class="text-xs text-center mt-3" v-if="isPaypalSubscriptionAvailable">
                <p>Subscription ID: {{ userInfo.paypal_subscription.id }}</p>
                <p class="mt-1">(Next billing: {{ formatDate(paypalSubscriptionBillingInfo?.next_billing_time) }})</p>
            </div>
        </div> -->

    <div class="h-full the-drawer-bottom">
      <div class="w-full h-full the-drawer-nav">
        <div
          v-for="(item, index) in navItemList"
          :key="index"
          :class="{
            'flex flex-col mt-auto justify-end':
              index && index === navItemList.length - 1,
          }"
        >
          <div
            class="the-drawer-register"
            v-if="index && index === navItemList.length - 1"
          >
            <div class="the-drawer-register-img">
              <img
                :src="srcBestChoice"
                class="absolute-full"
              />
            </div>
            <div class="the-drawer-register-content">
              <p class="the-drawer-register-title">
                {{
                  remainingValue == 0
                    ? $t("global.register_now_for")
                    : $t("global.extend_now_for")
                }}
              </p>
              <button
                class="btn btn-primary the-drawer-register-btn"
                @click="goToService"
              >
                <span class="the-drawer-register-btn-text">
                  {{
                    remainingValue == 0
                      ? $t("global.register_now")
                      : $t("global.extend_now")
                  }}
                </span>
                <img
                  src="@/assets/images/rabbit/icons/arrow-right-white.svg"
                  class="the-drawer-register-btn-icon"
                />
              </button>
            </div>
          </div>

          <div class="custom-select-component">
            <button
              class="w-full custom-select the-drawer-nav-item"
              :class="{ active: activeItem?.name == item.name }"
              @click="item.children?.length ? () => {} : goToItem(item)"
            >
              <img :src="item.icon" class="the-drawer-nav-item-icon" />
              <img :src="item.active_icon" class="the-drawer-nav-item-icon" />
              <span class="the-drawer-nav-item-text">{{ item.title }}</span>
              <span class="the-drawer-nav-item-count" v-if="item.count">
                {{ String(item.count).padStart(2, "0") }}
              </span>

              <div class="option-menu" v-if="item.children?.length">
                <div
                  class="whitespace-nowrap option"
                  v-for="(child, i) in item.children"
                  :key="i"
                  @click="child.handler"
                >
                  {{ child.title }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="w-full recommend-service-list">
            <div class="service-item" v-for="(service, index) in recommendServiceList" :key="index"
                :style="`
                    --service-color: ${getRGBColor(service.color)};
                    --icon-color: ${service.icon_color}
                `"
                @click="selectService(service)"
            >
                <div class="service-info">
                    <div class="mb-1">
                        <p class="inter-bold text-lg mb-0 service-duration">
                            {{ service.title }}
                        </p>
                        <p class="inter text-xs ml-1" v-if="isAddingTimeVisible" style="transform: translateY(-2px);">{{ service.adding_time_title }}</p>
                    </div>
                    <p class="inter-bold text-sm service-price">{{ isEn ? formatUSDPrice(service.usd_price) : (formatPrice(service.price) + "đ") }}</p>
                </div>
                <div class="flex-center plus-icon">
                    <img src="@/assets/images/icons/plus.svg" />
                </div>
            </div>
        </div> -->
  </div>
</template>

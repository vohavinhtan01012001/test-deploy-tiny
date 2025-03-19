<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import GlobalSearchSelect from "@/components/common/GlobalSearchSelect.vue";
import CustomSelect from "@/components/common/CustomSelect.vue";
import SearchModal from "@/components/common/SearchModal.vue";
import Switch from "@/components/common/Switch.vue";
import axios from "@/axios";
import{ useLanguage } from "@/hooks/useLanguage.js";

const { language, languageList } = useLanguage();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const keyword = ref("");
const statusSwitch = ref(false);
const searchModalRef = ref(null);

const isWebPlatform = computed(() => userStore.isWebPlatform);
const userInfo = computed(() => userStore.userInfo);
const showLogout = computed(() => {
  if (userStore.token) {
    return true;
  }
  return false;
});
const statusSwitchLabel = computed(() =>
  statusSwitch.value ? "Tiny On" : "Tiny Off"
);
const remainingValue = computed(() => userStore.remainingValue);
const remainingText = computed(() => {
  return t("global.remaining_day", remainingValue.value);
});

const handleBeforeToggle = (newValue) => {};

const handleLogout = () => {
  userStore.logout();
};

const handleRefresh = () => {
  window.location.reload();
};

const goToProfile = () => {
  router.push("/profile");
};

const showSearchModal = () => {
  searchModalRef.value?.open();
};

</script>

<template>
  <div class="the-header">
    <!-- <search-input v-model="keyword" v-if="route?.name === 'home' && !isWebPlatform" @click="showSearchModal" />
        <div class="flex-center right-content">
            <a class="btn btn-primary decoration-none mr-10"
                href="https://tiny.vn/download/dist/Tiny.VN%20Setup%200.4.2.exe"
                v-if="route?.name !== 'home' && isWebPlatform">
                <span class="btn-text">{{ $t("global.download") }}</span>
            </a>
            <custom-select v-model="language" :options="languageList" />
            <div class="custom-select-component">
                <button class="custom-select logout-dropdown" v-show="showLogout">
                    <div class="icon-btn logout-btn">
                        <img src="@/assets/images/icons/logout.svg" />
                    </div>
                    <div class="option-menu">
                        <div class="whitespace-nowrap option" @click="goToProfile">
                            {{ $t("global.profile") }}
                        </div>
                        <div class="whitespace-nowrap option" @click="handleRefresh">
                            {{ $t("global.refresh") }}
                        </div>
                        <div class="whitespace-nowrap option" @click="handleLogout">
                            {{ $t("global.logout") }}
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <SearchModal solid-background ref="searchModalRef" /> -->
    <template v-if="userInfo">
      <div class="cursor-pointer the-header-user" @click="goToProfile">
        <div class="the-header-user-avatar">
          <img
            :src="userInfo.avatar"
            class="absolute-full rounded-full"
            v-if="userInfo?.avatar"
          />
          <img src="@/assets/images/avatar.png" class="absolute-full" v-else />
        </div>
        <div>
          <p class="the-header-user-name">
            {{ userInfo?.full_name }}

            <span
              class="the-header-user-tag-free-trial"
              v-if="remainingValue === 0"
            >
              {{ $t("global.free_trial") }}
            </span>
            <span class="the-header-user-tag-subcribe" v-else>
              {{ remainingText }}
            </span>
          </p>

          <p class="the-header-user-id">
            {{ $t("global.id") }}: {{ userInfo?.id }}
          </p>
        </div>
      </div>
      <GlobalSearchSelect />
      <custom-select v-model="language" :options="languageList" selectedLabel="shortName" :style="{minWidth: '75px'}" />
      <Switch v-model="statusSwitch" :label="statusSwitchLabel" />
    </template>
    <template v-else>
      <div class="w-full flex items-center justify-between">
        <div class="cursor-pointer the-header-logo" @click="router.push('/')">
          <img src="@/assets/images/rabbit/logo.png" />
        </div>
        <custom-select v-model="language" :options="languageList" />
      </div>
    </template>
  </div>
</template>

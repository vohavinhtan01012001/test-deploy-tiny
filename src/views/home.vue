<template>
  <div class="flex flex-col overflow-auto home-view">
    <BannerSwiper />
    <template v-if="!isWebPlatform">
      <server-block class="mb-4" />
      <game-select />

    </template>
    <template v-else>
      <div class="flex flex-col flex-center mx-auto py-10" style="max-width: 500px; min-height: 80vh">
        <h3 class="font-normal text-center download-text">{{ $t("home.download_recommendation") }}</h3>
        <a class="btn btn-primary decoration-none download-btn"
          href="https://tiny.vn/download/dist/Tiny.VN%20Setup%200.4.2.exe"
          v-if="route?.name !== 'home' && isWebPlatform">
          <span class="btn-text">{{ $t("global.download") }}</span>
        </a>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import ServerBlock from "@/components/home/ServerBlock.vue";
import GameSelect from "@/components/home/GameSelect.vue";
import BannerSwiper from "@/components/common/BannerSwiper.vue";

const userStore = useUserStore();
const isWebPlatform = computed(() => userStore.isWebPlatform);
</script>

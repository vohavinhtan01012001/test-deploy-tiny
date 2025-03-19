<script setup>
import { ref, computed, onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "@/stores/game";
import { useServerStore } from "@/stores/server";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/css";
import { connectGameServer } from "@/utils/server";
import { useRouter } from "vue-router";

const modules = [Navigation];

const gameStore = useGameStore();
const serverStore = useServerStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const router = useRouter();

const container = ref(null);
const loading = ref(false);

const gameList = computed(() => [
  ...serverStore.vipServerList?.map((server) => ({
    ...server,
    server_id: server.id,
    name: server.tiny_name,
    description: server.note,
    thumbnail: null,
  })),
  ...gameStore.gameList,
]);

const serverList = computed(() => [
  ...serverStore.serverList,
  ...serverStore.vipServerList,
]);

const fetchGameList = async () => {
  while (!gameStore.isLastPage) {
    await gameStore.getGameList();
  }
};

onMounted(async () => {
  await fetchGameList();
});

// onMounted(() => {
//   container.value = document.getElementById("game-list");
//   container.value.addEventListener("wheel", wheelHandler);
// });

// onBeforeUnmount(() => {
//   container.value.removeEventListener("wheel", wheelHandler);
// });

// const wheelHandler = async () => {
//   if (!container.value || loading.value) return;

//   let scrollTotalHeight = container.value.scrollHeight;
//   let scrollViewHeight = container.value.clientHeight;
//   let scrollTop = container.value.scrollTop;

//   if (scrollTop > scrollTotalHeight - scrollViewHeight - 50) {
//     loading.value = true;
//     // await gameStore.loadMoreGame();
//     await gameStore.getGameList();
//     loading.value = false;
//   }
// };

const handleConnect = async (game) => {
  // if (!game.server_id) {
  //     snackbarStore.add({ message: "Invalid game config", type: "danger" });
  //     return;
  // }
  // if (!serverList.value?.length){
  //     snackbarStore.add({ message: "Server is not loaded, please try again", type: "danger" });
  //     return;
  // }
  // let server = serverList.value.find((server => server.id == game.server_id));
  // if(!server) {
  //     snackbarStore.add({ message: "Server is not found", type: "danger" });
  //     return;
  // }
  // try {
  //     loadingStore.open();
  //     await serverStore.connectServer(server);
  // } finally {
  //     loadingStore.close();
  // }
  connectGameServer(game);
};

const goToAllGame = async () => {
  await router.push("/all-game");
};
</script>

<template>
  <div class="content-block game-select">
    <div class="game-select-header">
      <div class="flex items-center">
        <p class="game-select-title">{{ $t("home.select_game") }}</p>
        <span class="block-count game-select-count" v-if="gameList?.length">
          {{ String(gameList?.length).padStart(2, "0") }}
        </span>
      </div>
      <div class="game-select-view-all" @click="goToAllGame">
        {{ $t("global.view_all") }}
        <!-- <img src="@/assets/images/rabbit/icons/arrow-right.svg" /> -->
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.14642 12.8536C9.05269 12.7598 9.00003 12.6326 9.00003 12.5C9.00003 12.3674 9.05269 12.2402 9.14642 12.1465L12.7929 8.50001H3C2.86739 8.50001 2.74021 8.44733 2.64645 8.35357C2.55268 8.2598 2.5 8.13262 2.5 8.00001C2.5 7.8674 2.55268 7.74023 2.64645 7.64646C2.74021 7.55269 2.86739 7.50001 3 7.50001H12.7929L9.14642 3.85356C9.1 3.80713 9.06317 3.752 9.03804 3.69134C9.01292 3.63067 8.99999 3.56565 8.99999 3.49999C8.99999 3.43433 9.01293 3.36931 9.03806 3.30865C9.06319 3.24798 9.10002 3.19286 9.14645 3.14643C9.19289 3.10001 9.24801 3.06318 9.30867 3.03805C9.36934 3.01293 9.43436 3 9.50002 3C9.56568 3 9.6307 3.01294 9.69137 3.03807C9.75203 3.0632 9.80715 3.10003 9.85358 3.14647L14.3536 7.64647C14.3552 7.64808 14.3566 7.64988 14.3582 7.65153C14.368 7.66166 14.3776 7.67207 14.3866 7.68299C14.3916 7.6891 14.396 7.69557 14.4007 7.70186C14.4057 7.70863 14.411 7.71528 14.4157 7.72233C14.4206 7.7296 14.4248 7.73716 14.4293 7.74464C14.4332 7.75117 14.4373 7.75755 14.4409 7.76429C14.4449 7.7718 14.4483 7.77955 14.452 7.78721C14.4553 7.79435 14.4589 7.80137 14.4619 7.80867C14.465 7.81605 14.4674 7.82362 14.4701 7.83113C14.473 7.839 14.476 7.84681 14.4784 7.85487C14.4807 7.86235 14.4823 7.86995 14.4843 7.87751C14.4863 7.88575 14.4886 7.89393 14.4903 7.90233C14.492 7.91106 14.4931 7.91984 14.4943 7.9286C14.4954 7.93599 14.4968 7.94322 14.4975 7.95066C14.4991 7.96708 14.5 7.98353 14.5 8.00001C14.5 8.01649 14.4991 8.03294 14.4975 8.04936C14.4968 8.05681 14.4954 8.06404 14.4943 8.07142C14.4931 8.08018 14.492 8.08897 14.4903 8.0977C14.4886 8.10609 14.4863 8.11427 14.4843 8.12251C14.4823 8.13008 14.4807 8.13768 14.4784 8.14515C14.476 8.15321 14.473 8.16102 14.4701 8.1689C14.4674 8.1764 14.465 8.18397 14.4619 8.19136C14.4589 8.19865 14.4553 8.20567 14.452 8.21281C14.4483 8.22047 14.4449 8.22822 14.4409 8.23573C14.4373 8.24247 14.4332 8.24885 14.4293 8.25538C14.4248 8.26286 14.4206 8.27043 14.4157 8.27769C14.411 8.28474 14.4057 8.29139 14.4007 8.29817C14.396 8.30445 14.3916 8.31093 14.3866 8.31703C14.3775 8.32817 14.3677 8.33876 14.3576 8.34907C14.3562 8.35051 14.355 8.35212 14.3536 8.35356L9.85358 12.8536C9.80715 12.9 9.75202 12.9368 9.69136 12.962C9.63069 12.9871 9.56567 13 9.5 13C9.43433 13 9.36931 12.9871 9.30864 12.962C9.24798 12.9368 9.19285 12.9 9.14642 12.8536Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>

    <div class="game-select-list" v-if="gameList?.length">
      <swiper
        :slides-per-view="'auto'"
        :space-between="12"
        :initial-slide="0"
        :navigation="true"
        :modules="modules"
        :centered-slides="false"
        @wheel="wheelHandler"
      >
        <swiper-slide v-for="(game, index) in gameList" :key="index">
          <div class="game-select-item">
            <div class="game-select-item-thumbnail">
              <img
                :src="game.thumbnail"
                class="absolute-full"
                v-if="game.thumbnail"
              />
              <img
                src="@/assets/images/server.png"
                class="absolute-full"
                v-else-if="game.tiny_name"
              />
              <img
                src="@/assets/images/empty.png"
                class="absolute-full"
                v-else
              />
            </div>
            <div class="game-select-item-info">
              <p class="game-select-title">{{ game.name }}</p>
            </div>
            <div class="hover-layout">
              <button class="btn btn-primary" @click="handleConnect(game)">
                {{ $t("global.connect_btn") }}
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div v-else>
      {{ $t("global.no_data_available") }}
    </div>

    <!-- <div class="relative game-list-container">
            <div id="game-list" class="game-list">
                <template v-if="gameList?.length">
                    <div class="game-item" v-for="(game, index) in gameList" :key="index">
                        <div class="game-thumbnail">
                            <img :src="game.thumbnail" class="absolute-full" v-if="game.thumbnail" />
                            <img src="@/assets/images/server.png" class="absolute-full" v-else-if="game.tiny_name" />
                            <img src="@/assets/images/empty.png" class="absolute-full" v-else />
                        </div>
                        <div class="game-info">
                            <div class="flex justify-between top-info">
                                <p class="svn-avo-bold text-lg game-title">{{ game.name }}</p>
                                <img src="@/assets/images/icons/heart-primary.svg" class="ml-2 heart-icon" />
                            </div>
                            <div class="text-10px game-description">
                                {{ game.description }}
                            </div>
                        </div>
                        <div class="hover-layout">
                            <button class="btn btn-primary" @click="handleConnect(game)">
                                <span class="btn-text">{{ $t("global.connect_btn") }}</span>
                            </button>
                        </div>
                    </div>
                </template>
            </div>
            <div class="py-10" v-if="!gameList?.length">
                {{ $t("global.no_data_available") }}
            </div>
            <div class="bottom-layout" v-else>
            </div>
            <div class="loading" v-if="loading"></div>
        </div> -->
  </div>
</template>

import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useServerStore } from "./server";
import FlagImg from "@/assets/images/flag.png";
import GameThumbnail from "@/assets/images/game-thumbnail.png";
import axios from "../axios";

export const useGameStore = defineStore("game", () => {
  const serverStore = useServerStore();
  const gameList = ref([]);
  const pageInfo = ref({
    current: 1,
    perPage: 20,
  });
  const lastPage = ref();
  const gameListWithSearch = ref([]);
  const keyword = ref("");

  const timer = ref(null);

  const serverList = computed(() => serverStore.serverList);
  const serverListWithSearch = computed(() =>
    serverList.value?.filter(
      (server) =>
        !keyword.value ||
        checkMatchedKeyword([server.name, server.country_code], keyword.value)
    )
  );
  const searchedList = computed(() => [
    ...gameListWithSearch.value,
    ...serverListWithSearch.value,
  ]);

  function checkSubString(str1, str2) {
    if (str1 == "" && str2 == "") return true;
    if (str1 && str2 && str1.toLowerCase()?.includes(str2.toLowerCase()))
      return true;
    return false;
  }

  function checkMatchedKeyword(array, keyword) {
    if (array?.length) {
      for (let item of array) {
        if (checkSubString(item, keyword)) {
          return true;
        }
      }
    }
    return false;
  }

  function mapGameList(list) {
    if (!list || !list.length) return [];
    return list.map((item) => ({
      ...item,
      thumbnail: item.thumbnail ?? GameThumbnail,
    }));
  }

  const isLastPage = computed(() => {
    return lastPage.value && pageInfo.value.current > lastPage.value;
  });

  function getGameList() {
    // /api/end-user/game/list?page=2
    // gameList.value = [...Array(20)].map(_ => ({
    //     thumbnail: GameThumbnail,
    //     title: "Art",
    //     description: "Creative IRL"
    // }));
    if (lastPage.value && pageInfo.value.current > lastPage.value) return;
    let params = {
      page: pageInfo.value.current,
    };
    return new Promise((resolve, reject) => {
      axios
        .get("/api/end-user/game/list", { params })
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            if (response.data.data?.data?.length) {
              let list = mapGameList(response.data.data.data);
              gameList.value.push(...list);
              pageInfo.value.current++;
            }
            lastPage.value = response.data.data?.last_page || 0;
            resolve(gameList.value);
          } else {
            gameList.value = [];
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // function loadMoreGame() {
  //     return new Promise((resolve) => {
  //         clearTimeout(timer.value);
  //         timer.value = setTimeout(() => {
  //             getGameList(gameList.value.length + 20);
  //             resolve(gameList.value);
  //         }, 1000);
  //     });
  // }

  function resetGameList() {
    gameList.value = [];
    pageInfo.value.current = 1;
  }

  function getGameSearchList(params) {
    // /api/end-user/game/search?keyword=test
    if (params && params.keyword != null && params.keyword != undefined) {
      keyword.value = params.keyword;
    } else {
      keyword.value = "";
    }
    return new Promise((resolve, reject) => {
      axios
        .get("/api/end-user/game/search", { params })
        .then((response) => {
          gameListWithSearch.value = response?.data?.data || [];
          resolve();
        })
        .catch((error) => {
          gameListWithSearch.value = [];
          reject(error);
        });
    });
  }

  return {
    isLastPage,
    getGameList,
    // loadMoreGame,
    resetGameList,
    getGameSearchList,
    gameList,
    searchedList,
    gameListWithSearch,
    serverListWithSearch,
    keyword,
  };
});

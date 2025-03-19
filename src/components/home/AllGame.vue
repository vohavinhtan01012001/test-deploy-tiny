<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useGameStore } from "@/stores/game";
import { useServerStore } from "@/stores/server";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { useI18n } from "vue-i18n";
import { connectGameServer } from "@/utils/server";
import CustomSelect from "@/components/common/CustomSelect.vue";

const gameStore = useGameStore();
const serverStore = useServerStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const { t } = useI18n();

const container = ref(null);
const loading = ref(false);
const showPopover = ref(false);
const searchByName = ref("");
const filteredGameList = ref([]);

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

const applyFilters = () => {
  const filteredGames = filteredGameList.value.filter((game) => {
    return game.name.toLowerCase().includes(searchByName.value.toLowerCase());
  });

  filteredGameList.value = Boolean(searchByName.value)
    ? filteredGames
    : gameList.value;
  showPopover.value = false;
};

const handleConnect = async (game) => {
  connectGameServer(game);
};

const togglePopover = () => {
  showPopover.value = !showPopover.value;
};

const handleClickOutside = (event) => {
  const popoverElement = document.querySelector(".popover");
  if (popoverElement && !popoverElement.contains(event.target)) {
    showPopover.value = false;
  }
};

const fetchGameList = async () => {
  while (!gameStore.isLastPage) {
    await gameStore.getGameList();
    filteredGameList.value = gameList.value;
  }
}

onMounted(async () => {
  await fetchGameList();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="content-block all-game">
    <section class="all-game__header">
      <div class="all-game__header--title">
        <p>{{ t("global.game") }}</p>
        <span class="block-count" v-if="filteredGameList?.length">
          {{ String(filteredGameList?.length).padStart(2, "0") }}
        </span>
      </div>

      <div class="all-game__header--filter" @click.stop="togglePopover">
        <p>{{ t("global.filter") }}</p>
        <img src="@/assets/images/icons/filter.svg" />
      </div>
    </section>

    <section class="all-game__list">
      <template v-for="(game, index) in filteredGameList" :key="index">
        <div class="all-game__list--item">
          <div class="all-game__list--item-thumbnail">
            <img v-if="game.thumbnail" :src="game.thumbnail" />
            <img v-else-if="game.tiny_name" src="@/assets/images/server.png" />
            <img v-else src="@/assets/images/empty.png" />
          </div>

          <div class="all-game__list--item-info">
            <p class="all-game__list--item-info-title">{{ game.name }}</p>
          </div>

          <div class="hover-layout">
            <button class="btn btn-primary" @click="handleConnect(game)">
              {{ $t("global.connect_btn") }}
            </button>
          </div>
        </div>
      </template>
    </section>

    <div v-if="showPopover" class="popover">
      <input
        class="share-input"
        type="text"
        placeholder="Search by name"
        v-model="searchByName"
        @keyup.enter="applyFilters"
      />
      <button class="btn btn-primary" @click="applyFilters">Apply</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.all-game {
  margin-right: 16px;
  overflow: auto;
  position: relative;

  &__header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;

    &--title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &--filter {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;

      > p {
        color: #707070;
        font-size: 12px;
        font-weight: 400;
        line-height: 16.34px;
        font-family: "Open Sans";
      }
    }
  }

  &__list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;

    &--item {
      position: relative;
      padding: 8px;
      border-radius: 16px;
      background-color: #212121;
      min-height: 232px;

      &-thumbnail {
        border-radius: 8px;

        > img {
          border-radius: 8px;
          width: 160px;
          height: 184px;
        }
      }

      &-info {
        max-width: 160px;
        margin: 4px 0;

        &-title {
          font-size: 14px;
          font-weight: 400;
          line-height: 24px;
          font-family: "Open Sans";
          color: #99999a;
        }
      }

      .hover-layout {
        position: absolute;
        background: rgba(72, 71, 72, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: var(--transition);
        border-radius: inherit;
        left: 50%;
        top: 100px;
        transform: translate(-50%, -50%);

        .btn {
          min-width: 80px;
        }
      }
      &:hover {
        .hover-layout {
          opacity: 1;
          pointer-events: unset;
        }
      }
    }
  }

  .popover {
    position: absolute;
    background: #212121;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    top: 40px;
    right: 10px;
    width: 300px;
    padding: 12px;

    > button {
      margin-top: 12px;
      padding: 0 12px;
      margin-left: auto;
    }
  }
}
</style>

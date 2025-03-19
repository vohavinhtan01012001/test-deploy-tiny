<template>
    <div class="search" :class="{active: isMenuVisible, 'no-dropdown': noDropdown}">
        <button
            ref="buttonRef"
            class="search-btn"
            @blur="onButtonBlur"
            @focus="onButtonFocus"
        >
            <div class="flex items-center">
                <img
                    src="@/assets/images/rabbit/icons/arrow-left.svg"
                    class="search-back"
                    @click.stop="handleCloseMenu"
                />
                <div class="search-input" @click="inputRef?.focus()">
                    <input
                        ref="inputRef"
                        v-model="keyword"
                        :placeholder="placeholder || $t('global.search_placeholder')"
                        :disabled="disabled"
                        @focus="onInputFocus"
                        @blur="onInputBlur"
                        @input="handleInput"
                    />
                    <img src="@/assets/images/rabbit/icons/magnify.svg" class="search-input-icon" />
                </div>
            </div>
            <div class="search-menu">
                <div class="search-menu-content">
                    <p class="search-menu-title">{{ $t("global.recent_server") }}</p>
                    <div class="search-menu-server" v-if="serverListWithSearch?.length">
                        <Server
                            v-for="(server, index) in serverListWithSearch"
                            :key="index"
                            :server="server"
                            show-ping
                            class="search-menu-server-item"
                            @click="handleCloseMenu(), connectServer(server)"
                        />
                    </div>
                    <div class="text-white pt-4 pb-9" v-else>
                        {{ $t("global.no_data_available") }}
                    </div>
                    <p class="search-menu-title">Game</p>
                    <div class="search-menu-game" v-if="gameListWithSearchAndView?.length">
                        <div class="search-menu-game-item" v-for="(game, index) in gameListWithSearchAndView" :key="index">
                            <div class="search-menu-game-item-img">
                                <img :src="game.thumbnail || '@/assets/images/game-thumbnail.png'" class="absolute-full" />
                            </div>
                            <p class="search-menu-game-item-title">{{ game.name }}</p>
                            <div class="hover-layout">
                                <button class="btn btn-primary" @click="handleCloseMenu(), connectGameServer(game)">
                                    {{ $t("global.connect_btn") }}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="text-white pt-4 pb-9" v-else>
                        {{ $t("global.no_data_available") }}
                    </div>
                </div>
            </div>
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useGameStore } from "@/stores/game";
import { useDebounce } from "@/utils/debounce";
import { connectServer, connectGameServer } from "@/utils/server";
import Server from "@/components/common/Server.vue";

const props = defineProps({
    placeholder: {
        type: String,
        default: ""
    },
    disabled: {
        type: Boolean,
        default: false
    },
    noDropdown: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(["server-connected"]);
const gameStore = useGameStore();
const isLoading = ref(false);
const isButtonFocus = ref(false);
const isInputFocus = ref(false);
const inputRef = ref(null);
const buttonRef = ref(null);

const { gameListWithSearch, serverListWithSearch, keyword } = storeToRefs(gameStore);
const { getGameSearchList } = gameStore;
const gameListWithSearchAndView =  computed(() => {
    if(!gameListWithSearch.value?.length) return [];
    return gameListWithSearch.value;
});

const isMenuVisible = computed(() => isButtonFocus.value || isInputFocus.value);

const handleCloseMenu = () => {
    onButtonBlur();
    onInputBlur();
}

const onButtonFocus = () => {
    isButtonFocus.value = true;
}

const onInputFocus = () => {
    isInputFocus.value = true;
}

const onButtonBlur = () => {
    setTimeout(() => {
        isButtonFocus.value = false;
    }, 100);
}

const onInputBlur = () => {
    setTimeout(() => {
        isInputFocus.value = false;
    }, 300);
}

const handleInput = useDebounce(async () => {
    if(keyword.value?.length) {
        isLoading.value = true;
        try {
            await getGameSearchList({ keyword: keyword.value });
        } catch(error) {
            console.log("Error: ", error);
        } finally {
            isLoading.value = false;
        }
    }
});
</script>
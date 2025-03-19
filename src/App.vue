<template>
  <component :is="currentLayout">
    <template #aside>
      <the-drawer />
    </template>

    <template #header v-if="route?.name !== 'confirm-email'">
      <the-header />
    </template>

    <router-view />

    <renew-inform-modal ref="renewInformModalRef" />
  </component>

  <sale-modal ref="saleModalRef" @not-show-again="handleSetNotShowPopupAgain" @closed="handlePopupClosed" />

  <custom-loading v-if="isLoading" />
  <snackbar-container />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/loading";
import { useServiceStore } from "@/stores/service";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { useGeneralStore } from "@/stores/general";
import { useGiftcodeStore } from "@/stores/giftcode";
import { usePromotionPopupStore } from "@/stores/promotion-popup";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import dayjs from "dayjs";

import TheHeader from "@/components/layout/TheHeader.vue";
import TheDrawer from "@/components/layout/TheDrawer.vue";
import CustomLoading from "@/components/common/CustomLoading.vue";
import EmptyLayout from "@/layouts/empty.vue";
import RenewInformModal from "@/components/common/RenewInformModal.vue";
import SnackbarContainer from "@/components/common/SnackbarContainer.vue";
import SaleModal from "@/components/common/SaleModal.vue";

const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
const serviceStore = useServiceStore();
const userStore = useUserStore();
const gameStore = useGameStore();
const generalStore = useGeneralStore();
const giftcodeStore = useGiftcodeStore();
const promotionPopupStore = usePromotionPopupStore();

const serviceExtensionVisible = ref(true);
const renewInformModalRef = ref(null);
const saleModalRef = ref(null);
const popupList = ref([]);
const currentPopup = ref(null);

const isLoading = computed(() => loadingStore.isLoading);
const currentLayout = computed(() => route.meta?.layout || EmptyLayout);
const currentService = computed(() => serviceStore.currentService);
const remainingValue = computed(() => userStore.remainingValue);
const userInfo = computed(() => userStore.userInfo);
const promotionPopupListData = computed(() => promotionPopupStore.promotionPopupListData);
const promotionPopupList = computed(() => promotionPopupListData.value?.data || []);

watch(() => route, () => {
  if (route?.name != "service") {
    serviceStore.resetData();
  }
  if (route?.name != "home") {
    gameStore.resetGameList();
  }
}, { immediate: true, deep: true });

watch(() => currentService.value?.id, (newValue, oldValue) => {
  if (newValue === oldValue) return;
  if (currentService.value?.id) {
    serviceStore.setActiveView("payment");
    router.push("/service");
  }
}, { immediate: true, deep: true });

watch(() => [route, remainingValue.value, userInfo.value], () => {
  if (route?.name == "home" && remainingValue.value == 0 && userInfo.value) {
    renewInformModalRef.value?.open();
  }
}, { immediate: true, deep: true });

const checkIsCurrentDate = (timestamp) => {
  let date = new Date(timestamp);
  let currentDate = new Date();
  return dayjs(date).format("YYYY-MM-DD") == dayjs(currentDate).format("YYYY-MM-DD");
}

const setLoginTimestamp = () => {
  let loginTimestamp = Number(localStorage.getItem("loginTimestamp") || Date.now());

  if(!checkIsCurrentDate(loginTimestamp)) loginTimestamp = Date.now();

  localStorage.setItem("loginTimestamp", loginTimestamp);
}

const saveLoginTime = async (data) => {
  try {
    await userStore.createUserUsage(data);
  } catch(error) {
    console.log("Error: ", error);
    
  }
}

const INTERVAL_DURATION = 15 * 60 * 1000; // 15 minutes
const TIME_TO_SAVE = 60 * 60 * 1000; // 1 hour
const loginTimeout = ref();
const checkLoginTimestampInterval = async () => {
  // API saved timestamp
  let loginTimestampSaved = Number(localStorage.getItem("loginTimestampSaved"));

  // Already saved => stop handling
  if(!loginTimestampSaved || !checkIsCurrentDate(loginTimestampSaved)) {
    // Start to set loginTimestamp
    setLoginTimestamp();
    
    // Check enough time to fetch API
    const loginTimestamp = Number(localStorage.getItem("loginTimestamp") || Date.now());  
  
    console.log("Time passed: ", Date.now() - loginTimestamp);

    if(Date.now() - loginTimestamp >= TIME_TO_SAVE) {
      // Save to API
      await saveLoginTime({
        user_id: userInfo.value?.id,
        login_time: dayjs(new Date(loginTimestamp)).format("YYYY-MM-DD HH:mm:ss"),
        date: dayjs(new Date(loginTimestamp)).format("YYYY-MM-DD"),
        duration: Math.floor((Date.now() - loginTimestamp) / 1000) // Seconds
      });
  
      // Update API saved timestamp
      localStorage.setItem("loginTimestampSaved", Date.now());
    }
  }

  // Check new interval after INTERVAL_DURATION
  loginTimeout.value = setTimeout(() => {
    checkLoginTimestampInterval();
  }, INTERVAL_DURATION);
}

watch(userInfo, (newValue, oldValue) => {
  // After login => having user_id => Check login timestamp interval
  clearTimeout(loginTimeout.value);
  if(newValue?.id && newValue?.id !== oldValue?.id) {
    checkLoginTimestampInterval();
  }
}, { immediate: true, deep: true });

// const isLoaded = ref(false);

// watch(() => route.name, async () => {
//   if(dayjs().isAfter(dayjs('2024-01-02'))) {
//     isLoaded.value = true;
//   }
//   if(saleModalRef.value && !isLoaded.value) {
//     let count = Number(await getStorageItem("saleCount", 0));
//     generalStore.initCount(count);

//     const isNotShowSaleModalAgain = await getStorageItem("isNotShowSaleModalAgain") == 1 ? true : false;
//     generalStore.setIsNotShowSaleModalAgain(isNotShowSaleModalAgain);

//     if(count < 3 && !isNotShowSaleModalAgain) {
//       if(route.name && route.name !== "login" && route.name !== "register") {
//         saleModalRef.value?.open();
//         isLoaded.value = true;
//       }
//     } else {
//       isLoaded.value = true;
//     }
//   }
// }, { immediate: true, deep: true });

const getNextPopup = () => {
  if (!popupList.value?.length) return null;
  const currentIndex = popupList.value.findIndex(popup => popup.id == currentPopup.value?.id);

  if ((currentPopup.value && currentIndex == -1) || currentIndex == popupList.value.length - 1) return null;

  let nextIndex = currentIndex;

  while (nextIndex < popupList.value.length) {
    nextIndex++;
    const nextItem = popupList.value[nextIndex];

    // Not valid
    if (!nextItem) return null; // Not found
    if (dayjs(nextItem.start_time).isAfter(dayjs())) continue; // too early to show
    if (dayjs(nextItem.end_time).isBefore(dayjs())) continue; // too late to show
    if (nextItem.isNotShowAgain) continue; // never show again

    // Ok
    if (nextItem.count == -1) break; // Always show
    if (nextItem.count < nextItem.display_number) break; // Not show enough
  }

  return popupList.value[nextIndex];
}

const setStoragePromotionPopupList = (list) => {
  setStorageItem("promotionPopupList", list);
}

const getStoragePromotionPopupList = async () => {
  let result = [];
  const storageList = await getStorageItem("promotionPopupList");
  // Only use popups from api, combined with existed count & isNotShowAgain fields in storage
  promotionPopupList.value?.forEach((popup) => {
    const storageItem = storageList?.find((item) => item.id == popup.id);
    const storageCount = storageItem?.count || 0;
    const display_number = Number(popup.data ? JSON.parse(popup.data)?.display_number : 0);
    result.push({
      ...popup,
      // display_number: check max purpose
      display_number,
      // count < 0: Always show, 0: Not show yet, 1: show once, 2: show twice,...
      count: storageCount > display_number ? display_number : storageCount,
      isNotShowAgain: storageItem?.isNotShowAgain == 1 ? 1 : 0
    });
  });

  popupList.value = [...result];

  setStoragePromotionPopupList(popupList.value);

  currentPopup.value = getNextPopup();
}

const getPromotionPopupList = async () => {
  try {
    loadingStore.open();
    await promotionPopupStore.getPromotionPopupList();
    getStoragePromotionPopupList();
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    loadingStore.close();
  }
}

getPromotionPopupList();

const handleIncreaseCurrentPopupCount = () => {
  if (!popupList.value?.length) return;
  if (!currentPopup.value) return;
  if (currentPopup.value.count == -1) return;
  if (currentPopup.value.count >= currentPopup.value.display_number) return;

  const clonedList = JSON.parse(JSON.stringify(popupList.value));
  const currentIndex = clonedList?.findIndex(popup => popup.id == currentPopup.value.id);

  if (currentIndex === -1) return;

  clonedList[currentIndex].count++;

  setStoragePromotionPopupList(clonedList);
}

const handleSetNotShowPopupAgain = () => {
  if (!popupList.value?.length) return;
  if (!currentPopup.value) return;

  const clonedList = JSON.parse(JSON.stringify(popupList.value));
  const currentIndex = clonedList?.findIndex(popup => popup.id == currentPopup.value.id);

  if (currentIndex === -1) return;

  clonedList[currentIndex].isNotShowAgain = 1;

  setStoragePromotionPopupList(clonedList);
}

const handlePopupClosed = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  currentPopup.value = getNextPopup();
}

const getGiftcodeList = async () => {
  try {
    loadingStore.open();
    await giftcodeStore.getGiftcodeList();
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    loadingStore.close();
  }
}

getGiftcodeList();

watch(() => [currentPopup.value, saleModalRef.value, route.name], () => {
  if (!currentPopup.value) return;
  if (!saleModalRef.value) return;
  if (!route.name) return;
  if (route.name == "login" || route.name == "register") return;
  if (route.name == "home") {
    handleIncreaseCurrentPopupCount();
    saleModalRef.value.open(currentPopup.value);
  }
}, { immediate: true, deep: true });

const getIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json();

    generalStore.setIP(data?.ip);
  } catch (error) {
    console.log("Error: ", error);
  }
}

getIP();

const chatbox = ref(null);
const chatboxBtn = ref(null);
const chatboxBtnSize = ref(0);
const chatboxBtnMask = ref(null);
const clicked = ref(false);

const setChatboxPosition = () => {
  let gap = 16;
  const chatboxBtnRect = chatboxBtn.value.getBoundingClientRect();
  const chatboxRect = chatbox.value.getBoundingClientRect();
  // Start with top left of btn
  let left = chatboxBtnRect.right - chatboxRect.width;
  let top = chatboxBtnRect.top - chatboxRect.height - gap;

  // Btn to the left => change to right
  if (chatboxBtnRect.left < window.innerWidth / 2) {
    left = chatboxBtnRect.right - chatboxBtnRect.width;
  }

  // Btn to the top => change to bottom
  if (chatboxBtnRect.top < window.innerHeight / 2) {
    top = chatboxBtnRect.bottom + gap;
  }

  // Not enough space for top or bottom => change to left or right
  if (gap + chatboxRect.height > chatboxBtnRect.top || gap + chatboxRect.height > chatboxBtnRect.bottom) {
    // Default top, left of btn
    left = chatboxBtnRect.left - chatboxRect.width - gap;
    top = Math.min(window.innerHeight - chatboxRect.height, chatboxBtnRect.bottom);

    // Btn to the left => change to right
    if (chatboxBtnRect.left < window.innerWidth / 2) {
      left = chatboxBtnRect.right + gap;
    }

    // Btn to the top
    if (chatboxBtnRect.top < window.innerHeight / 2) {
      top = Math.max(0, chatboxBtnRect.bottom - window.innerHeight / 2);
    }
  }

  chatbox.value.style.setProperty("left", left + 'px', "important");
  chatbox.value.style.setProperty("top", top + 'px', "important");
  chatbox.value.style.setProperty("bottom", 'auto', "important");
  chatbox.value.style.setProperty("right", 'auto', "important");
}

const handleMouseDown = (event) => {
  // Start a mouse check process
  clicked.value = true;

  if (!chatboxBtnMask.value || !chatboxBtn.value) return;

  let shiftX = event.clientX - chatboxBtnMask.value.getBoundingClientRect().left;
  let shiftY = event.clientY - chatboxBtnMask.value.getBoundingClientRect().top;

  moveAt(event.pageX, event.pageY);

  // Move btn by mouse coordinate
  function moveAt(pageX, pageY) {
    setPosition(chatboxBtn.value, pageX, pageY);
    setPosition(chatboxBtnMask.value, pageX, pageY);
    // Set chatbox position by chatboxBtn position
    setChatboxPosition();
  }

  function setPosition(element, pageX, pageY) {
    element.style.setProperty("left", Math.min(pageX - shiftX, window.innerWidth - chatboxBtnSize.value) + 'px', "important");
    element.style.setProperty("top", Math.max(pageY - shiftY, chatboxBtnSize.value / 2) + 'px', "important");
    element.style.setProperty("bottom", 'auto', "important");
    element.style.setProperty("right", 'auto', "important");
  }

  function onMouseMove(event) {
    // Mousemove event is before mouseup event
    clicked.value = false;
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  chatboxBtnMask.value.onmouseup = function (event) {
    document.removeEventListener('mousemove', onMouseMove);
    chatboxBtnMask.value.onmouseup = null;

    // Fire click event on chatboxBtn when no mousemove event between mousedown event and mouseup event (no drag)
    if (clicked.value) chatboxBtn.value.click();

    // End a mouse check process
    clicked.value = false;
  };

  chatboxBtnMask.value.onmouseout = function (event) {
    // Mouse is over window width or height => remove mousemove event
    if (event.pageX >= window.innerWidth || event.pageY <= chatboxBtnSize.value / 2 || event.pageY >= window.innerHeight) {
      document.removeEventListener('mousemove', onMouseMove);
      chatboxBtnMask.value.onmouseout = null;
    }
  }
}

// const handleDragStart = () => {
//   return false;
// }

// Set position of chatBoxBtn when window resize
const handleResize = () => {
  const { left, bottom } = chatboxBtn.value?.getBoundingClientRect();

  // Old btn is over window width
  if (left > window.innerWidth) {
    chatboxBtn.value.style.setProperty("left", window.innerWidth - chatboxBtnSize.value + 'px', "important");
    chatboxBtnMask.value.style.setProperty("left", window.innerWidth - chatboxBtnSize.value + 'px', "important");
  }
  // Old btn is over window height
  if (bottom > window.innerHeight) {
    chatboxBtn.value.style.setProperty("top", window.innerHeight - chatboxBtnSize.value + 'px', "important");
    chatboxBtnMask.value.style.setProperty("top", window.innerHeight - chatboxBtnSize.value + 'px', "important");
  }
  // Set chatbox position by chatboxBtn position
  setChatboxPosition();
}

onMounted(async () => {
  // Get chatboxBtn & chatbox
  await new Promise((resolve) => {
    let interval = setInterval(() => {
      chatboxBtn.value = document.querySelector("#crisp-chatbox > div > a");
      chatbox.value = document.querySelector("#crisp-chatbox > div > div");
      if (chatboxBtn.value && chatbox.value) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });

  chatboxBtnSize.value = chatboxBtn.value.clientWidth || 0;

  // Mobile style is full screen => not handle
  if (chatbox.value.clientWidth >= window.innerWidth) return;

  const { width, height, left, right, top, bottom } = chatboxBtn.value.getBoundingClientRect();

  // Create a chatboxBtnMask to prevent default chatboxBtn click event
  // Fire chatboxBtn only when no mousemove event between mousedown event and mouseup event
  chatboxBtnMask.value = document.createElement("div");
  chatboxBtnMask.value.style.setProperty("width", width + "px", "important");
  chatboxBtnMask.value.style.setProperty("height", height + "px", "important");
  chatboxBtnMask.value.style.setProperty("top", top + "px", "important");
  chatboxBtnMask.value.style.setProperty("left", left + "px", "important");
  chatboxBtnMask.value.style.setProperty("right", right + "px", "important");
  chatboxBtnMask.value.style.setProperty("bottom", bottom + "px", "important");
  chatboxBtnMask.value.style.setProperty("position", "fixed", "important");
  chatboxBtnMask.value.style.setProperty("z-index", "2", "important");
  chatboxBtnMask.value.style.setProperty("cursor", "pointer", "important");
  chatboxBtn.value?.parentNode?.append(chatboxBtnMask.value);

  chatboxBtnMask.value.addEventListener("mousedown", handleMouseDown);
  // chatboxBtnMask.value.addEventListener("dragstart", handleDragStart);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  chatboxBtnMask.value.removeEventListener("mousedown", handleMouseDown);
  // chatboxBtnMask.value.removeEventListener("dragstart", handleDragStart);
  window.removeEventListener("resize", handleResize);
});
</script>

import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "../axios";

export const usePromotionPopupStore = defineStore("promotion-popup", () => {
    const promotionPopupListData = ref(null);

    const getPromotionPopupList = (params) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get("/api/end-user/popup-promotion/list", { params });
                promotionPopupListData.value = response.data.data || null;
                resolve(response.data.data);
            } catch(error) {
                promotionPopupListData.value = null;
                reject(error);
            }
        });
    }

    return {
        getPromotionPopupList,
        promotionPopupListData
    }
});
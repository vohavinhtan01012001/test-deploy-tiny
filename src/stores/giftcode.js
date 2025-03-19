import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "../axios";

export const useGiftcodeStore = defineStore("giftcode", () => {
    const giftcodeList = ref([]);

    async function getGiftcodeList(params) {
        return new Promise((resolve, reject) => {
            axios.get("/api/end-user/item/search", { params }).then((response) => {
                if (response?.data?.status == "SUCCESS") {
                    giftcodeList.value = response?.data?.data || [];
                    resolve(giftcodeList.value);
                    return;
                }
                giftcodeList.value = [];
                reject(response?.data);
            }).catch((error) => {
                giftcodeList.value = [];
                reject(error);
            });
        });
    }

    const redeemGiftcode = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/giftcode/redeem", data).then((response) => {
                if (response?.data?.status === "SUCCESS") {
                    return resolve(response?.data?.data);
                }
                throw new Error(response?.data?.message);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    const checkGiftcodeInfo = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/giftcode/info", data).then((response) => {
                if (response?.data?.status === "SUCCESS") {
                    return resolve(response?.data?.data);
                }
                throw new Error(response?.data?.message);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    return {
        giftcodeList,
        getGiftcodeList,
        redeemGiftcode,
        checkGiftcodeInfo
    }
})
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getStorageItem, setStorageItem } from '../utils/storage';
import axios from "../axios";

export const useGeneralStore = defineStore('general', () => {
    const count = ref(0);
    const ip = ref();
    const isNotShowSaleModalAgain = ref(false);

    function increment() {
        count.value++;
        setStorageItem("saleCount", count.value);
    }

    function initCount(value) {
        count.value = value;
    }

    function setIsNotShowSaleModalAgain(value) {
        isNotShowSaleModalAgain.value = value;
        setStorageItem("isNotShowSaleModalAgain", value ? 1 : 0);
    }

    const uploadImage = async (data) => {
        let formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key])
        }
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post("/api/end-user/image/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                resolve(response?.data?.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    function setIP(value) {
        ip.value = value;
    }

    return { count, ip, increment, initCount, setIsNotShowSaleModalAgain, uploadImage, setIP }
})

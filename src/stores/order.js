import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "../axios";

export const useOrderStore = defineStore("order", () => {
    const orderInfo = ref();
    const orderHistory = ref();

    const getOrderInfo = (params) => {
        return new Promise((resolve, reject) => {
            axios.get("/api/end-user/order/info", { params }).then((response) => {
                if (response?.data?.status === "SUCCESS") {
                    orderInfo.value = response?.data?.data;
                    return resolve(orderInfo.value);
                }
                throw new Error(response?.data?.message);
            }).catch((error) => {
                orderInfo.value = null;
                reject(error);
            });
        });
    }

    const getOrderHistory = (params) => {
        return new Promise((resolve, reject) => {
            axios.get("/api/end-user/order/history", { params }).then((response) => {
                if (response?.data?.status === "SUCCESS") {
                    orderHistory.value = response?.data?.data;
                    return resolve(orderHistory.value);
                }
                throw new Error(response?.data?.message);
            }).catch((error) => {
                orderHistory.value = null;
                reject(error);
            });
        });
    }

    const addOrderItem = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/order/add-item", data).then((response) => {
                if (response?.data?.status === "SUCCESS") {
                    return resolve(response?.data?.data);
                }
                throw new Error(response?.data?.message);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    const submitOrder = (data) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/order/submit", data).then((response) => {
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
        orderInfo,
        orderHistory,
        getOrderInfo,
        getOrderHistory,
        addOrderItem,
        submitOrder,
    }
})
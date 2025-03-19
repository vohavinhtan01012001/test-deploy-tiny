import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "../axios";

export const usePaymentStore = defineStore("payment", () => {
    const initialPaymentInfo = ref(null);
    const currentPaymentOption = ref(null);
    const donePaymentInfo = ref(null);
    const orderDetail = ref(null);

    function setCurrentPaymentOption(payment) {
        currentPaymentOption.value = payment;
    }

    function setDonePaymentInfo(payment) {
        donePaymentInfo.value = payment;
    }

    function initializePayment(data) {
        // this.initialPaymentInfo = {
        //     "partnerCode": "MOMOBKUN20180529",
        //     "orderId": "1684339035",
        //     "requestId": "7425f07e-7802-4c5e-b2e2-ed0c3e614502",
        //     "amount": 200000,
        //     "responseTime": 1684339036967,
        //     "message": "Thành công.",
        //     "resultCode": 0,
        //     "payUrl": "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xNT01PMTY4NDQzMTQ2MzQ4OA",
        //     "deeplink": "momo://app?action=payWithApp&isScanQR=false&serviceType=app&sid=TU9NT0JLVU4yMDE4MDUyOXwxNjg0MzM5MDM1&v=3.0",
        //     "qrCodeUrl": "momo://app?action=payWithApp&isScanQR=true&serviceType=qr&sid=TU9NT0JLVU4yMDE4MDUyOXwxNjg0MzM5MDM1&v=3.0"
        // };
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/payment/initialize", data).then((response) => {
                if(response?.status == 200) {
                    initialPaymentInfo.value = response.data?.data || null;
                }
                resolve(response?.data?.data);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    function updatePayment(data) {
        return new Promise((resolve, reject) => {
            axios.post("/api/end-user/payment/update-data", data).then((response) => {
                console.log({response});
                setDonePaymentInfo(data);
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    function getOrderDetail(params) {
        return new Promise((resolve, reject) => {
            axios.get("/api/end-user/order/detail", { params }).then((response) => {
                orderDetail.value = response.data?.data;
                resolve(response.data?.data);
            }).catch((error) => {
                orderDetail.value = null;
                reject(error);
            });
        });
    }

    return {
        initialPaymentInfo,
        currentPaymentOption,
        donePaymentInfo,
        orderDetail,
        initializePayment,
        updatePayment,
        setCurrentPaymentOption,
        setDonePaymentInfo,
        getOrderDetail
    };
});
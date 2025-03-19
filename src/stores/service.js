import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

export const useServiceStore = defineStore("service", () => {
    const { t } = useI18n();

    const addingTimeStart = "2024-08-31 00:00:00";
    const addingTimeEnd = "2024-09-02 23:59:59";

    const isAddingTimeVisible = computed(() => {
        if(!addingTimeStart) return false;
        if(dayjs(addingTimeStart).isAfter(dayjs())) return false; // too early to show
        if(addingTimeEnd && dayjs(addingTimeEnd).isBefore(dayjs())) return false; // too late to show
        return true;
    });

    const serviceList = computed(() => ([
        { 
            id: 1, 
            title: t("service.month", 1), 
            duration: 1,
            value: 30,
            price_per_month: 50000,
            price: 50000,
            old_price: 50000,
            usd_price: 4.99,
            usd_old_price: 4.99,
            options: [t("service.option_1"), t("service.option_2"), t("service.option_3"), t("service.option_4"), t("service.option_5")],
            color: null,
            icon_icon: null,
            adding_time: 1,
            adding_time_title: `+ ${t("service.month", 1)}`,
        },
        { 
            id: 2, 
            title: t("service.month", 6), 
            duration: 6,
            value: 180,
            price_per_month: null,
            price: 200000,
            old_price: 300000,
            usd_price: 20.99,
            usd_old_price: 31.49,
            options: [t("service.option_1"), t("service.option_2"), t("service.option_3"), t("service.option_4"), t("service.option_5")],
            color: null,
            icon_icon: null,
            adding_time: 6,
            adding_time_title: `+ ${t("service.month", 6)}`,
        },
        { 
            id: 3, 
            title: t("service.month", 3), 
            duration: 3,
            value: 90,
            price_per_month: null,
            price: 129000,
            old_price: 150000,
            usd_price: 11.99,
            usd_old_price: 13.94,
            options: [t("service.option_1"), t("service.option_2"), t("service.option_3"), t("service.option_4"), t("service.option_5")],
            color: null,
            icon_icon: null,
            adding_time: 3,
            adding_time_title: `+ ${t("service.month", 3)}`,
        }
    ]));

    const recommendServiceList = computed(() => ([
        { 
            id: 1,
            title: t("service.month", 1), 
            duration: 1,
            value: 30,
            price_per_month: 50000, 
            price: 50000,
            old_price: 50000,
            usd_price: 4.99,
            usd_old_price: 4.99,
            options: [t("service.option_1"), t("service.option_2"), t("service.option_3"), t("service.option_4"), t("service.option_5")],
            color: "#01F3BC", 
            icon_color: "#08738A",
            adding_time: 1,
            adding_time_title: `+ ${t("service.month", 1)}`,
        },
        { 
            id: 3,
            title: t("service.month", 3), 
            duration: 3,
            value: 90,
            price_per_month: 43000, 
            price: 129000,
            old_price: 150000,
            usd_price: 11.99,
            usd_old_price: 13.94,
            options: [t("service.option_1"), t("service.option_2"), t("service.option_3"), t("service.option_4"), t("service.option_5")],
            color: "#FEB000", 
            icon_color: "#6D5840",
            adding_time: 3,
            adding_time_title: `+ ${t("service.month", 3)}`,
        }
    ]));

    const currentServiceStore = ref(null);
    const activeView = ref("service");

    const currentService = computed(() => serviceList.value?.find((service) => service.value == currentServiceStore.value?.value) || null);

    function setCurrentService(value) {
        currentServiceStore.value = value;
    }

    function setActiveView(value) {
        activeView.value = value;
    }

    function resetData() {
        setCurrentService(null);
        setActiveView("service");
    }

    return {
        setCurrentService,
        setActiveView,
        resetData,
        serviceList,
        currentService,
        recommendServiceList,
        activeView,
        isAddingTimeVisible
    };
});
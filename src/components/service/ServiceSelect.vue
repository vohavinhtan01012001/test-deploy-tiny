<template>
    <div class="service-select">
        <p class="text-center mx-auto main-title mb-4">{{ $t("service.main_title") }}</p>
        <p class="text-center mx-auto main-subtitle mb-12">{{ $t("service.subtitle") }}</p>

        <div class="service-carousel">
            <swiper
                :slides-per-view="3"
                :space-between="16"
                :initial-slide="1"
                centered-slides
                loop
                class="service-swiper"
                :allow-slide-next="false"
                :allow-slide-prev="false"
            >
                <swiper-slide v-for="(service, index) in serviceList" :key="index" v-slot="{ isActive }">
                    <service :service="service" :active="isActive" @payment="goToPayment" />
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServiceStore } from "@/stores/service";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import Service from "@/components/service/Service.vue";

const emit = defineEmits(["payment"]);

const serviceStore = useServiceStore();

const serviceList = computed(() => serviceStore.serviceList);

const goToPayment = () => {
    emit("payment");
}
</script>

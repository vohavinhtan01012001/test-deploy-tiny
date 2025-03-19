<template>
    <div class="h-full quick-server-select" v-if="servers?.length">
        <swiper
            :slides-per-view="'auto'"
            :space-between="12"
            :initial-slide="0"
            :navigation="true"
            :modules="modules"
            :centered-slides="false"
        >
            <swiper-slide
                v-for="(server, index) in servers"
                :key="index"
            >
                <div class="h-full">
                    <server :server="server" @click="emits('connect', server)" />
                </div>
            </swiper-slide>
        </swiper>
    </div>
    <div v-else>
        No data available
    </div>
    <!-- <div class="h-full quick-server-select">
        <div class="quick-server-select-list" v-if="servers?.length">
            <swiper
                :slides-per-view="'auto'"
                :space-between="12"
                :initial-slide="0"
                :navigation="true"
                :modules="modules"
                :centered-slides="false"
            >
                <swiper-slide
                    v-for="(server, index) in servers"
                    :key="index"
                >
                    <server :server="server" @click="emits('connect', server)" />
                </swiper-slide>
            </swiper>
        </div>
        <div v-else>
            No data available
        </div>
    </div> -->
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper';
import 'swiper/css';
import Server from "@/components/common/Server.vue";

const props = defineProps({
    servers: Array
});

const emits = defineEmits(["connect"]);

const modules = [Navigation];
</script>
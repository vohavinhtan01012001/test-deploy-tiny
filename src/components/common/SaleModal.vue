<template>
    <modal class="renew-inform-modal sale-modal" solid-background ref="modalRef" @closed="handleModalClosed">
        <div class="flex-center flex-col overflow-auto" v-if="currentData">
            <h1 class="mt-0" v-if="currentData.title">{{ currentData.title }}</h1>
            <p class="mb-5" v-if="currentData.description">{{ currentData.description }}</p>
            <div class="image" v-if="images?.length">
                <img :src="images[0]" class="cursor-pointer" v-if="images.length === 1" @click="goToService" />
                <template v-else>
                    <swiper :modules="[Autoplay, Pagination]" :autoplay="{ delay: 2000 }" :space-between="0"
                        :pagination="{ clickable: true }" loop>
                        <swiper-slide v-for="(image, index) in images" :key="index" v-slot="{ isActive }">
                            <img :src="image" class="cursor-pointer" />
                        </swiper-slide>
                    </swiper>
                </template>
            </div>
            <div class="checkbox my-5" style="align-self: flex-start;">
                <input type="checkbox" v-model="isNotShowAgain" />
                <div class="checkbox-box"></div>
                <label class="text-xs checkbox-label">{{ $t("global.not_show_again") }}</label>
            </div>
            <div class="flex items-center mb-5">
                <button class="btn btn-primary ok-btn" style="min-width: 120px" @click="handleOk">
                    <span class="text-lg btn-text">OK</span>
                </button>
            </div>
        </div>
    </modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';
import Modal from "@/components/common/Modal.vue";

const emits = defineEmits(["not-show-again", "closed"]);

const router = useRouter();

const modalRef = ref(null);
const currentData = ref(null);
const isNotShowAgain = ref(false);

const images = computed(() => currentData.value?.images ? JSON.parse(currentData.value?.images) : []);

const open = (initialData) => {
    if (!initialData) return;
    currentData.value = { ...initialData };
    isNotShowAgain.value = initialData.isNotShowAgain == 1;
    modalRef.value?.open();
}

const close = () => {
    modalRef.value?.close();
}

const goToService = () => {
    if (currentData.value?.url) {
        let url = currentData.value?.url;
        if (url.includes(window.location.host)) {
            window.location.href = url;
        } else {
            window.open(url, "_blank");
        }
    } else {
        router.push({ name: "service" });
    }
    close();
}

const handleOk = () => {
    if (isNotShowAgain.value) emits("not-show-again");
    close();
}

const handleModalClosed = () => {
    emits("closed");
    // goToService();
}

defineExpose({ open, close });
</script>

<style lang="scss">
.sale-modal {
    .modal {
        width: 706px;
        max-height: 90vh;
        overflow: auto;

        .close-btn {
            flex-shrink: 0;
        }

        .image {
            align-self: stretch;

            img {
                max-width: unset;
                width: 100%;
            }
        }

        .swiper-slide {
            position: relative;
            aspect-ratio: 16 / 9;

            img {
                object-fit: cover;
                position: absolute;
                inset: 0;
            }
        }

        .checkbox {
            position: relative;
            display: flex;
            cursor: pointer;
            input[type="checkbox"] {
                position: absolute;
                inset: 0;
                margin: 0;
                appearance: none;
                -webkit-appearance: none;
                cursor: pointer;
                outline: none;
                width: 100%;
            }
            .checkbox-box {
                position: relative;
                display: block;
                min-width: 16px;
                width: 16px;
                height: 16px;
                border: 0.5px solid #707070;
                border-radius: 4px;
                margin-right: 6px;
                pointer-events: none;
            }
            input:checked + .checkbox-box {
                background: var(--primary);
                border-color: var(--primary);
                &::after {
                    content: "";
                    background: url("@/assets/images/icons/check.svg");
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    width: 13px;
                    height: 9px;
                }
            }
            &-label {
                color: #99999A;
            }
        }
    }

    .ok-btn {
        height: 35px;

        .btn-text {
            line-height: 1;
        }
    }
}
</style>
<template>
    <div class="layout-container empty-layout">
        <div class="background-layout">
            <img src="@/assets/images/background-login.png" class="bg-1" />
            <!-- <img src="@/assets/images/rabbit/bg-login-2.png" class="bg-2" /> -->
            <img src="@/assets/images/rabbit/ellipse-login-1.png" class="ellipse-1" />
            <!-- <img src="@/assets/images/rabbit/ellipse-login-2.png" class="ellipse-2" /> -->
        </div>
        <div class="main-view">
            <!-- <header style="position: fixed; top: 0; width: 100%; z-index: 2;">
                <slot name="header" />
            </header> -->
            <main style="padding: 0; overflow: auto">
                <div class="login-layout">
                    <BannerHome class="" />
                    <div class="flex flex-col justify-center h-full">
                        <slot />
                        <custom-select class="flex justify-end custom-select" v-model="language"
                            :options="languageList" />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
<script setup>
import BannerHome from "@/components/common/BannerHome.vue";
import CustomSelect from "@/components/common/CustomSelect.vue";
import{ useLanguage } from "@/hooks/useLanguage.js";

const { language, languageList } = useLanguage();

</script>
<style lang="scss">
.login-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;

    .custom-select-component {
        .custom-select {
            .option-menu {
                top: -50px;
                transform: translateY(-100%);
            }

            &:focus {
                .option-menu {
                    top: -15px;
                }
            }
        }
    }
}

.custom-select {
    padding: 32px;
    margin-right: 20px;
}
</style>
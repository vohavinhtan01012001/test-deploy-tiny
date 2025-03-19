<template>
    <div class="flex-center flex-col px-5 py-10 overflow-auto confirm-email" v-if="isVerifyDone">
        <template v-if="isVerifiedSuccessful">
            <img src="@/assets/images/icons/check-circle-success.svg" class="status-icon" />

            <p class="svn-avo-bold gradient-text main-title">Thank you</p>
        </template>
        <template v-else>
            <img src="@/assets/images/icons/error-icon.svg" class="status-icon" />
    
            <p class="svn-avo-bold gradient-text main-title">Verify Failed</p>
        </template>

        <p class="description" v-if="verifyMesssage">{{ verifyMesssage }}</p>

        <button class="btn btn-outline-primary go-back-home-btn" @click="goToHome">
            <span class="uppercase btn-text">{{ $t("service.go_back_home") }}</span>
        </button>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useLoadingStore } from "@/stores/loading";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const loadingStore = useLoadingStore();
const userStore = useUserStore();

const isVerifiedSuccessful = ref(false);
const verifyMesssage = ref("Your email is verified successfully!");
const isVerifyDone = ref(false);

onBeforeMount(async () => {
    try {
        isVerifiedSuccessful.value = false;
        isVerifyDone.value = false;
        if(route.query?.token) {
            loadingStore.open();
            
            await userStore.verifyEmail({ token: route.query.token });

            isVerifiedSuccessful.value = true;
        }
    } catch(error) {
        verifyMesssage.value = error?.message || error;
    } finally {
        loadingStore.close();
        isVerifyDone.value = true;
    }
});

const goToHome = () => {
    window.location.href = "/";
}
</script>

<style lang="scss">
.confirm-email {
    max-width: 600px;
    margin: auto;
    .status-icon {
        width: 70px;
        margin-bottom: 16px;
    }
    .main-title {
        font-size: 40px;
        font-weight: bold;
        letter-spacing: 2px;
        margin-bottom: 16px;
    }
    .description {
        font-size: 20px;
        letter-spacing: 1px;
        margin-bottom: 30px;
    }
    .go-back-home-btn {
        min-width: 192px;
        min-height: 43px;
        border-radius: 23.5px;
        display: flex;
        justify-content: center;
    }
}
</style>
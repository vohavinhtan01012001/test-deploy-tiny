<template>
    <modal class="setting-modal" solid-background ref="modalRef">
        <div class="flex-center flex-col setting-modal-content">
            <p class="text-2xl uppercase modal-title">{{ $t("global.setting") }}</p>

            <div class="setting-list">
                <div class="checkbox mb-8" v-for="(setting, index) in settingList" :key="index">
                    <input type="checkbox" v-model="settingList[index].value" />
                    <div class="checkbox-box"></div>
                    <label class="text-base checkbox-label">{{ $t(`setting.${setting.key}`) }}</label>
                </div>
            </div>

            <div>
                <a href="https://tiny.vn/en/terms-vi?rule=baomat" target="_blank" class="text-xs policy">{{ $t("setting.privacy_policy") }}</a>, 
                <a href="https://drive.google.com/file/d/1DS7VGg2hK0jgYxGQB9Yhlfu9qOGAtlwk/view" target="_blank" class="text-xs policy">{{ $t("setting.refund_policy") }}</a>, 
                <a href="https://tiny.vn/en/terms-en" target="_blank" class="text-xs policy">{{ $t("setting.user_agreement") }}</a>
            </div>
        </div>
    </modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/components/common/Modal.vue";

const modalRef = ref(null);

const settingList = ref([
    { key: "speed_up_on_startup", value: false },
    { key: "make_shortcut_on_screen", value: false },
    { key: "start_on_turned_on_device", value: false },
    { key: "stay_connection_on_sleep_mode", value: false },
]);

const open = () => {
    modalRef.value?.open();
}

const close = () => {
    modalRef.value?.close();
}

defineExpose({ open, close });
</script>

<style lang="scss">
.setting-modal {
    .modal {
        width: 706px;
        &-title {
            margin-bottom: 60px;
        }
        .setting-modal-content {
            padding: 0 80px;
        }
        .setting-list {
            margin-bottom: 130px;
        }
        .checkbox {
            &-label {
                margin-top: -4px;
            }
        }
        .policy {
            color: white !important;
        }
    }
}
</style>
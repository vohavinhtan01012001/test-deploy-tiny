<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import Modal from "@/components/common/Modal.vue";
import { useI18n } from "vue-i18n";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const modalRef = ref(null);
const isFirstTime = ref(true);

const open = () => {
  if (isFirstTime.value) {
    modalRef.value?.open();
  }
  isFirstTime.value = false;
};

const close = () => {
  modalRef.value?.close();
};

const goToServicePage = () => {
  close();
  router.push("/service");
};

defineExpose({ open, close });
</script>

<template>
  <modal
    class="renew-inform-modal"
    :title="t('global.renew')"
    ref="modalRef"
    @close-from-icon="goToServicePage"
  >
    <div class="flex-center flex-col renew-inform-content">
      <p>{{ t("global.your_service_has_expired") }}</p>

      <button class="w-full btn btn-primary" @click="goToServicePage">
        {{ t("global.renew_now") }}
      </button>
    </div>
  </modal>
</template>

<style lang="scss">
.renew-inform-modal {
  .modal {
    width: 386px;
    padding: 0;
    .modal-header {
      padding: 32px;
    }
    .modal-content {
      padding: 0;
      min-height: auto;
      padding: 0 32px 32px;
      p {
        margin-bottom: 32px;
      }
      .btn {
        padding: 12px;
      }
    }
  }
}
</style>

<template>
    <modal class="buy-giftcode-modal" :title="$t('order.confirm')" ref="modalRef" @close-from-icon="close">
        <div class="flex-center flex-col buy-giftcode-content">
            <p class="share-content">
                <span v-html="title"></span>
            </p>
            <div class="w-full share-code">
                <div class="share">
                    <div class="pointer-events-none">
                        <GiftcodeItem :is-own-gift="isOwnGift" />
                    </div>
                </div>
            </div>
            <div class="flex items-center w-full gap-3">
                <button class="w-full btn btn-cancel" @click="close">
                    {{ $t("order.cancel") }}
                </button>
                <button class="w-full btn btn-primary" @click="accept">
                    {{ $t("order.accept") }}
                </button>
            </div>
        </div>
    </modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import Modal from "@/components/common/Modal.vue";
import GiftcodeItem from "@/components/giftcode/GiftcodeItem.vue";

const { t } = useI18n();

const emits = defineEmits(["accept"]);
const modalRef = ref(null);
const isOwnGift = ref(false);
const giftcode = ref(null);
const title = computed(() => isOwnGift.value ?
    t("order.use_confirm_message", { name: giftcode.value?.name })
    :
    t("order.exchange_confirm_message", { point: giftcode.value?.price, name: giftcode.value?.name })
);

const open = (data) => {
    isOwnGift.value = data.isOwnGift;
    giftcode.value = data.giftcode;
    modalRef.value?.open();
}

const close = () => {
    modalRef.value?.close();
}

const accept = () => {
    emits("accept");
    close();
}

defineExpose({ open, close });
</script>

<style lang="scss">
.buy-giftcode-modal {
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

            .btn {
                flex-shrink: 1;
                padding: 12px;

                &-cancel {
                    border: 1px solid white;
                    color: white;
                }
            }
        }
    }

    .share-code {
        padding: 0px 45px;
        margin-bottom: 12px;

        .giftcode-item-top {
            min-height: 104px;

            p {
                margin-bottom: 4px;
            }
        }
    }

    .share-content {
        margin-bottom: 32px !important;
    }

}
</style>
<template>
    <div class="image-upload-component">
        <div class="avatar" :class="{'empty': !imageValue}" @click="handleShowCropper">
            <img :src="imageValue" class="absolute-full" v-if="imageValue" />
            <img src="@/assets/images/avatar.png" class="absolute-full" v-else />
            <div class="remove-icon" @click.stop="imageValue = ''">+</div>
        </div>
    </div>
    <avatar-cropper
        v-model="isShowCropper"
        upload-file-field="image"
        :upload-handler="cropperHandler"
    />
</template>

<script setup>
import { ref, computed } from "vue";
import { useGeneralStore } from "@/stores/general";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import AvatarCropper from "vue-avatar-cropper";

const VITE_API = import.meta.env.VITE_API;

const generalStore = useGeneralStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();

const props = defineProps({
    modelValue: ""
});

const emits = defineEmits(["update:modelValue"]);

const isShowCropper = ref(false);

const imageValue = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits("update:modelValue", newValue);
    }
});

const handleShowCropper = () => isShowCropper.value = true;

const cropperHandler = async (cropper) => {
    try {
        loadingStore.open();
        const fileType = cropper.url?.replace("data:", "")?.split(";")?.[0];
        const fileExtension = fileType?.replace("image/", "");
        const res = await fetch(cropper.url);
        const blobRes = await res.blob();
        const imageFile = new File([
            new Blob([blobRes])
        ], `avatar.${fileExtension}`, {
            type: fileType
        });
        const response = await generalStore.uploadImage({
            image: imageFile,
            type: "AVATAR"
        });

        imageValue.value = response.image ? VITE_API?.replace(/$\//g, "") + "/storage/" + response.image : "";
    } catch(error) {
        snackbarStore.add({ message: error?.message || error?.error || "Upload image failed!" });
    } finally {
        loadingStore.close();
    }
}
</script>

<style lang="scss">
.image-upload-component {
    --avatar-size: 90px;

    .avatar {
        position: relative;
        width: var(--avatar-size);
        min-width: var(--avatar-size);
        height: 0;
        padding-bottom: var(--avatar-size);
        border-radius: 50%;
        background-color: var(--primary);
        margin: 10px 0 16px;
        cursor: pointer;

        .remove-icon {
            position: absolute;
            top: -7px;
            right: -7px;
            font-size: 20px;
            line-height: 1;
            width: 17px;
            height: 17px;
            border-radius: 50%;
            border: 1px solid white;
            display: none;
            align-items: center;
            justify-content: center;
            // padding-bottom: 5px;
            transform: rotate(45deg);
            background: rgba(255, 255, 255, 0.2);
        }

        &::after,
        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            border-radius: 50%;
            border: 2px solid white;
            box-sizing: border-box;
            opacity: 0;
            transition: 0.2s ease;
        }

        &::after {
            content: "+";
        }

        &::before {
            content: "✎";
        }

        &:hover {
            &:not(.empty) {
                &::before {
                    opacity: 1;
                }
            }
            &.empty {
                &::after {
                    opacity: 1;
                }
            }
        }

        img {
            border-radius: 50%;
        }
    }

    &:hover {
        .avatar {
            &:not(.empty) {
                .remove-icon {
                    display: flex;
                }
            }
        }
    }
}
</style>
<template>
    <div class="profile-view">
        <!-- <p class="login-title">{{ $t("profile.main_title") }}</p> -->
        <div class="login-form profile-form">
            <div class="flex-center flex-col form-content">
                <!-- <div class="avatar">
                    <img src="@/assets/images/new-year/avatar.png" class="absolute-full" />
                </div> -->

                <image-upload v-model="formData.avatar" />

                <p class="text-lg">{{ formData.account }}</p>
                <p class="text-sm mt-2" v-if="initialEmail">{{ initialEmail }}</p>
                <!-- <p class="text-sm mt-2 cursor-copy" @click="copyURL(refUrl)">{{refUrl}}</p> -->
                <button class="view-history-btn mt-2" @click="router.push({ name: 'affiliate-history' })">Affiliate History</button>

                <Form class="flex-center flex-col w-full mt-7" @submit="onSubmit" :validation-schema="schema"  @input="handleFormInput">
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.full_name") }}</label>
                        <ErrorMessage name="full_name" />
                        <div class="input-field">
                            <Field name="full_name" v-model="formData.full_name" type="text" :placeholder="$t('login.enter_full_name')" />
                        </div>
                    </div>
                    <div class="form-field" v-if="!initialEmail">
                        <label class="input-title">{{ $t("login.email") }}</label>
                        <ErrorMessage name="email" />
                        <div class="input-field">
                            <Field name="email" v-model="formData.email" type="email" :placeholder="$t('login.enter_email')" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.password") }}</label>
                        <ErrorMessage name="password" />
                        <div class="input-field">
                            <Field name="password" v-model="formData.password" :type="passwordVisible ? 'text' : 'password'"  :placeholder="$t('login.enter_password')" />
                            <img src="@/assets/images/rabbit/icons/eye-slash.svg" class="post-icon" v-show="passwordVisible" @click="togglePasswordVisible" />
                            <img src="@/assets/images/rabbit/icons/eye.svg" class="post-icon" v-show="!passwordVisible" @click="togglePasswordVisible" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.new_password") }}</label>
                        <ErrorMessage name="new_password" />
                        <div class="input-field">
                            <Field name="new_password" v-model="formData.new_password" :type="confirmPasswordVisible ? 'text' : 'password'"  :placeholder="$t('login.enter_new_password')" />
                            <img src="@/assets/images/rabbit/icons/eye-slash.svg" class="post-icon" v-show="confirmPasswordVisible" @click="toggleConfirmPasswordVisible" />
                            <img src="@/assets/images/rabbit/icons/eye.svg" class="post-icon" v-show="!confirmPasswordVisible" @click="toggleConfirmPasswordVisible" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.confirm_password") }}</label>
                        <ErrorMessage name="confirm_password" />
                        <div class="input-field">
                            <Field name="confirm_password" v-model="formData.confirm_password" :type="confirmPasswordVisible ? 'text' : 'password'"  :placeholder="$t('login.enter_confirm_password')" />
                            <img src="@/assets/images/rabbit/icons/eye-slash.svg" class="post-icon" v-show="confirmPasswordVisible" @click="toggleConfirmPasswordVisible" />
                            <img src="@/assets/images/rabbit/icons/eye.svg" class="post-icon" v-show="!confirmPasswordVisible" @click="toggleConfirmPasswordVisible" />
                        </div>
                    </div>
                    <div class="form-field" @click="copyURL(refUrl)">
                        <label class="input-title">{{ $t("login.referral_code") }}</label>
                        <div class="input-field">
                            <Field name="referral_code" type="referral_code" :placeholder="$t('login.referral_code')" disabled :value="formData.account" v-if="formData.account"/>
                            <img src="@/assets/images/icons/copy.svg" class="post-icon" />
                        </div>
                    </div>
                    <span class="text-center block mb-10" role="alert" v-if="errorMessage">** {{ errorMessage }}</span>
                    <button class="btn btn-primary mt-6 login-btn" type="submit">
                        <span class="text-lg btn-text">{{ $t("profile.save_btn") }}</span>
                    </button>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from 'yup';
import { useI18n } from "vue-i18n";
import ImageUpload from "@/components/common/ImageUpload.vue";
import dayjs from "dayjs";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const formData = reactive({
    email: "",
    password: "",
    new_password: "",
    confirm_password: "",
    account: "",
    full_name: "",
    created_by: "",
    avatar: ""
});

const initialEmail = ref("");
const initialCreatedBy = ref("");

const errorMessage = ref("");

const schema = computed(() => yup.object({
    email: yup.string(),
    password: yup.string().when("new_password", {
        is: (new_password) => !!new_password,
        then: yup.string().required(t("login.required_validation", { field: t("login.password") }))
    }),
    confirm_password: yup.string().when("new_password", {
        is: (new_password) => !!new_password,
        then: yup.string().required(t("login.required_validation", { field: t("login.confirm_password") }))
            .oneOf([yup.ref('new_password'), null], t("login.match_validation", { field: t("login.confirm_password") }))
    }),
    full_name: yup.string(),
    new_password: yup.string()
}));

const userInfo = computed(() => userStore.userInfo);
const ngaydangky = computed(() => userInfo.value?.ngaydangky);
const isCreatedByEditable = computed(() => {
    if(!ngaydangky.value || initialCreatedBy.value && initialCreatedBy.value !== 'new_tiny') return false;
    return dayjs().isBefore(dayjs(ngaydangky.value).add(3, "day"));
});
const refUrl = computed(() => {
    return window.location.origin + "/register?aff=" + formData.account;
})

const initData = () => {
    initialEmail.value = userInfo.value?.email || "";
    initialCreatedBy.value = userInfo.value?.created_by || "";
    Object.assign(formData, {
        email: userInfo.value?.email,
        password: "",
        new_password: "",
        confirm_password: "",
        account: userInfo.value?.account || "",
        full_name: userInfo.value?.full_name || "",
        created_by: userInfo.value?.created_by !== "new_tiny" || !isCreatedByEditable.value ? userInfo.value?.created_by : "",
        avatar: userInfo.value?.avatar || "",
    });
}

const handleFormInput = () => {
    errorMessage.value = "";
}

const togglePasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value;
}

const toggleConfirmPasswordVisible = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
}

const onSubmit = () => {
    errorMessage.value = "";
    schema.value.validate(formData).then(async () => {
        try {
            loadingStore.open();
            let data = {
                email: formData.email,
                account: formData.account,
                avatar: formData.avatar,
                full_name: formData.full_name,
                password: formData.new_password,
                confirm_password: formData.new_password ? formData.confirm_password : "",
                old_password: formData.new_password ? formData.password : "",
                created_by: formData.created_by === "new_tiny" || !isCreatedByEditable.value ? "" : formData.created_by
            };
            await userStore.updateUserInfo(data);

            snackbarStore.add({ message: "Update user info successfully!" });

            await userStore.getUserInfo();
            initData();
        } catch(error) {
            console.log("Error: ", error);
            errorMessage.value = error?.message;
        } finally {
            loadingStore.close();
        }
    }).catch(error => {
        console.log("Error: ", error);
    });
}

async function copyURL(mytext) {
    try {
      await navigator.clipboard.writeText(mytext);
      snackbarStore.add({ message: "Copied!" });
    } catch($e) {
        
    }
  }

watch(() => userInfo.value, () => {
    initData();
}, { immediate: true, deep: true });
</script>
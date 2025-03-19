<template>
    <div class="login-view">
        <div class="login-form register-form">
            <div class="form-bg"><span></span></div>
            <div class="form-bg-1"></div>
            <div class="flex-center flex-col form-content">
                <p class="login-title">{{ $t("login.sign_up") }}</p>
                <p class="login-subtitle">{{ $t("login.sign_up_subtitle") }}</p>

                <Form class="flex-center flex-col w-full" @submit="onSubmit" :validation-schema="schema"
                    @input="handleFormInput">
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.full_name") }}</label>
                        <ErrorMessage name="full_name" />
                        <div class="input-field">
                            <Field name="full_name" v-model="formData.full_name" type="text"
                                :placeholder="$t('login.enter_full_name')" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.email") }}</label>
                        <ErrorMessage name="email" />
                        <div class="input-field">
                            <Field name="email" v-model="formData.email" type="email"
                                :placeholder="$t('login.enter_email')" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.account") }}</label>
                        <ErrorMessage name="account" />
                        <div class="input-field">
                            <Field name="account" v-model="formData.account" type="text"
                                :placeholder="$t('login.enter_account')" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.password") }}</label>
                        <ErrorMessage name="password" />
                        <div class="input-field">
                            <Field name="password" v-model="formData.password"
                                :type="passwordVisible ? 'text' : 'password'"
                                :placeholder="$t('login.enter_password')" />
                            <img src="@/assets/images/rabbit/icons/eye-slash.svg" class="post-icon"
                                v-show="passwordVisible" @click="togglePasswordVisible" />
                            <img src="@/assets/images/rabbit/icons/eye.svg" class="post-icon" v-show="!passwordVisible"
                                @click="togglePasswordVisible" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.confirm_password") }}</label>
                        <ErrorMessage name="confirm_password" />
                        <div class="input-field">
                            <Field name="confirm_password" v-model="formData.confirm_password"
                                :type="confirmPasswordVisible ? 'text' : 'password'"
                                :placeholder="$t('login.enter_confirm_password')" />
                            <img src="@/assets/images/rabbit/icons/eye-slash.svg" class="post-icon"
                                v-show="confirmPasswordVisible" @click="toggleConfirmPasswordVisible" />
                            <img src="@/assets/images/rabbit/icons/eye.svg" class="post-icon"
                                v-show="!confirmPasswordVisible" @click="toggleConfirmPasswordVisible" />
                        </div>
                    </div>
                    <div class="form-field">
                        <label class="input-title">{{ $t("login.created_by") }}</label>
                        <ErrorMessage name="created_by" />
                        <div class="input-field">
                            <Field name="created_by" v-model="formData.created_by" type="text"
                                :placeholder="$t('login.created_by')" />
                        </div>
                    </div>
                    <span class="text-center block mb-10" role="alert" v-if="errorMessage">** {{ errorMessage }}</span>
                    <button class="btn btn-primary login-btn mb-4 mt-6" type="submit">
                        <span class="text-base">{{ $t("login.sign_up_btn") }}</span>
                    </button>
                </Form>
            </div>

            <p class="relative no-account-text">{{ $t("login.have_an_account") }} <span class="cursor-pointer"
                    @click="router.push('/login')">{{ $t("login.sign_in") }}</span></p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useLoadingStore } from "@/stores/loading";
import { useGeneralStore } from "@/stores/general";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from 'yup';
import { useI18n } from "vue-i18n";
import { useSnackbarStore } from "@/stores/snackbar";


const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const generalStore = useGeneralStore();

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const ACCOUNT_MIN_LENGTH = 5;

const formData = reactive({
    email: "",
    password: "",
    confirm_password: "",
    account: "",
    full_name: "",
    created_by: ""
});

const errorMessage = ref("");

// const schema = yup.object({
//     email: yup.string().required("Email is required").email("Email must be valid"),
//     password: yup.string().required("Password is required"),
//     full_name: yup.string().required("Full name is required"),
//     account: yup.string().required("Account is required"),
//     confirm_password: yup.string().oneOf([yup.ref('password'), null], "Confirm Password must match!")
// });

const schema = computed(() => yup.object({
    email: yup.string().required(t("login.required_validation", { field: t("login.email") })).email(t("login.valid_validation", { field: t("login.email") })),
    password: yup.string().required(t("login.required_validation", { field: t("login.password") })),
    full_name: yup.string().required(t("login.required_validation", { field: t("login.full_name") })),
    account: yup.string().required(t("login.required_validation", { field: t("login.account") })).min(ACCOUNT_MIN_LENGTH, t("login.min_length_validation", { field: t("login.account"), min: ACCOUNT_MIN_LENGTH })),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], t("login.match_validation", { field: t("login.confirm_password") })),
    //created_by: yup.string().required(t("login.required_validation", { field: t("login.created_by") })),
}));

const errorUser = computed(() => userStore.errorUser);
const ip = computed(() => generalStore.ip);

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
            await userStore.register({
                ...formData,
                ip: ip.value
            });
            snackbarStore.add({ message: "Register successfully!" });
            router.push("/login");
        } catch (error) {
            const errorMessageKey = error?.message
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '_');
            const translatedErrorMessage = t(`login.${errorMessageKey}`);
            errorMessage.value = translatedErrorMessage !== `login.${errorMessageKey}` ? translatedErrorMessage : (error?.message || t("login.unexpected_error"));
        } finally {
            loadingStore.close();
        }
    }).catch(error => {
        console.log("Error: ", error);
    });
}

onMounted(() => {
    if (errorUser.value) {
        formData.email = errorUser.value.email || "";
        formData.full_name = errorUser.value.name || "";
        formData.account = errorUser.value.email?.slice(0, errorUser.value.email.indexOf("@"));
    }
    let urlAffiliateAccount = route.query?.aff || "";
    if (urlAffiliateAccount) {
        localStorage.setItem("affiliate_account", urlAffiliateAccount);
    }
    let affiliateAccount = localStorage.getItem("affiliate_account");
    if (affiliateAccount) {
        formData.created_by = affiliateAccount;
    }
});

onUnmounted(() => {
    userStore.errorUser = null;
});
</script>
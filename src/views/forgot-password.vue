<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { useUserStore } from "@/stores/user";
import { Form, Field, ErrorMessage } from "vee-validate";
import { string as yupString, object as yupObject, ref as yupRef } from "yup";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const formData = reactive({
  email: "",
  new_password: "",
  confirm_password: "",
});
const errorMessage = ref("");
const isValidToken = ref(false);

const schema = computed(() =>
  yupObject({
    email: yupString()
      .when("isRequired", {
        is: () => !!!isValidToken.value,
        then: yupString().required(
          t("login.required_validation", { field: t("login.email") })
        ),
      })
      .email(t("login.valid_validation", { field: t("login.email") })),
    new_password: yupString().when("isRequired", {
      is: () => !!isValidToken.value,
      then: yupString().required(
        t("login.required_validation", { field: t("login.new_password") })
      ),
    }),
    confirm_password: yupString().oneOf(
      [yupRef("new_password"), null],
      t("login.match_validation", { field: t("login.confirm_password") })
    ),
  })
);

const initData = async () => {
  Object.assign(formData, {
    email: "",
    new_password: "",
    confirm_password: "",
  });
  isValidToken.value = false;
  let token = route.query?.token || "";
  if (!token) return;
  try {
    loadingStore.open();
    await userStore.checkForgotPasswordToken({ token });
    isValidToken.value = true;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    loadingStore.close();
  }
};

const handleFormInput = () => {
  errorMessage.value = "";
};

const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
};

const toggleConfirmPasswordVisible = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
};

const onSubmit = () => {
  errorMessage.value = "";
  schema.value
    .validate(formData)
    .then(async () => {
      try {
        loadingStore.open();

        if (isValidToken.value) {
          await userStore.resetPassword({
            token: route.query?.token,
            password: formData.new_password,
          });

          snackbarStore.add({ message: "Reset password successfully!" });
        } else {
          await userStore.forgotPassword({
            email: formData.email,
          });

          snackbarStore.add({
            message:
              "Reset password form has been sent to your email successfully!",
          });
        }
        router.push("/login");
      } catch (error) {
        console.log("Error: ", error);
        errorMessage.value = error?.message;
      } finally {
        loadingStore.close();
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

onMounted(async () => {
  await initData();
});
</script>

<template>
  <div class="login-view">
    <div class="login-form">
      <div class="form-bg"><span></span></div>
      <div class="form-bg-1"></div>
      <div class="flex-center flex-col form-content">
        <p class="login-title">{{ $t("login.reset_password") }}</p>
        <p class="login-subtitle"></p>

        <Form
          class="flex-center flex-col w-full"
          @submit="onSubmit"
          :validation-schema="schema"
          @input="handleFormInput"
        >
          <template v-if="!isValidToken">
            <div class="form-field">
              <label class="input-title">{{ $t("login.email") }}</label>
              <ErrorMessage name="email" />
              <div class="input-field">
                <Field
                  name="email"
                  v-model="formData.email"
                  type="email"
                  :placeholder="$t('login.enter_email')"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="form-field">
              <label class="input-title">{{ $t("login.new_password") }}</label>
              <ErrorMessage name="new_password" />
              <div class="input-field">
                <Field
                  name="new_password"
                  v-model="formData.new_password"
                  :type="passwordVisible ? 'text' : 'password'"
                  :placeholder="$t('login.enter_new_password')"
                />
                <img
                  src="@/assets/images/rabbit/icons/eye-slash.svg"
                  class="post-icon"
                  v-show="passwordVisible"
                  @click="togglePasswordVisible"
                />
                <img
                  src="@/assets/images/rabbit/icons/eye.svg"
                  class="post-icon"
                  v-show="!passwordVisible"
                  @click="togglePasswordVisible"
                />
              </div>
            </div>
            <div class="form-field">
              <label class="input-title">{{
                $t("login.confirm_password")
              }}</label>
              <ErrorMessage name="confirm_password" />
              <div class="input-field">
                <Field
                  name="confirm_password"
                  v-model="formData.confirm_password"
                  :type="confirmPasswordVisible ? 'text' : 'password'"
                  :placeholder="$t('login.enter_confirm_password')"
                />
                <img
                  src="@/assets/images/rabbit/icons/eye-slash.svg"
                  class="post-icon"
                  v-show="confirmPasswordVisible"
                  @click="toggleConfirmPasswordVisible"
                />
                <img
                  src="@/assets/images/rabbit/icons/eye.svg"
                  class="post-icon"
                  v-show="!confirmPasswordVisible"
                  @click="toggleConfirmPasswordVisible"
                />
              </div>
            </div>
          </template>
          <span class="text-center block mb-10" role="alert" v-if="errorMessage"
            >** {{ errorMessage }}</span
          >
          <button class="btn btn-primary login-btn mb-4 mt-6" type="submit">
            <span class="text-base">{{ $t("login.reset_password_btn") }}</span>
          </button>
        </Form>
      </div>

      <p class="relative no-account-text">
        {{ $t("login.have_no_account") }}
        <span class="cursor-pointer" @click="router.push('/register')">
          {{ $t("login.sign_up") }}
        </span>
        {{ $t("login.or") }}
        <span class="cursor-pointer" @click="router.push('/login')">
          {{ $t("login.sign_in") }}
        </span>
      </p>
    </div>
  </div>
</template>

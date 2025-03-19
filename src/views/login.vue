<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useLoadingStore } from "@/stores/loading";
import { useServerStore } from "@/stores/server";
import { useSnackbarStore } from "@/stores/snackbar";
import { Form, Field, ErrorMessage } from "vee-validate";
import { object as yupObject, string as yupString } from "yup";
import { useI18n } from "vue-i18n";
import { onUnmounted, onMounted } from "vue";
import { googleTokenLogin } from "vue3-google-login";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "@/utils/storage";
import { ElAutocomplete } from "element-plus";
const { t, locale } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const loadingStore = useLoadingStore();
const serverStore = useServerStore();
const snackbarStore = useSnackbarStore();

const interval = ref(null);
interval.value = setInterval(() => {
  checkOldTinyLogin();
}, 5000);
const passwordVisible = ref(false);
const discordPopup = ref(null);
const discordPostMessageInterval = ref(0);
const formData = reactive({
  account: "",
  password: "",
});
const errorMessage = ref("");
const errorCode = ref();
const rememberMe = ref(false);
const isFocused = ref(false);
const autocompleteRef = ref(null);
const accounts = ref([]);
const showAllAccounts = ref(false);

const schema = computed(() =>
  yupObject({
    account: yupString().required(
      t("login.required_validation", { field: t("login.account") })
    ),
    password: yupString().required(
      t("login.required_validation", { field: t("login.password") })
    ),
  })
);

const _getTermPrivacyUrls = computed(() => {
  let term_url = `<a style="color:#69c" href="https://tiny.vn/en/terms-en" target="_blank" rel="noopener noreferrer">${t(
    "login.terms"
  )}</a>`;
  let refund_url = `<a style="color:#69c" href="https://drive.google.com/file/d/1DS7VGg2hK0jgYxGQB9Yhlfu9qOGAtlwk/view" target="_blank" rel="noopener noreferrer">${t(
    "login.refund_policy"
  )}</a>`;
  let privacy_url = `<a style="color:#69c" href="https://tiny.vn/en/terms-vi?rule=baomat" target="_blank" rel="noopener noreferrer">${t(
    "login.privacy"
  )}</a>`;
  return t("login.by_login_accept_terms", {
    term_url,
    privacy_url,
    refund_url,
  });
});

const handleFormInput = () => {
  errorMessage.value = "";
};

const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
};

const onSubmit = () => {
  errorMessage.value = "";
  schema.value
    .validate(formData)
    .then(async () => {
      try {
        loadingStore.open();
        await userStore.login(formData);
        await handleStoreAccount();
        await handleStoreAccountWindow();
        window.location.href = "/";
      } catch (error) {
        console.error("Error: ", error);
        updateErrorMessage(error.code);
      } finally {
        loadingStore.close();
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
};

const updateErrorMessage = (code) => {
  errorCode.value = code;

  switch (true) {
    case code === 400:
      errorMessage.value = t("login.account_or_password_not_correct");
      break;

    case code >= 500:
      errorMessage.value = t("login.unexpected_error");
      break;
  }
};

const onForgotPassword = () => {
  router.push("/forgot-password");
};

const handleLoginWithGoogle = async () => {
  try {
    loadingStore.open();
    const response = await googleTokenLogin();
    const data = { token: response.access_token };
    await userStore.verifyGoogleToken(data);
    window.location.href = "/";
  } catch (error) {
    console.error("Error: ", error);
    errorMessage.value = t("login.user_does_not_exist");
    snackbarStore.add({
      message: errorMessage.value,
      type: "danger",
    });
    userStore.errorUser = error?.data || null;
    router.push({ name: "register" });
  } finally {
    loadingStore.close();
  }
};

const _handleLoginWithDiscord = () => {
  clearInterval(discordPostMessageInterval.value);
  discordPopup.value = null;
  const url =
    "https://discord.com/api/oauth2/authorize?client_id=1188881610754490368&response_type=code&redirect_uri=https%3A%2F%2Fapp.tiny.vn%2Fdiscord%3Ftype%3Ddiscord&scope=identify+email";
  const params =
    "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,\n" +
    "width=700,height=800,left=50%,top=50%";

  discordPopup.value = window.open(url, "Discord Auth", params);

  discordPostMessageInterval.value = setInterval(() => {
    discordPopup.value?.postMessage("", window.location.origin);
  }, 500);
};

const handleDiscordMessage = (event) => {
  if (event.data.code) {
    clearInterval(discordPostMessageInterval.value);
    discordPopup.value?.close();

    if (event.data.code && event.data.type === "discord") {
      verifyDiscordToken(event.data.code);
    }
  }
};

const verifyDiscordToken = async (code) => {
  if (!code) return;

  try {
    loadingStore.open();
    let data = { token: code };
    await userStore.verifyDiscordToken(data);
    window.location.href = "/";
  } catch (error) {
    console.error("Error: ", error);
    errorMessage.value = "User does not exist, please sign-up!";
    snackbarStore.add({ message: errorMessage.value, type: "danger" });
    userStore.errorUser = error?.data || null;
    router.push({ name: "register" });
  } finally {
    loadingStore.close();
  }
};

const checkOldTinyLogin = async () => {
  try {
    // loadingStore.open();
    if (localStorage.getItem("isLoggedOut") != 1) {
      let machineId = await serverStore.pingTinyCore();
      await userStore.loginWithMachineId(machineId);
      window.location.href = "/";
    }
  } catch (_error) {
    // console.error("Error check old tiny: ", error);
  } finally {
    // loadingStore.close();
  }
};

const handleStoreAccount = () => {
  return new Promise(async (resolve) => {
    if (!rememberMe.value) {
      removeStorageItem("isRememberMe");
      removeStorageItem("accounts");
      resolve();
      return;
    }

    const storedAccounts = (await getStorageItem("accounts")) || [];
    const accountExists = storedAccounts.some(
      (item) => item.account === formData.account
    );

    if (!accountExists) {
      storedAccounts.push({
        account: formData.account,
        password: formData.password,
      });
      setStorageItem("accounts", storedAccounts);
    }

    setStorageItem("isRememberMe", rememberMe.value);
    resolve();
  });
};

const handleStoreAccountWindow = async () => {
  try {
    if (!window.electron) {
      return;
    }

    if (!rememberMe.value) {
      await window.electron.invoke("setStore", "isRememberMe", false);
      await window.electron.invoke("setStore", "accounts", []);
      return;
    }

    const storedAccounts = (await window.electron.invoke("getStore", "accounts")) || [];
    const accountExists = storedAccounts.some((item) => item.account === formData.account);

    if (!accountExists) {
      storedAccounts.push({
        account: formData.account,
        password: formData.password,
      });
      await window.electron.invoke("setStore", "accounts", storedAccounts);
    }

    await window.electron.invoke("setStore", "isRememberMe", true);
  } catch (error) {
    // console.error("Lỗi khi lưu tài khoản vào Electron Store:", error);
  }
};

const loadStoredAccountWindow = async () => {
  try {
    if (!window.electron) {
      console.warn("Electron không khả dụng, bỏ qua tải tài khoản.");
      return;
    }

    const isRememberMe = await window.electron.invoke("getStore", "isRememberMe");

    if (typeof isRememberMe === "boolean") {
      rememberMe.value = isRememberMe;
    }

    if (isRememberMe) {
      const storedAccounts = await window.electron.invoke("getStore", "accounts");

      if (storedAccounts?.length) {
        accounts.value = storedAccounts.map((item) => ({
          account: item.account,
          password: item.password,
        }));

        Object.assign(formData, storedAccounts[0]);
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải tài khoản đã lưu:", error);
  }
};




const handleLoadAccountsStorage = async () => {
  try {
    const isRememberMeStorage = await getStorageItem("isRememberMe");
    const accountsStorage = await getStorageItem("accounts");

    if (typeof isRememberMeStorage === "boolean") {
      rememberMe.value = isRememberMeStorage;
    }

    if (accountsStorage) {
      accounts.value = accountsStorage.map((item) => ({
        account: item.account,
        password: item.password,
      }));

      if (accountsStorage.length > 0) {
        const firstAccount = accountsStorage[0];
        formData.account = firstAccount.account;
        formData.password = firstAccount.password;
      }
    }
  } catch (error) {
    console.error("handleLoadAccountsStorage error:", error);
  }
};

const fetchSuggestions = (query, callback) => {
  let results = accounts.value.filter((item) => {
    return item.account.toLowerCase().includes(query.toLowerCase());
  });

  if (showAllAccounts.value || !query) {
    results = accounts.value;
    showAllAccounts.value = false;
  };
  callback(results);
};

const handleSelect = (item) => {
  const selectedAccount = accounts.value.find(
    (element) => element.account === item.account
  );

  if (selectedAccount) formData.password = selectedAccount.password;
  if (autocompleteRef.value) autocompleteRef.value.blur();
};

const deleteSuggestion = async (accountToDelete) => {
  try {
    const accountsStorage = await getStorageItem("accounts");
    if (accountsStorage) {
      const updatedAccounts = accountsStorage.filter(
        (item) => item.account !== accountToDelete
      );

      setStorageItem("accounts", updatedAccounts);
      accounts.value = updatedAccounts.map((item) => ({
        account: item.account,
        password: item.password,
      }));

      if (formData.account === accountToDelete) {
        formData.account = '';
        formData.password = '';
      }
    }
  } catch (error) {
    console.error("Error deleting account:", error);
  }
};

onMounted(async () => {
  await handleLoadAccountsStorage();
  await loadStoredAccountWindow();
  await checkOldTinyLogin();
  clearInterval(discordPostMessageInterval.value);
  window.addEventListener("message", handleDiscordMessage, false);
});

onUnmounted(() => {
  clearInterval(interval.value);
  clearInterval(discordPostMessageInterval.value);
  window.removeEventListener("message", handleDiscordMessage);
});

watch(locale, () => {
  if (!errorCode.value) return;
  updateErrorMessage(errorCode.value);
});
</script>

<template>
  <div class="login-view">
    <div class="login-form">
      <div class="form-bg"><span></span></div>
      <div class="form-bg-1"></div>
      <div class="flex-center flex-col form-content">
        <p class="login-title">{{ $t("login.sign_in") }}</p>
        <p class="login-subtitle">{{ $t("login.sign_in_subtitle") }}</p>

        <Form class="flex-center flex-col w-full" @submit="onSubmit" :validation-schema="schema"
          @input="handleFormInput">
          <div class="form-field">
            <label class="input-title">{{ $t("login.account") }}</label>
            <ErrorMessage name="account" />
            <div class="input-field">
              <Field name="account" v-model="formData.account">
                <template #default="{ field }">
                  <el-autocomplete ref="autocompleteRef" v-bind="field" v-model="formData.account" value-key="account"
                    :fetch-suggestions="fetchSuggestions" :placeholder="$t('login.enter_account')" :hide-loading="false"
                    @select="handleSelect" @focus="isFocused = true" @blur="isFocused = false">
                    <template #default="{ item }">
                      <div class="autocomplete-item">
                        <p>{{ item.account }}</p>
                        <img src="@/assets/images/icons/close.svg" @click.stop="deleteSuggestion(item.account)" />
                      </div>
                    </template>

                    <template #suffix>
                      <img src="@/assets/images/rabbit/icons/triangle-down.svg"
                        :class="['suffix-icon', { rotated: isFocused }]" @click="showAllAccounts = true" />
                    </template>
                  </el-autocomplete>
                </template>
              </Field>
            </div>
          </div>

          <div class="form-field">
            <label class="input-title">{{ $t("login.password") }}</label>
            <ErrorMessage name="password" />
            <div class="input-field">
              <Field name="password" v-model="formData.password" :type="passwordVisible ? 'text' : 'password'"
                :placeholder="$t('login.enter_password')" />
              <img src="@/assets/images/rabbit/icons/eye-slash.svg" class="post-icon" v-show="!passwordVisible"
                @click="togglePasswordVisible" />
              <img src="@/assets/images/rabbit/icons/eye.svg" class="post-icon" v-show="passwordVisible"
                @click="togglePasswordVisible" />
            </div>
          </div>

          <span class="text-center block mb-10 mt-2" role="alert" v-if="errorMessage">
            {{ errorMessage }}
          </span>

          <div class="w-full flex items-center justify-between mb-10">
            <div class="checkbox">
              <input type="checkbox" v-model="rememberMe" />
              <div class="checkbox-box"></div>
              <label class="text-xs checkbox-label">
                {{ $t("login.remember_me") }}
              </label>
            </div>

            <p class="text-xs text-primary cursor-pointer p-0" @click="onForgotPassword">
              {{ $t("login.forgot_password") }}
            </p>
          </div>

          <button class="btn btn-primary login-btn" type="submit">
            <span class="text-base">{{ $t("login.login_btn") }}</span>
          </button>
        </Form>
        <div class="w-full flex items-center my-4">
          <div class="line"></div>
          <p class="text-center or-text">{{ $t("login.or") }}</p>
          <div class="line"></div>
        </div>
        <div class="w-full flex items-center mb-4">
          <button class="btn btn-white flex-grow" @click="handleLoginWithGoogle">
            <img src="@/assets/images/rabbit/icons/google.svg" title="Google" alt="Google" />
            <span class="ml-2">Google</span>
          </button>
          <!-- <button class="btn btn-white flex-grow ml-3" @click="handleLoginWithDiscord">
                        <img src="@/assets/images/rabbit/icons/discord.svg" title="Discord" alt="Discord" />
                        <span class="ml-2">Discord</span>
                    </button> -->
        </div>
      </div>

      <p class="relative no-account-text">
        {{ $t("login.have_no_account") }}
        <span class="cursor-pointer" @click="router.push('/register')">
          {{ $t("login.sign_up") }}
        </span>
      </p>
      <!-- <p class="text-sm no-account-text mt-5"><p v-html="getTermPrivacyUrls"></p></p> -->
    </div>
  </div>
</template>

import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "../axios";
import dayjs from "dayjs";

export const useUserStore = defineStore("user", () => {
  const token = ref("");
  const userInfo = ref(null);
  const affiliateHistoryData = ref(null);
  const remainingValue = ref(0);
  const errorUser = ref(null);
  const isWebPlatform = ref(!window.navigator.userAgent.includes("Electron"));

  setToken(localStorage.getItem("accessToken") || "");

  function setToken(value) {
    token.value = value;
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
    localStorage.setItem("accessToken", token.value);
  }

  function login(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/login", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            setToken(response.data.data?.api_key || "");
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function register(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/register", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function updateUserInfo(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/update-info", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function forgotPassword(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/forgot-password", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function checkForgotPasswordToken(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/check-token-forgot-password", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function resetPassword(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/reset-password", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function logout() {
    try {
      setToken("");
      localStorage.setItem("isLoggedOut", "1");
      localStorage.removeItem("loginTimestamp");

      window.location.href = "/login";
    } catch (error) {
      // console.error("Lỗi khi đăng xuất:", error);
    }
  }


  function getRemainingValue() {
    let duration = 0;
    if (userInfo.value) {
      duration = dayjs(userInfo.value.ngayhethan).diff(dayjs(), "day");
      duration = duration > 0 ? duration : 0;
    }
    remainingValue.value = duration;
  }

  function getUserInfo(params) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/info", params)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            userInfo.value = response.data.data;
            getRemainingValue();
            resolve(response.data.data);
          } else {
            userInfo.value = null;
            reject(response?.data);
          }
        })
        .catch((error) => {
          userInfo.value = null;
          reject(error);
        });
    });
  }

  function getAffiliateHistory(params) {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/end-user/affiliate/history", { params })
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            affiliateHistoryData.value = response.data.data;
            resolve(response.data.data);
          } else {
            affiliateHistoryData.value = null;
            reject(response?.data);
          }
        })
        .catch((error) => {
          affiliateHistoryData.value = null;
          reject(error);
        });
    });
  }

  function loginWithMachineId(machineId) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/login-with-machine-id", {
          machine_id: machineId,
        })
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            setToken(response.data.data?.api_key || "");
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function verifyEmail(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/verify-email", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function resendVerify() {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/resend-verification")
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function verifyGoogleToken(data) {
    console.log(data, "===data");
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/login-with-google", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            setToken(response.data.data?.api_key || "");
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function verifyDiscordToken(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user/login-with-discord", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            setToken(response.data.data?.api_key || "");
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function createUserUsage(data) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/end-user/user-usage-history/create", data)
        .then((response) => {
          if (response?.data?.status == "SUCCESS") {
            resolve(response.data);
          } else {
            reject(response?.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    login,
    register,
    updateUserInfo,
    forgotPassword,
    checkForgotPasswordToken,
    resetPassword,
    logout,
    getUserInfo,
    loginWithMachineId,
    verifyEmail,
    resendVerify,
    verifyGoogleToken,
    verifyDiscordToken,
    getAffiliateHistory,
    createUserUsage,
    token,
    userInfo,
    remainingValue,
    errorUser,
    isWebPlatform,
    affiliateHistoryData,
  };
});

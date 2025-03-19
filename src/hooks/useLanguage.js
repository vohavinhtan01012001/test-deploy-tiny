import { ref, watch, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import axios from "@/axios";

import ViFlag from "@/assets/images/rabbit/flag-vi.png";
import EnFlag from "@/assets/images/rabbit/flag-en.png";
import CnFlag from "@/assets/images/rabbit/flag-cn.png";
import ThFlag from "@/assets/images/rabbit/flag-th.png";
import IdFlag from "@/assets/images/rabbit/flag-id.png";
import TlFlag from "@/assets/images/rabbit/flag-tl.png";
import MsFlag from "@/assets/images/rabbit/flag-ms.png";
import JpFlag from "@/assets/images/rabbit/flag-jp.png";

export function useLanguage() {
  const i18n = useI18n();
  const language = ref(null);
  const languageList = ref([
    { title: "English", value: "en", icon: EnFlag, shortName: "EN" },
    { title: "Vietnamese", value: "vi", icon: ViFlag, shortName: "VN" },
    { title: "Chinese", value: "zh", icon: CnFlag, shortName: "CN" },
    { title: "Thai", value: "th", icon: ThFlag, shortName: "TH" },
    { title: "Indonesian", value: "id", icon: IdFlag, shortName: "ID" },
    { title: "Malay", value: "ms", icon: MsFlag, shortName: "MY" },
    { title: "Filipino", value: "tl", icon: TlFlag, shortName: "PH" },
    { title: "Japanese", value: "ja", icon: JpFlag, shortName: "JP" },
  ]);

  onBeforeMount(async () => {
    const storageLanguage = await getStorageItem("language");
    language.value =
      languageList.value?.find((l) => l.value === storageLanguage) ||
      languageList.value?.[0];

    axios
      .get("/api/end-user/detect-location")
      .then((res) => {
        const countryCode = res?.data?.data?.countryCode;
        switch (countryCode) {
            case "VN":
            language.value = { title: "Vietnamese", value: "vi", icon: ViFlag, shortName: "VN" };
            break;
            case "CN":
            language.value = { title: "Chinese", value: "zh", icon: CnFlag, shortName: "CN" };
            break;
            case "TH":
            language.value = { title: "Thai", value: "th", icon: ThFlag, shortName: "TH" };
            break;
            case "ID":
            language.value = { title: "Indonesian", value: "id", icon: IdFlag, shortName: "ID" };
            break;
            case "MY":
            language.value = { title: "Malay", value: "ms", icon: MsFlag, shortName: "MY" };
            break;
            case "PH":
            language.value = { title: "Filipino", value: "tl", icon: TlFlag, shortName: "PH" };
            break;
            case "JP":
            language.value = { title: "Japanese", value: "ja", icon: JpFlag, shortName: "JP" };
            break;
            default:
            language.value = { title: "English", value: "en", icon: EnFlag, shortName: "EN" };
            break;
        }
      })
      .catch((err) => {});
  });

  watch(
    () => language.value,
    () => {
      if (language.value?.value) {
        setStorageItem("language", language.value.value);
      }
      i18n.locale.value = language.value?.value || "en";
    },
    { immediate: true, deep: true }
  );

  return {
    language,
    languageList,
  };
}

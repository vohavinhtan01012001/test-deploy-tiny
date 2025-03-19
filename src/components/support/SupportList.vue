<template>
  <div class="w-full support">
    <div class="w-full content-block support-block">
      <p class="text-center mx-auto main-title mb-4">
        {{ $t("support.main_title") }}
      </p>
      <p class="text-center mx-auto main-subtitle">
        {{ $t("support.main_subtitle") }}
      </p>

      <div class="support-list">
        <template v-if="faqList?.length">
          <div
            class="support-item"
            v-for="(faq, index) in faqList"
            :key="index"
            :class="{ open: openedFaq.includes(faq.id) }"
          >
            <div class="support-item-header" @click="toggleOpenFaq(faq)">
              <p class="support-item-title">{{ faq.question }}</p>
              <div class="support-item-icon"></div>
            </div>
            <div class="support-item-content">
              <p v-for="(answer, i) in faq.answers" :key="i">
                <span v-html="answer"></span>
              </p>
            </div>
          </div>
        </template>
        <div class="p-10" v-else>
          {{ $t("global.no_data_available") }}
        </div>
      </div>

      <button class="btn btn-primary">{{ $t("support.contact_btn") }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import SearchInput from "@/components/common/SearchInput.vue";

const { t } = useI18n();

const keyword = ref("");
const faqList = computed(() => [
  {
    id: 1,
    question: t("support.q_what_is_tiny"),
    answers: [t("support.a_what_is_tiny")],
    isOpened: false,
  },
  {
    id: 2,
    question: t("support.q_games_with_tiny_support"),
    answers: [t("support.a_games_with_tiny_support")],
    isOpened: false,
  },
  {
    id: 3,
    question: t("support.q_package_differences"),
    answers: [t("support.a_package_differences")],
    isOpened: false,
  },
  {
    id: 4,
    question: t("support.q_how_to_contact"),
    answers: [
      t("support.a_how_to_contact"),
      `Webiste: <a href='https://tiny.vn' target='_blank'>${t(
        "support.tiny_chat"
      )}</a>`,
      `Facebook: <a href='https://facebook.com/giampingchoigame' target='_blank'>${t(
        "support.tiny_reduce_ping"
      )}</a>`,
      "Email: <a href='mailto:admin@tiny.vn' target='_blank'>admin@tiny.vn</a>",
    ],
    isOpened: false,
  },
]);

const openedFaq = ref([]);

const filteredList = computed(() =>
  faqList.value?.filter(
    (faq) =>
      !keyword.value ||
      `${faq.question} ${faq.answer}`
        .toLowerCase()
        ?.includes(keyword.value?.toLowerCase()?.trim())
  )
);

const toggleOpenFaq = (faq) => {
  if (!faq) return;
  if (openedFaq.value?.includes(faq.id)) {
    openedFaq.value = openedFaq.value.filter((id) => id != faq.id);
  } else {
    openedFaq.value.push(faq.id);
  }
};
</script>

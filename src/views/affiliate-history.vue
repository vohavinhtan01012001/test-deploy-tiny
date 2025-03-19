<template>
    <div class="w-full affiliate-history-list-component">
        <p class="text-center mx-auto main-title mb-4">{{ $t("global.affiliate_history") }}</p>

        <div class="flex items-center justify-center mb-10">
            <search-input v-model="keyword" no-dropdown class="search-input" @input="handleSearchValue" />

            <custom-select v-model="filteredValue.historyStatus" :options="historyStatusOptions" :no-selected-title="$t('affiliate.affiliate_status')" null-with-empty-value class="ml-4 history-status-filter" @change="handleFilterStatus" />
        </div>

        <table class="mb-10">
            <thead>
                <tr>
                    <th>{{ $t("global.id") }}</th>
                    <th class="flex justify-start">{{ $t("affiliate.account") }}</th>
                    <th>{{ $t("affiliate.amount") }}</th>
                    <th>{{ $t("affiliate.days") }}</th>
                    <th>{{ $t("affiliate.child_account") }}</th>
                    <th>{{ $t("affiliate.status") }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="history in affiliateHistoryList" :key="history.id">
                    <td>{{ history.id }}</td>
                    <td>{{ history.user?.account }}</td>
                    <td>
                        <div class="flex items-center">
                            {{ formatPrice(history.amount) }}
                        </div>
                    </td>
                    <td>{{ history.day }}</td>
                    <td>{{ formattedChildAccount(history.child_user?.account) }}</td>
                    <td>{{ getHistoryStatusText(history.status) }}</td>
                </tr>
            </tbody>
        </table>

        <paginate
            :page-count="pageCount"
            :prev-text="'<'"
            :next-text="'>'"
            :container-class="'pagination'"
            v-model="page"
            :click-handler="getAffiliateHistory"
            first-last-button
            v-if="pageCount > 1"
        >
        </paginate>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useLoadingStore } from "@/stores/loading";
import { useSnackbarStore } from "@/stores/snackbar";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { formatPrice } from "@/utils/price.js";
import { useDebounce } from "@/utils/debounce.js";
import SearchInput from "@/components/common/SearchInput.vue";
import CustomSelect from "@/components/common/CustomSelect.vue";

const loadingStore = useLoadingStore();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const { isLoading } = storeToRefs(loadingStore);
const { affiliateHistoryData } = storeToRefs(userStore);

const keyword = ref("");
const page = ref(1);
const perPage = ref(20);

const filteredValue = ref({
    historyStatus: null
});

const historyStatusOptions = ref([
    { title: "All", value: "" },
    { title: "PENDING", value: "0" },
    { title: "CREDITED", value: "1" },
]);

const affiliateHistoryList = computed(() => affiliateHistoryData.value?.data);
const pageCount = computed(() => affiliateHistoryData.value?.last_page || 1);

const getHistoryStatusText = (status) => {
    switch(status) {
        case 0: return "PENDING";
        case 1: return "CREDITED";
        default: return "";
    }
}

const formattedChildAccount = (account) => {
    if(!account || account.length < 2) return account;
    return account.charAt(0) + 'x'.repeat(account.length - 2) + account.slice(-1);
}

const getAffiliateHistory = async () => {
    try {
        loadingStore.open();

        let params = {
            page: page.value,
            "per-page": perPage.value
        }

        if(keyword.value) {
            params.keyword = keyword.value;
        }

        if(filteredValue.value.historyStatus?.value) {
            params.status = filteredValue.value.historyStatus.value;
        }

        await userStore.getAffiliateHistory(params);
        
    } catch(error) {
        console.log("Get history info error: ", error);
        snackbarStore.add({ message: error?.message || error?.error || error || "" });
    } finally {
        loadingStore.close();
    }
}

const handleSearchValue = useDebounce(() => {
    page.value = 1;
    getAffiliateHistory();
}, 500);

const handleFilterStatus = () => {
    page.value = 1;
    getAffiliateHistory();
}

onBeforeMount(() => {
    getAffiliateHistory();
});
</script>

<style lang="scss" scoped>
table {
    border-collapse: collapse;
    * {
        transition: 0.3s ease;
    }
    tr {
        td {
            vertical-align: top;
        }
        &:hover {
            td {
                background: rgba(255, 255, 255, 0.1);
            }
        }
    }
}
.search-input {
    max-width: 395px;
}

.history-status-filter {
    :deep(.custom-select) {
        min-width: 120px;
    }
}
</style>
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false,
        loadTime: null
    }),
    actions: {
        open() {
            if (this.loadTime) {
                clearTimeout(this.loadTime);
                this.loadTime = null;
            }
            this.isLoading = true;
            this.loadTime = setTimeout(() => {
                this.close();
            }, 10000);
            this.isLoading = true;
        },
        close() {
            this.isLoading = false;
        }
    }
})
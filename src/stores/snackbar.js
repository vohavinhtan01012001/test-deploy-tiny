import { defineStore } from 'pinia';

// type: success, danger, warning

export const useSnackbarStore = defineStore('snackbar', {
    state: () => ({
        snackbarList: [],
        id: 0
    }),
    actions: {
        add(data) {
            this.id++;
            this.snackbarList.push({ id: this.id, ...data });
        },
        remove(id) {
            this.snackbarList = this.snackbarList.filter(item => item.id != id);
        }
    }
});
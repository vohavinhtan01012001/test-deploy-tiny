<template>
    <article class="rounded-lg snackbar-item" :class="[`bg-${snackbar.type || 'success'}`]">
		<div class="relative p-4 snackbar-item-wrapper">
			<!-- <div v-if="icon" class="snackbar-item-icon">
				<vue3-icon v-bind="icon" role="img" />
			</div> -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3.5" viewBox="0 0 20 20" fill="currentColor" v-if="snackbar.type == 'warning'">
                <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3.5" viewBox="0 0 20 20" fill="currentColor" v-else-if="snackbar.type == 'danger'">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3.5" viewBox="0 0 20 20" fill="currentColor" v-else>
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
            </svg>
			<div class="snackbar-item-content">
				<div class="break-words snackbar-item-message">
					{{ snackbar.message || "Notification content" }}
				</div>
			</div>
			<div class="spacer"></div>
            <span @click="removeSnackbar" class="cursor-pointer">
                <svg fill="currentColor" style="width: 24px; height: 24px;" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
		</div>
	</article>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSnackbarStore } from "@/stores/snackbar";

const props = defineProps(["snackbar"]);

const snackbarStore = useSnackbarStore();

const timer = ref(null);

onMounted(() => {
    if(props.snackbar) {
        timer.value = setTimeout(() => {
            snackbarStore.remove(props.snackbar.id);
        }, props.snackbar.duration || 2000);
    }
})

const removeSnackbar = () => {
    if(props.snackbar) {
        if(timer.value) {
            clearTimeout(timer.value);
            timer.value = null;
        }
        snackbarStore.remove(props.snackbar.id);
    }
}
</script>
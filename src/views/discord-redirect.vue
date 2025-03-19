<template>
    <div></div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
    window.addEventListener("message", (event) => {
        console.log({event});
        event.source.postMessage(
            {
                code: new URLSearchParams(window.location.search).get('code'),
                type: "discord"
            },
            event.origin
        );
    });
});
</script>
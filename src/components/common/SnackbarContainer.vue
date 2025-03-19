<template>
  <section id="snackbar-container" class="snackbar-container">
    <transition-group name="snackbar-list" tag="div">
      <Snackbar
        v-for="snackbar in snackbarList"
        :key="snackbar.id"
        :snackbar="snackbar"
      />
    </transition-group>
  </section>
</template>

<script setup>
import { computed } from "vue";
import Snackbar from "@/components/common/Snackbar.vue";
import { useSnackbarStore } from "@/stores/snackbar";

const snackbarStore = useSnackbarStore();

const snackbarList = computed(() => snackbarStore.snackbarList);
</script>

<style lang="scss">
#snackbar-container {
  position: fixed;
  margin: 16px 16px 0 16px;
  padding: 0;
  pointer-events: none;
  top: 0;
  right: 0;
  z-index: 10001;

  svg {
    max-width: 30px;
  }

  .bg-success {
    background: #28c76f;
  }

  .bg-danger {
    background: #ff3b3b;
  }

  .bg-warning {
    background: #f3a22c;
  }
}

.snackbar-item {
  display: flex;
  color: #fff;
  margin-bottom: 16px;
  position: relative;
  border-radius: 4px;
  pointer-events: all;

  &-wrapper {
    align-items: center;
    border-radius: inherit;
    display: flex;
  }

  &-title {
    font-weight: bold;
  }

  &-content {
    display: flex;
    flex-flow: column;
    width: min(50vw, 300px);
  }
}

.snackbar-list-enter-from {
  opacity: 0;
  -webkit-transform: translateY(50%);
  -ms-transform: translateY(50%);
  transform: translateY(50%);
}
.snackbar-list-leave-from {
  max-height: 1000px;
}
.snackbar-container .snackbar-list-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  overflow: hidden;
}
.snackbar-list-enter-active {
  transition: transform 0.3s, opacity 0.3s;
}
.snackbar-list-leave-active {
  transition: max-height 0.45s cubic-bezier(0, 1, 0, 1), opacity 0.3s,
    margin-bottom 0.3s;
}
</style>

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "../axios";

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const articleList = ref([]);
  
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function getArticleList() {
    return new Promise((resolve, reject) => {
      axios.get("/api/article/article/list", { params: { page: 1, "per-page": 10 } }).then((response) => {
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  return { count, doubleCount, increment, getArticleList }
})

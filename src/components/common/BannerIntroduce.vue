<template>
  <section class="slider-section">
    <swiper :modules="modules" :slides-per-view="1" :spaceBetween="30" :loop="true" class="my-swiper" @swiper="onSwiper"
      @slideChange="onSlideChange" :autoplay="{
        delay: 5000,
        disableOnInteraction: false
      }">
      <swiper-slide v-for="(slide, index) in slides" :key="index" class="slide">
        <div class="slide-content">
          <img :src="slide.image" alt="Slide Image" class="slide-image object-cover" />
        </div>
      </swiper-slide>
    </swiper>

    <!-- Custom navigation buttons -->
    <div class="custom-navigation">
      <button class="prev-btn" @click="() => swiperInstance.slideNext()">
        <img :src="swiperArrow" alt="" class="rotate">
      </button>
      <button class="next-btn" @click="() => swiperInstance.slideNext()">
        <img :src="swiperArrow" alt="">
      </button>
    </div>
    <div class="dotted">
      <div v-for="(item, index) in slides" :key="index" :class="realIndex === index ? 'active' : ''"
        class="dotted__index" @click="slideToIndex(index)"></div>
    </div>
  </section>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import swiperArrow from '@/assets/images/swiper-arrow.png';
// import "swiper/swiper-bundle.css";
import 'swiper/css';
import bannerSwiper from "@/assets/images/rabbit/share-banner.png";
import { ref } from 'vue'
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
const modules = [Autoplay, Pagination];
const swiperInstance = ref();
const realIndex = ref(0);
const onSwiper = (e) => {
  swiperInstance.value = e;
};

const slides = [
  {
    image: bannerSwiper,
  },
  {
    image: bannerSwiper,
  },
];
const onSlideChange = () => {
  realIndex.value = swiperInstance.value?.realIndex || 0;
};
const slideToIndex = (index) => {
  swiperInstance.value.slideTo(index);
  realIndex.value = swiperInstance.value?.realIndex || 0;
}

</script>
<style lang="scss" scoped>
.slider-section {
  position: relative;
  width: 100%;
  margin: auto;
  overflow: hidden;
  aspect-ratio: 772 / 270;
  margin-top: 12px;

  .my-swiper {
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .slide-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 0px;

        .slide-image {
          width: 100%;
          border-radius: 10px;
          object-fit: cover;
          margin-bottom: 26px;
        }

        .slide-text {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;

          h2 {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
          }

          p {
            font-size: 1rem;
          }
        }
      }
    }
  }

  .custom-navigation {
    position: absolute;
    z-index: 1000;
    top: 50%;
    left: 50%;
    width: calc(100% - 24px);
    display: flex;
    justify-content: space-between;
    transform: translate(-50%, -50%);

    .prev-btn,
    .next-btn {
      background: #484748;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 255, 255, 0.7);
        color: black;
      }
    }
  }

  .rotate {
    transform: rotate(180deg);
  }
}

.dotted {
  position: absolute;
  z-index: 12;
  bottom: -4px;
  /* Điều chỉnh vị trí phù hợp */
  right: 50%;
  transform: translateX(50%);
  display: flex;
  justify-content: center;
  overflow: hidden;
  /* Ngăn tràn */
  max-width: 100%;
  /* Đảm bảo nó không vượt quá kích thước slider */


  &__index {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin: 4px;
    display: inline-block;
    box-sizing: border-box;
    cursor: pointer;
    background-color: #F04E4C;
    opacity: 0.6;
    transition: all 0.3s ease;
    /* Thêm hiệu ứng chuyển đổi */
  }

  .active {
    background: #F04E4C;
    width: 48px;
    /* Kích thước dot khi active */
    border-radius: 40px !important;
    transition: all 0.3s ease;
    /* Thêm hiệu ứng chuyển đổi */
  }

}
</style>
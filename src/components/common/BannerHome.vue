<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import swiperArrow from "@/assets/images/swiper-arrow.png";
// import "swiper/swiper-bundle.css";
import "swiper/css";
import bannerSwiper from "@/assets/images/image-login.png";
import { ref } from "vue";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
const modules = [Autoplay];
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
};
</script>

<template>
  <section class="slider-section">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :loop="true"
      class="my-swiper"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index" class="slide">
        <div class="slide-content">
          <img
            :src="slide.image"
            alt="Slide Image"
            class="slide-image object-cover"
          />
        </div>
      </swiper-slide>
      <div class="dotted">
        <div
          v-for="(item, index) in slides"
          :key="index"
          :class="realIndex === index ? 'active' : ''"
          class="dotted__index"
          @click="slideToIndex(index)"
        ></div>
      </div>
    </swiper>
  </section>
</template>

<style lang="scss" scoped>
.slider-section {
  position: relative;
  width: 100%;
  margin: auto;
  overflow: hidden;
  margin-left: 32px;
  max-width: 472px;
  // height: 100%;

  .my-swiper {
    border-radius: 25px;

    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      img {
        pointer-events: none;
      }

      .slide-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 20px 0px 20px 0px;

        .slide-image {
          width: 100%;
          border-radius: 10px;
          object-fit: cover;
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
    width: 100%;
    display: flex;
    justify-content: space-between;
    transform: translateY(-25%);

    .prev-btn,
    .next-btn {
      background: rgba(0, 0, 0, 0.5);
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

    .next-btn {
      transform: translateX(-50%);
    }
  }

  .rotate {
    transform: rotate(180deg);
  }
}

.dotted {
  position: absolute;
  z-index: 12;
  bottom: -8px;
  right: 50%;
  transform: translateX(50%);

  &__index {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin: 4px;
    display: inline-block;
    box-sizing: border-box;
    cursor: pointer;
    background-color: #f04e4c;
    opacity: 0.6;
    transition: all 0.3s ease;
    /* Thêm hiệu ứng chuyển đổi */
  }

  .active {
    background: #f04e4c;
    width: 48px;
    /* Kích thước dot khi active */
    border-radius: 40px !important;
    transition: all 0.3s ease;
    /* Thêm hiệu ứng chuyển đổi */
  }
}
</style>

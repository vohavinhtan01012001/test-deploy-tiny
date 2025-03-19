<template>
  <section class="slider-section ">
    <swiper :modules="modules" :slides-per-view="1" :loop="true" pagination class="my-swiper" @swiper="onSwiper"
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
import bannerSwiper from "@/assets/images/banner-swiper.png";
import bannerTrialTH from "@/assets/images/rabbit/banner-trial-th.png"
import bannerTrialCN from "@/assets/images/rabbit/banner-trial-cn.png"
import bannerTrialEN from "@/assets/images/rabbit/banner-trial-en.png"
import bannerTrialID from "@/assets/images/rabbit/banner-trial-id.png"
import bannerTrialMY from "@/assets/images/rabbit/banner-trial-my.png"
import bannerTrialVI from "@/assets/images/rabbit/banner-trial-vi.png"
import { useI18n } from "vue-i18n";
import { ref, computed } from 'vue'
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
const { locale } = useI18n();
const modules = [Autoplay, Pagination];
const swiperInstance = ref();
const realIndex = ref(0);
const onSwiper = (e) => {
  swiperInstance.value = e;
};

const slides =computed(()=> {
  switch (locale.value) {
    case "zh":
      return [
        { image: bannerTrialCN },
        { image: bannerTrialCN },
      ];
    case "id":
      return [
        { image: bannerTrialID },
        { image: bannerTrialID },
      ];
    case "ms":
      return [
        { image: bannerTrialMY },
        { image: bannerTrialMY },
      ];
    case "th":
      return [
        { image: bannerTrialTH },
        { image: bannerTrialTH },
      ];
    case "vi":
      return [
        { image: bannerTrialVI },
        { image: bannerTrialVI },
      ];
    default:
      return [
        { image: bannerTrialEN },
        { image: bannerTrialEN },
      ];
  }
});

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
  // overflow: hidden;
  // height: 128px;

  .my-swiper {
    margin-top: 12px;

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
        // padding: 20px 20px 20px 0px;

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

    :deep(.swiper-pagination-bullets) {
      display: none;
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
    pointer-events: none;
    .prev-btn,
    .next-btn {
      pointer-events: auto;
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
  bottom: 0;
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
    background-color: #ffffff;
    opacity: 0.6;
    transition: all 0.3s ease;
    /* Thêm hiệu ứng chuyển đổi */
  }

  .active {
    background: #F04E4C;
    width: 48px;
    /* Kích thước dot khi active */
    border-radius: 40px !important;
    opacity: 1;
    transition: all 0.3s ease;
    /* Thêm hiệu ứng chuyển đổi */
  }

}
</style>
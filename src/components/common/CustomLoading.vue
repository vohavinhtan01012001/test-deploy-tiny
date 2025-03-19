<template>
    <div class="h-screen w-screen flex justify-center items-center loading-layout">
        <!-- <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div> -->
        <div class="lds-dual-ring"></div>
    </div>
</template>

<style lang="scss">
.loading-layout {
  background: rgba(0,0,0,0.6);
  opacity: 0.9;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
}
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid var(--primary);
  border-color: var(--primary) transparent var(--primary) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
// .lds-ellipsis {
//   display: inline-block;
//   position: relative;
//   width: 80px;
//   height: 80px;
// }
// .lds-ellipsis div {
//   position: absolute;
//   top: 33px;
//   width: 13px;
//   height: 13px;
//   border-radius: 50%;
//   background: #fff;
//   animation-timing-function: cubic-bezier(0, 1, 1, 0);
// }
// .lds-ellipsis div:nth-child(1) {
//   left: 8px;
//   animation: lds-ellipsis1 0.6s infinite;
// }
// .lds-ellipsis div:nth-child(2) {
//   left: 8px;
//   animation: lds-ellipsis2 0.6s infinite;
// }
// .lds-ellipsis div:nth-child(3) {
//   left: 32px;
//   animation: lds-ellipsis2 0.6s infinite;
// }
// .lds-ellipsis div:nth-child(4) {
//   left: 56px;
//   animation: lds-ellipsis3 0.6s infinite;
// }
// @keyframes lds-ellipsis1 {
//   0% {
//     transform: scale(0);
//   }
//   100% {
//     transform: scale(1);
//   }
// }
// @keyframes lds-ellipsis3 {
//   0% {
//     transform: scale(1);
//   }
//   100% {
//     transform: scale(0);
//   }
// }
// @keyframes lds-ellipsis2 {
//   0% {
//     transform: translate(0, 0);
//   }
//   100% {
//     transform: translate(24px, 0);
//   }
// }

</style>
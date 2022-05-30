// 首頁 heroBanner 
const swiperHeroBanner = new Swiper(".swiper-heroBanner", {
    cssMode: true,
    slidesPerView: 1,
    // loop: true,
    // autoplay: {
    //   disableOnInteraction: false,
    //   delay: 4000,
    // },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
  });
  


  console.log(mySwiper);
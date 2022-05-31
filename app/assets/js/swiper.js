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
  

// 熱門打卡景點
const swiperSpots = new Swiper(".swiper-spots", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
      rows: 1,
      fill: 'row',
  },
  breakpoints:{
    992: {
        slidesPerView: 4,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
  }
});

// 一再回訪美食
const foodSpots = new Swiper(".swiper-foods", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
      rows: 1,
      fill: 'row',
  },
  breakpoints:{
    992: {
        slidesPerView: 4,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
  }
});

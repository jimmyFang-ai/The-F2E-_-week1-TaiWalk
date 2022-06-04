"use strict";

// jq 初始化
$(function () {
  console.log("QQ");
}); // function init() {
//   // AOS.init();
// };
"use strict";

var searchCategory = document.querySelector(".search-category");
var categoryList = document.querySelector(".spots-categoryList");

if (categoryList) {
  categoryList.addEventListener("click", function (e) {
    e.preventDefault();
    var category = e.target.closest(".spots-card");
    var categoryVal = e.target.closest("li").dataset.category;
    searchCategory.value = categoryVal;
    category.classList.toggle("active");
  });
}
"use strict";

// 首頁 heroBanner 
var swiperHeroBanner = new Swiper(".swiper-heroBanner", {
  cssMode: true,
  slidesPerView: 1,
  // loop: true,
  // autoplay: {
  //   disableOnInteraction: false,
  //   delay: 4000,
  // },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 熱門打卡景點

var swiperSpots = new Swiper(".swiper-spots", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
    rows: 1,
    fill: 'row'
  },
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    }
  }
}); // 一再回訪美食

var foodSpots = new Swiper(".swiper-foods", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
    rows: 1,
    fill: 'row'
  },
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    }
  }
});
"use strict";

var togglerBurger = document.querySelector('#toggler-burger'); // 預設是 false 選單關閉，不會出現打 X

var isMenuOpen = false;
togglerBurger.addEventListener('click', function (e) {
  //this 的指向是 togglerBurger 本身 要加上 open 樣式
  // console.log(this);
  // 點擊後 選單打開 為true，會出現打 X
  isMenuOpen = !isMenuOpen;
  isMenuOpen ? this.classList.add('open') : this.classList.remove('open');
});
//# sourceMappingURL=all.js.map

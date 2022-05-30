"use strict";

function init() {// AOS.init();
}

;
// const mySwiperDemo = new Swiper('.mySwiper', {
//   // Optional parameters
//   direction: 'vertical',
//   loop: true,
//   // If we need pagination
//   pagination: {
//     el: '.swiper-pagination',
//   },
//   // Navigation arrows
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },
//   // And if we need scrollbar
//   scrollbar: {
//     el: '.swiper-scrollbar',
//   },
// });
// console.log(mySwiperDemo);
"use strict";
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

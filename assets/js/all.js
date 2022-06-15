"use strict";

// PTX api  header 驗證
function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  var AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
  var AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'; // let AppID = 'pi20120413-51900829-226c-41ea';
  // let AppKey = '3b7f6972-70db-4eba-8d74-2d6e11c5f499';
  //  填入自己 ID、KEY 結束

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return {
    'Authorization': Authorization,
    'X-Date': GMTString
  };
} // 測試用 test


console.log(getAuthorizationHeader()); // let testApi = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=100&%24format=JSON';
// apiUrl

var apiUrl_activity = axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?$filter=Picture%2FPictureUrl1%20ne%20null&$format=JSON', {
  headers: getAuthorizationHeader()
});
var apiUrl_scenicSpot = axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$filter=Picture%2FPictureUrl1%20ne%20null&%format=JSON', {
  headers: getAuthorizationHeader()
});
var apiUrl_restaurant = axios.get('https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/?$filter=Picture%2FPictureUrl1%20ne%20null&$format=JSON', {
  headers: getAuthorizationHeader()
}); // data  資料

var data_activity = [];
var data_scenicSpot = [];
var data_restaurant = []; // 呈現畫面 DOM 

var home_activity = document.querySelector('.home_activity');
var home_scenicSpot = document.querySelector('.home_scenicSpot');
var home_restaurant = document.querySelector('.home_restaurant'); // console.log(home_activity,home_scenicSpot,home_restaurant );
// Promise.all([apiUrl_activity,apiUrl_scenicSpot,apiUrl_restaurant])
//     .then((response) => {
//       console.log(response[0].data);
//       console.log(response[1].data);
//       console.log(response[2].data);
//     })
// // axios 結合 Promise.all 串接多支 API
// // 使用async/await 讓取得資料從非同步進行為同步，並使用try...catch 陳述式管理流程
// const getData = async () => {
//   try{   // 專注在正常流程
//      const response  =  await Promise.all([
//        apiUrl_activity,
//        apiUrl_scenicSpot,
//        apiUrl_restaurant
//      ]) 
//     //  回傳 成功資訊
//     return response;
//   }catch(error){ // 專注在錯誤流程
//     // 將錯誤訊息拋出
//     throw new Error(error);
//   }
// };
// // 運行 getData 函式，並使用promise方式，取得資料狀態
// getData.then((response) => {
//   console.log(response);
// })
// 初始化
// function init() {
//   get_activity();
//   // get_scenicSpot();
//   // get_restaurant();
// }
// init();
// // 首頁近期活動: 取得資料 
// function get_activity() {
//   axios.get(apiUrl_activity,
//     {
//       headers: getAuthorizationHeader()
//     }
//   )
//     .then(function (response) {
//       data_activity = response.data;
//       // //呈現畫面
//       // render_activity(data_activity);
//       console.log(data_activity);
//     })
//     .catch(function (error) {
//       console.log(error.response.data);
//     });
// };
// // 首頁近期活動:  呈現畫面
// function render_activity(arr) {
//   let str = '';
//   //  取得當前年份和月份
//   // 月份是從0開始，所以要加1，才會符合12個月/年
//   const month = new Date().getMonth() + 1;
//   const year = new Date().getFullYear();
//   // 畫面呈現為四筆資料，所以要跑四次迴圈
//   for (let i = 0; i < 4; i++) {
//     // 隨機取得 陣列資料索引位置和資料
//     let dataIndex = getRandom(arr.length);
//     let dataItem = arr[dataIndex];
//     // 取得最近活動還沒結束的時間，落在今年或明年。
//     const checkDate = parseInt(dataItem.EndTime.slice(0, 4)) >= year && parseInt(dataItem.EndTime.slice(5, 7)) >= month || parseInt(dataItem.EndTime.slice(0, 4)) > year;
//     // console.log(checkDate);
//     // 判斷 如果checkDate 為 false 重跑一次迴圈
//     if (checkDate === false) {
//       i -= 1;
//       continue;
//     } else {
//       // 為 true 的話就組字串資料
//       str += `<div class="col mb-2">
//       <div class="card">
//         <div class="row g-0">
//           <div class="col-4 overflow-hidden">
//           <div class="ratio ratio-9x7  ratio-md-1x1">
//              <a class="imgWarp" href="./activity.html?id=${dataItem.ActivityID}">
//              <img class=" card-img img-cover" src="${dataItem.Picture.PictureUrl1}" alt="${dataItem.Description}">
//              </a>
//           </div>
//           </div>
//           <div class="col-8">
//             <div class="card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5">
//               <div>
//                 <span class="card-text text-secondary fs-xs fs-lg-6"> ${dataItem.StartTime.slice(0, 10)} - ${dataItem.EndTime.slice(0, 10)}</span>
//                 <h5 class="card-title fs-6 fs-lg-xl lh-base fw-bold mb-0 text-truncate">${dataItem.ActivityName}</h5>
//               </div>
//               <div class="d-flex justify-content-between align-items-center">
//                 <span class="card-text text-secondary d-flex align-items-center"><img class="me-1"
//                     src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
//                 <a class="btn  btn-infoBtn   d-none d-md-inline-block shadow-none" href="./activity.html?id=${dataItem.ActivityID}"><span
//                     class="btn-inner">詳細介紹 ❯
//                   </span></a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>`;
//     }
//   };
//   // 呈現畫面
//   home_activity.innerHTML = str;
// };
// // 首頁打卡景點: 取得資料 
// function get_scenicSpot() {
//   axios.get(apiUrl_scenicSpot,
//     {
//       headers: getAuthorizationHeader()
//     }
//   )
//     .then(function (response) {
//       data_scenicSpot = response.data;
//       //呈現畫面
//       render_scenicSpot(data_scenicSpot);
//       console.log(data_scenicSpot);
//     })
//     .catch(function (error) {
//       console.log(error.response.data);
//     });
// };
// // 首頁打卡景點: 呈現畫面
// function render_scenicSpot(arr) {
//   let str = '';
//   // 畫面呈現為四筆資料，所以要跑四次迴圈
//   for (let i = 0; i < 4; i++) {
//     // 隨機取得 陣列資料索引位置和資料
//     let dataIndex = getRandom(arr.length);
//     let dataItem = arr[dataIndex];
//     str += `<li class="swiper-slide">
//     <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
//       <a href="./scenicSpot.html?id=${dataItem.ScenicSpotID}">
//         <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}"
//           alt="${dataItem.DescriptionDetail}">
//       </a>
//     </div>
//     <div class="py-1 py-md-2">
//       <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.ScenicSpotName}</h5>
//       <span class="text-secondary d-flex align-items-center"><img class="me-1"
//           src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
//     </div>
//   </li>`;
//   };
//   // 呈現畫面
//   home_scenicSpot.innerHTML = str;
// };
// // 首頁餐廳資訊: 取得資料 
// function get_restaurant() {
//   axios.get(apiUrl_restaurant,
//     {
//       headers: getAuthorizationHeader()
//     }
//   )
//     .then(function (response) {
//       data_restaurant = response.data;
//       //呈現畫面
//       render_restaurant(data_restaurant);
//       console.log(data_restaurant);
//     })
//     .catch(function (error) {
//       console.log(error.response.data);
//     });
// };
// // 首頁餐廳資訊: 呈現畫面
// function  render_restaurant(arr) {
//   let str = '';
//   // 畫面呈現為四筆資料，所以要跑四次迴圈
//   for (let i = 0; i < 4; i++) {
//     // 隨機取得 陣列資料索引位置和資料
//     let dataIndex = getRandom(arr.length);
//     let dataItem = arr[dataIndex];
//     str += `<li class="swiper-slide">
//     <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
//       <a href="./Restaurant.html?id=${dataItem.RestaurantID}">
//         <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}"
//           alt="${dataItem.DescriptionDetail}">
//       </a>
//     </div>
//     <div class="py-1 py-md-2">
//       <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.RestaurantName}</h5>
//       <span class="text-secondary d-flex align-items-center"><img class="me-1"
//           src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
//     </div>
//   </li>`;
//   };
//   // 呈現畫面
//   home_restaurant.innerHTML = str;
// };
// const searchCategory = document.querySelector(".search-category");
// const categoryList = document.querySelector(".spots-categoryList");
// console.log(searchCategory);
// if (categoryList) {
//     categoryList.addEventListener("click", function (e) {
//         e.preventDefault();
//         let category = e.target.closest(".category-card");
//         let categoryVal = e.target.closest("li").dataset.category;
//         searchCategory.value = categoryVal;
//         category.classList.toggle("active");
//     })
// }
"use strict";
"use strict";

// 首頁 - heroBanner 
var swiper_heroBanner = new Swiper(".swiper-heroBanner", {
  cssMode: true,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 首頁 - 熱門打卡景點

var swiper_homeSpots = new Swiper(".swiper-home_scenicSpot", {
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
}); // 首頁 - 一再回訪美食

var swiper_homeRestaurant = new Swiper(".swiper-home_restaurant", {
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
}); // 探索景點 內頁 swiper banner

var swiper_spotsBanner = new Swiper(".swiper-scenicSpot_banner", {
  cssMode: true,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 節慶活動 內頁 swiper banner

var swiper_activityBanner = new Swiper(".swiper-activity_banner", {
  cssMode: true,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 品嘗美食 內頁 swiper banner

var swiper_restaurantBanner = new Swiper(".swiper-restaurant_banner", {
  cssMode: true,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 推薦商品  swiper

var swiper_recommend = new Swiper(".swiper-recommend", {
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

// 漢堡動態效果
// const togglerBurger = document.querySelector('#toggler-burger');
// // 預設是 false 選單關閉，不會出現打 X
// let isMenuOpen = false;
// togglerBurger.addEventListener('click', function (e) {
//     //this 的指向是 togglerBurger 本身 要加上 open 樣式
//     // console.log(this);
//     // 點擊後 選單打開 為true，會出現打 X
//     isMenuOpen = !isMenuOpen;
//     isMenuOpen ? this.classList.add('open') : this.classList.remove('open');
// })
// 動態效果
// jQuery 初始化
$(function () {
  // 漢堡動態效果
  // 漢堡按鈕 綁定事件監聽，點擊後觸發加上切換 .open class功能
  $('#toggler-burger').on('click', function () {
    $(this).toggleClass('open');
  }); // 導覽列滾動效果

  var lastPos = 0;
  $(window).on('scroll', function () {
    var currentPos = window.scrollY; //   往下滑

    if (currentPos > lastPos) {
      $('#navbar-toggle').css('top', '-100px'); //讓navbar消失
    } else {
      $('#navbar-toggle').css('top', '0'); //讓navbar出現
    }

    lastPos = currentPos; //再記住現在位置，跟未來的位置做比較
  }); // goTop 動態效果
  //選擇整個瀏覽器綁定監聽事件，使用 scroll 函式，並下判斷，如果瀏覽器的頂點超過 150x，
  // 如果 .goTop 有 .hide 這個 Class，就執行切換 class，不然就增加 .hide。

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 150) {
      if ($(".goTop").hasClass("hide")) {
        $(".goTop").toggleClass("hide");
      }
    } else {
      $(".goTop").addClass("hide");
    }
  }); //  點擊 goTopBtn 按鈕後，html 與 body 給予動畫效果，並且讓捲軸上方回到 0 的位置，時間為 0.6秒。

  $('#goTopBtn').on('click', function (e) {
    e.preventDefault();
    $('html , body').animate({
      scrollTop: 0
    }, '600');
  });
}); // 亂數產生器函式

function getRandom(num) {
  return Math.floor(Math.random() * num);
}

;
//# sourceMappingURL=all.js.map

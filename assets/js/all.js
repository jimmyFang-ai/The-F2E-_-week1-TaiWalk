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

var apiUrl_scenicSpot = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?&$format=JSON';
var apiUrl_activity = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON';
var apiUrl_restaurant = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON'; // data  資料

var data_activity = [];
var data_scenicSpot = [];
var data_restaurant = []; // 呈現畫面 DOM 

var home_activity = document.querySelector('.home_activity');
var home_scenicSpot = document.querySelector('.home_scenicSpot');
var home_restaurant = document.querySelector('.home_restaurant'); // console.log(home_activity,home_scenicSpot,home_restaurant );
// 初始化

function init() {
  get_activity();
}

init(); // 節慶活動: 取得資料 

function get_activity() {
  axios.get(apiUrl_activity, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    data_activity = response.data; // console.log(data_activity);
    // 將沒有三張圖片的資料都濾掉

    data_activity = data_activity.filter(function (item) {
      return item.Picture.PictureUrl1 !== undefined && item.Picture.PictureUrl2 !== undefined && item.Picture.PictureUrl3 !== undefined;
    }); // console.log(data_activity);
    //呈現畫面

    render_activity(data_activity);
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; // 節慶活動:  呈現畫面

function render_activity(arr) {
  var str = ''; // 隨機抽取四筆資料 呈現在畫面上

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(data_activity.length);
    var dataItem = data_activity[dataIndex]; // 希望撈取的是未來的活動時間?? 

    str += "<div class=\"col mb-2\">\n        <div class=\"card\">\n          <div class=\"row g-0\">\n            <div class=\"col-4 overflow-hidden\">\n              <a class=\"imgWarp\" href=\"./activity.html?id=".concat(dataItem.ActivityID, "\">\n                <img class=\" card-img img-cover\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" alt=\"").concat(dataItem.Description, "\">\n              </a>\n            </div>\n            <div class=\"col-8\">\n              <div class=\"card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5\">\n                <div>\n                  <span class=\"card-text text-secondary fs-xs fs-lg-6\"> ").concat(dataItem.StartTime.slice(0, 10), " - ").concat(dataItem.EndTime.slice(0, 10), "</span>\n                  <h5 class=\"card-title fs-6 fs-lg-xl lh-base fw-bold mb-0 text-truncate\">").concat(dataItem.ActivityName, "</h5>\n                </div>\n                <div class=\"d-flex justify-content-between align-items-center\">\n                  <span class=\"card-text text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                      src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n                  <a class=\"btn  btn-infoBtn   d-none d-md-inline-block shadow-none\" href=\"./activity.html?id=").concat(dataItem.ActivityID, "\"><span\n                      class=\"btn-inner\">\u8A73\u7D30\u4ECB\u7D39 \u276F\n                    </span></a>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>");
  }

  ; // 呈現畫面

  home_activity.innerHTML = str;
}
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

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
} // apiUrl


var apiUrl_activity = "https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?$filter=Picture%2FPictureUrl1%20ne%20null&$format=JSON";
var apiUrl_scenicSpot = "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$filter=Picture%2FPictureUrl1%20ne%20null&%format=JSON";
var apiUrl_restaurant = "https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/?$filter=Picture%2FPictureUrl1%20ne%20null&$format=JSON"; // 初始化

function init() {
  // 首頁- 取得資料
  get_activity();
  get_scenicSpot();
  get_restaurant(); // 探索景點頁面 
  // - 取得景點全部資料

  scenicSpot_getAllData(); // - 取得景點單一資料

  scenicSpot_getInnerData();
}

init(); // 首頁 - 取得資料
// 近期活動

function get_activity() {
  axios.get(apiUrl_activity, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    var data_activity = response.data; //呈現畫面

    if (home_activity) {
      render_activity(data_activity);
    }
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; // 打卡景點

function get_scenicSpot() {
  axios.get(apiUrl_scenicSpot, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    var data_scenicSpot = response.data; //呈現畫面

    if (home_scenicSpot) {
      render_scenicSpot(data_scenicSpot);
    }
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; //餐廳資訊

function get_restaurant() {
  axios.get(apiUrl_restaurant, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    var data_restaurant = response.data;

    if (home_restaurant) {
      //呈現畫面
      render_restaurant(data_restaurant);
    }
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

;
"use strict";

// 首頁 js
// 呈現畫面 DOM 
var home_activity = document.querySelector('.home_activity');
var home_scenicSpot = document.querySelector('.home_scenicSpot');
var home_restaurant = document.querySelector('.home_restaurant'); // 搜尋按鈕

var home_searchBtn = document.querySelector('.search_Btn'); // 首頁- 呈現畫面
//近期活動 

function render_activity(arr) {
  var str = ''; //  取得當前年份和月份
  // 月份是從0開始，所以要加1，才會符合12個月/年

  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear(); // 畫面呈現為四筆資料，所以要跑四次迴圈

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(arr.length);
    var dataItem = arr[dataIndex]; // 取得最近活動還沒結束的時間，落在今年或明年。

    var checkDate = parseInt(dataItem.EndTime.slice(0, 4)) >= year && parseInt(dataItem.EndTime.slice(5, 7)) >= month || parseInt(dataItem.EndTime.slice(0, 4)) > year; // console.log(checkDate);
    // 判斷 如果checkDate 為 false 重跑一次迴圈

    if (checkDate === false) {
      i -= 1;
      continue;
    } else {
      // 為 true 的話就組字串資料
      str += "<div class=\"col mb-2\">\n        <div class=\"card\">\n          <div class=\"row g-0\">\n            <div class=\"col-4 overflow-hidden\">\n            <div class=\"ratio ratio-9x7  ratio-md-1x1\">\n               <a class=\"imgWarp\" href=\"./activity.html?id=".concat(dataItem.ActivityID, "\">\n               <img class=\" card-img img-cover\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" alt=\"").concat(dataItem.Description, "\">\n               </a>\n            </div>\n            </div>\n            <div class=\"col-8\">\n              <div class=\"card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5\">\n                <div>\n                  <span class=\"card-text text-secondary fs-xs fs-lg-6\"> ").concat(dataItem.StartTime.slice(0, 10), " - ").concat(dataItem.EndTime.slice(0, 10), "</span>\n                  <h5 class=\"card-title fs-6 fs-lg-xl lh-base fw-bold mb-0 text-truncate\">").concat(dataItem.ActivityName, "</h5>\n                </div>\n                <div class=\"d-flex justify-content-between align-items-center\">\n                  <span class=\"card-text text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                      src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n                  <a class=\"btn  btn-infoBtn   d-none d-md-inline-block shadow-none\" href=\"./activity.html?id=").concat(dataItem.ActivityID, "\"><span\n                      class=\"btn-inner\">\u8A73\u7D30\u4ECB\u7D39 \u276F\n                    </span></a>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>");
    }
  }

  ; // 呈現畫面

  home_activity.innerHTML = str;
}

; // 打卡景點

function render_scenicSpot(arr) {
  var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(arr.length);
    var dataItem = arr[dataIndex]; // 如果沒縣市名字 就重跑一次迴圈

    if (dataItem.City === undefined) {
      i -= 1;
      continue;
    } else {
      // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      str += "<li class=\"swiper-slide\">\n      <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n        <a href=\"./scenicSpot.html?id=".concat(dataItem.ScenicSpotID, "\">\n          <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n            alt=\"").concat(dataItem.DescriptionDetail, "\">\n        </a>\n      </div>\n      <div class=\"py-1 py-md-2\">\n        <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.ScenicSpotName, "</h5>\n        <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n            src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n      </div>\n    </li>");
    }
  }

  ; // 呈現畫面

  home_scenicSpot.innerHTML = str;
}

; // 餐廳資訊

function render_restaurant(arr) {
  var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(arr.length);
    var dataItem = arr[dataIndex]; // 如果沒縣市名字 就重跑一次迴圈

    if (dataItem.City === undefined) {
      i -= 1;
      continue;
    } else {
      // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      str += "<li class=\"swiper-slide\">\n        <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./Restaurant.html?id=".concat(dataItem.RestaurantID, "\">\n            <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n              alt=\"").concat(dataItem.DescriptionDetail, "\">\n          </a>\n        </div>\n        <div class=\"py-1 py-md-2\">\n          <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.RestaurantName, "</h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n              src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n        </div>\n      </li>");
    }
  }

  ; // 呈現畫面

  home_restaurant.innerHTML = str;
}

; // 首頁 搜尋功能

if (home_searchBtn) {
  home_searchBtn.addEventListener('click', search_keyword);
}

function search_keyword() {
  var search_type = document.querySelector('.search_type');
  var search_keyword = document.querySelector('.search_keyword');

  if (search_keyword.value.trim() !== '') {
    // window.location.href = `./${search_type.value}.html?city=&keyword="+encodeURIComponent(${search_keyword.value.trim()})`;
    window.location.href = "./".concat(search_type.value, ".html?%24filter=contains(keyword%2C'").concat(search_keyword.value.trim(), "')");
  }
}

;
"use strict";

// 取得分頁 DOM 元素
var pagination = document.querySelector('.pagination'); // 分頁功能 - 整體分頁功能

function renderPages(data, nowPage) {
  // 每一頁只顯示36筆資料
  var dataPerPage = 36; // page 按鈕總數量公式: 資料數量總額 / 每一頁要顯示的資料數量
  // 因為計算過程會有餘數產生，所以要無條件進位，使用 Math.ceil()函式取得一個大於等於指定數字的最小整數。

  var totalPages = Math.ceil(data.length / dataPerPage); // 頁數
  // 當前頁數，對應現在當前頁數

  var currentPage = nowPage; // 當 "當前頁數" 比 "總頁數" 大的時候， "當前頁數" 等於 "總頁數"

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  ; // 資料筆數

  var minData = currentPage * dataPerPage - dataPerPage + 1; // 最小資料筆數

  var maxData = currentPage * dataPerPage; // 最大資料筆數
  // 取出當前頁數的資料

  var currentPageData = []; // // 取得 data 資料的索引位置

  data.forEach(function (item, index) {
    //取得 data 索引位置，因為索引是從 0 開始，所以要 +1
    //當 index+1 比 minData 大且又小於 maxData 就push 進去 currentPageData 陣列
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentPageData.push(item);
    }

    ;
  }); // 物件方式傳遞資料

  var pageInfo = {
    totalPages: totalPages,
    currentPage: currentPage,
    hasPage: currentPage > 1,
    hasNext: currentPage < totalPages
  }; // 呈現出該頁資料

  scenicSpot_renderResult(currentPageData); // 呈現出分頁按鈕

  renderPageBtn(pageInfo);
  console.log("\u5168\u90E8\u8CC7\u6599:".concat(data.length, " \u6BCF\u4E00\u9801\u986F\u793A:").concat(dataPerPage, "\u7B46 \u7E3D\u9801\u6578:").concat(totalPages));
}

; // 分頁功能 - 渲染分頁按鈕

function renderPageBtn(pageInfo) {
  var str = "";
  var totalPages = pageInfo.totalPages; // 判斷 總頁數是否大於 1 頁

  if (totalPages > 1) {
    //點選上一頁
    str += pageInfo.hasPage ? "<li class=\"page-item\"><a class=\"page-link\" href=\"#\"  data-page=\"".concat(Number(pageInfo.currentPage) - 1, "\">&laquo;</a></li>") : "<li class=\"page-item disabled\"><span class=\"page-link\">&laquo;</span></li>"; // 點選頁數

    for (var i = 1; i <= totalPages; i++) {
      // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
      str += Number(pageInfo.currentPage) === i ? "<li class=\"page-item active\"><a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(i, "\">").concat(i, "</a></li>") : "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a></li>");
    }

    ; // 點選下一頁

    str += pageInfo.hasNext ? "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfo.currentPage) + 1, "\">&raquo;</a></li>") : "<li class=\"page-item disabled\"><span class=\"page-link\" >&raquo;</span></li>";
  } else {
    //總頁數小於 1 頁，只顯示分頁按鈕
    for (var _i = 1; _i <= totalPages; _i++) {
      // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
      str += Number(pageInfo.currentPage) === _i ? "<li class=\"page-item active\"><a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(_i, "\">").concat(_i, "</a></li>") : "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" data-page=\"".concat(_i, "\">").concat(_i, "</a></li>");
    }

    ;
  }

  ;
  pagination.innerHTML = str;
}

; // 在 pagination 綁定監聽

if (pagination !== null) {
  pagination.addEventListener('click', switchPage);
}

; //分頁功能 - 點擊按鈕切換頁面功能

function switchPage(e) {
  e.preventDefault();

  if (e.target.nodeName !== 'A') {
    return;
  }

  ;
  var clickPage = e.target.dataset.page;
  renderPages(data_filterResult, clickPage);
}

;
"use strict";

// 主要區塊 DOM 
var scenicSpot_themeArea = document.querySelector('.scenicSpot-themeArea');
var scenicSpot_categoryInner = document.querySelector('.scenicSpot-categoryInner');
var scenicSpot_searchResult = document.querySelector('.scenicSpot-searchResult'); // 搜尋欄位 DOM

var search_city = document.querySelector('.search-city');
var search_category = document.querySelector('.search-category');
var search_keyword = document.querySelector('.search-keyword');
var scenicSpot_searchBtn = document.querySelector('.scenicSpot_searchBtn'); // 呈現畫面列表 DOM

var scenicSpot_categoryList = document.querySelector('.scenicSpot-categoryList');
var scenicSpot_resultList = document.querySelector('.scenicSpot-resultList');
var search_ResultNum = document.querySelector('.search_ResultNum'); // 資料 - 探索景點頁面 

var data_scenicSpot = []; // 資料 - 篩選類別資料

var data_filterResult = []; // 探索景點 - 取得景點全部資料

function scenicSpot_getAllData() {
  axios.get(apiUrl_scenicSpot, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    // 回傳的資料
    var thisData = response.data; // 過濾資料 排除沒有圖片、景點名字、城市

    thisData.forEach(function (item) {
      if (item.Picture.PictureUrl1 && item.ScenicSpotName && item.City) {
        data_scenicSpot.push(item);
      }
    });
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; // 探索景點 - 切換類別樣式 & 取值

if (scenicSpot_categoryList) {
  scenicSpot_categoryList.addEventListener('click', scenicSpot_changeCategory);
}

;

function scenicSpot_changeCategory(e) {
  e.preventDefault(); // 取出 卡片類片 的 DOM 和 值

  var category_card = e.target.closest(".category-card");
  var categoryVal = e.target.closest("li").dataset.category; // 切換 卡片類片 active

  var category_allCard = document.querySelectorAll('.category-card');
  category_allCard.forEach(function (item) {
    // 先移除全部 acitve
    item.classList.remove("active");
  }); // 在透過被點擊到的卡片加上 acitve

  category_card.classList.add("active"); // 取出 卡片類別的值與 搜尋欄位的值連動

  search_category.value = categoryVal;
  scenicSpot_updateResult(categoryVal);
}

; // 探索景點 - 更新類別篩選結果

function scenicSpot_updateResult(categoryVal) {
  var category_resultList = data_scenicSpot.filter(function (item) {
    return item.Class1 === categoryVal;
  });
  data_filterResult = category_resultList; //資料回傳 寫入分頁函式

  renderPages(data_filterResult, 1); // 呈現結果數字

  search_ResultNum.textContent = data_filterResult.length;
}

; // 探索景點 - 搜尋功能 & 關鍵字

if (scenicSpot_searchBtn) {
  scenicSpot_searchBtn.addEventListener('click', search_scenicSpot);
}

;

function search_scenicSpot(e) {
  //  城市
  var city = search_city.value; //  類別

  var category = search_category.value; //  關鍵字

  var keyword = search_keyword.value.trim(); // 搜尋結果 

  var search_scenicSpotList = data_scenicSpot.filter(function (item) {
    return item.City === city && item.Class1 === category && item.ScenicSpotName.match(keyword);
  });
  scenicSpot_renderResult(search_scenicSpotList);
  renderPages(search_scenicSpotList, 1); // 呈現結果數字

  search_ResultNum.textContent = search_scenicSpotList.length;
}

; // 探索景點 - 呈現類別篩選結果

function scenicSpot_renderResult(arr) {
  var str = ''; // 如果有資料就顯示 類別篩選結果區塊

  if (arr.length) {
    arr.forEach(function (item) {
      str += "\n      <li class=\"col mb-2 mb-md-4\">\n      <div class=\"resultList-card border-0\">\n          <div class=\"ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden\">\n              <a href=\"./scenicSpot.html?id=".concat(item.ScenicSpotID, "\">\n                  <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(item.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                      alt=\"").concat(item.DescriptionDetail, "\">\n              </a>\n          </div>\n          <div class=\"py-1 py-md-2\">\n              <h5 class=\"card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1\">").concat(item.ScenicSpotName, "\n              </h5>\n              <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                      src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(item.City, "</span>\n          </div>\n      </div>\n  </li>");
    });
    scenicSpot_searchResult.classList.remove('d-none');
  }

  ; // 呈現結果畫面

  scenicSpot_resultList.innerHTML = str;
}

; // 探索景點 - 取得景點單一資料

function scenicSpot_getInnerData() {
  // if (targetId === undefined) return;
  // 取得單一資料 id
  var targetId = location.href.split('=')[1];
  console.log(targetId); // 發送請求，篩選 ScenicSpotID 與 id 符合的資料

  axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotID%2C'".concat(targetId, "')&%24top=30&%24format=JSON"), {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    // 回傳的資料
    var thisData = response.data[0];
    console.log(thisData); // 呈現 內頁資料內容

    scenicSpot_renderInner(thisData); // 隱藏 探索景點主要內容

    scenicSpot_themeArea.classList.add('d-none');
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}

; // 探索景點 - 內頁資料內容

function scenicSpot_renderInner(data) {
  // 麵包削列表
  var breadcrumb_theme = document.querySelector('.breadcrumb-theme');
  var breadcrumb_city = document.querySelector('.breadcrumb-city');
  var breadcrumb_location = document.querySelector('.breadcrumb-location');
  breadcrumb_theme.classList.remove('text-secondary');
  breadcrumb_theme.classList.add('text-primary');
  breadcrumb_location.classList.add('text-secondary');
  breadcrumb_city.textContent = "/ ".concat(data.City);
  breadcrumb_location.textContent = " / ".concat(data.ScenicSpotName);
}
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

"use strict";

// // PTX api  header 驗證
// function getAuthorizationHeader() {
//   //  填入自己 ID、KEY 開始
//   // let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
//   // let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
//   let AppID = 'pi20120413-51900829-226c-41ea';
//   let AppKey = 'beeda1e6-f94e-4b14-b9d4-98e7c6e2669f';
//   //  填入自己 ID、KEY 結束
//   let GMTString = new Date().toGMTString();
//   let ShaObj = new jsSHA('SHA-1', 'TEXT');
//   ShaObj.setHMACKey(AppKey, 'TEXT');
//   ShaObj.update('x-date: ' + GMTString);
//   let HMAC = ShaObj.getHMAC('B64');
//   let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
//   return { 'Authorization': Authorization, 'X-Date': GMTString };
// }
// jQuery 初始化
$(function () {
  // 取得 TDX api  header 驗證
  getAuthorizationHeader(); // 取得 網址參數

  getParameters(); // 首頁- 取得資料

  get_activity();
  get_scenicSpot();
  get_restaurant(); // 探索景點頁面
  // - 取得景點全部資料

  scenicSpot_getAllData();
}); // baseUrl

var baseUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism"; // apiUrl

var apiUrl_activity = "".concat(baseUrl, "/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON");
var apiUrl_scenicSpot = "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON");
var apiUrl_restaurant = "".concat(baseUrl, "/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"); // jQuery  取得 TDX api  header 驗證

function getAuthorizationHeader() {
  var parameter = {
    grant_type: "client_credentials",
    client_id: "pi20120413-51900829-226c-41ea",
    client_secret: "cbff89f1-e9e0-4dad-bb3b-1503012fb83d"
  };
  var auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
  $.ajax({
    type: "POST",
    url: auth_url,
    crossDomain: true,
    dataType: 'JSON',
    data: parameter,
    async: false,
    success: function success(data) {
      var access_token = JSON.stringify(data.access_token);
      var expires_in = JSON.stringify(data.expires_in); // 存取 token 

      var token = document.cookie = "tourToken=".concat(access_token, "; expires=").concat(new Date(expires_in), "; path=/");
    },
    error: function error(xhr, textStatus, thrownError) {
      console.log('errorStatus:', textStatus);
      console.log('Error:', thrownError);
    }
  });
}
"use strict";

// 首頁 js
// 呈現畫面 DOM 
var home_activity = document.querySelector('.home_activity');
var home_scenicSpot = document.querySelector('.home_scenicSpot');
var home_restaurant = document.querySelector('.home_restaurant'); // 搜尋按鈕

var home_searchBtn = document.querySelector('.search_btn'); // 首頁 - 取得資料
// 近期活動

function get_activity() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var data_activity = data; // console.log('data', data_activity);
        //呈現畫面

        if (home_activity) {
          render_activity(data_activity);
        }
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 打卡景點

function get_scenicSpot() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var data_scenicSpot = data; // console.log('data', data_scenicSpot);
        // 呈現畫面

        if (home_scenicSpot) {
          render_scenicSpot(data_scenicSpot);
        }
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; //餐廳資訊

function get_restaurant() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var data_restaurant = data; // console.log('data', data_restaurant);
        //呈現畫面

        if (home_restaurant) {
          render_restaurant(data_restaurant);
        }
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 首頁- 呈現畫面
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
      str += "<div class=\"col mb-2\">\n          <div class=\"card\">\n            <div class=\"row g-0\">\n              <div class=\"col-4 overflow-hidden\">\n              <div class=\"ratio ratio-9x7  ratio-md-1x1\">\n                 <a class=\"imgWarp\" href=\"./activity.html?id=".concat(dataItem.ActivityID, "\">\n                 <img class=\" card-img img-cover\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" alt=\"").concat(dataItem.Description, "\">\n                 </a>\n              </div>\n              </div>\n              <div class=\"col-8\">\n                <div class=\"card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5\">\n                  <div>\n                    <span class=\"card-text text-secondary fs-xs fs-lg-6\"> ").concat(dataItem.StartTime.slice(0, 10), " - ").concat(dataItem.EndTime.slice(0, 10), "</span>\n                    <h5 class=\"card-title fs-6 fs-lg-xl lh-base fw-bold mb-0 text-truncate\">").concat(dataItem.ActivityName, "</h5>\n                  </div>\n                  <div class=\"d-flex justify-content-between align-items-center\">\n                    <span class=\"card-text text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                        src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n                    <a class=\"btn  btn-infoBtn   d-none d-md-inline-block shadow-none\" href=\"./activity.html?id=").concat(dataItem.ActivityID, "\"><span\n                        class=\"btn-inner\">\u8A73\u7D30\u4ECB\u7D39 \u276F\n                      </span></a>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>");
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
      str += "<li class=\"swiper-slide\">\n        <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./scenicSpot.html?id=".concat(dataItem.ScenicSpotID, "\">\n            <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n              alt=\"").concat(dataItem.DescriptionDetail, "\">\n          </a>\n        </div>\n        <div class=\"py-1 py-md-2\">\n          <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.ScenicSpotName, "</h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n              src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n        </div>\n      </li>");
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
      str += "<li class=\"swiper-slide\">\n          <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n            <a href=\"./restaurant.html?id=".concat(dataItem.RestaurantID, "\">\n              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                alt=\"").concat(dataItem.DescriptionDetail, "\">\n            </a>\n          </div>\n          <div class=\"py-1 py-md-2\">\n            <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.RestaurantName, "</h5>\n            <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n          </div>\n        </li>");
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
  var search_keyword = document.querySelector('.search_keyword'); // encodeURIComponent  將 網址參數 中文 編碼成 '%E8%8A%B1'
  //   console.log(encodeURIComponent('花'));
  // decodeURIComponent =  將 網址參數 '%E8%8A%B1' 編碼成中文
  //   console.log(decodeURIComponent('%E8%8A%B1'));

  var encodedStr = encodeURIComponent(search_keyword.value.trim());

  if (search_keyword.value.trim() !== '') {
    window.location.href = "./".concat(search_type.value, ".html?city=\u5168\u90E8\u7E23\u5E02&keyword=").concat(encodedStr);
  }
}

;
//   --------- 篩選類別後，顯示資料分頁 切換會壞掉  ---------
// // 取得分頁 DOM 元素
// const pagination = document.querySelector('.pagination');
// // 分頁功能 - 整體分頁功能
// function renderPages(data, nowPage) {
//     // 每一頁只顯示36筆資料
//     let dataPerPage =  36;
//     // page 按鈕總數量公式: 資料數量總額 / 每一頁要顯示的資料數量
//     // 因為計算過程會有餘數產生，所以要無條件進位，使用 Math.ceil()函式取得一個大於等於指定數字的最小整數。
//     const totalPages = Math.ceil(data.length / dataPerPage);
//     // 頁數
//     // 當前頁數，對應現在當前頁數
//     let currentPage = nowPage;
//     // 當 "當前頁數" 比 "總頁數" 大的時候， "當前頁數" 等於 "總頁數"
//     if (currentPage > totalPages) {
//         currentPage = totalPages;
//     };
//     // 資料筆數
//     const minData = (currentPage * dataPerPage) - dataPerPage + 1; // 最小資料筆數
//     const maxData = (currentPage * dataPerPage);  // 最大資料筆數
//     // 取出當前頁數的資料
//     const currentPageData = [];
//     // // 取得 data 資料的索引位置
//     data.forEach((item, index) => {
//         //取得 data 索引位置，因為索引是從 0 開始，所以要 +1
//         //當 index+1 比 minData 大且又小於 maxData 就push 進去 currentPageData 陣列
//         if (index + 1 >= minData && index + 1 <= maxData) {
//             currentPageData.push(item);
//         };
//     });
//     // 物件方式傳遞資料
//     const pageInfo = {
//         totalPages,
//         currentPage,
//         hasPage: currentPage > 1,
//         hasNext: currentPage < totalPages,
//     };
//     // 呈現出該頁資料
//     scenicSpot_renderResult(currentPageData);
//     // 呈現出分頁按鈕
//     renderPageBtn(pageInfo);
//     console.log(`全部資料:${data.length} 每一頁顯示:${dataPerPage}筆 總頁數:${totalPages}`);
// };
// // 分頁功能 - 渲染分頁按鈕
// function renderPageBtn(pageInfo) {
//     let str = "";
//     const totalPages = pageInfo.totalPages;
//     // 判斷 總頁數是否大於 1 頁
//     if (totalPages > 1) {
//         //點選上一頁
//         str += (pageInfo.hasPage) ?
//             `<li class="page-item"><a class="page-link" href="#"  data-page="${Number(pageInfo.currentPage) - 1}">&laquo;</a></li>`
//             : `<li class="page-item disabled"><span class="page-link">&laquo;</span></li>`;
//         // 點選頁數
//         for (let i = 1; i <= totalPages; i++) {
//             // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
//             str += (Number(pageInfo.currentPage) === i) ?
//                 `<li class="page-item active"><a class="page-link" href="#" aria-label="Previous" data-page="${i}">${i}</a></li>`
//                 : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
//         };
//         // 點選下一頁
//         str += (pageInfo.hasNext) ?
//             `<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-page="${Number(pageInfo.currentPage) + 1}">&raquo;</a></li>`
//             : `<li class="page-item disabled"><span class="page-link" >&raquo;</span></li>`;
//     } else {
//         //總頁數小於 1 頁，只顯示分頁按鈕
//         for (let i = 1; i <= totalPages; i++) {
//             // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
//             str += (Number(pageInfo.currentPage) === i) ?
//                 `<li class="page-item active"><a class="page-link" href="#" aria-label="Previous" data-page="${i}">${i}</a></li>`
//                 : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
//         };
//     };
//     pagination.innerHTML = str;
// };
// // 在 pagination 綁定監聽
// if (pagination !== null) {
//     pagination.addEventListener('click', switchPage);
// };
// console.log(pagination);
// //分頁功能 - 點擊按鈕切換頁面功能
// function switchPage(e) {
//     e.preventDefault();
//     if (e.target.nodeName !== 'A') {
//         return;
//     };
//     const clickPage = e.target.dataset.page;
//     renderPages(data_filterResult, clickPage);
// };
"use strict";
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
var search_resultNum = document.querySelector('.search_resultNum'); //     - 麵包削列表

var scenicSpot_breadcrumb = document.querySelector('.scenicSpot-breadcrumb'); //  呈現景點內頁畫面 DOM
//    - swiper-banner

var scenicSpotInner_bannerSlides = document.querySelectorAll('.swiper-scenicSpot-banner .swiper-slide');
var scenicSpotInner_bannerBullets = document.querySelector('.swiper-pagination-bullets'); //    - 景點內容

var scenicSpotInner_mame = document.querySelector('.scenicSpot_mame');
var scenicSpotInner_category = document.querySelector('.scenicSpot_category');
var scenicSpotInner_description = document.querySelector('.scenicSpot_description');
var scenicSpotInner_opentTime = document.querySelector('.scenicSpot_opentTime');
var scenicSpotInner_phone = document.querySelector('.scenicSpot_phone');
var scenicSpotInner_address = document.querySelector('.scenicSpot_address');
var scenicSpotInner_websiteUrl = document.querySelector('.scenicSpot_websiteUrl');
var scenicSpotInner_ticketInfo = document.querySelector('.scenicSpot_ticketInfo');
var scenicSpotInner_remarks = document.querySelector('.scenicSpot_remarks');
var scenicSpotInner_map = document.querySelector('.scenicSpot_map'); //    - 推薦景點

var scenicSpotInner_recommend = document.querySelector('.recommend_scenicSpot'); // 資料 - 探索景點頁面 

var data_scenicSpot = []; // 資料 - 篩選類別資料

var data_filterResult = []; // 探索景點 - 取得景點全部資料

function scenicSpot_getAllData() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        data_scenicSpot = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1;
        });
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
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

  category_card.classList.add("active"); // 更新類別篩選結果

  scenicSpot_updateResult(categoryVal);
}

; // 探索景點 - 更新類別篩選結果

function scenicSpot_updateResult(categoryVal) {
  console.log(categoryVal);
  var category_resultList = data_scenicSpot.filter(function (item) {
    return item.Class1 === categoryVal;
  });
  data_filterResult = category_resultList; //資料回傳 寫入分頁函式

  renderPages(data_filterResult, 1); // 呈現結果數字

  search_resultNum.textContent = data_filterResult.length; // 更改 麵包削狀態

  scenicSpot_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme\" href=\"./scenicSpot.html\">\u63A2\u7D22\u666F\u9EDE</a> /\n    <a class=\"breadcrumb-category text-secondary\" href=\"#\">".concat(categoryVal, "</a>");
}

; // 探索景點 - 呈現篩選結果

function scenicSpot_renderResult(arr) {
  var str = ''; // 如果有資料就顯示 類別篩選結果區塊

  if (!arr.length) {
    str += "<div class=\"text-center\">\n    <img src=\"./assets/images/nofound80.png\" alt=\"\u627E\u4E0D\u5230\u8CC7\u6599\">\n    <p class=\"text-primary fw-bold\">\u76EE\u524D\u67E5\u7121\u8CC7\u6599<br>\u8ACB\u91CD\u65B0\u641C\u5C0B</p>\n    </div>";
  } else {
    arr.forEach(function (item) {
      str += "\n    <div class=\"col-12 col-md-4 col-lg-3 mb-2 mb-md-4\">\n    <div class=\"resultList-card border-0\">\n      <div class=\"ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./scenicSpot.html?id=".concat(item.ScenicSpotID, "\">\n              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(item.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                  alt=\"").concat(item.DescriptionDetail, "\">\n          </a>\n      </div>\n      <div class=\"py-1 py-md-2\">\n          <h5 class=\"card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1\">").concat(item.ScenicSpotName, "\n          </h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                  src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(item.City, "</span>\n      </div>\n    </div>\n   </div>");
    });
  } // 切換模式  隱藏 → 顯示


  scenicSpot_searchResult.classList.toggle('d-none'); // 切換模式  顯示 → 隱藏

  scenicSpot_themeArea.classList.toggle('d-none'); // 呈現結果畫面

  scenicSpot_resultList.innerHTML = str;
}

; // 探索景點 - 搜尋功能 & 關鍵字

if (scenicSpot_searchBtn) {
  scenicSpot_searchBtn.addEventListener('click', function (e) {
    var city = search_city.value;
    var keyword = search_keyword.value;

    if (keyword.trim() !== '') {
      search_scenicSpot(city, keyword);
    }
  });
}

;

function search_scenicSpot(city, keyword) {
  console.log(city, keyword); // 取得 token

  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        thisData = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1;
        });
        console.log('data', thisData); // 篩選結果資料

        var resurltData = []; // 如果 city 的值是全部縣市的，把keyword符合的資料篩選出來

        if (city === '全部縣市') {
          resurltData = thisData.filter(function (item) {
            return item.ScenicSpotName.match(keyword);
          });
          console.log(resurltData);
        } else {
          // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
          resurltData = thisData.filter(function (item) {
            return item.City === city && item.ScenicSpotName.match(keyword);
          });
          console.log(resurltData);
        } //   呈現篩選結果


        scenicSpot_renderResult(resurltData); // 呈現結果數字

        search_resultNum.textContent = resurltData.length;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 探索景點內頁 - 取得景點單一資料

function scenicSpotInner_getData(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=contains%28ScenicSpotID%20%20%2C%20%27").concat(targetId, "%27%29&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data[0];
        console.log('data', thisData); //呈現 內頁資料內容

        scenicSpotInner_renderData(thisData); //呈現 推薦列表

        scenicSpotInner_renderRecommend(targetId); // 隱藏 探索景點主要內容

        scenicSpot_themeArea.classList.add('d-none'); // 顯示 內頁內容

        scenicSpot_categoryInner.classList.toggle('d-none');
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 探索景點內頁 -  呈現 內頁資料內容

function scenicSpotInner_renderData(data) {
  // 計算 banner 圖片數量
  var bannerPhoto_num = 0; // banner 圖片
  // 第一張圖片

  if (data.Picture.PictureUrl1) {
    scenicSpotInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl1, "\"  alt=\"").concat(data.Picture.PictureDescription1, "\">");
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"./assets/images/NoImage-345x160.png\" alt=\"NoImage\">";
    bannerPhoto_num++;
  }

  ; // 第二章圖片

  if (data.Picture.PictureUrl2) {
    scenicSpotInner_bannerSlides[1].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl2, "\" alt=\"").concat(data.Picture.PictureDescription2, "\">");
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[1].remove();
    scenicSpotInner_bannerBullets.classList.add('d-none');
  }

  ; // 第三張圖片

  if (data.Picture.PictureUrl3) {
    scenicSpotInner_bannerSlides[2].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl3, "\" alt=\"").concat(data.Picture.PictureDescription3, "\">");
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[2].remove();
    scenicSpotInner_bannerBullets.classList.add('d-none');
  }

  ; // 圖片少於一張或剛好一張，把導覽方向鍵取消

  if (bannerPhoto_num <= 1) {
    document.querySelector('.swiper-button-next').classList.add('d-md-none');
    document.querySelector('.swiper-button-prev').classList.add('d-md-none');
  } // 麵包削


  scenicSpot_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme\" href=\"./scenicSpot.html\">\u63A2\u7D22\u666F\u9EDE</a> /\n    <a class=\"breadcrumb-city\" href=\"#\">".concat(data.City, "</a> /\n    <a class=\"breadcrumb-location text-secondary\" href=\"#\">").concat(data.ScenicSpotName, "</a>"); // 景點名字

  scenicSpotInner_mame.textContent = data.ScenicSpotName; // 景點類別

  scenicSpotInner_category.textContent = data.Class1; // 景點介紹

  scenicSpotInner_description.textContent = data.DescriptionDetail; // 景點開放時間

  scenicSpotInner_opentTime.textContent = data.OpenTime; // 景點電話

  scenicSpotInner_phone.setAttribute('href', 'tel:' + data.Phone);
  scenicSpotInner_phone.textContent = data.Phone; // 景點地址

  scenicSpotInner_address.textContent = data.Address; // 景點網址

  scenicSpotInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
  scenicSpotInner_websiteUrl.textContent = data.WebsiteUrl; // 景點售票資訊

  scenicSpotInner_ticketInfo.textContent = data.TicketInfo; // 景點注意事項

  scenicSpotInner_remarks.textContent = data.Remarks; // 景點地圖

  scenicSpotInner_map.innerHTML = "<iframe class=\"rounded-4\"\n  src=\"https://www.google.com/maps?q=".concat(data.Address, "(").concat(data.ScenicSpotName, ")&hl=zh-TW&z=15&t=&output=embed\"\n  width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"\n  referrerpolicy=\"no-referrer-when-downgrade\"></iframe>"); // 如果資料的資訊是空的，就顯示無的狀態

  if (!data.TicketInfo) {
    scenicSpotInner_ticketInfo.textContent = '無';
  }

  ;

  if (!data.Remarks) {
    scenicSpotInner_remarks.textContent = '無';
  }

  ;

  if (!data.WebsiteUrl) {
    scenicSpotInner_websiteUrl.textContent = '無';
    scenicSpotInner_websiteUrl.classList.add('text-dark');
    scenicSpotInner_websiteUrl.classList.remove('text-info');
    scenicSpotInner_websiteUrl.classList.toggle('text-decoration-underline');
  }

  ;
} //探索景點內頁 - 呈現推薦列表


function scenicSpotInner_renderRecommend(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=ScenicSpotID%20%20ne%20%27").concat(targetId, "%27&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾 沒有 景點名稱、圖片、城市、類別的資料

        thisData = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1 && item.Picture.PictureUrl1;
        }); // 組字串資料

        var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

        for (var i = 0; i < 4; i++) {
          // 隨機取得 陣列資料索引位置和資料
          var dataIndex = getRandom(thisData.length);
          var dataItem = thisData[dataIndex]; // 如果與內頁 id 是一樣的話，就重跑一次迴圈

          if (dataItem.ScenicSpotID === id) {
            i -= 1;
            continue;
          } else {
            // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
            str += "<li class=\"swiper-slide\">\n                          <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n                            <a href=\"./scenicSpot.html?id=".concat(dataItem.ScenicSpotID, "\">\n                              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                                alt=\"").concat(dataItem.DescriptionDetail, "\">\n                            </a>\n                          </div>\n                          <div class=\"py-1 py-md-2\">\n                            <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.ScenicSpotName, "</h5>\n                            <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                                src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n                          </div>\n                        </li>");
          }
        }

        ; // 呈現在 景點內頁推薦列表

        scenicSpotInner_recommend.innerHTML = str;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 判斷網頁跳轉 路徑狀態

function getParameters() {
  if (location.search) {
    var id;
    var city;
    var keyword; //將url  從 '?' 分切成兩部分，

    var searchUrl = location.search.split('?');
    console.log(searchUrl); //  如果取得參數是沒有 '&'的多個參數的話，就取得 id的值，並顯示資料內頁

    if (!searchUrl[1].includes('&')) {
      // 取得 路徑 id
      id = searchUrl[1].split('=')[1]; // 呈現 資料內頁

      scenicSpotInner_getData(id);
    } else {
      // 如果取得參數是有 '&' 做連接 city 和 keyword的話，就顯示搜尋結果列表
      var parameters = searchUrl[1].split('&');
      console.log(parameters); // 跑 forEach 取出 參數的 city 和 key 的值

      parameters.forEach(function (parameter, index) {
        if (parameters[index].split('=')[0] === 'city') {
          // 取出 city 的值  並解碼
          city = decodeURIComponent(parameters[index].split('=')[1]);
        } else if (parameters[index].split('=')[0] === 'keyword') {
          // 取出 keywodr 的值 並解碼
          keyword = decodeURIComponent(parameters[index].split('=')[1]);
        }

        ;
      }); // 呈現 探索景點   搜尋結果列表

      search_scenicSpot(city, keyword);
    }
  }
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

var swiper_homeSpots = new Swiper(".swiper-home-scenicSpot", {
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

var swiper_homeRestaurant = new Swiper(".swiper-home-restaurant", {
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

var swiper_spotsBanner = new Swiper(".swiper-scenicSpot-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 節慶活動 內頁 swiper banner

var swiper_activityBanner = new Swiper(".swiper-activity-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 品嘗美食 內頁 swiper banner

var swiper_restaurantBanner = new Swiper(".swiper-restaurant-banner", {
  cssMode: true,
  slidesPerView: 1,
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


// 主要區塊 DOM 
const scenicSpot_themeArea = document.querySelector('.scenicSpot-themeArea');
const scenicSpot_categoryInner = document.querySelector('.scenicSpot-categoryInner');
const scenicSpot_searchResult = document.querySelector('.scenicSpot-searchResult');


// 搜尋欄位 DOM
const search_city = document.querySelector('.search-city');
const search_category = document.querySelector('.search-category');
const search_keyword = document.querySelector('.search-keyword');
const scenicSpot_searchBtn = document.querySelector('.scenicSpot_searchBtn');


// 呈現畫面列表 DOM
const scenicSpot_categoryList = document.querySelector('.scenicSpot-categoryList');
const scenicSpot_resultList = document.querySelector('.scenicSpot-resultList');
const search_resultNum = document.querySelector('.search_resultNum');
//     - 麵包削列表
const breadcrumb_theme = document.querySelector('.breadcrumb-theme');
const breadcrumb_city = document.querySelector('.breadcrumb-city');
const breadcrumb_location = document.querySelector('.breadcrumb-location');
//    - swiper-banner
const scenicSpotInner_bannerSlides = document.querySelectorAll('.swiper-scenicSpot-banner .swiper-slide');
const scenicSpotInner_bannerBullets = document.querySelector('.swiper-pagination-bullets');
//    - 景點內頁資訊
const scenicSpotInner_mame = document.querySelector('.scenicSpot_mame');
const scenicSpotInner_category = document.querySelector('.scenicSpot_category');
const scenicSpotInner_description = document.querySelector('.scenicSpot_description');
const scenicSpotInner_opentTime = document.querySelector('.scenicSpot_opentTime');
const scenicSpotInner_phone = document.querySelector('.scenicSpot_phone');
const scenicSpotInner_address = document.querySelector('.scenicSpot_address');
const scenicSpotInner_websiteUrl = document.querySelector('.scenicSpot_websiteUrl');
const scenicSpotInner_ticketInfo = document.querySelector('.scenicSpot_ticketInfo');
const scenicSpotInner_remarks = document.querySelector('.scenicSpot_remarks');
const scenicSpotInner_map = document.querySelector('.scenicSpot_map');





// 資料 - 探索景點頁面 
let data_scenicSpot = [];

// 資料 - 篩選類別資料
let data_filterResult = [];



// 探索景點 - 取得景點全部資料
function scenicSpot_getAllData() {
  axios.get(apiUrl_scenicSpot,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      // 回傳的資料
      const thisData = response.data;

      // 過濾資料 排除沒有圖片、景點名字、城市
      thisData.forEach((item) => {
        if (item.Picture.PictureUrl1 && item.ScenicSpotName && item.City) {
          data_scenicSpot.push(item);
        }
      });

    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};


// 探索景點 - 切換類別樣式 & 取值
if (scenicSpot_categoryList) {
  scenicSpot_categoryList.addEventListener('click', scenicSpot_changeCategory);
};

function scenicSpot_changeCategory(e) {
  e.preventDefault();

  // 取出 卡片類片 的 DOM 和 值
  let category_card = e.target.closest(".category-card");
  let categoryVal = e.target.closest("li").dataset.category;


  // 切換 卡片類片 active
  let category_allCard = document.querySelectorAll('.category-card');
  category_allCard.forEach((item) => {
    // 先移除全部 acitve
    item.classList.remove("active");
  })
  // 在透過被點擊到的卡片加上 acitve
  category_card.classList.add("active");

  // 取出 卡片類別的值與 搜尋欄位的值連動
  search_category.value = categoryVal;

  scenicSpot_updateResult(categoryVal);
};


// 探索景點 - 更新類別篩選結果
function scenicSpot_updateResult(categoryVal) {

  let category_resultList = data_scenicSpot.filter((item) => item.Class1 === categoryVal);

  data_filterResult = category_resultList;

  //資料回傳 寫入分頁函式
  renderPages(data_filterResult, 1);


  // 呈現結果數字
  search_resultNum.textContent = data_filterResult.length;
};


// 探索景點 - 搜尋功能 & 關鍵字
if (scenicSpot_searchBtn) {
  scenicSpot_searchBtn.addEventListener('click', search_scenicSpot);
};

function search_scenicSpot(e) {
  //  城市
  const city = search_city.value;
  //  類別
  const category = search_category.value;
  //  關鍵字
  const keyword = search_keyword.value.trim();


  // 搜尋結果 
  let search_scenicSpotList = data_scenicSpot.filter((item) => {
    return item.City === city && item.Class1 === category && item.ScenicSpotName.match(keyword);
  });


  scenicSpot_renderResult(search_scenicSpotList);

  renderPages(search_scenicSpotList, 1);


  // 呈現結果數字
  search_resultNum.textContent = search_scenicSpotList.length;
};


// 探索景點 - 呈現類別篩選結果
function scenicSpot_renderResult(arr) {

  let str = '';

  // 如果有資料就顯示 類別篩選結果區塊
  if (arr.length) {
    arr.forEach((item) => {
      str += `
      <li class="col mb-2 mb-md-4">
      <div class="resultList-card border-0">
          <div class="ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden">
              <a href="./scenicSpot.html?id=${item.ScenicSpotID}">
                  <img class="w-100 h-100 img-cover zoomImg" src="${item.Picture.PictureUrl1}" onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                      alt="${item.DescriptionDetail}">
              </a>
          </div>
          <div class="py-1 py-md-2">
              <h5 class="card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1">${item.ScenicSpotName}
              </h5>
              <span class="text-secondary d-flex align-items-center"><img class="me-1"
                      src="./assets/images/spot16.png" alt="spot">${item.City}</span>
          </div>
      </div>
  </li>`;
    });

    scenicSpot_searchResult.classList.remove('d-none');
  };


  // 呈現結果畫面
  scenicSpot_resultList.innerHTML = str;
};



// 探索景點 - 取得景點單一資料
function scenicSpot_getInnerData() {

  // 取得單一資料 id
  const targetId = location.href.split('=')[1];

  // 如果 單一資料 id 不是 undefined 就發送請求取得資料
  if (targetId !== undefined) {
    // 發送請求，篩選 ScenicSpotID 與 id 符合的資料
    axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotID%2C'${targetId}')&%24top=30&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        // 回傳的資料
        const thisData = response.data[0];
        // console.log(thisData);

        // 呈現 內頁資料內容
        scenicSpot_renderInner(thisData);

        // 隱藏 探索景點主要內容
        scenicSpot_themeArea.classList.add('d-none');
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }
};


// 探索景點 - 內頁資料內容
function scenicSpot_renderInner(data) {

  // 計算 banner 圖片數量
  let  bannerPhoto_num = 0;

  // banner 圖片 
  // 第一張圖片
  if (data.Picture.PictureUrl1) {
    scenicSpotInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl1}" alt="${data.Picture.PictureDescription1}">`;
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="./assets/images/NoImage-345x160.png" alt="NoImage">`;
    bannerPhoto_num++;
  };

  // 第二章圖片
  if (data.Picture.PictureUrl2) {
    scenicSpotInner_bannerSlides[1].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl2}" alt="${data.Picture.PictureDescription2}">`;
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[1].remove();
    scenicSpotInner_bannerBullets.classList.add('d-none');
  };

  // 第三張圖片
  if (data.Picture.PictureUrl3) {
    scenicSpotInner_bannerSlides[2].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl3}" alt="${data.Picture.PictureDescription3}">`;
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[2].remove();
    scenicSpotInner_bannerBullets.classList.add('d-none');
  };

  // 圖片少於一張或剛好一張，把導覽方向鍵取消
 if( bannerPhoto_num <= 1) {
  document.querySelector('.swiper-button-next').classList.add('d-md-none');
  document.querySelector('.swiper-button-prev').classList.add('d-md-none');
 }





  // 麵包削
  breadcrumb_theme.classList.remove('text-secondary');
  breadcrumb_theme.classList.add('text-primary');
  breadcrumb_location.classList.add('text-secondary');
  breadcrumb_city.textContent = `/ ${data.City}`;
  breadcrumb_location.textContent = ` / ${data.ScenicSpotName}`;


  // 景點名字
  scenicSpotInner_mame.textContent = data.ScenicSpotName;
  // 景點類別
  scenicSpotInner_category.textContent = data.Class1;
  // 景點介紹
  scenicSpotInner_description.textContent = data.DescriptionDetail;
  // 景點開放時間
  scenicSpotInner_opentTime.textContent = data.OpenTime;
  // 景點電話
  scenicSpotInner_phone.setAttribute('href', 'tel:' + data.Phone);
  scenicSpotInner_phone.textContent = data.Phone;
  // 景點地址
  scenicSpotInner_address.textContent = data.Address;
  // 景點網址
  scenicSpotInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
  scenicSpotInner_websiteUrl.textContent = data.WebsiteUrl;
  // 景點售票資訊
  scenicSpotInner_ticketInfo.textContent = data.TicketInfo;
  // 景點注意事項
  scenicSpotInner_remarks.textContent = data.Remarks;
  // 景點地圖
  scenicSpotInner_map.innerHTML = `<iframe class="rounded-4"
  src="https://www.google.com/maps?q=${data.Address}(${data.ScenicSpotName})&hl=zh-TW&z=15&t=&output=embed"
  width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  // 如果資料的資訊是空的，就顯示無的狀態
  if (!data.TicketInfo) { scenicSpotInner_ticketInfo.textContent = '無' };
  if (!data.Remarks) { scenicSpotInner_remarks.textContent = '無' };
  if (!data.WebsiteUrl) {
    scenicSpotInner_websiteUrl.textContent = '無';
    scenicSpotInner_websiteUrl.classList.add('text-dark');
    scenicSpotInner_websiteUrl.classList.remove('text-info');
    scenicSpotInner_websiteUrl.classList.toggle('text-decoration-underline');
  };

}


// 周邊介紹



// 景點推薦






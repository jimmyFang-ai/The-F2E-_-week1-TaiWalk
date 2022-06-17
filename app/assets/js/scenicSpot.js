
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
const search_ResultNum = document.querySelector('.search_ResultNum');


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
  search_ResultNum.textContent = data_filterResult.length;
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
  search_ResultNum.textContent = search_scenicSpotList.length;
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

  // if (targetId === undefined) return;

  // 取得單一資料 id
  const targetId = location.href.split('=')[1];

  console.log(targetId);

  // 發送請求，篩選 ScenicSpotID 與 id 符合的資料
  axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotID%2C'${targetId}')&%24top=30&%24format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      // 回傳的資料
      const thisData = response.data[0];
      console.log(thisData);

      // 呈現 內頁資料內容
      scenicSpot_renderInner(thisData);

      // 隱藏 探索景點主要內容
      scenicSpot_themeArea.classList.add('d-none');
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};


// 探索景點 - 內頁資料內容
function scenicSpot_renderInner(data) {

  // 麵包削列表
  const breadcrumb_theme = document.querySelector('.breadcrumb-theme');
  const breadcrumb_city = document.querySelector('.breadcrumb-city');
  const breadcrumb_location = document.querySelector('.breadcrumb-location');

  breadcrumb_theme.classList.remove('text-secondary');
  breadcrumb_theme.classList.add('text-primary');
  breadcrumb_location.classList.add('text-secondary');
  breadcrumb_city.textContent = `/ ${data.City}`;
  breadcrumb_location.textContent = ` / ${data.ScenicSpotName}`;

}









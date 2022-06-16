
// 主要區塊 DOM 
const scenicSpot_themeArea = document.querySelector('.scenicSpot-themeArea');
const scenicSpot_categoryInner = document.querySelector('.scenicSpot-categoryInner');
const scenicSpot_searchResult = document.querySelector('.scenicSpot-searchResult');


// 搜尋欄位 DOM
const search_city = document.querySelector(".search-city");
const search_category = document.querySelector(".search-category");
const search_keyword = document.querySelector(".search-keyword");


// 呈現畫面列表 DOM
const scenicSpot_categoryList = document.querySelector('.scenicSpot-categoryList');
const scenicSpot_resultList = document.querySelector('.scenicSpot-resultList');


// console.log(scenicSpot_themeArea,scenicSpot_categoryInner, scenicSpot_searchResult,
// scenicSpot_categoryList,scenicSpot_resultLis);



// 探索景點 - 切換類別篩選功能 
if (scenicSpot_categoryList) {
  scenicSpot_categoryList.addEventListener('click', scenicSpot_filterCategory);
}

function scenicSpot_filterCategory(e) {
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


  // 取得篩選資料 
  scenicSpot_getCategory(categoryVal);
};



// 探索景點 - 取得類別篩選資料 
function scenicSpot_getCategory(categoryVal) {

  // 取得資料
  axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(Class1%2C'${categoryVal}')&format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      // 回傳的資料
      const thisData = response.data;

      // 過濾後的資料
      let filterData = [];

      // 過濾資料 排除沒有圖片、景點名字、城市
      thisData.forEach((item) => {
        if (item.Picture.PictureUrl1 && item.ScenicSpotName && item.City) {
          filterData.push(item);
        }
      })

      // 呈現類別篩選結果
      scenicSpot_renderCategory(filterData);
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};


// 探索景點 - 呈現類別篩選結果
function scenicSpot_renderCategory(arr) {

  let search_ResultNum = document.querySelector('.search_ResultNum');

  let str = '';


  // 如果有資料就顯示 類別篩選結果區塊
  if (arr.length) {
    arr.forEach((item) => {
      console.log(item);
      str += `
      <li class="col mb-2 mb-md-4">
      <div class="resultList-card border-0">
          <div class="ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden">
              <a href="#">
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
  }


  // 呈現結果數字
  search_ResultNum.textContent = arr.length;

  // 呈現結果畫面
  scenicSpot_resultList.innerHTML = str;
};





// 分頁邏輯


















// 篩選邏輯
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

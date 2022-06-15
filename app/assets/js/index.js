
// 首頁 js


// 呈現畫面 DOM 
let home_activity = document.querySelector('.home_activity');
let home_scenicSpot = document.querySelector('.home_scenicSpot');
let home_restaurant = document.querySelector('.home_restaurant');

// 搜尋按鈕
let home_searchBtn = document.querySelector('.search_Btn');


// 首頁近期活動:  呈現畫面
function render_activity(arr) {

  let str = '';

  //  取得當前年份和月份
  // 月份是從0開始，所以要加1，才會符合12個月/年
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();


  // 畫面呈現為四筆資料，所以要跑四次迴圈
  for (let i = 0; i < 4; i++) {

    // 隨機取得 陣列資料索引位置和資料
    let dataIndex = getRandom(arr.length);
    let dataItem = arr[dataIndex];

    // 取得最近活動還沒結束的時間，落在今年或明年。
    const checkDate = parseInt(dataItem.EndTime.slice(0, 4)) >= year && parseInt(dataItem.EndTime.slice(5, 7)) >= month || parseInt(dataItem.EndTime.slice(0, 4)) > year;
    // console.log(checkDate);

    // 判斷 如果checkDate 為 false 重跑一次迴圈
    if (checkDate === false) {
      i -= 1;
      continue;
    } else {
      // 為 true 的話就組字串資料
      str += `<div class="col mb-2">
        <div class="card">
          <div class="row g-0">
            <div class="col-4 overflow-hidden">
            <div class="ratio ratio-9x7  ratio-md-1x1">
               <a class="imgWarp" href="./activity.html?id=${dataItem.ActivityID}">
               <img class=" card-img img-cover" src="${dataItem.Picture.PictureUrl1}" alt="${dataItem.Description}">
               </a>
            </div>
            </div>
            <div class="col-8">
              <div class="card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5">
                <div>
                  <span class="card-text text-secondary fs-xs fs-lg-6"> ${dataItem.StartTime.slice(0, 10)} - ${dataItem.EndTime.slice(0, 10)}</span>
                  <h5 class="card-title fs-6 fs-lg-xl lh-base fw-bold mb-0 text-truncate">${dataItem.ActivityName}</h5>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="card-text text-secondary d-flex align-items-center"><img class="me-1"
                      src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
                  <a class="btn  btn-infoBtn   d-none d-md-inline-block shadow-none" href="./activity.html?id=${dataItem.ActivityID}"><span
                      class="btn-inner">詳細介紹 ❯
                    </span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }
  };

  // 呈現畫面
  home_activity.innerHTML = str;
};


// 首頁打卡景點: 呈現畫面
function render_scenicSpot(arr) {

  let str = '';

  // 畫面呈現為四筆資料，所以要跑四次迴圈
  for (let i = 0; i < 4; i++) {

    // 隨機取得 陣列資料索引位置和資料
    let dataIndex = getRandom(arr.length);
    let dataItem = arr[dataIndex];

    // 如果沒縣市名字 就重跑一次迴圈
    if (dataItem.City === undefined) {
      i -= 1;
      continue;
    } else {    // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      str += `<li class="swiper-slide">
      <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
        <a href="./scenicSpot.html?id=${dataItem.ScenicSpotID}">
          <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}"  onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
            alt="${dataItem.DescriptionDetail}">
        </a>
      </div>
      <div class="py-1 py-md-2">
        <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.ScenicSpotName}</h5>
        <span class="text-secondary d-flex align-items-center"><img class="me-1"
            src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
      </div>
    </li>`;
    }
  };

  // 呈現畫面
  home_scenicSpot.innerHTML = str;
};


// 首頁餐廳資訊: 呈現畫面
function render_restaurant(arr) {

  let str = '';

  // 畫面呈現為四筆資料，所以要跑四次迴圈
  for (let i = 0; i < 4; i++) {

    // 隨機取得 陣列資料索引位置和資料
    let dataIndex = getRandom(arr.length);
    let dataItem = arr[dataIndex];


    // 如果沒縣市名字 就重跑一次迴圈
    if (dataItem.City === undefined) {
      i -= 1;
      continue;
    } else {     // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      str += `<li class="swiper-slide">
        <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
          <a href="./Restaurant.html?id=${dataItem.RestaurantID}">
            <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}" onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
              alt="${dataItem.DescriptionDetail}">
          </a>
        </div>
        <div class="py-1 py-md-2">
          <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.RestaurantName}</h5>
          <span class="text-secondary d-flex align-items-center"><img class="me-1"
              src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
        </div>
      </li>`;
    }
  };
  // 呈現畫面
  home_restaurant.innerHTML = str;
};


// 首頁 搜尋功能
home_searchBtn.addEventListener('click', search_keyword);
function search_keyword() {
  const search_type = document.querySelector('.search_type');
  const search_keyword = document.querySelector('.search_keyword');

  if (search_keyword.value.trim() !== '') {
    // window.location.href = `./${search_type.value}.html?city=&keyword="+encodeURIComponent(${search_keyword.value.trim()})`;
    window.location.href = `./${search_type.value}.html?%24filter=contains(keyword%2C'${search_keyword.value.trim()}')`;
  }
};








// PTX api  header 驗證
function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    // let AppID = 'pi20120413-51900829-226c-41ea';
    // let AppKey = '3b7f6972-70db-4eba-8d74-2d6e11c5f499';
    //  填入自己 ID、KEY 結束
    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
    return { 'Authorization': Authorization, 'X-Date': GMTString };
}


// 測試用 test
console.log(getAuthorizationHeader());
// let testApi = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24top=100&%24format=JSON';


// apiUrl
let apiUrl_scenicSpot = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?&$format=JSON';
let apiUrl_activity = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON';
let apiUrl_restaurant = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON';


// data 
let data_scenicSpot = [];
let data_activity = [];
let data_restaurant = [];


// 呈現畫面 DOM 
let home_activity = document.querySelector('.home_activity');
let home_scenicSpot = document.querySelector('.home_scenicSpot');
let home_restaurant = document.querySelector('.home_restaurant');

// console.log(home_activity,home_scenicSpot,home_restaurant );


// 初始化
function init() {
    get_ScenicSpot();
}
init();


// 觀光景點: 取得資料 
function get_ScenicSpot() {
    axios.get(apiUrl_restaurant,
        {
            headers: getAuthorizationHeader()
        }
    )
        .then(function (response) {
            //    document.querySelector('body').textContent=JSON.stringify(response.data);
            data_scenicSpot = response.data;
            console.log(data_scenicSpot);

            // 將沒有三張圖片的資料都濾掉
            data_scenicSpot = data_scenicSpot.filter((item) => { return item.Picture.PictureUrl1 !== undefined && item.Picture.PictureUrl2 !== undefined && item.Picture.PictureUrl3 !== undefined });
            console.log(data_scenicSpot);

            //呈現畫面
            reder_ScenicSpot(data_scenicSpot);


        })
        .catch(function (error) {
            console.log(error.response.data);
        });
};


// 觀光景點:  呈現畫面
function reder_ScenicSpot(arr) {

    let str = '';


    // 隨機抽取四筆資料 呈現在畫面上
    for (let i = 0; i < 4; i++) {
        // 隨機取得 陣列資料索引位置和資料
        let dataIndex = getRandom(data_scenicSpot.length);
        let dataItem = data_scenicSpot[dataIndex];

        str += `<div class="col mb-2">
        <div class="card">
          <div class="row g-0">
            <div class="col-4 overflow-hidden">
              <a class="imgWarp" href="./activity.html?id=${dataItem.ActivityID}">
                <img class=" card-img img-cover" src="${dataItem.Picture.PictureUrl1}" alt="${dataItem.Description}">
              </a>
            </div>
            <div class="col-8">
              <div class="card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5">
                <div>
                  <span class="card-text text-secondary fs-xs fs-lg-6">${dataItem.StartTime} - ${dataItem.EndTime}</span>
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
    };

    home_activity.innerHTML = str;
}

// 亂數產生器函式
function getRandom(num) {
    return Math.floor(Math.random() * num);
};
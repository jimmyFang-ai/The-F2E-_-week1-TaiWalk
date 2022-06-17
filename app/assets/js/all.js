
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


// apiUrl
let apiUrl_activity = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?$filter=Picture%2FPictureUrl1%20ne%20null&$format=JSON`;
let apiUrl_scenicSpot = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$filter=Picture%2FPictureUrl1%20ne%20null&%format=JSON`;
let apiUrl_restaurant = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/?$filter=Picture%2FPictureUrl1%20ne%20null&$format=JSON`;



// 初始化
function init() {
  // 首頁- 取得資料
  get_activity();
  get_scenicSpot();
  get_restaurant();

  // 探索景點 - 取得資料
  scenicSpot_getData();
}
init();


// 首頁 - 取得資料
// 近期活動
function get_activity() {
  axios.get(apiUrl_activity,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      const data_activity = response.data;

      //呈現畫面
      if (home_activity) {
        render_activity(data_activity);
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};

// 打卡景點
function get_scenicSpot() {
  axios.get(apiUrl_scenicSpot,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      const data_scenicSpot = response.data;

      //呈現畫面
      if (home_scenicSpot) {
        render_scenicSpot(data_scenicSpot);
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};

//餐廳資訊
function get_restaurant() {
  axios.get(apiUrl_restaurant,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      const data_restaurant = response.data;

      if (home_restaurant) {
        //呈現畫面
        render_restaurant(data_restaurant);
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
};



// 帳號未註冊完成: 可不使用API金鑰呼叫API，但每日呼叫次數上限為50次。



// header 驗證
function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
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
let apiUrl_scenicSpot = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/?$filter=Picture/PictureUrl1 ne null&$format=JSON';

// activity_apiUrl
// restaurant_apiUrl


// 初始化
function init() {
    get_ScenicSpot();
}
init();


// 觀光景點: 取得資料 & 渲染畫面
function get_ScenicSpot() {
    axios.get(apiUrl_scenicSpot,
        {
            headers: getAuthorizationHeader()
        }
    )
        .then(function (response) {
            //    document.querySelector('body').textContent=JSON.stringify(response.data);
            console.log(response.data);
            let thisData = response.data;
            // 將沒有三張圖片的資料都濾掉
            thisData = thisData.filter((item) => {return item.Picture.PictureUrl1 !== undefined && item.Picture.PictureUrl2 !== undefined && item.Picture.PictureUrl3 !== undefined});
            console.log(thisData);
  
            
        })
        .catch(function (error) {
            console.log(error.response.data);
        });

}


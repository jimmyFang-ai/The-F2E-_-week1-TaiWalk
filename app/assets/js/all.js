

// header 驗證
function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = 'pi20120413-d8af96eb-df29-4ade';
    let AppKey = 'f833d75c-8474-4bfb-af41-b3f7af36fc7c';
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
let apiUrl_scenicSpot = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/?&$format=JSON';

// let apiUrl_activity = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON';
// let apiUrl_restaurant = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$format=JSON';


// data 
let data_scenicSpot = [];
let data_activity = [];
let data_restaurant = [];


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
            data_scenicSpot = response.data;
            console.log(data_scenicSpot);

            // 將沒有三張圖片的資料都濾掉
            data_scenicSpot = data_scenicSpot.filter((item) => { return item.Picture.PictureUrl1 !== undefined && item.Picture.PictureUrl2 !== undefined && item.Picture.PictureUrl3 !== undefined });
            console.log(data_scenicSpot);


        })
        .catch(function (error) {
            console.log(error.response.data);
        });

}


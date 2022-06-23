
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
  getAuthorizationHeader();

  // 取得 網址參數
  getParameters();

  // 首頁- 取得資料
  get_activity();
  get_scenicSpot();
  get_restaurant();

    // 探索景點頁面
    // - 取得景點全部資料
    scenicSpot_getAllData();
});



// baseUrl
let baseUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism`;

// apiUrl
let apiUrl_activity = `${baseUrl}/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`;
let apiUrl_scenicSpot = `${baseUrl}/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`;
let apiUrl_restaurant = `${baseUrl}/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`;


// jQuery  取得 TDX api  header 驗證
function getAuthorizationHeader() {
  const parameter = {
    grant_type: "client_credentials",
    client_id: "pi20120413-51900829-226c-41ea",
    client_secret: "cbff89f1-e9e0-4dad-bb3b-1503012fb83d"
  };

  let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

  $.ajax({
    type: "POST",
    url: auth_url,
    crossDomain: true,
    dataType: 'JSON',
    data: parameter,
    async: false,
    success: function (data) {
      const access_token = JSON.stringify(data.access_token);
      const expires_in = JSON.stringify(data.expires_in);

      // 存取 token 
      const token = document.cookie = `tourToken=${access_token}; expires=${new Date(expires_in)}; path=/`;
    },
    error: function (xhr, textStatus, thrownError) {
      console.log('errorStatus:', textStatus);
      console.log('Error:', thrownError);
    }
  });
}


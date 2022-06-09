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



axios.get(
    'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station?$top=10&$format=JSON',
    {
        headers: getAuthorizationHeader()
    }
)
    .then(function (response) {
        //    document.querySelector('body').textContent=JSON.stringify(response.data);
       console.log(response.data);
    })
    .catch(function (error) {
        console.log(error.response.data);
    });

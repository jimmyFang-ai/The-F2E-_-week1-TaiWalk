
//  DOM 
const scenicSpot_themeArea = document.querySelector('.scenicSpot-themeArea');
const scenicSpot_categoryInner = document.querySelector('.scenicSpot-categoryInner');
const scenicSpot_searchResult = document.querySelector('.scenicSpot-searchResult');

const searchCategory = document.querySelector(".search-category");

// 呈現畫面列表
const scenicSpot_categoryList = document.querySelector('.scenicSpot-categoryList');
const  scenicSpot_resultLis = document.querySelector('.scenicSpot-resultLis');


// console.log(scenicSpot_themeArea,scenicSpot_categoryInner, scenicSpot_searchResult,
// scenicSpot_categoryList,scenicSpot_resultLis);



// 探索景點 - 篩選資料 & 取得資料
if (scenicSpot_categoryList) {
    scenicSpot_categoryList.addEventListener('click', scenicSpot_getCategory);
}

function scenicSpot_getCategory(e) {
    e.preventDefault();

    let category_card = e.target.closest(".category-card");
    let categoryVal = e.target.closest("li").dataset.category;

    searchCategory.value = categoryVal;

    category_card .classList.toggle("active");

    axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(Class1%2C'${categoryVal}')&format=JSON`,
        {
          headers: getAuthorizationHeader()
        }
      )
        .then(function (response) {
          const data_scenicSpot = response.data;
          
          console.log(data_scenicSpot);

        //   data_scenicSpot.forEach((item) => {

        //   })
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
}


// 探索景點 - 搜尋功能


// 探索景點 - 篩選資料



















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

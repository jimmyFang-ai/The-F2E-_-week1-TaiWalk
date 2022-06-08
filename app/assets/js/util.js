
// 漢堡動態效果
// const togglerBurger = document.querySelector('#toggler-burger');

// // 預設是 false 選單關閉，不會出現打 X
// let isMenuOpen = false;

// togglerBurger.addEventListener('click', function (e) {
//     //this 的指向是 togglerBurger 本身 要加上 open 樣式
//     // console.log(this);
//     // 點擊後 選單打開 為true，會出現打 X
//     isMenuOpen = !isMenuOpen;
//     isMenuOpen ? this.classList.add('open') : this.classList.remove('open');
// })


// jQuery 初始化
$(function () {

   // 漢堡動態效果
   // 漢堡按鈕 綁定事件監聽，點擊後觸發加上切換 .open class功能
   $('#toggler-burger').on('click', function () {
      $(this).toggleClass('open');
   })


   // 導覽列滾動效果
   let lastPos = 0;
   $(window).on('scroll', function () {
      let currentPos = window.scrollY;
      //   往下滑
      if (currentPos > lastPos) {
         $('#navbar-toggle').css('top', '-100px');//讓navbar消失
      } else {
         $('#navbar-toggle').css('top', '0');//讓navbar出現
      }
      lastPos = currentPos;//再記住現在位置，跟未來的位置做比較
   });

   // goTop 動態效果



});















const togglerBurger = document.querySelector('#toggler-burger');

// 預設是 false 選單關閉，不會出現打 X
let isMenuOpen = false;

togglerBurger.addEventListener('click', function (e) {
    //this 的指向是 togglerBurger 本身 要加上 open 樣式
    // console.log(this);
    // 點擊後 選單打開 為true，會出現打 X
    isMenuOpen = !isMenuOpen;
    isMenuOpen ? this.classList.add('open') : this.classList.remove('open');
})



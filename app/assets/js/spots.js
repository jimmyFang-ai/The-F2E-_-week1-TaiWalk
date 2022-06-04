

const categoryList = document.querySelector(".spots-categoryList");

categoryList.addEventListener("click" ,function(e) {
    e.preventDefault();

    let category  = e.target.closest(".spots-card");
    let categoryVal = e.target.closest("li").dataset.category;

    console.log(categoryVal);

    category.classList.toggle("active");

})
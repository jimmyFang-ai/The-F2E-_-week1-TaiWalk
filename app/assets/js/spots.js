

const searchCategory = document.querySelector(".search-category");

const categoryList = document.querySelector(".spots-categoryList");

if (categoryList) {
    categoryList.addEventListener("click", function (e) {
        e.preventDefault();

        let category = e.target.closest(".spots-card");
        let categoryVal = e.target.closest("li").dataset.category;

        searchCategory.value = categoryVal;

        category.classList.toggle("active");

    })
}

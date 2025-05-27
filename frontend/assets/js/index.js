const url = 'http://localhost:3000/api/products';

document.addEventListener('DOMContentLoaded', () => {
    getProducts();
});

function getProducts() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayProductsByLicence(data);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des produits :", error);
        });
}

function displayProductsByLicence(products) {
    const productsByLicence = getProductsByLicence(products);

    const articlesContainer = document.querySelector('.articles');
    articlesContainer.innerHTML = '';

    Object.keys(productsByLicence).forEach(licence => {
        const licenceProducts = productsByLicence[licence].slice(0, 10);

        const categoryTitle = createCategoryTitle(licence);
        const categoryContainer = createCategoryContainer();

        licenceProducts.forEach(product => {
            const productElement = createProductElement(product);
            categoryContainer.appendChild(productElement);
        });

        articlesContainer.appendChild(categoryTitle);
        articlesContainer.appendChild(categoryContainer);
    });

    heartImgUpdate();
    updateHeart();
}

function getProductsByLicence(products) {
    const productsByLicence = {};

    products.forEach(product => {
        if (!productsByLicence[product.licence_name]) {
            productsByLicence[product.licence_name] = [];
        }
        productsByLicence[product.licence_name].push(product);
    });

    return productsByLicence;
}

function createCategoryTitle(licence) {
    const categoryTitle = document.createElement('h2');
    categoryTitle.classList.add('titre2');
    categoryTitle.textContent = licence;
    return categoryTitle;
}

function createCategoryContainer() {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category_ctn');
    return categoryContainer;
}

function createProductElement(product) {
    const price = product.price;
    const priceWithReduction = product.réduction !== 0 ? product.price - (product.price * (product.réduction / 100)) : price;
    const priceClass = product.réduction !== 0 ? 'prix-initial-promo' : 'prix-initial';

    const productElement = document.createElement('div');
    productElement.classList.add('article');
    productElement.setAttribute('data-product-id', product.products_id);
    productElement.innerHTML = `
        <div class="coeur_ctn">
            <img class="coeur empty-heart" src="../assets/img/heart/empty-heart.png" alt="coeur vide">
        </div>
        <p class="licence">${product.licence_name}</p>
        <p class="cat">${product.category_name}</p>
        <a href="article.html?id=${product.products_id}">
            <img class="article_img" src="${product.image_url}" alt="${product.name}">
        </a>
        <h2 class="product_name">${product.name}</h2>
        <p class="prix">
            <span class="${priceClass}">${priceWithReduction.toFixed(2)}<span>€</span></span>
            ${product.réduction !== 0 ? `<span class="prix-réduit">${price.toFixed(2)}<span>€</span></span>` : ''}
        </p>
    `;

    if (product.image_url2){
    switchImage(product, productElement);
}

    return productElement;
}

function heartImgUpdate() {
    document.querySelectorAll('.empty-heart').forEach(emptyHeart => {
        emptyHeart.addEventListener('click', function(event) {
            event.preventDefault();
            const isHeartEmpty = this.src.includes('empty-heart');
            const productId = this.closest('.article').getAttribute('data-product-id');

            if (isHeartEmpty) {
                this.src = '../assets/img/heart/filled-heart.png';
                storeInLocalStorage(productId);
            } else {
                this.src = '../assets/img/heart/empty-heart.png';
                removeFromLocalStorage(productId);
            }
        });
    });
}

function storeInLocalStorage(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFromLocalStorage(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateHeart() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.empty-heart').forEach(emptyHeart => {
        const productId = emptyHeart.closest('.article').getAttribute('data-product-id');
        if (favorites.includes(productId)) {
            emptyHeart.src = '../assets/img/heart/filled-heart.png';
        }
    });
}

function switchImage(yes2, yes) {
    const articleImg = yes.querySelector('.article_img');
    const initialSrc = yes2.image_url;

    articleImg.addEventListener('mouseover', () => {
        articleImg.src = yes2.image_url2;
    });

    articleImg.addEventListener('mouseout', () => {
        articleImg.src = initialSrc;
    });
    
}
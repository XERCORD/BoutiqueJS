document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const licenceId = urlParams.get('licence');

    fetchProducts(`http://localhost:3000/api/products/licence/${licenceId}`)
        .then(products => {
            displayProducts(products);
            updateHeart();
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des produits:', error);
        });
});

async function fetchProducts(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Fetch error: ${error.message}`);
    }
}

function displayProducts(products) {
    const productsList = document.querySelector('.articles');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productElement = createProductElement(product);
        productsList.appendChild(productElement);
    });

    attachHeartListeners();
}

function createProductElement(product) {
    const { products_id, licence_name, categories_name, image_url, name, price } = product;
    const productElement = document.createElement('div');
    productElement.classList.add('article');
    productElement.setAttribute('data-product-id', products_id);
    productElement.innerHTML = `
        <div class="coeur_ctn">
            <img class="coeur empty-heart" src="../assets/img/heart/empty-heart.png" alt="coeur vide">
        </div>
        <p class="licence">${licence_name}</p>
        <p class="cat">${categories_name}</p>
        <a href="article.html?id=${products_id}">
            <img class="article_img" src="${image_url}" alt="${name}">
        </a>
        <h2 class="product_name">${name}</h2>
        <p class="prix">${price.toFixed(2)}<span>€</span></p>
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
        timeoutId = setTimeout(() => {
            articleImg.src = yes2.image_url2;
        }, 500);
    });

    articleImg.addEventListener('mouseout', () => {
        articleImg.src = initialSrc;
    });
}
function initCategoriePage() {
    const categoryLinks = document.querySelectorAll('a[data-category-id]');

    function updateCategory(event) {
        event.preventDefault();
        const categoryId = event.currentTarget.dataset.categoryId;
        const categoryUrl = `categorie.html?categories=${categoryId}`;
        if (typeof window.__spaNavigate === 'function') {
            window.__spaNavigate(new URL(categoryUrl, window.location.href).href);
        } else {
            window.location.href = categoryUrl;
        }
    }

    categoryLinks.forEach(function (link) {
        link.addEventListener('click', updateCategory);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categories');

    fetchJsonArray('/api/products/categories/' + encodeURIComponent(categoryId))
        .then(function (products) {
            displayProducts(products);
            updateFavoritedProductsDisplay();
        })
        .catch(function (error) {
            console.error('There was a problem with the fetch operation:', error);
            var box = document.querySelector('.articles');
            if (box) {
                box.innerHTML =
                    '<p class="api-error-banner" role="alert">' +
                    String(error.message).replace(/</g, '&lt;') +
                    '</p>';
            }
        });
}

bindPage('categorie.html', initCategoriePage);


function displayProducts(products) {
    const productsList = document.querySelector('.articles');
    if (!productsList) return;
    productsList.innerHTML = '';
    if (!Array.isArray(products)) return;

    products.forEach(product => {
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
            <p class="prix">Prix: ${product.price.toFixed(2)}<span>€</span></p>
        `;
        productsList.appendChild(productElement);
    });

    document.querySelectorAll('.empty-heart').forEach(emptyHeart => {
        emptyHeart.addEventListener('click', function(event) {
            event.preventDefault();
            const isHeartEmpty = this.src.includes('empty-heart');
            if (isHeartEmpty) {
                this.src = '../assets/img/heart/filled-heart.png';
                const productId = this.closest('.article').getAttribute('data-product-id');
                storeProductInLocalStorage(productId);
            } else {
                this.src = '../assets/img/heart/empty-heart.png';
                const productId = this.closest('.article').getAttribute('data-product-id');
                removeProductFromLocalStorage(productId);
            }
        });
    });
}

function storeProductInLocalStorage(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function removeProductFromLocalStorage(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoritedProductsDisplay() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.empty-heart').forEach(emptyHeart => {
        const productId = emptyHeart.closest('.article').getAttribute('data-product-id');
        if (favorites.includes(productId)) {
            emptyHeart.src = '../assets/img/heart/filled-heart.png';
        }
    });
}

function updateCartBubble() {
    const cartItems = JSON.parse(localStorage.getItem('panier')) || [];
    let totalQuantity = 0;

    cartItems.forEach(item => {
        totalQuantity += item.quantity;
    });

    const cartBubble = document.getElementById('cartBubble');
    cartBubble.textContent = totalQuantity; 
    cartBubble.style.display = totalQuantity > 0 ? 'block' : 'none';
}

updateCartBubble();

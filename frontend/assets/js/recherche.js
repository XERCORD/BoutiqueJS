function initRecherchePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');

    if (name) {
        const searchName = name.toLowerCase();

        fetchJsonArray('/api/products/search/' + encodeURIComponent(searchName))
            .then(function (products) {
                displayProducts(products);
                updateHeart();
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
}

bindPage('recherche.html', initRecherchePage);

function displayProducts(products) {
    const articlesContainer = document.querySelector('.articles');

    articlesContainer.innerHTML = '';

    if (!Array.isArray(products)) {
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('article');
        productElement.setAttribute('data-product-id', product.products_id);
        productElement.innerHTML = `
            <div class="coeur_ctn">
                <img class="coeur empty-heart" src="../assets/img/heart/empty-heart.png" alt="coeur vide">
            </div>
            <p class="licence">${product.licence_name}</p>
            <p class="cat">${product.categories_name}</p>
            <a href="article.html?id=${product.products_id}">
                <img class="article_img" src="${product.image_url}" alt="${product.name}">
            </a>
            <h2 class="product_name">${product.name}</h2>
            <p class="prix">${product.price.toFixed(2)}<span>€</span></p>
        `;

        if (product.image_url2) {
            switchImage(product, productElement);
        }
        articlesContainer.appendChild(productElement);
    });

    articlesContainer.style.display = 'flex';
    articlesContainer.style.flexDirection = 'row';

    heartImgUpdate();
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
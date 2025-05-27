document.addEventListener('DOMContentLoaded', () => {
    let activeFilters = [];
    let selectedLanguage = '';
    let selectedEdition = '';
    let currentPage = 1;
    const productsPerPage = 9;
    let allProductsData = [];
    const url = 'http://localhost:3000/api/products';

    function getProducts() {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allProductsData = data;
                applyFiltersAndSort();
                console.log(data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des produits :", error);
            });
    }

    document.getElementById('sort-select').addEventListener('change', () => {
        resetPaginationAndApplyFilters();
    });

    document.querySelectorAll('.tri_sub_ctn').forEach(filterDiv => {
        filterDiv.addEventListener('click', (event) => {
            const filterId = event.currentTarget.id;
            toggleFilter(filterId);
            updateCheckbox(filterDiv);
            resetPaginationAndApplyFilters();
        });
    });

    document.getElementById('language-select').addEventListener('change', (event) => {
        selectedLanguage = event.target.value;
        resetPaginationAndApplyFilters();
    });

    document.getElementById('edition-select').addEventListener('change', (event) => {
        selectedEdition = event.target.value;
        resetPaginationAndApplyFilters();
    });

    document.getElementById('clear_filter').addEventListener('click', () => {
        clearFilters();
        resetPaginationAndApplyFilters();
    });

    function toggleFilter(filterId) {
        const index = activeFilters.indexOf(filterId);
        if (index > -1) {
            activeFilters.splice(index, 1);
        } else {
            activeFilters.push(filterId);
        }
    }

    function updateCheckbox(filterDiv) {
        const isSelected = filterDiv.getAttribute('data-selected') === 'true';
        filterDiv.setAttribute('data-selected', !isSelected);
    }

    function sortProducts(products, direction) {
        if (direction === 'asc') {
            return products.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (direction === 'desc') {
            return products.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        return products;
    }

    function filterProducts(products, filters, language, editions) {
        return products.filter(product => {
            const category = product.category_name;
            const licence = product.licence_name;
            const lang = product.langage_name;
            const edition = product.edition_name;

            let matches = filters.length === 0;
            if (filters.includes('filter-booster-pokemon')) {
                matches = matches || (category === 'Booster' && licence === 'Pokémon');
            }
            if (filters.includes('filter-carte-pokemon')) {
                matches = matches || (category === 'Cartes' && licence === 'Pokémon');
            }
            if (filters.includes('filter-coffret-pokemon')) {
                matches = matches || (category === 'Coffret' && licence === 'Pokémon');
            }
            if (filters.includes('filter-tin-box-pokemon')) {
                matches = matches || (category === 'Tin-box' && licence === 'Pokémon');
            }
            if (filters.includes('filter-blister-pokemon')) {
                matches = matches || (category === 'Blister' && licence === 'Pokémon');
            }
            if (filters.includes('filter-accessoires-pokemon')) {
                matches = matches || (category === 'Accessoires' && licence === 'Pokémon');
            }
            if (filters.includes('filter-pokemon')) {
                matches = matches || (licence === 'Pokémon');
            }
            if (filters.includes('filter-ygo')) {
                matches = matches || (licence === 'Yu-Gi-Oh!');
            }
            if (filters.includes('filter-booster-ygo')) {
                matches = matches || (category === 'Booster' && licence === 'Yu-Gi-Oh!');
            }
            if (filters.includes('filter-carte-ygo')) {
                matches = matches || (category === 'Cartes' && licence === 'Yu-Gi-Oh!');
            }
            if (filters.includes('filter-coffret-ygo')) {
                matches = matches || (category === 'Coffret' && licence === 'Yu-Gi-Oh!');
            }
            if (filters.includes('filter-tin-box-ygo')) {
                matches = matches || (category === 'Tin-box' && licence === 'Yu-Gi-Oh!');
            }
            if (filters.includes('filter-blister-ygo')) {
                matches = matches || (category === 'Blister' && licence === 'Yu-Gi-Oh!');
            }
            if (filters.includes('filter-accessoires-ygo')) {
                matches = matches || (category === 'Accessoires' && licence === 'Yu-Gi-Oh!');
            }

            if (language) {
                matches = matches && (lang === language);
            }

            if (editions) {
                matches = matches && (edition === editions);
            }

            return matches;
        });
    }

    function clearFilters() {
        activeFilters = [];
        selectedLanguage = '';
        selectedEdition = '';

        document.querySelectorAll('.tri_sub_ctn').forEach(filterDiv => {
            filterDiv.setAttribute('data-selected', 'false');
        });

        document.getElementById('language-select').value = '';
        document.getElementById('edition-select').value = '';
    }

    function displayAllProducts(products) {
        const productsList = document.querySelector('.articles');
        productsList.innerHTML = '';

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const displayedProducts = products.slice(startIndex, endIndex);

        const allProductsContainer = document.createElement('div');
        allProductsContainer.classList.add('category_ctn');

        displayedProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('article');
            productElement.setAttribute('data-product-id', product.products_id);
            
            // Convertir les prix en nombres pour éviter les erreurs
            let price = parseFloat(product.price) || 0;
            let priceWithReduction = price;
            let priceClass = 'prix-initial';
            let reduction = parseFloat(product.réduction) || 0;
            
            if (reduction !== 0) {
                priceWithReduction = price - (price * (reduction / 100));
                priceClass = 'prix-initial-promo';
            }

            productElement.innerHTML = `
            <div class="coeur_ctn">
               <img class="coeur empty-heart" src="/assets/img/heart/empty-heart.png" alt="coeur vide" data-id="${product.products_id}">
            </div>
                <p class="licence">${product.licence_name}</p>
                <p class="cat">${product.category_name}</p>
                <a href="article.html?id=${product.products_id}">
                    <img class="article_img" src="${product.image_url}" alt="${product.name}">
                </a>
                <h2 class="product_name">${product.name}</h2>
                <p class="prix">
                    <span class="${priceClass}">${price.toFixed(2)}<span>€</span></span>
                    ${reduction !== 0 ? `<span class="prix-réduit">${priceWithReduction.toFixed(2)}<span>€</span></span>` : ''}
                </p>
            `;

            if (product.image_url2){
                switchImage(product, productElement);
            }

            allProductsContainer.appendChild(productElement);
        });

        productsList.appendChild(allProductsContainer);

        heartImgUpdate();
        updateHeart();
    }

    function displayPagination(filteredProducts) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const paginationContainer = document.querySelector('.pagination');

        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-button');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                applyFiltersAndSort();
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    function applyFiltersAndSort() {
        let filteredProducts = filterProducts(allProductsData, activeFilters, selectedLanguage, selectedEdition);
        filteredProducts = sortProducts(filteredProducts, document.getElementById('sort-select').value);
        displayAllProducts(filteredProducts);
        displayPagination(filteredProducts);
    }

    function resetPaginationAndApplyFilters() {
        currentPage = 1;
        applyFiltersAndSort();
    }

    getProducts();
});

function heartImgUpdate() {
    document.querySelectorAll('.empty-heart').forEach(emptyHeart => {
        emptyHeart.addEventListener('click', function(event) {
            event.preventDefault();
            const isHeartEmpty = this.src.includes('empty-heart');
            const productId = this.closest('.article').getAttribute('data-product-id');

            if (isHeartEmpty) {
                this.src = '/assets/img/heart/filled-heart.png';
                storeInLocalStorage(productId);
            } else {
                this.src = '/assets/img/heart/empty-heart.png';
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
            emptyHeart.src = '/assets/img/heart/filled-heart.png';
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
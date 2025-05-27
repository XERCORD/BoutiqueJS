document.addEventListener('DOMContentLoaded', function() {
    displayFavoriteProducts();
});

function displayFavoriteProducts() {
    const favorisList = document.querySelector('.articles');
    favorisList.innerHTML = ''; 

    // Récupérer les favoris actuels du localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favorisList.innerHTML = '<p>Aucun produit favori trouvé.</p>';
        return;
    }

    favorites.forEach(productId => {
        fetch(`http://localhost:3000/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                const productElement = createProductElement(product);
                favorisList.appendChild(productElement);

                const poubelle = productElement.querySelector('.poubelle');
                poubelle.addEventListener('click', function(event) {
                    event.preventDefault();
                    const productId = this.closest('.article').getAttribute('data-product-id');
                    removeProductFromLocalStorage(productId);
                    favorisList.removeChild(this.closest('.article'));
                    
                    // Vérifier s'il reste des favoris
                    const remainingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    if (remainingFavorites.length === 0) {
                        favorisList.innerHTML = '<p>Aucun produit favori trouvé.</p>';
                    }
                });
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du produit favori :", error);
            });
    });
}

function removeProductFromLocalStorage(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('article');
    productElement.setAttribute('data-product-id', product.products_id);
    
    // Conversion sécurisée du prix
    let price = parseFloat(product.price) || 0;
    let priceWithReduction = price;
    let reduction = parseFloat(product.réduction) || 0;
    
    if (reduction !== 0) {
        priceWithReduction = price - (price * (reduction / 100));
    }
    
    productElement.innerHTML = `
    <div class="poubelle_ctn">
        <img class="poubelle empty-heart" src="/assets/img/poubelle/trash-1.png" alt="poubelle">
    </div>  
    <p class="licence">${product.licence_name}</p>
    <p class="cat">${product.category_name}</p>
    <a href="article.html?id=${product.products_id}">
        <img class="article_img" src="${product.image_url}" alt="${product.name}">
    </a>
    <h2 class="product_name">${product.name}</h2>
    <p class="prix">
        Prix: ${reduction !== 0 ? `<span class="prix-réduit">${priceWithReduction.toFixed(2)} €</span> ` : ''}
        <span class="prix-initial">${price.toFixed(2)}<span>€</span></span>
    </p>
    `;
    
    if (product.image_url2) {
        switchImage(product, productElement);
    }
    
    return productElement;
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
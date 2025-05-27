document.addEventListener('DOMContentLoaded', function() {
    var quantityInput = document.getElementById("quantity");
    var decreaseButton = document.querySelector("#decrease");
    var increaseButton = document.querySelector("#increase");
    var mainImage = document.getElementById('img_article');
    var currentIndex = 0;
    var leftButton = document.getElementById('left');
    var rightButton = document.getElementById('right');

    if (decreaseButton && increaseButton) {
        decreaseButton.addEventListener("click", function () {
            decrementQuantity();
        });

        increaseButton.addEventListener("click", function () {
            incrementQuantity();
        });
    }

    function decrementQuantity() {
        var currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }


    function incrementQuantity() {
        var currentValue = parseInt(quantityInput.value);
        var stock = parseInt(document.getElementById('product_stock').textContent.split(': ')[1]);
        if (currentValue < stock) {
            quantityInput.value = currentValue + 1;
        }
    }



    mainImage.addEventListener('click', function() {
        var fullscreenImage = document.createElement('div');
        fullscreenImage.classList.add('fullscreen-image');
        var closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';
        fullscreenImage.appendChild(closeButton);
        var img = document.createElement('img');
        img.src = this.src;
        fullscreenImage.appendChild(img);
        document.body.appendChild(fullscreenImage);

        closeButton.addEventListener('click', function() {
            fullscreenImage.remove();
        });
    });

    function createSubImgWrapper(imageUrl) {
        const subImgWrapper = document.createElement('div');
        subImgWrapper.classList.add('sub_img_wrapper');
    
        const img = document.createElement('img');
        img.classList.add('sub_img');
        img.src = imageUrl;
        img.alt = '';
    
        const blueBar = document.createElement('div');
        blueBar.classList.add('blue-bar');
    
        subImgWrapper.appendChild(img);
        subImgWrapper.appendChild(blueBar);
    
        return subImgWrapper;
    }

    

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productUrl = `http://localhost:3000/api/products/${productId}`;

    function displayProductDetails(product) {
        document.getElementById('product_name').textContent = product.name;
        const descriptionElement = document.getElementById('product_description');
        const fullDescription = product.description;
        if (fullDescription.length > 150) {
            const shortDescription = fullDescription.substring(0, 150) + '...';
            descriptionElement.textContent = shortDescription;
    
            const hideDesc = document.createElement('span');
            hideDesc.textContent = '...En voir plus';
            hideDesc.style.color = 'blue';
            hideDesc.style.cursor = 'pointer';
            descriptionElement.appendChild(hideDesc);
    
            hideDesc.addEventListener('click', function() {
                descriptionElement.textContent = fullDescription;
            });
        } else {
            descriptionElement.textContent = fullDescription;
        }
    
        document.getElementById('product_stock').textContent = `Stock: ${product.stock}`;

        const addButton = document.querySelector('.item_button');
        if (product.stock === 0) {
            addButton.disabled = true;
            addButton.textContent = 'Rupture de stock';
        }

 
        let price = product.price;
        let priceWithReduction = product.price;
        let priceClass = 'prix-initial'; 
        if (product.réduction !== 0) {
            priceWithReduction = product.price - (product.price * (product.réduction / 100));
            priceClass = 'prix-initial-promo'; 
        }
    
        document.getElementById('product_price').innerHTML = `
        Prix:  ${product.réduction !== 0 ? `<span class="prix-réduit">${priceWithReduction.toFixed(2)} €</span>` : ''}
            <span class="${priceClass}">${price.toFixed(2)} €</span>
            
        `;
        document.getElementById('img_article').src = product.image_url;

    
        const subImagesContainer = document.querySelector('.sub_img_ctn');
        subImagesContainer.innerHTML = '';
    
        if (product.image_url) {
            const mainImgWrapper = document.createElement('div');
            mainImgWrapper.classList.add('sub_img_wrapper');
    
            const mainImg = document.createElement('img');
            mainImg.classList.add('sub_img');
            mainImg.src = product.image_url;
            mainImg.alt = '';
    
            const blueBar = document.createElement('div');
            blueBar.classList.add('blue-bar');
    
            mainImgWrapper.appendChild(mainImg);
            mainImgWrapper.appendChild(blueBar);
    
            subImagesContainer.appendChild(mainImgWrapper);
        }
    
        if (product.image_url2) {
            const subImgWrapper2 = createSubImgWrapper(product.image_url2);
            subImagesContainer.appendChild(subImgWrapper2);
        }
    
        if (product.image_url3) {
            const subImgWrapper3 = createSubImgWrapper(product.image_url3);
            subImagesContainer.appendChild(subImgWrapper3);
        }
    
        if (product.image_url4) {
            const subImgWrapper4 = createSubImgWrapper(product.image_url4);
            subImagesContainer.appendChild(subImgWrapper4);
        }
    
        const subImages = document.querySelectorAll('.sub_img');
        subImages[0].parentElement.classList.add('active');
  
        function highlightCurrentSubImage() {
            subImages.forEach(img => {
                if (img.parentElement) {
                    img.parentElement.classList.remove('active');
                }
            });
            if (subImages[currentIndex].parentElement) {
                subImages[currentIndex].parentElement.classList.add('active');
            }
            mainImage.src = subImages[currentIndex].src;
            
        }

        if (mainImage && subImages) {
            subImages.forEach(function(image) {
                image.addEventListener('click', function() {
                    var clickedImagePath = image.getAttribute('src');
                    var currentMainImagePath = mainImage.getAttribute('src');
    
                    mainImage.setAttribute('src', clickedImagePath);
    
                    subImages.forEach(img => img.parentElement.classList.remove('active'));
                    image.parentElement.classList.add('active');
                });
            });
        }
    
        if (leftButton && rightButton) {
            leftButton.addEventListener('click', function() {
                currentIndex = (currentIndex === 0) ? subImages.length - 1 : currentIndex - 1;
                highlightCurrentSubImage();
            });
    
            rightButton.addEventListener('click', function() {
                currentIndex = (currentIndex === subImages.length - 1) ? 0 : currentIndex + 1;
                highlightCurrentSubImage();
            });
        }
    
        if (product.langage_name && product.langage_name !== 'N/A') {
            document.getElementById('data1').textContent = product.langage_name;
        } else {
            document.querySelector('.langue').style.display = 'none';
        }
    
        if (product.edition_name && product.edition_name !== 'N/A') {
            document.getElementById('data2').textContent = product.edition_name;
        } else {
            document.querySelector('.edition').style.display = 'none';
        }
    
        if (product.licence_name && product.licence_name !== 'N/A') {
            document.getElementById('data3').textContent = product.licence_name;
        } else {
            document.querySelector('.licence').style.display = 'none';
        }
    
        if (product.state_name && product.state_name !== 'N/A') {
            document.getElementById('data4').textContent = product.state_name;
        } else {
            document.querySelector('.etat').style.display = 'none';
        }
    
        const caracterDivs = document.querySelectorAll('.caract > div');
        let visibleIndex = 0;
    
        for (let i = 0; i < caracterDivs.length; i++) {
            if (caracterDivs[i].style.display !== 'none' && window.getComputedStyle(caracterDivs[i]).display !== 'none') {
                if (visibleIndex % 2 === 0) {
                    caracterDivs[i].classList.add('color1');
                    caracterDivs[i].classList.remove('color2');
                } else {
                    caracterDivs[i].classList.add('color2');
                    caracterDivs[i].classList.remove('color1');
                }
                visibleIndex++;
            }
        }

        document.querySelector('.item_button').addEventListener('click', function() {
            addToCart(product);
        });
    }
    
    fetch(productUrl)
        .then(response => response.json())
        .then(data => displayProductDetails(data))
        .catch(error => {
            console.error("Erreur lors de la récupération des détails du produit :", error);
        });

        function addToCart(product) {
            let price = product.price;
            let priceWithReduction = product.price;
            let priceClass = 'prix-initial'; 
            if (product.réduction !== 0) {
                priceWithReduction = product.price - (product.price * (product.réduction / 100));
                priceClass = 'prix-initial-promo'; 
            }
            const quantity = parseInt(quantityInput.value);
            let cart = JSON.parse(localStorage.getItem('panier')) || [];
            
            const existingProductIndex = cart.findIndex(item => item.id === productId);
        
            if (existingProductIndex !== -1) {
                const totalQuantity = cart[existingProductIndex].quantity + quantity;
                if (totalQuantity <= product.stock) {
                    cart[existingProductIndex].quantity = totalQuantity;
                } else {
                    cart[existingProductIndex].quantity = product.stock;
                    alert(`Vous ne pouvez pas ajouter plus de ${product.stock} articles de ${product.name}.`);
                }
            } else {
                if (quantity <= product.stock) {
                    cart.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        réduction: priceWithReduction,
                        image: product.image_url,
                        stock: product.stock,
                        quantity: quantity
                    });
                } else {
                    alert(`Vous ne pouvez pas ajouter plus de ${product.stock} articles de "${product.name}".`);
                }
            }
        
            localStorage.setItem('panier', JSON.stringify(cart));
            updateCartBubble();
        }
});

document.querySelector('.item_button').addEventListener('click', function() {
    document.getElementById('addedMessage').style.display = 'block';
    setTimeout(function() {
        document.getElementById('addedMessage').style.display = 'none';
    }, 2000); 
});


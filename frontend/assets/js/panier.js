document.addEventListener('DOMContentLoaded', function() {
    const panierData = JSON.parse(localStorage.getItem('panier'));
    const articleAllDiv = document.querySelector('.article_all');

    function updatePrice(articleDiv, article) {
        const quantityInput = articleDiv.querySelector('.formulaire_qty input[name="quantity"]');
        const prixTotal = articleDiv.querySelector('.prix p');

        quantityInput.addEventListener('change', function() {
            let newQuantity = parseInt(quantityInput.value);

            if (newQuantity <= 0 || isNaN(newQuantity) || newQuantity > article.stock) {
                newQuantity = 1;
                quantityInput.value = 1;
            }

            const newTotal = article.réduction * newQuantity;
            prixTotal.textContent = newTotal.toFixed(2) + '€';

            article.quantity = newQuantity;
            localStorage.setItem('panier', JSON.stringify(panierData));

            updateTotalPrice(panierData);
        });
    }
   

    function deleteArticle(articleIndex) {
        panierData.splice(articleIndex, 1);
        localStorage.setItem('panier', JSON.stringify(panierData));
        location.reload();
    }

    function updateTotalPrice(panierData) {
        const prixTotalElement = document.querySelector('.prix_total_ctn p:last-child');
        const prixLivraisonElement = document.querySelector('.prix_livraison_ctn p:last-child');
        const prixTTCElement = document.querySelector('.prix_ttc_ctn p:last-child');

        if (!panierData || panierData.length === 0) {
            prixTotalElement.textContent = '0.00 €';
            prixLivraisonElement.textContent = '0.00 €';
            prixTTCElement.textContent = '0.00 €';
            return;
        }


        let totalPrice = 0;
        panierData.forEach(article => {
            totalPrice += article.réduction * article.quantity;
        });

        const prixLivraison = 5.90;
        const prixTTC = totalPrice + prixLivraison;

        prixTotalElement.textContent = totalPrice.toFixed(2) + ' €';
        prixLivraisonElement.textContent = prixLivraison.toFixed(2) + ' €';
        prixTTCElement.textContent = prixTTC.toFixed(2) + ' €';
    }

    if (panierData && panierData.length > 0) {
        panierData.forEach((article, index) => {
            const total = article.réduction * article.quantity;
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article_line');

            articleDiv.innerHTML = `
                <div class="img_article">
                    <a href="article.html?id=${article.id}">
                        <img id="article_img" src="${article.image}" alt="">
                    </a>
                </div>
                <div class="name_desc">
                    <p class="name_article">${article.name}</p>
                    <p class="prix_desc"> Unité : ${article.price.toFixed(2)} €</p>
                </div>
                <form action="" class="formulaire_qty">
                    <input type="number" name="quantity" id="quantity" min="1" max="${article.stock}" value="${article.quantity}">
                </form>
                <div class="prix">
                    <p>${total.toFixed(2)} €</p>
                </div>
                <img src="../assets/img/poubelle/trash-1.png" alt="trash" class="trash">
            `;

            articleAllDiv.appendChild(articleDiv);

            const trashIcon = articleDiv.querySelector('.trash');
            trashIcon.addEventListener('click', function() {
                deleteArticle(index);
            });

            updatePrice(articleDiv, article);
        });
    } else {
        articleAllDiv.innerHTML = "<p>Le panier est vide.</p>";
        const btnCommande = document.querySelector('.commander_btn');
            btnCommande.removeAttribute('href');
            btnCommande.style.backgroundColor = 'grey';
            btnCommande.style.cursor = 'not-allowed';
            btnCommande.textContent = 'Panier vide';            
    }

    updateTotalPrice(panierData);
});

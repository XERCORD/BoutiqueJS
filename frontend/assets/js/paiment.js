document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.getElementById('update-stock-button');

    payButton.addEventListener('click', () => {
        updateStock();
    });
});

function updateStock() {
    let productsToUpdate = JSON.parse(localStorage.getItem('panier'));

    let dataToSend = productsToUpdate.map(product => ({
        id: parseInt(product.id),
        quantity: parseInt(product.quantity)
    }));

    fetch('http://localhost:3000/api/update-stock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); 
        }
        return response.json();
    })
    .then(data => {
        console.log('Stock updated successfully:', data);


    })
    .catch(error => {
        console.error('Error updating stock:', error);
        localStorage.removeItem('panier');

    });
}

document.addEventListener('DOMContentLoaded', () => {
    const payButton = document.getElementById('update-stock-button');

    payButton.addEventListener('click', (event) => {
        if (!isFormValid()) {
            event.preventDefault();
            alert('Veuillez remplir tous les champs du formulaire.');
        }
    });

    document.getElementById('address').addEventListener('input', () => {
        const address = document.getElementById('address').value;
        const resultsContainer = document.getElementById('results');

        if (address.length < 7) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }

        const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                resultsContainer.innerHTML = '';
                if (data.features.length > 0) {
                    data.features.forEach(feature => {
                        const address = feature.properties.label;
                        const resultDiv = document.createElement('div');
                        resultDiv.classList.add('result');
                        resultDiv.textContent = address;
                        resultDiv.addEventListener('click', () => {
                            document.getElementById('address').value = address;
                            resultsContainer.innerHTML = '';
                            resultsContainer.style.display = 'none';
                        });
                        resultsContainer.appendChild(resultDiv);
                    });
                    resultsContainer.style.display = 'block';
                } else {
                    resultsContainer.textContent = 'Aucune adresse trouvée';
                    resultsContainer.style.display = 'block';
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'adresse :", error);
            });
    });

    document.addEventListener('click', (event) => {
        const resultsContainer = document.getElementById('results');
        if (!resultsContainer.contains(event.target) && event.target !== document.getElementById('address')) {
            resultsContainer.style.display = 'none';
        }
    });

    document.getElementById('card-number').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            value = value.match(/.{1,4}/g).join('-');
        }

        e.target.value = value;
    });

    document.getElementById('cvc').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        e.target.value = value;
    });

    document.getElementById('expiry-date').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 2) {
            value = value.match(/.{1,2}/g).join('/');
        }

        e.target.value = value;
    });
});

function isFormValid() {
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvc = document.getElementById('cvc').value.trim();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const address = document.getElementById('address').value.trim();

    return cardNumber !== '' &&
        expiryDate !== '' &&
        cvc !== '' &&
        firstName !== '' &&
        lastName !== '' &&
        address !== '';
}

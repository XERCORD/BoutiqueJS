function resetMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');
    menuBtn?.classList.remove('active');
    menu?.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function () {
    resetMobileMenu();

    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');
    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
    });
});

/** Retour en arrière / cache BFCache : évite menu ouvert ou état incohérent */
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        resetMobileMenu();
    }
    updateCartBubble();
});

function updateCartBubble() {
    const cartBubble = document.getElementById('cartBubble');
    if (!cartBubble) return;

    const cartItems = JSON.parse(localStorage.getItem('panier')) || [];
    let totalQuantity = 0;

    cartItems.forEach(item => {
        totalQuantity += item.quantity;
    });

    cartBubble.textContent = totalQuantity;
    cartBubble.style.display = totalQuantity > 0 ? 'block' : 'none';
}

updateCartBubble();

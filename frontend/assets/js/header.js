document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');

    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
    });
});

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

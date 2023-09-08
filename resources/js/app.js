import axios from 'axios';
import Noty from 'noty';

let menuCards = document.querySelectorAll('.menu-card');
let cartQty = document.querySelector('.cartQty');

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(function (res) {
        cartQty.textContent = res.data.totalQty;
        new Noty({
            type: 'success',
            theme: 'relax',
            text: 'Item Added to Cart',
            animation: {
                open: 'animated bounceInRight', // Animate.css class names
                close: 'animated bounceOutRight', // Animate.css class names
            },
        }).show();
    });
}

menuCards.forEach(function (card) {
    const pizza = JSON.parse(card.dataset.pizza);
    const sizeInp = card.querySelector('.size');

    const addToCart = card.querySelector('.addToCart');
    addToCart.addEventListener('click', function (e) {
        updateCart({...pizza, size: sizeInp.value});
    });
});

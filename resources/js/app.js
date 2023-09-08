import axios from 'axios';
import Noty from 'noty';

const menuCards = document.querySelectorAll('.menu-card');
const cartQty = document.querySelector('.cartQty');
const size = ['small', 'medium', 'large'];

function getSlug(pizza) {
    return pizza.name.toLowerCase().split(' ').join('-') + `-${pizza.size}`;
}

function updateCart(pizza) {
    pizza.slug = getSlug(pizza);
    axios.post('/update-cart', pizza).then(function (res) {
        cartQty.textContent = res.data.totalQty;
        new Noty({
            type: 'alert',
            theme: 'sunset',
            text: `${pizza.name} ( ${size[pizza.size]} ) Added to Cart`,
            timeout: 2000,
            progressBar: false,
        }).show();
    });
}

menuCards.forEach(function (card) {
    const pizza = JSON.parse(card.dataset.pizza);
    const sizeInp = card.querySelector('.size');
    const addToCart = card.querySelector('.addToCart');
    const selectSize = card.querySelector('.select-size');
    const price = card.querySelector('.price');

    selectSize.addEventListener('change', function (e) {
        price.textContent = `Rs. ${pizza.price[e.target.value]}`;
    });

    addToCart.addEventListener('click', function (e) {
        updateCart({...pizza, size: +sizeInp.value});
    });
});

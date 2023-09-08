import axios from 'axios';
import Noty from 'noty';

const menuCards = document.querySelectorAll('.menu-card');
const cartPizzaItems = document.querySelectorAll('.cart-pizza-item');
const cartQty = document.querySelector('.cartQty');
const totalPrice = document.querySelector('.total-price');

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

if (menuCards) {
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
}

if (cartPizzaItems) {
    cartPizzaItems.forEach(function (card) {
        const pizza = JSON.parse(card.dataset.pizza);
        const plusPizza = card.querySelector('.plusPizza');
        const minusPizza = card.querySelector('.minusPizza');
        const pizzaCount = card.querySelector('.pizzaCount');

        plusPizza.addEventListener('click', function (e) {
            axios.post('/plus-pizza', pizza).then(function (res) {
                pizzaCount.textContent = res.data.pizzaQty;
                cartQty.textContent = res.data.totalQty;
                totalPrice.textContent = res.data.totalPrice + ' Rs.';
            });
        });

        minusPizza.addEventListener('click', function (e) {
            axios.post('/minus-pizza', pizza).then(function (res) {
                if (res.data.pizzaQty === 0) {
                    card.remove();
                }
                pizzaCount.textContent = res.data.pizzaQty;
                cartQty.textContent = res.data.totalQty;
                totalPrice.textContent = res.data.totalPrice + ' Rs.';
            });
        });
    });
}

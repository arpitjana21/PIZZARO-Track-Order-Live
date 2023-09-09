import axios from 'axios';
import Noty from 'noty';

const size = ['small', 'medium', 'large'];

function notify(message) {
    new Noty({
        type: 'alert',
        theme: 'sunset',
        text: message,
        timeout: 3000,
        progressBar: false,
    }).show();
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Home Page < SHOW MENU CARDS >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
const menuCards = document.querySelectorAll('.menu-card');

function getSlug(pizza) {
    return pizza.name.toLowerCase().split(' ').join('-') + `-${pizza.size}`;
}

function updateCart(pizza) {
    pizza.slug = getSlug(pizza);
    axios.post('/update-cart', pizza).then(function (res) {
        cartQty.textContent = res.data.totalQty;
        notify(`✔️ ${pizza.name} ( ${size[pizza.size]} ) Added to Cart`);
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

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Cart Page < SHOW CART ITEMS >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const cartPizzaItems = document.querySelectorAll('.cart-pizza-item');
const cartQty = document.querySelector('.cartQty');
const totalPrice = document.querySelector('.total-price');

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
                totalPrice.textContent = res.data.totalPrice;
            });
        });

        minusPizza.addEventListener('click', function (e) {
            axios.post('/minus-pizza', pizza).then(function (res) {
                if (res.data.pizzaQty === 0) {
                    card.remove();
                }
                pizzaCount.textContent = res.data.pizzaQty;
                cartQty.textContent = res.data.totalQty;
                totalPrice.textContent = res.data.totalPrice;
                if (totalPrice.textContent === '0') {
                    location.reload();
                }
            });
        });
    });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Registration Page < REGISTER >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const registerForm = document.querySelector('#register-form');

if (registerForm)
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInp = registerForm.querySelector('#name');
        const emailInp = registerForm.querySelector('#email');
        const passwordInp = registerForm.querySelector('#password');
        const passwordCInp = registerForm.querySelector('#passwordConfirm');
        axios
            .post('/auth/register', {
                name: nameInp.value,
                email: emailInp.value,
                password: passwordInp.value,
                passwordConfirm: passwordCInp.value,
            })
            .then(function (res) {
                notify(`✔️ ${res.data.message}`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err.response.data.message);
                notify(`❌ ${err.response.data.message}`);
            });
    });

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Login Page < LOGIN >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const loginForm = document.querySelector('#login-form');

if (loginForm)
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInp = loginForm.querySelector('#email');
        const passwordInp = loginForm.querySelector('#password');
        axios
            .post('/auth/login', {
                email: emailInp.value,
                password: passwordInp.value,
            })
            .then(function (res) {
                notify(`✔️ ${res.data.message}`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err.response.data.message);
                notify(`❌ ${err.response.data.message}`);
            });
    });

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Login Page < LOGOUT >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
const logoutBtns = document.querySelectorAll('.logout');

logoutBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        axios
            .get('/auth/logout')
            .then(function (res) {
                notify(`✔️ ${res.data.message}`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err);
                notify(`❌ ${err.response.data.message}`);
            });
    });
});

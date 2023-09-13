import axios from 'axios';
import Noty from 'noty';

const size = ['small', 'medium', 'large'];

function notify(message, type = 'alert', theme = 'sunset') {
    new Noty({
        type: type,
        theme: theme,
        text: message,
        timeout: 2000,
        progressBar: false,
    }).show();
}

function formatName(name) {
    const names = name.split(' ');

    const formattedNames = names.map((namePart) => {
        if (namePart) {
            return namePart[0].toUpperCase() + namePart.slice(1);
        }
        return '';
    });

    return formattedNames.join(' ');
}

function getTime(str) {
    const timeString = new Date(str).toLocaleTimeString('en-IN');
    const [time, ampm] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
}

function updateOrderStats(orderStats, orderData) {
    const {statusTimings, status} = orderData;
    const allStats = orderStats.querySelectorAll('.status');

    allStats.forEach(function (stats, index) {
        stats.classList.remove('red');
        stats.querySelector('.time').classList.add('hide');
    });

    allStats.forEach(function (stats, index) {
        if (index <= status) {
            stats.classList.add('red');
            stats.querySelector('.time').classList.remove('hide');
            stats.querySelector('.time').textContent = getTime(
                statusTimings[index]
            );
        }
    });
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
const cartQtys = document.querySelectorAll('.cartQty');

function getSlug(pizza) {
    return pizza.name.toLowerCase().split(' ').join('-') + `-${pizza.size}`;
}

function updateCart(pizza) {
    pizza.slug = getSlug(pizza);
    axios.post('/update-cart', pizza).then(function (res) {
        cartQtys.forEach(function (el) {
            el.textContent = res.data.totalQty;
        });
        notify(
            `${pizza.name} ( ${size[pizza.size]} ) Added to Cart`,
            'success'
        );
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

const totalPrice = document.querySelector('.total-price');

if (cartPizzaItems) {
    cartPizzaItems.forEach(function (card) {
        const pizza = JSON.parse(card.dataset.pizza);
        const plusPizza = card.querySelector('.plusPizza');
        const minusPizza = card.querySelector('.minusPizza');
        const pizzaCount = card.querySelector('.pizzaCount');

        plusPizza.addEventListener('click', function (e) {
            axios.post('/plus-pizza', pizza.data).then(function (res) {
                pizzaCount.textContent = res.data.pizzaQty;
                cartQtys.forEach(function (el) {
                    el.textContent = res.data.totalQty;
                });
                totalPrice.textContent = res.data.totalPrice;
            });
        });

        minusPizza.addEventListener('click', function (e) {
            axios.post('/minus-pizza', pizza.data).then(function (res) {
                if (res.data.pizzaQty === 0) {
                    card.remove();
                }
                pizzaCount.textContent = res.data.pizzaQty;
                cartQtys.forEach(function (el) {
                    el.textContent = res.data.totalQty;
                });
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
        const fnameInp = registerForm.querySelector('#fname');
        const lnameInp = registerForm.querySelector('#lname');
        const emailInp = registerForm.querySelector('#email');
        const passwordInp = registerForm.querySelector('#password');
        const passwordCInp = registerForm.querySelector('#passwordConfirm');
        console.log({
            name: `${fnameInp.value} ${lnameInp.value}`,
            email: emailInp.value,
            password: passwordInp.value,
            passwordConfirm: passwordCInp.value,
        });
        axios
            .post('/auth/register', {
                name: `${fnameInp.value} ${lnameInp.value}`,
                email: emailInp.value,
                password: passwordInp.value,
                passwordConfirm: passwordCInp.value,
            })
            .then(function (res) {
                notify(`✅ Registration Successfull`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err.response.data.message);
                notify(`🔴 ${err.response.data.message}`);
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
                notify(`✅ Login Successfull`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err.response.data.message);
                notify(`🔴 ${err.response.data.message}`);
            });
    });

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// < LOGOUT >
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
                notify(`✅ ${res.data.message}`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err);
                notify(`🔴 ${err.response.data.message}`);
            });
    });
});
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// < Update User >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
const updateUser = document.querySelector('.update-user');
const userForm = document.querySelector('#user-details');
if (updateUser) {
    updateUser.addEventListener('click', function (e) {
        e.preventDefault();

        let newUserData = {
            fname: userForm.querySelector('#fname').value,
            lname: userForm.querySelector('#lname').value,
            email: userForm.querySelector('#email').value,
        };

        axios
            .post('/auth/updateUser', newUserData)
            .then(function (res) {
                notify(`✅ ${res.data.message}`);
                window.setTimeout(function () {
                    location.reload();
                }, 4000);
            })
            .catch(function (err) {
                console.log(err);
                notify(`🔴 ${err.response.data.message}`);
            });
    });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// < Update Password >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const userPassForm = document.querySelector('#user-password');
if (userPassForm) {
    userPassForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let newUserData = {
            password: userPassForm.querySelector('#password').value,
            passwordNew: userPassForm.querySelector('#passwordNew').value,
            passwordConfirm:
                userPassForm.querySelector('#passwordConfirm').value,
        };

        axios
            .post('/auth/updatePassword', newUserData)
            .then(function (res) {
                notify(`✅ Password Updated Successfully.`);
                window.setTimeout(function () {
                    location.reload();
                }, 4000);
            })
            .catch(function (err) {
                console.log(err);
                notify(`🔴 ${err.response.data.message}`);
            });
    });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Cart Page < Order Now >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const orderForm = document.querySelector('.order-form');

if (orderForm) {
    const addressInp = orderForm.querySelector('.address');
    const phoneInp = orderForm.querySelector('.phone');
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        axios
            .post('/order/', {
                address: addressInp.value,
                phone: phoneInp.value,
            })
            .then(function (res) {
                notify(`✅ ${res.data.message}`);
                window.setTimeout(function () {
                    location.assign('/');
                }, 2000);
            })
            .catch(function (err) {
                console.log(err);
                notify(`🔴 ${err.response.data.message}`);
            });
    });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// < Display Order Status Customer >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const orderStatusCustomer = document.querySelectorAll('.orderStatus.customer');

if (orderStatusCustomer) {
    orderStatusCustomer.forEach(function (orderStats) {
        const orderData = JSON.parse(orderStats.dataset.order);
        updateOrderStats(orderStats, orderData);
    });
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// < Display Order Status Admin >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const orderStatusAdmin = document.querySelectorAll('.orderStatus.admin');

if (orderStatusAdmin) {
    orderStatusAdmin.forEach(function (orderStats) {
        const orderData = JSON.parse(orderStats.dataset.order);
        updateOrderStats(orderStats, orderData);
    });
}

const changeOrderStatus = document.querySelectorAll('.cahngeOrderStatus');

changeOrderStatus.forEach(function (statSelect) {
    let {id, status} = statSelect.dataset;
    statSelect.value = status;

    statSelect.addEventListener('change', function (e) {
        axios
            .post(`/order/${id}`, {status: e.target.value})
            .then(function (data) {
                const order = data.data.order;
                const currOrderStats = document.querySelector(
                    `#status_${order._id}`
                );
                updateOrderStats(currOrderStats, order);
                notify(`✅ Order Status Updated`);
            })
            .catch(function (err) {
                console.log(err);
                notify(`🔴 ${err.response.data.message}`);
            });
    });
});

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// < Cancle Order >
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

const orderCards = document.querySelectorAll('.orders .card');

if (orderCards) {
    let cardsQty = orderCards.length;
    orderCards.forEach(function (card) {
        const orderID = JSON.parse(card.dataset.order)._id;
        const cancleBtn = card.querySelector('.cancleOrder');
        cancleBtn.addEventListener('click', function (e) {
            axios
                .delete(`/order/${orderID}`)
                .then(function (data) {
                    notify('✅ Order Cancled Successfully');
                    card.remove();
                    cardsQty--;
                    if (!cardsQty) {
                        window.setTimeout(function () {
                            location.reload();
                        }, 4000);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    notify(`🔴 ${err.response.data.message}`);
                });
        });
    });
}

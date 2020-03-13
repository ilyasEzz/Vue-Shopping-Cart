// Materialize 
document.addEventListener('DOMContentLoaded', function () {
    const sideNav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sideNav, {});
});

// Fetching
const api = "http://localhost:3000";

let f = async (path, method = 'get', data = [], useToken = true, form = false) => { //function for work server
    method = method.toUpperCase();
    let options = {
        method: method,
        headers: {}
    }

    if (!form) {
        options.headers['Content-Type'] = `application/json`;
        if (method === 'POST') {
            console.log("Nethod POST");
            options.body = JSON.stringify(data);
            console.log("DATA STRINGIFIED");

        }
    } else {
        let formdata = new FormData();

        for (let name in data) {
            formdata.append(name, data[name]);
        }
        options.body = formdata;
    }

    let result = await fetch(`${api}${path}`, options);



    if (method === "DELETE") {
        return true;
    }
    else if (method === "POST") { return result; }
    else { return await result.json(); }


}

// App
let app = new Vue({
    el: "#app",
    data() {
        return {
            page: "products",
            user: {
                id: 1,
                token: null,
            },
            login: {
                errors: "",
                fields: {
                    email: "ezzil1997@gmail.com",
                    password: "ezzahidilyas"
                }
            },
            products: [],
            cart: [
                {
                    id: 4,
                    name: "product 4",
                    description: "Все последующие запросы требуют авторизации с использованием Bearer-токена.",
                    price: 10000
                },
            ],
            showCart: false
        }
    },
    methods: {
        to(page) {
            this.getProducts();
            this.page = page;
        },
        async getProducts() {
            let result = await f('/products', 'get');
            this.products = result;
        },
        async addToCart(id) {
            let product = this.products.find((product) => product.id === id);
            let productDb = await f(`/products/${id}`, 'get');

            // Check if the product is in the Database
            this.cart.push(product);
            this.cart = [...new Set(this.cart)];
            let allCarts = await f('/cart', 'get');
            let lastIndex = 0;

            if (allCarts.length < 1) {
                lastIndex = allCarts[allCarts.length - 1].id;
            }
            const newCartDb = {
                id: lastIndex + 1,
                user_id: this.user.id,
                product: [...this.cart],

            };
            console.log(newCartDb)
            // POST newCart
            await f('/cart', 'post', newCartDb)

        },
        removeFromCart(id) {
            this.cart = this.cart.filter(product => product.id !== id);
        }

    }
})
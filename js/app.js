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

    let result = await fetch(`${api}${path}`, options);

    return (method === "DELETE") ? true : await result.json();

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
            cart: [],
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
            this.cart.push(product);
            this.cart = [...new Set(this.cart)]

        }
    }
})
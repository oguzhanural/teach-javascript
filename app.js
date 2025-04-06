// DOM Elements
const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const noProductsMessage = document.getElementById('no-products-message');

// Product Class
class Product {
    constructor(id, name, quantity, price, category) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayProducts() {
        const products = Store.getProducts();
        
        if (products.length === 0) {
            noProductsMessage.classList.remove('hidden');
        } else {
            noProductsMessage.classList.add('hidden');
        }
        
        products.forEach((product) => UI.addProductToList(product));
    }
    
    static addProductToList(product) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>$${product.price}</td>
            <td>${product.category}</td>
            <td><button class="btn btn-delete" data-id="${product.id}">Delete</button></td>
        `;
        
        productList.appendChild(row);
    }
    
    static deleteProduct(el) {
        if (el.classList.contains('btn-delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    
    static clearFields() {
        document.getElementById('name').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
        document.getElementById('category').value = '';
    }
    
    static filterProducts(searchText) {
        const products = Store.getProducts();
        const filteredProducts = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.category.toLowerCase().includes(searchText.toLowerCase())
            );
        });
        
        // Clear the product list first
        productList.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            noProductsMessage.classList.remove('hidden');
        } else {
            noProductsMessage.classList.add('hidden');
            filteredProducts.forEach(product => UI.addProductToList(product));
        }
    }
}

// Store Class: Handles Storage
class Store {
    static getProducts() {
        let products;
        if (localStorage.getItem('products') === null) {
            products = [];
        } else {
            products = JSON.parse(localStorage.getItem('products'));
        }
        return products;
    }
    
    static addProduct(product) {
        const products = Store.getProducts();
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    static removeProduct(id) {
        const products = Store.getProducts();
        
        products.forEach((product, index) => {
            if (product.id === id) {
                products.splice(index, 1);
            }
        });
        
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Event: Display Products
document.addEventListener('DOMContentLoaded', UI.displayProducts);

// Event: Add a Product
productForm.addEventListener('submit', (e) => {
    // Prevent default form submission
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    
    // Generate a unique ID
    const id = Date.now().toString();
    
    // Create product
    const product = new Product(id, name, quantity, price, category);
    
    // Add product to UI
    UI.addProductToList(product);
    
    // Add product to store
    Store.addProduct(product);
    
    // Clear fields
    UI.clearFields();
    
    // Hide "no products" message if it was shown
    noProductsMessage.classList.add('hidden');
});

// Event: Remove a Product
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        // Remove product from UI
        UI.deleteProduct(e.target);
        
        // Remove product from store
        Store.removeProduct(e.target.getAttribute('data-id'));
        
        // Show "no products" message if no products left
        if (Store.getProducts().length === 0) {
            noProductsMessage.classList.remove('hidden');
        }
    }
});

// Event: Search/Filter Products
searchInput.addEventListener('input', () => {
    const searchText = searchInput.value;
    UI.filterProducts(searchText);
}); 
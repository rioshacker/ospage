// Products
let products = JSON.parse(localStorage.getItem('products')) || [
  {name: 'Wireless Headphones', price: 129.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', category: 'Electronics'},
  {name: 'Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', category: 'Electronics'},
  {name: 'Summer T-Shirt', price: 24.99, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105', category: 'Fashion'}
];

// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render Products
function renderProducts(filter = 'all') {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  filtered.forEach((p, index) => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button class="btn btn-primary" onclick="addToCart(${index})">Add to Cart</button>
    `;
    container.appendChild(card);
  });

  animateFadeUp();
}

// Filter
function filterProducts(category) {
  renderProducts(category);
}

// Search
const searchBar = document.getElementById('searchBar');
if (searchBar) {
  searchBar.addEventListener('keyup', e => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    filtered.forEach((p, index) => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button class="btn btn-primary" onclick="addToCart(${products.indexOf(p)})">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  });
}

// Add to Cart
function addToCart(index) {
  const item = products[index];
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...item, qty: 1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (cartCount) cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  if (!cartItems) return;

  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div>
          <p>${item.name}</p>
          <p>$${item.price} x ${item.qty}</p>
        </div>
        <div>
          <button onclick="changeQty(${i}, 1)">+</button>
          <button onclick="changeQty(${i}, -1)">-</button>
        </div>
      </div>
    `;
  });
  if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Admin Logic
const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const image = document.getElementById('image').value;
    const category = document.getElementById('category').value;

    products.push({name, price, image, category});
    localStorage.setItem('products', JSON.stringify(products));
    alert('Product Added!');
    form.reset();
    showAdminProducts();
  });
}

function showAdminProducts() {
  const list = document.getElementById('admin-products');
  if (!list) return;

  list.innerHTML = '';
  products.forEach((p, i) => {
    list.innerHTML += `
      <div>${p.name} - $${p.price} (${p.category})
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>`;
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  showAdminProducts();
}

// Cart Sidebar Toggle
const cartSidebar = document.getElementById('cartSidebar');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');

if (cartBtn) cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
if (closeCart) closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));

// Animations
function animateFadeUp() {
  gsap.to('.fade-up', {opacity: 1, y: 0, duration: 0.8, stagger: 0.2});
}

// Init
renderProducts();
updateCartUI();
showAdminProducts();
animateFadeUp();

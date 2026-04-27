// ========== PRODUCT DATABASE ==========
const products = [
    {
        id: 1,
        name: "Vitamin C Serum",
        category: "serum",
        price: 899,
        skinType: ["oily", "combination", "dry"],
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Hydrating Face Wash",
        category: "facewash",
        price: 349,
        skinType: ["dry", "sensitive"],
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Niacinamide Serum",
        category: "serum",
        price: 749,
        skinType: ["oily", "combination"],
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "SPF 50 Sunscreen",
        category: "sunscreen",
        price: 599,
        skinType: ["oily", "dry", "combination", "sensitive"],
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Gel Moisturizer",
        category: "moisturizer",
        price: 499,
        skinType: ["oily", "combination"],
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Salicylic Acid Face Wash",
        category: "facewash",
        price: 399,
        skinType: ["oily", "combination"],
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop"
    },
    {
        id: 7,
        name: "Hyaluronic Acid Serum",
        category: "serum",
        price: 949,
        skinType: ["dry", "sensitive", "combination"],
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=400&h=400&fit=crop"
    },
    {
        id: 8,
        name: "Night Cream",
        category: "moisturizer",
        price: 699,
        skinType: ["dry", "combination"],
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1556229010-aa9dc4b7b5f7?w=400&h=400&fit=crop"
    },
    {
        id: 9,
        name: "Retinol Serum",
        category: "serum",
        price: 1299,
        skinType: ["oily", "combination"],
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop"
    },
    {
        id: 10,
        name: "Gentle Cleanser",
        category: "facewash",
        price: 299,
        skinType: ["sensitive", "dry"],
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    },
    {
        id: 11,
        name: "Mineral Sunscreen SPF 30",
        category: "sunscreen",
        price: 549,
        skinType: ["sensitive", "dry"],
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&h=400&fit=crop"
    },
    {
        id: 12,
        name: "Rich Moisturizer",
        category: "moisturizer",
        price: 799,
        skinType: ["dry", "sensitive"],
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1585652757173-57de5e9fab42?w=400&h=400&fit=crop"
    }
];

const API_BASE_URL = 'http://localhost:5000';
const APP_BASE_PATH = '/Skin_Care';

function navigateTo(pageName) {
    window.location.href = `${APP_BASE_PATH}/${pageName}`;
}

// ========== CART MANAGEMENT ==========
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login to add items to cart', 'error');
        setTimeout(() => {
            navigateTo('login.html');
        }, 1500);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    
    // If on cart page, re-render
    if (window.location.pathname.includes('cart.html')) {
        if (typeof renderCart === 'function') {
            renderCart();
        }
    }
    
    updateCartCount();
    showToast('Item removed from cart', 'success');
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}

// ========== PRODUCT RENDERING ==========
function renderProducts(productList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (productList.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class='bx bx-search' style="font-size: 4rem; color: var(--text-light);"></i>
                <h3 style="color: var(--text-dark); margin-top: 1rem;">No products found</h3>
                <p style="color: var(--text-light);">Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productList.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="handleImageError(this, '${product.name.replace(/'/g, "\\'")}')">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class='bx bx-cart-add'></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleImageError(imgElement, productName) {
    const safeName = encodeURIComponent(productName || 'Skincare Product');
    imgElement.onerror = null;
    imgElement.src = `https://placehold.co/600x600/eaf4ff/2d5f8d?text=${safeName}`;
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== USER LOGIN CHECK ==========
function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('fullname');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
}

function closeSettingsMenu() {
    const menu = document.querySelector('.settings-menu');
    if (menu) menu.classList.remove('show');
}

function openSettingsMenu() {
    const menu = document.querySelector('.settings-menu');
    if (menu) menu.classList.toggle('show');
}

function createSettingsMenu() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions || navActions.querySelector('.settings-menu')) return;

    const menu = document.createElement('div');
    menu.className = 'settings-menu';
    menu.innerHTML = `
        <button class="settings-item" type="button" onclick="goToDashboard()">
            <i class='bx bx-grid-alt'></i> Dashboard
        </button>
        <button class="settings-item" type="button" onclick="logoutUser()">
            <i class='bx bx-log-out'></i> Logout
        </button>
        <button class="settings-item danger" type="button" onclick="deleteCurrentAccount()">
            <i class='bx bx-trash'></i> Delete Account
        </button>
    `;
    navActions.appendChild(menu);
}

function goToDashboard() {
    closeSettingsMenu();
    navigateTo('dashboard.html');
}

function logoutUser() {
    closeSettingsMenu();
    clearSession();
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        navigateTo('index.html');
    }, 700);
}

async function deleteCurrentAccount() {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login first', 'error');
        return;
    }

    const confirmed = confirm('Delete your account permanently? This cannot be undone.');
    if (!confirmed) return;

    try {
        const response = await fetch('http://localhost:5000/users/me', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            showToast(data.message || 'Unable to delete account', 'error');
            return;
        }

        clearSession();
        showToast('Account deleted successfully', 'success');
        setTimeout(() => {
            navigateTo('index.html');
        }, 900);
    } catch (error) {
        showToast('Cannot connect to server', 'error');
    }
}

async function syncUserProfileFromBackend() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            clearSession();
            return;
        }

        const data = await response.json();
        if (!data.success || !data.user) {
            clearSession();
            return;
        }

        localStorage.setItem('username', data.user.username || '');
        localStorage.setItem('fullname', data.user.fullname || '');
        localStorage.setItem('email', data.user.email || '');
        localStorage.setItem('userId', String(data.user.id));
    } catch (error) {
        // Keep existing local data if server is temporarily unavailable.
    }
}

function checkUserLogin() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const loginButtons = document.querySelectorAll('.btn-login');
    const userDisplayElements = document.querySelectorAll('#userDisplay');
    
    if (token && username) {
        createSettingsMenu();
        userDisplayElements.forEach(el => {
            el.textContent = `${username} \u25BE`;
        });
        loginButtons.forEach(btn => {
            btn.onclick = openSettingsMenu;
        });
    } else {
        userDisplayElements.forEach(el => {
            el.textContent = 'Login';
        });
        loginButtons.forEach(btn => {
            btn.onclick = checkLoginAndRedirect;
        });
    }
}

function checkLoginAndRedirect() {
    const token = localStorage.getItem('token');
    if (token) {
        openSettingsMenu();
    } else {
        navigateTo('login.html');
    }
}

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    await syncUserProfileFromBackend();
    checkUserLogin();
    document.addEventListener('click', (event) => {
        const insideActions = event.target.closest('.nav-actions');
        if (!insideActions) {
            closeSettingsMenu();
        }
    });
});
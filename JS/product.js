// ========== PRODUCTS PAGE LOGIC ==========

// State management
let filteredProducts = [...products];
let selectedCategories = ['all'];
let selectedSkinTypes = [];
let maxPrice = 5000;

// ========== INITIALIZE PAGE ==========
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(filteredProducts, 'productsGrid');
    updateProductCount();
    initializePriceSlider();
});

// ========== PRICE SLIDER ==========
function initializePriceSlider() {
    const priceRange = document.getElementById('priceRange');
    const maxPriceLabel = document.getElementById('maxPrice');
    
    if (!priceRange) return;
    
    priceRange.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value);
        maxPriceLabel.textContent = `₹${maxPrice}`;
        applyFilters();
    });
}

// ========== CATEGORY FILTER ==========
function filterByCategory(checkbox) {
    const value = checkbox.value;
    
    if (value === 'all') {
        // If "All" is checked, uncheck all others
        if (checkbox.checked) {
            selectedCategories = ['all'];
            document.querySelectorAll('.filter-checkbox input[value]:not([value="all"])').forEach(cb => {
                cb.checked = false;
            });
        }
    } else {
        // Uncheck "All" when any specific category is selected
        const allCheckbox = document.querySelector('.filter-checkbox input[value="all"]');
        if (allCheckbox) allCheckbox.checked = false;
        
        if (checkbox.checked) {
            selectedCategories = selectedCategories.filter(c => c !== 'all');
            selectedCategories.push(value);
        } else {
            selectedCategories = selectedCategories.filter(c => c !== value);
        }
        
        // If no categories selected, select "All"
        if (selectedCategories.length === 0) {
            selectedCategories = ['all'];
            if (allCheckbox) allCheckbox.checked = true;
        }
    }
    
    applyFilters();
}

// ========== SKIN TYPE FILTER ==========
function filterBySkinType(checkbox) {
    const value = checkbox.value;
    
    if (checkbox.checked) {
        selectedSkinTypes.push(value);
    } else {
        selectedSkinTypes = selectedSkinTypes.filter(t => t !== value);
    }
    
    applyFilters();
}

// ========== APPLY ALL FILTERS ==========
function applyFilters() {
    filteredProducts = products.filter(product => {
        // Price filter
        if (product.price > maxPrice) return false;
        
        // Category filter
        if (!selectedCategories.includes('all')) {
            if (!selectedCategories.includes(product.category)) return false;
        }
        
        // Skin type filter
        if (selectedSkinTypes.length > 0) {
            const hasMatchingSkinType = selectedSkinTypes.some(type => 
                product.skinType.includes(type)
            );
            if (!hasMatchingSkinType) return false;
        }
        
        return true;
    });
    
    renderProducts(filteredProducts, 'productsGrid');
    updateProductCount();
}

// ========== RESET FILTERS ==========
function resetFilters() {
    // Reset price slider
    const priceRange = document.getElementById('priceRange');
    const maxPriceLabel = document.getElementById('maxPrice');
    if (priceRange) {
        priceRange.value = 5000;
        maxPrice = 5000;
        maxPriceLabel.textContent = '₹5000';
    }
    
    // Reset category checkboxes
    document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    selectedCategories = ['all'];
    
    // Reset skin type checkboxes
    selectedSkinTypes = [];
    
    // Apply filters
    applyFilters();
    
    showToast('Filters reset', 'success');
}

// ========== UPDATE PRODUCT COUNT ==========
function updateProductCount() {
    const countElement = document.getElementById('productCount');
    if (!countElement) return;
    
    const count = filteredProducts.length;
    const total = products.length;
    
    if (count === total) {
        countElement.textContent = `Showing all ${total} products`;
    } else {
        countElement.textContent = `Showing ${count} of ${total} products`;
    }
}
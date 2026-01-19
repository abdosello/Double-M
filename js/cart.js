/**
 * Double M Accessories - Cart Module
 * Shopping cart functionality with localStorage persistence
 */

// Cart Storage Key
const CART_STORAGE_KEY = 'doublem_cart';

// ==========================================
// Cart State
// ==========================================

let cart = [];

// ==========================================
// Cart Functions
// ==========================================

function initCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update main cart badge
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update mobile cart badge
    const mobileBadge = document.getElementById('mobileCartBadge');
    if (mobileBadge) {
        mobileBadge.textContent = totalItems;
        mobileBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(product, quantity = 1, size = null, color = null) {
    // Create unique key for cart item
    const cartKey = `${product._id}-${size || 'nosize'}-${color || 'nocolor'}`;
    
    // Use sale price if available, otherwise regular price
    const finalPrice = (product.sale_price && product.sale_price < product.price) ? product.sale_price : product.price;
    
    // Check if item already exists
    const existingIndex = cart.findIndex(item => 
        item.product_id === product._id && 
        item.size === size && 
        item.color === color
    );
    
    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            cart_key: cartKey,
            product_id: product._id,
            name: product.name,
            name_ar: product.name_ar || product.name,
            price: finalPrice,
            original_price: product.price,
            image_url: product.image_url,
            size: size,
            color: color,
            quantity: quantity
        });
    }
    
    saveCart();
}

function removeFromCart(cartKey) {
    cart = cart.filter(item => item.cart_key !== cartKey);
    saveCart();
    renderCart();
    showToast(t('removed_from_cart'), 'success');
}

function updateCartItemQuantity(cartKey, newQuantity) {
    const item = cart.find(item => item.cart_key === cartKey);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(cartKey);
        } else {
            item.quantity = Math.min(10, newQuantity);
            saveCart();
            renderCart();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

function getCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const settings = AppState.settings;
    const shippingFee = settings.shipping_fee || 50;
    const freeShippingThreshold = settings.free_shipping_threshold || 500;
    
    const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
}

// ==========================================
// Cart Rendering
// ==========================================

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    const cartContainer = document.getElementById('cartContainer');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartContainer?.classList.add('hidden');
        emptyCart?.classList.remove('hidden');
        return;
    }
    
    cartContainer?.classList.remove('hidden');
    emptyCart?.classList.add('hidden');
    
    // Render cart items
    cartItemsContainer.innerHTML = cart.map(item => {
        const name = AppState.currentLang === 'ar' && item.name_ar ? item.name_ar : item.name;
        
        let optionsText = [];
        if (item.size) optionsText.push(`Size: ${item.size}`);
        if (item.color) optionsText.push(`Color: ${item.color}`);
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image_url}" alt="${name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${name}</h4>
                    ${optionsText.length > 0 ? `<p class="cart-item-options">${optionsText.join(' | ')}</p>` : ''}
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button type="button" onclick="updateCartItemQuantity('${item.cart_key}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${item.quantity}" min="1" max="10" readonly>
                            <button type="button" onclick="updateCartItemQuantity('${item.cart_key}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.cart_key}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update summary
    const { subtotal, shipping, total } = getCartTotal();
    
    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartShipping').textContent = shipping === 0 
        ? t('free_shipping') 
        : formatPrice(shipping);
    document.getElementById('cartTotal').textContent = formatPrice(total);
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast(t('empty_cart'), 'warning');
        return;
    }
    
    navigateTo('checkout');
}

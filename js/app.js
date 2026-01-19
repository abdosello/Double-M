/**
 * Double M Accessories - Main Application
 * Core functionality and API interactions
 */

// ==========================================
// Configuration
// ==========================================

// API Base URL - Change this for production
const API_URL = 'http://localhost:5000';

// App State
const AppState = {
    products: [],
    settings: {},
    currentLang: 'en',
    currentSection: 'home',
    currentProduct: null,
    isLoading: false
};

// ==========================================
// Translations
// ==========================================

const translations = {
    en: {
        // Navigation
        nav_home: 'Home',
        nav_products: 'Products',
        nav_cart: 'Cart',
        
        // Hero
        hero_title: 'Elevate Your Style',
        hero_subtitle: 'Premium Men\'s Accessories for the Modern Gentleman',
        shop_now: 'Shop Now',
        
        // Categories
        categories: 'Categories',
        cat_rings: 'Rings',
        cat_bracelets: 'Bracelets',
        cat_wallets: 'Wallets',
        cat_watches: 'Watches',
        cat_necklaces: 'Necklaces',
        cat_all: 'All Products',
        
        // Products
        featured: 'Featured Products',
        filter_category: 'Category:',
        search_placeholder: 'Search products...',
        no_products: 'No products found',
        add_to_cart: 'Add to Cart',
        view_product: 'Quick View',
        
        // Product Modal
        select_size: 'Select Size *',
        select_color: 'Select Color *',
        quantity: 'Quantity',
        size_required: 'Please select a size',
        color_required: 'Please select a color',
        
        // Cart
        your_cart: 'Your Cart',
        order_summary: 'Order Summary',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        empty_cart: 'Your cart is empty',
        continue_shopping: 'Continue Shopping',
        free_shipping: 'Free Shipping',
        
        // Checkout
        customer_info: 'Customer Information',
        full_name: 'Full Name *',
        name_placeholder: 'Enter your full name',
        phone: 'Phone Number *',
        governorate: 'Governorate *',
        select_governorate: 'Select Governorate',
        address: 'Detailed Address *',
        address_placeholder: 'Street, Building, Floor, Apartment',
        notes: 'Order Notes (Optional)',
        notes_placeholder: 'Any special instructions...',
        payment_method: 'Payment Method',
        cod: 'Cash on Delivery',
        place_order: 'Place Order',
        
        // Success
        order_success: 'Order Placed Successfully!',
        success_message: 'We will contact you via WhatsApp very soon.',
        back_home: 'Back to Home',
        
        // Footer
        footer_tagline: 'Premium Men\'s Accessories',
        quick_links: 'Quick Links',
        follow_us: 'Follow Us',
        rights: 'All rights reserved.',
        
        // Messages
        added_to_cart: 'Added to cart!',
        removed_from_cart: 'Removed from cart',
        cart_updated: 'Cart updated',
        error_occurred: 'An error occurred. Please try again.',
        loading: 'Loading...'
    },
    ar: {
        // Navigation
        nav_home: 'الرئيسية',
        nav_products: 'المنتجات',
        nav_cart: 'السلة',
        
        // Hero
        hero_title: 'ارتقِ بأناقتك',
        hero_subtitle: 'إكسسوارات رجالية فاخرة للرجل العصري',
        shop_now: 'تسوق الآن',
        
        // Categories
        categories: 'التصنيفات',
        cat_rings: 'خواتم',
        cat_bracelets: 'أساور',
        cat_wallets: 'محافظ',
        cat_watches: 'ساعات',
        cat_necklaces: 'سلاسل',
        cat_all: 'كل المنتجات',
        
        // Products
        featured: 'منتجات مميزة',
        filter_category: 'التصنيف:',
        search_placeholder: 'ابحث عن منتج...',
        no_products: 'لا توجد منتجات',
        add_to_cart: 'أضف للسلة',
        view_product: 'عرض سريع',
        
        // Product Modal
        select_size: 'اختر المقاس *',
        select_color: 'اختر اللون *',
        quantity: 'الكمية',
        size_required: 'يرجى اختيار المقاس',
        color_required: 'يرجى اختيار اللون',
        
        // Cart
        your_cart: 'سلة التسوق',
        order_summary: 'ملخص الطلب',
        subtotal: 'المجموع الفرعي',
        shipping: 'الشحن',
        total: 'الإجمالي',
        checkout: 'إتمام الشراء',
        empty_cart: 'سلة التسوق فارغة',
        continue_shopping: 'متابعة التسوق',
        free_shipping: 'شحن مجاني',
        
        // Checkout
        customer_info: 'بيانات العميل',
        full_name: 'الاسم الكامل *',
        name_placeholder: 'أدخل اسمك الكامل',
        phone: 'رقم الهاتف *',
        governorate: 'المحافظة *',
        select_governorate: 'اختر المحافظة',
        address: 'العنوان التفصيلي *',
        address_placeholder: 'الشارع، المبنى، الدور، الشقة',
        notes: 'ملاحظات الطلب (اختياري)',
        notes_placeholder: 'أي تعليمات خاصة...',
        payment_method: 'طريقة الدفع',
        cod: 'الدفع عند الاستلام',
        place_order: 'تأكيد الطلب',
        
        // Success
        order_success: 'تم تأكيد طلبك بنجاح!',
        success_message: 'سنتواصل معك عبر الواتساب قريباً.',
        back_home: 'العودة للرئيسية',
        
        // Footer
        footer_tagline: 'إكسسوارات رجالية فاخرة',
        quick_links: 'روابط سريعة',
        follow_us: 'تابعنا',
        rights: 'جميع الحقوق محفوظة.',
        
        // Messages
        added_to_cart: 'تمت الإضافة للسلة!',
        removed_from_cart: 'تم الحذف من السلة',
        cart_updated: 'تم تحديث السلة',
        error_occurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        loading: 'جاري التحميل...'
    }
};

// ==========================================
// Utility Functions
// ==========================================

// Get translation
function t(key) {
    return translations[AppState.currentLang][key] || key;
}

// Format price
function formatPrice(price) {
    return `${price.toLocaleString()} EGP`;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-circle'
    };
    
    toast.className = `toast ${type}`;
    toastIcon.className = `toast-icon ${icons[type] || icons.success}`;
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// API Request helper
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==========================================
// Navigation
// ==========================================

function navigateTo(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');
    
    // Update state
    AppState.currentSection = section;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load section-specific data
    if (section === 'products') {
        renderProducts();
    } else if (section === 'cart') {
        renderCart();
    } else if (section === 'checkout') {
        renderCheckout();
    }
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// ==========================================
// Language Toggle
// ==========================================

function toggleLanguage() {
    AppState.currentLang = AppState.currentLang === 'en' ? 'ar' : 'en';
    
    // Update document direction
    document.documentElement.dir = AppState.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = AppState.currentLang;
    
    // Update toggle button
    document.getElementById('langText').textContent = AppState.currentLang === 'en' ? 'AR' : 'EN';
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.dataset.translatePlaceholder;
        el.placeholder = t(key);
    });
    
    // Save preference
    localStorage.setItem('doublem_lang', AppState.currentLang);
    
    // Re-render current section
    if (AppState.currentSection === 'products') {
        renderProducts();
    } else if (AppState.currentSection === 'cart') {
        renderCart();
    } else if (AppState.currentSection === 'home') {
        renderFeaturedProducts();
    }
}

// ==========================================
// Settings & Configuration
// ==========================================

async function loadSettings() {
    try {
        const response = await apiRequest('/api/settings/public');
        if (response.success) {
            AppState.settings = response.data;
            applySettings();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Use defaults
        AppState.settings = {
            whatsapp_number: '+201023912388',
            facebook_url: '#',
            instagram_url: 'https://www.instagram.com/doublem_accessoriess?igsh=MWd6YTBkeW9vMm9taQ==',
            tiktok_url: '#',
            shipping_fee: 50,
            free_shipping_threshold: 500
        };
        applySettings();
    }
}

function applySettings() {
    const settings = AppState.settings;
    
    // WhatsApp button
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn && settings.whatsapp_number) {
        const phone = settings.whatsapp_number.replace(/\D/g, '');
        whatsappBtn.href = `https://wa.me/${phone}`;
    }
    
    // Social links
    const facebookLink = document.getElementById('facebookLink');
    if (facebookLink && settings.facebook_url) {
        facebookLink.href = settings.facebook_url;
    }
    
    const instagramLink = document.getElementById('instagramLink');
    if (instagramLink && settings.instagram_url) {
        instagramLink.href = settings.instagram_url;
    }
    
    const tiktokLink = document.getElementById('tiktokLink');
    if (tiktokLink && settings.tiktok_url) {
        tiktokLink.href = settings.tiktok_url;
    }
}

// ==========================================
// Products
// ==========================================

async function loadProducts() {
    try {
        const response = await apiRequest('/api/products');
        if (response.success) {
            AppState.products = response.data;
            renderFeaturedProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showToast(t('error_occurred'), 'error');
    }
}

function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = AppState.products.filter(p => p.featured).slice(0, 8);
    const productsToShow = featured.length > 0 ? featured : AppState.products.slice(0, 8);
    
    container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

function renderProducts(category = 'all', searchQuery = '') {
    const container = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyProducts');
    if (!container) return;
    
    let filtered = [...AppState.products];
    
    // Filter by category
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Filter by search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            (p.name_ar && p.name_ar.includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        container.innerHTML = filtered.map(product => createProductCard(product)).join('');
    }
}

function createProductCard(product) {
    const name = AppState.currentLang === 'ar' && product.name_ar ? product.name_ar : product.name;
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const outOfStock = product.stock !== undefined && product.stock <= 0;
    
    const priceDisplay = hasDiscount 
        ? `<span class="original-price">${formatPrice(product.price)}</span><span class="sale-price">${formatPrice(product.sale_price)}</span>`
        : `${formatPrice(product.price)}`;
    
    return `
        <div class="product-card ${outOfStock ? 'out-of-stock' : ''}" onclick="openProductModal('${product._id}')">
            <div class="product-image">
                <img src="${product.image_url}" alt="${name}" loading="lazy">
                ${product.featured ? `<span class="product-badge">Featured</span>` : ''}
                ${hasDiscount && !outOfStock ? `<span class="product-badge sale-badge">Sale</span>` : ''}
                ${outOfStock ? `<span class="product-badge out-of-stock-badge">Out of Stock</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${name}</h3>
                <p class="product-price">${priceDisplay}</p>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); quickAddToCart('${product._id}')" ${outOfStock ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> ${outOfStock ? 'Out of Stock' : t('add_to_cart')}
                </button>
            </div>
        </div>
    `;
}

function filterByCategory(category) {
    navigateTo('products');
    
    // Set filter dropdown
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    
    renderProducts(category);
}

function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const search = document.getElementById('searchInput')?.value || '';
    renderProducts(category, search);
}

// ==========================================
// Product Modal
// ==========================================

function openProductModal(productId) {
    const product = AppState.products.find(p => p._id === productId);
    if (!product) return;
    
    AppState.currentProduct = product;
    
    const modal = document.getElementById('productModal');
    const name = AppState.currentLang === 'ar' && product.name_ar ? product.name_ar : product.name;
    const description = AppState.currentLang === 'ar' && product.description_ar 
        ? product.description_ar 
        : product.description;
    
    // Set main image
    document.getElementById('modalProductImage').src = product.image_url;
    document.getElementById('modalProductImage').alt = name;
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalProductDescription').textContent = description || '';
    
    // Handle sale price
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const outOfStock = product.stock !== undefined && product.stock <= 0;
    const priceElement = document.getElementById('modalProductPrice');
    
    let priceHTML = '';
    if (hasDiscount) {
        priceHTML = `<span class="original-price">${formatPrice(product.price)}</span> <span class="sale-price">${formatPrice(product.sale_price)}</span>`;
    } else {
        priceHTML = formatPrice(product.price);
    }
    
    if (outOfStock) {
        priceHTML += ` <span class="out-of-stock-text">- Out of Stock</span>`;
    } else if (product.stock !== undefined && product.stock <= 10) {
        priceHTML += ` <span class="low-stock-text">- Only ${product.stock} left!</span>`;
    }
    
    priceElement.innerHTML = priceHTML;
    
    // Update add to cart button based on stock
    const addToCartBtn = document.getElementById('modalAddToCartBtn');
    if (addToCartBtn) {
        if (outOfStock) {
            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = '<i class="fas fa-times"></i> Out of Stock';
            addToCartBtn.classList.add('btn-disabled');
        } else {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = `<i class="fas fa-cart-plus"></i> ${t('add_to_cart')}`;
            addToCartBtn.classList.remove('btn-disabled');
        }
    }
    
    // Render image thumbnails
    const thumbsContainer = document.getElementById('modalImageThumbs');
    if (thumbsContainer) {
        const allImages = [product.image_url, ...(product.images || [])].filter(img => img);
        if (allImages.length > 1) {
            thumbsContainer.classList.remove('hidden');
            thumbsContainer.innerHTML = allImages.map((img, index) => 
                `<img src="${img}" alt="Thumbnail ${index + 1}" 
                     class="thumb-image ${index === 0 ? 'active' : ''}" 
                     onclick="changeProductImage('${img}', this)">`
            ).join('');
        } else {
            thumbsContainer.classList.add('hidden');
            thumbsContainer.innerHTML = '';
        }
    }
    
    document.getElementById('modalQuantity').value = 1;
    
    // Render sizes
    const sizeGroup = document.getElementById('modalSizeGroup');
    const sizeOptions = document.getElementById('modalSizeOptions');
    if (product.sizes && product.sizes.length > 0) {
        sizeGroup.classList.remove('hidden');
        sizeOptions.innerHTML = product.sizes.map(size => 
            `<button type="button" class="option-btn" onclick="selectSize(this, '${size}')">${size}</button>`
        ).join('');
    } else {
        sizeGroup.classList.add('hidden');
    }
    
    // Render colors
    const colorGroup = document.getElementById('modalColorGroup');
    const colorOptions = document.getElementById('modalColorOptions');
    if (product.colors && product.colors.length > 0) {
        colorGroup.classList.remove('hidden');
        colorOptions.innerHTML = product.colors.map(color => {
            const bgColor = getColorCode(color);
            return `<button type="button" class="option-btn color-btn" 
                        style="background-color: ${bgColor}; border-color: ${bgColor};" 
                        onclick="selectColor(this, '${color}')" 
                        title="${color}"></button>`;
        }).join('');
    } else {
        colorGroup.classList.add('hidden');
    }
    
    // Clear selections
    document.getElementById('sizeError')?.classList.add('hidden');
    document.getElementById('colorError')?.classList.add('hidden');
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    AppState.currentProduct = null;
}

function changeProductImage(imageUrl, thumbElement) {
    document.getElementById('modalProductImage').src = imageUrl;
    document.querySelectorAll('.thumb-image').forEach(thumb => thumb.classList.remove('active'));
    if (thumbElement) thumbElement.classList.add('active');
}

function selectSize(btn, size) {
    document.querySelectorAll('#modalSizeOptions .option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    btn.dataset.value = size;
    document.getElementById('sizeError')?.classList.add('hidden');
}

function selectColor(btn, color) {
    document.querySelectorAll('#modalColorOptions .option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    btn.dataset.value = color;
    document.getElementById('colorError')?.classList.add('hidden');
}

function changeQuantity(delta) {
    const input = document.getElementById('modalQuantity');
    let value = parseInt(input.value) + delta;
    value = Math.max(1, Math.min(10, value));
    input.value = value;
}

function getColorCode(colorName) {
    const colors = {
        'black': '#000000',
        'white': '#ffffff',
        'silver': '#c0c0c0',
        'gold': '#d4af37',
        'rose gold': '#b76e79',
        'brown': '#8b4513',
        'navy': '#000080',
        'red': '#dc3545',
        'blue': '#0d6efd',
        'green': '#198754',
        'gray': '#6c757d',
        'grey': '#6c757d'
    };
    
    return colors[colorName.toLowerCase()] || colorName;
}

function addToCartFromModal() {
    const product = AppState.currentProduct;
    if (!product) return;
    
    // Check stock
    if (product.stock !== undefined && product.stock <= 0) {
        showToast('Sorry, this product is out of stock', 'error');
        return;
    }
    
    let valid = true;
    
    // Validate size if required
    if (product.sizes && product.sizes.length > 0) {
        const selectedSize = document.querySelector('#modalSizeOptions .option-btn.selected');
        if (!selectedSize) {
            document.getElementById('sizeError')?.classList.remove('hidden');
            valid = false;
        }
    }
    
    // Validate color if required
    if (product.colors && product.colors.length > 0) {
        const selectedColor = document.querySelector('#modalColorOptions .option-btn.selected');
        if (!selectedColor) {
            document.getElementById('colorError')?.classList.remove('hidden');
            valid = false;
        }
    }
    
    if (!valid) return;
    
    // Get selected values
    const size = document.querySelector('#modalSizeOptions .option-btn.selected')?.dataset.value || null;
    const color = document.querySelector('#modalColorOptions .option-btn.selected')?.dataset.value || null;
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    
    // Add to cart
    addToCart(product, quantity, size, color);
    
    // Close modal
    closeModal();
    
    // Show success message
    showToast(t('added_to_cart'), 'success');
    
    // Navigate to cart
    navigateTo('cart');
}

function quickAddToCart(productId) {
    const product = AppState.products.find(p => p._id === productId);
    if (!product) return;
    
    // Check stock
    if (product.stock !== undefined && product.stock <= 0) {
        showToast('Sorry, this product is out of stock', 'error');
        return;
    }
    
    // If product has sizes or colors, open modal
    if ((product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)) {
        openProductModal(productId);
        return;
    }
    
    // Otherwise add directly
    addToCart(product, 1, null, null);
    showToast(t('added_to_cart'), 'success');
}

// ==========================================
// Initialization
// ==========================================

async function initApp() {
    // Load saved language preference
    const savedLang = localStorage.getItem('doublem_lang');
    if (savedLang === 'ar') {
        AppState.currentLang = 'ar';
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
        document.getElementById('langText').textContent = 'EN';
        
        // Update translations
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            el.textContent = t(key);
        });
    }
    
    // Load data
    await Promise.all([
        loadSettings(),
        loadProducts()
    ]);
    
    // Initialize cart
    initCart();
    
    // Restore last order ID if on success page
    const lastOrderId = localStorage.getItem('doublem_last_order');
    if (lastOrderId) {
        const successOrderEl = document.getElementById('successOrderId');
        if (successOrderEl) {
            successOrderEl.textContent = lastOrderId;
        }
    }
    
    // Hide loader
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 500);
}

// Close modal on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Double M Accessories - Admin Panel JavaScript
 * Dashboard, Products, Orders, and Settings management
 */

// ==========================================
// Configuration
// ==========================================

// API Base URL - Change this for production
const API_URL = 'http://localhost:5000';

// Admin State
let adminToken = '';
let products = [];
let orders = [];
let settings = {};
let currentEditProduct = null;

// ==========================================
// Authentication
// ==========================================

async function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginError.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            adminToken = password;
            localStorage.setItem('doublem_admin_token', adminToken);
            showDashboard();
        } else {
            loginError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Connection error. Please try again.';
        loginError.classList.remove('hidden');
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
}

function logout() {
    adminToken = '';
    localStorage.removeItem('doublem_admin_token');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('adminPassword').value = '';
}

function checkAuth() {
    const savedToken = localStorage.getItem('doublem_admin_token');
    if (savedToken) {
        adminToken = savedToken;
        showDashboard();
    }
}

// ==========================================
// Dashboard
// ==========================================

async function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    
    // Load initial data
    await Promise.all([
        loadStats(),
        loadProducts(),
        loadOrders(),
        loadSettings()
    ]);
}

async function loadStats() {
    try {
        const response = await apiRequest('/api/orders/stats');
        if (response.success) {
            const stats = response.data;
            document.getElementById('totalOrders').textContent = stats.totalOrders;
            document.getElementById('pendingOrders').textContent = stats.pendingOrders;
            document.getElementById('totalRevenue').textContent = `${stats.totalRevenue.toLocaleString()} EGP`;
        }
        
        // Product count
        document.getElementById('totalProducts').textContent = products.length;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ==========================================
// Navigation
// ==========================================

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        products: 'Products',
        orders: 'Orders',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
    
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('active');
    
    // Refresh data
    if (section === 'orders') {
        loadOrders();
    } else if (section === 'products') {
        renderProductsTable();
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// ==========================================
// API Helper
// ==========================================

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
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
// Products Management
// ==========================================

async function loadProducts() {
    try {
        const response = await apiRequest('/api/products/all');
        if (response.success) {
            products = response.data;
            renderProductsTable();
            document.getElementById('totalProducts').textContent = products.length;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTable');
    if (!tbody) return;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;">No products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        const hasDiscount = product.sale_price && product.sale_price < product.price;
        const priceDisplay = hasDiscount 
            ? `<span style="text-decoration:line-through;color:#999;">${product.price.toLocaleString()} EGP</span><br><strong style="color:#d32f2f;">${product.sale_price.toLocaleString()} EGP</strong>`
            : `<strong>${product.price.toLocaleString()} EGP</strong>`;
        
        const stockDisplay = product.stock > 10 
            ? `<span style="color:#28a745;">${product.stock}</span>`
            : product.stock > 0 
                ? `<span style="color:#ffc107;">${product.stock} (Low)</span>`
                : `<span style="color:#dc3545;">Out of Stock</span>`;
        
        return `
            <tr>
                <td><img src="${product.image_url}" alt="${product.name}"></td>
                <td>
                    <strong>${product.name}</strong>
                    ${product.name_ar ? `<br><small style="color:#666;">${product.name_ar}</small>` : ''}
                </td>
                <td>${stockDisplay}</td>
                <td>${priceDisplay}</td>
                <td>${product.featured ? '<span class="status-badge status-confirmed">Yes</span>' : 'No'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" onclick="editProduct('${product._id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="deleteProduct('${product._id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openProductForm(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');
    
    form.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productActive').checked = true;
    
    // Clear additional image fields
    for (let i = 2; i <= 5; i++) {
        const imgField = document.getElementById(`productImage${i}`);
        if (imgField) imgField.value = '';
    }
    
    if (productId) {
        const product = products.find(p => p._id === productId);
        if (product) {
            currentEditProduct = product;
            title.textContent = 'Edit Product';
            
            document.getElementById('productId').value = product._id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productNameAr').value = product.name_ar || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productSalePrice').value = product.sale_price || '';
            document.getElementById('productStock').value = product.stock || 100;
            document.getElementById('productImage').value = product.image_url;
            
            // Load additional images
            if (product.images && product.images.length > 0) {
                product.images.forEach((img, index) => {
                    const imgField = document.getElementById(`productImage${index + 2}`);
                    if (imgField) imgField.value = img;
                });
            }
            
            document.getElementById('productSizes').value = (product.sizes || []).join(', ');
            document.getElementById('productColors').value = (product.colors || []).join(', ');
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productDescriptionAr').value = product.description_ar || '';
            document.getElementById('productFeatured').checked = product.featured;
            document.getElementById('productActive').checked = product.active !== false;
        }
    } else {
        currentEditProduct = null;
        title.textContent = 'Add Product';
    }
    
    modal.classList.add('active');
}

function closeProductForm() {
    document.getElementById('productModal').classList.remove('active');
    currentEditProduct = null;
}

function editProduct(productId) {
    openProductForm(productId);
}

async function saveProduct(event) {
    event.preventDefault();
    
    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    const productId = document.getElementById('productId').value;
    
    // Parse sizes and colors
    const sizesStr = document.getElementById('productSizes').value;
    const colorsStr = document.getElementById('productColors').value;
    
    const sizes = sizesStr ? sizesStr.split(',').map(s => s.trim()).filter(s => s) : [];
    const colors = colorsStr ? colorsStr.split(',').map(c => c.trim()).filter(c => c) : [];
    
    const productData = {
        name: document.getElementById('productName').value.trim(),
        name_ar: document.getElementById('productNameAr').value.trim() || undefined,
        price: parseFloat(document.getElementById('productPrice').value),
        sale_price: document.getElementById('productSalePrice').value ? parseFloat(document.getElementById('productSalePrice').value) : null,
        stock: parseInt(document.getElementById('productStock').value) || 100,
        category: 'other',
        image_url: document.getElementById('productImage').value.trim(),
        images: [
            document.getElementById('productImage2')?.value.trim(),
            document.getElementById('productImage3')?.value.trim(),
            document.getElementById('productImage4')?.value.trim(),
            document.getElementById('productImage5')?.value.trim()
        ].filter(img => img),
        sizes,
        colors,
        description: document.getElementById('productDescription').value.trim() || undefined,
        description_ar: document.getElementById('productDescriptionAr').value.trim() || undefined,
        featured: document.getElementById('productFeatured').checked,
        active: document.getElementById('productActive').checked
    };
    
    try {
        let response;
        
        if (productId) {
            // Update existing
            response = await apiRequest(`/api/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
        } else {
            // Create new
            response = await apiRequest('/api/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
        }
        
        if (response.success) {
            showToast(productId ? 'Product updated!' : 'Product created!', 'success');
            closeProductForm();
            await loadProducts();
        }
    } catch (error) {
        showToast(error.message || 'Error saving product', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await apiRequest(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.success) {
            showToast('Product deleted!', 'success');
            await loadProducts();
        }
    } catch (error) {
        showToast(error.message || 'Error deleting product', 'error');
    }
}

// ==========================================
// Orders Management
// ==========================================

async function loadOrders() {
    const statusFilter = document.getElementById('orderStatusFilter')?.value || 'all';
    
    try {
        let url = '/api/orders';
        if (statusFilter !== 'all') {
            url += `?status=${statusFilter}`;
        }
        
        const response = await apiRequest(url);
        if (response.success) {
            orders = response.data;
            renderOrdersTable();
            renderRecentOrders();
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Error loading orders', 'error');
    }
}

function renderOrdersTable() {
    const tbody = document.getElementById('ordersTable');
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:30px;">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.createdAt).toLocaleDateString('en-EG');
        const paymentLabels = {
            'cod': 'COD',
            'vodafone_cash': 'Vodafone',
            'instapay': 'InstaPay'
        };
        
        return `
            <tr>
                <td><strong>${order.order_id}</strong></td>
                <td>${date}</td>
                <td>${order.customer_info.name}</td>
                <td><a href="tel:${order.customer_info.phone}">${order.customer_info.phone}</a></td>
                <td>${order.items.length} items</td>
                <td><strong>${order.total.toLocaleString()} EGP</strong></td>
                <td>${paymentLabels[order.payment_method] || order.payment_method}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-view" onclick="viewOrder('${order._id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;
    
    const recent = orders.slice(0, 5);
    
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">No orders yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = recent.map(order => `
        <tr>
            <td><strong>${order.order_id}</strong></td>
            <td>${order.customer_info.name}</td>
            <td>${order.total.toLocaleString()} EGP</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        </tr>
    `).join('');
}

function viewOrder(orderId) {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const details = document.getElementById('orderDetails');
    
    const date = new Date(order.createdAt).toLocaleString('en-EG');
    const paymentLabels = {
        'cod': 'Cash on Delivery',
        'vodafone_cash': 'Vodafone Cash',
        'instapay': 'InstaPay'
    };
    
    details.innerHTML = `
        <div class="order-detail-grid">
            <div class="order-detail-section">
                <h4><i class="fas fa-receipt"></i> Order Info</h4>
                <p><strong>Order ID:</strong> ${order.order_id}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Payment:</strong> ${paymentLabels[order.payment_method]}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            </div>
            
            <div class="order-detail-section">
                <h4><i class="fas fa-user"></i> Customer Info</h4>
                <p><strong>Name:</strong> ${order.customer_info.name}</p>
                <p><strong>Phone:</strong> <a href="tel:${order.customer_info.phone}">${order.customer_info.phone}</a></p>
                <p><strong>Governorate:</strong> ${order.customer_info.governorate}</p>
                <p><strong>Address:</strong> ${order.customer_info.address}</p>
                ${order.customer_info.notes ? `<p><strong>Notes:</strong> ${order.customer_info.notes}</p>` : ''}
            </div>
            
            <div class="order-detail-section">
                <h4><i class="fas fa-calculator"></i> Order Total</h4>
                <p><strong>Subtotal:</strong> ${order.subtotal.toLocaleString()} EGP</p>
                <p><strong>Shipping:</strong> ${order.shipping.toLocaleString()} EGP</p>
                <p style="font-size:1.1rem;"><strong>Total:</strong> ${order.total.toLocaleString()} EGP</p>
            </div>
        </div>
        
        <div class="order-items-list">
            <h4><i class="fas fa-box"></i> Order Items</h4>
            ${order.items.map(item => `
                <div class="order-item-row">
                    <img src="${item.image_url}" alt="${item.name}">
                    <div class="order-item-info">
                        <h5>${item.name}</h5>
                        <p>Qty: ${item.quantity} × ${item.price.toLocaleString()} EGP
                            ${item.size ? ` | Size: ${item.size}` : ''}
                            ${item.color ? ` | Color: ${item.color}` : ''}
                        </p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-status-actions">
            <label>Update Status:</label>
            <select id="orderStatusSelect" onchange="updateOrderStatus('${order._id}', this.value)">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
            <a href="https://wa.me/+20${order.customer_info.phone.replace(/\D/g, '').replace(/^0/, '')}" target="_blank" class="btn btn-primary btn-sm">
                <i class="fab fa-whatsapp"></i> Contact on WhatsApp
            </a>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await apiRequest(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.success) {
            showToast('Order status updated!', 'success');
            await loadOrders();
        }
    } catch (error) {
        showToast(error.message || 'Error updating status', 'error');
    }
}

// ==========================================
// Settings Management
// ==========================================

async function loadSettings() {
    try {
        const response = await apiRequest('/api/settings');
        if (response.success) {
            settings = {};
            response.data.forEach(s => {
                settings[s.key] = s.value;
            });
            populateSettingsForms();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function populateSettingsForms() {
    // Contact
    document.getElementById('whatsappNumber').value = settings.whatsapp_number || '';
    
    // Social
    document.getElementById('facebookUrl').value = settings.facebook_url || '';
    document.getElementById('instagramUrl').value = settings.instagram_url || '';
    document.getElementById('tiktokUrl').value = settings.tiktok_url || '';
    
    // Shipping
    document.getElementById('shippingFee').value = settings.shipping_fee || 50;
    document.getElementById('freeShippingThreshold').value = settings.free_shipping_threshold || 500;
}

async function saveContactSettings(event) {
    event.preventDefault();
    
    try {
        await apiRequest('/api/settings/whatsapp_number', {
            method: 'PUT',
            body: JSON.stringify({
                value: document.getElementById('whatsappNumber').value.trim()
            })
        });
        
        showToast('Contact settings saved!', 'success');
        await loadSettings();
    } catch (error) {
        showToast(error.message || 'Error saving settings', 'error');
    }
}

async function saveSocialSettings(event) {
    event.preventDefault();
    
    try {
        await apiRequest('/api/settings/bulk', {
            method: 'POST',
            body: JSON.stringify({
                settings: [
                    { key: 'facebook_url', value: document.getElementById('facebookUrl').value.trim() },
                    { key: 'instagram_url', value: document.getElementById('instagramUrl').value.trim() },
                    { key: 'tiktok_url', value: document.getElementById('tiktokUrl').value.trim() }
                ]
            })
        });
        
        showToast('Social links saved!', 'success');
        await loadSettings();
    } catch (error) {
        showToast(error.message || 'Error saving settings', 'error');
    }
}

async function saveShippingSettings(event) {
    event.preventDefault();
    
    try {
        await apiRequest('/api/settings/bulk', {
            method: 'POST',
            body: JSON.stringify({
                settings: [
                    { key: 'shipping_fee', value: parseInt(document.getElementById('shippingFee').value) || 0 },
                    { key: 'free_shipping_threshold', value: parseInt(document.getElementById('freeShippingThreshold').value) || 0 }
                ]
            })
        });
        
        showToast('Shipping settings saved!', 'success');
        await loadSettings();
    } catch (error) {
        showToast(error.message || 'Error saving settings', 'error');
    }
}

// ==========================================
// Toast Notification
// ==========================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle'
    };
    
    toast.className = `toast ${type}`;
    toastIcon.className = `toast-icon ${icons[type] || icons.success}`;
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Close modals on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductForm();
        closeOrderModal();
    }
});

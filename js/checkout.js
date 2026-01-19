/**
 * Double M Accessories - Checkout Module
 * Order processing and submission
 */

// ==========================================
// Checkout Rendering
// ==========================================

function renderCheckout() {
    if (cart.length === 0) {
        navigateTo('cart');
        return;
    }
    
    const checkoutItems = document.getElementById('checkoutItems');
    if (!checkoutItems) return;
    
    // Render order items
    checkoutItems.innerHTML = cart.map(item => {
        const name = AppState.currentLang === 'ar' && item.name_ar ? item.name_ar : item.name;
        
        let details = [`x${item.quantity}`];
        if (item.size) details.push(`Size: ${item.size}`);
        if (item.color) details.push(`Color: ${item.color}`);
        
        return `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${item.image_url}" alt="${name}">
                </div>
                <div class="checkout-item-info">
                    <p class="checkout-item-name">${name}</p>
                    <p class="checkout-item-details">${details.join(' | ')} - ${formatPrice(item.price * item.quantity)}</p>
                </div>
            </div>
        `;
    }).join('');
    
    // Update totals
    const { subtotal, shipping, total } = getCartTotal();
    
    document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkoutShipping').textContent = shipping === 0 
        ? t('free_shipping') 
        : formatPrice(shipping);
    document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

// ==========================================
// Order Submission
// ==========================================

async function submitOrder(event) {
    event.preventDefault();
    
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitOrderBtn');
    
    // Get form data
    const formData = new FormData(form);
    const customerInfo = {
        name: formData.get('name')?.trim(),
        phone: formData.get('phone')?.trim(),
        governorate: formData.get('governorate'),
        address: formData.get('address')?.trim(),
        notes: formData.get('notes')?.trim() || ''
    };
    
    // Validate
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.governorate || !customerInfo.address) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number (Egyptian format)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
        showToast('Please enter a valid Egyptian phone number', 'error');
        return;
    }
    
    const paymentMethod = formData.get('payment_method');
    
    // Prepare order data
    const { subtotal, shipping, total } = getCartTotal();
    
    const orderData = {
        customer_info: customerInfo,
        items: cart.map(item => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image_url: item.image_url
        })),
        subtotal,
        shipping,
        total,
        payment_method: paymentMethod
    };
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        const response = await apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        if (response.success) {
            // Save order ID to localStorage for persistence
            localStorage.setItem('doublem_last_order', response.data.order_id);
            
            // Show success page
            document.getElementById('successOrderId').textContent = response.data.order_id;
            
            // Clear cart
            clearCart();
            
            // Navigate to success
            navigateTo('success');
            
            // Reset form
            form.reset();
        } else {
            throw new Error(response.message || 'Order failed');
        }
    } catch (error) {
        console.error('Order error:', error);
        showToast(error.message || t('error_occurred'), 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-check"></i> <span data-translate="place_order">${t('place_order')}</span>`;
    }
}

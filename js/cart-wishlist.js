(function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function updateCounters() {
        const cartCount = document.getElementById('cart-count');
        const wishlistCount = document.getElementById('wishlist-count');
        if (cartCount) cartCount.textContent = cart.length;
        if (wishlistCount) wishlistCount.textContent = wishlist.length;
    }

    function showToast(message, type = 'cart') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function addToCart() {
        const product = {
            id: 'elegante-spray',
            name: 'Elegante Spray',
            price: 89.99,
            image: 'images/parfume1.png'
        };
        
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCounters();
        showToast('✓ Added to cart! 🛒', 'cart');
    }

    function addToWishlist() {
        const product = {
            id: 'elegante-spray',
            name: 'Elegante Spray',
            price: 89.99,
            image: 'images/parfume1.png'
        };
        
        const exists = wishlist.some(item => item.id === product.id);
        if (!exists) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateCounters();
            showToast('❤️ Added to wishlist!', 'wishlist');
        } else {
            showToast('⚠️ Already in wishlist!', 'wishlist');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        updateCounters();
        
        const addToCartBtn = document.querySelector('.btn-primary');
        const addToWishlistBtn = document.querySelector('.btn-secondary');
        const cartIcon = document.getElementById('cartIcon');
        const wishlistIcon = document.getElementById('wishlistIcon');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addToCart();
            });
        }
        
        if (addToWishlistBtn) {
            addToWishlistBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addToWishlist();
            });
        }
        
        if (cartIcon) {
            cartIcon.addEventListener('click', function() {
                if (cart.length === 0) {
                    showToast('Your cart is empty 🛒', 'cart');
                } else {
                    showToast(`Cart has ${cart.length} item(s)`, 'cart');
                }
            });
        }
        
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', function() {
                if (wishlist.length === 0) {
                    showToast('Your wishlist is empty ❤️', 'wishlist');
                } else {
                    showToast(`Wishlist has ${wishlist.length} item(s)`, 'wishlist');
                }
            });
        }
    });
})();
(function () {
    let mode = 'login'; // 'login' | 'register'

    function buildModal() {
        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay';
        overlay.id = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-modal">
                <button class="auth-close" id="auth-close" aria-label="Close">✕</button>
                <h3 id="auth-title">Welcome back</h3>
                <p class="auth-sub" id="auth-subtitle">Sign in for your 20% member discount.</p>
                <form class="auth-form" id="auth-form">
                    <input type="text" id="auth-username" placeholder="Username" style="display:none;">
                    <input type="email" id="auth-email" placeholder="Email address" required>
                    <input type="password" id="auth-password" placeholder="Password" required>
                    <button type="submit" class="auth-submit" id="auth-submit">Sign In</button>
                    <p class="auth-message" id="auth-message"></p>
                </form>
                <p class="auth-switch">
                    <span id="auth-switch-text">Don't have an account?</span>
                    <button type="button" id="auth-switch-btn">Create one</button>
                </p>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function setMode(newMode) {
        mode = newMode;
        const title = document.getElementById('auth-title');
        const subtitle = document.getElementById('auth-subtitle');
        const usernameInput = document.getElementById('auth-username');
        const submitBtn = document.getElementById('auth-submit');
        const switchText = document.getElementById('auth-switch-text');
        const switchBtn = document.getElementById('auth-switch-btn');
        const message = document.getElementById('auth-message');

        message.textContent = '';
        message.className = 'auth-message';

        if (mode === 'login') {
            title.textContent = 'Welcome back';
            subtitle.textContent = 'Sign in for your 20% member discount.';
            usernameInput.style.display = 'none';
            usernameInput.required = false;
            submitBtn.textContent = 'Sign In';
            switchText.textContent = "Don't have an account?";
            switchBtn.textContent = 'Create one';
        } else {
            title.textContent = 'Create your account';
            subtitle.textContent = 'Join Elegante and unlock 20% off instantly.';
            usernameInput.style.display = 'block';
            usernameInput.required = true;
            submitBtn.textContent = 'Create Account';
            switchText.textContent = 'Already have an account?';
            switchBtn.textContent = 'Sign in';
        }
    }

    function openModal() {
        document.getElementById('auth-overlay').classList.add('open');
    }

    function closeModal() {
        document.getElementById('auth-overlay').classList.remove('open');
    }

    function updateAccountButton(user) {
        const btn = document.getElementById('account-btn');
        if (!btn) return;

        if (user) {
            btn.textContent = `👤 ${user.username}`;
            btn.classList.add('is-logged-in');
            btn.dataset.loggedIn = 'true';
        } else {
            btn.textContent = 'Sign In';
            btn.classList.remove('is-logged-in');
            btn.dataset.loggedIn = 'false';
        }

        applyMemberPricing(!!user);
    }

    // Original (pre-member) price shown on the page: $89.99, marked down from $129.99.
    const ORIGINAL_PRICE = 129.99;
    const SALE_PRICE = 89.99;
    const MEMBER_DISCOUNT = 0.20;

    function applyMemberPricing(isLoggedIn) {
        const currentPriceEl = document.querySelector('.current-price');
        const oldPriceEl = document.querySelector('.old-price');
        const discountEl = document.querySelector('.discount');
        const noteEl = document.querySelector('.price-note');
        const pricingBlock = document.querySelector('.product-pricing');
        if (!currentPriceEl) return;

        if (isLoggedIn) {
            const memberPrice = SALE_PRICE * (1 - MEMBER_DISCOUNT);
            const totalOffPct = Math.round((1 - memberPrice / ORIGINAL_PRICE) * 100);

            currentPriceEl.textContent = `$${memberPrice.toFixed(2)}`;
            if (oldPriceEl) oldPriceEl.textContent = `$${ORIGINAL_PRICE.toFixed(2)}`;
            if (discountEl) discountEl.textContent = `-${totalOffPct}%`;
            if (noteEl) noteEl.innerHTML = 'One-time payment · <strong>member price applied (extra 20% off)</strong>';
            if (pricingBlock) pricingBlock.classList.add('member-active');
        } else {
            currentPriceEl.textContent = `$${SALE_PRICE.toFixed(2)}`;
            if (oldPriceEl) oldPriceEl.textContent = `$${ORIGINAL_PRICE.toFixed(2)}`;
            if (discountEl) discountEl.textContent = '-30%';
            if (noteEl) noteEl.textContent = 'One-time payment, lifetime scent memory';
            if (pricingBlock) pricingBlock.classList.remove('member-active');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const message = document.getElementById('auth-message');
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const username = document.getElementById('auth-username').value.trim();

        message.textContent = '';
        message.className = 'auth-message';

        try {
            let result;
            if (mode === 'login') {
                result = await window.ElegAuth.login(email, password);
            } else {
                result = await window.ElegAuth.register(username, email, password);
            }

            if (result.ok && result.data.success) {
                message.textContent = result.data.message || 'Success!';
                message.className = 'auth-message success';
                updateAccountButton(result.data.user);
                setTimeout(closeModal, 900);
            } else {
                message.textContent = result.data.error || 'Something went wrong.';
                message.className = 'auth-message error';
            }
        } catch (err) {
            message.textContent = 'Connection error. Make sure backend is running on port 5001.';
            message.className = 'auth-message error';
        }
    }

    document.addEventListener('DOMContentLoaded', async function () {
        buildModal();

        document.getElementById('auth-close').addEventListener('click', closeModal);
        document.getElementById('auth-overlay').addEventListener('click', function (e) {
            if (e.target.id === 'auth-overlay') closeModal();
        });
        document.getElementById('auth-form').addEventListener('submit', handleSubmit);
        document.getElementById('auth-switch-btn').addEventListener('click', function () {
            setMode(mode === 'login' ? 'register' : 'login');
        });

        const accountBtn = document.getElementById('account-btn');
        if (accountBtn) {
            accountBtn.addEventListener('click', function () {
                if (accountBtn.dataset.loggedIn === 'true') {
                    window.ElegAuth.logout();
                    updateAccountButton(null);
                } else {
                    setMode('login');
                    openModal();
                }
            });
        }

        const user = await window.ElegAuth.checkAuth();
        updateAccountButton(user);
    });
})();
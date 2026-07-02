(function() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            
            const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            if (!emailPattern.test(email)) {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.className = 'message error';
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5001/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    newsletterMessage.textContent = '✅ Successfully subscribed! You will receive future promotions with 10% off!';
                    newsletterMessage.className = 'message success';
                    emailInput.value = '';
                } else if (data.error === 'Email already subscribed') {
                    newsletterMessage.textContent = '📧 You are already subscribed! You will receive future promotions with 10% off!';
                    newsletterMessage.className = 'message success';
                } else {
                    newsletterMessage.textContent = data.error || 'Subscription failed';
                    newsletterMessage.className = 'message error';
                }
            } catch (error) {
                newsletterMessage.textContent = 'Connection error. Make sure backend is running on port 5001';
                newsletterMessage.className = 'message error';
            }
            
            setTimeout(() => {
                newsletterMessage.textContent = '';
                newsletterMessage.className = 'message';
            }, 5000);
        });
    }
})();
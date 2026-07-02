(function() {
    let reviews = JSON.parse(localStorage.getItem('product_reviews')) || [];

    function initDefaultReviews() {
        if (reviews.length === 0) {
            reviews = [
                { name: 'Maria Georgieva', rating: 5, text: 'Amazing product! The scent is perfect and lasts all day. Highly recommend!' },
                { name: 'Ivan Petrov', rating: 4.5, text: 'Great quality and fast shipping. Will buy again!' },
                { name: 'Elena Dimitrova', rating: 5, text: 'The best spray I\'ve ever used. My friends always ask what perfume I\'m wearing.' }
            ];
            localStorage.setItem('product_reviews', JSON.stringify(reviews));
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function generateStarHTML(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    function addReviewToDOM(review) {
        const reviewsContainer = document.querySelector('.reviews-container');
        if (!reviewsContainer) return;
        
        const newReview = document.createElement('div');
        newReview.className = 'review-card animate-on-scroll fade-up';
        
        newReview.innerHTML = `
            <h3>${escapeHtml(review.name)}</h3>
            <div class="stars">
                ${generateStarHTML(review.rating)}
            </div>
            <p>"${escapeHtml(review.text)}"</p>
        `;
        
        reviewsContainer.appendChild(newReview);
    }

    function loadReviews() {
        const reviewsContainer = document.querySelector('.reviews-container');
        if (!reviewsContainer) return;
        
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => addReviewToDOM(review));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    function initStarRating() {
        const stars = document.querySelectorAll('.star-rating span');
        const ratingInput = document.getElementById('rating-value');
        
        if (!stars.length) return;
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                ratingInput.value = value;
                
                stars.forEach((s, index) => {
                    if (index < value) {
                        s.textContent = '★';
                        s.classList.add('active');
                    } else {
                        s.textContent = '☆';
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                stars.forEach((s, index) => {
                    if (index < value) {
                        s.textContent = '★';
                    } else {
                        s.textContent = '☆';
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = parseInt(ratingInput.value);
                stars.forEach((s, index) => {
                    if (index < currentRating) {
                        s.textContent = '★';
                    } else {
                        s.textContent = '☆';
                    }
                });
            });
        });
    }

    function initReviewForm() {
        const form = document.getElementById('review-form');
        const messageDiv = document.getElementById('review-message');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('reviewer-name').value.trim();
                const rating = parseInt(document.getElementById('rating-value').value);
                const text = document.getElementById('review-text').value.trim();
                
                if (!name) {
                    messageDiv.textContent = 'Please enter your name.';
                    messageDiv.className = 'review-message error';
                    return;
                }
                
                if (rating === 0) {
                    messageDiv.textContent = 'Please select a rating.';
                    messageDiv.className = 'review-message error';
                    return;
                }
                
                if (!text) {
                    messageDiv.textContent = 'Please write your review.';
                    messageDiv.className = 'review-message error';
                    return;
                }
                
                const newReview = {
                    name: name,
                    rating: rating,
                    text: text,
                    date: new Date().toISOString()
                };
                
                reviews.unshift(newReview);
                localStorage.setItem('product_reviews', JSON.stringify(reviews));
                
                document.getElementById('reviewer-name').value = '';
                document.getElementById('rating-value').value = '0';
                document.getElementById('review-text').value = '';
                
                const stars = document.querySelectorAll('.star-rating span');
                stars.forEach(star => {
                    star.textContent = '☆';
                    star.classList.remove('active');
                });
                
                loadReviews();
                
                messageDiv.textContent = 'Thank you for your review! It has been added.';
                messageDiv.className = 'review-message success';
                
                const reviewsContainer = document.querySelector('.reviews-container');
                if (reviewsContainer) {
                    reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                setTimeout(() => {
                    if (messageDiv) {
                        messageDiv.textContent = '';
                        messageDiv.className = 'review-message';
                    }
                }, 5000);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        initDefaultReviews();
        initStarRating();
        loadReviews();
        initReviewForm();
    });
})();
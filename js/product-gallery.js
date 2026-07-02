(function() {
    function initProductGallery() {
        const mainImage = document.querySelector('.main-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (!mainImage || thumbnails.length === 0) return;
        
        const firstThumbImg = thumbnails[0]?.querySelector('img');
        if (firstThumbImg && mainImage.src !== firstThumbImg.src) {
            mainImage.src = firstThumbImg.src;
        }
        
        thumbnails.forEach((thumb, index) => {
            if (index === 0) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const thumbnailImg = this.querySelector('img');
                if (!thumbnailImg) return;
                
                mainImage.style.opacity = '0.7';
                mainImage.style.transform = 'scale(0.98)';
                
                mainImage.src = thumbnailImg.src;
                
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'scale(1.05)';
                }
            });
            
            thumb.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductGallery);
    } else {
        initProductGallery();
    }
})();
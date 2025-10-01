const screenWidth = window.innerWidth;
console.log('Ширина экрана:', screenWidth, 'px');

// Для отслеживания изменений размера окна
window.addEventListener('resize', function() {
    const currentWidth = window.innerWidth;
    console.log('Текущая ширина:', currentWidth, 'px');
});

// Tournament footer carousel with horizontal sliding
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.tournament-footer');
    if (!footer) return;

    const carouselTrack = footer.querySelector('.carousel-track');
    let slides = footer.querySelectorAll('.carousel-slide');
    const slideNumberEl = footer.querySelector('.footer-right .slide-number');
    const prevBtn = footer.querySelector('#prev-btn');
    const nextBtn = footer.querySelector('#next-btn');

    if (!carouselTrack || !slides.length || !slideNumberEl || !prevBtn || !nextBtn) return;

    // Dynamically clone first and last slides for infinite effect
    const totalOriginalSlides = slides.length;
    if (totalOriginalSlides < 2) return; // No need for carousel if less than 2 slides

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalOriginalSlides - 1].cloneNode(true);

    carouselTrack.prepend(lastClone);
    carouselTrack.appendChild(firstClone);

    // Re-query slides after cloning
    slides = footer.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    let currentSlide = 1; // Start at first original slide
    let isAnimating = false;
    
    // Auto-slide variables
    let autoSlideInterval = null;
    const autoSlideDelay = 5000;

    // Function to set carousel styles based on number of slides
    function setCarouselStyles() {
        const slideWidthPercentage = 100 / totalSlides;
        
        // Set track width
        carouselTrack.style.width = `${totalSlides * 100}%`;
        
        // Set each slide width
        slides.forEach(slide => {
            slide.style.width = `${slideWidthPercentage}%`;
        });
        
        // Set initial position
        const initialTranslateX = -currentSlide * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${initialTranslateX}%)`;
    }

    function formatSlideNumber(index) {
        // Safe modulo for display index (1 to totalOriginalSlides)
        const displayIndex = ((index - 1) % totalOriginalSlides + totalOriginalSlides) % totalOriginalSlides + 1;
        return displayIndex < 10 ? `0${displayIndex}` : `${displayIndex}`;
    }

    function updateSlideNumber() {
        slideNumberEl.textContent = formatSlideNumber(currentSlide);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    function goToSlide(index, instant = false) {
        if (isAnimating) return;
        isAnimating = true;

        if (instant) {
            carouselTrack.style.transition = 'none';
        } else {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }

        const slideWidthPercentage = 100 / totalSlides;
        const translateX = -index * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        currentSlide = index;
        updateSlideNumber();
        
        setTimeout(() => {
            isAnimating = false;
            
            // Check boundaries for infinite carousel
            if (index === 0) {
                goToSlide(totalSlides - 2, true);
            } else if (index === totalSlides - 1) {
                goToSlide(1, true);
            }
        }, instant ? 0 : 500);
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
        restartAutoSlide();
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
        restartAutoSlide();
    }

    function initCarousel() {
        // Set carousel styles
        setCarouselStyles();
        
        // Start at first original slide (index 1)
        goToSlide(1, true);
        startAutoSlide();
    }

    // Event listeners
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
    });

    footer.addEventListener('mouseenter', stopAutoSlide);
    footer.addEventListener('mouseleave', startAutoSlide);

    // Initialization
    initCarousel();
});
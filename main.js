document.addEventListener('DOMContentLoaded', () => {
    // Перемещение кнопки "Создать аккаунт" между десктопом и мобильной боковой панелью
    const headerBtn = document.querySelector('.header-btn');
    const desktopRightActions = document.querySelector('.right-actions:not(.d-lg-none)');
    const mobileBtnContainer = document.querySelector('.mobile-header-btn-container');

    if (!headerBtn || !desktopRightActions || !mobileBtnContainer) {
        console.error('Required elements for header button not found');
        return;
    }

    function moveHeaderButton() {
        const isMobile = window.innerWidth <= 991.98;

        if (isMobile) {
            // Перемещаем кнопку в мобильную боковую панель
            mobileBtnContainer.appendChild(headerBtn);
            headerBtn.classList.remove('d-none', 'd-lg-block'); // Показываем кнопку на мобильных
            headerBtn.classList.add('d-block'); // Обеспечиваем видимость
        } else {
            // Возвращаем кнопку в десктопный .right-actions
            desktopRightActions.appendChild(headerBtn);
            headerBtn.classList.remove('d-block');
            headerBtn.classList.add('d-none', 'd-lg-block'); // Скрываем на мобильных, показываем на десктопе
        }
    }

    // Выполняем при загрузке страницы
    moveHeaderButton();

    // Отслеживаем изменения размера окна
    window.addEventListener('resize', moveHeaderButton);

    // Существующий код для карусели (не изменяется)
    const footer = document.querySelector('.tournament-footer');
    if (!footer) return;

    const carouselTrack = footer.querySelector('.carousel-track');
    let slides = footer.querySelectorAll('.carousel-slide');
    const slideNumberEl = footer.querySelector('.footer-right .slide-number');
    const prevBtn = footer.querySelector('#prev-btn');
    const nextBtn = footer.querySelector('#next-btn');

    if (!carouselTrack || !slides.length || !slideNumberEl || !prevBtn || !nextBtn) return;

    const totalOriginalSlides = slides.length;
    if (totalOriginalSlides < 2) return;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalOriginalSlides - 1].cloneNode(true);
    carouselTrack.prepend(lastClone);
    carouselTrack.appendChild(firstClone);
    slides = footer.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    let currentSlide = 1;
    let isAnimating = false;
    let autoSlideInterval = null;
    const autoSlideDelay = 5000;

    function setCarouselStyles() {
        const slideWidthPercentage = 100 / totalSlides;
        carouselTrack.style.width = `${totalSlides * 100}%`;
        slides.forEach(slide => {
            slide.style.width = `${slideWidthPercentage}%`;
        });
        const initialTranslateX = -currentSlide * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${initialTranslateX}%)`;
    }

    function formatSlideNumber(index) {
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
        setCarouselStyles();
        goToSlide(1, true);
        startAutoSlide();
    }

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

    initCarousel();

    
});
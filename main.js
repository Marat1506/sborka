document.addEventListener('DOMContentLoaded', () => {


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





    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.getElementById('navbarNav');
    const menuIcon = navbarToggler.querySelector('.menu-icon');

    if (navbarToggler && navbarNav && menuIcon) {
        const originalSrc = menuIcon.src;
        const closeSrc = '/assets/close.png'; // путь к иконке крестика

        navbarNav.addEventListener('show.bs.collapse', function () {
            menuIcon.src = closeSrc;
            menuIcon.alt = 'Закрыть';
        });

        navbarNav.addEventListener('hide.bs.collapse', function () {
            menuIcon.src = originalSrc;
            menuIcon.alt = 'Меню';
        });
    }

    // Функция для переупорядочивания элементов навигации в мобильной версии
    function reorderNavItems(isMobile) {
        const ul = navbarNav ? navbarNav.querySelector('.navbar-nav') : null;
        if (!ul) return;

        // Находим элементы по их содержимому (до очистки)
        const tournamentsLi = ul.querySelector('.dropdown').closest('li'); // li с Турниры (dropdown)
        const communityLi = Array.from(ul.querySelectorAll('.nav-link')).find(link => link.textContent.trim() === 'Сообщество').closest('li');
        const membershipLi = Array.from(ul.querySelectorAll('.nav-link')).find(link => link.textContent.trim() === 'Membership').closest('li');

        if (!tournamentsLi || !communityLi || !membershipLi) return;

        // Очищаем ul
        ul.innerHTML = '';

        if (isMobile) {
            // Мобильный порядок: Сообщество, Турниры, Membership
            // Сообщество вне блока
            ul.appendChild(communityLi);
            // Блок для Турниры и Membership
            const wrapper = document.createElement('div');
            wrapper.classList.add('nav-group');
            wrapper.appendChild(tournamentsLi);
            wrapper.appendChild(membershipLi);
            ul.appendChild(wrapper);
        } else {
            // Десктопный порядок: Турниры, Сообщество, Membership
            ul.appendChild(tournamentsLi);
            ul.appendChild(communityLi);
            ul.appendChild(membershipLi);
        }
    }

    // Альтернативный вариант - просто перемещаем элемент (без клонирования)
    function moveSettingsMenuAlternative() {
        const settingsMenu = document.querySelector('.settings-dropdown');
        const targetBlock = document.querySelector('.info_main_block_one');
        const isMobile = window.innerWidth < 992;

        if (settingsMenu && targetBlock) {
            const isInSidebar = settingsMenu.closest('#navbarNav');

            if (isMobile && !isInSidebar) {
                // Перемещаем оригинальный элемент в сайдбар
                targetBlock.appendChild(settingsMenu);
                settingsMenu.classList.add('mobile-version');

            } else if (!isMobile && isInSidebar) {
                // Возвращаем на место в десктопной версии
                const settingsContainer = document.querySelector('#dropdownMenuButton2').closest('.dropdown');
                if (settingsContainer && settingsMenu.classList.contains('mobile-version')) {
                    settingsContainer.appendChild(settingsMenu);
                    settingsMenu.classList.remove('mobile-version');
                }
            }
        }

        // Переупорядочиваем навигацию при смене вида
        reorderNavItems(isMobile);
    }

    // Инициализация при загрузке
    moveSettingsMenuAlternative();

    // Обработчик изменения размера окна
    window.addEventListener('resize', moveSettingsMenuAlternative);

    // Также обновляем при открытии/закрытии сайдбара (на всякий случай)
    if (navbarNav) {
        navbarNav.addEventListener('show.bs.collapse', moveSettingsMenuAlternative);
        navbarNav.addEventListener('hide.bs.collapse', moveSettingsMenuAlternative);
    }


    const navbarCollapse = document.getElementById('navbarNav');
    let scrollPosition = 0;

    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', function () {
            // Сохраняем текущую позицию скролла
            scrollPosition = window.pageYOffset;

            // Фиксируем body
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function () {
            // Получаем top
            const top = document.body.style.top;

            // Сбрасываем стили
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';

            // Возвращаем страницу на то же место без скачков
            window.scrollTo({
                top: -parseInt(top || '0'),
                behavior: 'instant'
            });
        });
    }







});
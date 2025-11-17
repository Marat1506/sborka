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
        const closeSrc = '/assets/close.png'; 

        navbarNav.addEventListener('show.bs.collapse', function () {
        
            setTimeout(() => {
                menuIcon.src = closeSrc;
                menuIcon.alt = 'Закрыть';
            }, 300); 
        });

        navbarNav.addEventListener('hide.bs.collapse', function () {
            menuIcon.src = originalSrc;
            menuIcon.alt = 'Меню';
        });
    }

    // Функция для перемещения меню из ПК версии в main-footer .footer-nav на мобильной версии
    function moveMenuToFooterNav() {
        const isMobile = window.innerWidth < 992;
        // Ищем меню - либо с классом d-lg-flex, либо в footer
        const desktopMenuInNav = document.querySelector('#navbarNav .navbar-nav.d-lg-flex');
        const desktopMenuInFooter = document.querySelector('#navbarNav .main-footer .footer-nav .navbar-nav');
        const desktopMenu = desktopMenuInNav || desktopMenuInFooter;
        const footerNav = document.querySelector('#navbarNav .main-footer .footer-nav');
        const autorizationBlock = document.querySelector('#navbarNav .autorization');
        
        if (!desktopMenu || !footerNav) return;

        const isInFooter = footerNav.contains(desktopMenu);

        if (isMobile) {
            // На мобильной версии: перемещаем меню в main-footer .footer-nav
            if (!isInFooter) {
                footerNav.appendChild(desktopMenu);
                desktopMenu.classList.remove('d-lg-flex');
            }
        } else {
            // На десктопе: возвращаем меню обратно после autorization блока
            if (isInFooter) {
                // Ищем блок авторизации для правильного размещения
                const authContainer = document.querySelector('#navbarNav .sidebar-auth-container, #navbarNav .info_main');
                if (authContainer && authContainer.nextElementSibling) {
                    authContainer.parentNode.insertBefore(desktopMenu, authContainer.nextElementSibling);
                } else if (authContainer) {
                    authContainer.parentNode.appendChild(desktopMenu);
                } else if (autorizationBlock && autorizationBlock.nextElementSibling) {
                    autorizationBlock.parentNode.insertBefore(desktopMenu, autorizationBlock.nextElementSibling);
                } else if (autorizationBlock) {
                    autorizationBlock.parentNode.appendChild(desktopMenu);
                } else {
                    // Если ничего не найдено, ищем просто после любых элементов авторизации
                    const sidebarAuth = document.querySelector('#navbarNav .sidebar-auth-container');
                    if (sidebarAuth) {
                        sidebarAuth.parentNode.insertBefore(desktopMenu, sidebarAuth.nextElementSibling);
                    }
                }
                desktopMenu.classList.add('d-lg-flex');
            }
        }
    }

    // Инициализация перемещения меню
    setTimeout(moveMenuToFooterNav, 50);

    // Обновляем перемещение при изменении размера окна
    window.addEventListener('resize', moveMenuToFooterNav);

    // Обновляем при открытии/закрытии сайдбара
    if (navbarNav) {
        navbarNav.addEventListener('show.bs.collapse', () => setTimeout(moveMenuToFooterNav, 100));
        navbarNav.addEventListener('hide.bs.collapse', () => setTimeout(moveMenuToFooterNav, 100));
    }


    function reorderNavItems(isMobile) {
        // Эта функция больше не изменяет структуру меню - убрана логика деформации
        // Структура меню остается как на ПК версии
    }

    // Переменная для обработчика клика (чтобы удалять при необходимости)
    let settingsToggleHandler = null;

    // Инициализация toggle для мобильных настроек
    function initMobileSettingsToggle() {
        const settingsImg = document.querySelector('.info_main_block_one img[src*="/assets/settings.png"]');
        const settingsDropdown = document.querySelector('.settings-dropdown');


        if (settingsImg && settingsDropdown) {
            // Удаляем старый обработчик, если есть
            if (settingsToggleHandler) {
                settingsImg.removeEventListener('click', settingsToggleHandler);
            }

            // Новый обработчик
            settingsToggleHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (settingsDropdown.classList.contains('mobile-version')) {
                    settingsDropdown.classList.toggle('show');
                }
            };

            settingsImg.addEventListener('click', settingsToggleHandler);
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
                // Инициализируем toggle только в мобильном режиме
                initMobileSettingsToggle();

            } else if (!isMobile && isInSidebar) {
                // Возвращаем на место в десктопной версии
                const settingsContainer = document.querySelector('#dropdownMenuButton2').closest('.dropdown');
                if (settingsContainer && settingsMenu.classList.contains('mobile-version')) {
                    settingsContainer.appendChild(settingsMenu);
                    settingsMenu.classList.remove('mobile-version');
                    // Снимаем класс show при возврате
                    settingsMenu.classList.remove('show');
                    // Удаляем обработчик
                    const settingsImg = document.querySelector('.info_main_block_one img[src*="/assets/settings.png"]');
                    if (settingsImg && settingsToggleHandler) {
                        settingsImg.removeEventListener('click', settingsToggleHandler);
                        settingsToggleHandler = null;
                    }
                }
            }
        }

        // Логика деформации меню убрана - структура меню остается как на ПК
    }

    // Инициализация при загрузке
    moveSettingsMenuAlternative();

    // Обработчик изменения размера окна
    window.addEventListener('resize', moveSettingsMenuAlternative);

    // Также обновляем при открытии/закрытии сайдбара (на всякий случай)
    if (navbarNav) {
        navbarNav.addEventListener('show.bs.collapse', moveSettingsMenuAlternative);
        navbarNav.addEventListener('hide.bs.collapse', () => {
            // Снимаем класс show при закрытии сайдбара
            const settingsDropdown = document.querySelector('.settings-dropdown.mobile-version');
            if (settingsDropdown) {
                settingsDropdown.classList.remove('show');
            }
            moveSettingsMenuAlternative();
        });
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

    const buttons = document.querySelectorAll('.toggle-btn');
    const forms = document.querySelectorAll('.form-block');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');
            forms.forEach(f => f.style.display = 'none');
            document.getElementById(target).style.display = 'block';
        });
    });


    // Закомментировано, так как dark-auth-toggle больше не используется
    // const buttons2 = document.querySelectorAll('.dark-toggle-btn');
    // const forms2 = document.querySelectorAll('.form-block');

    // buttons2.forEach(btn => {
    //     btn.addEventListener('click', (e) => {
    //         e.preventDefault();

    //         buttons2.forEach(b => b.classList.remove('active'));
    //         btn.classList.add('active');

    //         const target = btn.getAttribute('data-target');
    //         forms2.forEach(f => f.style.display = 'none');
    //         document.getElementById(target).style.display = 'block';
    //     });
    // });

    /* 
    Пример использования стилей ошибок для форм авторизации:
    
    // Показать ошибку для конкретного поля:
    const loginInput = document.querySelector('#login input[type="text"]');
    loginInput.classList.add('error');
    
    // Показать общее уведомление об ошибке (вынесено за пределы auth-box):
    const errorMessage = document.querySelector('.autorization .error-message');
    errorMessage.classList.remove('d-none');
    errorMessage.classList.add('show');
    
    // Скрыть ошибки:
    loginInput.classList.remove('error');
    errorMessage.classList.add('d-none');
    errorMessage.classList.remove('show');
    
    // Для всех полей активной формы входа:
    const loginInputs = document.querySelectorAll('#login .form-control');
    loginInputs.forEach(input => input.classList.add('error'));
    
    // Для всех полей формы регистрации:
    const registerInputs = document.querySelectorAll('#register .form-control');
    registerInputs.forEach(input => input.classList.add('error'));
    
    // Универсальная функция для показа ошибок:
    function showFormError(formId) {
        const inputs = document.querySelectorAll(`#${formId} .form-control`);
        inputs.forEach(input => input.classList.add('error'));
        document.querySelector('.autorization .error-message').classList.add('show');
    }
    */

    // Логика для sticky-карусели на мобильных устройствах
    function initStickyCarousel() {
        const header = document.querySelector('.header');
        const carousel = document.querySelector('.tournament-footer');
        const mainWithBg = document.querySelector('.main-with-bg');
        
        if (!header || !carousel || !mainWithBg) {
            return;
        }

        let isCarouselSticky = false;

        function updateCarouselPosition() {
            // Проверяем размер экрана при каждом вызове
            const isMobile = window.innerWidth <=550;
            
            // Если не мобильная версия, не применяем sticky логику
            if (!isMobile) {
                return;
            }


            const headerRect = header.getBoundingClientRect();
            const carouselRect = carousel.getBoundingClientRect();
            const mainWithBgRect = mainWithBg.getBoundingClientRect();
            const carouselHeight = carousel.offsetHeight;
            
            // Вычисляем, где карусель находится относительно viewport
            const carouselTopInViewport = carouselRect.top;
            const headerBottom = headerRect.bottom;
            
            // Вычисляем, где была бы карусель в исходном положении
            const carouselOriginalPosition = mainWithBgRect.bottom - carouselHeight;
            
            // Если карусель достигла header и main-with-bg еще прокручивается
            // И карусель в исходном положении была бы выше header (нужен sticky)
            if (carouselTopInViewport <= headerBottom && mainWithBgRect.top < 0 && carouselOriginalPosition <= headerBottom) {
                if (!isCarouselSticky) {
                    carousel.style.position = 'fixed';
                    carousel.style.top = `${headerRect.height}px`;
                    carousel.style.bottom = 'auto';
                    carousel.style.left = '0';
                    carousel.style.right = '0';
                    carousel.style.width = '100%';
                    isCarouselSticky = true;
                }
            } 
            // Если карусель в исходном положении уже ниже header - возвращаем
            else if (carouselOriginalPosition > headerBottom) {
                if (isCarouselSticky) {
                    carousel.style.position = 'absolute';
                    carousel.style.bottom = 'calc(100vh - 100dvh)';
                    carousel.style.top = 'auto';
                    carousel.style.left = '0';
                    carousel.style.right = '0';
                    carousel.style.width = '100%';
                    isCarouselSticky = false;
                }
            }
        }

        // Throttle для оптимизации производительности
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateCarouselPosition();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= 991;
            
            if (!isMobile) {
                // Переключились на десктоп - полностью сбрасываем все стили
                carousel.style.position = '';
                carousel.style.bottom = '';
                carousel.style.top = '';
                carousel.style.left = '';
                carousel.style.right = '';
                carousel.style.width = '';
                isCarouselSticky = false;
            } else {
                // Мобильная версия - пересчитываем позицию
                updateCarouselPosition();
            }
        });
        
        // Инициализация только для мобильной версии
        const isMobile = window.innerWidth <= 550;
        if (isMobile) {
            updateCarouselPosition();
        }
    }

    // Запускаем логику sticky-карусели
    initStickyCarousel();

});

document.addEventListener('DOMContentLoaded', () => {

    // Существующий код для карусели 
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

    function moveMenuToFooterNav() {
        const isMobile = window.innerWidth < 992;

        const desktopMenuInNav = document.querySelector('#navbarNav .navbar-nav.d-lg-flex');
        const desktopMenuInFooter = document.querySelector('#navbarNav .main-footer .footer-nav .navbar-nav');
        const desktopMenu = desktopMenuInNav || desktopMenuInFooter;
        const footerNav = document.querySelector('#navbarNav .main-footer .footer-nav');
        const autorizationBlock = document.querySelector('#navbarNav .autorization');
        
        if (!desktopMenu || !footerNav) return;

        const isInFooter = footerNav.contains(desktopMenu);

        if (isMobile) {
   
            if (!isInFooter) {
                footerNav.appendChild(desktopMenu);
                desktopMenu.classList.remove('d-lg-flex');
            }
        } else {
           
            if (isInFooter) {
            
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
                    const sidebarAuth = document.querySelector('#navbarNav .sidebar-auth-container');
                    if (sidebarAuth) {
                        sidebarAuth.parentNode.insertBefore(desktopMenu, sidebarAuth.nextElementSibling);
                    }
                }
                desktopMenu.classList.add('d-lg-flex');
            }
        }
    }

    setTimeout(moveMenuToFooterNav, 50);

    window.addEventListener('resize', moveMenuToFooterNav);

    if (navbarNav) {
        navbarNav.addEventListener('show.bs.collapse', () => setTimeout(moveMenuToFooterNav, 100));
        navbarNav.addEventListener('hide.bs.collapse', () => setTimeout(moveMenuToFooterNav, 100));
    }

    let settingsToggleHandler = null;

    function initMobileSettingsToggle() {
        const settingsImg = document.querySelector('.info_main_block_one img[src*="/assets/settings.png"]');
        const settingsDropdown = document.querySelector('.settings-dropdown');

        if (settingsImg && settingsDropdown) {
            if (settingsToggleHandler) {
                settingsImg.removeEventListener('click', settingsToggleHandler);
            }

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

    function moveSettingsMenuAlternative() {
        const settingsMenu = document.querySelector('.settings-dropdown');
        const targetBlock = document.querySelector('.info_main_block_one');
        const isMobile = window.innerWidth < 992;

        if (settingsMenu && targetBlock) {
            const isInSidebar = settingsMenu.closest('#navbarNav');

            if (isMobile && !isInSidebar) {
               
                targetBlock.appendChild(settingsMenu);
                settingsMenu.classList.add('mobile-version');
         
                initMobileSettingsToggle();

            } else if (!isMobile && isInSidebar) {
        
                const settingsContainer = document.querySelector('#dropdownMenuButton2').closest('.dropdown');
                if (settingsContainer && settingsMenu.classList.contains('mobile-version')) {
                    settingsContainer.appendChild(settingsMenu);
                    settingsMenu.classList.remove('mobile-version');
                   
                    settingsMenu.classList.remove('show');
              
                    const settingsImg = document.querySelector('.info_main_block_one img[src*="/assets/settings.png"]');
                    if (settingsImg && settingsToggleHandler) {
                        settingsImg.removeEventListener('click', settingsToggleHandler);
                        settingsToggleHandler = null;
                    }
                }
            }
        }

        
    }

  
    moveSettingsMenuAlternative();


    window.addEventListener('resize', moveSettingsMenuAlternative);

    
    if (navbarNav) {
        navbarNav.addEventListener('show.bs.collapse', moveSettingsMenuAlternative);
        navbarNav.addEventListener('hide.bs.collapse', () => {
       
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
            
            scrollPosition = window.pageYOffset;

            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', function () {
          
            const top = document.body.style.top;

         
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';

            window.scrollTo({
                top: -parseInt(top || '0'),
                behavior: 'instant'
            });
        });
    }

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
    
            const headerRect = header.getBoundingClientRect();
            const carouselRect = carousel.getBoundingClientRect();
            const mainWithBgRect = mainWithBg.getBoundingClientRect();
            const carouselHeight = carousel.offsetHeight;
            
           
            const carouselTopInViewport = carouselRect.top;
            const headerBottom = headerRect.bottom;
            
      
            const carouselOriginalPosition = mainWithBgRect.bottom - carouselHeight;
            
        
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
                
                carousel.style.position = '';
                carousel.style.bottom = '';
                carousel.style.top = '';
                carousel.style.left = '';
                carousel.style.right = '';
                carousel.style.width = '';
                isCarouselSticky = false;
            } else {
                
                updateCarouselPosition();
            }
        });
        

        const isMobile = window.innerWidth <= 550;
        if (isMobile) {
            updateCarouselPosition();
        }
    }

    
    initStickyCarousel();

});
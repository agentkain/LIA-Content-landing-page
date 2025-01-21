// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Floating navigation visibility
let lastScrollTop = 0;
const floatingNav = document.querySelector('.floating-nav');

// Only add scroll listener if floating nav exists
if (floatingNav) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            floatingNav.style.transform = 'translateY(-50%) translateX(100%)';
        } else {
            // Scrolling up
            floatingNav.style.transform = 'translateY(-50%) translateX(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Form validation
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form validation logic here
    });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.setAttribute('aria-expanded', 'false');
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other answers
        document.querySelectorAll('.faq-answer').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.faq-question').forEach(q => {
            q.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current answer
        if (!isOpen) {
            answer.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// Mobile Navigation
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const sideNav = document.querySelector('.side-nav');

mobileNavToggle?.addEventListener('click', () => {
    sideNav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        !e.target.closest('.side-nav') && 
        !e.target.closest('.mobile-nav-toggle') && 
        sideNav.classList.contains('active')) {
        sideNav.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Handle active navigation state
const navLinks = document.querySelectorAll('.content-nav a[href^="#"]');
const contentWrapper = document.querySelector('.content-sections-wrapper');

function setActiveNavItem() {
    // Exit early if required elements don't exist
    if (!contentWrapper || !navLinks.length) return;
    
    const sections = contentWrapper.querySelectorAll('section[id]');
    if (!sections.length) return;
    
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Only add event listeners if the required elements exist
if (contentWrapper && navLinks.length) {
    window.addEventListener('scroll', setActiveNavItem);
    window.addEventListener('load', setActiveNavItem);
}

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        initCarousel(carousel);
    }

    const mobileNav = document.querySelector('.mobile-quick-nav');
    if (mobileNav) {
        initMobileNav(mobileNav);
        
        // Add resize event listener to handle mobile nav visibility
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                mobileNav.style.display = 'none';
            } else {
                // Recheck scroll position to determine visibility
                const activeCasesSection = document.querySelector('.active-cases');
                if (activeCasesSection) {
                    const activeCasesMidpoint = activeCasesSection.offsetTop + (activeCasesSection.offsetHeight / 2);
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    mobileNav.style.display = scrollPosition > activeCasesMidpoint ? 'flex' : 'none';
                }
            }
        });
        
        // Add scroll listener for mobile nav visibility
        const activeCasesSection = document.querySelector('.active-cases');
        if (activeCasesSection) {
            window.addEventListener('scroll', () => {
                // Only proceed if window width is less than or equal to 1024px
                if (window.innerWidth <= 1024) {
                    const activeCasesMidpoint = activeCasesSection.offsetTop + (activeCasesSection.offsetHeight / 2);
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Show mobile nav after half of active cases section
                    if (scrollPosition > activeCasesMidpoint) {
                        mobileNav.style.display = 'flex';
                    } else {
                        mobileNav.style.display = 'none';
                    }
                    
                    // Handle footer positioning
                    const footer = document.querySelector('.site-footer');
                    if (footer && scrollPosition > activeCasesMidpoint) {
                        const footerRect = footer.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        
                        if (footerRect.top <= windowHeight) {
                            const distanceFromBottom = windowHeight - footerRect.top;
                            mobileNav.style.bottom = `${distanceFromBottom}px`;
                        } else {
                            mobileNav.style.bottom = '0';
                        }
                    }
                } else {
                    // Hide mobile nav on larger screens
                    mobileNav.style.display = 'none';
                }
            });
        }
    }

    initSectionTracking();
});

function initCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    const nextButton = carousel.querySelector('.carousel-button.next');
    const prevButton = carousel.querySelector('.carousel-button.prev');
    const dotsContainer = carousel.querySelector('.carousel-indicators');

    let currentIndex = 0;
    const slidesToShow = window.innerWidth <= 768 ? 1 : 3;
    let autoplayInterval;
    const autoplayDelay = 5000;

    function updateCarousel() {
        const slideWidth = carousel.offsetWidth / slidesToShow;
        
        slides.forEach(slide => {
            if (slide) slide.style.width = `${slideWidth}px`;
        });
        
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
        
        if (prevButton) prevButton.disabled = currentIndex === 0;
        if (nextButton) nextButton.disabled = currentIndex >= slides.length - slidesToShow;
        
        if (dotsContainer) {
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentIndex / slidesToShow));
            });
        }
    }

    function moveToSlide(index) {
        if (index >= slides.length - slidesToShow + 1) {
            index = 0;
        } else if (index < 0) {
            index = slides.length - slidesToShow;
        }
        currentIndex = index;
        updateCarousel();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Initialize dots
    if (dotsContainer) {
        const numDots = Math.ceil(slides.length / slidesToShow);
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('indicator');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Slide group ${i + 1}`);
            
            dot.addEventListener('click', () => {
                moveToSlide(i * slidesToShow);
                stopAutoplay();
                startAutoplay();
            });
            
            dotsContainer.appendChild(dot);
        }
    }

    // Set up navigation
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            moveToSlide(currentIndex + 1);
            stopAutoplay();
            startAutoplay();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            moveToSlide(currentIndex - 1);
            stopAutoplay();
            startAutoplay();
        });
    }

    // Handle resize
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarousel, 250);
    });

    // Start carousel
    updateCarousel();
    startAutoplay();
}

function initMobileNav(mobileNav) {
    const navScroll = mobileNav.querySelector('.mobile-quick-nav-scroll');
    const prevArrow = mobileNav.querySelector('.nav-arrow.prev');
    const nextArrow = mobileNav.querySelector('.nav-arrow.next');
    
    if (!navScroll || !prevArrow || !nextArrow) return;

    function updateArrows() {
        const isScrollable = navScroll.scrollWidth > navScroll.clientWidth;
        const isScrollStart = Math.abs(navScroll.scrollLeft) <= 1;
        const isScrollEnd = Math.abs(navScroll.scrollLeft + navScroll.clientWidth - navScroll.scrollWidth) <= 1;

        prevArrow.classList.toggle('show', isScrollable && !isScrollStart);
        nextArrow.classList.toggle('show', isScrollable && !isScrollEnd);
    }

    nextArrow.addEventListener('click', () => {
        const scrollAmount = Math.min(200, navScroll.scrollWidth - navScroll.clientWidth - navScroll.scrollLeft);
        navScroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevArrow.addEventListener('click', () => {
        const scrollAmount = Math.min(200, navScroll.scrollLeft);
        navScroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    navScroll.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();
}

function initSectionTracking() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const mobileNavItems = Array.from(document.querySelectorAll('.quick-nav-item'));
    const desktopNavItems = Array.from(document.querySelectorAll('.content-nav a[href^="#"]'));
    const mobileNav = document.querySelector('.mobile-quick-nav');
    const footer = document.querySelector('.site-footer');
    
    if (!sections.length || (!mobileNavItems.length && !desktopNavItems.length)) return;

    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.id;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Update mobile nav
                mobileNavItems.forEach(item => {
                    const isActive = item.getAttribute('href') === `#${sectionId}`;
                    item.classList.toggle('active', isActive);
                });
                
                // Update desktop nav
                desktopNavItems.forEach(item => {
                    const isActive = item.getAttribute('href') === `#${sectionId}`;
                    item.classList.toggle('active', isActive);
                });

                // Scroll active mobile nav item into view
                const activeNavItem = document.querySelector('.quick-nav-item.active');
                if (activeNavItem) {
                    const navScroll = document.querySelector('.mobile-quick-nav-scroll');
                    if (navScroll) {
                        const itemLeft = activeNavItem.offsetLeft;
                        const itemWidth = activeNavItem.offsetWidth;
                        const navWidth = navScroll.offsetWidth;
                        const targetScroll = itemLeft - (navWidth - itemWidth) / 2 + itemWidth / 2 - 40;
                        navScroll.scrollTo({
                            left: Math.max(0, targetScroll),
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    }

    // Update active section on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveSection);
    });

    // Initial update
    updateActiveSection();
}

// Handle mobile carousels
function initMobileCarousels() {
    const carousels = [
        {
            grid: document.querySelector('.risk-grid'),
            dots: document.querySelector('.risk-scroll-dots')
        },
        {
            grid: document.querySelector('.exposure-grid'),
            dots: document.querySelector('.exposure-scroll-dots')
        }
    ];

    carousels.forEach(({ grid, dots }) => {
        if (!grid || !dots) return;

        const updateDots = () => {
            const scrollPosition = grid.scrollLeft;
            const itemWidth = grid.querySelector('div').offsetWidth + 16; // 16px is the gap
            const activeIndex = Math.round(scrollPosition / itemWidth);
            
            dots.querySelectorAll('.scroll-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        // Update dots on scroll
        grid.addEventListener('scroll', () => {
            requestAnimationFrame(updateDots);
        });

        // Handle dot clicks
        dots.querySelectorAll('.scroll-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const itemWidth = grid.querySelector('div').offsetWidth + 16;
                grid.scrollTo({
                    left: index * itemWidth,
                    behavior: 'smooth'
                });
            });
        });

        // Initial update
        updateDots();
    });
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileCarousels();
});

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item > a');

    // Toggle mobile menu
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Handle dropdown toggles
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const parent = item.parentElement;
                const dropdown = parent.querySelector('.dropdown-menu');
                const allDropdowns = document.querySelectorAll('.dropdown-menu');
                const allSubmenus = document.querySelectorAll('.submenu');
                
                // Close other dropdowns
                allDropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                        d.previousElementSibling?.classList.remove('active');
                    }
                });
                
                // Close other submenus
                allSubmenus.forEach(s => {
                    if (!dropdown?.contains(s)) {
                        s.classList.remove('active');
                        s.previousElementSibling?.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                if (dropdown) {
                    item.classList.toggle('active');
                    dropdown.classList.toggle('active');
                }
            }
        });
    });

    // Handle submenu toggles
    const submenuTriggers = document.querySelectorAll('.has-submenu > a');
    submenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation();
                const submenu = trigger.nextElementSibling;
                const allSubmenus = document.querySelectorAll('.submenu');
                
                // Close other submenus at the same level
                allSubmenus.forEach(s => {
                    if (s !== submenu && s.parentElement.parentElement === submenu.parentElement.parentElement) {
                        s.classList.remove('active');
                        s.previousElementSibling?.classList.remove('active');
                    }
                });
                
                // Toggle current submenu
                trigger.classList.toggle('active');
                submenu.classList.toggle('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger-menu') && 
            navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}); 
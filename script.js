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
const sections = contentWrapper.querySelectorAll('section[id]');

function setActiveNavItem() {
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

window.addEventListener('scroll', setActiveNavItem);
window.addEventListener('load', setActiveNavItem);

document.addEventListener('DOMContentLoaded', function() {
    // Calculate and set heights for sticky nav positioning
    function updateNavConstraints() {
        const activeCases = document.querySelector('.active-cases');
        const ctaSection = document.querySelector('.cta-section');
        
        if (activeCases && ctaSection) {
            document.documentElement.style.setProperty('--active-cases-height', `${activeCases.offsetHeight}px`);
            document.documentElement.style.setProperty('--cta-section-height', `${ctaSection.offsetHeight}px`);
        }
    }

    // Update on load and resize
    updateNavConstraints();
    window.addEventListener('resize', updateNavConstraints);

    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const indicators = document.querySelector('.carousel-indicators');
    const dots = Array.from(indicators.children);

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateSlidePosition() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const isMobile = window.innerWidth <= 768;
        
        // On mobile, use full width slides
        if (isMobile) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else {
            track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
    }

    function moveToSlide(index) {
        currentIndex = index;
        updateSlidePosition();
    }

    // Touch events for mobile swipe
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) { // Minimum swipe distance
            if (difference > 0 && currentIndex < slides.length - 1) {
                // Swipe left
                moveToSlide(currentIndex + 1);
            } else if (difference < 0 && currentIndex > 0) {
                // Swipe right
                moveToSlide(currentIndex - 1);
            }
        }
    });

    // Button click events
    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            moveToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });

    // Initialize
    updateSlidePosition();

    // Update on resize
    window.addEventListener('resize', updateSlidePosition);
});

document.addEventListener('DOMContentLoaded', function() {
    const quickNavItems = document.querySelectorAll('.quick-nav-item');
    const sections = document.querySelectorAll('section[id]');

    function setActiveQuickNavItem() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const navScroll = document.querySelector('.mobile-quick-nav-scroll');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                quickNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                        
                        // Scroll the navigation to show active item
                        const itemOffset = item.offsetLeft;
                        const navScrollWidth = navScroll.clientWidth;
                        const scrollPosition = itemOffset - (navScrollWidth / 2) + (item.offsetWidth / 2);
                        
                        navScroll.scrollTo({
                            left: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
    }

    // Add a small delay to initial scroll to ensure proper positioning
    window.addEventListener('load', () => {
        setTimeout(setActiveQuickNavItem, 100);
    });

    // Update on scroll with throttling for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            setActiveQuickNavItem();
        });
    });

    // Smooth scroll for quick nav items
    quickNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const navScroll = document.querySelector('.mobile-quick-nav-scroll');
    const prevArrow = document.querySelector('.nav-arrow.prev');
    const nextArrow = document.querySelector('.nav-arrow.next');
    
    function updateArrows() {
        const isScrollable = navScroll.scrollWidth > navScroll.clientWidth;
        const isScrollStart = Math.abs(navScroll.scrollLeft) <= 1;
        const isScrollEnd = Math.abs(navScroll.scrollLeft + navScroll.clientWidth - navScroll.scrollWidth) <= 1;

        prevArrow.classList.toggle('show', isScrollable && !isScrollStart);
        nextArrow.classList.toggle('show', isScrollable && !isScrollEnd);
    }

    // Scroll navigation with limits
    nextArrow.addEventListener('click', () => {
        const scrollAmount = Math.min(200, navScroll.scrollWidth - navScroll.clientWidth - navScroll.scrollLeft);
        navScroll.scrollBy({ 
            left: scrollAmount, 
            behavior: 'smooth' 
        });
    });

    prevArrow.addEventListener('click', () => {
        const scrollAmount = Math.min(200, navScroll.scrollLeft);
        navScroll.scrollBy({ 
            left: -scrollAmount, 
            behavior: 'smooth' 
        });
    });

    // Update arrows on scroll
    navScroll.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    
    // Initial arrow state
    updateArrows();
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initializeCarousel();
    
    // Initialize scroll tracking for sections (if needed)
    initSectionScrollTracking();
});

function initializeCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-indicators');

    let currentIndex = 0;
    const slidesToShow = window.innerWidth <= 768 ? 1 : 3;
    
    function updateCarousel() {
        // Calculate slide width based on viewport
        const carouselWidth = carousel.offsetWidth;
        const slideWidth = carouselWidth / slidesToShow;
        
        // Set width for all slides
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
            slide.style.flex = `0 0 ${slideWidth}px`;
        });
        
        // Update track position
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        if (prevButton && nextButton) {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= slides.length - slidesToShow;
        }
        
        // Update dots
        if (dotsContainer) {
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentIndex / slidesToShow));
            });
        }
    }

    function moveToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, slides.length - slidesToShow));
        updateCarousel();
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
            });
            
            dotsContainer.appendChild(dot);
        }
    }

    // Button click handlers
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - slidesToShow) {
                moveToSlide(currentIndex + 1);
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });
    }

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    track.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) { // Minimum swipe distance
            if (difference > 0 && currentIndex < slides.length - slidesToShow) {
                moveToSlide(currentIndex + 1);
            } else if (difference < 0 && currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesToShow = window.innerWidth <= 768 ? 1 : 3;
            if (slidesToShow !== newSlidesToShow) {
                location.reload(); // Reload page if slidesToShow changes
            } else {
                updateCarousel(); // Otherwise just update positions
            }
        }, 250);
    });

    // Initialize carousel
    updateCarousel();
}

function initSectionScrollTracking() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const id = section.getAttribute('id');
            
            const navItem = document.querySelector(`.quick-nav-item[href="#${id}"]`);
            if (!navItem) return;
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navItem.classList.add('active');
            } else {
                navItem.classList.remove('active');
            }
        });
    });
} 
/* ============================================ */
/* LIVIX — Premium Technology Company Website   */
/* JavaScript Interactions & Animations         */
/* ============================================ */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENT REFERENCES
    // ============================================
    const loader = document.getElementById('loader');
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const mobileOverlay = document.getElementById('navMobileOverlay');
    const mobileLinks = document.querySelectorAll('.nav-mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const statNumbers = document.querySelectorAll('.stat-number');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    // ============================================
    // LOADER ANIMATION
    // ============================================
    function initLoader() {
        if (!loader) return;

        const totalLoaderTime = 3500;

        setTimeout(() => {
            loader.classList.add('exit');

            setTimeout(() => {
                loader.classList.add('hidden');
                triggerHeroReveals();
            }, 800);
        }, totalLoaderTime);
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    function initNavbar() {
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbar() {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let ticking = false;

        function updateActiveLink() {
            const scrollY = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateActiveLink);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    function initMobileNav() {
        if (!mobileToggle || !mobileOverlay) return;

        function toggleMobileNav() {
            const isActive = mobileToggle.classList.contains('active');
            mobileToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', !isActive);
            document.body.style.overflow = isActive ? '' : 'hidden';
        }

        mobileToggle.addEventListener('click', toggleMobileNav);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileToggle.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileToggle.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    function triggerHeroReveals() {
        const heroReveals = document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale');
        heroReveals.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, index * 150);
        });
    }

    // ============================================
    // RIPPLE BUTTON EFFECT
    // ============================================
    function initRippleEffect() {
        document.querySelectorAll('.ripple-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ============================================
    // STATISTICS COUNTER ANIMATION
    // ============================================
    function initStatCounters() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            statObserver.observe(stat);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ============================================
    function initContactForm() {
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Sending...</span>';
                submitBtn.disabled = true;

                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccess.classList.add('active');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        let isValid = true;

        if (field.hasAttribute('required')) {
            if (field.tagName === 'SELECT') {
                isValid = field.value !== '';
            } else {
                isValid = field.value.trim() !== '';
            }
        }

        if (field.type === 'email' && field.value.trim() !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(field.value);
        }

        if (isValid) {
            formGroup.classList.remove('error');
        } else {
            formGroup.classList.add('error');
        }

        return isValid;
    }

    // ============================================
    // PARALLAX EFFECT (subtle)
    // ============================================
    function initParallax() {
        const heroVisual = document.querySelector('.hero-visual-inner');
        if (!heroVisual) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrollY < heroHeight) {
                const parallaxValue = scrollY * 0.15;
                heroVisual.style.transform = `translateY(${parallaxValue}px)`;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // SCROLL INDICATOR FADE
    // ============================================
    function initScrollIndicatorFade() {
        const scrollIndicator = document.querySelector('.hero-scroll-indicator');
        if (!scrollIndicator) return;

        let ticking = false;

        function updateIndicator() {
            const scrollY = window.scrollY;
            const opacity = Math.max(0, 1 - scrollY / 200);
            scrollIndicator.style.opacity = opacity;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateIndicator);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // PRODUCT CARD HOVER MAGNETIC EFFECT (subtle)
    // ============================================
    function initMagneticCards() {
        const cards = document.querySelectorAll('.product-card, .why-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ============================================
    // INITIALIZE ALL MODULES
    // ============================================
    function init() {
        initLoader();
        initNavbar();
        initActiveNavLink();
        initMobileNav();
        initSmoothScroll();
        initScrollReveal();
        initRippleEffect();
        initStatCounters();
        initContactForm();
        initParallax();
        initScrollIndicatorFade();
        initMagneticCards();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Scroll-triggered reveal animations
document.addEventListener('DOMContentLoaded', function () {

    var revealElements = document.querySelectorAll(
        '.section-container, .chat-demo, .reason-card, .also-applies, .tldr-card'
    );

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
        observer.observe(el);
    });


    // Smooth scroll for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerOffset = 70;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // Header shrink on scroll
    var header = document.getElementById('site-header');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var currentScroll = window.pageYOffset;

        if (currentScroll > 80) {
            header.style.borderBottomColor = 'rgba(229, 225, 219, 0.6)';
        } else {
            header.style.borderBottomColor = 'rgba(229, 225, 219, 0.2)';
        }

        lastScroll = currentScroll;
    }, { passive: true });


    // Parallax on hero floating bubbles
    var bubbles = document.querySelectorAll('.floating-bubble');

    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset;
        if (scrollY > window.innerHeight) return;

        bubbles.forEach(function (bubble, i) {
            var speed = 0.1 + (i * 0.05);
            bubble.style.transform = 'translateY(' + (-scrollY * speed) + 'px)';
        });
    }, { passive: true });

});

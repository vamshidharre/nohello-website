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


    // Unique visitor counter
    initVisitorCounter();

});


function initVisitorCounter() {
    var counterEl = document.getElementById('visitor-counter');
    var countEl = document.getElementById('visitor-count');

    if (!counterEl || !countEl) return;

    // Use /up endpoint — it both increments and returns the count
    // This is the only reliably working endpoint on counterapi.dev
    fetch('https://api.counterapi.dev/v1/nohello-site/unique-visitors/up')
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function (data) {
            if (data && typeof data.count === 'number') {
                showCounter(counterEl, countEl, data.count);
            }
        })
        .catch(function () {
            // API down — show nothing, no broken UI
        });
}

function showCounter(containerEl, countEl, finalCount) {
    if (finalCount < 1) return;

    // Animate the number counting up
    var duration = 1400;
    var startVal = Math.max(0, finalCount - 30);
    var startTime = null;

    function formatNum(n) {
        return n.toLocaleString();
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(startVal + (finalCount - startVal) * eased);
        countEl.textContent = formatNum(current);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            countEl.textContent = formatNum(finalCount);
        }
    }

    countEl.textContent = formatNum(startVal);
    containerEl.classList.add('loaded');
    requestAnimationFrame(step);
}

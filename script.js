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

    // Use visitor-badge as a hidden image to track + count visits.
    // Then parse the count from the loaded SVG via a canvas.
    var badgeUrl = 'https://visitor-badge.laobi.icu/badge?page_id=vamshidharre.nohello-website&left_color=transparent&right_color=transparent&left_text=.';

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        // Draw to canvas to read the SVG content is not needed;
        // instead, fetch the SVG text to parse the number
        fetchBadgeSvg(badgeUrl, counterEl, countEl);
    };
    img.onerror = function () {
        // Even if crossOrigin fails, try the fetch anyway
        fetchBadgeSvg(badgeUrl, counterEl, countEl);
    };
    img.src = badgeUrl;
}

function fetchBadgeSvg(url, containerEl, countEl) {
    fetch(url)
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
        })
        .then(function (svgText) {
            // The SVG contains text elements with the visitor count
            // Parse the count from the last <text> elements
            var matches = svgText.match(/<text[^>]*>(\d+)<\/text>/g);
            if (matches && matches.length > 0) {
                var lastMatch = matches[matches.length - 1];
                var numMatch = lastMatch.match(/>(\d+)</);
                if (numMatch && numMatch[1]) {
                    var count = parseInt(numMatch[1], 10);
                    if (count > 0) {
                        showCounter(containerEl, countEl, count);
                        return;
                    }
                }
            }
            // If parsing failed, try the img-only fallback
            showBadgeFallback(containerEl, countEl, url);
        })
        .catch(function () {
            // CORS blocked the fetch — use img fallback
            showBadgeFallback(containerEl, countEl, url);
        });
}

function showBadgeFallback(containerEl, countEl, url) {
    // If fetch was blocked by CORS, load the badge as a visible img
    // inside our styled pill — still looks decent
    var badgeImg = document.createElement('img');
    badgeImg.src = 'https://visitor-badge.laobi.icu/badge?page_id=vamshidharre.nohello-website&left_color=%23f3f0eb&right_color=%232d7a4f&left_text=visitors&query_only=true';
    badgeImg.alt = 'visitor count';
    badgeImg.style.height = '18px';
    badgeImg.style.borderRadius = '3px';

    // Replace the count text with the badge image
    countEl.textContent = '';
    countEl.appendChild(badgeImg);

    // Hide the "readers" label since the badge has its own label
    var label = containerEl.querySelector('.visitor-label');
    if (label) label.style.display = 'none';

    containerEl.classList.add('loaded');
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

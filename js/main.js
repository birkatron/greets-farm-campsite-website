/* ============================================================
   GREETS FARM CAMPSITE — main.js
   Handles: sticky nav, hamburger menu, smooth scroll,
            FAQ accordion, form validation, cookie consent
   ============================================================ */

'use strict';

/* ── Sticky Nav Shadow ────────────────────────────────────── */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ── Mobile Hamburger Menu ────────────────────────────────── */
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── Active Nav Link ──────────────────────────────────────── */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── FAQ Accordion ────────────────────────────────────────── */
(function () {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
})();

/* ── Contact Form Validation ──────────────────────────────── */
(function () {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.remove();
    });
    form.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });

    // Validate required fields
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('error');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'This field is required.';
        err.style.cssText = 'color:#c0392b;font-size:0.8rem;display:block;margin-top:0.25rem;';
        field.parentNode.appendChild(err);
      }
    });

    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value.trim())) {
        valid = false;
        emailField.classList.add('error');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'Please enter a valid email address.';
        err.style.cssText = 'color:#c0392b;font-size:0.8rem;display:block;margin-top:0.25rem;';
        emailField.parentNode.appendChild(err);
      }
    }

    if (valid) {
      // Show success message (form is static — no backend)
      const successMsg = document.createElement('div');
      successMsg.innerHTML = '<p style="color:#2C4A35;font-weight:700;font-size:1rem;padding:1rem;background:#F5F0E8;border-radius:4px;border-left:4px solid #2C4A35;">Thank you — we\'ll be in touch shortly. If you need to reach us urgently, please call <a href="tel:07918070716">07918 070716</a>.</p>';
      form.innerHTML = '';
      form.appendChild(successMsg);
    }
  });

  // Add error style to CSS dynamically
  const style = document.createElement('style');
  style.textContent = 'input.error, select.error, textarea.error { border-color: #c0392b !important; }';
  document.head.appendChild(style);
})();

/* ── Cookie Consent ───────────────────────────────────────── */
(function () {
  const CONSENT_KEY = 'gf_analytics_consent';

  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  }

  function grantConsent() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    // Fire GA4 consent update
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
  }

  function showBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;
    setTimeout(function () {
      banner.classList.add('visible');
    }, 1500);

    const acceptBtn = banner.querySelector('.cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        grantConsent();
        banner.classList.remove('visible');
        setTimeout(function () {
          banner.remove();
        }, 400);
      });
    }
  }

  if (!hasConsent()) {
    showBanner();
  } else {
    // Already consented — grant immediately
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
  }
})();/* ── Hero Slideshow ──────────────────────────────────────────── */
(function () {
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  var current  = 0;
  var total    = slides.length;
  var interval = 5000; // ms between transitions
  var timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startTimer() {
    timer = setInterval(next, interval);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  // Dot click handlers
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      resetTimer();
    });
  });

  // Pause on hover, resume on leave
  var hero = document.getElementById('hero-slideshow');
  if (hero) {
    hero.addEventListener('mouseenter', function () { clearInterval(timer); });
    hero.addEventListener('mouseleave', function () { startTimer(); });
  }

  startTimer();
})();

/* ── Smooth Scroll for anchor links ───────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.site-nav') ? document.querySelector('.site-nav').offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

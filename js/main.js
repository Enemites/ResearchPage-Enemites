// ============================================
// NovaX Research: Main JavaScript
// ============================================

(function () {
  'use strict';

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');

          const bars = entry.target.querySelectorAll('.benchmark-card__bar-fill');
          bars.forEach((bar) => {
            const width = bar.getAttribute('data-width');
            if (width) {
              window.setTimeout(() => {
                bar.style.width = width;
              }, 180);
            }
          });
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }

  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const syncNavState = () => {
      nav.classList.toggle('scrolled', window.pageYOffset > 24);
    };

    syncNavState();
    window.addEventListener('scroll', syncNavState, { passive: true });
  }

  function initMobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function getFixedNavScrollOffset() {
    const nav = document.querySelector('.nav');
    if (!nav) return 88;
    return nav.getBoundingClientRect().height + 16;
  }

  function scrollToAnchorTarget(target, smooth) {
    const offset = getFixedNavScrollOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  function highlightReferenceTableRow(target) {
    if (!target || !target.matches || !target.matches('tr[id^="ref"]')) {
      return;
    }

    document.querySelectorAll('tr.paper-content__ref-target').forEach((row) => {
      row.classList.remove('paper-content__ref-target');
    });
    target.classList.add('paper-content__ref-target');
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        scrollToAnchorTarget(target, true);
        highlightReferenceTableRow(target);
      });
    });
  }

  function initScrollToHashOnLoad() {
    const hash = location.hash;
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    requestAnimationFrame(() => {
      scrollToAnchorTarget(target, false);
      highlightReferenceTableRow(target);
    });
  }

  function animateCounter(element, target, duration = 1200) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  function initCounterAnimations() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.querySelectorAll('[data-count]').forEach((counter) => {
            const target = Number.parseInt(counter.getAttribute('data-count'), 10);
            if (Number.isFinite(target)) {
              animateCounter(counter, target);
            }
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  }

  function initTocActiveState() {
    const tocLinks = document.querySelectorAll('.paper-toc__link');
    const sections = [];

    tocLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const section = document.querySelector(href);
      if (section) {
        sections.push({ link, section });
      }
    });

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          tocLinks.forEach((link) => link.classList.remove('active'));
          const activeLink = sections.find((item) => item.section === entry.target);
          if (activeLink) {
            activeLink.link.classList.add('active');
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach(({ section }) => observer.observe(section));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollToHashOnLoad();
    initCounterAnimations();
    initTocActiveState();
  });
})();

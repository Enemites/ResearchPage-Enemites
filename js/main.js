// ============================================
// NovaX Research: Main JavaScript
// ============================================

(function () {
  'use strict';

  // --- Hero smooth particle field background ---
  class NeuralCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null, radius: 150 };
      this.particleCount = Math.min(180, Math.max(90, Math.floor(window.innerWidth * 0.11)));
      this.animationId = null;
      this.time = 0;
      this.waveScale = 0.0045;

      this.resize();
      this.init();
      this.animate();

      window.addEventListener('resize', () => this.resize());
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.canvas.offsetWidth * dpr;
      this.canvas.height = this.canvas.offsetHeight * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.45;
      this.particleCount = Math.min(180, Math.max(90, Math.floor(this.width * 0.11)));
      this.waveScale = this.width < 768 ? 0.006 : 0.0045;
      this.init();
    }

    init() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: Math.random() * 1.7 + 0.4,
          opacity: Math.random() * 0.45 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          swirl: (Math.random() - 0.5) * 0.009,
          hue: 35 + Math.random() * 165,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.time += 0.004;

      // Update and draw particles
      this.particles.forEach((p) => {
        // Siri-like flow field: rotating wave currents, not center clustering
        const noiseA = (p.x + this.time * 700) * this.waveScale;
        const noiseB = (p.y - this.time * 520) * this.waveScale;
        const flowAngle =
          Math.sin(noiseA + p.phase) * 1.6 +
          Math.cos(noiseB - p.phase) * 1.25 +
          this.time * 0.9;
        const waveStrength =
          0.018 + (Math.sin(this.time * 3.4 + p.phase) + 1) * 0.0065;

        p.vx += Math.cos(flowAngle) * waveStrength;
        p.vy += Math.sin(flowAngle) * waveStrength;

        // Wide orbital drift to keep the field in continuous circular motion
        const dxOrbit = p.x - this.centerX;
        const dyOrbit = p.y - this.centerY;
        const orbitDist = Math.sqrt(dxOrbit * dxOrbit + dyOrbit * dyOrbit) || 1;
        const orbitBoost = Math.min(0.012, 0.002 + orbitDist / (this.width * 180));
        p.vx += (-dyOrbit / orbitDist) * (orbitBoost + p.swirl * 0.7);
        p.vy += (dxOrbit / orbitDist) * (orbitBoost + p.swirl * 0.7);

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        // Wrap around edges to keep movement fluid
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.height + 10;
        if (p.y > this.height + 10) p.y = -10;

        // Mouse interaction: gently bends the wave flow
        if (this.mouse.x !== null) {
          const dxMouse = p.x - this.mouse.x;
          const dyMouse = p.y - this.mouse.y;
          const dist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (dist < this.mouse.radius) {
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            p.vx += (dxMouse / (dist || 1)) * force * 0.009;
            p.vy += (dyMouse / (dist || 1)) * force * 0.009;
          }
        }

        // Dampen velocity
        p.vx *= 0.985;
        p.vy *= 0.985;

        const pulseOpacity = Math.max(0.08, p.opacity + Math.sin(p.pulse + this.time) * 0.16);
        const twinkle = 0.8 + Math.sin(p.pulse * 2 + this.time * 8) * 0.2;
        const colorOpacity = pulseOpacity * 0.8;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * twinkle, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 92%, 72%, ${colorOpacity})`;
        this.ctx.fill();

        // Soft glow
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 4.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 92%, 72%, ${colorOpacity * 0.14})`;
        this.ctx.fill();
      });

      this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  // --- Scroll-based Animations (Intersection Observer) ---
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate benchmark bars
            const bars = entry.target.querySelectorAll('.benchmark-card__bar-fill');
            bars.forEach((bar) => {
              const width = bar.getAttribute('data-width');
              if (width) {
                setTimeout(() => {
                  bar.style.width = width;
                }, 300);
              }
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }

  // --- Navbar Scroll Effect ---
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // --- Mobile Menu Toggle ---
  function initMobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- Smooth Scroll for Anchor Links (offset for fixed nav) ---
  function getFixedNavScrollOffset() {
    const nav = document.querySelector('.nav');
    if (!nav) return 88;
    return nav.getBoundingClientRect().height + 16;
  }

  function scrollToAnchorTarget(target, smooth) {
    const offset = getFixedNavScrollOffset();
    const top =
      target.getBoundingClientRect().top + window.scrollY - offset;
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

  // --- Counter Animation for Stats ---
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  function initCounterAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute('data-count'));
              animateCounter(counter, target);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  // --- Table of Contents Active State (Paper Page) ---
  function initTocActiveState() {
    const tocLinks = document.querySelectorAll('.paper-toc__link');
    const sections = [];

    tocLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
          sections.push({ link, section });
        }
      }
    });

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove('active'));
            const activeLink = sections.find(
              (s) => s.section === entry.target
            );
            if (activeLink) {
              activeLink.link.classList.add('active');
            }
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

  // --- Parallax subtle effect for hero ---
  function initParallax() {
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
        heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
      }
    });
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', () => {
    new NeuralCanvas('hero-canvas');
    initScrollAnimations();
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollToHashOnLoad();
    initCounterAnimations();
    initTocActiveState();
    initParallax();
  });
})();

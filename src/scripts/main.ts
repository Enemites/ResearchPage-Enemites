function revealElementsWithoutObserver(): void {
  document.querySelectorAll<HTMLElement>('.animate-on-scroll').forEach((element) => {
    element.classList.add('visible');
  });
}

function initScrollAnimations(): void {
  if (!('IntersectionObserver' in window)) {
    revealElementsWithoutObserver();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        entry.target.querySelectorAll<HTMLElement>('.benchmark-card__bar-fill').forEach((bar) => {
          const width = bar.getAttribute('data-width');
          if (!width) return;

          window.setTimeout(() => {
            bar.style.width = width;
          }, 180);
        });
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll<HTMLElement>('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
  });
}

function initNavScroll(): void {
  const nav = document.querySelector<HTMLElement>('.nav');
  if (!nav) return;

  const syncNavState = (): void => {
    nav.classList.toggle('scrolled', window.pageYOffset > 24);
  };

  syncNavState();
  window.addEventListener('scroll', syncNavState, { passive: true });
}

function initMobileMenu(): void {
  const hamburger = document.querySelector<HTMLButtonElement>('.nav__hamburger');
  const mobileMenu = document.querySelector<HTMLElement>('.nav__mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const closeMenu = (): void => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

function getFixedNavScrollOffset(): number {
  const nav = document.querySelector<HTMLElement>('.nav');
  if (!nav) return 88;

  return nav.getBoundingClientRect().height + 16;
}

function scrollToAnchorTarget(target: Element, smooth: boolean): void {
  const offset = getFixedNavScrollOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: smooth ? 'smooth' : 'auto',
  });
}

function highlightReferenceTableRow(target: Element | null): void {
  if (!(target instanceof HTMLTableRowElement) || !target.matches('tr[id^="ref"]')) {
    return;
  }

  document.querySelectorAll<HTMLTableRowElement>('tr.paper-content__ref-target').forEach((row) => {
    row.classList.remove('paper-content__ref-target');
  });

  target.classList.add('paper-content__ref-target');
}

function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      scrollToAnchorTarget(target, true);
      highlightReferenceTableRow(target);

      const mobileToc = anchor.closest<HTMLDetailsElement>('.paper-toc-mobile');
      if (mobileToc) {
        mobileToc.open = false;
      }
    });
  });
}

function initScrollToHashOnLoad(): void {
  const { hash } = location;
  if (!hash || hash === '#') return;

  const target = document.querySelector(hash);
  if (!target) return;

  requestAnimationFrame(() => {
    scrollToAnchorTarget(target, false);
    highlightReferenceTableRow(target);
  });
}

function animateCounter(element: HTMLElement, target: number, duration = 1200): void {
  const startTime = performance.now();

  function update(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = String(Math.floor(target * eased));

    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }

    element.textContent = String(target);
  }

  requestAnimationFrame(update);
}

function initCounterAnimations(): void {
  const statsSection = document.querySelector<HTMLElement>('.stats');
  if (!statsSection) return;

  if (!('IntersectionObserver' in window)) {
    statsSection.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
      counter.textContent = counter.getAttribute('data-count') ?? counter.textContent;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
          const target = Number.parseInt(counter.getAttribute('data-count') ?? '', 10);
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

interface TocSection {
  link: HTMLAnchorElement;
  section: Element;
}

function initTocActiveState(): void {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>('.paper-toc .paper-toc__link');
  const sections: TocSection[] = [];

  tocLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;

    const section = document.querySelector(href);
    if (section) {
      sections.push({ link, section });
    }
  });

  if (sections.length === 0 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        tocLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = sections.find((item) => item.section === entry.target);
        activeLink?.link.classList.add('active');
      });
    },
    {
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(({ section }) => observer.observe(section));
}

function initReadingProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  const article = document.querySelector<HTMLElement>('#paper-body');
  if (!bar || !article) return;

  const syncProgress = (): void => {
    const rect = article.getBoundingClientRect();
    const total = Math.max(1, article.offsetHeight - window.innerHeight * 0.7);
    const scrolled = Math.min(Math.max(-rect.top + 120, 0), total);
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    bar.style.width = `${pct.toFixed(1)}%`;
  };

  syncProgress();
  window.addEventListener('scroll', syncProgress, { passive: true });
  window.addEventListener('resize', syncProgress, { passive: true });
}

function initPaperActions(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-print-paper]').forEach((button) => {
    button.addEventListener('click', () => {
      window.print();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-copy-bibtex]').forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-copy-bibtex');
      const source = targetId ? document.getElementById(targetId) : null;
      const text = source?.textContent?.trim();
      if (!text) return;

      const label = button.querySelector<HTMLElement>('[data-copy-label]') ?? button;
      const original = label.textContent ?? 'Copy BibTeX';

      try {
        await navigator.clipboard.writeText(text);
        label.textContent = 'Copied!';
        window.setTimeout(() => {
          label.textContent = original;
        }, 1800);
      } catch {
        label.textContent = 'Select below';
        window.setTimeout(() => {
          label.textContent = original;
        }, 1800);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollToHashOnLoad();
  initCounterAnimations();
  initTocActiveState();
  initReadingProgress();
  initPaperActions();
});

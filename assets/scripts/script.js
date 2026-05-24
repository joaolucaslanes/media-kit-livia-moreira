class MediaKit {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navLinks = document.getElementById('nav-links');

    this.init();
  }

  init() {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    this.initNavbar();
    this.initReveal();
    this.initMenu();
    this.initSmoothScroll();
    this.initProgressBars();
    this.initCopyCoupon();
    this.initCopyEmail();
    this.initDonutAnimation();
    this.initCursor();
    this.initFavicon();
  }

  /* -------------------------------------------------- */
  /* NAVBAR                                              */
  /* -------------------------------------------------- */

  initNavbar() {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 40) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------- */
  /* REVEAL                                              */
  /* -------------------------------------------------- */

  initReveal() {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------- */
  /* MENU — hamburger com animação de ícone              */
  /* -------------------------------------------------- */

  initMenu() {
    this.hamburger.addEventListener('click', () => {
      const isOpen = this.navLinks.classList.toggle('open');
      this.hamburger.setAttribute('aria-expanded', isOpen);
      this._animateHamburger(isOpen);
    });

    this.navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        this.navLinks.classList.remove('open');
        this.hamburger.setAttribute('aria-expanded', false);
        this._animateHamburger(false);
      });
    });

    document.addEventListener('click', (e) => {
      const clickedOutside =
        !this.navLinks.contains(e.target) && !this.hamburger.contains(e.target);

      if (clickedOutside && this.navLinks.classList.contains('open')) {
        this.navLinks.classList.remove('open');
        this.hamburger.setAttribute('aria-expanded', false);
        this._animateHamburger(false);
      }
    });
  }

  _animateHamburger(isOpen) {
    const spans = this.hamburger.querySelectorAll('span');
    if (!spans.length) return;

    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[1].style.transform = 'scaleX(0)';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[1].style.transform = '';
      spans[2].style.transform = '';
    }
  }

  /* -------------------------------------------------- */
  /* SMOOTH SCROLL                                       */
  /* -------------------------------------------------- */

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        const target = document.querySelector(href);

        if (!target || href === '#') return;

        e.preventDefault();

        const offset = this.navbar.offsetHeight + 20;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

        this._smoothScroll(targetY, 920);
      });
    });
  }

  _smoothScroll(targetY, duration) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();

    const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /* -------------------------------------------------- */
  /* PROGRESS BARS                                       */
  /* -------------------------------------------------- */

  initProgressBars() {
    const bars = document.querySelectorAll('.stat-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = parseFloat(entry.target.dataset.fill) || 0;
            entry.target.style.transform = `scaleX(${fill})`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  /* -------------------------------------------------- */
  /* DONUT ANIMATION — conic-gradient animado           */
  /* -------------------------------------------------- */

  initDonutAnimation() {
    const donuts = document.querySelectorAll('.donut');
    if (!donuts.length) return;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const config = {
      'donut-followers': (p) =>
        `conic-gradient(var(--mint-500) 0 ${p * 72}%, var(--neutral-200) ${p * 72}% 100%)`,
      'donut-gender': (p) =>
        `conic-gradient(var(--champagne) 0 ${p * 64}%, var(--neutral-200) ${p * 64}% 100%)`,
      'donut-content': (p) => {
        const m = p * 72;
        const c = p * 95;
        return `conic-gradient(var(--mint-500) 0 ${m}%, var(--champagne) ${m}% ${c}%, var(--neutral-200) ${c}% 100%)`;
      },
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const donut = entry.target;
          const type = Object.keys(config).find((k) => donut.classList.contains(k));
          if (!type) return;

          const fn = config[type];
          const duration = 1400;
          const start = performance.now();

          donut.style.background = fn(0);

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            donut.style.background = fn(easeOutCubic(progress));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.unobserve(donut);
        });
      },
      { threshold: 0.4 }
    );

    donuts.forEach((d) => observer.observe(d));
  }

  /* -------------------------------------------------- */
  /* CURSOR CUSTOMIZADO — apenas desktop                 */
  /* -------------------------------------------------- */

  initCursor() {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    document.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      dot.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
    });

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(2.4)';
        dot.style.background = 'var(--champagne)';
        dot.style.opacity = '0.75';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.background = 'var(--mint-500)';
        dot.style.opacity = '1';
      });
    });
  }

  /* -------------------------------------------------- */
  /* FAVICON — injeta via JS, sem alterar HTML           */
  /* -------------------------------------------------- */

  initFavicon() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#1c1a16"/>
      <text x="16" y="22" font-family="Georgia, serif" font-size="17"
        fill="#2f9a78" text-anchor="middle" font-style="italic">L</text>
    </svg>`;

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    document.head.appendChild(link);
  }

  /* -------------------------------------------------- */
  /* COPY COUPON                                         */
  /* -------------------------------------------------- */

  initCopyCoupon() {
    const couponBox = document.getElementById('copy-coupon');
    const couponText = document.getElementById('coupon-text');

    if (!couponBox || !couponText) return;

    couponBox.addEventListener('click', async () => {
      const original = couponText.textContent;
      couponText.textContent = 'COPIADO ✓';
      setTimeout(() => {
        couponText.textContent = original;
      }, 1800);

      try {
        await navigator.clipboard.writeText('LIVIAMOREIRA10');
      } catch {
        this.fallbackCopy('LIVIAMOREIRA10');
      }
    });
  }

  /* -------------------------------------------------- */
  /* COPY EMAIL                                          */
  /* -------------------------------------------------- */

  initCopyEmail() {
    const button = document.getElementById('copy-email');
    const emailText = document.getElementById('email-text');

    if (!button || !emailText) return;

    button.addEventListener('click', async () => {
      const original = emailText.textContent.trim();
      emailText.textContent = 'E-mail copiado ✓';
      setTimeout(() => {
        emailText.textContent = original;
      }, 1800);

      try {
        await navigator.clipboard.writeText(original);
      } catch {
        this.fallbackCopy(original);
      }
    });
  }

  /* -------------------------------------------------- */
  /* FALLBACK COPY                                       */
  /* -------------------------------------------------- */

  fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Cópia não suportada:', err);
    }

    document.body.removeChild(textarea);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MediaKit();
});

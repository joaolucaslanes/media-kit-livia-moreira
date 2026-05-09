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
  }

  /* -------------------------------------------------- */
  /* NAVBAR — adiciona classe "scrolled" ao rolar        */
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
  /* REVEAL — anima elementos ao entrarem na viewport    */
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
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* -------------------------------------------------- */
  /* MENU — hamburger para mobile                        */
  /* -------------------------------------------------- */

  initMenu() {
    this.hamburger.addEventListener('click', () => {
      const isOpen = this.navLinks.classList.toggle('open');
      this.hamburger.setAttribute('aria-expanded', isOpen);
    });

    this.navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        this.navLinks.classList.remove('open');
        this.hamburger.setAttribute('aria-expanded', false);
      });
    });

    document.addEventListener('click', (e) => {
      const clickedOutside =
        !this.navLinks.contains(e.target) && !this.hamburger.contains(e.target);

      if (clickedOutside && this.navLinks.classList.contains('open')) {
        this.navLinks.classList.remove('open');
        this.hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* -------------------------------------------------- */
  /* SMOOTH SCROLL — easing customizado suave            */
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

  /* Easing easeInOutQuart — scroll leve e fluido */
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
  /* PROGRESS BARS — anima barras ao entrar na viewport  */
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
  /* COPY COUPON — copia o cupom e dá feedback visual    */
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
  /* COPY EMAIL — copia o e-mail e dá feedback visual    */
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
  /* FALLBACK COPY — para browsers sem Clipboard API     */
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

/**
 * ============================================================================
 * MAISON SÉLÉNÉ — HAUTE GASTRONOMIE & CELESTIAL BRASSERIE
 * Client-Side Application & Interactive Culinary Experience
 * ============================================================================
 */

/* ---------- 1. Hero Carousel with Touch Ergonomics ---------- */
function initHeroCarousel() {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');
  const heroSection = document.querySelector('.hero');

  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(btn);
    });
  }
  const dots = dotsWrap ? [...dotsWrap.children] : [];

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');

    resetTimer();
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 6500);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }

  // Initial activate
  goToSlide(0);
}



/* ---------- 2. Header Glassmorphism & Mobile Menu Drawer ---------- */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('menuToggle');
  const fab = document.getElementById('mobileFab');

  if (!header || !nav || !toggle) return;

  function onScroll() {
    const isScrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', isScrolled);

    // Mobile floating action button display
    if (fab) {
      fab.classList.toggle('show', window.scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile Drawer Toggle
  function toggleNav() {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    header.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', toggleNav);

  // Close when clicking nav links
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close when clicking outside on drawer background
  nav.addEventListener('click', (e) => {
    if (e.target === nav) {
      closeNav();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
    }
  });

  // Close when resizing beyond tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('open')) {
      closeNav();
    }
  }, { passive: true });
}

/* ---------- 3. Interactive Menu Category Filtering & Actions ---------- */
function initMenuFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update button active state & ARIA attributes
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards with smooth staggered fade
      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const match = filterValue === 'all' || category === filterValue;

        if (match) {
          card.classList.remove('hidden');
          card.classList.remove('fade-in');
          // Trigger reflow to restart css animation
          void card.offsetWidth;
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-in');
        }
      });
    });
  });

  // Handle "Reserve with this Dish" quick clicks
  document.querySelectorAll('.card-reserve-link').forEach(link => {
    link.addEventListener('click', () => {
      const dishName = link.getAttribute('data-dish');
      const formMsg = document.getElementById('formMsg');
      if (dishName && formMsg) {
        formMsg.className = 'form-msg ok';
        formMsg.textContent = `✦ Table request pre-noted for: "${dishName}". Complete the details below to confirm.`;
      }
    });
  });
}

/* ---------- 4. Reservation Form Handling ---------- */
function initReservationForm() {
  const form = document.getElementById('resForm');
  const msg = document.getElementById('formMsg');
  const dateInput = document.getElementById('rdate');

  if (!form || !msg) return;

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rname').value.trim();
    const email = document.getElementById('remail').value.trim();
    const phone = document.getElementById('rphone').value.trim();
    const date = document.getElementById('rdate').value;
    const time = document.getElementById('rtime').value;
    const guests = document.getElementById('rguests').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !phone || !date) {
      msg.className = 'form-msg err';
      msg.textContent = 'Please fill in your name, email, phone number, and preferred date.';
      return;
    }

    if (!emailRegex.test(email)) {
      msg.className = 'form-msg err';
      msg.textContent = 'Please enter a valid email address (e.g. name@example.com).';
      return;
    }

    // Check Monday closure (day 1 in local date)
    const selectedDate = new Date(date + 'T12:00:00');
    if (selectedDate.getDay() === 1) {
      msg.className = 'form-msg err';
      msg.textContent = 'We are closed on Mondays. Please choose Tuesday through Sunday.';
      return;
    }

    const expSelect = document.getElementById('rexperience');
    const expText = expSelect ? expSelect.options[expSelect.selectedIndex].text : 'Main Brasserie Hall';

    msg.className = 'form-msg ok';
    msg.textContent = `Merci beaucoup, ${name}! Your reservation request for ${guests} on ${date} at ${time} (${expText}) at Maison Séléné has been received. Our maître d'hôtel will send your confirmation shortly.`;
    form.reset();
  });
}

/* ---------- 4. Scroll Spy for Main Navigation ---------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = [];

  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      sections.push({ id, target, link });
    }
  });

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeLink = sections.find(s => s.id === entry.target.id);
        if (activeLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.link.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px'
  });

  sections.forEach(s => spyObserver.observe(s.target));
}

/* ---------- 5. Staggered Scroll Reveal ---------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ---------- 6. Robust Image Error Fallback Placeholder ---------- */
function initImageFallback() {
  const PLACEHOLDER_SVG = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14432d"/>
          <stop offset="100%" stop-color="#0a2418"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="400" cy="265" r="48" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.6"/>
      <text x="400" y="275" font-family="'Playfair Display', Georgia, serif" font-size="28" fill="#d4af37" text-anchor="middle">☽ S</text>
      <text x="400" y="348" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="2">Maison Séléné</text>
      <text x="400" y="380" font-family="'Inter', sans-serif" font-size="12" fill="#d4af37" text-anchor="middle" letter-spacing="3">HAUTE GASTRONOMIE • CELESTIAL BRASSERIE</text>
    </svg>
  `);

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName !== 'IMG') return;

    if (!img.dataset.retried) {
      img.dataset.retried = '1';
      const sep = img.src.includes('?') ? '&' : '?';
      img.src = `${img.src}${sep}retry=${Date.now()}`;
    } else {
      img.src = PLACEHOLDER_SVG;
    }
  }, true);
}

/* ---------- Initialization on DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initNavigation();
  initMenuFiltering();
  initReservationForm();
  initScrollSpy();
  initScrollAnimations();
  initImageFallback();
});

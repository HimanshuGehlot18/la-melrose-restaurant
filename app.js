/**
 * ============================================================================
 * LA MELROSE — LUXURY BRASSERIE CLIENT-SIDE APPLICATION
 * Engineered using responsive-ui, ui-ux-design & cinematic-fx standards
 * ============================================================================
 */

/* ---------- 1. Zero-Allocation Canvas Particle Engine (cinematic-fx) ---------- */
class LoaderParticleEngine {
  constructor(canvas, maxParticles = 50) {
    this.canvas = canvas;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.maxParticles = maxParticles;
    this.particles = new Float32Array(maxParticles * 6); // [x, y, vx, vy, size, alpha]
    this.running = false;
    this.rafId = null;

    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.resetParticle(i, true);
    }
  }

  resetParticle(i, randomY = false) {
    const offset = i * 6;
    this.particles[offset] = Math.random() * this.canvas.width; // x
    this.particles[offset + 1] = randomY ? Math.random() * this.canvas.height : this.canvas.height + 10; // y
    this.particles[offset + 2] = (Math.random() - 0.5) * 0.6; // vx
    this.particles[offset + 3] = -0.2 - Math.random() * 0.6; // vy (upward drift)
    this.particles[offset + 4] = 1.0 + Math.random() * 2.2; // size
    this.particles[offset + 5] = 0.15 + Math.random() * 0.7; // alpha
  }

  start() {
    if (this.running || !this.canvas) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  render() {
    const { ctx, canvas } = this;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const glowColor = '#d4af37';
    for (let i = 0; i < this.maxParticles; i++) {
      const offset = i * 6;
      this.particles[offset] += this.particles[offset + 2];
      this.particles[offset + 1] += this.particles[offset + 3];

      if (this.particles[offset + 1] < -10) {
        this.resetParticle(i, false);
      }

      ctx.save();
      ctx.globalAlpha = this.particles[offset + 5];
      ctx.fillStyle = glowColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = glowColor;
      ctx.beginPath();
      ctx.arc(
        this.particles[offset],
        this.particles[offset + 1],
        this.particles[offset + 4],
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }
  }
}

/* ---------- 2. Website Opening Motion Sequence ---------- */
function initOpeningMotion() {
  const loader = document.getElementById('siteLoader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderCanvas = document.getElementById('loaderCanvas');
  const body = document.body;

  if (!loader) return;

  // Check reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.style.display = 'none';
    body.classList.remove('loader-locked');
    return;
  }

  body.classList.add('loader-locked');

  // Start particles
  const particles = new LoaderParticleEngine(loaderCanvas, 40);
  particles.start();

  // Progress animation
  let progress = 0;
  const startTime = performance.now();
  const duration = 1200; // 1.2 seconds for a refined luxury feel

  function updateProgress(now) {
    const elapsed = now - startTime;
    progress = Math.min(100, Math.round((elapsed / duration) * 100));
    if (loaderBar) {
      loaderBar.style.width = `${progress}%`;
    }

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        loader.classList.add('loader-hidden');
        body.classList.remove('loader-locked');
        setTimeout(() => {
          particles.stop();
        }, 1100);
      }, 250);
    }
  }

  requestAnimationFrame(updateProgress);
}

/* ---------- 3. Hero Carousel with Touch Ergonomics ---------- */
function initHeroCarousel() {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');
  const heroSection = document.querySelector('.hero');

  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let autoTimer = null;

  dotsWrap.innerHTML = '';
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(btn);
  });
  const dots = [...dotsWrap.children];

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
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Mobile Touch Swipe Gesture handling
  if (heroSection) {
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
      }
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Ensure horizontal swipe is dominant and beyond 45px threshold
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      isSwiping = false;
    }, { passive: true });
  }

  // Initial activation
  goToSlide(0);
}

/* ---------- 4. Continuous Marquee Strip ---------- */
function initMarquee() {
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (!marqueeTrack) return;

  const items = [
    'Fresh Farm Ingredients',
    'Comfort Classics',
    'Brasserie Elegance',
    'Open Tue – Sun',
    'Private Dining Suites',
    'Artisanal Wine Selection',
    'Seasonal Tasting Menu'
  ];

  const htmlContent = items.map(text => `<span>${text}</span><i>✦</i>`).join('');
  // Double for seamless infinite loop
  marqueeTrack.innerHTML = htmlContent + htmlContent;
}

/* ---------- 5. Header Glassmorphism & Mobile Menu Drawer ---------- */
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

  // Close when resizing beyond tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('open')) {
      closeNav();
    }
  }, { passive: true });
}

/* ---------- 6. Special / Signature Dishes with Compact Cards & Expand Details ---------- */
const SPECIAL_DISHES_DATA = [
  {
    n: "Truffle Risotto",
    cat: "Primi Piatti",
    p: "$42.00",
    badge: "Chef Signature",
    snippet: "Acquerello carnaroli rice, 36-month aged Parmigiano-Reggiano, freshly shaved Norcia summer black truffle.",
    desc: "Our signature culinary tribute to Piedmont. We slowly coax Acquerello carnaroli rice in an 18-hour chicken and herb consommé, mounting it with cold cultured butter and aged Parmigiano before finishing tableside with fresh shavings of wild Norcia black truffles.",
    tags: ["Norcia Black Truffle", "Acquerello Carnaroli", "Cultured Butter", "36-Mo Parmigiano", "Vegetarian Available"],
    pairing: "Barolo DOCG 2019 — Elegant dried roses, red cherry, and truffle earthy notes complement the richness perfectly.",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80"
  },
  {
    n: "Slow-Cooked Osso Buco",
    cat: "Secondi Piatti",
    p: "$56.00",
    badge: "Heritage Classic",
    snippet: "Braised milk-fed veal shank in white wine and mirepoix, fresh lemon gremolata, creamy saffron polenta.",
    desc: "Tender milk-fed veal cross-cut shanks are slow-braised for six hours in white wine, marrow stock, and aromatics. Served atop stone-ground polenta infused with Persian saffron and garnished with bright citrus zest gremolata.",
    tags: ["Milk-Fed Veal", "Persian Saffron", "Stone-Ground Polenta", "Citrus Gremolata", "Bone Marrow"],
    pairing: "Brunello di Montalcino 2018 — Deep structure, firm tannins, and dried plum harmonize with braised marrow.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80"
  },
  {
    n: "Lobster Linguine",
    cat: "Primi Piatti",
    p: "$48.00",
    badge: "Seafood Specialty",
    snippet: "Handmade bronze-die pasta, butter-poached Maine lobster, sweet cherry tomato sugo, Calabrian chili.",
    desc: "Extruded daily through bronze dies, our artisanal pasta holds the silky emulsion of shellfish reduction, blistered sweet Vesuvian tomatoes, fresh basil, and sweet Maine lobster tail poached gently in cultured butter.",
    tags: ["Maine Lobster", "Bronze-Die Linguine", "Vesuvian Tomatoes", "Calabrian Chili", "Cultured Butter"],
    pairing: "Prosecco Superiore Valdobbiadene — Crisp orchard fruit effervescence cuts through the lobster butteriness.",
    img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80"
  },
  {
    n: "Margherita Wood-Fired D.O.P.",
    cat: "Pizze Classiche",
    p: "$24.00",
    badge: "Neapolitan Tradition",
    snippet: "San Marzano D.O.P. tomatoes, hand-torn Campania fior di latte, cold-pressed olive oil, mountain oregano.",
    desc: "Fermented for 72 hours for digestibility and blistered in our 900°F oak-fired oven. Crispy on the outer cornicione, cloud-soft inside, topped with crushed tomatoes, fragrant Genovese basil, and artisanal buffalo mozzarella.",
    tags: ["72-Hour Dough", "San Marzano D.O.P.", "Campania Fior di Latte", "Genovese Basil", "Oak-Fired"],
    pairing: "Chianti Classico Riserva — Vibrant acidity balances the sweet tomato sauce and creamy mozzarella.",
    img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&q=80"
  },
  {
    n: "Tiramisu alla Melrose",
    cat: "Dolci",
    p: "$18.00",
    badge: "Pastry Masterpiece",
    snippet: "Espresso-soaked savoiardi sponge, light mascarpone zabaglione mousse, Valrhona dark cocoa veil.",
    desc: "Our grandmother's recipe refined for haute cuisine. Airy ladyfingers soaked in single-origin Ethiopian espresso and dark rum, layered with whipped mascarpone mousse, and crowned with a velvet dusting of 70% Valrhona cocoa.",
    tags: ["Valrhona Cocoa 70%", "Single-Origin Espresso", "Lombardy Mascarpone", "House Savoiardi"],
    pairing: "Vin Santo del Chianti — Notes of honeyed apricots and toasted hazelnuts make the ultimate dessert pairing.",
    img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80"
  },
  {
    n: "White Truffle of Alba Special",
    cat: "Chef Tasting Special",
    p: "$210.00",
    badge: "Seasonal Rare",
    snippet: "Rare Alba white truffles paired with tajarin egg pasta, warm mountain butter, and 48-month parmigiano.",
    desc: "Flown in directly from the foggy hills of Langhe, Piedmont. Delicate courses highlighting the ethereal perfume of prized wild white truffles, paired with hand-cut 40-yolk tajarin and gentle mountain fonduta.",
    tags: ["Alba White Truffles", "40-Yolk Tajarin", "Alpine Butter", "Limited Daily 10 Servings"],
    pairing: "Vintage Barolo Riserva — Earthy ethereal aromatics elevate the irreplaceable fragrance of fresh white truffle.",
    img: "https://images.unsplash.com/photo-1478741747163-0051a6164429?w=900&q=80"
  }
];

function initSpecialDishes() {
  const grid = document.getElementById('specialDishesGrid');
  if (!grid) return;

  grid.innerHTML = SPECIAL_DISHES_DATA.map((dish, i) => `
    <article class="dish-card reveal" style="--i:${i}" data-dish-index="${i}" role="button" tabindex="0" aria-label="${dish.n}, ${dish.p}. Click for full details.">
      <div class="dish-img">
        <img src="${dish.img}" alt="${dish.n}" loading="lazy">
        <span class="dish-expand-hint">✦ Details ↗</span>
      </div>
      <div class="dish-row">
        <h3>${dish.n}</h3>
        <div class="dish-price">${dish.p} <span class="dish-arrow">↗</span></div>
      </div>
      <p class="dish-snippet">${dish.snippet}</p>
    </article>
  `).join('');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.dish-card');
    if (!card) return;
    const index = Number(card.dataset.dishIndex);
    const dish = SPECIAL_DISHES_DATA[index];
    if (dish) openDishModal(dish);
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.dish-card');
      if (!card) return;
      e.preventDefault();
      const index = Number(card.dataset.dishIndex);
      const dish = SPECIAL_DISHES_DATA[index];
      if (dish) openDishModal(dish);
    }
  });
}

/* ---------- 7. Interactive Menu Data & Dynamic View with Image Preview ---------- */
const MENU_DATA = {
  "Appetizers": [
    { n: "Bruschetta al Pomodoro", p: "$12.00", cat: "Antipasti", desc: "Heirloom tomatoes, garlic, extra virgin olive oil on toasted sourdough.", tags: ["Heirloom Tomatoes", "Extra Virgin Olive Oil", "Sourdough", "Vegan"], pairing: "Prosecco di Valdobbiadene", img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=900&q=80" },
    { n: "Caprese Salad", p: "$14.00", cat: "Antipasti", desc: "Buffalo mozzarella, ripe tomatoes, basil leaves with balsamic reduction.", tags: ["Buffalo Mozzarella", "Aged Balsamic", "Fresh Basil", "Vegetarian"], pairing: "Soave Classico DOC", img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=900&q=80" },
    { n: "Arancini di Riso", p: "$16.00", cat: "Antipasti", desc: "Crispy saffron risotto balls stuffed with smoked provolone.", tags: ["Saffron Risotto", "Smoked Provolone", "Arrabbiata Dip"], pairing: "Franciacorta Brut", img: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=900&q=80" },
    { n: "Prosciutto e Melone", p: "$18.00", cat: "Antipasti", desc: "Aged 24-month Parma prosciutto draped over sweet cantaloupe.", tags: ["Parma Prosciutto 24M", "Sweet Cantaloupe", "Aged Balsamic"], pairing: "Lambrusco Grasparossa", img: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=900&q=80" },
    { n: "Burrata with Roasted Peppers", p: "$20.00", cat: "Antipasti", desc: "Pugliese burrata, fire-roasted sweet peppers, pine nut pesto.", tags: ["Pugliese Burrata", "Fire-Roasted Peppers", "Pine Nut Pesto"], pairing: "Pinot Grigio Alto Adige", img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=900&q=80" }
  ],
  "Main Course": [
    { n: "Truffle Risotto", p: "$42.00", cat: "Primi Piatti", desc: "Acquerello carnaroli rice, Parmigiano-Reggiano, freshly shaved Norcia black truffle.", tags: ["Norcia Black Truffles", "Acquerello Rice", "36M Parmigiano"], pairing: "Barolo DOCG 2019", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80" },
    { n: "Slow-Cooked Osso Buco", p: "$56.00", cat: "Secondi Piatti", desc: "Braised veal shank in white wine, gremolata, creamy saffron polenta.", tags: ["Milk-Fed Veal", "Saffron Polenta", "Marrow Gravy"], pairing: "Brunello di Montalcino 2018", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80" },
    { n: "Lobster Linguine", p: "$48.00", cat: "Primi Piatti", desc: "Handmade bronze-die pasta, sweet Maine lobster, spicy cherry tomato sugo.", tags: ["Maine Lobster", "Handmade Linguine", "Calabrian Chili"], pairing: "Vermentino di Sardegna", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900&q=80" },
    { n: "Margherita Wood-Fired Pizza", p: "$24.00", cat: "Pizze Classiche", desc: "San Marzano D.O.P. tomatoes, fior di latte, fresh basil, sea salt.", tags: ["San Marzano D.O.P.", "Campania Fior di Latte", "Oak-Fired"], pairing: "Chianti Classico Riserva", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&q=80" },
    { n: "Parmigiana di Melanzane", p: "$22.00", cat: "Secondi Piatti", desc: "Layered fried eggplant, rich marinara, melted scamorza, parmigiano.", tags: ["Sicilian Eggplant", "Smoked Scamorza", "Vegetarian"], pairing: "Nero d'Avola Sicilia", img: "https://images.unsplash.com/photo-1615995851888-59dc3bee9df8?w=900&q=80" }
  ],
  "Desserts": [
    { n: "Tiramisu alla Melrose", p: "$18.00", cat: "Dolci", desc: "Espresso-soaked savoiardi, mascarpone zabaglione, Valrhona cocoa dust.", tags: ["Single-Origin Espresso", "Lombardy Mascarpone", "Valrhona 70%"], pairing: "Vin Santo del Chianti", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80" },
    { n: "Panna Cotta", p: "$12.00", cat: "Dolci", desc: "Tahitian vanilla bean cream, wild berry gelee, almond brittle.", tags: ["Tahitian Vanilla", "Wild Blackberry Gelee", "Almond Brittle"], pairing: "Moscato d'Asti DOCG", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80" },
    { n: "Cannoli Siciliani", p: "$14.00", cat: "Dolci", desc: "Crisp pastry shell, sweet sheep ricotta, candied orange zest, pistachio.", tags: ["Bronte Pistachio", "Sheep Ricotta", "Candied Orange"], pairing: "Marsala Superiore Dolce", img: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=900&q=80" },
    { n: "Affogato al Caffè", p: "$10.00", cat: "Dolci", desc: "House fior di latte gelato drowned in a shot of single-origin espresso.", tags: ["House Fior di Latte", "Single-Origin Espresso", "Biscotti"], pairing: "Amaretto di Saronno", img: "https://images.unsplash.com/photo-1572803547954-e7cd356e3009?w=900&q=80" }
  ],
  "Wine": [
    { n: "Barolo DOCG 2019", p: "$95.00", cat: "Vini Rossi", desc: "Piedmont vintage, aromas of dried roses, tar, leather, and black cherry.", tags: ["100% Nebbiolo", "Piedmont DOCG", "Oak Aged 38M"], pairing: "Truffle Risotto & Braised Meats", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80" },
    { n: "Chianti Classico Riserva", p: "$68.00", cat: "Vini Rossi", desc: "Tuscan Sangiovese, notes of ripe plum, violet, and toasted French oak.", tags: ["85% Sangiovese", "Tuscany", "24M Cask Aging"], pairing: "Wood-Fired Pizza & Charcuterie", img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=900&q=80" },
    { n: "Prosecco di Valdobbiadene", p: "$45.00", cat: "Spumante", desc: "Superiore brut sparkling, crisp green apple notes and fine persistent perlage.", tags: ["100% Glera", "Valdobbiadene DOCG", "Metodo Martinotti"], pairing: "Fresh Oysters & Appetizers", img: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa2?w=900&q=80" },
    { n: "Brunello di Montalcino", p: "$120.00", cat: "Vini Rossi", desc: "Full-bodied Tuscan icon, structured tannins, lingering balsamic finish.", tags: ["100% Sangiovese Grosso", "Montalcino", "5 Years Aged"], pairing: "Osso Buco & Prime Bistecca", img: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=900&q=80" }
  ],
  "Specials": [
    { n: "Chef's 7-Course Tasting", p: "$180.00", cat: "Degustazione", desc: "An exclusive sensory journey through regional Italian micro-seasons.", tags: ["7 Signature Courses", "Seasonal Micro-Harvest", "Tableside Finishing"], pairing: "Includes Full Sommelier Flight", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80" },
    { n: "White Truffle of Alba Edition", p: "$210.00", cat: "Degustazione", desc: "Fresh Alba white truffle paired across four signature autumn courses.", tags: ["Piedmont White Truffles", "4 Courses", "Limited Daily 10 Sets"], pairing: "Vintage Barolo Flight", img: "https://images.unsplash.com/photo-1478741747163-0051a6164429?w=900&q=80" },
    { n: "Seasonal Degustation", p: "$150.00", cat: "Degustazione", desc: "Curated seafood and wild game pairings with master sommelier selections.", tags: ["Wild Game & Seafood", "5 Courses", "Tuscan Terroir"], pairing: "Super Tuscan & Friuli Pairings", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80" }
  ]
};

function initMenuSection() {
  const tabsEl = document.getElementById('tabs');
  const listEl = document.getElementById('menuList');
  const menuImg = document.getElementById('menuImg');
  const capEl = document.getElementById('menuCap');
  const menuPhoto = document.getElementById('menuPhoto');

  if (!tabsEl || !listEl || !menuImg) return;

  let activeCat = "Appetizers";
  let activeIdx = 0;

  function renderTabs() {
    tabsEl.innerHTML = Object.keys(MENU_DATA).map(category => `
      <button class="tab ${category === activeCat ? 'active' : ''}" data-cat="${category}" role="tab" aria-selected="${category === activeCat}">
        ${category}
      </button>
    `).join('');
  }

  function renderList() {
    const items = MENU_DATA[activeCat] || [];
    listEl.innerHTML = items.map((item, i) => `
      <div class="menu-item ${i === activeIdx ? 'active' : ''}" data-i="${i}" role="button" tabindex="0" aria-label="${item.n}, ${item.p}. Click to see photo & details.">
        <div class="menu-item-info">
          <img class="menu-item-img-btn" src="${item.img}" alt="${item.n}" loading="lazy">
          <div>
            <h4>${item.n}</h4>
            <p style="font-size:13px;color:var(--ink-muted);margin-top:2px">${item.desc}</p>
          </div>
        </div>
        <div class="menu-item-side">
          <span class="price">${item.p}</span>
          <span class="menu-view-tag">🔍 View</span>
        </div>
      </div>
    `).join('');

    updateFeaturedPhoto();
  }

  function updateFeaturedPhoto() {
    const items = MENU_DATA[activeCat] || [];
    const selected = items[activeIdx];
    if (selected && menuImg) {
      menuImg.src = selected.img;
      menuImg.alt = selected.n;
      if (capEl) {
        capEl.textContent = `${selected.n}  ·  ${selected.p}`;
        capEl.classList.remove('show');
        void capEl.offsetWidth; // Trigger reflow
        capEl.classList.add('show');
      }
    }
  }

  tabsEl.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.tab');
    if (!tabBtn) return;
    activeCat = tabBtn.dataset.cat;
    activeIdx = 0;
    renderTabs();
    renderList();
  });

  listEl.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.menu-item');
    if (!itemEl) return;
    activeIdx = Number(itemEl.dataset.i);
    renderList();

    const selectedItem = (MENU_DATA[activeCat] || [])[activeIdx];
    // If clicked on thumbnail, view tag, or if on mobile viewport, open the full visual detail modal!
    if (e.target.closest('.menu-item-img-btn') || e.target.closest('.menu-view-tag') || window.innerWidth <= 768) {
      if (selectedItem) openDishModal(selectedItem);
    }
  });

  listEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const itemEl = e.target.closest('.menu-item');
      if (!itemEl) return;
      e.preventDefault();
      activeIdx = Number(itemEl.dataset.i);
      renderList();
      const selectedItem = (MENU_DATA[activeCat] || [])[activeIdx];
      if (selectedItem) openDishModal(selectedItem);
    }
  });

  // Clicking the featured photo opens the high-resolution lightbox modal!
  if (menuPhoto) {
    menuPhoto.addEventListener('click', () => {
      const selectedItem = (MENU_DATA[activeCat] || [])[activeIdx];
      if (selectedItem) openDishModal(selectedItem);
    });
  }

  renderTabs();
  renderList();
}

/* ---------- 8. Dish Detail Lightbox / Modal Controller ---------- */
function openDishModal(dish) {
  const modal = document.getElementById('dishModal');
  const modalImg = document.getElementById('modalDishImg');
  const modalBadge = document.getElementById('modalDishBadge');
  const modalCat = document.getElementById('modalDishCat');
  const modalTitle = document.getElementById('modalDishTitle');
  const modalPrice = document.getElementById('modalDishPrice');
  const modalDesc = document.getElementById('modalDishDesc');
  const modalTags = document.getElementById('modalDishTags');
  const modalPairing = document.getElementById('modalDishPairingText');

  if (!modal) return;

  if (modalImg) modalImg.src = dish.img || '';
  if (modalBadge) modalBadge.textContent = dish.badge || 'Chef Specialty';
  if (modalCat) modalCat.textContent = dish.cat || 'Curated Dish';
  if (modalTitle) modalTitle.textContent = dish.n || '';
  if (modalPrice) modalPrice.textContent = dish.p || '';
  if (modalDesc) modalDesc.textContent = dish.desc || dish.snippet || '';

  if (modalTags) {
    const tags = dish.tags || ['Handcrafted', 'Fresh Ingredients', 'Artisanal'];
    modalTags.innerHTML = tags.map(t => `<span class="dish-tag">${t}</span>`).join('');
  }

  if (modalPairing) {
    modalPairing.textContent = dish.pairing || 'Ask our master sommelier for an artisanal vintage pairing recommendation.';
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDishModal() {
  const modal = document.getElementById('dishModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initDishModalEvents() {
  const modal = document.getElementById('dishModal');
  const closeBtn = document.getElementById('dishModalClose');
  const closeBtnBottom = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('dishModalBackdrop');
  const bookBtn = document.getElementById('modalBookBtn');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeDishModal);
  if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeDishModal);
  if (backdrop) backdrop.addEventListener('click', closeDishModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeDishModal();
    }
  });

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      closeDishModal();
      const resSection = document.getElementById('reservation');
      if (resSection) {
        resSection.scrollIntoView({ behavior: 'smooth' });
        // Subtle focus animation on the form
        const form = document.getElementById('resForm');
        if (form) {
          form.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.45)';
          setTimeout(() => { form.style.boxShadow = ''; }, 1800);
        }
      }
    });
  }
}

/* ---------- 7. Reservation Form Handling ---------- */
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

    msg.className = 'form-msg ok';
    msg.textContent = `Grazie, ${name}! Your reservation request for ${guests} on ${date} at ${time} has been received. A confirmation email is on its way.`;
    form.reset();
  });
}

/* ---------- 8. Scroll Spy for Main Navigation ---------- */
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

/* ---------- 9. Staggered Scroll Reveal & Animated Counters ---------- */
function initScrollAnimations() {
  // Staggered reveal
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

  // Animated counters
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const targetVal = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();

      function tick(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Cubic ease-out
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.round(targetVal * ease);
        el.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

/* ---------- 10. Robust Image Error Fallback Placeholder ---------- */
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
      <circle cx="400" cy="270" r="48" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.6"/>
      <text x="400" y="278" font-family="'Dancing Script', cursive" font-size="28" fill="#d4af37" text-anchor="middle">LM</text>
      <text x="400" y="350" font-family="'Inter', sans-serif" font-size="20" font-weight="500" fill="#ffffff" text-anchor="middle" letter-spacing="2">La Melrose Brasserie</text>
      <text x="400" y="380" font-family="'Inter', sans-serif" font-size="13" fill="#d4af37" text-anchor="middle" letter-spacing="3">COMFORT CLASSICS</text>
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
  initOpeningMotion();
  initHeroCarousel();
  initMarquee();
  initNavigation();
  initSpecialDishes();
  initMenuSection();
  initDishModalEvents();
  initReservationForm();
  initScrollSpy();
  initScrollAnimations();
  initImageFallback();
});

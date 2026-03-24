const segmented = document.querySelector('.segmented');
const indicator = document.querySelector('.segmented .seg-indicator');
const selector = Array.from(document.querySelectorAll('.segmented button'));

initLoadingScreen();

function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (!document.body) {
    return;
  }

  if (!loadingScreen) {
    document.body.classList.add("page-ready");
    return;
  }

  const animationDuration = 3300;
  const fadeDuration = 350;
  window.setTimeout(() => {
    loadingScreen.classList.add("is-exiting");
    document.body.classList.add("page-ready");
    window.setTimeout(() => {
      loadingScreen.style.display = "none";
    }, fadeDuration);
  }, animationDuration);
}

function moveIndicatorTo(btn, immediate = false) {
  if (!btn || !segmented || !indicator) return;

  const segRect = segmented.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const x = (btnRect.left - segRect.left) + segmented.scrollLeft;
  const w = btnRect.width;

  if (immediate) {
    const prev = indicator.style.transition;
    indicator.style.transition = 'none';
    indicator.style.transform = `translateX(${Math.round(x)}px)`;
    indicator.style.width = `${Math.round(w)}px`;
    void indicator.offsetHeight; // force reflow
    indicator.style.transition = prev;
  } else {
    indicator.style.transform = `translateX(${Math.round(x)}px)`;
    indicator.style.width = `${Math.round(w)}px`;
  }
}

function setActive(btn) {
  selector.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  moveIndicatorTo(btn);

  // hook your filter logic here:
  // render(btn.dataset.filter);
}

selector.forEach(btn => btn.addEventListener('click', () => setActive(btn)));

window.addEventListener('resize', () => {
  const active = selector.find(b => b.getAttribute('aria-pressed') === 'true') || selector[0];
  moveIndicatorTo(active, true);
});

// initial position
const defaultActive = selector.find(b => b.getAttribute('aria-pressed') === 'true') || selector[0];
moveIndicatorTo(defaultActive, true);

function bindCardEffects() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const handleMove = (e) => {
      const bcr = card.getBoundingClientRect();
      const relX = e.clientX - bcr.left;
      const relY = e.clientY - bcr.top;
      card.style.setProperty("--x", relX);
      card.style.setProperty("--y", relY);

      const x = Math.min(1, Math.max(0, relX / bcr.width));
      const y = Math.min(1, Math.max(0, relY / bcr.height));
      const reverse = settings.reverse ? -1 : 1;
      const tiltX = reverse * (settings.max / 2 - x * settings.max);
      const tiltY = reverse * (y * settings.max - settings.max / 2);
      card.style.transform = `
      rotateX(${settings.axis === "x" ? 0 : tiltY}deg)
      rotateY(${settings.axis === "y" ? 0 : tiltX}deg)
      scale(${settings.scale})
    `;
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("pointermove", handleMove);

    card.addEventListener("pointerleave", () => {
      card.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
    });

    const handleNavigate = (e) => {
      if (e && e.target && e.target.closest && e.target.closest("a")) return;
      const href = card.dataset.href;
      if (!href) return;
      window.location.href = href;
    };

    card.addEventListener("click", handleNavigate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNavigate(e);
      }
    });
  });
}

const settings = {
  reverse: 1, // Reverse tilt: 1, 0
  max: 5, // Max tilt: 35
  perspective: 1000, // Parent perspective px: 1000
  scale: 1, // Tilt element scale factor: 1.0
  axis: "" // Limit axis. "y", "x"
};

const cardWrap = document.querySelector("#card-wrap") || document.querySelector(".card-grid");
if (cardWrap) {
  cardWrap.style.perspective = `${settings.perspective}px`;
}


   const items = [
      { id: 1, title: "My Portfolio", category: "personal", status: "ongoing", date: "31st October 2024", href: "#", thumb: "../styles/img/thumbnailPortfolio.png" },
      // { id: 2, title: "WORK TITLE", category: "client", status: "finished", date: "4th January 2026", href: "#", thumb: "" },
      // { id: 3, title: "WORK TITLE", category: "client", status: "planned", date: "4th January 2026", href: "#", thumb: "" },
      // { id: 4, title: "WORK TITLE", category: "concept", status: "ongoing", date: "4th January 2026", href: "#", thumb: "" },
      // { id: 5, title: "WORK TITLE", category: "personal", status: "ongoing", date: "4th January 2026", href: "#", thumb: "" },
      // { id: 6, title: "WORK TITLE", category: "concept", status: "ongoing", date: "4th January 2026", href: "#", thumb: "" },
      // { id: 7, title: "WORK TITLE", category: "personal", status: "ongoing", date: "4th January 2026", href: "#", thumb: "" },
      // { id: 8, title: "WORK TITLE", category: "client", status: "ongoing", date: "4th January 2026", href: "#", thumb: "" },
    ];

    const grid = document.getElementById('grid');

    function cardTemplate(item){
      const catLabel = item.category.toUpperCase();
      const statusLabel = item.status.toUpperCase();
      const thumbStyle = item.thumb ? `style="background-image: url('${item.thumb}');"` : '';

      return `
        <article class="card" data-category="${item.category}" data-href="${item.href}" role="link" tabindex="0" aria-label="View ${item.title}">
          <div class="thumb" aria-hidden="true" ${thumbStyle}></div>
          <div class="content">
            <h2 class="workTitle">${item.title}</h2>
            <div class="meta" aria-label="Work tags">
              <span class="pill ${item.status === 'ongoing' ? 'pill--ongoing' : ''}${item.status === 'finished' ? ' pill--finished' : ''}">${statusLabel}</span>
              <span class="pill pill--${item.category}">${catLabel}</span>
            </div>
            <div class="date">${item.date}</div>
            <a class="view" href="${item.href}">view this<span class="arrow">→</span></a>
          </div>
        </article>
      `;
    }

    function render(filter){
      const normalized = (filter || 'all').toLowerCase();
      const visible = normalized === 'all' ? items : items.filter(i => i.category === normalized);
      grid.innerHTML = visible.map(cardTemplate).join('');
    }


    function moveIndicatorTo(btn, immediate = false){
      if (!btn || !segmented || !indicator) return;
      const segRect = segmented.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      const x = (btnRect.left - segRect.left) + segmented.scrollLeft;
      const w = btnRect.width;

      if (immediate) {
        const prev = indicator.style.transition;
        indicator.style.transition = 'none';
        indicator.style.transform = `translateX(${Math.round(x)}px)`;
        indicator.style.width = `${Math.round(w)}px`;
        // force reflow then restore
        void indicator.offsetHeight;
        indicator.style.transition = prev;
      } else {
        indicator.style.transform = `translateX(${Math.round(x)}px)`;
        indicator.style.width = `${Math.round(w)}px`;
      }
    }

    function setActive(btn){
      selector.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      moveIndicatorTo(btn);
      render(btn.dataset.filter);
      bindCardEffects();
    }

    function applyFilterFromHash(){
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();
      if (!hash) return false;
      const target = selector.find(b => (b.dataset.filter || '').toLowerCase() === hash);
      if (!target) return false;
      setActive(target);
      return true;
    }

    selector.forEach(btn => {
      btn.addEventListener('click', () => setActive(btn));
    });

    // Keep indicator aligned on resize
    window.addEventListener('resize', () => {
      const active = selector.find(b => b.getAttribute('aria-pressed') === 'true') || selector[0];
      moveIndicatorTo(active, true);
    });

    // Initial render (allow deep-linking via #filter)
    if (!applyFilterFromHash()) {
      const defaultBtn = selector.find(b => b.getAttribute('aria-pressed') === 'true') || selector[0];
      if (defaultBtn) {
        setActive(defaultBtn);
      } else {
        render('all');
        bindCardEffects();
      }
    }

    window.addEventListener('hashchange', () => {
      applyFilterFromHash();
    });


    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Optional: smooth anchor to contact (no deps)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // --- Lightweight self-tests (open DevTools console to see results) ---
    function assert(name, condition){
      if (!condition) {
        console.error(`❌ ${name}`);
        throw new Error(`Test failed: ${name}`);
      }
      console.log(`✅ ${name}`);
    }

    try {
      assert('Segmented selector exist', selector.length >= 4);
      assert('Indicator exists', !!indicator);
      render('personal');
      assert('Filter renders at least 1 card', document.querySelectorAll('.grid .card').length >= 1);
      render('all');
      assert('All renders full list', document.querySelectorAll('.grid .card').length === items.length);
      moveIndicatorTo(selector[0], true);
      assert('Indicator has width set', (indicator.style.width || '').includes('px'));
    } catch (_) {
      // keep page running even if tests fail
    }

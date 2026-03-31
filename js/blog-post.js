initLoadingScreen();

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  ensureComponentFallbacks();
  bindRelatedCardGlow();
  initReadingProgressFallback();
});

function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (!document.body) {
    return;
  }

  if (!loadingScreen) {
    document.body.classList.add("page-ready");
    initPostAnimations();
    return;
  }

  const animationDuration = 3300;
  const fadeDuration = 350;

  window.setTimeout(() => {
    loadingScreen.classList.add("is-exiting");
    document.body.classList.add("page-ready");
    initPostAnimations();

    window.setTimeout(() => {
      loadingScreen.style.display = "none";
    }, fadeDuration);
  }, animationDuration);
}

function initLenis() {
  if (typeof Lenis !== "function") {
    return;
  }

  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  }

  window.requestAnimationFrame(raf);
}

function initPostAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  initHeroReveal();
  initReadingProgress();
  initFeatureParallax();
  initArticleReveals();
  initRelatedPostsReveal();
}

function initHeroReveal() {
  const targets = [
    ".back-link",
    ".post-meta-row",
    ".post-title",
    ".post-dek",
    ".post-feature-figure"
  ];

  const filteredTargets = targets.flatMap((selector) => gsap.utils.toArray(selector));
  if (!filteredTargets.length) {
    return;
  }

  gsap.fromTo(
    filteredTargets,
    {
      opacity: 0,
      y: 32
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.1,
      clearProps: "transform"
    }
  );
}

function initReadingProgress() {
  const article = document.getElementById("post-article");
  const progressBar = document.querySelector(".reading-progress-bar");
  if (!article || !progressBar) {
    return;
  }

  gsap.fromTo(
    progressBar,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: article,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    }
  );
}

function initReadingProgressFallback() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined")
  ) {
    return;
  }

  const article = document.getElementById("post-article");
  const progressBar = document.querySelector(".reading-progress-bar");
  if (!article || !progressBar) {
    return;
  }

  const update = () => {
    const start = article.offsetTop;
    const end = article.offsetTop + article.offsetHeight - window.innerHeight;
    const range = Math.max(end - start, 1);
    const current = clamp(window.scrollY - start, 0, range);
    const progress = current / range;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function initFeatureParallax() {
  const frame = document.querySelector(".post-feature-frame");
  const media = document.querySelector(".post-feature-image");
  if (!frame || !media) {
    return;
  }

  gsap.fromTo(
    media,
    {
      yPercent: -6,
      scale: 1.1
    },
    {
      yPercent: 6,
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7
      }
    }
  );
}

function initArticleReveals() {
  const targets = gsap.utils.toArray(
    ".post-prose h2, .post-prose h3, .post-prose figure, .post-callout, .post-pullquote, .post-prose blockquote:not(.post-pullquote), .post-prose pre"
  );

  targets.forEach((target) => {
    gsap.fromTo(
      target,
      {
        opacity: 0,
        y: 26
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: target,
          start: "top 88%",
          once: true
        }
      }
    );
  });
}

function initRelatedPostsReveal() {
  const cards = gsap.utils.toArray(".related-card");
  if (!cards.length) {
    return;
  }

  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 32
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".related-grid",
        start: "top 82%",
        once: true
      }
    }
  );
}

function bindRelatedCardGlow() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) {
    return;
  }

  const cards = document.querySelectorAll(".related-card");
  cards.forEach((card) => {
    const updateGlow = (event) => {
      const rect = card.getBoundingClientRect();
      const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
      card.style.setProperty("--mx", `${Math.round(x)}px`);
      card.style.setProperty("--my", `${Math.round(y)}px`);
    };

    card.addEventListener("pointermove", updateGlow);
  });
}

function ensureComponentFallbacks() {
  const navbarMount = document.getElementById("navbar-load");
  const footerMount = document.getElementById("footer-load");

  if (!navbarMount && !footerMount) {
    return;
  }

  let checks = 0;
  const maxChecks = 8;
  const intervalMs = 200;

  const resolveFallbacks = () => {
    checks += 1;

    const navbarReady = !navbarMount || !!navbarMount.querySelector(".navBar");
    const footerReady = !footerMount || !!footerMount.querySelector(".footer");

    if (navbarReady && footerReady) {
      return true;
    }

    if (checks < maxChecks) {
      return false;
    }

    if (navbarMount && !navbarReady) {
      ensureStylesheet("/styles/css/navBar.css");
      navbarMount.innerHTML = getNavbarFallbackMarkup();
    }

    if (footerMount && !footerReady) {
      ensureStylesheet("/styles/css/footer.css");
      footerMount.innerHTML = getFooterFallbackMarkup();
    }

    return true;
  };

  if (resolveFallbacks()) {
    return;
  }

  const timer = window.setInterval(() => {
    if (resolveFallbacks()) {
      window.clearInterval(timer);
    }
  }, intervalMs);
}

function ensureStylesheet(href) {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  const alreadyLoaded = links.some((link) => {
    const linkHref = link.getAttribute("href") || "";
    return linkHref === href || linkHref.endsWith(href);
  });

  if (alreadyLoaded) {
    return;
  }

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = href;
  document.head.appendChild(stylesheet);
}

function getNavbarFallbackMarkup() {
  return `
    <div class="navBar">
      <div class="navBar-left">
        <h2>cdobson.dev</h2>
      </div>
      <div class="navBar-right">
        <div class="navBar-menu">
          <a href="/" class="navBar-menu-link">Home</a>
          <a href="/work" class="navBar-menu-link">Work</a>
          <a href="/blog" class="navBar-menu-link">Blog</a>
        </div>
        <a href="/contact">
          <div class="navBar-button">
            <div class="navBar-button-inner">
              <div class="navBar-button-inner-line-left"></div>
              Get in Touch
              <div class="navBar-button-inner-line-right"></div>
            </div>
          </div>
        </a>
      </div>
    </div>
  `;
}

function getFooterFallbackMarkup() {
  return `
    <section class="footer">
      <div class="footer-grid">
        <div class="footer-row footer-row-1">
          <div><a class="footer-link" href="/work#concepts">Concepts</a></div>
          <div><a class="footer-link" href="https://github.com/cdobby9">Github</a></div>
          <div><a class="footer-link" href="/blog">Blog</a></div>
          <div><a class="footer-link" href="https://www.fiverr.com/cdobby9">Fiverr</a></div>
          <div><a class="footer-link" href="/contact">Contact</a></div>
        </div>

        <div class="footer-row footer-row-2">
          <div><a class="footer-link" href="https://www.mypocketskill.com/profiles/70169">MyPocketSkill</a></div>
          <div><a class="footer-link" href="/work#personal">Personal Projects</a></div>
          <div><a class="footer-link" href="/work#client">Client Work</a></div>
        </div>
      </div>
      <img class="footer-img" src="/styles/img/footerText.png" alt="Logo" />
      <p class="footer-text">&copy; 2026 Charles Dobson. All rights reserved.</p>
    </section>
  `;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

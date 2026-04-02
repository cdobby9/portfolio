initLoadingScreen();

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  bindGalleryEffects();
  initThumbnailParallax();
});

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
    initStatsScrollAnimation();
    initTestimonialAnimations();

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

function initStatsScrollAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  animateElements(
    ".showcase-stat .stat-line",
    { width: "0%" },
    { width: "99%", duration: 1.5, ease: "power4.inOut" }
  );

  animateElements(
    ".showcase-stat .stat-value, .showcase-stat .stat-link",
    { transform: "translateY(100%)" },
    { transform: "translateY(0%)", duration: 1.5, ease: "power4.inOut" }
  );
}

function bindGalleryEffects() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) {
    return;
  }

  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) {
    return;
  }

  items.forEach((item) => {
    const media = item.querySelector(".gallery-media");
    if (!media) {
      return;
    }

    const baseFocusX = getFocusValue(media.dataset.focusX, 50);
    const baseFocusY = getFocusValue(media.dataset.focusY, 50);
    const maxTilt = 4;

    setMediaFocus(item, baseFocusX, baseFocusY);
    setMediaOrigin(item, 50, 50);

    const handlePointerMove = (event) => {
      const rect = item.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;
      const px = rect.width ? relativeX / rect.width : 0.5;
      const py = rect.height ? relativeY / rect.height : 0.5;
      const originX = clamp(px * 100, 8, 92);
      const originY = clamp(py * 100, 8, 92);
      const rotateY = (px - 0.5) * maxTilt;
      const rotateX = (0.5 - py) * maxTilt;

      item.style.setProperty("--mx", `${Math.round(px * 100)}%`);
      item.style.setProperty("--my", `${Math.round(py * 100)}%`);
      setMediaOrigin(item, originX, originY);
      item.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
      item.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
      item.classList.add("is-active");
    };

    const reset = () => {
      item.style.setProperty("--mx", "50%");
      item.style.setProperty("--my", "50%");
      setMediaFocus(item, baseFocusX, baseFocusY);
      setMediaOrigin(item, 50, 50);
      item.style.setProperty("--rotate-x", "0deg");
      item.style.setProperty("--rotate-y", "0deg");
      item.classList.remove("is-active");
    };

    item.addEventListener("pointermove", handlePointerMove);
    item.addEventListener("pointerleave", reset);
    item.addEventListener("pointercancel", reset);
  });
}

function initThumbnailParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const frame = document.querySelector(".showcase-thumbnail-frame");
  const media = document.querySelector(".showcase-thumbnail");
  if (!frame || !media) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

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

function initTestimonialAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const copy = document.querySelector(".showcase-testimonial .section-copy");
  const cards = gsap.utils.toArray(".testimonial-card");

  if (copy) {
    gsap.fromTo(
      copy,
      {
        opacity: 0,
        y: 28
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: copy,
          start: "top 88%",
          once: true
        }
      }
    );
  }

  if (!cards.length) {
    return;
  }

  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 36
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".testimonial-grid",
        start: "top 84%",
        once: true
      }
    }
  );
}

function animateElements(selector, fromProps, toProps) {
  gsap.utils.toArray(selector).forEach((element) => {
    gsap.fromTo(
      element,
      fromProps,
      {
        scrollTrigger: {
          trigger: element,
          start: "top 95%",
          toggleActions: "play pause play reset",
          once: true
        },
        ...toProps
      }
    );
  });
}

function setMediaFocus(item, x, y) {
  item.style.setProperty("--media-pos-x", `${x.toFixed(2)}%`);
  item.style.setProperty("--media-pos-y", `${y.toFixed(2)}%`);
}

function setMediaOrigin(item, x, y) {
  item.style.setProperty("--media-origin-x", `${x.toFixed(2)}%`);
  item.style.setProperty("--media-origin-y", `${y.toFixed(2)}%`);
}

function getFocusValue(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

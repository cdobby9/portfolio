initLoadingScreen();

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initServiceSelectorBlob();
  initServiceScrollAnimations();
  initServiceHashAlignment();
  initBrandMarkScroll();
  initCardTilt();
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

  const animationDuration = 2200;
  const fadeDuration = 500;

  window.setTimeout(() => {
    loadingScreen.classList.add("is-exiting");
    document.body.classList.add("page-ready");

    window.setTimeout(() => {
      loadingScreen.style.display = "none";
    }, fadeDuration);
  }, animationDuration);
}

function initLenis() {
  if (typeof Lenis !== "function") {
    return;
  }

  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initServiceHashAlignment() {
  function scrollToHash(behavior = "smooth") {
    const id = window.location.hash.replace("#", "");
    if (!id) {
      return;
    }

    const target = document.getElementById(decodeURIComponent(id));
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior, block: "start" });
  }

  window.setTimeout(() => scrollToHash("auto"), 2350);
  window.addEventListener("hashchange", () => {
    window.setTimeout(() => scrollToHash("smooth"), 0);
  });
}

function initServiceSelectorBlob() {
  const segmented = document.querySelector(".page-heading .segmented");
  const blob = segmented?.querySelector(".service-hover-blob");
  const selectorButtons = Array.from(segmented?.querySelectorAll("button") || []);

  if (!segmented || !blob || selectorButtons.length === 0) {
    return;
  }

  let activeButton = null;
  let lastX = null;
  let settleTimer = 0;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const switchThreshold = 0.32;

  function moveBlobTo(button, immediate = false) {
    if (!button) {
      return;
    }

    const segmentedRect = segmented.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left - segmentedRect.left + segmented.scrollLeft;
    const width = buttonRect.width;
    const direction = lastX === null || x === lastX ? 0 : x > lastX ? 1 : -1;

    activeButton = button;
    lastX = x;
    selectorButtons.forEach((selectorButton) => {
      selectorButton.classList.toggle("is-blob-target", selectorButton === button);
    });

    if (immediate) {
      const previousTransition = blob.style.transition;
      blob.style.transition = "none";
      segmented.style.setProperty("--service-blob-skew", "0deg");
      segmented.style.setProperty("--service-blob-pull", "0px");
      segmented.style.setProperty("--service-blob-x", `${Math.round(x)}px`);
      segmented.style.setProperty("--service-blob-width", `${Math.round(width)}px`);
      segmented.classList.add("is-blob-visible");
      void blob.offsetHeight;
      blob.style.transition = previousTransition;
      return;
    }

    window.clearTimeout(settleTimer);
    segmented.style.setProperty("--service-blob-pull", "0px");
    segmented.style.setProperty("--service-blob-skew", `${direction * 5}deg`);
    segmented.style.setProperty("--service-blob-x", `${Math.round(x)}px`);
    segmented.style.setProperty("--service-blob-width", `${Math.round(width)}px`);
    segmented.classList.add("is-blob-visible");

    settleTimer = window.setTimeout(() => {
      segmented.style.setProperty("--service-blob-skew", "0deg");
    }, 140);
  }

  function getButtonAtPointer(event) {
    return selectorButtons.find((button) => {
      const rect = button.getBoundingClientRect();
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    });
  }

  function getNeighbor(direction) {
    const activeIndex = selectorButtons.indexOf(activeButton);
    if (activeIndex < 0) {
      return null;
    }

    return selectorButtons[activeIndex + direction] || null;
  }

  function setBlobPull(direction, amount) {
    if (prefersReducedMotion) {
      segmented.style.setProperty("--service-blob-pull", "0px");
      segmented.style.setProperty("--service-blob-skew", "0deg");
      return;
    }

    segmented.style.setProperty("--service-blob-pull", `${Math.round(amount * direction)}px`);
    segmented.style.setProperty("--service-blob-skew", `${Math.round(amount * direction * 0.32)}deg`);
  }

  function updatePullFromPointer(event) {
    const hoveredButton = getButtonAtPointer(event);

    if (!activeButton) {
      if (hoveredButton) {
        moveBlobTo(hoveredButton);
      }
      return;
    }

    const activeRect = activeButton.getBoundingClientRect();
    const activeIndex = selectorButtons.indexOf(activeButton);
    const hoveredIndex = selectorButtons.indexOf(hoveredButton);

    if (hoveredButton && hoveredButton !== activeButton) {
      const direction = hoveredIndex > activeIndex ? 1 : -1;
      const hoveredRect = hoveredButton.getBoundingClientRect();
      const progress =
        direction > 0
          ? (event.clientX - hoveredRect.left) / hoveredRect.width
          : (hoveredRect.right - event.clientX) / hoveredRect.width;
      const clampedProgress = Math.min(1, Math.max(0, progress));

      if (clampedProgress >= switchThreshold) {
        moveBlobTo(hoveredButton);
        return;
      }

      setBlobPull(direction, 18 + clampedProgress * 18);
      return;
    }

    const edgeZone = Math.min(activeRect.width * 0.36, 54);
    const maxPull = 24;

    if (event.clientX > activeRect.right - edgeZone && getNeighbor(1)) {
      const strength = 1 - (activeRect.right - event.clientX) / edgeZone;
      setBlobPull(1, Math.min(1, Math.max(0, strength)) * maxPull);
      return;
    }

    if (event.clientX < activeRect.left + edgeZone && getNeighbor(-1)) {
      const strength = 1 - (event.clientX - activeRect.left) / edgeZone;
      setBlobPull(-1, Math.min(1, Math.max(0, strength)) * maxPull);
      return;
    }

    setBlobPull(0, 0);
  }

  function hideBlob() {
    activeButton = null;
    selectorButtons.forEach((button) => button.classList.remove("is-blob-target"));
    segmented.classList.remove("is-blob-visible");
    segmented.style.setProperty("--service-blob-skew", "0deg");
    segmented.style.setProperty("--service-blob-pull", "0px");
  }

  selectorButtons.forEach((button) => {
    button.addEventListener("pointerenter", (event) => {
      if (!activeButton) {
        moveBlobTo(button);
        return;
      }

      updatePullFromPointer(event);
    });
    button.addEventListener("focus", () => moveBlobTo(button));
  });

  segmented.addEventListener("pointermove", updatePullFromPointer);

  segmented.addEventListener("pointerleave", () => {
    if (!segmented.contains(document.activeElement)) {
      hideBlob();
    }
  });

  segmented.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!segmented.contains(document.activeElement)) {
        hideBlob();
      }
    }, 0);
  });

  window.addEventListener("resize", () => {
    if (activeButton) {
      moveBlobTo(activeButton, true);
    }
  });
}

function initServiceScrollAnimations() {
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set("[data-service-reveal], .service-signal, [data-service-card], .brand-lab, .social-stage, [data-process-step]", {
    willChange: "transform, opacity"
  });

  gsap
    .timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: ".service-intro",
        start: "top 78%"
      }
    })
    .from("[data-service-reveal]", { y: 80, opacity: 0, duration: 0.9 })
    .from(".service-signal", { scale: 0.82, opacity: 0, rotate: -8, duration: 0.9 }, "-=0.55")
    .from(".signal-label", { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.35");

  gsap.to(".signal-ring-one", {
    rotate: 130,
    ease: "none",
    scrollTrigger: {
      trigger: ".service-intro",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".signal-ring-two", {
    rotate: -190,
    ease: "none",
    scrollTrigger: {
      trigger: ".service-intro",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  document.querySelectorAll(".service-section").forEach((section) => {
    const line = section.querySelector(".work-line");
    const cards = section.querySelectorAll("[data-service-card]");
    const strip = section.querySelector("[data-service-strip]");

    if (line) {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: "0 50%",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 76%"
        }
      });
    }

    if (cards.length) {
      gsap.from(cards, {
        y: 90,
        opacity: 0,
        rotateX: 8,
        clearProps: "transform",
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 68%"
        }
      });
    }

    if (strip) {
      gsap.to(strip, {
        x: () => {
          const distance = strip.scrollWidth - window.innerWidth + 120;
          return distance > 0 ? -distance : 0;
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });
    }
  });

  gsap.from(".brand-lab", {
    y: 90,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".brand-lab",
      start: "top 74%"
    }
  });

  gsap.to("[data-brand-mark]", {
    rotate: 5,
    scale: 1.04,
    ease: "none",
    scrollTrigger: {
      trigger: ".brand-lab",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  document.querySelectorAll("[data-brand-row]").forEach((row, index) => {
    gsap.fromTo(
      row,
      { x: index % 2 === 0 ? -80 : 80 },
      {
        x: index % 2 === 0 ? 80 : -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".brand-lab",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7
        }
      }
    );
  });

  gsap.from(".social-stage", {
    y: 90,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".social-stage",
      start: "top 76%"
    }
  });

  document.querySelectorAll("[data-social-card]").forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 80 + index * 20, rotate: index % 2 === 0 ? -8 : 8 },
      {
        y: index * -18,
        rotate: index % 2 === 0 ? 4 : -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".social-stage",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7
        }
      }
    );
  });

  const processSection = document.querySelector(".process-section");
  if (processSection) {
    ScrollTrigger.create({
      trigger: processSection,
      start: "top 68%",
      end: "bottom 72%",
      scrub: true,
      onUpdate: (self) => {
        processSection.style.setProperty("--process-progress", self.progress.toFixed(3));
      }
    });
  }

  gsap.from("[data-process-step]", {
    x: 90,
    opacity: 0,
    stagger: 0.16,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".process-list",
      start: "top 78%"
    }
  });

  gsap.from(".cta", {
    y: 70,
    scale: 0.97,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".cta",
      start: "top 82%"
    }
  });
}

function initBrandMarkScroll() {
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const track = document.querySelector("[data-brand-mark-track]");
  if (!track) {
    return;
  }

  gsap.fromTo(
    track,
    { yPercent: -18 },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".brand-lab",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7
      }
    }
  );
}

function initCardTilt() {
  const buttons = document.querySelectorAll(".card-shiny");
  if (!buttons.length) {
    return;
  }

  document.querySelectorAll(".service-card-grid, .social-deck").forEach((container) => {
    container.style.perspective = `${settings.perspective}px`;
  });

  buttons.forEach((button) => {
    const resetTilt = () => {
      button.style.setProperty("--rotate-x", "0deg");
      button.style.setProperty("--rotate-y", "0deg");
      button.style.setProperty("--card-scale", "1");
    };

    button.addEventListener("mousemove", (e) => {
      const { x, y } = button.getBoundingClientRect();
      button.style.setProperty("--x", e.clientX - x);
      button.style.setProperty("--y", e.clientY - y);
    });

    button.addEventListener("pointermove", (e) => {
      const bcr = button.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - bcr.left) / bcr.width));
      const y = Math.min(1, Math.max(0, (e.clientY - bcr.top) / bcr.height));
      const reverse = settings.reverse ? -1 : 1;
      const tiltX = reverse * (settings.max / 2 - x * settings.max);
      const tiltY = reverse * (y * settings.max - settings.max / 2);
      button.style.setProperty("--rotate-x", `${settings.axis === "x" ? 0 : tiltY}deg`);
      button.style.setProperty("--rotate-y", `${settings.axis === "y" ? 0 : tiltX}deg`);
      button.style.setProperty("--card-scale", String(settings.scale));
    });

    button.addEventListener("pointerleave", resetTilt);
    button.addEventListener("pointercancel", resetTilt);
    button.addEventListener("blur", resetTilt);
  });
}

const settings = {
  reverse: 1, // Reverse tilt: 1, 0
  max: 5, // Max tilt: 35
  perspective: 1000, // Parent perspective px: 1000
  scale: 1, // Tilt element scale factor: 1.0
  axis: "" // Limit axis. "y", "x"
};

(() => {
  const boxes = document.querySelectorAll('.work-box');

  boxes.forEach(box => {
    const img = box.querySelector('.work-box-image');
    const btn = box.querySelector('.work-box-button');

    // Configuration
    const maxTilt = 10;
    const maxOffset = 40;
    const speed = 0.1;

    // State
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let btnX = 0, btnY = 0;
    let isHovering = false;

    box.addEventListener('mouseenter', () => {
      isHovering = true;
      btn.style.opacity = '1';
      btn.style.transform = 'translate(-50%, -50%) scale(1)';
      requestAnimationFrame(update);
    });

    box.addEventListener('mousemove', e => {
      const rect = box.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width * 2 - 1;
      mouseY = (e.clientY - rect.top) / rect.height * 2 - 1;
      mouseX = Math.max(-1, Math.min(1, mouseX));
      mouseY = Math.max(-1, Math.min(1, mouseY));
      targetX = mouseX * maxOffset;
      targetY = mouseY * maxOffset;
    });

    box.addEventListener('mouseleave', () => {
      isHovering = false;
      img.style.transform = `rotateX(0deg) rotateY(0deg)`;
      btn.style.opacity = '0';
      btn.style.transform = 'translate(-50%, -50%) scale(0)';
    });

    function update() {
      if (!isHovering) return;
      btnX += (targetX - btnX) * speed;
      btnY += (targetY - btnY) * speed;
      btn.style.left = `calc(50% + ${btnX}px)`;
      btn.style.top = `calc(50% + ${btnY}px)`;
      requestAnimationFrame(update);
    }
  });
})();

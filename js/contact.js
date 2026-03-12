initLoadingScreen();

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initContactForm();
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

function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.classList.add("is-submitted");
    window.setTimeout(() => {
      form.classList.remove("is-submitted");
    }, 1200);
  });
}

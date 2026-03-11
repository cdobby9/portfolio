initLoadingScreen();

document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  ensureComponentFallbacks();

  const list = document.getElementById("blogList");
  const segmented = document.querySelector(".segmented");
  const indicator = document.querySelector(".segmented .seg-indicator");
  const sortButtons = Array.from(document.querySelectorAll(".segmented button"));

  if (!list || !segmented || !indicator || sortButtons.length === 0) {
    return;
  }

  const posts = [
    {
      id: 1,
      title: "Creating my portfolio",
      primaryTag: "Web Development",
      tags: ["Website", "Ongoing", "Personal"],
      publishedAt: "2024-10-31",
      date: "31st October 2024",
      description:
        "This is by far the project I've spent the longest time on as well as my most important project. Over the course of 3 years, I've tried to develop something where I can showcase not only my services as a freelance web developer to small businesses, but also to show the full scope of my abilities and learning as a computer scientist and academic in general. It is full hand coded with as minimal AI 'vibe-coding' as you can get away with in modern web development. For this, I used a fully vanilla full web stack of HTML, CSS and JS and hosted with Netlify. The design is a mix of my own ideas and inspirations from around the web, with a focus on it being a clean, modern and smooth experience to prove my eye for design and my ability to execute it through my programming ability. I also wanted to make sure it was fully responsive and accessible (although I would prefer it to be mainly viewed on a regular desktop), so it looks great and works well on all device sizes. Overall, I'm really proud of it, and I think it does a great job of showing off everything about me.",
      readTime: "10 min read",
      href: "blogs/portfolio",
      thumbnail: ""
    },
    {
      id: 2,
      title: "Making a home server and my own VPN",
      primaryTag: "Systems",
      tags: ["Personal", "Networks", "Linux"],
      publishedAt: "2026-2-26",
      date: "26th February 2026",
      description:
        "I had never really explored this area of computer science, and it's not one I knew well. Turning an old all-in-one PC that was lying around in my house into a personal home server, I found, was a great way to introduce myself to it and see how interested I was. It was an incredibly successful project, and I truly enjoyed the process and the problem-solving needed to navigate a new area in computing. With the vast number of DVDs and Blu-rays we had stored away, unlikely to be used again, with the rise of cloud streaming, I managed to painstakingly upload them all to my own cloud streaming service. To access this from anywhere, I created a VPN on the server, using Tailscale. Which doubled to keep my information safe on public and school WIFIs. This caused me to end up cancelling both my VPN and Netflix subscription, saving me a fair bit of money in the long run – plus you can beat the feeling of using something you personally built. ",
      readTime: "6 min read",
      href: "#",
      thumbnail: ""
    },
    {
      id: 3,
      title: "Number Guessing AI",
      primaryTag: "Python",
      tags: ["ML", "Competitions", "Probability"],
      publishedAt: "2026-4-24",
      date: "24th April 2026",
      description:
        "This was my entry to my school's internal ‘Lloyd-Berger Computer Science Prize’, of which I ended up winning outright. It really allowed me to get into the ways computers search and how the best way can vary depending on the scenario. It also introduced me to making my own machine learning program with Python. My main goal was to try to reduce the average number of guesses it takes to predict the user’s chosen number out of 1-100. I try out multiple methods to achieve this, and combine psychological assumptions with an algorithm that learns the specific user’s biases.",
      readTime: "5 min read",
      href: "#",
      thumbnail: ""
    },
        {
      id: 4,
      title: "Machine Learning & Experimental Science",
      primaryTag: "Research",
      tags: ["ML", "Competitions", "Essay"],
      publishedAt: "2026-4-30",
      date: "30th April 2026",
      description:
        "This was my entry to the Kelvin Biological Sciences Prize by Peterhouse College at Cambridge. This was a great opportunity to deepen my understanding of Machine Learning after really enjoying my previous project in ML…",
      readTime: "8 min read",
      href: "#",
      thumbnail: ""
    },
        {
      id: 5,
      title: "Modern Technology & Personalised Pricing",
      primaryTag: "Research",
      tags: ["Economics", "Competitions", "Essay"],
      publishedAt: "2026-6-1",
      date: "1st June 2026",
      description:
        "This research project essay was my entry to the John Locke Institute's Economics Prize. Taking economics for A-Level, this question presented the perfect opportunity to combine my deep extra-curricular interest in Computer Science with my curricular studies…",
      readTime: "3 min read",
      href: "#",
      thumbnail: ""
    }
  ];

  const state = {
    sort: "recent",
    pinned: null
  };

  function renderPosts() {
    state.pinned = null;
    const sortedPosts = getSortedPosts(posts, state.sort);
    list.innerHTML = sortedPosts.map((post) => postTemplate(post)).join("");
    bindCardInteractions(state);
  }

  function applySort(button, immediate = false) {
    if (!button) {
      return;
    }

    sortButtons.forEach((sortButton) => {
      sortButton.setAttribute("aria-pressed", String(sortButton === button));
    });

    state.sort = button.dataset.sort === "oldest" ? "oldest" : "recent";
    moveIndicatorTo(segmented, indicator, button, immediate);
    renderPosts();
  }

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => applySort(button));
  });

  window.addEventListener("resize", () => {
    const activeButton =
      sortButtons.find((button) => button.getAttribute("aria-pressed") === "true") || sortButtons[0];
    moveIndicatorTo(segmented, indicator, activeButton, true);
  });

  document.addEventListener("click", () => {
    if (!state.pinned) {
      return;
    }

    state.pinned.classList.remove("is-active");
    state.pinned = null;
  });

  const defaultButton =
    sortButtons.find((button) => button.getAttribute("aria-pressed") === "true") || sortButtons[0];
  applySort(defaultButton, true);
});

function getSortedPosts(posts, sortOrder) {
  const sorted = [...posts].sort((a, b) => toTimestamp(a.publishedAt) - toTimestamp(b.publishedAt));
  if (sortOrder === "recent") {
    sorted.reverse();
  }
  return sorted;
}

function toTimestamp(value) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function moveIndicatorTo(segmented, indicator, button, immediate = false) {
  if (!segmented || !indicator || !button) {
    return;
  }

  const segmentedRect = segmented.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const x = buttonRect.left - segmentedRect.left + segmented.scrollLeft;
  const width = buttonRect.width;

  if (immediate) {
    const previousTransition = indicator.style.transition;
    indicator.style.transition = "none";
    indicator.style.transform = `translateX(${Math.round(x)}px)`;
    indicator.style.width = `${Math.round(width)}px`;
    void indicator.offsetHeight;
    indicator.style.transition = previousTransition;
    return;
  }

  indicator.style.transform = `translateX(${Math.round(x)}px)`;
  indicator.style.width = `${Math.round(width)}px`;
}

function postTemplate(post) {
  const greyTags = (post.tags || [])
    .map((tag) => `<span class="tag alt">${escapeHtml(tag)}</span>`)
    .join("");

  const thumbMarkup = post.thumbnail
    ? `<img src="${escapeAttr(post.thumbnail)}" alt="" loading="lazy" />`
    : placeholderThumb(post.id);

  return `
    <article class="post" data-post>
      <button class="post-btn" type="button" aria-label="Open post: ${escapeAttr(post.title)}"></button>

      <div class="post-top">
        <div class="left">
          <div class="post-head-content">
            <h2 class="title">${escapeHtml(post.title)}</h2>
            <div class="meta" aria-label="Tags">
              <span class="tag">${escapeHtml(post.primaryTag || "Tag")}</span>
              ${greyTags}
            </div>
          </div>
        </div>
        <div class="date">${escapeHtml(post.date || "")}</div>
      </div>

      <div class="post-body" aria-label="Expanded post preview">
        <div class="body-grid">
          <div class="post-copy">
            <p class="excerpt">${escapeHtml(post.description || "")}</p>

            <div class="actions">
              <a class="view" href="${escapeAttr(post.href || "#")}">
                View now <span class="arrow">&rarr;</span>
              </a>
              <span class="readtime">${escapeHtml(post.readTime || "")}</span>
            </div>
          </div>

          <div class="thumb" aria-hidden="true">
            ${thumbMarkup}
          </div>
        </div>
      </div>
    </article>
  `;
}

function placeholderThumb(postId) {
  const gradientId = `post-grad-${postId}`;

  return `
    <svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="rgba(255,255,255,.10)"/>
          <stop offset="1" stop-color="rgba(255,255,255,.02)"/>
        </linearGradient>
      </defs>
      <rect width="800" height="420" fill="url(#${gradientId})"/>
      <path
        d="M0,290 C120,250 160,310 260,285 C340,260 380,210 470,230 C560,250 610,340 800,300 L800,420 L0,420 Z"
        fill="rgba(255,255,255,.14)"
      />
      <circle cx="210" cy="160" r="26" fill="rgba(255,255,255,.22)"/>
    </svg>
  `;
}

function bindCardInteractions(state) {
  const cards = [...document.querySelectorAll("[data-post]")];

  const setActive = (activeCard) => {
    cards.forEach((card) => card.classList.toggle("is-active", card === activeCard));
  };

  cards.forEach((card) => {
    const button = card.querySelector(".post-btn");

    const handlePointerMove = (event) => {
      updateGlowPosition(card, event);
    };

    card.addEventListener("mousemove", handlePointerMove);
    card.addEventListener("pointermove", handlePointerMove);

    card.addEventListener("mouseenter", () => {
      if (state.pinned) {
        return;
      }
      setActive(card);
    });

    card.addEventListener("mouseleave", () => {
      if (state.pinned) {
        return;
      }
      card.classList.remove("is-active");
    });

    if (!button) {
      return;
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (state.pinned === card) {
        state.pinned = null;
        card.classList.remove("is-active");
        return;
      }

      state.pinned = card;
      setActive(card);
    });
  });
}

function updateGlowPosition(card, event) {
  const rect = card.getBoundingClientRect();
  const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
  const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
  card.style.setProperty("--mx", `${Math.round(x)}px`);
  card.style.setProperty("--my", `${Math.round(y)}px`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

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
      ensureStylesheet("styles/css/navBar.css");
      navbarMount.innerHTML = getNavbarFallbackMarkup();
    }

    if (footerMount && !footerReady) {
      ensureStylesheet("styles/css/footer.css");
      footerMount.innerHTML = getFooterFallbackMarkup();
    }

    return true;
  };

  if (resolveFallbacks()) {
    return;
  }

  const timer = setInterval(() => {
    if (resolveFallbacks()) {
      clearInterval(timer);
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
          <a href="#" class="navBar-menu-link">Home</a>
          <a href="/work" class="navBar-menu-link">Work</a>
          <a href="/blog" class="navBar-menu-link">Blog</a>
        </div>
        <div class="navBar-button">
          <div class="navBar-button-inner">
            <div class="navBar-button-inner-line-left"></div>
            Get in Touch
            <div class="navBar-button-inner-line-right"></div>
          </div>
        </div>
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
          <div><a class="footer-link" href="#">Github</a></div>
          <div><a class="footer-link" href="#">Blog</a></div>
          <div><a class="footer-link" href="#">Fiverr</a></div>
          <div><a class="footer-link" href="/contact">Contact</a></div>
        </div>

        <div class="footer-row footer-row-2">
          <div><a class="footer-link" href="#">MyPocketSkill</a></div>
          <div><a class="footer-link" href="/work#personal">Personal Projects</a></div>
          <div><a class="footer-link" href="/work#client">Client Work</a></div>
        </div>
      </div>
      <img class="footer-img" src="styles/img/footerText.png" alt="Logo" />
      <p class="footer-text">&copy; 2025 Charles Dobson. All rights reserved.</p>
    </section>
  `;
}

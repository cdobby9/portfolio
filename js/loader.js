function loadComponent(id, url) {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load " + url);
        return res.text();
      })
      .then(html => {
        document.getElementById(id).innerHTML = html;
      })
      .catch(err => {
        console.error("Component load failed:", err);
        document.getElementById(id).innerHTML = `
          <div style="padding: 1rem; background: #fee; color: #900;">
            Failed to load navbar and footer.
          </div>`;
      });
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbar-load", "components/navBar.html");
    loadComponent("footer-load", "components/footer.html");
  });
  
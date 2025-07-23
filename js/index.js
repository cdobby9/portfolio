
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Function to animate elements
  function animateElements(selector, fromProps, toProps) {
    gsap.utils.toArray(selector).forEach(element => {
      gsap.fromTo(element,
        fromProps,
        {
          scrollTrigger: {
            trigger: element,
            start: "top 95%",
            toggleActions: "play pause play reset",
            once: true
          },
          ...toProps
        });
    });
  }

  animateElements('#card-wrap', 
    { opacity: 0}, 
    { opacity: 1, duration: 2 }
  );
  animateElements('.cards-header-line', 
    { width: '0%' }, 
    { width: '120%', duration: 2 }
  );
  animateElements('.stat-line', 
    { width: '0%' }, 
    { width: '99%', duration: 1.5, ease: "power4.inOut" }
  );
  animateElements('.stat-value', 
    { transform: 'translateY(100%)' }, 
    { transform: 'translateY(0%)', duration: 1.5, ease: "power4.inOut" }
  );



});




const buttons = document.querySelectorAll(".card-shiny");

buttons.forEach((button) => {
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
    button.style.transform = `
      rotateX(${settings.axis === "x" ? 0 : tiltY}deg)
      rotateY(${settings.axis === "y" ? 0 : tiltX}deg)
      scale(${settings.scale})
    `;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  });
});

const settings = {
  reverse: 1, // Reverse tilt: 1, 0
  max: 5, // Max tilt: 35
  perspective: 1000, // Parent perspective px: 1000
  scale: 1, // Tilt element scale factor: 1.0
  axis: "" // Limit axis. "y", "x"
};

document.querySelector("#card-wrap").style.perspective = `${settings.perspective}px`;

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

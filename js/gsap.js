gsap.registerPlugin(ScrollTrigger);

const marqueeAnimation = () => {
  const sections = document.querySelectorAll(".work-marquee");
  sections.forEach((section) => {
    const marqueeText = section.querySelector(".work-marquee-text");
    const w = marqueeText; // Assign marqueeText element to w


    const [x, xEnd] = ['0%', (w.scrollWidth - section.offsetWidth) * -0.2];

    gsap.fromTo(w, { x }, {
      x: xEnd,
      scrollTrigger: {
        trigger: section,
        scrub: 0.2
      }
    });
  });
};


marqueeAnimation();
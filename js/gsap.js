if (
  typeof gsap !== "undefined" &&
  typeof ScrollTrigger !== "undefined" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  gsap.registerPlugin(ScrollTrigger);

  const marqueeAnimation = () => {
    const sections = document.querySelectorAll(".work-marquee");
    sections.forEach((section) => {
      const marqueeText = section.querySelector(".work-marquee-text");
      if (!marqueeText) {
        return;
      }

      const x = "0%";
      const xEnd = (marqueeText.scrollWidth - section.offsetWidth) * -0.2;

      gsap.fromTo(
        marqueeText,
        { x },
        {
          x: xEnd,
          scrollTrigger: {
            trigger: section,
            scrub: 0.2
          }
        }
      );
    });
  };

  marqueeAnimation();
}

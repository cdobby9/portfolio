document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".portfolio-container");
    const slider = document.querySelector(".slider");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const indicatorsContainer = document.querySelector(".indicators");
  
    const images = [
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      "https://via.placeholder.com/1200x800/ff7f7f/333333?text=Image+2",
      "https://via.placeholder.com/1200x800/7fff7f/333333?text=Image+3",
      "https://via.placeholder.com/1200x800/7f7fff/333333?text=Image+4"
    ];
  
    let currentIndex = 0;
  
    // Create image elements and add them to the slider
    images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      slider.appendChild(img);
    });
  
    // Function to create indicators
    function createIndicators() {
      indicatorsContainer.innerHTML = "";
      images.forEach((_, index) => {
        const indicator = document.createElement("span");
        indicator.classList.add("indicator");
        if (index === currentIndex) {
          indicator.classList.add("active");
        }
        indicatorsContainer.appendChild(indicator);
      });
    }
  
    function updateImage(index) {
      const containerWidth = document.querySelector('.portfolio-container').offsetWidth;
      slider.style.transform = `translateX(${index * -containerWidth}px)`; // Adjust slide position based on container width
      const indicators = document.querySelectorAll(".indicator");
      indicators.forEach((indicator, i) => {
          indicator.classList.toggle("active", i === index);
      });
  }
  
    leftArrow.addEventListener("click", function () {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      updateImage(currentIndex);
    });
  
    rightArrow.addEventListener("click", function () {
      currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      updateImage(currentIndex);
    });
  
    leftArrow.addEventListener("mousedown", function () {
      leftArrow.classList.add("active");
    });
  
    leftArrow.addEventListener("mouseup", function () {
      leftArrow.classList.remove("active");
    });
  
    // Initialize indicators
    createIndicators();
    updateImage(currentIndex); // Initialize the image position
  });
  
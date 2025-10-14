document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-swiper]").forEach(carousel => {
    const textEl = carousel.querySelector(".bk-review-text");
    const authorEl = carousel.querySelector(".bk-review-author");

    // --- Initialize Swiper ---
    const swiper = new Swiper(carousel, {
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 60,
      speed: 600,
      grabCursor: true,
      navigation: {
        nextEl: carousel.querySelector(".swiper-button-next"),
        prevEl: carousel.querySelector(".swiper-button-prev"),
      },
      loop: false,
      watchSlidesProgress: true,
      autoHeight: false, // prevent built-in resizing
      observer: false,
      observeParents: false,
    });

    const total = swiper.slides.length;
    const blockSize = Math.floor(total / 3);
    const startIndex = blockSize;
    swiper.slideTo(startIndex, 0, false);

    // --- Review updater ---
    function updateReview(swiperInstance) {
      const active = swiperInstance.el.querySelector(".swiper-slide-active");
      if (!active) return;

      const text = active.dataset.text || "";
      const name = active.dataset.name || "";
      const title = active.dataset.title || "";

      textEl.classList.remove("show");
      authorEl.classList.remove("show");

      setTimeout(() => {
        const maxChars = 900; // Adjust to desired visible length

        const cleanText = (text || "").trim();
        let displayText = cleanText;

        // truncate if needed
        if (cleanText.length > maxChars) {
          displayText = cleanText.slice(0, maxChars).trim() + "…";
        }

        // safely inject plain text (no inline HTML)
        textEl.textContent = displayText;

        // author remains safe HTML — you’re generating it server-side
        const authorHTML = name
          ? `<strong>${name}</strong>${title ? ", " + title : ""}`
          : "";
        authorEl.innerHTML = authorHTML;

        textEl.classList.add("show");
        authorEl.classList.add("show");
      }, 150);


    }

    // --- Handle manual infinite looping ---
    function handleLoop(swiperInstance) {
      const current = swiperInstance.activeIndex;
      if (current >= 2 * blockSize) swiperInstance.slideTo(current - blockSize, 0, false);
      if (current < blockSize) swiperInstance.slideTo(current + blockSize, 0, false);
    }

    // --- Keep review synced with active slide ---
    swiper.on("slideChangeTransitionStart", instance => updateReview(instance));
    swiper.on("slideChangeTransitionEnd", instance => {
      handleLoop(instance);
      updateReview(instance);
    });

    // --- Initial content render ---
    requestAnimationFrame(() => updateReview(swiper));

    // --- Remove Swiper's built-in pseudo icons ---
    const style = document.createElement("style");
    style.textContent = `
      .swiper-button-next::after,
      .swiper-button-prev::after {
        display: none !important;
        content: none !important;
      }
    `;
    document.head.appendChild(style);

    console.log("✅ Review carousel initialized (no resizing)");
  });
});

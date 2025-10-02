document.addEventListener("DOMContentLoaded", () => {
  const groups = document.querySelectorAll(".accordion-group");

  groups.forEach(group => {
    const items = group.querySelectorAll(".accordion-item");

    items.forEach(item => {
      const header = item.querySelector(".accordion-header");
      const icon = header.querySelector(".accordion-icon");

      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        // Close all items
        items.forEach(i => {
          i.classList.remove("open");
          const iconEl = i.querySelector(".accordion-icon");
          if (iconEl) iconEl.textContent = "+"; // reset all icons
        });

        // Toggle clicked one
        if (!isOpen) {
          item.classList.add("open");
          if (icon) icon.textContent = "−";
        }
      });
    });
  });
});

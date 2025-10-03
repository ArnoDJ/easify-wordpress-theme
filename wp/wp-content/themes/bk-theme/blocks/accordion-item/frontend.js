document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", function() {
            const item = this.closest(".accordion-item");
            item.classList.toggle("open");
        });
    });
});

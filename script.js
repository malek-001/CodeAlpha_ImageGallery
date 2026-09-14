const items = [...document.querySelectorAll(".gallery-item")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxLocation = document.getElementById("lightboxLocation");
const lightboxCategory = document.getElementById("lightboxCategory");
const counter = document.getElementById("counter");
const countText = document.getElementById("countText");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleItems = items;
let currentIndex = 0;

// Update the number of visible gallery items.
function updateCount() {
    const count = visibleItems.length;
    countText.textContent = `${count} ${count === 1 ? "photo" : "photos"}`;
}

// Apply a category filter.
function applyFilter(category) {
    visibleItems = [];

    items.forEach((item) => {
        const matches = category === "all" || item.dataset.category === category;

        item.classList.toggle("hidden", !matches);

        if (matches) {
            visibleItems.push(item);
        }
    });

    updateCount();
}

// Open the lightbox for a selected item.
function openLightbox(index) {
    if (!visibleItems.length) return;

    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const image = item.querySelector("img");

    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxTitle.textContent = item.dataset.title;
    lightboxLocation.textContent = item.dataset.location;
    lightboxCategory.textContent = item.dataset.category;
    counter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;

    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

// Close the lightbox.
function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// Move to the next or previous visible image.
function changeImage(direction) {
    openLightbox(currentIndex + direction);
}

// Filter button events.
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        applyFilter(button.dataset.filter);
    });
});

// Gallery item events.
items.forEach((item) => {
    item.addEventListener("click", () => {
        openLightbox(visibleItems.indexOf(item));
    });
});

closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", () => changeImage(-1));
nextBtn.addEventListener("click", () => changeImage(1));

// Close when the dark background is clicked.
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard support: Escape, Left Arrow and Right Arrow.
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("show")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") changeImage(-1);
    if (event.key === "ArrowRight") changeImage(1);
});

// Start with all images visible.
applyFilter("all");

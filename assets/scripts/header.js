const dark_mode_toggle = document.getElementById("toggle-darkmode");
const menu_items = document.querySelectorAll(".menu-item");
const menu_indicator = document.querySelector(".menu-indicator");


// config theme from localStorage
const theme = localStorage.getItem("theme") || "light";
if (theme === "dark") {
  document.documentElement.classList.add("dark");
  dark_mode_toggle.checked = true;
}

// Config the animation in the header menu
menu_items.forEach((item) => {
  item.addEventListener("click", (e) => {
    menu_indicator.style.setProperty("--index", item.dataset.index);
    item.classList.add("active-item");

    menu_items.forEach((btn) => {
      if (e.target != btn) {
        btn.classList.remove("active-item");
      }
    });
  });
});


// consfig dark mode toggle
dark_mode_toggle.addEventListener("change", () => {
  // add "dark" to html tag
  document.documentElement.classList.toggle("dark");
  // add "dark" to localStorage
  localStorage.setItem("theme", dark_mode_toggle.checked ? "dark" : "light");
});

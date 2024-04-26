const dark_mode_toggle = document.getElementById("toggle-darkmode");
const navBtn = document.querySelector(".nav-btn");
const navBar = document.querySelector(".nav-bar");
const menu = navBar.querySelector(".menu");
const menu_items = document.querySelectorAll(".menu-item");
const menu_indicator = document.querySelector(".menu-indicator");

// config theme from localStorage
const theme = localStorage.getItem("theme") || "light";
if (theme === "dark") {
  document.documentElement.classList.add("dark");
  dark_mode_toggle.checked = true;
}



navBtn.addEventListener("click", () => {
  if (navBtn.classList.contains("active")) {
    navBtn.classList.remove("active");
    menu.animate([{ height: "300px" }, { height: 0 }], {
      duration: 300,
      fill: "forwards",
      easing: "ease-in-out",
    });
  } else {
    navBtn.classList.add("active");
    menu.animate([{ height: 0 }, { height: "300px" }], {
      duration: 300,
      fill: "forwards",
      easing: "ease-in-out",
    });
  }
});

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

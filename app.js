// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Theme toggle =====
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const saved = localStorage.getItem("ling-theme");
if (saved) root.setAttribute("data-theme", saved);

toggle.addEventListener("click", () => {
  const cur = root.getAttribute("data-theme") === "day" ? "dark" : "day";
  root.setAttribute("data-theme", cur);
  localStorage.setItem("ling-theme", cur);
});

// ===== Tab / file active state on scroll =====
const sections = ["home", "about", "advantages", "skills", "experience", "projects", "contact"];
const tabs = document.querySelectorAll(".tab[data-route]");
const tfiles = document.querySelectorAll(".tfile[href^='#']");

function setActive(route) {
  tabs.forEach((t) => t.classList.toggle("active", t.dataset.route === route));
  tfiles.forEach((f) => {
    const m = f.getAttribute("href").replace("#", "");
    f.classList.toggle("active", m === route);
  });
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        if (sections.includes(id)) setActive(id);
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
);
sections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});

// ===== Skill bars animate on view =====
const bars = document.querySelectorAll(".bar i");
const barIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const i = e.target;
        i.style.width = i.style.width || "0%";
        barIO.unobserve(i);
      }
    });
  },
  { threshold: 0.3 }
);
// set initial width then trigger
bars.forEach((i) => {
  const w = i.style.width;
  i.style.width = "0%";
  barIO.observe(i);
  setTimeout(() => { i.style.width = w; }, 200);
});

// ===== Smooth scroll for hash links =====
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + id);
    }
  });
});

// ===== WeCom QR lightbox =====
(function () {
  const qr = document.querySelector(".cc-qr");
  if (!qr) return;
  const box = document.createElement("div");
  box.className = "qr-lightbox";
  box.innerHTML = `<img src="${qr.src}" alt="企业微信二维码" />`;
  document.body.appendChild(box);
  qr.addEventListener("click", () => box.classList.add("open"));
  box.addEventListener("click", () => box.classList.remove("open"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") box.classList.remove("open");
  });
})();

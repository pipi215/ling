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
const sections = ["home", "about", "advantages", "skills", "experience", "projects", "contact", "wifi"];
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

// ===== Location card: toggle address detail =====
(function () {
  const toggle = document.getElementById("locToggle");
  const detail = document.getElementById("locDetail");
  if (!toggle || !detail) return;
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.textContent = open ? "查看地址 ▾" : "收起 ▴";
    detail.hidden = open;
  });
})();

// ===== Office WiFi: click chip or password to copy =====
(function () {
  const copyables = document.querySelectorAll(".wifi-chip, .wifi-pass-val");
  if (!copyables.length) return;
  const toast = document.createElement("div");
  toast.className = "wifi-toast";
  document.body.appendChild(toast);
  let timer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 1600);
  };
  const doCopy = async (el) => {
    const pass = el.dataset.pass || "";
    const label = el.classList.contains("wifi-pass-val") ? "密码" : el.textContent.trim();
    let ok = false;
    try {
      await navigator.clipboard.writeText(pass);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = pass;
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch {}
      ta.remove();
    }
    showToast(ok ? `${label} · 已复制` : "复制失败，请手动查看");
  };
  copyables.forEach((el) => {
    el.addEventListener("click", () => doCopy(el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doCopy(el); }
    });
  });
})();

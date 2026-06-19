/* ============================================================
   PS Klima — main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }

  /* ---------- Sticky nav shadow ---------- */
  const nav = document.querySelector(".nav");
  const fab = document.querySelector(".fab");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 8);
    fab.classList.toggle("is-visible", y > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Logo → scroll to top ---------- */
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---------- Animated stat counters ---------- */
  const nums = document.querySelectorAll(".stat__num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (isNaN(target)) return;
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased).toLocaleString("pl-PL") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- Opinie carousel ---------- */
  const track = document.getElementById("opinieTrack");
  if (track) {
    const prev = document.getElementById("opiniePrev");
    const next = document.getElementById("opinieNext");
    const slides = Array.from(track.querySelectorAll(".quote"));

    const step = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return slides[0].offsetWidth + gap;
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth - 1;

    const update = () => {
      const x = track.scrollLeft;
      prev.disabled = x <= 2;
      next.disabled = x >= maxScroll();
    };

    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Contact form (front-end demo) ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // TODO: podłączyć wysyłkę (np. Formspree / własny backend / mailto)
      note.hidden = false;
      form.querySelector('button[type="submit"]').textContent = "Wysłano ✓";
      form.reset();
      setTimeout(() => {
        note.hidden = true;
        form.querySelector('button[type="submit"]').textContent = "Wyślij zapytanie";
      }, 5000);
    });
  }

  /* ---------- Current year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

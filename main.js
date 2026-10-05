/* ==========================================================================
   BReeL — site config + interactions
   ========================================================================== */

/**
 * Central place for every external link on the site.
 * Elements opt in with data-link="<key>" (and optionally data-utm="<placement>").
 */
const siteConfig = {
  // Purchases happen on Payhip — the site only links out, it never takes payment itself.
  links: {
    lowTicket: "https://payhip.com/b/Dt4ab", // $27 Creator Monetization OS
    midTicket: "https://payhip.com/b/HskxF", // $47 First Profitable Launch OS
    highTicket: "https://calendly.com/yahiawaleed/", // $197+ one-time 1:1 campaign
    apply: "https://calendly.com/yahiawaleed/", // Shadow operating (50/50) application
    agency: "https://calendly.com/yahiawaleed/",
    calculator: "https://breel-lm-1-calc.vercel.app/", // free lead magnet: Whop Business OS Calculator
    igBreel: "https://www.instagram.com/breel_ar/",
    igYahia: "https://www.instagram.com/darealyehi/",
    igHassan: "https://www.instagram.com/__abnz/",
    // TODO: swap for the BReeL Whop community / affiliate signup URL once it's live
    affiliateJoin: "https://www.instagram.com/breel_ar/",
  },
  utm: {
    source: "breel-site",
    campaign: "landing",
  },
};

function withUtm(url, placement) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", siteConfig.utm.source);
    u.searchParams.set("utm_medium", placement || "site");
    u.searchParams.set("utm_campaign", siteConfig.utm.campaign);
    return u.toString();
  } catch {
    return url;
  }
}

function applyLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const url = siteConfig.links[el.dataset.link];
    if (!url) return;
    el.href = withUtm(url, el.dataset.utm);
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* --------------------------------------------------------------------------
   Mobile menu
   -------------------------------------------------------------------------- */

function initMenu() {
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.querySelector(".menu-overlay");
  if (!burger || !menu || !overlay) return;

  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    overlay.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  burger.addEventListener("click", () => {
    setOpen(burger.getAttribute("aria-expanded") !== "true");
  });

  overlay.addEventListener("click", () => setOpen(false));

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      burger.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && burger.getAttribute("aria-expanded") === "true") setOpen(false);
  });
}

/* --------------------------------------------------------------------------
   Stat count-up
   -------------------------------------------------------------------------- */

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function formatStat(el, value) {
  const decimals = Number(el.dataset.decimals || 0);
  return `${el.dataset.prefix || ""}${value.toFixed(decimals)}${el.dataset.suffix || ""}`;
}

function countUp(el, i) {
  if (el.dataset.target === undefined) return; // text-only stat (e.g. "Whop")
  const target = Number(el.dataset.target);
  const duration = 1500 + i * 80;
  const delay = 480 + i * 90;

  el.textContent = formatStat(el, 0);

  setTimeout(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = formatStat(el, target * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // rAF pauses in hidden/throttled tabs — guarantee the final value lands.
    setTimeout(() => (el.textContent = formatStat(el, target)), duration + 100);
  }, delay);
}

function initStats() {
  const values = Array.from(document.querySelectorAll(".stat-value"));
  if (!values.length) return;

  // Reduced motion / no IO: leave the final values that ship in the HTML.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target, values.indexOf(entry.target));
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  values.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   Scroll reveal for below-the-fold sections
   -------------------------------------------------------------------------- */

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const showAll = () => items.forEach((el) => el.classList.add("is-in"));

  if (!("IntersectionObserver" in window)) return showAll();

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   Products filter tabs (Products | Software | Agency)
   -------------------------------------------------------------------------- */

function initTabs() {
  const tabs = Array.from(document.querySelectorAll(".tab[data-filter]"));
  const offers = document.querySelectorAll(".offer[data-cat]");
  if (!tabs.length) return;

  const select = (filter) => {
    tabs.forEach((t) => {
      const on = t.dataset.filter === filter;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    offers.forEach((card) => {
      const show = filter === "all" || card.dataset.cat === filter;
      card.hidden = !show;
      if (show) card.classList.add("is-in");
    });
  };

  tabs.forEach((t) => t.addEventListener("click", () => select(t.dataset.filter)));
}

/* --------------------------------------------------------------------------
   Nav active state follows the section in view
   -------------------------------------------------------------------------- */

function initScrollSpy() {
  const links = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll("[data-section]");
  if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

  const setActive = (key) => {
    links.forEach((a) => {
      const on = a.dataset.nav === key;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.dataset.section);
      });
    },
    // a thin band across the middle of the viewport decides the "current" section
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((s) => io.observe(s));
}

/* --------------------------------------------------------------------------
   Affiliate earnings calculator (40% commission)
   -------------------------------------------------------------------------- */

const COMMISSION = 0.4;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function initCalculator() {
  const sliders = document.querySelectorAll("[data-calc-price]");
  const month = document.querySelector("[data-calc-month]");
  const year = document.querySelector("[data-calc-year]");
  if (!sliders.length || !month || !year) return;

  const update = () => {
    let total = 0;
    sliders.forEach((s) => {
      const sales = Number(s.value);
      total += sales * Number(s.dataset.calcPrice) * COMMISSION;
      const out = s.closest(".calc-row")?.querySelector(".calc-count");
      if (out) out.textContent = sales;
    });
    month.textContent = usd.format(total);
    year.textContent = usd.format(total * 12);
  };

  sliders.forEach((s) => s.addEventListener("input", update));
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  applyLinks();
  initCalculator();
  initMenu();
  initStats();
  initReveal();
  initTabs();
  initScrollSpy();

  const onScroll = () =>
    document.body.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.6);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});

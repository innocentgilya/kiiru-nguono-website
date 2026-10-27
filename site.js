const EMAIL = "info@kiirunguonoadvocates.co.ke";
const page = location.pathname.split("/").pop() || "index.html";

/* ---------- Shared nav and footer ---------- */
const links = [
  ["Home", "index.html"],
  ["About Us", "index.html#about"],
  ["Practice Areas", "index.html#practice"],
  ["Articles", "articles.html"],
  ["Our Team", "team.html"],
];
const navHost = document.getElementById("site-nav");
if (navHost) {
  navHost.outerHTML = `
  <nav>
    <a href="index.html" class="brand"><img src="images/logo-white.svg" alt="Kiiru &amp; Nguono Co. Advocates"></a>
    <div class="nav-right" id="menu">
      ${links.map(([t, h]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t}</a>`).join("")}
      <a href="index.html#contact" class="nav-cta">Contact Us</a>
    </div>
    <button class="menu-btn" id="menu-btn" aria-label="Toggle menu">MENU <i class="fa-solid fa-bars"></i></button>
  </nav>`;
}
const footHost = document.getElementById("site-footer");
if (footHost) {
  footHost.outerHTML = `
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="footer-brand">Kiiru &amp; Nguono<br>Co. Advocates</a>
        <p class="footer-tag">Building something that lasts.</p>
        <div class="footer-contact">
          <div class="fc"><i class="fa-solid fa-phone"></i><div><small>Phone</small><a href="tel:+254722701913">+254 722 701 913</a></div></div>
          <div class="fc"><i class="fa-solid fa-envelope"></i><div><small>Email</small><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
          <div class="fc"><i class="fa-solid fa-location-dot"></i><div><small>Offices</small><p>Nairobi and Oyugis, Kenya</p></div></div>
        </div>
      </div>
      <div>
        <h4>Follow Us</h4>
        <div class="social">
          <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-facebook-f"></i>Facebook</a>
          <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i>Instagram</a>
          <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in"></i>LinkedIn</a>
          <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-x-twitter"></i>X</a>
          <a href="#" target="_blank" rel="noopener"><i class="fa-brands fa-youtube"></i>YouTube</a>
        </div>
      </div>
      <div>
        <h4>Quick Links</h4>
        <div class="f-links">
          <a href="index.html">Home</a>
          <a href="index.html#about">About Us</a>
          <a href="index.html#practice">Practice Areas</a>
          <a href="articles.html">Articles</a>
          <a href="team.html">Our Team</a>
          <a href="index.html#contact">Contact Us</a>
        </div>
      </div>
      <div>
        <h4>Office Hours</h4>
        <ul class="hours">
          <li>Monday to Friday: 8:00 AM to 5:00 PM</li>
          <li>Saturday: By appointment</li>
          <li>Sunday: Closed</li>
          <li>Email enquiries: Answered within one business day</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Kiiru &amp; Nguono Co. Advocates. All rights reserved.</p>
      <p>Nairobi · Oyugis, Kenya</p>
    </div>
  </footer>`;
}

/* ---------- Nav behaviour ---------- */
const nav = document.querySelector("nav");
const menu = document.getElementById("menu");
document.getElementById("menu-btn")?.addEventListener("click", () => menu.classList.toggle("show"));
menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("show")));
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 50);
window.addEventListener("scroll", onScroll);
onScroll();

/* ---------- Journey accordion ---------- */
const accItems = document.querySelectorAll(".acc-item");
accItems.forEach(item => {
  const header = item.querySelector(".acc-header");
  header.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    accItems.forEach(i => {
      i.classList.remove("open");
      i.querySelector(".acc-header").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      header.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- Scroll reveal (staggered inside each group) ---------- */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const selectors = [
    ".trusted-label", ".logo-row", ".audience", ".card", ".journey-image", ".journey-words",
    ".values-label", ".values h2", ".values-intro", ".value", ".services-left", ".service",
    ".areas-label", ".areas h2", ".areas-intro", ".area", ".contact-label", ".contact h2",
    ".contact-intro", ".contact-list", ".contact-form", ".page-hero .wrap > *", ".article",
    ".partner", ".testimonial", ".t-label", ".testimonials h2", ".member", ".section-title",
  ].join(",");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      io.unobserve(el);
      // hand hover effects back to each element once the reveal finishes
      if (el.classList.contains("reveal")) setTimeout(() => el.classList.remove("reveal", "in"), 1600);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(selectors).forEach(el => {
    const index = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", (index % 4) * 0.12 + "s");
    el.classList.add("reveal");
    io.observe(el);
  });
  const full = document.querySelector(".full-image");
  if (full) io.observe(full);
}

/* ---------- Enquiry form: sends to the firm's info email ---------- */
const form = document.getElementById("enquiry-form");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    const btn = form.querySelector("button");
    btn.disabled = true;
    status.textContent = "Sending your message...";
    try {
      const res = await fetch("https://formsubmit.co/ajax/" + EMAIL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!res.ok || String(data.success) !== "true") throw new Error();
      status.textContent = "Thank you. We have received your message and will respond shortly.";
      form.reset();
    } catch {
      status.textContent = "Your message was not sent. Please email " + EMAIL + " directly.";
    }
    btn.disabled = false;
  });
}
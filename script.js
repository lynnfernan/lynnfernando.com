// ================================================
// Lynn Fernando — Personal Brand Site
// ================================================

// --- NAV: scroll behavior ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// --- NAV: mobile toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- REVEAL ON SCROLL ---
const revealEls = document.querySelectorAll(
  '.stat-card, .platform-card, .pillar, .investment-item, .philosophy-card, .talk-card, .topic-tag, .audience-item, .credential, .contact-option'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const mod = i % 4;
  if (mod === 1) el.classList.add('reveal-delay-1');
  if (mod === 2) el.classList.add('reveal-delay-2');
  if (mod === 3) el.classList.add('reveal-delay-3');
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// Section headers reveal
document.querySelectorAll('.section-header, .about-preview-text, .about-col, .investments-left, .contact-left').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// --- CONTACT FORM ---
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
  });
}

// --- SMOOTH ANCHOR with nav offset ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

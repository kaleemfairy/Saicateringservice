// Reset the page-transition fade when a page is restored from bfcache
// (e.g. the browser Back button), since DOMContentLoaded doesn't refire then.
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-leaving');
  requestAnimationFrame(() => document.body.classList.add('page-ready'));
});

document.addEventListener('DOMContentLoaded', () => {
  // Page entrance fade-in
  requestAnimationFrame(() => document.body.classList.add('page-ready'));

  // Scroll-reveal: fade/slide up sections and cards as they enter the viewport
  const revealTargets = document.querySelectorAll(
    '.section-head, .dish-card, .work-card, .testi, .area-card, .stat, .about-visual, .contact-card, .map-block, .hero-inner > div'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
    // Safety net: content below the fold only reveals once a real scroll
    // brings it into view. Anything that captures the page without actually
    // scrolling — a full-page screenshot tool, print/"save as PDF", some
    // embedded webviews — never fires that, leaving whole sections blank.
    // Force-reveal anything still hidden a couple seconds after load so the
    // page is never stuck showing empty blocks.
    setTimeout(() => {
      revealTargets.forEach(el => el.classList.add('in-view'));
      io.disconnect();
    }, 2500);
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  // Smooth fade transition when navigating to another page on this site
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || a.target === '_blank') return;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.remove('page-ready');
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Language toggle (EN / Tamil)
  const btnEn = document.getElementById('btnEn');
  const btnTa = document.getElementById('btnTa');
  if (btnEn && btnTa) {
    btnEn.addEventListener('click', () => {
      document.documentElement.classList.remove('lang-ta');
      btnEn.classList.add('active'); btnTa.classList.remove('active');
    });
    btnTa.addEventListener('click', () => {
      document.documentElement.classList.add('lang-ta');
      btnTa.classList.add('active'); btnEn.classList.remove('active');
    });
  }

  // Soft quote popup — appears once per page load, after a short delay, dismissible
  const popup = document.getElementById('quotePopup');
  if (popup) {
    let popupDismissed = false;
    setTimeout(() => { if (!popupDismissed) popup.classList.add('show'); }, 6000);
    const qpClose = document.getElementById('qpClose');
    if (qpClose) qpClose.addEventListener('click', () => {
      popup.classList.remove('show');
      popupDismissed = true;
    });

    // Replace with the client's real WhatsApp Business number: country code + number, no + or spaces
    const BUSINESS_WHATSAPP_NUMBER = '916379784813';
    const qpForm = document.getElementById('qpForm');
    if (qpForm) qpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerNumber = document.getElementById('qpPhone').value.trim();
      const isTamil = document.documentElement.classList.contains('lang-ta');
      const message = isTamil
        ? `வணக்கம், எனக்கு ஒரு விருந்து மதிப்பீடு தேவை. என் எண்: ${customerNumber}`
        : `Hi, I'd like a quote for an event. My number is ${customerNumber}.`;
      const waUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener');
      qpForm.innerHTML = isTamil
        ? '<p style="margin:0; color:#3D5C3A; font-weight:600;">WhatsApp திறக்கப்படுகிறது…</p>'
        : '<p style="margin:0; color:#3D5C3A; font-weight:600;">Opening WhatsApp for you…</p>';
    });
  }
});

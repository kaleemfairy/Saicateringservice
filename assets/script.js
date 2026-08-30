document.addEventListener('DOMContentLoaded', () => {
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

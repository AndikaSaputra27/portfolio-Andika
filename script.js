/* =========================================
   PORTFOLIO ANDIKA — script.js
   Interactivity: Navbar, Typewriter,
   Scroll Animations, Project Filter,
   Skill Bars, Contact Form, Back to Top
   ========================================= */

'use strict';

/* =========================================
   1. NAVBAR — Sticky scroll + Active link
   ========================================= */
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function onScroll() {
  // Tambah class scrolled saat scroll > 60px
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Update active nav link berdasarkan section yang sedang dilihat
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });

  // Back to top visibility
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

// Tutup mobile menu saat link diklik
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Tutup mobile menu saat klik di luar
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

/* =========================================
   2. TYPEWRITER EFFECT
   ========================================= */
const typewriterEl = document.getElementById('typewriter');

if (typewriterEl) {
  const phrases = [
    'Full Stack Developer',
    'Problem Solver',
    'Lifelong Learner',
    'Career Switcher',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Selesai mengetik — pause lalu mulai hapus
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Selesai menghapus — pindah ke phrase berikutnya
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeWriter, delay);
  }

  // Mulai typewriter setelah 800ms
  setTimeout(typeWriter, 800);
}

/* =========================================
   3. SCROLL ANIMATION — Intersection Observer
   ========================================= */
const animatedEls = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

animatedEls.forEach(el => scrollObserver.observe(el));

/* =========================================
   4. SKILL BARS ANIMATION
   ========================================= */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = targetWidth + '%';
        }, 200);
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.5 }
);

skillFills.forEach(fill => skillObserver.observe(fill));

/* =========================================
   5. PROJECT FILTER
   ========================================= */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update tombol aktif
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const isMatch  = filter === 'all' || category === filter;

      if (isMatch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* =========================================
   6. CONTACT FORM — Validasi & Submit
   ========================================= */
const contactForm  = document.getElementById('contactForm');

if (contactForm) {
  const submitBtn    = document.getElementById('submitBtn');
  const formToast    = document.getElementById('formToast');
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(input, errorEl, rules) {
    const value = input.value.trim();
    let errorMessage = '';

    for (const rule of rules) {
      if (!rule.test(value)) {
        errorMessage = rule.message;
        break;
      }
    }

    if (errorMessage) {
      input.classList.add('error');
      errorEl.textContent = errorMessage;
      return false;
    } else {
      input.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }
  }

  const nameRules = [
    { test: v => v.length > 0,  message: 'Nama tidak boleh kosong.' },
    { test: v => v.length >= 2, message: 'Nama terlalu pendek (min. 2 karakter).' },
  ];
  const emailRules = [
    { test: v => v.length > 0,    message: 'Email tidak boleh kosong.' },
    { test: v => isValidEmail(v), message: 'Format email tidak valid.' },
  ];
  const messageRules = [
    { test: v => v.length > 0,   message: 'Pesan tidak boleh kosong.' },
    { test: v => v.length >= 10, message: 'Pesan terlalu singkat (min. 10 karakter).' },
  ];

  // Validasi real-time saat user mengetik
  nameInput.addEventListener('input',    () => validateField(nameInput,    nameError,    nameRules));
  emailInput.addEventListener('input',   () => validateField(emailInput,   emailError,   emailRules));
  messageInput.addEventListener('input', () => validateField(messageInput, messageError, messageRules));

  function showToast(type, message) {
    formToast.className = `form-toast ${type}`;
    formToast.textContent = message;
    setTimeout(() => {
      formToast.className = 'form-toast';
      formToast.textContent = '';
    }, 5000);
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validasi semua field
    const isNameValid    = validateField(nameInput,    nameError,    nameRules);
    const isEmailValid   = validateField(emailInput,   emailError,   emailRules);
    const isMessageValid = validateField(messageInput, messageError, messageRules);

    if (!isNameValid || !isEmailValid || !isMessageValid) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Mengirim...';

    try {
      // Simulasi pengiriman (ganti dengan EmailJS atau fetch ke backend nyata)
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast('success', '✅ Pesan terkirim! Saya akan menghubungi Anda segera.');
      contactForm.reset();

    } catch (err) {
      showToast('error', '❌ Gagal mengirim pesan. Silakan hubungi via email langsung.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Kirim Pesan';
    }
  });
}

/* =========================================
   7. BACK TO TOP
   ========================================= */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================
   8. SMOOTH SCROLL — Semua anchor link
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =========================================
   9. INIT
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Jalankan scroll check awal
  onScroll();

  // Update tahun copyright otomatis
  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) {
    const currentYear = new Date().getFullYear();
    footerCopy.innerHTML = footerCopy.innerHTML.replace('2024', currentYear);
  }
});

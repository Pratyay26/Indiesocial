/* ============================================================
   IndieSocial — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── CURSOR ── */
  const dot   = document.getElementById('cursorDot');
  const glow  = document.getElementById('cursorGlow');

  if (dot && glow && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function lerp(a, b, n) { return a + (b - a) * n; }
    function animateGlow() {
      gx = lerp(gx, mx, 0.06);
      gy = lerp(gy, my, 0.06);
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      glow.style.opacity = '0.6';
    });

    // Scale on hover over interactive
    document.querySelectorAll('a, button, .service-card, .portfolio-card, .testi-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform += ' scale(2.5)';
        dot.style.background = 'var(--accent-2)';
        glow.style.opacity = '0.9';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.background = 'var(--accent)';
        glow.style.opacity = '0.6';
      });
    });
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── HAMBURGER MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) { s.style.transform = 'rotate(45deg) translate(5px, 5px)'; }
        if (i === 1) { s.style.opacity = '0'; s.style.transform = 'scaleX(0)'; }
        if (i === 2) { s.style.transform = 'rotate(-45deg) translate(5px, -5px)'; }
      } else {
        s.style.transform = ''; s.style.opacity = '';
      }
    });
  });
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step     = 16;
    const steps    = duration / step;
    const inc      = target / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, step);
  }

  const counterEls = document.querySelectorAll('.counter-num');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObs.observe(el));

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = '0';
        b.nextElementSibling.style.paddingBottom = '0';
      });
      // Open clicked if was closed
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const panel = btn.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ── HERO CANVAS (particle field) ── */
  const canvas  = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.a  = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? 210 : 260; // blue or purple
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.a})`;
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = Array.from({ length: 120 }, () => new Particle());
    }

    // Draw connecting lines between close particles
    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.strokeStyle = `rgba(77, 159, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let raf;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      raf = requestAnimationFrame(animate);
    }

    const heroObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { if (!raf) animate(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    });
    heroObs.observe(canvas);

    window.addEventListener('resize', () => {
      resize();
      particles.forEach(p => p.reset());
    });

    init();
    animate();
  }

  /* ── CONTACT FORM MOCK SUBMIT ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit span');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      form.querySelector('.form-submit').disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        form.querySelector('.form-submit').style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        setTimeout(() => {
          btn.textContent = original;
          form.querySelector('.form-submit').disabled = false;
          form.querySelector('.form-submit').style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  }

  /* ── SERVICE CARD TILT ── */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.service-card, .portfolio-card, .team-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `translateY(-6px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── FLOATING BUTTON ENTRANCE ── */
  setTimeout(() => {
    const fc = document.getElementById('floatingContact');
    if (fc) {
      fc.style.transition = 'opacity .6s, transform .6s';
      fc.style.opacity = '1';
      fc.style.transform = 'translateY(0)';
    }
  }, 1200);

  const fc = document.getElementById('floatingContact');
  if (fc) {
    fc.style.opacity = '0';
    fc.style.transform = 'translateY(20px)';
  }

})();

document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      const plus = i.querySelector('.plus');
      if (plus) plus.textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('open');
      const plus = item.querySelector('.plus');
      if (plus) plus.textContent = '−';
    }
  });
});

document.querySelectorAll('.chip-group').forEach(group => {
  group.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });
});

// Team photo carousels (homepage + About page)
document.querySelectorAll('.team-carousel').forEach(carousel => {
  const track = carousel.querySelector('.tc-track');
  const slides = Array.from(track.children);
  const dotsWrap = carousel.querySelector('.tc-dots');
  const prevBtn = carousel.querySelector('.tc-prev');
  const nextBtn = carousel.querySelector('.tc-next');
  if (!track || slides.length === 0) return;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'tc-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    dot.addEventListener('click', () => scrollToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function maxScroll() {
    return track.scrollWidth - track.clientWidth;
  }
  function currentIndex() {
    const max = maxScroll();
    if (max <= 0 || slides.length <= 1) return 0;
    const frac = track.scrollLeft / max; // 0..1 across the real scrollable range
    return Math.round(frac * (slides.length - 1));
  }
  function updateDots() {
    const idx = Math.max(0, Math.min(currentIndex(), slides.length - 1));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  function scrollToSlide(i) {
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    const max = maxScroll();
    // spread stops evenly across the real scrollable range, so every index is
    // reachable even when slide width doesn't divide evenly into the track
    const target = slides.length <= 1 ? 0 : (clamped / (slides.length - 1)) * max;
    track.scrollTo({ left: target, behavior: 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => scrollToSlide(currentIndex() - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const next = currentIndex() + 1 >= slides.length ? 0 : currentIndex() + 1;
    scrollToSlide(next);
  });

  track.addEventListener('scroll', () => {
    clearTimeout(track._scrollTimer);
    track._scrollTimer = setTimeout(updateDots, 80);
  });

  // Click-and-drag scrolling for desktop mouse users
  let isDown = false, startX = 0, startScroll = 0, dragged = false;
  track.addEventListener('mousedown', e => {
    isDown = true; dragged = false;
    startX = e.pageX; startScroll = track.scrollLeft;
    track.classList.add('dragging');
  });
  window.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    const delta = e.pageX - startX;
    if (Math.abs(delta) > 4) dragged = true;
    track.scrollLeft = startScroll - delta;
  });
  // Prevent accidental image click-through after a drag
  track.addEventListener('click', e => { if (dragged) e.preventDefault(); }, true);

  // Auto-advance, pausing on hover/touch/drag
  let autoTimer;
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      const next = currentIndex() + 1 >= slides.length ? 0 : currentIndex() + 1;
      scrollToSlide(next);
    }, 3500);
  }
  function stopAuto() { clearInterval(autoTimer); }
  startAuto();
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('touchstart', stopAuto, { passive: true });
});

// Contact form submit — lightweight client-side validation + feedback
document.querySelectorAll('.submit-btn').forEach(btn => {
  const formRight = btn.closest('.form-right');
  if (!formRight) return;
  btn.addEventListener('click', () => {
    const nameInput = formRight.querySelector('input[type="text"]');
    const emailInput = formRight.querySelector('input[type="email"]');
    let note = formRight.querySelector('.form-note');
    if (!note) {
      note = document.createElement('p');
      note.className = 'form-note';
      formRight.appendChild(note);
    }
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailValid) {
      note.textContent = !name
        ? 'Please add your name before submitting.'
        : 'Please add a valid email before submitting.';
      note.style.color = '#D33A26';
      (name ? emailInput : nameInput)?.focus();
      return;
    }

    note.style.color = '#5B5B58';
    note.textContent = `Thanks, ${name}! We'll be in touch at ${email} shortly.`;
    btn.disabled = true;
    btn.textContent = 'Sent ✓';
  });
});

// Services accordion (homepage)
document.querySelectorAll('.service-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const wrap = btn.closest('.service-item-wrap');
    const isOpen = wrap.classList.contains('open');
    document.querySelectorAll('.service-item-wrap').forEach(w => w.classList.remove('open'));
    if (!isOpen) wrap.classList.add('open');
  });
});

// Hero video placeholder — no real video file, give honest feedback on click
const playBtn = document.getElementById('playBtn');
if (playBtn) {
  playBtn.addEventListener('click', () => {
    playBtn.textContent = 'Coming soon';
    setTimeout(() => { playBtn.textContent = 'PLAY'; }, 1800);
  });
}

// Works page filter pills
const filterPills = document.querySelectorAll('.filter-pill');
if (filterPills.length) {
  const cards = document.querySelectorAll('[data-cats]');
  const grid = document.querySelector('.work-grid');
  let emptyMsg = grid ? grid.querySelector('.filter-empty') : null;
  if (grid && !emptyMsg) {
    emptyMsg = document.createElement('div');
    emptyMsg.className = 'filter-empty';
    emptyMsg.textContent = 'No projects in this category yet — check back soon.';
    grid.appendChild(emptyMsg);
  }

  filterPills.forEach(pill => {
    pill.dataset.filterBound = '1'; // let the inline fallback in works.html know we've got this
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;

      let visibleCount = 0;
      cards.forEach(card => {
        const cats = card.dataset.cats.split(',');
        const matches = (cat === 'All' || cats.includes(cat));
        if (matches) visibleCount++;

        if (matches && card.style.display === 'none') {
          // showing a previously-hidden card: unhide then fade in
          card.style.display = '';
          card.classList.add('filtering-out');
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.classList.remove('filtering-out');
          }));
        } else if (!matches && card.style.display !== 'none') {
          // hiding a visible card: fade out then remove from layout
          card.classList.add('filtering-out');
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });

      if (emptyMsg) emptyMsg.classList.toggle('show', visibleCount === 0);
    });
  });
}

// ---------- Header scroll shadow ----------
(function () {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---------- Scroll-reveal animations ----------
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Staggered groups — each child fades up in sequence as its group enters view
  const groups = [
    '.hero-cta-row', '.hero-media',
    '.work-grid > *',
    '.quote-grid > *',
    '.stats-grid > *', '.stats-row2 > *',
    '.process-grid > *',
    '.test-grid > *',
    '.cs-3col > *',
    '.cs-brand-grid > *',
    '.cs-mission-grid > *',
    '.cs-2col > *',
  ];
  groups.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = (Math.min(i, 5) * 80) + 'ms';
    });
  });

  // Single elements — fade up individually, no stagger
  const singles = [
    '.hero h1', '.hero-sub',
    '.page-hero h1', '.page-hero .sub',
    '.hero-photos img',
    '.section-head h2',
    '.quote > h2',
    '.team h2', '.team p.desc', '.team-carousel',
    '.faq-intro h2', '.faq-intro p',
    '.success h2',
    '.cs-hero h1', '.cs-hero .sub', '.cs-collage', '.cs-overview',
    '.cs-full-img', '.cs-typo-card', '.cs-impact', '.cs-final-collage',
    '.footer-cta h2', '.footer-cta .btn',
    '.logo-strip p',
  ];
  singles.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.setAttribute('data-reveal', ''));
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

// ---------- Animated stat counters (About page) ----------
(function () {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const raw = el.textContent.trim();
      const match = raw.match(/^(\D*)(\d+)(\D*)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseInt(numStr, 10);
      const duration = 1100;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  counters.forEach(el => io.observe(el));
})();

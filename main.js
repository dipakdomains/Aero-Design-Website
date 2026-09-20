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
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.cats.split(',');
        card.style.display = (cat === 'All' || cats.includes(cat)) ? '' : 'none';
      });
    });
  });
}

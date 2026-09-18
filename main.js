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

const button = document.querySelector('.menu-button');
const menu = document.querySelector('.nav-links');

if (button && menu) {
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  const count = slides.length;
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function goTo(i) {
    index = (i + count) % count;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
  }

  function restart() {
    stop();
    start();
  }

  function start() { timer = setInterval(() => goTo(index + 1), 6000); }
  function stop() { clearInterval(timer); }

  prev.addEventListener('click', () => { goTo(index - 1); restart(); });
  next.addEventListener('click', () => { goTo(index + 1); restart(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  let touchX = 0;
  carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { goTo(index + (dx < 0 ? 1 : -1)); restart(); }
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (!carousel.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft') { goTo(index - 1); restart(); }
    if (e.key === 'ArrowRight') { goTo(index + 1); restart(); }
  });

  goTo(0);
  start();
}
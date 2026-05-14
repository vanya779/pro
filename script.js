const slides = document.querySelectorAll('.slide');
const dots = document.getElementById('nav');
const counter = document.getElementById('slide-counter');
const progress = document.getElementById('progress');
const veil = document.getElementById('veil');
const cursor = document.getElementById('cursor');
let current = 0;
let isAnimating = false;

// Build dots
slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  dots.appendChild(d);
});

function updateDots(n) {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === n));
}

function updateCounter(n) {
  counter.textContent = String(n + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
}

function updateProgress(n) {
  progress.style.width = ((n + 1) / slides.length * 100) + '%';
}

function goTo(n) {
  if (isAnimating || n === current || n < 0 || n >= slides.length) return;
  isAnimating = true;

  const from = slides[current];
  const to = slides[n];

  // Veil sweep
  veil.style.transition = 'transform 0.35s cubic-bezier(0.77,0,0.175,1)';
  veil.style.transform = 'translateX(0)';

  setTimeout(() => {
    from.classList.remove('active', 'entering', 'exiting');
    to.classList.add('active');

    // Reset & restart animations on new slide
    to.querySelectorAll('.anim').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });

    // Special resets
    const yearNum = to.querySelector('.year-num');
    if (yearNum) {
      yearNum.style.animation = 'none';
      yearNum.offsetHeight;
      yearNum.style.animation = '';
    }

    const goldLine = to.querySelector('.gold-line');
    if (goldLine) {
      goldLine.style.width = '0';
      goldLine.style.animation = 'none';
      goldLine.offsetHeight;
      goldLine.style.animation = '';
    }

    veil.style.transition = 'transform 0.35s cubic-bezier(0.77,0,0.175,1)';
    veil.style.transform = 'translateX(100%)';

    current = n;
    updateDots(n);
    updateCounter(n);
    updateProgress(n);

    setTimeout(() => {
      veil.style.transition = 'none';
      veil.style.transform = 'translateX(-100%)';
      isAnimating = false;
    }, 380);
  }, 370);
}

// Controls
document.getElementById('next').onclick = () => goTo(current + 1);
document.getElementById('prev').onclick = () => goTo(current - 1);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    goTo(current + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goTo(current - 1);
  }
});

// Touch swipe
let touchX = 0;
document.addEventListener('touchstart', e => touchX = e.touches[0].clientX);
document.addEventListener('touchend', e => {
  const dx = touchX - e.changedTouches[0].clientX;
  if (Math.abs(dx) > 50) goTo(dx > 0 ? current + 1 : current - 1);
});

// Custom cursor
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('button, .b-card, .stat-row, .stat-box, .tech-card, .arch-col, .quote-block').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// Init
updateProgress(0);
updateCounter(0);

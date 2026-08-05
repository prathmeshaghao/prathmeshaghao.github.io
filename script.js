// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Terminal typing effect (hero)
function typeTerminal(el) {
  const lines = JSON.parse(el.dataset.lines);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.innerHTML = '';

  if (reduceMotion) {
    lines.forEach(l => {
      const p = document.createElement('div');
      p.className = 'line';
      p.innerHTML = l.type === 'cmd' ? `<span class="prompt">$</span> ${l.text}` : `<span class="out">${l.text}</span>`;
      el.appendChild(p);
    });
    return;
  }

  let li = 0;
  function nextLine() {
    if (li >= lines.length) return;
    const l = lines[li];
    const p = document.createElement('div');
    p.className = 'line';
    el.appendChild(p);

    if (l.type === 'cmd') {
      const prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = '$ ';
      p.appendChild(prompt);
      const textSpan = document.createElement('span');
      p.appendChild(textSpan);
      let ci = 0;
      const iv = setInterval(() => {
        textSpan.textContent += l.text[ci];
        ci++;
        if (ci >= l.text.length) {
          clearInterval(iv);
          li++;
          setTimeout(nextLine, 260);
        }
      }, 28);
    } else {
      p.innerHTML = `<span class="out">${l.text}</span>`;
      li++;
      setTimeout(nextLine, 180);
    }
  }
  nextLine();
}

document.querySelectorAll('.terminal-body[data-lines]').forEach(typeTerminal);

// Deterministic pseudo-hash generator for block IDs (flavor only)
function pseudoHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  const hex = Math.abs(h).toString(16).padStart(6, '0').slice(0, 6);
  return '0x' + hex;
}
document.querySelectorAll('[data-hash-src]').forEach(el => {
  el.textContent = pseudoHash(el.dataset.hashSrc);
});

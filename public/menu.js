const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
const theme = document.querySelector('.theme');
const compact = matchMedia('(max-width: 820px)');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.hidden = compact.matches && !open;
}
function layout() {
  menu.hidden = !compact.matches;
  setMenu(false);
}
menu.addEventListener('click', () => setMenu(nav.hidden));
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  if (compact.matches) {
    setMenu(false);
    const section = document.querySelector(link.hash);
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
  }
});
function currentSection() {
  const hash = location.hash || '#home';
  for (const link of nav.querySelectorAll('a')) {
    if (link.hash === hash) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  }
}
addEventListener('hashchange', currentSection);
currentSection();
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (theme.open) {
    theme.open = false;
    theme.querySelector('summary').focus();
  } else if (menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
function applyTheme(value) {
  document.documentElement.dataset.theme = value;
  theme.querySelector('input[value="'+value+'"]').checked = true;
}
try {
  const stored = localStorage.getItem('mf-theme');
  if (['light','dark','automatic'].includes(stored)) applyTheme(stored);
} catch {}
theme.addEventListener('change', (event) => {
  const value = event.target.value;
  applyTheme(value);
  try { localStorage.setItem('mf-theme', value); } catch {}
});
compact.addEventListener('change', layout);
layout();


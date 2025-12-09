(function () {
  const STORAGE_KEY = 'theme';
  const DARK = 'dark';
  const LIGHT = 'light';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme-transition', 'true');
    root.setAttribute('data-theme', theme);
    window.setTimeout(() => root.removeAttribute('data-theme-transition'), 300);
  }

  function initTheme() {
    let theme = DARK;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        theme = saved;
      } else {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
      }
    } catch (err) {
      console.warn('No se pudo acceder a localStorage para el tema', err);
      theme = LIGHT;
    }
    applyTheme(theme);
    return theme;
  }

  let currentTheme = initTheme();
  const themeToggle = document.querySelector('[data-theme-toggle]');

  function renderThemeButton() {
    if (!themeToggle) return;
    themeToggle.textContent = currentTheme === DARK ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', currentTheme === DARK ? 'Modo claro' : 'Modo oscuro');
    themeToggle.setAttribute('title', currentTheme === DARK ? 'Modo claro' : 'Modo oscuro');
  }

  renderThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === DARK ? LIGHT : DARK;
      applyTheme(currentTheme);
      try { localStorage.setItem(STORAGE_KEY, currentTheme); } catch (err) { console.warn('No se pudo guardar el tema', err); }
      renderThemeButton();
    });
  }

  const nav = document.querySelector('.header__nav');
  const navToggle = document.querySelector('[data-menu-toggle]');

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('header__nav--open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('header__nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll('[data-page-target]').forEach((link) => {
      if (link.getAttribute('data-page-target') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-copy-target]') : null;
    if (!trigger) return;

    const selector = trigger.getAttribute('data-copy-target');
    if (!selector) return;

    const targetEl = document.querySelector(selector);
    if (!targetEl) return;

    const text = targetEl.innerText.trim();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      const original = trigger.textContent || '';
      trigger.textContent = 'Copiado';
      window.setTimeout(() => { trigger.textContent = original; }, 2000);
    }).catch((err) => {
      console.error('No se pudo copiar el contenido', err);
    });
  });
})();

/**
 * Menu „burger” na wąskich ekranach. Kiedy przycisk jest widoczny, decyduje CSS
 * (media query) – skrypt tylko przełącza stan otwarte/zamknięte.
 */
export function initMobileNav(header) {
  const toggle = header.querySelector('[data-nav-toggle]');
  const nav = document.getElementById(toggle?.getAttribute('aria-controls'));
  if (!toggle || !nav) return;

  const isOpen = () => header.classList.contains('nav-open');

  const setOpen = (open) => {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Wybranie pozycji menu przewija do sekcji – menu powinno się wtedy schować.
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

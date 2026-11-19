/**
 * Wspólny mechanizm karuzel: indeks z zawijaniem, automatyczna rotacja,
 * wstrzymanie przy ukrytej karcie przeglądarki, gest przesunięcia i kropki nawigacji.
 */

const SWIPE_THRESHOLD_PX = 45;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @param {object} options
 * @param {HTMLElement} options.root        element obsługujący gest przesunięcia i pauzę
 * @param {number} options.count            liczba slajdów
 * @param {number} [options.interval]       czas między slajdami [ms]; brak = bez automatycznej rotacji
 * @param {(index: number) => void} options.onChange  renderuje aktywny slajd
 *
 * Automatyczna rotacja (jeśli włączona) zatrzymuje się, gdy użytkownik najedzie na karuzelę
 * myszą lub przejdzie do niej klawiaturą, a przy ustawieniu „ogranicz ruch” nie startuje wcale.
 */
export function createSlider({ root, count, interval = 0, onChange }) {
  let index = 0;
  let timer = null;
  let hovered = false;
  let focused = false;

  const autoplay = interval > 0 && count > 1 && !prefersReducedMotion();

  const show = (n) => {
    index = (n + count) % count;
    onChange(index);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (autoplay && !hovered && !focused && !document.hidden) {
      timer = setInterval(() => show(index + 1), interval);
    }
  };

  const goTo = (n) => {
    show(n);
    start();
  };

  onSwipe(root, (direction) => goTo(index + direction));

  if (autoplay) {
    root.addEventListener('mouseenter', () => { hovered = true; stop(); });
    root.addEventListener('mouseleave', () => { hovered = false; start(); });
    root.addEventListener('focusin', () => { focused = true; stop(); });
    root.addEventListener('focusout', (event) => {
      if (root.contains(event.relatedTarget)) return;
      focused = false;
      start();
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }

  show(0);
  start();

  return {
    goTo,
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1),
  };
}

/** Wywołuje callback(+1 | -1) po przesunięciu palcem w lewo / w prawo. */
function onSwipe(element, callback) {
  let startX = null;

  element.addEventListener('touchstart', (event) => {
    startX = event.changedTouches[0].clientX;
  }, { passive: true });

  element.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const deltaX = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) callback(deltaX < 0 ? 1 : -1);
  }, { passive: true });
}

/**
 * Tworzy przyciski-kropki w kontenerze.
 * @returns {HTMLButtonElement[]}
 */
export function createDots(container, count, labelFor, onSelect) {
  if (!container) return [];
  container.replaceChildren();

  return Array.from({ length: count }, (_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', labelFor(i));
    dot.addEventListener('click', () => onSelect(i));
    container.append(dot);
    return dot;
  });
}

/** Oznacza aktywną kropkę atrybutem aria-current (z niego korzysta też CSS). */
export function markActiveDot(dots, activeIndex) {
  dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === activeIndex)));
}

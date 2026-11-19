/**
 * Krótki komunikat na dole ekranu (np. „Dodano do koszyka”).
 * Element ma role="status", więc czytniki ekranu odczytują jego treść.
 */

const VISIBLE_MS = 5000;

export function createToast(element) {
  const textEl = element.querySelector('[data-toast-text]');
  let timer = null;

  const hide = () => {
    clearTimeout(timer);
    element.classList.remove('is-visible');
  };

  const show = (message) => {
    textEl.textContent = message;
    element.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(hide, VISIBLE_MS);
  };

  return { show, hide };
}

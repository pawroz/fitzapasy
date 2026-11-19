/**
 * Zapamiętuje koszyk w przeglądarce (localStorage), żeby nie znikał po odświeżeniu strony.
 * Zapisywane są tylko nazwy i ilości – cena zawsze pochodzi z aktualnej oferty na stronie,
 * a produkty, których już nie ma w ofercie, są pomijane.
 */

const STORAGE_KEY = 'fitzapasy:cart';
const MAX_QTY = 99;

/**
 * @param {Map<string, number>} catalog  aktualna oferta: nazwa → cena
 * @returns {{name: string, price: number, qty: number}[]}
 */
export function loadCart(catalog) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(stored)) return [];
    return stored
      .filter((item) => catalog.has(item?.name) && Number.isInteger(item.qty) && item.qty > 0)
      .map(({ name, qty }) => ({ name, price: catalog.get(name), qty: Math.min(qty, MAX_QTY) }));
  } catch {
    return []; // brak dostępu do localStorage (np. tryb prywatny) albo uszkodzone dane
  }
}

/** @param {{name: string, qty: number}[]} lines */
export function saveCart(lines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines.map(({ name, qty }) => ({ name, qty }))));
  } catch {
    /* Koszyk działa dalej, tylko nie przetrwa odświeżenia strony. */
  }
}

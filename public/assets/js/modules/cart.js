/**
 * Koszyk po stronie przeglądarki. Strona nie przyjmuje płatności –
 * koszyk składa treść zamówienia i otwiera WhatsApp z gotową wiadomością.
 * Umowa zostaje zawarta dopiero po potwierdzeniu zamówienia przez sprzedawcę (patrz regulamin).
 */

const WHATSAPP_NUMBER = '48507573294';
const EMPTY_MESSAGE = 'Twój koszyk jest pusty. Wybierz gumę w sklepie.';

const formatPrice = (amount) => `${amount} zł`;

const whatsappUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export function initCart() {
  const $ = (selector) => document.querySelector(selector);
  const ui = {
    panel: $('[data-cart-panel]'),
    overlay: $('[data-cart-overlay]'),
    items: $('[data-cart-items]'),
    count: $('[data-cart-count]'),
    total: $('[data-cart-total]'),
    checkout: $('[data-cart-checkout]'),
    consent: $('[data-cart-consent]'),
    closeButton: $('[data-cart-close]'),
  };
  if (!ui.panel) return;

  /** @type {Map<string, {name: string, price: number, qty: number}>} */
  const lines = new Map();
  let returnFocusTo = null;

  // --- Stan -----------------------------------------------------------------

  const totals = () => [...lines.values()].reduce(
    (acc, line) => ({ qty: acc.qty + line.qty, amount: acc.amount + line.qty * line.price }),
    { qty: 0, amount: 0 },
  );

  function add(name, price) {
    const line = lines.get(name) ?? { name, price, qty: 0 };
    line.qty += 1;
    lines.set(name, line);
    render();
  }

  function changeQty(name, delta) {
    const line = lines.get(name);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) lines.delete(name);
    render();
  }

  function remove(name) {
    lines.delete(name);
    render();
  }

  function orderMessage() {
    const rows = [...lines.values()].map(
      ({ name, qty, price }) => `• ${name} — ${qty} szt. × ${formatPrice(price)} = ${formatPrice(qty * price)}`,
    );
    return [
      'Dzień dobry, chcę zamówić w FITZAPASY:',
      ...rows,
      `Razem: ${formatPrice(totals().amount)} + koszt dostawy`,
      '',
      'Dane do wysyłki:',
      'Imię i nazwisko: ',
      'Adres dostawy: ',
      'Telefon: ',
      'E-mail: ',
      'Płatność (BLIK / przelew): ',
      '',
      'Akceptuję Regulamin sklepu fitzapasy.pl.',
    ].join('\n');
  }

  // --- Widok ----------------------------------------------------------------

  function render() {
    const { qty, amount } = totals();

    ui.items.replaceChildren(
      ...(lines.size === 0 ? [createElement('p', { className: 'cart-empty' }, EMPTY_MESSAGE)] : [...lines.values()].map(renderLine)),
    );
    ui.count.textContent = String(qty);
    ui.total.textContent = formatPrice(amount);
    updateCheckoutState();
  }

  function updateCheckoutState() {
    ui.checkout.disabled = lines.size === 0 || !ui.consent.checked;
  }

  function renderLine({ name, price, qty }) {
    const button = (action, label, text, className) => createElement(
      'button',
      { type: 'button', className, dataset: { action, name }, ariaLabel: label },
      text,
    );

    return createElement('div', { className: 'cart-item' },
      createElement('div', {},
        createElement('b', {}, name),
        createElement('small', {}, `${formatPrice(price)} / szt.`),
        createElement('div', { className: 'cart-controls' },
          button('minus', 'Zmniejsz ilość', '−'),
          createElement('strong', {}, String(qty)),
          button('plus', 'Zwiększ ilość', '+'),
          button('remove', `Usuń: ${name}`, 'Usuń', 'cart-remove'),
        ),
      ),
      createElement('b', {}, formatPrice(price * qty)),
    );
  }

// --- Panel ----------------------------------------------------------------

  function open() {
    returnFocusTo = document.activeElement;
    ui.panel.classList.add('open');
    ui.overlay.classList.add('open');
    ui.panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    ui.closeButton.focus({ preventScroll: true });
  }

  function close() {
    if (!ui.panel.classList.contains('open')) return;
    ui.panel.classList.remove('open');
    ui.overlay.classList.remove('open');
    ui.panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    returnFocusTo?.focus({ preventScroll: true });
  }

  // --- Zdarzenia ------------------------------------------------------------

  document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      add(button.dataset.name, Number(button.dataset.price));
      open();
    });
  });

  document.querySelector('[data-cart-open]')?.addEventListener('click', open);
  ui.closeButton.addEventListener('click', close);
  ui.overlay.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  ui.items.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, name } = button.dataset;
    if (action === 'plus') changeQty(name, 1);
    if (action === 'minus') changeQty(name, -1);
    if (action === 'remove') remove(name);
  });

  ui.consent.addEventListener('change', updateCheckoutState);

  ui.checkout.addEventListener('click', () => {
    window.open(whatsappUrl(orderMessage()), '_blank', 'noopener');
  });

  render();
}

// --- Pomocnicze -------------------------------------------------------------

/** Tworzy element DOM bez użycia innerHTML (bezpieczne wobec treści z danych). */
function createElement(tag, { dataset = {}, ariaLabel, ...props } = {}, ...children) {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) element[key] = value;
  });
  Object.assign(element.dataset, dataset);
  if (ariaLabel) element.setAttribute('aria-label', ariaLabel);
  element.append(...children);
  return element;
}

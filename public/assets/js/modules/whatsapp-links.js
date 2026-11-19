import { whatsappUrl } from '../config.js';

const GENERAL_MESSAGE = 'Dzień dobry, chcę zapytać o treningi i dostępne terminy.';

const messageFor = (offer) => (offer
  ? `Dzień dobry, chcę umówić: ${offer}. Proszę o informację o dostępnych terminach.`
  : GENERAL_MESSAGE);

/**
 * Zamienia linki z atrybutem data-whatsapp na linki do czatu WhatsApp z gotową wiadomością.
 * Wartość atrybutu to nazwa oferty; pusta wartość = ogólne pytanie o treningi.
 * Bez JavaScriptu linki prowadzą do sekcji Kontakt (atrybut href w HTML).
 */
export function initWhatsappLinks(root = document) {
  root.querySelectorAll('a[data-whatsapp]').forEach((link) => {
    link.href = whatsappUrl(messageFor(link.dataset.whatsapp.trim()));
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

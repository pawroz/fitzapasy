/** Wspólne ustawienia kontaktu – jedno miejsce do zmiany numeru. */
export const WHATSAPP_NUMBER = '48507573294';

/** Link otwierający czat WhatsApp z gotową treścią wiadomości. */
export const whatsappUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

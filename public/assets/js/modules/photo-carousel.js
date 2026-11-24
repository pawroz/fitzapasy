import { createDots, createSlider, markActiveDot } from './slider.js';

const INTERVAL_MS = 5000;

/**
 * Karuzela zdjęć z płynnym przenikaniem (hero, galerie trenerów).
 * Slajdy oznaczone atrybutem data-shuffle zamieniają się miejscami losowo przy każdym
 * wejściu na stronę; pozostałe zachowują kolejność z HTML.
 */
export function initPhotoCarousel(root) {
  const slides = shuffleMarkedSlides([...root.querySelectorAll('.sl')]);
  if (slides.length === 0) return;

  slides.forEach((slide, i) => slide.setAttribute('aria-label', `Zdjęcie ${i + 1} z ${slides.length}`));

  const dots = createDots(
    root.querySelector('[data-dots]'),
    slides.length,
    (i) => `Pokaż zdjęcie ${i + 1}`,
    (i) => slider.goTo(i),
  );

  const slider = createSlider({
    root,
    count: slides.length,
    interval: INTERVAL_MS,
    onChange(active) {
      slides.forEach((slide, i) => {
        const isActive = i === active;
        slide.classList.toggle('on', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      markActiveDot(dots, active);
    },
  });

  root.querySelector('[data-prev]')?.addEventListener('click', slider.prev);
  root.querySelector('[data-next]')?.addEventListener('click', slider.next);
}

/**
 * Losowo przestawia slajdy z data-shuffle między miejscami, które zajmują
 * (slajdy bez atrybutu zostają na swoich pozycjach). Zwraca nową kolejność
 * i ustawia ją także w DOM.
 */
function shuffleMarkedSlides(slides) {
  const marked = slides.filter((slide) => slide.hasAttribute('data-shuffle'));
  if (marked.length < 2) return slides;

  const shuffled = shuffle(marked);
  const ordered = slides.map((slide) => (slide.hasAttribute('data-shuffle') ? shuffled.shift() : slide));

  const anchor = slides.at(-1).nextSibling;
  ordered.forEach((slide) => slide.parentNode.insertBefore(slide, anchor));
  return ordered;
}

/** Tasowanie Fishera–Yatesa (każda kolejność jednakowo prawdopodobna). */
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

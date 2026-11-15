import { createDots, createSlider, markActiveDot } from './slider.js';

const INTERVAL_MS = 5000;

/** Karuzela zdjęć z płynnym przenikaniem (hero, galerie trenerów). */
export function initPhotoCarousel(root) {
  const slides = [...root.querySelectorAll('.sl')];
  if (slides.length === 0) return;

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

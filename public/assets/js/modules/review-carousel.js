import { createDots, createSlider, markActiveDot } from './slider.js';

const INTERVAL_MS = 6500;

const pad = (n) => String(n).padStart(2, '0');

/** Karuzela opinii – pauzuje przy najechaniu myszą i fokusie klawiatury. */
export function initReviewCarousel(root, reviews) {
  if (reviews.length === 0) return;

  const textEl = root.querySelector('[data-review-text]');
  const authorEl = root.querySelector('[data-review-author]');
  const countEl = root.querySelector('[data-review-count]');

  const dots = createDots(
    root.querySelector('[data-dots]'),
    reviews.length,
    (i) => `Pokaż opinię ${i + 1}`,
    (i) => slider.goTo(i),
  );

  const slider = createSlider({
    root,
    count: reviews.length,
    interval: INTERVAL_MS,
    onChange(active) {
      const review = reviews[active];
      textEl.textContent = `„${review.text}”`;
      authorEl.textContent = review.author;
      countEl.textContent = `${pad(active + 1)} / ${pad(reviews.length)}`;
      markActiveDot(dots, active);
    },
  });

  root.querySelector('[data-prev]')?.addEventListener('click', slider.prev);
  root.querySelector('[data-next]')?.addEventListener('click', slider.next);

  root.addEventListener('mouseenter', slider.pause);
  root.addEventListener('mouseleave', slider.resume);
  root.addEventListener('focusin', (event) => {
    if (event.target.matches('button')) slider.pause();
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) slider.resume();
  });
}

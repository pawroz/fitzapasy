import { createDots, createSlider, markActiveDot } from './slider.js';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Karuzela opinii – bez automatycznej rotacji, żeby każdą opinię dało się spokojnie
 * przeczytać. Przełączanie strzałkami, kropkami lub gestem przesunięcia.
 */
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
}

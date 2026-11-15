/**
 * Punkt wejścia aplikacji. Skrypt ładowany jako moduł (type="module"),
 * więc wykonuje się po sparsowaniu DOM – nie potrzeba DOMContentLoaded.
 */
import { REVIEWS } from './data/reviews.js';
import { initCart } from './modules/cart.js';
import { initMobileNav } from './modules/mobile-nav.js';
import { initPhotoCarousel } from './modules/photo-carousel.js';
import { initReviewCarousel } from './modules/review-carousel.js';
import { initVideoAutoplay } from './modules/video-autoplay.js';

const header = document.querySelector('[data-site-header]');
if (header) initMobileNav(header);

document.querySelectorAll('[data-carousel]').forEach(initPhotoCarousel);

const reviewsRoot = document.querySelector('[data-reviews]');
if (reviewsRoot) initReviewCarousel(reviewsRoot, REVIEWS);

const reels = document.querySelector('[data-video-reels]');
if (reels) initVideoAutoplay(reels);

initCart();

/**
 * Automatycznie odtwarza (bez dźwięku) pierwszy widoczny film z paska,
 * pozostałe wstrzymuje. Pliki wideo mają preload="none", więc pobierają się
 * dopiero wtedy, gdy film faktycznie pojawi się na ekranie.
 */

const VISIBLE_RATIO = 0.6;

export function initVideoAutoplay(container) {
  const videos = [...container.querySelectorAll('video')];
  if (videos.length === 0 || !('IntersectionObserver' in window)) return;

  const visible = new Set();

  const play = (video) => video.play().catch(() => {
    /* Autoodtwarzanie zablokowane przez przeglądarkę – zostają kontrolki. */
  });

  const update = () => {
    const active = document.hidden ? null : videos.find((video) => visible.has(video));
    videos.forEach((video) => (video === active ? play(video) : video.pause()));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
      if (isIntersecting && intersectionRatio >= VISIBLE_RATIO) visible.add(target);
      else visible.delete(target);
    });
    update();
  }, { threshold: [0, VISIBLE_RATIO, 1] });

  videos.forEach((video) => {
    video.muted = true; // wymagane przez przeglądarki do autoodtwarzania
    observer.observe(video);
  });

  document.addEventListener('visibilitychange', update);
}

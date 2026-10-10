import { bindOnce } from './bind';

export function initAnimateOnScroll() {
  const animated = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]')).filter((element) =>
    bindOnce(element, 'animate'),
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    animated.forEach((element) => element.classList.add('is-visible'));
  } else if (animated.length > 0) {
    const observers = new Map<number, IntersectionObserver>();

    animated.forEach((element) => {
      const threshold = Number(element.dataset.animateThreshold ?? '0.1');
      const observer =
        observers.get(threshold) ??
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const target = entry.target as HTMLElement;
              const delay = Number(target.dataset.animateDelay ?? '0');
              setTimeout(() => target.classList.add('is-visible'), delay);
              observer.unobserve(target);
            });
          },
          { threshold },
        );

      observers.set(threshold, observer);
      observer.observe(element);
    });
  }
}

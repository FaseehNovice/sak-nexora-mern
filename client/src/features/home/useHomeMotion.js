import { useEffect } from 'react';

export default function useHomeMotion(setSector) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('[data-home-hero]');
    const revealElements = [...document.querySelectorAll('[data-reveal]')];
    const revealAll = () => revealElements.forEach((element) => { element.dataset.revealed = 'true'; });
    let revealObserver;
    let sectorObserver;
    let fallbackTimer;
    let cleanupHero = null;
    let pointerFrame = 0;
    const tiltFrames = new Map();
    const tilts = [];
    const heroLayers = hero ? [...hero.querySelectorAll('[data-depth]')] : [];
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    revealElements.forEach((element, index) => {
      element.dataset.revealed = 'false';
      element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 75}ms`);
    });
    document.documentElement.classList.add('motion-ready');

    const introFrame = window.requestAnimationFrame(() => hero?.classList.add('hero-intro'));
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealAll();
    } else {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.revealed = 'true';
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealElements.forEach((element) => revealObserver.observe(element));
      fallbackTimer = window.setTimeout(revealAll, 1800);
    }

    const stories = [...document.querySelectorAll('[data-sector-index]')];
    if ('IntersectionObserver' in window && stories.length) {
      sectorObserver = new IntersectionObserver((entries) => {
        const current = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setSector(Number(current.target.dataset.sectorIndex));
      }, { threshold: [0.15, 0.35, 0.6], rootMargin: '-25% 0px -45% 0px' });
      stories.forEach((story) => sectorObserver.observe(story));
    }

    if (finePointer && !reducedMotion && hero && heroLayers.length) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let active = false;
      const animateLayers = () => {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        heroLayers.forEach((layer) => {
          const depth = Number(layer.dataset.depth) || 0;
          layer.style.transform = `translate3d(${currentX * depth * 26}px, ${currentY * depth * 22}px, 0)`;
        });
        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
          pointerFrame = window.requestAnimationFrame(animateLayers);
        } else active = false;
      };
      const moveHero = (event) => {
        const bounds = hero.getBoundingClientRect();
        targetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        targetY = (event.clientY - bounds.top) / bounds.height - 0.5;
        if (!active) {
          active = true;
          pointerFrame = window.requestAnimationFrame(animateLayers);
        }
      };
      const resetHero = () => {
        targetX = 0;
        targetY = 0;
        if (!active) {
          active = true;
          pointerFrame = window.requestAnimationFrame(animateLayers);
        }
      };
      hero.addEventListener('pointermove', moveHero);
      hero.addEventListener('pointerleave', resetHero);
      hero.dataset.parallaxReady = 'true';
      cleanupHero = () => {
        hero.removeEventListener('pointermove', moveHero);
        hero.removeEventListener('pointerleave', resetHero);
        delete hero.dataset.parallaxReady;
      };

      document.querySelectorAll('[data-tilt]').forEach((card) => {
        const moveCard = (event) => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          const frame = window.requestAnimationFrame(() => {
            card.style.setProperty('--tilt-x', `${(0.5 - y) * 2.2}deg`);
            card.style.setProperty('--tilt-y', `${(x - 0.5) * 2.2}deg`);
            card.style.setProperty('--pointer-x', `${x * 100}%`);
            card.style.setProperty('--pointer-y', `${y * 100}%`);
          });
          tiltFrames.set(card, frame);
        };
        const resetCard = () => {
          const frame = tiltFrames.get(card);
          if (frame) window.cancelAnimationFrame(frame);
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
          card.style.setProperty('--pointer-x', '50%');
          card.style.setProperty('--pointer-y', '50%');
        };
        card.addEventListener('pointermove', moveCard);
        card.addEventListener('pointerleave', resetCard);
        tilts.push(() => {
          card.removeEventListener('pointermove', moveCard);
          card.removeEventListener('pointerleave', resetCard);
          resetCard();
        });
      });
    }

    return () => {
      window.cancelAnimationFrame(introFrame);
      window.cancelAnimationFrame(pointerFrame);
      window.clearTimeout(fallbackTimer);
      revealObserver?.disconnect();
      sectorObserver?.disconnect();
      cleanupHero?.();
      heroLayers.forEach((layer) => { layer.style.transform = ''; });
      tilts.forEach((cleanup) => cleanup());
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);
}

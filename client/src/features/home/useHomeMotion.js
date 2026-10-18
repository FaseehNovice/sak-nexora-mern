import { useEffect } from 'react';

export default function useHomeMotion(setSector) {
  useEffect(() => {
    const doc = document;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const M = window.Motion;
    const ease = [0.22, 1, 0.36, 1];
    const $$ = (sel, root) => Array.prototype.slice.call((root || doc).querySelectorAll(sel));

    /* ---------- Scroll reveals --------------------------------------------- */
    const revealAll = () => {
      $$('[data-reveal], [data-unmask]').forEach((el) => el.classList.add('is-revealed'));
    };

    let io;
    let settleTimer;
    if (!('IntersectionObserver' in window) || reduce) {
      revealAll();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            en.target.classList.add('is-revealed');
            io.unobserve(en.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );

      $$('[data-reveal], [data-unmask]').forEach((el) => {
        if (el.closest('[hidden]')) {
          el.classList.add('is-revealed');
          return;
        }
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add('is-revealed');
          return;
        }
        io.observe(el);
      });

      const settle = () => {
        $$('[data-reveal]:not(.is-revealed), [data-unmask]:not(.is-revealed)').forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-revealed');
            if (io) io.unobserve(el);
          }
        });
      };
      window.addEventListener('scroll', () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 140);
      }, { passive: true });
      window.addEventListener('load', settle);
      setTimeout(revealAll, 5000);
    }

    /* ---------- Hero entrance & parallax ----------------------------------- */
    const hero = doc.querySelector('[data-hero]');
    let heroRaf = 0;
    let heroCleanups = [];

    if (hero) {
      if (reduce || !M) {
        hero.classList.add('is-entered');
      } else {
        requestAnimationFrame(() => hero.classList.add('is-entered'));

        const halo = hero.querySelector('.hero__halo');
        if (halo) {
          M.animate(halo, { opacity: [0, 1], scale: [0.5, 1] }, { duration: 1.4, delay: 0.2, ease });
        }
        $$('.hero__p', hero).forEach((p, i) => {
          M.animate(
            p,
            { opacity: [0, 1], y: [120, 0], rotate: [i === 1 ? -10 : 8, 0] },
            { type: 'spring', visualDuration: 1.2, bounce: 0.25, delay: 0.35 + i * 0.16 }
          );
        });
        const medal = hero.querySelector('.hero__medal');
        if (medal) {
          M.animate(medal, { opacity: [0, 1], scale: [0.4, 1], rotate: [-90, 0] }, { type: 'spring', visualDuration: 1.1, bounce: 0.3, delay: 0.9 });
        }
        $$('.hero__tag', hero).forEach((tag, i) => {
          M.animate(tag, { opacity: [0, 1], scale: [0.7, 1] }, { type: 'spring', visualDuration: 0.7, bounce: 0.4, delay: 1.25 + i * 0.2 });
        });
      }

      const stage = doc.querySelector('[data-hero-stage]');
      if (stage && fine && !reduce) {
        const layers = $$('[data-depth]', stage);
        let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
        const tick = () => {
          cx += (tx - cx) * 0.08;
          cy += (ty - cy) * 0.08;
          layers.forEach((l) => {
            const d = parseFloat(l.getAttribute('data-depth')) || 0;
            l.style.translate = `${(cx * d * 26).toFixed(2)}px ${(cy * d * 18).toFixed(2)}px`;
          });
          if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
            heroRaf = requestAnimationFrame(tick);
          } else {
            running = false;
          }
        };

        const onPointerMove = (e) => {
          const r = hero.getBoundingClientRect();
          tx = (e.clientX - r.left) / r.width - 0.5;
          ty = (e.clientY - r.top) / r.height - 0.5;
          if (!running) {
            running = true;
            heroRaf = requestAnimationFrame(tick);
          }
        };
        const onPointerLeave = () => {
          tx = 0;
          ty = 0;
          if (!running) {
            running = true;
            heroRaf = requestAnimationFrame(tick);
          }
        };

        hero.addEventListener('pointermove', onPointerMove);
        hero.addEventListener('pointerleave', onPointerLeave);
        heroCleanups.push(() => {
          hero.removeEventListener('pointermove', onPointerMove);
          hero.removeEventListener('pointerleave', onPointerLeave);
        });

        if (M) {
          const drift = (sel, kf) => {
            const el = stage.querySelector(sel);
            if (el) {
              try {
                M.scroll(M.animate(el, kf, { ease: 'linear' }), { target: hero, offset: ['start start', 'end start'] });
              } catch (_) {}
            }
          };
          drift('.hero__p--oval', { y: [0, -120] });
          drift('.hero__p--navy', { y: [0, -60], rotate: [0, -5] });
          drift('.hero__p--trolley', { y: [0, 50], rotate: [0, 4] });
          drift('.hero__medal', { y: [0, -170], rotate: [0, 60] });
          drift('.hero__hex', { rotate: [0, 30], scale: [1, 1.15] });
          const copy = hero.querySelector('.hero__copy');
          if (copy) {
            try {
              M.scroll(M.animate(copy, { y: [0, 90], opacity: [1, 0.1] }, { ease: 'linear' }), { target: hero, offset: ['start start', 'end start'] });
            } catch (_) {}
          }
        }
      }
    }

    /* ---------- Floating tags loop ----------------------------------------- */
    if (M && !reduce) {
      $$('[data-float]').forEach((el, i) => {
        try {
          M.animate(el, { y: [0, -10, 0] }, { duration: 4.6 + i, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 0.6 });
        } catch (_) {}
      });
    }

    /* ---------- Sectors: active index follows scroll ----------------------- */
    let sio;
    const dots = $$('[data-sector-dot]');
    if (dots.length && 'IntersectionObserver' in window) {
      sio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const n = e.target.getAttribute('data-sector');
            dots.forEach((d) => d.classList.toggle('is-active', d.getAttribute('data-sector-dot') === n));
            if (setSector && n) setSector(Number(n));
          });
        },
        { rootMargin: '-45% 0px -45% 0px' }
      );
      $$('[data-sector]').forEach((s) => sio.observe(s));
      dots[0]?.classList.add('is-active');
    }

    /* ---------- Steps line draws with scroll ------------------------------- */
    const fill = doc.querySelector('[data-steps-fill]');
    if (fill && M && !reduce) {
      try {
        const stepsHost = fill.closest('[data-steps]');
        if (stepsHost) {
          M.scroll(M.animate(fill, { scaleX: [0, 1] }, { ease: 'linear' }), {
            target: stepsHost,
            offset: ['start 75%', 'center center']
          });
        }
      } catch (_) {}
    }

    /* ---------- 3D Tilt on Cards ------------------------------------------- */
    const tiltCleanups = [];
    if (fine && !reduce) {
      $$('[data-tilt]').forEach((card) => {
        let raf = 0;
        const onMove = (e) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            card.style.setProperty('--tilt-x', `${((0.5 - py) * 6).toFixed(2)}deg`);
            card.style.setProperty('--tilt-y', `${((px - 0.5) * 8).toFixed(2)}deg`);
            card.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
            card.classList.add('is-tilting');
          });
        };
        const onLeave = () => {
          cancelAnimationFrame(raf);
          card.classList.remove('is-tilting');
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
        };

        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
        tiltCleanups.push(() => {
          cancelAnimationFrame(raf);
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
        });
      });

      /* ---------- Magnetic buttons ----------------------------------------- */
      $$('[data-magnetic]').forEach((btn) => {
        const onMove = (e) => {
          btn.classList.remove('is-returning');
          const r = btn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const x = Math.max(-8, Math.min(8, dx * 0.22));
          const y = Math.max(-6, Math.min(6, dy * 0.32));
          btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        };
        const onLeave = () => {
          btn.classList.add('is-returning');
          btn.style.translate = '0px 0px';
        };
        const onTransitionEnd = (e) => {
          if (e.propertyName === 'translate') btn.classList.remove('is-returning');
        };
        btn.addEventListener('pointermove', onMove);
        btn.addEventListener('pointerleave', onLeave);
        btn.addEventListener('transitionend', onTransitionEnd);
        tiltCleanups.push(() => {
          btn.removeEventListener('pointermove', onMove);
          btn.removeEventListener('pointerleave', onLeave);
          btn.removeEventListener('transitionend', onTransitionEnd);
          btn.classList.remove('is-returning');
        });
      });
    }

    return () => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(heroRaf);
      if (io) io.disconnect();
      if (sio) sio.disconnect();
      heroCleanups.forEach((c) => c());
      tiltCleanups.forEach((c) => c());
    };
  }, [setSector]);
}

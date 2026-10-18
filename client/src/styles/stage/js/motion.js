/**
 * SAK Nexora motion layer — Motion 11 (motion.dev) over a CSS reveal system.
 *
 * Reveals are CSS (IntersectionObserver adds .is-revealed) with a safety net,
 * so a stalled script never leaves content invisible. Motion adds the hero
 * sequence, scroll-linked parallax/zoom, the steps line and the progress bar.
 * Pointer effects (depth, tilt, magnetic buttons) are plain rAF.
 *
 * Motion 11 traps: inView passes an IntersectionObserverEntry; scroll(cb)
 * passes (progress, info); a throw inside Motion's frame loop freezes every
 * running animation — so nothing optional runs inside it.
 */
(function () {
	'use strict';

	var doc = document;
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	var M = window.Motion;
	var ease = [0.22, 1, 0.36, 1];
	var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };

	/* ---------- Scroll reveals --------------------------------------------- */

	function revealAll() { $$('[data-reveal], [data-unmask]').forEach(function (el) { el.classList.add('is-revealed'); }); }

	if (!('IntersectionObserver' in window) || reduce) {
		revealAll();
	} else {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) { return; }
				en.target.classList.add('is-revealed');
				io.unobserve(en.target);
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

		$$('[data-reveal], [data-unmask]').forEach(function (el) {
			if (el.closest('[hidden]')) { el.classList.add('is-revealed'); return; }
			if (el.getBoundingClientRect().top < window.innerHeight * 0.9) { el.classList.add('is-revealed'); return; }
			io.observe(el);
		});

		// Safety net: anything the viewport has passed is settled.
		var settle = function () {
			$$('[data-reveal]:not(.is-revealed), [data-unmask]:not(.is-revealed)').forEach(function (el) {
				if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('is-revealed'); io.unobserve(el); }
			});
		};
		var st;
		window.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(settle, 140); }, { passive: true });
		window.addEventListener('load', settle);
		setTimeout(revealAll, 7000);
		// Rails revealed inside a tab that was hidden at load.
		doc.addEventListener('click', function (e) { if (e.target.closest('[role="tab"]')) { setTimeout(settle, 30); } });
	}

	/* ---------- Hero entrance ------------------------------------------------- */

	$$('[data-hero]').forEach(function (hero) {
		if (reduce || !M) { hero.classList.add('is-entered'); return; }
		requestAnimationFrame(function () { hero.classList.add('is-entered'); });

		var halo = hero.querySelector('.hero__halo');
		if (halo) { M.animate(halo, { opacity: [0, 1], scale: [0.5, 1] }, { duration: 1.4, delay: 0.2, ease: ease }); }
		$$('.hero__p', hero).forEach(function (p, i) {
			M.animate(p, { opacity: [0, 1], y: [120, 0], rotate: [i === 1 ? -10 : 8, 0] },
				{ type: 'spring', visualDuration: 1.2, bounce: 0.25, delay: 0.35 + i * 0.16 });
		});
		var medal = hero.querySelector('.hero__medal');
		if (medal) { M.animate(medal, { opacity: [0, 1], scale: [0.4, 1], rotate: [-90, 0] }, { type: 'spring', visualDuration: 1.1, bounce: 0.3, delay: 0.9 }); }
		$$('.hero__tag', hero).forEach(function (tag, i) {
			M.animate(tag, { opacity: [0, 1], scale: [0.7, 1] }, { type: 'spring', visualDuration: 0.7, bounce: 0.4, delay: 1.25 + i * 0.2 });
		});
	});

	/* ---------- Header: tuck on scroll down, return on scroll up -------------- */

	var header = doc.querySelector('[data-header]');
	if (header && !reduce) {
		var lastY = window.scrollY, q = false;
		window.addEventListener('scroll', function () {
			if (q) { return; }
			q = true;
			requestAnimationFrame(function () {
				q = false;
				var y = window.scrollY;
				var busy = doc.querySelector('.has-mega.is-open, .drawer.is-open');
				if (y < 480 || y < lastY - 6) { header.classList.remove('is-tucked'); lastY = y; }
				else if (y > lastY + 6) { if (!busy) { header.classList.add('is-tucked'); } lastY = y; }
			});
		}, { passive: true });
	}

	/* ---------- Scroll progress ------------------------------------------------- */

	var bar = doc.createElement('div');
	bar.className = 'scroll-progress';
	bar.setAttribute('aria-hidden', 'true');
	doc.body.appendChild(bar);
	if (M && !reduce) { M.scroll(M.animate(bar, { scaleX: [0, 1] }, { ease: 'linear' })); }

	/* ---------- Floating WhatsApp ------------------------------------------------ */

	var wa = doc.querySelector('[data-wa-float]');
	if (wa) {
		var showWa = function () { wa.classList.toggle('is-visible', window.scrollY > 300); };
		window.addEventListener('scroll', showWa, { passive: true });
		showWa();
		setTimeout(function () { wa.classList.add('is-visible'); }, 4500);
	}

	/* ---------- Sectors: active index follows the panel in view ------------------- */

	var dots = $$('[data-sector-dot]');
	if (dots.length && 'IntersectionObserver' in window) {
		var sio = new IntersectionObserver(function (es) {
			es.forEach(function (e) {
				if (!e.isIntersecting) { return; }
				var n = e.target.getAttribute('data-sector');
				dots.forEach(function (d) { d.classList.toggle('is-active', d.getAttribute('data-sector-dot') === n); });
			});
		}, { rootMargin: '-45% 0px -45% 0px' });
		$$('[data-sector]').forEach(function (s) { sio.observe(s); });
		dots[0].classList.add('is-active');
	}

	if (reduce || !M) { return; }

	/* ---------- Floating tags --------------------------------------------------- */

	$$('[data-float]').forEach(function (el, i) {
		M.animate(el, { y: [0, -10, 0] }, { duration: 4.6 + i, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 0.6 });
	});

	/* ---------- Hero: pointer depth + scroll drift --------------------------------- */

	var stage = doc.querySelector('[data-hero-stage]');
	if (stage) {
		var heroEl = stage.closest('[data-hero]');
		var layers = $$('[data-depth]', stage);
		if (fine) {
			var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
			var tick = function () {
				cx += (tx - cx) * 0.08;
				cy += (ty - cy) * 0.08;
				layers.forEach(function (l) {
					var d = parseFloat(l.getAttribute('data-depth')) || 0;
					l.style.translate = (cx * d * 26).toFixed(2) + 'px ' + (cy * d * 18).toFixed(2) + 'px';
				});
				if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) { requestAnimationFrame(tick); } else { running = false; }
			};
			heroEl.addEventListener('pointermove', function (e) {
				var r = heroEl.getBoundingClientRect();
				tx = (e.clientX - r.left) / r.width - 0.5;
				ty = (e.clientY - r.top) / r.height - 0.5;
				if (!running) { running = true; requestAnimationFrame(tick); }
			});
			heroEl.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!running) { running = true; requestAnimationFrame(tick); } });
		}
		var drift = function (sel, kf) {
			var el = stage.querySelector(sel);
			if (el) { M.scroll(M.animate(el, kf, { ease: 'linear' }), { target: heroEl, offset: ['start start', 'end start'] }); }
		};
		drift('.hero__p--oval', { y: [0, -120] });
		drift('.hero__p--navy', { y: [0, -60], rotate: [0, -5] });
		drift('.hero__p--trolley', { y: [0, 50], rotate: [0, 4] });
		drift('.hero__medal', { y: [0, -170], rotate: [0, 60] });
		drift('.hero__hex', { rotate: [0, 30], scale: [1, 1.15] });
		var copy = heroEl.querySelector('.hero__copy');
		if (copy) { M.scroll(M.animate(copy, { y: [0, 90], opacity: [1, 0.1] }, { ease: 'linear' }), { target: heroEl, offset: ['start start', 'end start'] }); }
	}

	/* ---------- Image zoom settle + parallax frames ---------------------------------- */

	$$('[data-zoom]').forEach(function (img) {
		var host = img.closest('[data-unmask]') || img.parentElement;
		M.scroll(M.animate(img, { scale: [1.2, 1] }, { ease: 'linear' }), { target: host, offset: ['start end', 'center center'] });
	});
	$$('[data-parallax-img]').forEach(function (frame) {
		var img = frame.querySelector('img');
		if (img && !img.hasAttribute('data-zoom')) {
			M.scroll(M.animate(img, { y: ['-7%', '7%'] }, { ease: 'linear' }), { target: frame, offset: ['start end', 'end start'] });
		}
	});

	/* ---------- Steps line draws with scroll ------------------------------------------- */

	var fill = doc.querySelector('[data-steps-fill]');
	if (fill) {
		M.scroll(M.animate(fill, { scaleX: [0, 1] }, { ease: 'linear' }), { target: fill.closest('[data-steps]'), offset: ['start 75%', 'center center'] });
	}

	/* ---------- Marquee: steady drift, scroll speed adds a kick ---------------------- */

	var rows = $$('[data-marquee]');
	if (rows.length) {
		var state = rows.map(function (row) {
			return { row: row, dir: parseFloat(row.getAttribute('data-marquee')) || -1, x: 0, w: 0 };
		});
		var vel = 0, prevY = window.scrollY, visible = false;
		window.addEventListener('scroll', function () {
			var y = window.scrollY;
			vel = Math.max(-40, Math.min(40, vel + (y - prevY) * 0.15));
			prevY = y;
		}, { passive: true });
		var loop = function () {
			if (!visible) { return; }
			vel *= 0.92;
			state.forEach(function (s) {
				if (!s.w) { s.w = s.row.firstElementChild.offsetWidth; }
				s.x += s.dir * (0.7 + Math.abs(vel) * 0.14);
				if (s.x <= -s.w) { s.x += s.w; }
				if (s.x > 0) { s.x -= s.w; }
				s.row.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,0,0)';
			});
			requestAnimationFrame(loop);
		};
		var mio = new IntersectionObserver(function (es) {
			var was = visible;
			visible = es.some(function (e) { return e.isIntersecting; });
			if (visible && !was) { requestAnimationFrame(loop); }
		});
		rows.forEach(function (r) { mio.observe(r.parentElement); });
	}

	/* ---------- Pointer niceties (desktop only) ------------------------------------- */

	if (!fine) { return; }

	$$('[data-tilt]').forEach(function (card) {
		var raf = 0;
		card.addEventListener('pointermove', function (e) {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(function () {
				var r = card.getBoundingClientRect();
				var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
				card.style.setProperty('--tilt-x', ((0.5 - py) * 6).toFixed(2) + 'deg');
				card.style.setProperty('--tilt-y', ((px - 0.5) * 8).toFixed(2) + 'deg');
				card.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
				card.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
				card.classList.add('is-tilting');
			});
		});
		card.addEventListener('pointerleave', function () {
			cancelAnimationFrame(raf);
			card.classList.remove('is-tilting');
			card.style.setProperty('--tilt-x', '0deg');
			card.style.setProperty('--tilt-y', '0deg');
		});
	});

	$$('[data-magnetic]').forEach(function (btn) {
		btn.addEventListener('pointermove', function (e) {
			var r = btn.getBoundingClientRect();
			btn.style.translate = ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + 'px';
		});
		btn.addEventListener('pointerleave', function () {
			M.animate(btn, { translate: '0px 0px' }, { type: 'spring', visualDuration: 0.5, bounce: 0.5 });
		});
	});
})();

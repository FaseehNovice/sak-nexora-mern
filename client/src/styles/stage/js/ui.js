/**
 * Small UI behaviours: tabs, drag rails, item gallery, quantity steppers,
 * cutlery finish switcher, contact form checks. No dependencies. Deferred.
 */
(function () {
	'use strict';

	var doc = document;
	var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };

	/* ---------- Tabs (featured rail) with a sliding ink --------------------- */

	$$('[data-tabs]').forEach(function (bar) {
		var tabs = $$('[role="tab"]', bar);
		var ink = bar.querySelector('.tabs__ink');
		function place(tab) {
			if (!ink) { return; }
			ink.style.width = tab.offsetWidth + 'px';
			ink.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
		}
		function select(tab) {
			tabs.forEach(function (t) {
				var on = t === tab;
				t.setAttribute('aria-selected', String(on));
				t.tabIndex = on ? 0 : -1;
				var panel = doc.getElementById(t.getAttribute('aria-controls'));
				if (panel) {
					panel.hidden = !on;
					if (on) { panel.querySelector('[data-rail]').scrollLeft = 0; }
				}
			});
			place(tab);
		}
		bar.addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) { select(t); } });
		bar.addEventListener('keydown', function (e) {
			var i = tabs.indexOf(doc.activeElement);
			if (i < 0) { return; }
			var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
			if (n === null) { return; }
			e.preventDefault();
			var next = tabs[(n + tabs.length) % tabs.length];
			next.focus(); select(next);
		});
		var current = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
		window.addEventListener('load', function () { place(current); });
		window.addEventListener('resize', function () { place(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]); });
		place(current);
	});

	/* ---------- Rails: drag to scroll on desktop + arrow buttons ------------ */

	$$('[data-rail]').forEach(function (track) {
		var down = false, moved = false, startX = 0, startL = 0;
		track.addEventListener('pointerdown', function (e) {
			if (e.pointerType !== 'mouse') { return; }
			down = true; moved = false; startX = e.clientX; startL = track.scrollLeft;
		});
		window.addEventListener('pointermove', function (e) {
			if (!down) { return; }
			var dx = e.clientX - startX;
			if (Math.abs(dx) > 5) { moved = true; track.classList.add('is-dragging'); }
			track.scrollLeft = startL - dx;
		});
		window.addEventListener('pointerup', function () {
			if (!down) { return; }
			down = false;
			setTimeout(function () { track.classList.remove('is-dragging'); }, 0);
		});
		track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

		var host = track.closest('.rail');
		var step = function (dir) {
			var card = track.querySelector('.card, .rail__more');
			track.scrollBy({ left: dir * ((card ? card.offsetWidth : 300) + 18) * 2, behavior: 'smooth' });
		};
		var prev = host && host.querySelector('[data-rail-prev]');
		var next = host && host.querySelector('[data-rail-next]');
		if (prev) { prev.addEventListener('click', function () { step(-1); }); }
		if (next) { next.addEventListener('click', function () { step(1); }); }
	});

	/* ---------- Item gallery: thumbs, arrows, swipe, keys ---------------------- */

	$$('[data-gallery]').forEach(function (g) {
		var slides = $$('[data-slide]', g);
		var thumbs = $$('[data-thumb]', g);
		if (slides.length < 2) { return; }
		var cur = 0;
		function show(i) {
			cur = (i + slides.length) % slides.length;
			slides.forEach(function (s, n) { s.classList.toggle('is-active', n === cur); s.setAttribute('aria-hidden', String(n !== cur)); });
			thumbs.forEach(function (t, n) {
				t.classList.toggle('is-active', n === cur);
				t.setAttribute('aria-selected', String(n === cur));
				if (n === cur) { t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }
			});
		}
		thumbs.forEach(function (t, n) { t.addEventListener('click', function () { show(n); }); });
		var p = g.querySelector('[data-gal-prev]'), nx = g.querySelector('[data-gal-next]');
		if (p) { p.addEventListener('click', function () { show(cur - 1); }); }
		if (nx) { nx.addEventListener('click', function () { show(cur + 1); }); }
		g.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { show(cur - 1); }
			if (e.key === 'ArrowRight') { show(cur + 1); }
		});
		var sx = null;
		var main = g.querySelector('.item__main');
		main.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
		main.addEventListener('touchend', function (e) {
			if (sx === null) { return; }
			var dx = e.changedTouches[0].clientX - sx;
			if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); }
			sx = null;
		});
	});

	/* ---------- Quantity stepper on the item page ------------------------------ */

	$$('[data-qty-step]').forEach(function (b) {
		b.addEventListener('click', function () {
			var input = b.parentElement.querySelector('input');
			input.value = Math.max(1, Math.min(100000, (parseInt(input.value, 10) || 1) + parseInt(b.getAttribute('data-qty-step'), 10)));
		});
	});

	/* ---------- Cutlery finish switcher ----------------------------------------- */

	$$('[data-finishes]').forEach(function (root) {
		var sw = $$('[data-finish]', root);
		var imgs = $$('[data-finish-img]', root);
		var link = root.querySelector('[data-finish-link]');
		var auto;
		function pick(i, user) {
			sw.forEach(function (s, n) { s.classList.toggle('is-active', n === i); s.setAttribute('aria-checked', String(n === i)); });
			imgs.forEach(function (im, n) { im.classList.toggle('is-active', n === i); });
			if (link && user) { link.href = sw[i].getAttribute('data-href'); }
			if (user) { clearInterval(auto); }
		}
		sw.forEach(function (s, n) { s.addEventListener('click', function () { pick(n, true); }); });
		root.querySelector('.swatches').addEventListener('keydown', function (e) {
			var i = sw.indexOf(doc.activeElement);
			if (i < 0) { return; }
			var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
			if (n === null) { return; }
			e.preventDefault();
			n = (n + sw.length) % sw.length;
			sw[n].focus(); pick(n, true);
		});
		// Gentle auto-cycle while in view, stops for good on the first click.
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
			var i = 0;
			new IntersectionObserver(function (es) {
				clearInterval(auto);
				if (es[0].isIntersecting && !root.dataset.touched) {
					auto = setInterval(function () { i = (i + 1) % sw.length; pick(i, false); }, 2800);
				}
			}, { threshold: 0.4 }).observe(root);
			root.addEventListener('pointerdown', function () { root.dataset.touched = '1'; clearInterval(auto); });
		}
	});

	/* ---------- Enquiry form: friendly checks before the server's ---------------- */

	var form = doc.querySelector('[data-enquiry-form]');
	if (form) {
		form.addEventListener('submit', function (e) {
			var bad = [];
			var name = form.querySelector('[name="sak_name"]');
			var phone = form.querySelector('[name="sak_phone"]');
			var email = form.querySelector('[name="sak_email"]');
			var msg = form.querySelector('[name="sak_message"]');
			var list = form.querySelector('[data-list-field]');
			var hasList = list && list.value && list.value !== '[]';
			var digits = phone.value.replace(/\D+/g, '');
			if (name.value.trim().length < 2) { bad.push(name); }
			if (digits.length < 10 || digits.length > 15) { bad.push(phone); }
			if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { bad.push(email); }
			if (!hasList && msg.value.trim().length < 10) { bad.push(msg); }
			$$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
			if (bad.length) {
				e.preventDefault();
				bad.forEach(function (el) { el.closest('.field').classList.add('has-error'); el.setAttribute('aria-invalid', 'true'); });
				bad[0].focus();
			}
		});
	}
})();

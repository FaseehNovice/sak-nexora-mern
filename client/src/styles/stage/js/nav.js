/**
 * Header state, catalogue mega panel, mobile drawer (focus-trapped).
 * No dependencies. Deferred.
 */
(function () {
	'use strict';

	var doc = document;

	/* ---------- Sticky header: two thresholds so it never flickers ---------- */

	var header = doc.querySelector('[data-header]');
	if (header) {
		var stuck = false, queued = false;
		var read = function () {
			queued = false;
			var y = window.scrollY;
			var should = stuck ? y > 24 : y > 80;
			if (should !== stuck) { stuck = should; header.classList.toggle('is-stuck', stuck); }
		};
		window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(read); } }, { passive: true });
		read();
	}

	/* ---------- Mega panel: hover with intent delay, click + keyboard ------- */

	var mega = doc.querySelector('.has-mega');
	if (mega) {
		var toggle = mega.querySelector('[data-mega-toggle]');
		var openT, closeT;
		var setOpen = function (open) {
			mega.classList.toggle('is-open', open);
			toggle.setAttribute('aria-expanded', String(open));
		};
		var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
		mega.addEventListener('pointerenter', function () {
			if (!fine.matches) { return; }
			clearTimeout(closeT);
			openT = setTimeout(function () { setOpen(true); }, 90);
		});
		mega.addEventListener('pointerleave', function () {
			clearTimeout(openT);
			closeT = setTimeout(function () { setOpen(false); }, 220);
		});
		toggle.addEventListener('click', function () { setOpen(!mega.classList.contains('is-open')); });
		doc.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && mega.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
		});
		doc.addEventListener('click', function (e) { if (!mega.contains(e.target)) { setOpen(false); } });
		mega.addEventListener('focusout', function (e) { if (!mega.contains(e.relatedTarget)) { setOpen(false); } });
	}

	/* ---------- Generic drawer (menu + enquiry list) ------------------------ */

	function drawer(root, openSel, closeSel) {
		if (!root) { return null; }
		var panel = root.querySelector('.drawer__panel');
		var lastFocus = null;
		var openers = function () { return doc.querySelectorAll(openSel); };

		function focusables() {
			return Array.prototype.filter.call(
				panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
				function (el) { return el.offsetParent !== null; }
			);
		}
		function trap(e) {
			if (e.key === 'Escape') { close(); return; }
			if (e.key !== 'Tab') { return; }
			var f = focusables();
			if (!f.length) { return; }
			if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
			else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
		}
		function open() {
			lastFocus = doc.activeElement;
			root.hidden = false;
			requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-open'); }); });
			doc.documentElement.style.overflow = 'hidden';
			Array.prototype.forEach.call(openers(), function (b) { b.setAttribute('aria-expanded', 'true'); });
			doc.addEventListener('keydown', trap);
			setTimeout(function () { var f = focusables(); if (f.length) { f[0].focus(); } }, 60);
			root.dispatchEvent(new CustomEvent('drawer:open'));
		}
		function close() {
			root.classList.remove('is-open');
			doc.documentElement.style.overflow = '';
			Array.prototype.forEach.call(openers(), function (b) { b.setAttribute('aria-expanded', 'false'); });
			doc.removeEventListener('keydown', trap);
			setTimeout(function () { root.hidden = true; }, 420);
			if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
		}
		doc.addEventListener('click', function (e) {
			if (e.target.closest(openSel)) { e.preventDefault(); open(); }
			else if (e.target.closest(closeSel)) { close(); }
		});
		return { open: open, close: close };
	}

	drawer(doc.querySelector('[data-drawer]'), '[data-drawer-open]', '[data-drawer-close]');
	window.saknListDrawer = drawer(doc.querySelector('[data-list-drawer]'), '[data-list-open]', '[data-list-close]');
})();

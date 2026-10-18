/**
 * Enquiry list — the site's replacement for a cart.
 *
 * Items live in localStorage (this visitor, this browser only). The list can
 * be sent as one WhatsApp message or attached to the contact form, where the
 * server re-validates every item ID. No prices, no checkout.
 */
(function () {
	'use strict';

	var doc = document;
	var data = window.saknData || { wa: '', i18n: {} };
	var t = data.i18n || {};
	var KEY = 'sakn-list-v1';

	/* ---------- Storage (private mode safe) ---------------------------------- */

	function load() {
		try {
			var raw = JSON.parse(window.localStorage.getItem(KEY) || '[]');
			return Array.isArray(raw) ? raw.filter(function (r) { return r && r.id; }) : [];
		} catch (e) { return []; }
	}
	var list = load();
	function save() {
		try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage blocked: list lives for this page only */ }
		render();
	}
	function find(id) {
		for (var i = 0; i < list.length; i++) { if (String(list[i].id) === String(id)) { return i; } }
		return -1;
	}

	/* ---------- Toast ----------------------------------------------------------- */

	var toast = doc.querySelector('[data-toast]');
	var toastT;
	function say(msg) {
		if (!toast) { return; }
		toast.querySelector('[data-toast-text]').textContent = msg;
		toast.classList.add('is-on');
		clearTimeout(toastT);
		toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2400);
	}

	/* ---------- Add / remove from any [data-add-item] button --------------------- */

	doc.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-add-item]');
		if (!btn) { return; }
		e.preventDefault();
		var id = btn.getAttribute('data-id');
		var i = find(id);
		var qtyInput = btn.hasAttribute('data-with-qty') ? doc.querySelector('[data-item-qty]') : null;
		var qty = qtyInput ? Math.max(1, Math.min(100000, parseInt(qtyInput.value, 10) || 1)) : 1;

		if (i > -1 && !qtyInput) {
			list.splice(i, 1);
			save();
			say(t.removed || 'Removed');
			return;
		}
		if (i > -1) {
			list[i].qty = qty;
		} else {
			list.push({
				id: parseInt(id, 10),
				title: btn.getAttribute('data-title'),
				url: btn.getAttribute('data-url'),
				thumb: btn.getAttribute('data-thumb'),
				qty: qty
			});
		}
		save();
		btn.classList.remove('is-popping'); void btn.offsetWidth; btn.classList.add('is-popping');
		// Bring the tucked header back so the visitor sees the list count change.
		var head = doc.querySelector('[data-header]');
		if (head) { head.classList.remove('is-tucked'); }
		var count = doc.querySelector('[data-list-count]');
		if (count) { count.classList.remove('is-popping'); void count.offsetWidth; count.classList.add('is-popping'); }
		say(t.added || 'Added');
	});

	/* ---------- Drawer rows -------------------------------------------------------- */

	var itemsEl = doc.querySelector('[data-list-items]');
	var emptyEl = doc.querySelector('[data-list-empty]');
	var footEl = doc.querySelector('[data-list-foot]');
	var waEl = doc.querySelector('[data-list-wa]');

	function esc(s) { var d = doc.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
	function icon(path) { return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' + path + '</svg>'; }

	function waText() {
		var lines = [t.waIntro || 'Hi SAK Nexora, I would like a quote for:', ''];
		list.forEach(function (r, n) { lines.push((n + 1) + '. ' + r.title + ' — Qty: ' + r.qty); });
		lines.push('');
		list.forEach(function (r) { lines.push(r.url); });
		return lines.join('\n');
	}

	function render() {
		var total = list.length;
		Array.prototype.forEach.call(doc.querySelectorAll('[data-list-count]'), function (c) {
			c.textContent = total;
			c.classList.toggle('is-zero', !total);
		});
		// Button states everywhere on the page.
		Array.prototype.forEach.call(doc.querySelectorAll('[data-add-item]'), function (b) {
			var inList = find(b.getAttribute('data-id')) > -1;
			b.classList.toggle('is-in', inList);
			if (!b.hasAttribute('data-with-qty')) { b.setAttribute('aria-pressed', String(inList)); }
			var label = b.querySelector('[data-add-label]');
			if (label) { label.textContent = inList ? (t.inList || 'In your list') + ' — update qty' : (t.add || 'Add to enquiry list'); }
		});

		if (itemsEl) {
			itemsEl.innerHTML = list.map(function (r) {
				return '<li class="list-item" data-row="' + esc(r.id) + '">' +
					(r.thumb ? '<img src="' + esc(r.thumb) + '" alt="" width="64" height="64" loading="lazy">' : '<span class="list-item__ph"></span>') +
					'<div><a class="list-item__title" href="' + esc(r.url) + '">' + esc(r.title) + '</a>' +
					'<div class="qty"><button type="button" data-step="-1" aria-label="Fewer">' + icon('<path d="M5 12h14"/>') + '</button>' +
					'<input type="number" min="1" max="100000" value="' + esc(r.qty) + '" aria-label="Quantity for ' + esc(r.title) + '" data-qty-in>' +
					'<button type="button" data-step="1" aria-label="More">' + icon('<path d="M12 5v14M5 12h14"/>') + '</button></div></div>' +
					'<button class="list-item__rm" type="button" data-rm aria-label="Remove ' + esc(r.title) + '">' + icon('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>') + '</button>' +
					'</li>';
			}).join('');
		}
		if (emptyEl) { emptyEl.hidden = total > 0; }
		if (footEl) { footEl.hidden = total === 0; }
		if (waEl) { waEl.href = 'https://wa.me/' + data.wa + '?text=' + encodeURIComponent(waText()); }

		// Contact form: hidden field + visible summary.
		var field = doc.querySelector('[data-list-field]');
		if (field) { field.value = JSON.stringify(list.map(function (r) { return { id: r.id, qty: r.qty }; })); }
		var sum = doc.querySelector('[data-list-summary]');
		if (sum) {
			sum.hidden = !total;
			sum.querySelector('[data-list-summary-items]').innerHTML = list.map(function (r) {
				return '<li>' + esc(r.title) + '<span>× ' + esc(r.qty) + '</span></li>';
			}).join('');
		}
	}

	if (itemsEl) {
		itemsEl.addEventListener('click', function (e) {
			var row = e.target.closest('[data-row]');
			if (!row) { return; }
			var i = find(row.getAttribute('data-row'));
			if (i < 0) { return; }
			var step = e.target.closest('[data-step]');
			if (step) {
				list[i].qty = Math.max(1, Math.min(100000, (parseInt(list[i].qty, 10) || 1) + parseInt(step.getAttribute('data-step'), 10)));
				save();
				var again = itemsEl.querySelector('[data-row="' + list[i].id + '"] [data-step="' + step.getAttribute('data-step') + '"]');
				if (again) { again.focus(); }
			} else if (e.target.closest('[data-rm]')) {
				list.splice(i, 1);
				save();
				say(t.removed || 'Removed');
			}
		});
		itemsEl.addEventListener('change', function (e) {
			if (!e.target.matches('[data-qty-in]')) { return; }
			var i = find(e.target.closest('[data-row]').getAttribute('data-row'));
			if (i > -1) { list[i].qty = Math.max(1, Math.min(100000, parseInt(e.target.value, 10) || 1)); save(); }
		});
	}

	var clear = doc.querySelector('[data-list-clear]');
	if (clear) { clear.addEventListener('click', function () { list = []; save(); }); }

	// Other tabs: keep in sync.
	window.addEventListener('storage', function (e) { if (e.key === KEY) { list = load(); render(); } });

	// Clear the list after a successful form send.
	if (/[?&]enquiry=sent/.test(window.location.search)) { list = []; save(); }

	render();
})();

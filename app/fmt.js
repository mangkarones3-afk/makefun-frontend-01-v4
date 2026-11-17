// fmt.js — every formatter the views share: escaping, grouped
// numbers, money, deadlines, dates, win rates, image URLs, wallets.
// Pure functions only; nothing here touches the network or the DOM.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

function grouped(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

export const num = (v) => grouped(String(Math.trunc(Number(v) || 0)));

// Money arrives as a number or a decimal string; whole dollars when whole.
export function money(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '$0';
  if (Number.isInteger(n)) return '$' + grouped(String(n));
  const [whole, cents] = n.toFixed(2).split('.');
  return '$' + grouped(whole) + '.' + cents;
}

export const feeLabel = (usd) => (Number(usd) > 0 ? money(usd) + ' entry' : 'Free entry');

// "Live" is decided by the deadline itself, never by a status flag.
export function timeLeft(iso, now = Date.now()) {
  const ms = new Date(iso).getTime() - now;
  if (!(ms > 0)) return { text: 'Ended', live: false };
  const m = Math.floor(ms / 60000);
  if (m < 60) return { text: m + 'm left', live: true };
  const h = Math.floor(m / 60);
  if (h < 48) return { text: h + 'h ' + (m % 60) + 'm left', live: true };
  return { text: Math.floor(h / 24) + 'd ' + (h % 24) + 'h left', live: true };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dateUtc(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + hh + ':' + mm + ' UTC';
}

export function clockUtc(d) {
  const t = d ? new Date(d) : new Date();
  return [t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()]
    .map((n) => String(n).padStart(2, '0')).join(':');
}

// Win rates travel as micro-percents: 956066 means 95.6066%.
export const winRate = (micro) => (Number(micro) / 10000).toFixed(1) + '%';

// Only make.fun's own images may load: relative API paths are made
// absolute on make.fun, absolute make.fun URLs pass, the rest drop.
export function imgUrl(p) {
  if (!p) return '';
  if (p.startsWith('/')) return 'https://make.fun' + p;
  return p.startsWith('https://make.fun/') ? p : '';
}

export const shortWallet = (a) => (a ? a.slice(0, 4) + '…' + a.slice(-4) : '—');

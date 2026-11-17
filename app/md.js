// md.js — a small Markdown renderer for bounty briefs and rules.
// The source is escaped before anything else happens, and only a safe
// subset is built back up: headings, paragraphs, lists, rules, bold,
// italic, inline code and http(s) links. Raw HTML in a description
// therefore reaches the page as visible text, never as markup.

import { esc } from './fmt.js';

function inline(text) {
  let s = text;
  s = s.replace(/`([^`]+)`/g, (m, code) => '<code>' + code + '</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, (m, b) => '<strong>' + b + '</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*/g, (m, pre, i) => pre + '<em>' + i + '</em>');
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
    (m, label, href) => '<a href="' + href + '" target="_blank" rel="noopener">' + label + '</a>');
  return s;
}

// Blocks are split on blank lines first, then each block is classified
// whole: a heading, a rule, a list (every line an item) or a paragraph.
export function md(src) {
  const blocks = esc(String(src || '')).split(/\n\s*\n/);
  const html = [];
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trimEnd());
    const first = lines[0] || '';
    const heading = first.match(/^(#{1,4})\s+(.*)$/);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      html.push('<h' + level + '>' + inline(heading[2]) + '</h' + level + '>');
    } else if (/^-{3,}$/.test(first.trim()) && lines.length === 1) {
      html.push('<hr>');
    } else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      html.push('<ul>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*[-*]\s+/, '')) + '</li>').join('') + '</ul>');
    } else if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
      html.push('<ol>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*\d+[.)]\s+/, '')) + '</li>').join('') + '</ol>');
    } else if (first.trim() !== '') {
      html.push('<p>' + lines.map(inline).join('<br>') + '</p>');
    }
  }
  return html.join('\n');
}

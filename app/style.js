// style.js — the views' stylesheet, carried as text and injected as a
// <style> element by the first view that renders. The shell's inline
// CSS covers only the chrome (header, strip, layout), so everything a
// view needs — board rows, the pane, tables, the timeline — arrives
// with the views that use it, never in the first load. It is this
// app's own CSS; no rule loads anything from anywhere.

const CSS = `
.stats{display:flex;gap:8px;flex-wrap:wrap;align-items:baseline;margin:2px 0 10px;color:var(--mut);font-size:13px}
.stats b{color:var(--ink);font-size:15px}
.tools{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.tools input[type=search]{flex:1;min-width:150px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff}
.tools select{padding:7px 8px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff}
.split{display:grid;grid-template-columns:minmax(320px,400px) 1fr;gap:14px;align-items:start}
.board{display:flex;flex-direction:column;gap:8px}
.brow{display:block;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:9px 11px;color:var(--ink)}
.brow:hover{border-color:var(--acc);text-decoration:none}
.brow.sel{border-color:var(--acc);box-shadow:0 0 0 2px var(--acc2)}
.brow .t{font-weight:700;font-size:13.5px;line-height:1.3}
.brow .m{display:flex;gap:10px;flex-wrap:wrap;margin-top:5px;font-size:12.5px;color:var(--mut)}
.brow .m b{color:var(--ink)}
.pot{color:var(--acc);font-weight:800}
.live{color:var(--good);font-weight:700}
.ended{color:var(--bad);font-weight:700}
button.ghost{background:#fff;color:var(--acc)}
.pane{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px;min-height:300px}
.pane h1{font-size:21px;margin:0 0 4px;letter-spacing:-.02em;line-height:1.25}
.pane h2{font-size:14.5px;margin:20px 0 8px}
.sub{color:var(--mut);margin:0 0 6px}
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}
.fact{border:1px solid var(--line);border-radius:9px;padding:8px 10px}
.fact .k{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--mut)}
.fact .v{font-size:16.5px;font-weight:800;margin-top:1px}
.fact .s{font-size:12px;color:var(--mut)}
.tl{margin:2px 0 4px}
.tl-track{height:6px;background:var(--acc2);border-radius:99px}
.tl-fill{height:100%;background:var(--acc);border-radius:99px}
.tl-labels{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:var(--mut);margin-top:4px}
table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;color:var(--mut);font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;padding:5px 8px;border-bottom:1px solid var(--line)}
td{padding:5px 8px;border-bottom:1px solid var(--line);vertical-align:top}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.md{font-size:13.5px;color:#2c2847}
.md h2{font-size:16px;margin:16px 0 6px}
.md h3{font-size:14px;margin:14px 0 4px}
.md p{margin:6px 0}
.md ul,.md ol{margin:6px 0;padding-left:20px}
.md code{background:var(--bg);padding:0 4px;border-radius:4px;font-size:12.5px}
.avatar{border-radius:50%;vertical-align:-7px;margin-right:7px}
.prof-head{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.prof-head img{border-radius:50%}
.more{margin:10px 0}
@media (max-width:900px){.split{grid-template-columns:1fr}.facts{grid-template-columns:repeat(2,1fr)}.cols{grid-template-columns:1fr}}
`;

let applied = false;

export function applyStyle() {
  if (applied) return;
  applied = true;
  const el = document.createElement('style');
  el.id = 'view-style';
  el.textContent = CSS;
  document.head.append(el);
}

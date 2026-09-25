/* ASDLC Capstone Guide renderer. Content lives in data.js and content/*.js.
   Vanilla JS, no build step. Routes are hash based:
     #/start  #/tools  #/harness  #/harness/<componentId>  #/concepts  #/testing  #/primitives
     #/projects  #/p1  #/p1/m2  #/final        (append #anchor to scroll to a section) */
(function () {
  "use strict";

  var G = window.GUIDE || {};
  G.shared = (G.shared || []).filter(function (p) { return p && p.id; });
  G.projects = (G.projects || []).filter(function (p) { return p && p.id; });
  G.shared.forEach(function (p) { p.blocks = p.blocks || []; });
  G.projects.forEach(function (p) { p.milestones = (p.milestones || []).filter(Boolean); });
  G.rubric = G.rubric || [];
  var FINAL = G.final || null;
  if (FINAL) { FINAL.id = FINAL.id || "final"; FINAL.blocks = FINAL.blocks || []; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ storage */
  var KEY = "asdlc-guide-v2";
  var state = { checks: {}, done: {}, project: null };
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) raw = localStorage.getItem("asdlc-guide-v1"); // migrate old progress
      if (raw) {
        var p = JSON.parse(raw) || {};
        state.checks = p.checks || {};
        state.done = p.done || {};
        state.project = p.project || null;
      }
    } catch (e) { /* storage unavailable: keep progress in memory */ }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  load();

  /* ------------------------------------------------------------------ helpers */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Fields that may or may not contain markup: keep markup if present, escape plain text.
  function rich(s) {
    if (s == null) return "";
    s = String(s);
    return /<\/?[a-z][^>]*>|&[a-z#0-9]+;/i.test(s) ? s : esc(s);
  }
  // Plain text of a (possibly HTML) string; entities decoded. <template> parsing loads nothing.
  var TPL = document.createElement("template");
  function strip(s) {
    if (s == null) return "";
    s = String(s);
    if (!/[<&]/.test(s)) return s;
    TPL.innerHTML = s;
    return TPL.content.textContent || "";
  }
  function slug(s) {
    return strip(s).toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "section";
  }
  function arr(x) { return Array.isArray(x) ? x : (x ? [x] : []); }
  function host(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }
  function extA(url, inner, cls) {
    return '<a' + (cls ? ' class="' + cls + '"' : "") + ' href="' + esc(url) + '" target="_blank" rel="noopener">' + inner + "</a>";
  }
  var ARROW = '<span class="ext" aria-hidden="true">↗</span>';
  var CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV = '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ------------------------------------------------------------------ icons for component cards */
  var GLYPH = {
    loop: '<path d="M4 10a6 6 0 0 1 10.2-4.3M16 10a6 6 0 0 1-10.2 4.3"/><path d="M14.5 2.7v3.1h-3.1M5.5 17.3v-3.1h3.1"/>',
    tool: '<path d="M12.5 3.5a3.5 3.5 0 0 0-3.3 4.7L3.5 13.9l2.6 2.6 5.7-5.7a3.5 3.5 0 0 0 4.7-3.3l-2 2-2.3-.3-.3-2.3z"/>',
    shield: '<path d="M10 2.5l6 2.3v4.7c0 3.7-2.6 6.4-6 8-3.4-1.6-6-4.3-6-8V4.8z"/>',
    box: '<path d="M10 2.5l7 3.5v8l-7 3.5-7-3.5V6z"/><path d="M3 6l7 3.5L17 6M10 9.5v8"/>',
    file: '<path d="M5 2.5h7l3 3v12H5z"/><path d="M8 9h4M8 12h4"/>',
    db: '<ellipse cx="10" cy="5" rx="6" ry="2.5"/><path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5"/>',
    layers: '<path d="M10 3l7 3.5-7 3.5-7-3.5z"/><path d="M3 10l7 3.5 7-3.5M3 13.5l7 3.5 7-3.5"/>',
    slash: '<rect x="3" y="3" width="14" height="14" rx="3"/><path d="M11.5 6.5l-3 7"/>',
    spark: '<path d="M10 2.5l1.8 5.7 5.7 1.8-5.7 1.8L10 17.5l-1.8-5.7L2.5 10l5.7-1.8z"/>',
    users: '<circle cx="7" cy="7" r="2.5"/><circle cx="14" cy="8" r="2"/><path d="M2.5 16c.5-2.6 2.3-4 4.5-4s4 1.4 4.5 4M12 12.3c2.3-.4 4.6.8 5.5 3.7"/>',
    zap: '<path d="M11 2.5L4.5 11h5l-1 6.5L15.5 9h-5z"/>',
    plug: '<path d="M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0z"/><path d="M10 14.5v3"/>',
    pkg: '<rect x="3" y="6" width="14" height="11" rx="1.5"/><path d="M3 6l2-3.5h10L17 6M8 9.5h4"/>',
    text: '<path d="M4 5.5h12M4 10h8M4 14.5h10"/>',
    gear: '<circle cx="10" cy="10" r="2.5"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4"/>',
    clock: '<circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 2"/>',
    terminal: '<rect x="2.5" y="3.5" width="15" height="13" rx="2"/><path d="M6 8l2.5 2L6 12M10.5 12.5H14"/>',
    code: '<path d="M7 6l-4 4 4 4M13 6l4 4-4 4"/>',
    git: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="15" r="2"/><circle cx="14" cy="8" r="2"/><path d="M6 7v6M14 10c0 3-4 2.5-7.2 4"/>',
    map: '<path d="M3 5l4.5-2 5 2 4.5-2v12l-4.5 2-5-2L3 17z"/><path d="M7.5 3v12M12.5 5v12"/>',
    dollar: '<circle cx="10" cy="10" r="7"/><path d="M12.3 7.3c-.4-.8-1.3-1.3-2.3-1.3-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.4 5 4.2 0 1.1-1.1 1.9-2.5 1.9-1.1 0-2-.5-2.4-1.3M10 4.5V6M10 14v1.5"/>',
    bar: '<rect x="2.5" y="12" width="15" height="4" rx="1.5"/><path d="M5 8h10M7 4.5h6"/>',
    eye: '<path d="M2.5 10s2.7-5 7.5-5 7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5z"/><circle cx="10" cy="10" r="2.2"/>'
  };
  var GLYPH_ALIAS = {
    "agent-loop": "loop", tools: "tool", wrench: "tool", permissions: "shield", lock: "shield", sandboxing: "box", sandbox: "box",
    "claude-md": "file", doc: "file", memory: "db", context: "layers", window: "layers", "slash-commands": "slash", command: "slash",
    skills: "spark", skill: "spark", star: "spark", subagents: "users", agents: "users", hooks: "zap", hook: "zap", bolt: "zap",
    mcp: "plug", plugins: "pkg", plugin: "pkg", package: "pkg", "output-styles": "text", style: "text", settings: "gear",
    checkpoints: "clock", undo: "clock", rewind: "clock", headless: "terminal", cli: "terminal", "agent-sdk": "code", sdk: "code",
    "github-actions": "git", github: "git", ci: "git", "plan-mode": "map", plan: "map", "cost-tracking": "dollar", cost: "dollar",
    statusline: "bar", status: "bar", observe: "eye"
  };
  function glyph(item) {
    var k = item.icon && (GLYPH[item.icon] ? item.icon : GLYPH_ALIAS[item.icon]);
    if (!k) k = GLYPH[item.id] ? item.id : GLYPH_ALIAS[item.id];
    if (k && GLYPH[k]) return '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + GLYPH[k] + "</svg>";
    return '<span class="glyph-txt" aria-hidden="true">' + esc(strip(item.name || item.id || "?").slice(0, 2)) + "</span>";
  }

  /* ------------------------------------------------------------------ component registry */
  var COMP = {}, COMP_ORDER = [];
  function allPages() { return G.shared.concat(FINAL ? [FINAL] : []); }
  allPages().forEach(function (pg) {
    pg.blocks.forEach(function (b) {
      if (!b || b.type !== "components") return;
      arr(b.items).forEach(function (it) {
        if (!it || !it.id || COMP[it.id]) return;
        COMP[it.id] = it; COMP_ORDER.push(it.id);
      });
    });
  });
  function compName(id) { return COMP[id] ? strip(COMP[id].name) : String(id).replace(/-/g, " ").replace(/^\w/, function (c) { return c.toUpperCase(); }); }
  var HARNESS = G.shared.filter(function (p) { return p.id === "harness"; })[0];

  function ccChip(id) {
    var c = COMP[id];
    return '<a class="cc-chip" data-ccchip="' + esc(id) + '" href="#/harness/' + esc(id) + '"' + (c && c.oneLiner ? ' title="' + esc(strip(c.oneLiner)) + '"' : "") +
      '><span class="cc-mark" aria-hidden="true">CC</span>' + esc(compName(id)) + "</a>";
  }
  function ccRow(ids, label) {
    ids = arr(ids);
    if (!ids.length) return "";
    return '<div class="cc-row"><span class="cc-row-label">' + esc(label || "Claude Code") + "</span>" + ids.map(ccChip).join("") + "</div>";
  }

  /* ------------------------------------------------------------------ render context */
  function Ctx(route) { this.route = route; this.ids = {}; this.toc = []; this.anchors = []; this.res = []; }
  Ctx.prototype.uid = function (base) {
    var s = slug(base), id = s, n = 2;
    while (this.ids[id]) id = s + "-" + (n++);
    this.ids[id] = 1;
    return id;
  };
  Ctx.prototype.href = function (id) { return "#/" + this.route + "#" + id; };
  Ctx.prototype.heading = function (text, id, level, kind) {
    level = level || 2;
    id = this.uid(id || text);
    this.toc.push({ id: id, text: strip(text), level: level });
    this.anchors.push({ id: id, t: strip(text), kind: kind || "Section" });
    return "<h" + level + ' id="' + id + '" class="hx">' + esc(strip(text)) +
      ' <a class="anchor" href="' + this.href(id) + '" aria-label="Link to this section">#</a></h' + level + ">";
  };

  /* ------------------------------------------------------------------ shared pieces */
  var KIND = { docs: "Docs", read: "Article", video: "Video", course: "Course", repo: "Repo", spec: "Spec", pdf: "PDF", paper: "Paper" };
  function resources(items, ctx) {
    items = arr(items).filter(function (r) { return r && r.url; });
    if (!items.length) return "";
    return '<ul class="res-list">' + items.map(function (r) {
      if (ctx) ctx.res.push(r);
      var k = KIND[r.kind] ? r.kind : "read";
      var meta = [r.by, r.date].filter(Boolean).map(function (x) { return esc(strip(x)); }).join(" · ");
      return '<li><a class="res" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
        '<span class="kind k-' + k + '">' + KIND[k] + "</span>" +
        '<span class="res-main"><span class="res-title">' + esc(strip(r.t || r.url)) + "</span>" +
        '<span class="res-meta">' + (meta ? meta + '<span class="dot" aria-hidden="true"></span>' : "") + '<span class="res-host">' + esc(host(r.url)) + "</span></span>" +
        (r.note ? '<span class="res-note">' + esc(strip(r.note)) + "</span>" : "") +
        '</span><span class="res-go" aria-hidden="true">↗</span></a></li>';
    }).join("") + "</ul>";
  }
  function linkPills(links) {
    links = arr(links).filter(function (l) { return l && l.url; });
    if (!links.length) return "";
    return '<div class="pills">' + links.map(function (l) { return extA(l.url, esc(strip(l.t || host(l.url))) + ARROW, "pill"); }).join("") + "</div>";
  }
  function countChecks(id, n) {
    var c = 0; for (var i = 0; i < n; i++) if (state.checks[id + ":" + i]) c++; return c;
  }
  function checklist(id, title, items, opts) {
    items = arr(items);
    if (!items.length) return "";
    opts = opts || {};
    var n = countChecks(id, items.length);
    return '<div class="checklist' + (n === items.length ? " complete" : "") + '" data-cl="' + esc(id) + '">' +
      (title ? '<div class="cl-head"><span class="cl-title">' + esc(strip(title)) + '</span><span class="cl-count"><span class="cl-n">' + n + "</span> / " + items.length + "</span></div>" +
        '<div class="cl-bar" aria-hidden="true"><span style="width:' + Math.round(n / items.length * 100) + '%"></span></div>' : "") +
      "<ul>" + items.map(function (it, i) {
        var k = id + ":" + i;
        return '<li><label class="check"><input type="checkbox" data-check="' + esc(k) + '"' + (state.checks[k] ? " checked" : "") + '><span class="box">' + CHECK + '</span><span class="check-text">' + rich(it) + "</span></label></li>";
      }).join("") + "</ul></div>";
  }
  function codeBlock(c) {
    if (!c || c.text == null) return "";
    var lang = c.lang ? String(c.lang) : "";
    return '<figure class="code"><figcaption class="code-head"><span class="code-title">' + esc(c.title || (lang ? "" : "Code")) + "</span>" +
      (lang ? '<span class="code-lang">' + esc(lang) + "</span>" : "") +
      '<button class="copy-btn" type="button" data-copy aria-label="Copy code">Copy</button></figcaption>' +
      '<pre tabindex="0"><code>' + esc(c.text) + "</code></pre></figure>";
  }
  function callout(tone, title, html) {
    tone = { info: "info", warn: "warn", tip: "tip", lesson: "lesson" }[tone] || "info";
    return '<aside class="callout ' + tone + '">' + (title ? '<div class="callout-title">' + esc(strip(title)) + "</div>" : "") + '<div class="callout-body">' + rich(html) + "</div></aside>";
  }
  function table(head, rows, label) {
    return '<div class="table-wrap" role="region" tabindex="0" aria-label="' + esc(label || "Table") + '"><table>' +
      (head && head.length ? "<thead><tr>" + head.map(function (h) { return "<th>" + rich(h) + "</th>"; }).join("") + "</tr></thead>" : "") +
      "<tbody>" + arr(rows).map(function (r) { return "<tr>" + arr(r).map(function (c) { return "<td>" + rich(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }
  function diagram(svg, title) {
    if (!svg) return "";
    return '<figure class="diagram"><div class="diagram-inner">' + svg + "</div>" + (title ? "<figcaption>" + esc(strip(title)) + "</figcaption>" : "") + "</figure>";
  }
  function lab(l, ctx) {
    if (!l) return "";
    var lid = l.id || slug(l.title || "lab");
    var aid = ctx.uid("lab-" + lid);
    ctx.anchors.push({ id: aid, t: strip(l.title || "Lab"), kind: "Lab" });
    var key = "lab:" + lid, verify = arr(l.verify), n = countChecks(key, verify.length);
    var lvl = String(l.level || "Core"), lvlc = slug(lvl);
    var h = '<details class="lab" id="' + aid + '" data-lab="' + esc(key) + '">';
    h += '<summary><span class="lab-top"><span class="lab-tag">Lab</span><span class="lvl lvl-' + lvlc + '">' + esc(lvl) + "</span>" +
      (l.time ? '<span class="lab-time">' + esc(l.time) + "</span>" : "") +
      (verify.length ? '<span class="lab-count' + (n === verify.length ? " ok" : "") + '"><span class="cl-n">' + n + "</span> / " + verify.length + " verified</span>" : "") +
      '</span><span class="lab-title">' + esc(strip(l.title || "Lab")) + "</span>" +
      (l.goal ? '<span class="lab-goal">' + esc(strip(l.goal)) + "</span>" : "") +
      '<span class="lab-toggle" aria-hidden="true">' + CHEV + "</span></summary>";
    h += '<div class="lab-body">';
    if (l.goal && /<a\b/i.test(l.goal)) h += '<p class="lab-goal-full">' + rich(l.goal) + "</p>";
    if (arr(l.build).length) h += '<h4 class="sub-h">Build</h4><ol class="steps">' + arr(l.build).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ol>";
    if (l.code) h += codeBlock(l.code);
    if (verify.length) h += '<h4 class="sub-h">Verify</h4>' + checklist(key, "", verify);
    if (arr(l.stretch).length) h += '<h4 class="sub-h">Stretch</h4><ul class="bullets">' + arr(l.stretch).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>";
    if (arr(l.links).length) h += '<h4 class="sub-h">Read</h4>' + linkPills(l.links);
    h += ccRow(l.cc);
    h += "</div></details>";
    return h;
  }

  /* ------------------------------------------------------------------ blocks */
  function block(b, ctx) {
    if (!b || !b.type) return "";
    switch (b.type) {
      case "lead": return '<p class="lead">' + rich(b.html) + "</p>";
      case "h": return ctx.heading(b.text || "", b.id, b.level === 3 ? 3 : 2);
      case "p": return "<p>" + rich(b.html) + "</p>";
      case "source": return '<p class="source">' + rich(b.html) + "</p>";
      case "list": return '<ul class="bullets">' + arr(b.items).map(function (i) { return "<li>" + rich(i) + "</li>"; }).join("") + "</ul>";
      case "steps": return '<ol class="steps">' + arr(b.items).map(function (i) { return "<li>" + rich(i) + "</li>"; }).join("") + "</ol>";
      case "callout": return callout(b.tone, b.title, b.html);
      case "code": return codeBlock(b);
      case "equation": return '<div class="equation">' + rich(b.html) + "</div>";
      case "table": return table(b.head, b.rows, b.caption || b.title);
      case "diagram": return diagram(b.svg, b.title);
      case "resources": return resources(b.items, ctx);
      case "checklist": return checklist(b.id || ctx.route + "-" + slug(b.title || "checks"), b.title || "Checklist", b.items);
      case "lab": return lab(b, ctx);
      case "timeline":
        return '<ol class="timeline">' + arr(b.items).map(function (i) {
          return '<li><span class="tl-when">' + esc(strip(i.when)) + '</span><span class="tl-what">' + rich(i.what) + "</span></li>";
        }).join("") + "</ol>";
      case "defs":
        return '<dl class="defs">' + arr(b.items).map(function (d) {
          var id = ctx.uid("term-" + (d.term || "term"));
          ctx.anchors.push({ id: id, t: strip(d.term), kind: "Term" });
          return '<div class="def" id="' + id + '"><dt><a class="def-term" href="' + ctx.href(id) + '">' + esc(strip(d.term)) + "</a>" + (d.cc ? ccChip(d.cc) : "") + "</dt><dd>" + rich(d.def) +
            (d.src && d.src.url ? '<div class="def-src">' + extA(d.src.url, esc(strip(d.src.t || host(d.src.url))) + ARROW) + "</div>" : "") + "</dd></div>";
        }).join("") + "</dl>";
      case "primitives":
        return '<ol class="prims">' + arr(b.items).map(function (p, i) {
          var id = ctx.uid(p.t || "block");
          ctx.anchors.push({ id: id, t: strip(p.t), kind: "Building block" });
          return '<li class="prim" id="' + id + '"><span class="prim-n" aria-hidden="true">' + (i + 1) + '</span><div class="prim-body"><h3>' + esc(strip(p.t)) + "</h3><p>" + rich(p.d) + "</p>" +
            (p.done ? '<p class="prim-done"><span class="label">Done when</span>' + rich(p.done) + "</p>" : "") +
            '<div class="prim-foot">' + (p.src && p.src.url ? extA(p.src.url, esc(strip(p.src.t || host(p.src.url))) + ARROW, "src-link") : "") + ccRow(p.cc, "") + "</div></div></li>";
        }).join("") + "</ol>";
      case "tools":
        var groups = b.groups || (b.items ? [{ title: "", items: b.items }] : []);
        return groups.map(function (g) {
          var h = '<section class="tool-group">';
          if (g.title) h += ctx.heading(g.title, g.id, 3);
          if (g.intro) h += '<p class="group-intro">' + rich(g.intro) + "</p>";
          return h + '<div class="tool-grid">' + arr(g.items).map(function (x) {
            var id = ctx.uid("tool-" + (x.name || "tool"));
            ctx.anchors.push({ id: id, t: strip(x.name), kind: "Tool", sub: g.title });
            var cost = strip(x.cost || x.free || "");
            var free = /free|\$0|no cost|0 ?€/i.test(cost);
            return '<article class="tool-card" id="' + id + '"><header class="tool-top"><h4>' + esc(strip(x.name)) + "</h4>" + (x.tag ? '<span class="tag">' + esc(strip(x.tag)) + "</span>" : "") + "</header>" +
              (cost ? '<div class="cost' + (free ? " is-free" : "") + '">' + esc(cost) + "</div>" : "") +
              '<dl class="facts">' +
              (x.bestFor ? "<div><dt>Best for</dt><dd>" + rich(x.bestFor) + "</dd></div>" : "") +
              (x.limits ? "<div><dt>Limits</dt><dd>" + rich(x.limits) + "</dd></div>" : "") +
              (x.how ? "<div><dt>Get started</dt><dd>" + rich(x.how) + "</dd></div>" : "") +
              "</dl>" + linkPills(x.links) +
              '<footer class="tool-foot">' + (x.cc ? ccChip(x.cc) : "<span></span>") + (x.verified ? '<span class="verified">Checked ' + esc(x.verified) + "</span>" : "") + "</footer></article>";
          }).join("") + "</div></section>";
        }).join("");
      case "components":
        var items = arr(b.items).filter(function (x) { return x && x.id; });
        var order = [], by = {};
        items.forEach(function (it) { var g = it.group || ""; if (!by[g]) { by[g] = []; order.push(g); } by[g].push(it); });
        var out = b.id ? '<div class="comp-block" id="' + ctx.uid(b.id) + '">' : '<div class="comp-block">';
        if (b.intro) out += "<p>" + rich(b.intro) + "</p>";
        order.forEach(function (g) {
          if (g) out += ctx.heading(g, null, 3);
          out += '<div class="comp-grid">' + by[g].map(function (it) {
            return '<a class="comp-card" href="#/harness/' + esc(it.id) + '"><span class="comp-icon">' + glyph(it) + '</span><span class="comp-text"><span class="comp-name">' + esc(strip(it.name)) +
              '</span><span class="comp-one">' + esc(strip(it.oneLiner)) + "</span></span>" + CHEV + "</a>";
          }).join("") + "</div>";
        });
        return out + "</div>";
      case "rubric":
        var rub = G.rubric;
        return '<div class="rubric">' + rub.map(function (r) {
          return '<div class="rub"><div class="rub-top"><span class="rub-name">' + esc(r[0]) + '</span><span class="rub-w">' + esc(r[1]) + '%</span></div><div class="rub-bar" aria-hidden="true"><span style="width:' + Math.min(100, r[1] * 4) + '%"></span></div><p>' + rich(r[2]) + "</p></div>";
        }).join("") + "</div>";
    }
    if (window.console) console.warn("Unknown block type:", b.type);
    return "";
  }
  function blocks(list, ctx) {
    return arr(list).map(function (b) {
      try { return block(b, ctx); } catch (e) { if (window.console) console.error("Block failed to render: " + (b && b.type) + ": " + (e && e.message)); return ""; }
    }).join("");
  }

  /* ------------------------------------------------------------------ navigation model */
  function projectById(id) { return G.projects.filter(function (p) { return p.id === id; })[0]; }
  function sharedById(id) { return G.shared.filter(function (p) { return p.id === id; })[0]; }
  function progress(p) {
    var t = p.milestones.length, d = p.milestones.filter(function (m) { return state.done[p.id + "/" + m.id]; }).length;
    return { done: d, total: t, pct: t ? Math.round(d / t * 100) : 0 };
  }
  function pageNum(pg, i) { return pg.num || (i < 9 ? "0" : "") + (i + 1); }
  function finalNum() { return String(G.shared.length + 1).padStart(2, "0"); }
  function colorClass(p) { return "c-" + ({ blue: "blue", green: "green", teal: "green", violet: "violet" }[p.color] || "blue"); }

  function titleOf(route) {
    var parts = route.split("/");
    var s = sharedById(parts[0]);
    if (parts[0] === "harness" && parts[1]) return compName(parts[1]);
    if (s) return strip(s.title);
    if (parts[0] === "projects") return "Project tracks";
    if (parts[0] === "final") return FINAL ? strip(FINAL.title) : "Final delivery";
    var p = projectById(parts[0]);
    if (p) {
      if (!parts[1]) return strip(p.short || p.title);
      var m = p.milestones.filter(function (x) { return x.id === parts[1]; })[0];
      return m ? strip(m.when) + " · " + strip(m.title) : strip(p.short);
    }
    return route;
  }
  function neighbours(r) {
    var ids = G.shared.map(function (s) { return s.id; });
    var tail = FINAL ? "final" : null;
    var prev = null, next = null, i;
    if (r.page === "harness" && r.sub && COMP[r.sub]) {
      i = COMP_ORDER.indexOf(r.sub);
      prev = i > 0 ? "harness/" + COMP_ORDER[i - 1] : "harness";
      next = i < COMP_ORDER.length - 1 ? "harness/" + COMP_ORDER[i + 1] : null;
      return { prev: prev, next: next };
    }
    i = ids.indexOf(r.page);
    if (i >= 0) {
      prev = i > 0 ? ids[i - 1] : null;
      next = i < ids.length - 1 ? ids[i + 1] : (G.projects.length ? "projects" : tail);
      return { prev: prev, next: next };
    }
    if (r.page === "projects") {
      return { prev: ids[ids.length - 1] || null, next: state.project && projectById(state.project) ? state.project : (G.projects[0] ? G.projects[0].id : tail) };
    }
    if (r.page === "final") {
      var pp = projectById(state.project) || G.projects[0];
      return { prev: pp ? (pp.milestones.length ? pp.id + "/" + pp.milestones[pp.milestones.length - 1].id : pp.id) : ids[ids.length - 1], next: null };
    }
    var p = projectById(r.page);
    if (p) {
      var ms = p.milestones.map(function (m) { return p.id + "/" + m.id; });
      if (!r.sub) return { prev: "projects", next: ms[0] || tail };
      i = ms.indexOf(p.id + "/" + r.sub);
      return { prev: i > 0 ? ms[i - 1] : p.id, next: i < ms.length - 1 ? ms[i + 1] : tail };
    }
    return { prev: null, next: null };
  }
  function pager(r) {
    var n = neighbours(r);
    if (!n.prev && !n.next) return "";
    function link(route, dir) {
      if (!route) return "<span></span>";
      return '<a class="pager-link ' + dir + '" href="#/' + route + '"><span class="pager-dir">' + (dir === "prev" ? "Previous" : "Next") + '</span><span class="pager-title">' + esc(titleOf(route)) + "</span></a>";
    }
    return '<nav class="pager" aria-label="Previous and next">' + link(n.prev, "prev") + link(n.next, "next") + "</nav>";
  }
  function pageFoot() {
    return '<footer class="page-foot"><span>Last verified ' + esc(G.lastVerified || "") + "</span><span>Supervisor: " + esc(G.supervisor || "") + "</span>" +
      (G.docUrl ? extA(G.docUrl, "Official project definitions" + ARROW) : "") + "</footer>";
  }
  function head(eyebrow, title, summary, extra) {
    return '<header class="page-head">' + (eyebrow ? '<div class="eyebrow">' + eyebrow + "</div>" : "") + '<h1 id="page-title" tabindex="-1">' + esc(strip(title)) + "</h1>" +
      (summary ? '<p class="summary">' + rich(summary) + "</p>" : "") + (extra || "") + "</header>";
  }

  /* ------------------------------------------------------------------ pages */
  function sharedPage(pg, ctx) {
    var i = G.shared.indexOf(pg);
    var eb = '<span class="eb-num">' + esc(pageNum(pg, i)) + "</span>" + (pg.kicker ? '<span class="eb-sep"></span>' + esc(strip(pg.kicker)) : "");
    return head(eb, pg.title, pg.summary) + blocks(pg.blocks, ctx);
  }
  function finalPage(ctx) {
    return head('<span class="eb-num">' + finalNum() + "</span>" + (FINAL.kicker ? '<span class="eb-sep"></span>' + esc(FINAL.kicker) : ""), FINAL.title, FINAL.summary) + blocks(FINAL.blocks, ctx);
  }

  var backlinks = null;
  function componentPage(id, ctx) {
    var c = COMP[id];
    if (!c) {
      return head("Claude Code", "Component not found", "") + '<p>There is no component called <code>' + esc(id) + '</code> yet.</p>' +
        (HARNESS ? '<p><a href="#/harness">See all Claude Code components</a></p>' : "<p>The Claude Code section has not been published yet.</p>");
    }
    var eb = '<a class="crumb" href="#/harness">' + esc(HARNESS ? strip(HARNESS.title) : "Claude Code") + '</a><span class="crumb-sep" aria-hidden="true">/</span>' + (c.group ? esc(strip(c.group)) : "Component");
    var h = head(eb, c.name, c.oneLiner, '<div class="comp-hero-icon" aria-hidden="true">' + glyph(c) + "</div>");
    if (c.what) h += ctx.heading("What it is", "what") + "<div class=\"prose\">" + wrapP(c.what) + "</div>";
    if (c.why) h += ctx.heading("Why it matters for your project", "why") + "<div class=\"prose\">" + wrapP(c.why) + "</div>";
    if (c.example) h += ctx.heading("Example", "example") + codeBlock(c.example);
    if (c.tryIt) h += ctx.heading("Try it", "try-it") + callout("tip", "Exercise", c.tryIt);
    if (arr(c.links).length) {
      h += ctx.heading("Official docs and courses", "links") + resources(arr(c.links).map(function (l) {
        return { kind: l.kind || (/skilljar|academy|course/i.test(l.url) ? "course" : /youtube|youtu\.be/.test(l.url) ? "video" : /github\.com/.test(l.url) ? "repo" : "docs"), t: l.t, by: l.by || host(l.url), date: l.date, url: l.url, note: l.note };
      }), ctx);
    }
    if (arr(c.related).length) h += ctx.heading("Related components", "related") + '<div class="cc-row">' + arr(c.related).map(ccChip).join("") + "</div>";
    var bl = backlinks && backlinks[id];
    if (bl && bl.length) {
      h += ctx.heading("Where the guide uses it", "used-in") + '<ul class="backlinks">' + bl.map(function (r) {
        return '<li><a href="#/' + r + '">' + esc(titleOf(r)) + '</a><span class="bl-where">' + esc(sectionOf(r)) + "</span></li>";
      }).join("") + "</ul>";
    }
    return h;
  }
  function wrapP(html) { html = rich(html); return /^\s*<(p|ul|ol|div|pre|table)\b/i.test(html) ? html : "<p>" + html + "</p>"; }
  function sectionOf(route) {
    var p = projectById(route.split("/")[0]);
    if (p) return strip(p.short || p.title);
    return "Guide";
  }

  function projectsPage(ctx) {
    var h = head('<span class="eb-num">Tracks</span>', "Pick your project track", "Each pair works on one track. Each track has six milestones with what to build, deliver, measure and test. Your last visited track is remembered in this browser.");
    if (!G.projects.length) return h + callout("info", "Coming soon", "The project tracks have not been published yet.");
    h += '<div class="proj-cards">' + G.projects.map(function (p) {
      var pr = progress(p);
      return '<a class="proj-card ' + colorClass(p) + '" href="#/' + esc(p.id) + '"><span class="slot">' + esc(p.slot || "") + "</span><h2>" + esc(strip(p.title)) + "</h2><p>" + esc(strip(p.oneLiner)) + "</p>" +
        '<span class="proj-card-foot"><span class="bar"><span style="width:' + pr.pct + '%"></span></span><span>' + pr.done + " of " + pr.total + " milestones</span></span></a>";
    }).join("") + "</div>";
    return h;
  }

  function projectPage(p, ctx) {
    var pr = progress(p);
    var eb = '<span class="slot ' + colorClass(p) + '">' + esc(p.slot || "Project") + '</span><span class="eb-sep"></span>Project track';
    var meta = "";
    if (p.sessions || p.parallels) {
      meta = '<dl class="meta">' + (p.sessions ? "<div><dt>Module sessions</dt><dd>" + rich(p.sessions) + "</dd></div>" : "") + (p.parallels ? "<div><dt>Industry parallels</dt><dd>" + rich(p.parallels) + "</dd></div>" : "") + "</dl>";
    }
    var prog = '<div class="prog ' + colorClass(p) + '"><div class="prog-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + pr.total + '" aria-valuenow="' + pr.done + '" aria-label="Milestones done"><span style="width:' + pr.pct + '%"></span></div><span class="prog-txt">' + pr.done + " of " + pr.total + " milestones done</span></div>";
    var h = head(eb, p.title, p.oneLiner, meta + prog);
    if (arr(p.why).length) h += ctx.heading("Why this matters", "why") + arr(p.why).map(function (w) { return "<p>" + rich(w) + "</p>"; }).join("");
    if (arr(p.evidence).length) {
      h += ctx.heading("Evidence from industry", "evidence") + '<div class="evidence">' + arr(p.evidence).map(function (e) {
        var inner = '<span class="ev-org">' + esc(strip(e.org)) + '</span><span class="ev-stat">' + esc(strip(e.stat)) + '</span><span class="ev-label">' + esc(strip(e.label)) + "</span>" +
          (e.src ? '<span class="ev-src">' + esc(strip(e.src.t || host(e.src.url))) + ARROW + "</span>" : "");
        return e.src && e.src.url ? '<a class="ev" href="' + esc(e.src.url) + '" target="_blank" rel="noopener">' + inner + "</a>" : '<div class="ev">' + inner + "</div>";
      }).join("") + "</div>";
    }
    if (p.lesson) h += callout("lesson", "The lesson for your build", p.lesson);
    if (p.note) h += callout("warn", "Note for your pair", p.note);
    if (p.architecture) {
      h += ctx.heading("Architecture", "architecture");
      if (p.architecture.svg) h += diagram(p.architecture.svg, p.architecture.title || p.architecture.caption);
      else if (p.architecture.code) h += codeBlock({ lang: "text", title: p.architecture.title || "Architecture", text: p.architecture.code });
      if (p.architecture.html) h += "<p>" + rich(p.architecture.html) + "</p>";
    }
    if (p.stack) {
      h += ctx.heading("Recommended free stack", "stack");
      if (typeof p.stack === "string") h += "<p>" + rich(p.stack) + "</p>";
      else {
        var hasAlt = arr(p.stack).some(function (s) { return s.alt; });
        h += table(hasAlt ? ["Layer", "Recommended", "Alternatives"] : ["Layer", "Recommended"], arr(p.stack).map(function (s) {
          return hasAlt ? ['<span class="nowrap">' + esc(strip(s.layer)) + "</span>", rich(s.choice), rich(s.alt || "")] : [esc(strip(s.layer)), rich(s.choice)];
        }), "Recommended stack");
      }
    }
    h += ctx.heading("Milestones", "milestones");
    h += '<ol class="ms-cards">' + p.milestones.map(function (m, i) {
      var d = state.done[p.id + "/" + m.id];
      return '<li><a class="ms-card' + (d ? " done" : "") + '" href="#/' + esc(p.id) + "/" + esc(m.id) + '"><span class="ms-n" aria-hidden="true">' + (d ? CHECK : i + 1) + "</span>" +
        '<span class="ms-main"><span class="ms-when">' + esc(strip(m.when)) + (m.hours ? '<span class="dot" aria-hidden="true"></span>' + esc(strip(m.hours)) : "") + (d ? '<span class="dot" aria-hidden="true"></span><span class="ok-txt">Done</span>' : "") + "</span>" +
        '<span class="ms-title">' + esc(strip(m.title)) + '</span><span class="ms-goal">' + esc(strip(m.goal)) + "</span></span>" + CHEV + "</a></li>";
    }).join("") + "</ol>";
    if (arr(p.stretch).length) h += ctx.heading("Stretch goals", "stretch") + '<ul class="bullets">' + arr(p.stretch).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>";
    if (arr(p.pitfalls).length) h += ctx.heading("Common pitfalls", "pitfalls") + '<ul class="bullets pitfalls">' + arr(p.pitfalls).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>";
    if (arr(p.mvd).length) h += ctx.heading("Minimum viable deliverable", "mvd") + checklist(p.id + "-mvd", "What earns the pass", p.mvd);
    return h;
  }

  function railHtml(p, cur) {
    return '<nav class="rail ' + colorClass(p) + '" aria-label="Milestones"><ol>' + p.milestones.map(function (m, i) {
      var d = state.done[p.id + "/" + m.id], c = m.id === cur;
      return '<li><a href="#/' + esc(p.id) + "/" + esc(m.id) + '" class="' + (d ? "done " : "") + (c ? "current" : "") + '"' + (c ? ' aria-current="step"' : "") + '><span class="rail-dot" aria-hidden="true">' + (d ? CHECK : i + 1) + '</span><span class="rail-when">' + esc(strip(m.when)) + "</span></a></li>";
    }).join("") + "</ol></nav>";
  }

  function milestonePage(p, m, ctx) {
    var key = p.id + "/" + m.id, d = !!state.done[key];
    var eb = '<a class="crumb" href="#/' + esc(p.id) + '">' + esc(strip(p.short || p.title)) + '</a><span class="crumb-sep" aria-hidden="true">/</span>' + esc(strip(m.when)) + (m.hours ? '<span class="eb-sep"></span>' + esc(strip(m.hours)) : "");
    var toggle = '<div class="ms-status"><button type="button" class="btn ' + (d ? "btn-done" : "btn-primary") + '" data-ms-toggle="' + esc(key) + '" aria-pressed="' + d + '">' +
      (d ? CHECK + " Milestone done" : "Mark milestone done") + "</button>" + (d ? '<span class="muted small">Click again to undo.</span>' : "") + "</div>";
    var h = railHtml(p, m.id) + head(eb, m.title, null, (m.goal ? '<p class="summary">' + rich(m.goal) + "</p>" : "") + toggle);
    if (arr(m.build).length) h += ctx.heading("Build", "build") + '<ol class="steps">' + arr(m.build).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ol>";
    if (arr(m.deliver).length) h += ctx.heading("Deliver", "deliver") + '<ul class="bullets deliver">' + arr(m.deliver).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>";
    if (arr(m.measure).length) h += ctx.heading("Measure", "measure") + '<p class="muted">Tick each one when you can prove it from your repo.</p>' + checklist(key, "Done-when checks", m.measure);
    if (m.test) {
      h += ctx.heading("Test it", "test");
      if (m.test.intro) h += "<p>" + rich(m.test.intro) + "</p>";
      if (m.test.code) h += codeBlock(m.test.code);
      h += checklist(key + "/test", "Test checks", m.test.checks);
    }
    if (arr(m.extra).length) h += ctx.heading("If you have time", "extra") + '<ul class="bullets">' + arr(m.extra).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>";
    if (m.lab) h += ctx.heading("Lab", "lab") + lab(m.lab, ctx);
    if (arr(m.cc).length) {
      h += ctx.heading("Claude Code components", "claude-code") + '<div class="comp-grid compact">' + arr(m.cc).map(function (id) {
        var c = COMP[id] || { id: id, name: compName(id), oneLiner: "" };
        return '<a class="comp-card" data-ccchip="' + esc(id) + '" href="#/harness/' + esc(id) + '"><span class="comp-icon">' + glyph(c) + '</span><span class="comp-text"><span class="comp-name">' + esc(strip(c.name)) +
          '</span>' + (c.oneLiner ? '<span class="comp-one">' + esc(strip(c.oneLiner)) + "</span>" : "") + "</span>" + CHEV + "</a>";
      }).join("") + "</div>";
    }
    if (arr(m.resources).length) h += ctx.heading("Resources", "resources") + resources(m.resources, ctx);
    h += '<div class="ms-end">' + toggle + "</div>";
    return h;
  }

  function notFound() {
    return head("", "Page not found", "That address does not match a page in this guide.") + '<p><a href="#/start">Go to Start here</a></p>';
  }

  /* ------------------------------------------------------------------ routing */
  function parse() {
    var raw = decodeURIComponent((location.hash || "").replace(/^#\/?/, ""));
    var hashAt = raw.indexOf("#");
    var anchor = hashAt >= 0 ? raw.slice(hashAt + 1) : "";
    var path = (hashAt >= 0 ? raw.slice(0, hashAt) : raw).replace(/\/+$/, "");
    var parts = path.split("/");
    var page = parts[0] || "start";
    var legacy = { deliver: "final", choose: "projects" };
    if (legacy[page]) page = legacy[page];
    var sub = parts[1] || null;
    return { page: page, sub: sub, anchor: anchor, key: page + (sub ? "/" + sub : "") };
  }

  function renderRoute(r) {
    var ctx = new Ctx(r.key), body, title;
    var s = sharedById(r.page), p = projectById(r.page);
    if (r.page === "harness" && r.sub) { body = componentPage(r.sub, ctx); title = compName(r.sub); }
    else if (s) { body = sharedPage(s, ctx); title = strip(s.title); }
    else if (r.page === "projects") { body = projectsPage(ctx); title = "Project tracks"; }
    else if (r.page === "final" && FINAL) { body = finalPage(ctx); title = strip(FINAL.title); }
    else if (p && !r.sub) { body = projectPage(p, ctx); title = strip(p.short || p.title); }
    else if (p && r.sub) {
      var m = p.milestones.filter(function (x) { return x.id === r.sub; })[0];
      if (m) { body = milestonePage(p, m, ctx); title = strip(m.title) + " · " + strip(p.short || p.title); }
      else { body = notFound(); title = "Not found"; }
    } else { body = notFound(); title = "Not found"; }
    return { html: body, ctx: ctx, title: title };
  }

  function tocHtml(ctx) {
    var items = ctx.toc;
    if (items.length < 2) return "";
    return '<aside class="toc" aria-label="On this page"><div class="toc-inner"><div class="toc-title">On this page</div><ul>' + items.map(function (t) {
      return '<li class="lv' + t.level + '"><a href="' + ctx.href(t.id) + '" data-toc="' + t.id + '">' + esc(t.text) + "</a></li>";
    }).join("") + "</ul></div></aside>";
  }

  var current = null;
  function render(opts) {
    opts = opts || {};
    var r = parse();
    if (!location.hash) { try { history.replaceState(null, "", "#/start"); } catch (e) {} }
    var sameRoute = current && current.key === r.key && !opts.force;
    if (sameRoute) { scrollToAnchor(r.anchor, true); return; }
    if (projectById(r.page)) { state.project = r.page; save(); }
    if (r.page === "harness" && r.sub) ensureIndex();
    var out = renderRoute(r);
    var main = $("#content");
    var y = window.scrollY;
    main.innerHTML = '<div class="page-grid"><article class="page" aria-labelledby="page-title">' + out.html + pager(r) + pageFoot() + "</article>" + tocHtml(out.ctx) + "</div>";
    enhance(main);
    current = r;
    document.title = out.title + " · ASDLC Capstone Guide";
    renderSidebar(r);
    closeMenu();
    setupSpy();
    if (opts.keepScroll) { window.scrollTo(0, y); return; }
    if (r.anchor) { scrollToAnchor(r.anchor, false); }
    else window.scrollTo(0, 0);
    var h1 = $("#page-title");
    if (h1 && !opts.noFocus) h1.focus({ preventScroll: true });
  }

  function scrollToAnchor(id, smooth) {
    if (!id) { window.scrollTo({ top: 0, behavior: smooth && !reduceMotion ? "smooth" : "auto" }); return; }
    var el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "DETAILS") el.open = true;
    var parentLab = el.closest && el.closest("details");
    if (parentLab) parentLab.open = true;
    el.scrollIntoView({ behavior: smooth && !reduceMotion ? "smooth" : "auto", block: "start" });
    el.classList.add("flash");
    setTimeout(function () { el.classList.remove("flash"); }, 1400);
  }

  // Post-process inserted HTML: cross-links, external links, doc links.
  function enhance(root) {
    $$("a[data-cc]", root).forEach(function (a) {
      var id = a.getAttribute("data-cc");
      a.setAttribute("href", "#/harness/" + id);
      a.classList.add("cc-link");
      a.removeAttribute("target");
      var c = COMP[id];
      a.setAttribute("title", "Claude Code: " + (c ? strip(c.name) + (c.oneLiner ? ". " + strip(c.oneLiner) : "") : compName(id)));
    });
    $$("a[data-doc]", root).forEach(function (a) { a.href = G.docUrl || "#"; a.target = "_blank"; a.rel = "noopener"; });
    $$('a[href^="http"]', root).forEach(function (a) {
      if (!a.target) a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ------------------------------------------------------------------ sidebar */
  function renderSidebar(r) {
    var h = '<div class="side-inner"><div class="side-label" id="nav-guide">Guide</div><ul class="nav" aria-labelledby="nav-guide">';
    G.shared.forEach(function (pg, i) {
      var active = r.page === pg.id;
      h += '<li><a class="nav-link' + (active ? " active" : "") + '" href="#/' + esc(pg.id) + '"' + (active && !r.sub ? ' aria-current="page"' : "") + '><span class="nav-num">' + esc(pageNum(pg, i)) + '</span><span class="nav-text">' + esc(strip(pg.title)) + "</span></a>";
      if (pg.id === "harness" && active && COMP_ORDER.length) {
        h += '<ul class="nav-sub">' + COMP_ORDER.map(function (id) {
          var a = r.sub === id;
          return '<li><a href="#/harness/' + esc(id) + '" class="' + (a ? "active" : "") + '"' + (a ? ' aria-current="page"' : "") + ">" + esc(compName(id)) + "</a></li>";
        }).join("") + "</ul>";
      }
      h += "</li>";
    });
    h += "</ul>";
    if (G.projects.length) {
      h += '<div class="side-label"><a href="#/projects" class="' + (r.page === "projects" ? "active" : "") + '">Project tracks</a></div><ul class="nav">';
      G.projects.forEach(function (p) {
        var pr = progress(p), active = r.page === p.id;
        h += '<li><a class="nav-proj ' + colorClass(p) + (active ? " active" : "") + '" href="#/' + esc(p.id) + '"' + (active && !r.sub ? ' aria-current="page"' : "") + ">" +
          '<span class="nav-proj-top"><span class="nav-text">' + esc(strip(p.short || p.title)) + '</span><span class="nav-proj-count">' + pr.done + "/" + pr.total + "</span></span>" +
          '<span class="nav-proj-slot">' + esc(p.slot || "") + '</span><span class="bar" aria-hidden="true"><span style="width:' + pr.pct + '%"></span></span></a>';
        if (active) {
          h += '<ul class="nav-sub ms">' + p.milestones.map(function (m) {
            var d = state.done[p.id + "/" + m.id], a = r.sub === m.id;
            return '<li><a href="#/' + esc(p.id) + "/" + esc(m.id) + '" class="' + (a ? "active " : "") + (d ? "done" : "") + '"' + (a ? ' aria-current="page"' : "") + '><span class="nav-dot" aria-hidden="true">' + (d ? CHECK : "") + '</span><span><span class="nav-ms-when">' + esc(strip(m.when)) + "</span>" + esc(strip(m.title)) + "</span></a></li>";
          }).join("") + "</ul>";
        }
        h += "</li>";
      });
      h += "</ul>";
    }
    if (FINAL) {
      h += '<ul class="nav nav-final"><li><a class="nav-link' + (r.page === "final" ? " active" : "") + '" href="#/final"' + (r.page === "final" ? ' aria-current="page"' : "") + '><span class="nav-num">' + finalNum() + '</span><span class="nav-text">' + esc(strip(FINAL.title)) + "</span></a></li></ul>";
    }
    h += '<div class="side-foot"><div>Supervisor: ' + esc(G.supervisor || "") + "</div><div>Last verified " + esc(G.lastVerified || "") + "</div></div></div>";
    var sb = $("#sidebar");
    var st = sb.scrollTop;
    sb.innerHTML = h;
    sb.scrollTop = st;
    var act = $(".nav-sub a.active", sb) || $("a.active", sb);
    if (act) {
      var top = act.offsetTop, bottom = top + act.offsetHeight;
      if (top < sb.scrollTop || bottom > sb.scrollTop + sb.clientHeight) sb.scrollTop = top - sb.clientHeight / 3;
    }
  }

  /* ------------------------------------------------------------------ scrollspy */
  var spyHeads = [], spyLinks = {}, spyTicking = false;
  function setupSpy() {
    spyLinks = {};
    $$(".toc a[data-toc]").forEach(function (a) { spyLinks[a.getAttribute("data-toc")] = a; });
    spyHeads = Object.keys(spyLinks).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    spy();
  }
  function spy() {
    spyTicking = false;
    if (!spyHeads.length) return;
    var cur = spyHeads[0], lim = 110;
    for (var i = 0; i < spyHeads.length; i++) { if (spyHeads[i].getBoundingClientRect().top <= lim) cur = spyHeads[i]; else break; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = spyHeads[spyHeads.length - 1];
    Object.keys(spyLinks).forEach(function (k) { spyLinks[k].classList.toggle("active", k === cur.id); });
  }
  window.addEventListener("scroll", function () { if (!spyTicking) { spyTicking = true; requestAnimationFrame(spy); } }, { passive: true });

  /* ------------------------------------------------------------------ search index */
  var INDEX = null;
  function ensureIndex() {
    if (INDEX) return INDEX;
    INDEX = []; backlinks = {};
    var seenRes = {};
    var routes = G.shared.map(function (s) { return s.id; });
    COMP_ORDER.forEach(function (id) { routes.push("harness/" + id); });
    if (G.projects.length) routes.push("projects");
    G.projects.forEach(function (p) { routes.push(p.id); p.milestones.forEach(function (m) { routes.push(p.id + "/" + m.id); }); });
    if (FINAL) routes.push("final");
    routes.forEach(function (route) {
      var parts = route.split("/");
      var r = { page: parts[0], sub: parts[1] || null, anchor: "", key: route };
      var out;
      try { out = renderRoute(r); } catch (e) { return; }
      var isComp = parts[0] === "harness" && parts[1];
      var section = isComp ? "Claude Code" : sectionOf(route);
      var kind = isComp ? "Component" : (parts[1] ? "Milestone" : (projectById(parts[0]) ? "Project" : "Page"));
      var sub = isComp ? strip((COMP[parts[1]] || {}).oneLiner || "") : (kind === "Milestone" ? section : (kind === "Project" ? "Project track" : ""));
      INDEX.push({ t: titleOf(route), sub: sub, kind: kind, href: "#/" + route });
      if (!isComp) out.ctx.anchors.forEach(function (a) {
        INDEX.push({ t: a.t, sub: titleOf(route) + (a.sub ? " · " + strip(a.sub) : ""), kind: a.kind, href: "#/" + route + "#" + a.id });
      });
      out.ctx.res.forEach(function (x) {
        if (seenRes[x.url]) return; seenRes[x.url] = 1;
        INDEX.push({ t: strip(x.t || x.url), sub: [strip(x.by || ""), titleOf(route)].filter(Boolean).join(" · "), kind: "Resource", href: x.url, ext: true });
      });
      if (!isComp && route !== "harness") {
        var re = /data-cc(?:chip)?="([\w-]+)"/g, mm, seen = {};
        while ((mm = re.exec(out.html))) {
          if (seen[mm[1]]) continue; seen[mm[1]] = 1;
          (backlinks[mm[1]] = backlinks[mm[1]] || []).push(route);
        }
      }
    });
    INDEX.forEach(function (e) { e.hay = (e.t + " " + e.sub + " " + e.kind).toLowerCase(); e.tl = e.t.toLowerCase(); });
    return INDEX;
  }
  var KIND_RANK = { Page: 0, Project: 0, Component: 1, Milestone: 2, Tool: 3, Term: 3, Lab: 4, "Building block": 4, Section: 5, Resource: 6 };
  function search(q) {
    var idx = ensureIndex();
    q = q.trim().toLowerCase();
    if (!q) return idx.filter(function (e) { return e.kind === "Page" || e.kind === "Project"; });
    var toks = q.split(/\s+/);
    var res = [];
    idx.forEach(function (e) {
      for (var i = 0; i < toks.length; i++) if (e.hay.indexOf(toks[i]) < 0) return;
      var s = e.tl.indexOf(q) === 0 ? 0 : e.tl.indexOf(q) > 0 ? 1 : toks.every(function (t) { return e.tl.indexOf(t) >= 0; }) ? 2 : 4;
      res.push({ e: e, s: s * 10 + (KIND_RANK[e.kind] || 5) });
    });
    res.sort(function (a, b) { return a.s - b.s || a.e.t.length - b.e.t.length; });
    return res.slice(0, 60).map(function (x) { return x.e; });
  }
  function hl(text, q) {
    var t = esc(text);
    q.trim().split(/\s+/).filter(function (x) { return x.length > 1; }).forEach(function (tok) {
      var re = new RegExp("(" + esc(tok).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      t = t.replace(re, "<mark>$1</mark>");
    });
    return t;
  }

  /* ------------------------------------------------------------------ palette UI */
  var palette = $("#palette"), pInput = $("#paletteInput"), pList = $("#paletteList");
  var pResults = [], pActive = 0, lastFocus = null;
  function openPalette() {
    if (!palette.hidden) return;
    lastFocus = document.activeElement;
    palette.hidden = false;
    document.body.classList.add("palette-open");
    pInput.value = "";
    updatePalette();
    setTimeout(function () { pInput.focus(); }, 0);
  }
  function closePalette(restore) {
    if (palette.hidden) return;
    palette.hidden = true;
    document.body.classList.remove("palette-open");
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function updatePalette() {
    var q = pInput.value;
    pResults = search(q);
    pActive = 0;
    if (!pResults.length) {
      pList.innerHTML = '<li class="palette-empty" role="presentation">No results for "' + esc(q) + '"</li>';
      pInput.removeAttribute("aria-activedescendant");
      return;
    }
    pList.innerHTML = pResults.map(function (e, i) {
      return '<li role="option" id="popt-' + i + '" aria-selected="' + (i === 0) + '"><a href="' + esc(e.href) + '"' + (e.ext ? ' target="_blank" rel="noopener"' : "") + ' data-pi="' + i + '" tabindex="-1">' +
        '<span class="p-main"><span class="p-title">' + hl(e.t, q) + (e.ext ? ' <span class="ext">↗</span>' : "") + "</span>" + (e.sub ? '<span class="p-sub">' + esc(e.sub) + "</span>" : "") + "</span>" +
        '<span class="p-kind">' + esc(e.kind) + "</span></a></li>";
    }).join("");
    pInput.setAttribute("aria-activedescendant", "popt-0");
  }
  function setActive(i) {
    if (!pResults.length) return;
    pActive = (i + pResults.length) % pResults.length;
    $$("li[role=option]", pList).forEach(function (li, k) { li.setAttribute("aria-selected", k === pActive); });
    var el = $("#popt-" + pActive);
    if (el) el.scrollIntoView({ block: "nearest" });
    pInput.setAttribute("aria-activedescendant", "popt-" + pActive);
  }
  function go(e) {
    if (!e) return;
    closePalette(false);
    if (e.ext) window.open(e.href, "_blank", "noopener");
    else if (location.hash === e.href) render({ force: true });
    else location.hash = e.href;
  }
  pInput.addEventListener("input", updatePalette);
  pInput.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowDown") { ev.preventDefault(); setActive(pActive + 1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive(pActive - 1); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(pResults[pActive]); }
    else if (ev.key === "Tab") { ev.preventDefault(); setActive(pActive + (ev.shiftKey ? -1 : 1)); }
  });
  pList.addEventListener("click", function (ev) {
    var a = ev.target.closest("a[data-pi]");
    if (!a) return;
    ev.preventDefault();
    go(pResults[+a.getAttribute("data-pi")]);
  });
  pList.addEventListener("mousemove", function (ev) {
    var a = ev.target.closest("a[data-pi]");
    if (a && +a.getAttribute("data-pi") !== pActive) setActive(+a.getAttribute("data-pi"));
  });
  palette.addEventListener("click", function (ev) { if (ev.target.hasAttribute("data-close-palette")) closePalette(); });
  $("#searchBtn").addEventListener("click", openPalette);
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $("#searchKbd").textContent = isMac ? "⌘K" : "Ctrl K";

  /* ------------------------------------------------------------------ theme */
  var root = document.documentElement, themeBtn = $("#themeBtn");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effectiveTheme() { var t = root.getAttribute("data-theme"); return t || (mq && mq.matches ? "dark" : "light"); }
  function syncThemeBtn() { themeBtn.setAttribute("aria-label", effectiveTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme"); }
  themeBtn.addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("asdlc-theme", next); } catch (e) {}
    syncThemeBtn();
  });
  if (mq && mq.addEventListener) mq.addEventListener("change", syncThemeBtn);
  syncThemeBtn();
  var docLink = $("#docLink");
  if (G.docUrl) docLink.href = G.docUrl; else docLink.hidden = true;

  /* ------------------------------------------------------------------ drawer */
  var menuBtn = $("#menuBtn"), scrim = $("#scrim");
  function closeMenu() {
    if (!document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");
    scrim.hidden = true;
  }
  menuBtn.addEventListener("click", function () {
    var open = !document.body.classList.contains("menu-open");
    if (!open) { closeMenu(); menuBtn.focus(); return; }
    document.body.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close navigation");
    scrim.hidden = false;
    var a = $("#sidebar a.active") || $("#sidebar a");
    if (a) setTimeout(function () { a.focus({ preventScroll: true }); }, 50);
  });
  scrim.addEventListener("click", closeMenu);

  /* ------------------------------------------------------------------ global events */
  document.addEventListener("keydown", function (ev) {
    var k = ev.key;
    if ((ev.ctrlKey || ev.metaKey) && (k === "k" || k === "K")) { ev.preventDefault(); if (palette.hidden) openPalette(); else closePalette(); return; }
    if (k === "Escape") {
      if (!palette.hidden) { closePalette(); return; }
      if (document.body.classList.contains("menu-open")) { closeMenu(); menuBtn.focus(); }
      return;
    }
    if (k === "/" && palette.hidden) {
      var t = ev.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      ev.preventDefault(); openPalette();
    }
  });

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-copy],[data-ms-toggle]");
    if (!t) return;
    if (t.hasAttribute("data-copy")) {
      var code = t.closest(".code").querySelector("code").textContent;
      var done = function () { t.textContent = "Copied"; t.classList.add("ok"); setTimeout(function () { t.textContent = "Copy"; t.classList.remove("ok"); }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, function () { fallbackCopy(code); done(); });
      else { fallbackCopy(code); done(); }
    } else {
      var key = t.getAttribute("data-ms-toggle");
      if (state.done[key]) delete state.done[key]; else state.done[key] = true;
      save();
      render({ force: true, keepScroll: true });
      var b = $('[data-ms-toggle="' + key + '"]', t.closest(".ms-end") ? $(".ms-end") : $(".page-head"));
      if (b) b.focus({ preventScroll: true });
    }
  });
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.addEventListener("change", function (ev) {
    var k = ev.target && ev.target.getAttribute && ev.target.getAttribute("data-check");
    if (!k) return;
    if (ev.target.checked) state.checks[k] = true; else delete state.checks[k];
    save();
    var cl = ev.target.closest(".checklist");
    if (cl) {
      var boxes = $$("input[data-check]", cl), n = boxes.filter(function (b) { return b.checked; }).length;
      var cn = $(".cl-count .cl-n", cl); if (cn) cn.textContent = n;
      var bar = $(".cl-bar span", cl); if (bar) bar.style.width = Math.round(n / boxes.length * 100) + "%";
      cl.classList.toggle("complete", n === boxes.length);
      var labEl = cl.closest(".lab");
      if (labEl) {
        var lc = $(".lab-count", labEl);
        if (lc) { $(".cl-n", lc).textContent = n; lc.classList.toggle("ok", n === boxes.length); }
      }
    }
  });

  window.addEventListener("hashchange", function () { render(); });
  render({ noFocus: true });
})();

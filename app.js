(function () {
  "use strict";
  var G = window.GUIDE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- persistence (browser only, fails safely) ---------- */
  var KEY = "asdlc-guide-v1";
  var state = { done: {}, checks: {}, project: null, open: {} };
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) { var p = JSON.parse(raw); state = Object.assign(state, p); }
  } catch (e) { /* storage unavailable — keep in memory */ }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  try { var t = localStorage.getItem("asdlc-theme"); if (t) root.setAttribute("data-theme", t); } catch (e) {}
  $("#themeBtn").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("asdlc-theme", next); } catch (e) {}
  });

  $("#docLink").href = G.docUrl;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ext(url, text) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + text + "</a>"; }
  var ICONS = {
    read: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3.5h8l4 4v9H4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 10h6M7 13h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    pdf: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3.5h8l4 4v9H4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 12.5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    video: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 7.5v5l4.2-2.5z" fill="currentColor"/></svg>',
    docs: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 6l-4 4 4 4M13 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var KIND_LABEL = { read: "Article", pdf: "PDF", video: "Video", docs: "Docs" };
  function checkSvg() { return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  function resourceList(items) {
    return '<ul class="res">' + items.map(function (r) {
      return '<li><a class="res-item" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
        '<span class="res-icon k-' + r.kind + '">' + ICONS[r.kind] + '</span>' +
        '<span class="res-body"><span class="res-title">' + esc(r.t) + '</span>' +
        '<span class="res-meta"><span class="res-kind">' + KIND_LABEL[r.kind] + '</span>' + esc(r.by || "") + '</span>' +
        (r.note ? '<span class="res-note">' + esc(r.note) + '</span>' : "") +
        '</span><span class="res-arrow" aria-hidden="true">↗</span></a></li>';
    }).join("") + "</ul>";
  }

  function checklist(id, title, items) {
    var n = items.filter(function (_, i) { return state.checks[id + ":" + i]; }).length;
    return '<div class="checklist" data-cl="' + id + '"><div class="cl-head"><span>' + esc(title) + '</span><span class="cl-count">' + n + " / " + items.length + "</span></div>" +
      items.map(function (it, i) {
        var k = id + ":" + i;
        return '<label class="check"><input type="checkbox" data-check="' + k + '"' + (state.checks[k] ? " checked" : "") + '><span class="box">' + checkSvg() + '</span><span class="check-text">' + it + "</span></label>";
      }).join("") + "</div>";
  }

  /* ---------- blocks for shared pages ---------- */
  function block(b) {
    switch (b.type) {
      case "lead": return '<p class="lead">' + b.html + "</p>";
      case "h": return "<h2>" + esc(b.text) + "</h2>";
      case "list": return '<ul class="bullets">' + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
      case "callout": return '<div class="callout ' + b.tone + '"><div class="callout-title">' + esc(b.title) + "</div><p>" + b.html + "</p></div>";
      case "source": return '<p class="source">' + b.html + "</p>";
      case "code": return '<pre class="code"><code>' + esc(b.text) + "</code></pre>";
      case "equation": return '<div class="equation">' + b.html + "</div>";
      case "timeline":
        return '<ol class="timeline">' + b.items.map(function (i) { return '<li><span class="tl-when">' + esc(i.when) + '</span><span class="tl-what">' + esc(i.what) + "</span></li>"; }).join("") + "</ol>";
      case "tools":
        return '<div class="tools">' + b.items.map(function (x) {
          return '<article class="tool"><div class="tool-top"><h3>' + esc(x.name) + '</h3><span class="chip">' + esc(x.tag) + '</span></div>' +
            '<div class="tool-free">' + esc(x.free) + '</div><p class="tool-lim">' + esc(x.limits) + '</p><p class="tool-how"><strong>How:</strong> ' + esc(x.how) + "</p>" +
            '<div class="tool-links">' + x.links.map(function (l) { return ext(l.url, esc(l.t) + " ↗"); }).join("") + "</div></article>";
        }).join("") + "</div>";
      case "table":
        return '<div class="table-wrap"><table><thead><tr>' + b.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
          b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
      case "defs":
        return '<dl class="defs">' + b.items.map(function (d) {
          return '<div class="def"><dt>' + esc(d.term) + "</dt><dd>" + esc(d.def) + (d.src ? ' <span class="def-src">' + ext(d.src.url, "Source: " + esc(d.src.t) + " ↗") + "</span>" : "") + "</dd></div>";
        }).join("") + "</dl>";
      case "resources": return resourceList(b.items);
      case "checklist": return checklist(b.id, b.title, b.items);
      case "primitives":
        return '<ol class="prims">' + b.items.map(function (p, i) {
          return '<li class="prim"><span class="prim-n">' + (i + 1) + '</span><div><h3>' + esc(p.t) + "</h3><p>" + esc(p.d) + '</p><p class="prim-done"><strong>Done when:</strong> ' + esc(p.done) + "</p>" +
            (p.src ? '<p class="prim-src">' + ext(p.src.url, esc(p.src.t) + " ↗") + "</p>" : "") + "</div></li>";
        }).join("") + "</ol>";
    }
    return "";
  }

  /* ---------- flow order ---------- */
  function flow() {
    var ids = G.shared.map(function (s) { return s.id; });
    ids.push("project");
    ids.push("deliver");
    return ids;
  }
  function nextOf(id) {
    var f = flow(), i = f.indexOf(id);
    var n = f[i + 1];
    if (n === "project") return state.project ? state.project : "choose";
    return n;
  }
  function projectById(id) { return G.projects.filter(function (p) { return p.id === id; })[0]; }
  function projectProgress(p) {
    var total = p.milestones.length, done = p.milestones.filter(function (m) { return state.done[p.id + "/" + m.id]; }).length;
    return { done: done, total: total, pct: Math.round(done / total * 100) };
  }

  /* ---------- sidebar ---------- */
  function renderSidebar(route) {
    var html = '<div class="side-label">The path</div><ol class="steps">';
    G.shared.forEach(function (s) {
      var active = route.page === s.id, done = state.done[s.id];
      html += '<li><a href="#/' + s.id + '" class="step' + (active ? " active" : "") + (done ? " done" : "") + '"><span class="step-dot">' + (done ? checkSvg() : s.num) + '</span><span class="step-text"><span class="step-title">' + esc(s.title) + '</span><span class="step-kicker">' + esc(s.kicker) + "</span></span></a></li>";
    });
    var anyProj = G.projects.some(function (p) { return route.page === p.id; }) || route.page === "choose";
    html += '<li><a href="#/choose" class="step' + (anyProj ? " active-soft" : "") + '"><span class="step-dot">05</span><span class="step-text"><span class="step-title">Your project</span><span class="step-kicker">Pick your track</span></span></a>';
    html += '<ul class="proj-list">';
    G.projects.forEach(function (p) {
      var pr = projectProgress(p), active = route.page === p.id;
      html += '<li><a href="#/' + p.id + '" class="proj-link c-' + p.color + (active ? " active" : "") + '"><span class="proj-slot">' + esc(p.slot) + '</span><span class="proj-name">' + esc(p.short) + '</span><span class="mini-bar"><span style="width:' + pr.pct + '%"></span></span></a>';
      if (active) {
        html += '<ul class="ms-list">' + p.milestones.map(function (m) {
          var d = state.done[p.id + "/" + m.id];
          return '<li><a href="#/' + p.id + "/" + m.id + '" class="ms-link' + (d ? " done" : "") + (route.sub === m.id ? " active" : "") + '"><span class="ms-dot">' + (d ? checkSvg() : "") + "</span>" + esc(m.when) + " · " + esc(m.title) + "</a></li>";
        }).join("") + "</ul>";
      }
      html += "</li>";
    });
    html += "</ul></li>";
    html += '<li><a href="#/deliver" class="step' + (route.page === "deliver" ? " active" : "") + (state.done.deliver ? " done" : "") + '"><span class="step-dot">' + (state.done.deliver ? checkSvg() : "06") + '</span><span class="step-text"><span class="step-title">Final delivery</span><span class="step-kicker">Rubric &amp; submission</span></span></a></li>';
    html += "</ol>";
    html += '<div class="side-foot">Supervisor: ' + esc(G.supervisor) + '<br>Tools &amp; limits checked ' + esc(G.lastVerified) + '<br><a href="' + G.docUrl + '" target="_blank" rel="noopener">Official project definitions ↗</a></div>';
    $("#sidebar").innerHTML = html;
  }

  /* ---------- pages ---------- */
  function pager(id, nextId, nextLabel) {
    var done = state.done[id];
    return '<div class="pager"><button class="btn primary" data-done="' + id + '" data-go="' + nextId + '">' +
      (done ? "Continue" : "Mark as done &amp; continue") + ' <span aria-hidden="true">→</span></button>' +
      '<a class="btn ghost" href="#/' + nextId + '">Skip to ' + esc(nextLabel) + "</a>" +
      (done ? '<button class="btn text" data-undo="' + id + '">Mark as not done</button>' : "") + "</div>";
  }
  function labelFor(id) {
    if (id === "choose") return "your project";
    if (id === "deliver") return "Final delivery";
    var s = G.shared.filter(function (x) { return x.id === id; })[0];
    if (s) return s.title;
    var p = projectById(id);
    return p ? p.short : id;
  }

  function sharedPage(s) {
    var n = nextOf(s.id);
    return '<article class="page"><header class="page-head"><div class="eyebrow">Step ' + s.num + " · " + esc(s.kicker) + "</div><h1>" + esc(s.title) + '</h1><p class="summary">' + esc(s.summary) + "</p></header>" +
      s.blocks.map(block).join("") + pager(s.id, n, labelFor(n)) + "</article>";
  }

  function choosePage() {
    return '<article class="page"><header class="page-head"><div class="eyebrow">Step 05</div><h1>Pick your project track</h1><p class="summary">Each track has its own milestones, deliverables, measures and evidence. Your choice is remembered in this browser.</p></header>' +
      '<div class="proj-cards">' + G.projects.map(function (p) {
        var pr = projectProgress(p);
        return '<a class="proj-card c-' + p.color + '" href="#/' + p.id + '" data-pick="' + p.id + '"><span class="proj-card-slot">' + esc(p.slot) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.oneLiner) + '</p><span class="proj-card-foot"><span class="mini-bar"><span style="width:' + pr.pct + '%"></span></span><span>' + pr.done + "/" + pr.total + " milestones</span></span></a>";
      }).join("") + "</div></article>";
  }

  function projectPage(p, sub) {
    var pr = projectProgress(p);
    var openId = sub || state.open[p.id] || firstOpenMilestone(p);
    var h = '<article class="page project c-' + p.color + '">';
    h += '<header class="page-head proj-head"><div class="eyebrow"><span class="slot-chip">' + esc(p.slot) + "</span> Project track</div><h1>" + esc(p.title) + '</h1><p class="summary">' + esc(p.oneLiner) + "</p>";
    h += '<div class="meta-grid"><div><span class="meta-k">Module sessions</span><span>' + esc(p.sessions) + '</span></div><div><span class="meta-k">Industry parallels</span><span>' + esc(p.parallels) + "</span></div></div>";
    h += '<div class="prog"><div class="prog-bar"><span style="width:' + pr.pct + '%"></span></div><span class="prog-txt">' + pr.done + " of " + pr.total + " milestones done</span></div></header>";

    h += '<section class="why"><h2>Why this matters</h2>' + p.why.map(function (w) { return "<p>" + w + "</p>"; }).join("") + "</section>";
    h += '<h2>Is this done in big tech? Yes.</h2><div class="evidence">' + p.evidence.map(function (e) {
      return '<figure class="ev"><div class="ev-org">' + esc(e.org) + '</div><div class="ev-stat">' + esc(e.stat) + '</div><figcaption>' + esc(e.label) + '</figcaption><div class="ev-src">' + ext(e.src.url, esc(e.src.t) + " ↗") + "</div></figure>";
    }).join("") + "</div>";
    h += '<div class="callout lesson"><div class="callout-title">The lesson for your build</div><p>' + p.lesson + "</p></div>";
    if (p.note) h += '<div class="callout warn"><div class="callout-title">Note for your pair</div><p>' + esc(p.note) + "</p></div>";

    // milestone rail
    h += '<h2 id="milestones">Milestones</h2><ol class="rail">' + p.milestones.map(function (m, i) {
      var d = state.done[p.id + "/" + m.id];
      return '<li class="' + (d ? "done" : "") + (m.id === openId ? " current" : "") + '"><a href="#/' + p.id + "/" + m.id + '"><span class="rail-dot">' + (d ? checkSvg() : i + 1) + '</span><span class="rail-when">' + esc(m.when) + '</span><span class="rail-title">' + esc(m.title) + "</span></a></li>";
    }).join("") + "</ol>";

    h += '<div class="milestones">' + p.milestones.map(function (m, i) { return milestone(p, m, i, m.id === openId); }).join("") + "</div>";

    h += '<section class="mvd"><h2>Minimum viable deliverable <span class="mvd-sub">— what earns the pass</span></h2>' + checklist(p.id + "-mvd", "Final check before submission", p.mvd) +
      '<p class="stack"><strong>Suggested stack:</strong> ' + esc(p.stack) + "</p>" +
      '<p class="source">Scope, weekly plan and MVD come from the ' + ext(G.docUrl, "official project definitions ↗") + ".</p></section>";
    h += '<div class="pager"><a class="btn primary" href="#/deliver">Go to final delivery <span aria-hidden="true">→</span></a></div>';
    h += "</article>";
    return h;
  }

  function firstOpenMilestone(p) {
    for (var i = 0; i < p.milestones.length; i++) if (!state.done[p.id + "/" + p.milestones[i].id]) return p.milestones[i].id;
    return p.milestones[0].id;
  }

  function milestone(p, m, i, open) {
    var key = p.id + "/" + m.id, d = state.done[key];
    var next = p.milestones[i + 1];
    var h = '<section class="ms' + (open ? " open" : "") + (d ? " done" : "") + '" id="' + p.id + "-" + m.id + '">';
    h += '<button class="ms-head" aria-expanded="' + open + '" data-toggle="' + key + '"><span class="ms-num">' + (d ? checkSvg() : i + 1) + '</span><span class="ms-titles"><span class="ms-when">' + esc(m.when) + '</span><span class="ms-title">' + esc(m.title) + '</span></span><span class="ms-status">' + (d ? "Done" : "") + '</span><span class="chev" aria-hidden="true"></span></button>';
    h += '<div class="ms-body"><p class="ms-goal">' + m.goal + "</p>";
    h += '<div class="bdm"><div class="col"><h4><span class="tag t-build">Build</span></h4><ol>' + m.build.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol></div>";
    h += '<div class="col"><h4><span class="tag t-deliver">Deliver</span></h4><ul>' + m.deliver.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div></div>";
    h += '<div class="measure"><h4><span class="tag t-measure">Measure</span> Tick when true — each one should be provable from your repo</h4>' + checklist(key, "Done-when checks", m.measure) + "</div>";
    if (m.resources && m.resources.length) h += '<div class="ms-res"><h4>Resources for this milestone</h4>' + resourceList(m.resources) + "</div>";
    h += '<div class="ms-actions">';
    if (next) h += '<button class="btn primary" data-msdone="' + key + '" data-msnext="' + p.id + "/" + next.id + '">' + (d ? "Go to" : "Mark done → go to") + " " + esc(next.when) + ' <span aria-hidden="true">→</span></button>';
    else h += '<button class="btn primary" data-msdone="' + key + '" data-msnext="deliver">' + (d ? "Go to" : "Mark done → go to") + ' final delivery <span aria-hidden="true">→</span></button>';
    if (next) h += '<a class="btn ghost" href="#/' + p.id + "/" + next.id + '">Just look at ' + esc(next.when) + "</a>";
    if (d) h += '<button class="btn text" data-msundo="' + key + '">Mark as not done</button>';
    h += "</div></div></section>";
    return h;
  }

  function deliverPage() {
    var h = '<article class="page"><header class="page-head"><div class="eyebrow">Step 06 · End of month 2</div><h1>Final delivery</h1><p class="summary">One rubric for every project, so grading is fair whichever track you picked.</p></header>';
    h += '<div class="rubric">' + G.rubric.map(function (r) {
      return '<div class="rub"><div class="rub-top"><span class="rub-name">' + esc(r[0]) + '</span><span class="rub-w">' + r[1] + '%</span></div><div class="rub-bar"><span style="width:' + (r[1] * 4) + '%"></span></div><p>' + esc(r[2]) + "</p></div>";
    }).join("") + "</div>";
    h += '<p class="source">Weights are illustrative and may be adjusted by the professor — see the ' + ext(G.docUrl, "project definitions ↗") + ".</p>";
    h += "<h2>Submission package</h2>" + checklist("deliver-pkg", "Everything a reviewer needs", [
      "Public repo link, with a README whose first command sets everything up from a fresh clone.",
      "evals/RESULTS.md with three dated rows (baseline / mid / final), each with a commit hash.",
      "3-minute demo video link (unlisted YouTube or Drive) showing real work, not slides.",
      "Post-mortem in docs/postmortem.md: what worked, what broke, what you'd change, what it cost to run.",
      "AGENTS.md and skills/ in the repo, with a Git history showing how they evolved.",
      "Stretch goal(s) attempted, with an honest report."
    ]);
    h += "<h2>What we insist on — and what we're relaxed about</h2><div class=\"two-col\"><div class=\"callout warn\"><div class=\"callout-title\">Non-negotiable</div><ul class=\"bullets\"><li>Public repo from week 1, not week 4.</li><li>Evals written before or alongside the code.</li><li>Observability by week 2 at the latest.</li><li>A written post-mortem.</li></ul></div><div class=\"callout info\"><div class=\"callout-title\">Your call</div><ul class=\"bullets\"><li>Language, framework and vendor SDK.</li><li>Whether stretch goals succeed — an honest failure beats not trying.</li><li>Absolute eval scores — the trajectory and your understanding of it matter more.</li></ul></div></div>";
    h += '<div class="pager"><button class="btn primary" data-done="deliver" data-go="' + (state.project || "choose") + '">' + (state.done.deliver ? "Back to my project" : "Mark as done") + '</button></div></article>';
    return h;
  }

  /* ---------- router ---------- */
  function parse() {
    var h = (location.hash || "#/start").replace(/^#\/?/, "").split("/");
    return { page: h[0] || "start", sub: h[1] || null };
  }
  function render() {
    var r = parse();
    var s = G.shared.filter(function (x) { return x.id === r.page; })[0];
    var p = projectById(r.page);
    var html;
    if (s) html = sharedPage(s);
    else if (p) { state.project = p.id; if (r.sub) state.open[p.id] = r.sub; save(); html = projectPage(p, r.sub); }
    else if (r.page === "choose") html = choosePage();
    else if (r.page === "deliver") html = deliverPage();
    else { location.hash = "#/start"; return; }
    $("#content").innerHTML = html;
    $$("a[data-doc]").forEach(function (a) { a.href = G.docUrl; });
    renderSidebar(r);
    closeMenu();
    if (p && r.sub) {
      var el = document.getElementById(p.id + "-" + r.sub);
      if (el) { setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30); return; }
    }
    window.scrollTo(0, 0);
    $("#content").focus({ preventScroll: true });
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-done],[data-undo],[data-toggle],[data-msdone],[data-msundo]");
    if (!t) return;
    if (t.dataset.done) {
      state.done[t.dataset.done] = true; save();
      if (location.hash === "#/" + t.dataset.go) render(); else location.hash = "#/" + t.dataset.go;
    } else if (t.dataset.undo) {
      delete state.done[t.dataset.undo]; save(); render();
    } else if (t.dataset.toggle) {
      var sec = t.closest(".ms"); var open = !sec.classList.contains("open");
      sec.classList.toggle("open", open); t.setAttribute("aria-expanded", open);
    } else if (t.dataset.msdone) {
      state.done[t.dataset.msdone] = true; save();
      var target = "#/" + t.dataset.msnext;
      if (location.hash === target) render(); else location.hash = target;
    } else if (t.dataset.msundo) {
      delete state.done[t.dataset.msundo]; save(); render();
    }
  });
  document.addEventListener("change", function (e) {
    var k = e.target.dataset && e.target.dataset.check;
    if (!k) return;
    if (e.target.checked) state.checks[k] = true; else delete state.checks[k];
    save();
    var cl = e.target.closest(".checklist");
    if (cl) {
      var boxes = $$("input[data-check]", cl);
      $(".cl-count", cl).textContent = boxes.filter(function (b) { return b.checked; }).length + " / " + boxes.length;
    }
  });

  var menuBtn = $("#menuBtn");
  function closeMenu() { document.body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var o = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", o);
  });
  $("#scrim").addEventListener("click", closeMenu);

  window.addEventListener("hashchange", render);
  render();
})();

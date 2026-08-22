/* ============ 新中式 日期 / 时间 选择器 ============ */
(function () {
  if (document.getElementById("dtPickerStyle")) return;
  var style = document.createElement("style");
  style.id = "dtPickerStyle";
  style.textContent = [
    ".dtp-wrap{position:relative;width:100%}",
    ".dtp-field{width:100%;padding:10px 12px;border:1px solid #ddd2ba;border-radius:5px;background:#fffdf6;font-size:14px;color:#2f3a34;outline:none;text-align:left;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:space-between}",
    ".dtp-field .dtp-ph{color:#9a9283}",
    ".dtp-field .dtp-arrow{color:#b09a68;font-size:10px;margin-left:8px;letter-spacing:0}",
    ".dtp-pop{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:330;min-width:min(260px,calc(100vw - 40px));background:#fffdf7;border:1px solid #d8d2c4;border-radius:10px;box-shadow:0 12px 32px rgba(47,58,52,.16);padding:12px;display:none}",
    ".dtp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}",
    ".dtp-title{font-size:15px;font-weight:700;letter-spacing:2px;color:#2f3a34}",
    ".dtp-nav{width:28px;height:28px;border-radius:6px;border:1px solid #ddd2ba;background:#fffdf7;color:#8a674d;font-size:16px;cursor:pointer;line-height:1}",
    ".dtp-nav:hover{background:#efe7d4}",
    ".dtp-week{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:11px;color:#9a9283;margin-bottom:4px}",
    ".dtp-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}",
    ".dtp-empty{height:30px}",
    ".dtp-day{height:30px;border:none;background:transparent;border-radius:6px;font-size:13px;color:#2f3a34;cursor:pointer}",
    ".dtp-day:hover{background:#efe7d4}",
    ".dtp-day.today{box-shadow:inset 0 0 0 1px #b09a68}",
    ".dtp-day.sel{background:#2f5d50;color:#fffdf7}",
    ".dtp-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}",
    ".dtp-btn{border:none;border-radius:6px;padding:8px 18px;font-size:13px;cursor:pointer;letter-spacing:2px;font-family:inherit}",
    ".dtp-btn.ghost{background:#fff;border:1px solid #ddd2ba;color:#7a8078}",
    ".dtp-btn.primary{background:#2f5d50;color:#f6f1e2}",
    ".dtp-time{display:flex;gap:6px;align-items:stretch}",
    ".dtp-col{flex:1;overflow-y:auto;max-height:220px;border:1px solid #eee5d2;border-radius:8px;background:#fbf6ea;padding:4px}",
    ".dtp-t{display:block;width:100%;border:none;background:transparent;padding:8px 0;font-size:14px;color:#2f3a34;border-radius:5px;cursor:pointer;text-align:center;font-family:inherit}",
    ".dtp-t.sel{background:#2f5d50;color:#fffdf7}",
    ".dtp-colon{align-self:center;color:#8a674d;font-size:18px;font-weight:700}"
  ].join("\n");
  document.head.appendChild(style);

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function adaptPop(pop, field) {
    var fr = field.getBoundingClientRect();
    var popW = pop.offsetWidth || 280;
    var popH = pop.offsetHeight || 320;
    var left = Math.min(Math.max(8, fr.left), Math.max(8, window.innerWidth - popW - 8));
    var top = fr.bottom + 4;
    if (top + popH > window.innerHeight - 8 && fr.top - popH - 4 > 8) top = fr.top - popH - 4;
    pop.style.position = "fixed";
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    pop.style.right = "auto";
    pop.style.bottom = "auto";
    pop.style.width = Math.min(popW, window.innerWidth - 16) + "px";
    pop.style.display = "block";
  }

  function buildDatePicker(inp, field, pop, updateField) {
    var now = new Date();
    var sv = inp.value || "";
    var selY = sv.length >= 10 ? +sv.slice(0, 4) : 0;
    var selM = sv.length >= 10 ? +sv.slice(5, 7) : 0;
    var selD = sv.length >= 10 ? +sv.slice(8, 10) : 0;
    var viewY = selY || now.getFullYear();
    var viewM = selM || now.getMonth() + 1;
    function render() {
      var first = new Date(viewY, viewM - 1, 1);
      var startDow = first.getDay();
      var daysInMonth = new Date(viewY, viewM, 0).getDate();
      var today = new Date();
      var html = '<div class="dtp-head"><button type="button" class="dtp-nav" data-nav="-1">‹</button>' +
        '<span class="dtp-title">' + viewY + " 年 " + viewM + " 月</span>" +
        '<button type="button" class="dtp-nav" data-nav="1">›</button></div>';
      html += '<div class="dtp-week">' + ["日","一","二","三","四","五","六"].map(function (w) { return "<span>" + w + "</span>"; }).join("") + "</div>";
      html += '<div class="dtp-grid">';
      for (var i = 0; i < startDow; i++) html += '<span class="dtp-empty"></span>';
      for (var d = 1; d <= daysInMonth; d++) {
        var cls = "dtp-day";
        if (selY === viewY && selM === viewM && selD === d) cls += " sel";
        if (today.getFullYear() === viewY && today.getMonth() + 1 === viewM && today.getDate() === d) cls += " today";
        html += '<button type="button" class="' + cls + '" data-d="' + d + '">' + d + "</button>";
      }
      html += "</div>";
      html += '<div class="dtp-foot"><button type="button" class="dtp-btn ghost" data-act="today">今天</button>' +
        '<button type="button" class="dtp-btn primary" data-act="ok">确认</button></div>';
      pop.innerHTML = html;
      adaptPop(pop, field);
    }
    pop.addEventListener("click", function (e) {
      e.stopPropagation();
      var nav = e.target.closest("[data-nav]");
      if (nav) { viewM += +nav.dataset.nav; if (viewM < 1) { viewM = 12; viewY--; } else if (viewM > 12) { viewM = 1; viewY++; } render(); return; }
      var day = e.target.closest("[data-d]");
      if (day) { selY = viewY; selM = viewM; selD = +day.dataset.d; render(); return; }
      var act = e.target.closest("[data-act]");
      if (!act) return;
      if (act.dataset.act === "today") {
        var t = new Date();
        selY = t.getFullYear(); selM = t.getMonth() + 1; selD = t.getDate();
        viewY = selY; viewM = selM;
        render(); return;
      }
      if (act.dataset.act === "ok") {
        var t2 = new Date();
        if (!selY) { selY = t2.getFullYear(); selM = t2.getMonth() + 1; selD = t2.getDate(); }
        inp.value = pad(selY) + "-" + pad(selM) + "-" + pad(selD);
        updateField();
        pop.style.display = "none";
      }
    });
    render();
  }

  function buildTimePicker(inp, field, pop, updateField) {
    var sv = inp.value || "";
    var hh = sv ? +sv.slice(0, 2) : 18;
    var mm = sv ? +sv.slice(3, 5) : 30;
    function render() {
      var hours = [], mins = [];
      for (var h = 0; h < 24; h++) hours.push(h);
      for (var m = 0; m < 60; m += 5) mins.push(m);
      if (mins.indexOf(mm) === -1) mins.push(mm);
      mins.sort(function (a, b) { return a - b; });
      var html = '<div class="dtp-time">' +
        '<div class="dtp-col" data-col="h">' + hours.map(function (h) { return '<button type="button" class="dtp-t' + (h === hh ? " sel" : "") + '" data-v="' + h + '">' + pad(h) + "</button>"; }).join("") + '</div>' +
        '<span class="dtp-colon">:</span>' +
        '<div class="dtp-col" data-col="m">' + mins.map(function (m) { return '<button type="button" class="dtp-t' + (m === mm ? " sel" : "") + '" data-v="' + m + '">' + pad(m) + "</button>"; }).join("") + '</div></div>';
      html += '<div class="dtp-foot"><button type="button" class="dtp-btn primary" data-act="ok">确认</button></div>';
      pop.innerHTML = html;
      adaptPop(pop, field);
      var selH = pop.querySelector('[data-col="h"] .sel');
      var selM = pop.querySelector('[data-col="m"] .sel');
      if (selH) selH.scrollIntoView({ block: "center" });
      if (selM) selM.scrollIntoView({ block: "center" });
    }
    pop.addEventListener("click", function (e) {
      e.stopPropagation();
      var t = e.target.closest(".dtp-t");
      if (t) {
        var col = t.closest("[data-col]").dataset.col;
        var v = +t.dataset.v;
        if (col === "h") hh = v; else mm = v;
        render();
        return;
      }
      if (e.target.closest('[data-act="ok"]')) {
        inp.value = pad(hh) + ":" + pad(mm);
        updateField();
        pop.style.display = "none";
      }
    });
    render();
  }

  function init() {
    var inputs = document.querySelectorAll("input[data-dtp]");
    Array.prototype.forEach.call(inputs, function (inp) {
      var type = inp.getAttribute("type");
      var ph = type === "date" ? "选择日期" : "选择时间";
      var wrap = document.createElement("div");
      wrap.className = "dtp-wrap";
      inp.parentNode.insertBefore(wrap, inp);
      var field = document.createElement("button");
      field.type = "button";
      field.className = "dtp-field";
      wrap.appendChild(field);
      var pop = document.createElement("div");
      pop.className = "dtp-pop";
      wrap.appendChild(pop);
      inp.style.position = "absolute";
      inp.style.opacity = "0";
      inp.style.width = "1px";
      inp.style.height = "1px";
      inp.style.pointerEvents = "none";
      wrap.appendChild(inp);
      function updateField() {
        var v = inp.value || "";
        field.innerHTML = (v ? v : '<span class="dtp-ph">' + ph + "</span>") + '<span class="dtp-arrow">▼</span>';
      }
      field.addEventListener("click", function (e) {
        e.stopPropagation();
        updateField();
        pop.style.display = pop.style.display === "block" ? "none" : "block";
        if (pop.style.display === "block") {
          if (type === "date") { pop.innerHTML = ""; buildDatePicker(inp, field, pop, updateField); }
          else { pop.innerHTML = ""; buildTimePicker(inp, field, pop, updateField); }
        }
      });
      document.addEventListener("click", function () { pop.style.display = "none"; });
      updateField();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

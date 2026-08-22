/* ============ 部门选择器（可选择 / 可输入） ============ */
(function () {
  var DEPTS = ["制造中心","品质中心","财务中心","人力行政中心","研发中心","镁乐","iHit事业中心","供应链中心","CAN事业中心","营销中心","产品中心","信息中心","战略中心","研究院","S01事业中心","WD事业中心","经管办","Smiss Global","铂岚"];
  if (document.getElementById("deptPickerStyle")) return;
  var style = document.createElement("style");
  style.id = "deptPickerStyle";
  style.textContent = [
    ".dept-wrap{position:relative;width:100%}",
    ".dept-panel{position:fixed;z-index:320;display:none;background:#fffdf7;border:1px solid #d8d2c4;border-radius:10px;box-shadow:0 12px 32px rgba(47,58,52,.16);max-height:240px;overflow-y:auto;padding:6px}",
    ".dept-opt{padding:9px 12px;font-size:14px;color:#2f3a34;border-radius:7px;cursor:pointer;letter-spacing:1px;transition:background .12s}",
    ".dept-opt:hover,.dept-opt.active{background:#efe7d4}",
    ".dept-opt.active::after{content:\"◆\";float:right;font-size:9px;color:#b09a68;margin-top:3px}",
    ".dept-empty{padding:10px 12px;font-size:13px;color:#9a9283}"
  ].join("\n");
  document.head.appendChild(style);

  function init() {
    var inputs = document.querySelectorAll("input[data-dept-picker]");
    Array.prototype.forEach.call(inputs, function (inp) {
      var wrap = document.createElement("div");
      wrap.className = "dept-wrap";
      inp.parentNode.insertBefore(wrap, inp);
      wrap.appendChild(inp);
      var panel = document.createElement("div");
      panel.className = "dept-panel";
      wrap.appendChild(panel);
      var active = -1;
      function showPanel() {
        panel.style.display = "block";
        var pw = panel.offsetWidth || 260;
        var ph = panel.offsetHeight || 240;
        var ir = inp.getBoundingClientRect();
        var left = Math.min(Math.max(8, ir.left), Math.max(8, window.innerWidth - pw - 8));
        var top = ir.bottom + 4;
        if (top + ph > window.innerHeight - 8 && ir.top - ph - 4 > 8) top = ir.top - ph - 4;
        panel.style.left = left + "px";
        panel.style.top = top + "px";
        panel.style.right = "auto";
        panel.style.bottom = "auto";
        panel.style.width = Math.min(pw, window.innerWidth - 16) + "px";
      }
      function render(filter) {
        var kw = (filter || "").trim().toLowerCase();
        var list = DEPTS.filter(function (d) { return !kw || d.toLowerCase().indexOf(kw) !== -1; });
        if (!list.length) {
          panel.innerHTML = '<div class="dept-empty">未找到该部门，可直接输入</div>';
          showPanel();
          active = -1;
          return;
        }
        panel.innerHTML = "";
        list.forEach(function (d, i) {
          var el = document.createElement("div");
          el.className = "dept-opt";
          el.textContent = d;
          el.addEventListener("mousedown", function (e) {
            e.preventDefault();
            inp.value = d;
            hide();
          });
          el.addEventListener("touchstart", function (e) {
            e.preventDefault();
            inp.value = d;
            hide();
          });
          panel.appendChild(el);
        });
        showPanel();
      }
      function hide() { panel.style.display = "none"; active = -1; }
      function highlight() {
        var opts = panel.querySelectorAll(".dept-opt");
        Array.prototype.forEach.call(opts, function (el, i) { el.classList.toggle("active", i === active); });
        if (opts[active]) opts[active].scrollIntoView({ block: "nearest" });
      }
      inp.addEventListener("focus", function () { render(inp.value); });
      inp.addEventListener("input", function () { active = -1; render(inp.value); });
      inp.addEventListener("keydown", function (e) {
        var opts = panel.querySelectorAll(".dept-opt");
        if (!opts.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, opts.length - 1); highlight(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
        else if (e.key === "Enter") { if (active >= 0) { e.preventDefault(); inp.value = opts[active].textContent; hide(); } }
      });
      document.addEventListener("click", function (e) { if (e.target && e.target.closest && !e.target.closest(".dept-panel") && e.target !== inp) hide(); });
      document.addEventListener("touchstart", function (e) { if (e.target && e.target.closest && !e.target.closest(".dept-panel") && e.target !== inp) hide(); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

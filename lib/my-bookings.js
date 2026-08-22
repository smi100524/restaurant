/* ============ 我的预订（手机号查询已预订菜单） ============ */
(function () {
  if (document.getElementById("myBookStyle")) return;
  var style = document.createElement("style");
  style.id = "myBookStyle";
  style.textContent = [
    ".mybook-modal{position:fixed;inset:0;background:rgba(20,28,24,.45);display:none;align-items:center;justify-content:center;z-index:400;padding:20px}",
    ".mybook-modal.show{display:flex}",
    ".mybook-card{background:#fffdf7;border:1px solid #d8d2c4;border-radius:14px;max-width:440px;width:100%;max-height:82vh;display:flex;flex-direction:column;box-shadow:0 16px 48px rgba(0,0,0,.22)}",
    ".mybook-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #e5ddc9}",
    ".mybook-head h3{font-size:17px;font-weight:700;letter-spacing:4px;color:#2f3a34}",
    ".mybook-close{border:none;background:none;font-size:16px;color:#8a8172;cursor:pointer;padding:4px 8px}",
    ".mybook-body{padding:16px 20px;overflow-y:auto}",
    ".mybook-search{display:flex;gap:8px;margin-bottom:14px}",
    ".mybook-search input{flex:1;padding:10px 12px;border:1px solid #ddd2ba;border-radius:8px;background:#fff;font-size:14px;outline:none;font-family:inherit}",
    ".mybook-search input:focus{border-color:#5f7f79}",
    ".mybook-query{border:none;border-radius:8px;background:#2f5d50;color:#f6f1e2;padding:10px 18px;font-size:14px;letter-spacing:2px;cursor:pointer;font-family:inherit}",
    ".mybook-loading,.mybook-empty{padding:28px 10px;text-align:center;font-size:14px;color:#9a9283}",
    ".mb-item{border:1px solid #e5ddc9;border-radius:10px;padding:12px 14px;margin-bottom:10px;background:#fff}",
    ".mb-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}",
    ".mb-top b{font-size:14px;color:#2f3a34;letter-spacing:1px}",
    ".mb-date{font-size:13px;color:#8a674d}",
    ".mb-meta{font-size:13px;color:#7a8078;margin-top:4px}",
    ".mb-items{margin-top:8px;border-top:1px dashed #e5ddc9;padding-top:6px}",
    ".mb-it{display:flex;justify-content:space-between;font-size:13px;color:#2f3a34;padding:3px 0}",
    ".mb-total{display:flex;justify-content:flex-end;font-size:13px;color:#9e3b2c;margin-top:4px;font-weight:700}",
    ".mb-kind{display:inline-block;font-size:11px;padding:1px 8px;border-radius:999px;margin-left:8px;background:#eef3ef;color:#4c6b65}"
  ].join("\n");
  document.head.appendChild(style);

  var modal = document.createElement("div");
  modal.className = "mybook-modal";
  modal.innerHTML = '<div class="mybook-card">' +
    '<div class="mybook-head"><h3>我的预订</h3><button class="mybook-close" data-act="close" type="button">✕</button></div>' +
    '<div class="mybook-body">' +
    '<div class="mybook-search"><input id="mybookPhone" type="tel" placeholder="请输入预订时填写的手机号" autocomplete="off"><button class="mybook-query" data-act="query" type="button">查询</button></div>' +
    '<div class="mybook-list" id="mybookList"></div>' +
    "</div></div>";
  document.body.appendChild(modal);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function open() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    try { var p = localStorage.getItem("mybook_phone"); if (p) document.getElementById("mybookPhone").value = p; } catch (e) {}
    document.getElementById("mybookList").innerHTML = '<div class="mybook-empty">输入手机号，即可查看已预订的菜单</div>';
    setTimeout(function () { try { document.getElementById("mybookPhone").focus(); } catch (e) {} }, 120);
  }
  function close() { modal.classList.remove("show"); document.body.style.overflow = ""; }
  async function query() {
    var phone = document.getElementById("mybookPhone").value.trim();
    if (!phone) { document.getElementById("mybookList").innerHTML = '<div class="mybook-empty">请输入手机号</div>'; return; }
    try { localStorage.setItem("mybook_phone", phone); } catch (e) {}
    var list = document.getElementById("mybookList");
    list.innerHTML = '<div class="mybook-loading">正在查询…</div>';
    var entries = [];
    try {
      var r = await sbFetch("reservations?select=*&phone=eq." + encodeURIComponent(phone) + "&order=ts.desc");
      if (Array.isArray(r)) r.forEach(function (x) { entries.push({ kind: "resv", ts: x.ts || 0, date: x.book_date || "", time: x.book_time || "", room: x.room || "", people: x.people || 1, note: x.note || "", no: "", items: null, total: 0 }); });
    } catch (e) {}
    try {
      var o = await sbFetch("orders?select=*&phone=eq." + encodeURIComponent(phone) + "&order=ts.desc");
      if (Array.isArray(o)) o.forEach(function (x) { entries.push({ kind: "order", ts: x.ts || 0, date: x.book_date || "", time: x.book_time || "", room: x.room || "", people: x.people || 1, note: x.note || "", no: x.no || "", items: Array.isArray(x.items) ? x.items : [], total: x.total || 0 }); });
    } catch (e) {}
    entries.sort(function (a, b) { return b.ts - a.ts; });
    if (!entries.length) { list.innerHTML = '<div class="mybook-empty">未找到该手机号的预订，请核对手机号</div>'; return; }
    list.innerHTML = entries.map(function (e) {
      var html = '<div class="mb-item">' +
        '<div class="mb-top"><b>' + (e.kind === "order" ? "订单 " + esc(e.no) : "预订记录") + '<span class="mb-kind">' + (e.kind === "order" ? "已下单" : "已预订") + "</span></b>" +
        '<span class="mb-date">' + esc(e.date) + " " + esc(e.time) + "</span></div>" +
        '<div class="mb-meta">' + esc(e.room || "未指定包间") + " · " + e.people + " 人" + (e.note ? " · " + esc(e.note) : "") + "</div>";
      if (e.kind === "order" && e.items && e.items.length) {
        html += '<div class="mb-items">' + e.items.map(function (i) { return '<div class="mb-it"><span>' + esc(i.name) + " × " + i.qty + "</span><b>¥" + (i.price * i.qty) + "</b></div>"; }).join("") + "</div>" +
          '<div class="mb-total">合计 ¥' + e.total + "</div>";
      }
      html += "</div>";
      return html;
    }).join("");
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal) close();
    var act = e.target.closest("[data-act]");
    if (!act) return;
    if (act.dataset.act === "close") close();
    if (act.dataset.act === "query") query();
  });
  modal.addEventListener("keydown", function (e) { if (e.key === "Enter") query(); });
  window.openMyBookings = open;
  var btn = document.getElementById("myBookBtn");
  if (btn) btn.addEventListener("click", open);
})();

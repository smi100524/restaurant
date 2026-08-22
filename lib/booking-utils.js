/* ============ 包间预订冲突检测（同一时段同一包间不可重复预订） ============ */
(function () {
  function toMin(t) {
    if (!t) return -1;
    var p = String(t).split(":");
    if (p.length < 2) return -1;
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m)) return -1;
    return h * 60 + m;
  }
  // 同一包间、同一天、时间重叠（默认 3 小时内视为同一时段）
  window.checkRoomConflict = async function (room, date, time) {
    if (!room || !date || !time) return null;
    var t1 = toMin(time);
    if (t1 < 0) return null;
    var lists = [];
    try {
      var r = await sbFetch("reservations?select=*&book_date=eq." + encodeURIComponent(date));
      if (Array.isArray(r)) lists.push(r);
    } catch (e) {}
    try {
      var o = await sbFetch("orders?select=*&book_date=eq." + encodeURIComponent(date));
      if (Array.isArray(o)) lists.push(o);
    } catch (e) {}
    for (var i = 0; i < lists.length; i++) {
      var rows = lists[i];
      for (var j = 0; j < rows.length; j++) {
        var row = rows[j];
        if (row.room === room && row.book_date === date) {
          var t2 = toMin(row.book_time || "");
          if (t2 >= 0 && Math.abs(t1 - t2) < 180) {
            return "该包间（" + room + "）在 " + (row.book_time || "") + " 已被预订，请选择其他时间或包间";
          }
        }
      }
    }
    return null;
  };
})();

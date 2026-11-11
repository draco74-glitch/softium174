/* Цели Яндекс.Метрики (счётчик 114139660). Создайте в Метрике JavaScript-события с этими идентификаторами. */
(function () {
  "use strict";
  var ID = 114139660;
  var sent = {};
  function goal(name, once) {
    if (once && sent[name]) return;
    sent[name] = true;
    try { if (typeof ym === "function") ym(ID, "reachGoal", name); } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) goal("phone_click");
    else if (/t\.me|max\.ru|vk\.com/.test(href)) goal("messenger_click");
    else if (href === "#enroll" || href === "#signup") goal("cta_click");
    else if (a.classList.contains("doc-card")) goal("doc_open");
  });

  var video = document.getElementById("introVideo");
  if (video) video.addEventListener("play", function () { goal("video_play", true); });

  var form = document.getElementById("signup");
  if (form && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries, io) {
      if (entries[0].isIntersecting) { goal("form_view", true); io.disconnect(); }
    }, { threshold: 0.3 }).observe(form);
  }

  /* уведомление о cookie */
  var box = document.getElementById("cookie"), ok = document.getElementById("cookieOk");
  var KEY = "softium_cookie_ok", seen = false;
  try { seen = localStorage.getItem(KEY) === "1"; } catch (e) {}
  if (box && !seen) {
    box.hidden = false;
    if (ok) ok.addEventListener("click", function () {
      box.hidden = true;
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    });
  }
})();

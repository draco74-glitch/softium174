(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* mobile menu */
  var burger = document.getElementById("burger");
  var mnav = document.getElementById("mobileNav");
  function setMenu(open){
    mnav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }
  burger.addEventListener("click", function(){ setMenu(!mnav.classList.contains("open")); });
  mnav.addEventListener("click", function(e){ if(e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") setMenu(false); });

  /* header shadow on scroll */
  var header = document.querySelector(".site-header");
  var onScroll = function(){ header.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});

  /* scroll-spy: подсветка активного пункта навигации */
  var navLinks = {};
  document.querySelectorAll(".nav a[href^='#']").forEach(function(a){
    navLinks[a.getAttribute("href").slice(1)] = a;
  });
  var spySections = Object.keys(navLinks).map(function(id){ return document.getElementById(id); }).filter(Boolean);
  if ("IntersectionObserver" in window && spySections.length) {
    var spyVisible = {};
    var spyIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ spyVisible[en.target.id] = en.isIntersecting; });
      var current = null;
      for (var i=0;i<spySections.length;i++){
        var id = spySections[i].id;
        if (spyVisible[id]) { current = id; break; }
      }
      Object.keys(navLinks).forEach(function(id){
        navLinks[id].classList.toggle("active", id === current);
        if (id === current) { navLinks[id].setAttribute("aria-current","true"); }
        else { navLinks[id].removeAttribute("aria-current"); }
      });
    }, {rootMargin:"-45% 0px -50% 0px"});
    spySections.forEach(function(s){ spyIO.observe(s); });
  }

  /* sticky mobile CTA: скрывать, когда форма записи в зоне видимости */
  var stickyCta = document.getElementById("stickyCta");
  var signupEl = document.getElementById("signup");
  if (stickyCta && signupEl && "IntersectionObserver" in window) {
    var ctaIO = new IntersectionObserver(function(entries){
      stickyCta.classList.toggle("hidden", entries[0].isIntersecting);
    }, {threshold: 0.15});
    ctaIO.observe(signupEl);
  }

  /* reviews carousel: стрелки листают ленту на карточку */
  var rail = document.getElementById("revRail");
  var revPrev = document.getElementById("revPrev");
  var revNext = document.getElementById("revNext");
  if (rail && revPrev && revNext) {
    var revStep = function(){
      var card = rail.querySelector(".review");
      return card ? card.getBoundingClientRect().width + 18 : 320;
    };
    var revBehavior = reduceMotion ? "auto" : "smooth";
    var revUpdate = function(){
      revPrev.disabled = rail.scrollLeft < 8;
      revNext.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    };
    revPrev.addEventListener("click", function(){ rail.scrollBy({left:-revStep(), behavior:revBehavior}); });
    revNext.addEventListener("click", function(){ rail.scrollBy({left:revStep(), behavior:revBehavior}); });
    rail.addEventListener("scroll", revUpdate, {passive:true});
    window.addEventListener("resize", revUpdate);
    revUpdate();
  }

  /* reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* map facade → load Yandex map only on user action */
  var showMap = document.getElementById("showMap");
  if (showMap) {
    showMap.addEventListener("click", function(){
      var wrap = document.getElementById("mapWrap");
      wrap.innerHTML = '<iframe title="Карта: Софтиум, Челябинск, Комсомольский проспект, 99Г" src="https://yandex.ru/map-widget/v1/?ll=61.301900%2C55.190800&amp;z=16&amp;pt=61.299938,55.191001,pm2rdm"></iframe>';
    });
  }

  /* penguin easter egg */
  var p = document.getElementById("heroPenguin");
  var count = 0;
  if (p) p.addEventListener("click", function(){
    if(reduceMotion || count > 24) return;
    var r = p.getBoundingClientRect();
    for(var i=0;i<3;i++){
      var g = document.createElementNS("http://www.w3.org/2000/svg","svg");
      g.setAttribute("viewBox","0 0 120 130");
      g.classList.add("fly-penguin");
      var s = 26 + Math.random()*26;
      g.style.width = s+"px"; g.style.height = s+"px";
      g.style.left = (r.left + 10 + Math.random()*(r.width-50)) + "px";
      g.style.top = (r.top + r.height*0.35) + "px";
      g.setAttribute("aria-hidden","true");
      var u = document.createElementNS("http://www.w3.org/2000/svg","use");
      u.setAttribute("href","#penguin-mini");
      g.appendChild(u);
      document.body.appendChild(g);
      count++;
      g.addEventListener("animationend", function(){ this.remove(); count--; });
    }
  });
})();

(function () {
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- intro ---------- */
  var start = function () { document.body.classList.add("loaded"); };
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  setTimeout(start, 1500); // safety

  /* ---------- header hide on scroll down ---------- */
  var header = document.querySelector(".header");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (!document.body.classList.contains("menu-open")) header.classList.toggle("hide", y > 200 && y > lastY);
    lastY = y;
  }, { passive: true });

  /* ---------- mobile menu ---------- */
  var btn = document.querySelector(".menu-btn");
  btn.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("menu-open"); btn.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- active nav link ---------- */
  var links = {};
  document.querySelectorAll(".nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var l = links[e.target.id]; if (!l) return;
        if (e.isIntersecting) { Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); }); l.classList.add("active"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* ---------- rotating roles ---------- */
  var rolesList = document.querySelector(".roles ul");
  if (rolesList && !reduce) {
    var items = rolesList.children.length, idx = 0;
    setInterval(function () {
      idx = (idx + 1) % items;
      rolesList.style.transform = "translateY(" + (-idx * 2.1) + "em)";
    }, 2400);
  }

  /* ---------- reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: .1 });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var runCount = function (el) {
    var end = parseInt(el.dataset.count, 10), pre = el.dataset.pre || "", suf = el.dataset.suf || "";
    if (reduce) { el.textContent = pre + end + suf; return; }
    var t0 = null, dur = 1800;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
      el.textContent = pre + v + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var cIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cIO.unobserve(e.target); } });
    }, { threshold: .6 });
    counters.forEach(function (c) { cIO.observe(c); });
  }

  /* ---------- scroll-driven: statement words, journey line, stacking cards ---------- */
  var words = document.querySelectorAll(".statement .w");
  var statement = document.querySelector(".statement");
  var journey = document.querySelector(".journey");
  var steps = document.querySelectorAll(".step");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".wcard"));
  var ticking = false;

  var update = function () {
    ticking = false;
    var vh = window.innerHeight;
    if (statement) {
      var r = statement.getBoundingClientRect();
      var p = (vh * .85 - r.top) / (r.height + vh * .35);
      p = Math.max(0, Math.min(1, p));
      var lit = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < lit);
    }
    if (journey) {
      var jr = journey.getBoundingClientRect();
      var jp = (vh * .75 - jr.top) / (jr.height + vh * .2);
      jp = Math.max(0, Math.min(1, jp));
      journey.style.setProperty("--p", jp.toFixed(3));
      steps.forEach(function (s, k) { s.classList.toggle("lit", jp >= (k / steps.length) + .02 || jp >= .98); });
    }
    if (!reduce) {
      cards.forEach(function (c, k) {
        var next = cards[k + 1];
        if (!next) { c.style.transform = ""; c.style.filter = ""; return; }
        var cr = c.getBoundingClientRect(), nr = next.getBoundingClientRect();
        var overlap = Math.max(0, Math.min(1, (cr.bottom - nr.top) / cr.height));
        c.style.transform = "scale(" + (1 - overlap * .06).toFixed(4) + ")";
        c.style.filter = "brightness(" + (1 - overlap * .45).toFixed(3) + ")";
      });
    }
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  /* ---------- tile spotlight ---------- */
  document.querySelectorAll(".tile").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", (e.clientX - r.left) + "px");
      t.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  if (fine && !reduce) {
    /* ---------- hero parallax ---------- */
    var hero = document.querySelector(".hero");
    var mark = document.querySelector(".hero__mark");
    var halo = document.querySelector(".hero__halo");
    var name = document.querySelector(".hero__name");
    hero.addEventListener("pointermove", function (e) {
      var x = (e.clientX / window.innerWidth - .5), y = (e.clientY / window.innerHeight - .5);
      mark.style.translate = (x * 16) + "px " + (y * 12) + "px";
      halo.style.translate = (x * -26) + "px " + (y * -18) + "px";
      name.style.transform = "translate(" + (x * -30) + "px," + (y * -12) + "px)";
    });

    /* ---------- magnetic buttons ---------- */
    document.querySelectorAll(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .25) + "px," + ((e.clientY - r.top - r.height / 2) * .35) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });

    /* ---------- custom cursor ---------- */
    var ring = document.querySelector(".cursor"), dot = document.querySelector(".cursor-dot");
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      doc.classList.add("has-cursor");
    });
    document.addEventListener("pointerleave", function () { doc.classList.remove("has-cursor"); });
    (function loop() {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("pointerenter", function () { ring.classList.add("hover"); });
      el.addEventListener("pointerleave", function () { ring.classList.remove("hover"); });
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

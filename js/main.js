/* EXPODOM · Josephine Baker — navegação da apresentação */
(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var dotsBox = document.getElementById("dots");
  var hint = document.getElementById("hint");
  var total = slides.length;
  var current = 0;
  var startX = null;

  var FX_SELECTOR = [
    ".eyebrow", ".title", ".cover-title", ".rule-gold", ".cover-sub",
    ".cover-lead", ".cover-team", ".cover-dates", ".photo", ".para",
    ".pull", ".roles li", ".timeline", ".facts", ".note", ".src",
    ".big-number", ".route", ".values", ".reflection", ".war-steps",
    ".honors", ".compare", ".highlight-1963", ".flow-step", ".cell",
    ".legacy-lead", ".pantheon", ".takeaways li", ".closing",
    ".end-sources", ".bar-photo", ".art-photo", ".tribe-span", ".q-line"
  ].join(",");

  /* ---------- escala do palco 16:9 ---------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    stage.style.transform = "translate(-50%,-50%) scale(" + s + ")";
  }

  /* ---------- indicadores ---------- */
  function buildDots() {
    slides.forEach(function (sl, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dot" + (i === 0 ? " is-on" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Ir para o slide " + (i + 1) + ": " + (sl.dataset.title || ""));
      b.addEventListener("click", function () { go(i); });
      dotsBox.appendChild(b);
    });
  }

  /* ---------- animações de entrada ----------
     arma os elementos ANTES do slide ficar ativo e congela a transição
     deles: o commit do estado-base acontece num reflow único (go()), e a
     entrada toca também na primeira visita (não só ao voltar ao slide). */
  function armFx(sl) {
    var els = sl.querySelectorAll(FX_SELECTOR);
    var frozen = [];
    Array.prototype.forEach.call(els, function (el, i) {
      if (!el.classList.contains("fx")) {
        el.classList.add("fx");
        frozen.push(el);
      }
      if (el.classList.contains("photo")) { el.classList.add("fx-zoom"); }
      el.style.transitionDelay = Math.min(i * 55, 700) + "ms";
    });
    frozen.forEach(function (el) { el.style.transition = "none"; });
    return frozen;
  }

  /* ---------- navegação ---------- */
  var leaveTimer = null;
  function go(i, skipHash) {
    if (i < 0) { i = 0; }
    if (i > total - 1) { i = total - 1; }
    if (i === current && slides[i].classList.contains("is-active")) { return; }
    /* congela slides e elementos, commita tudo num reflow só e libera:
       a partir daí cada transição parte do estado-base correto */
    slides.forEach(function (sl) { sl.style.transition = "none"; });
    slides[i].classList.remove("is-active"); /* garante estado-base antes de armar */
    var frozen = armFx(slides[i]);
    void stage.offsetWidth;
    slides.forEach(function (sl) { sl.style.transition = ""; });
    frozen.forEach(function (el) { el.style.transition = ""; });
    current = i;
    slides.forEach(function (sl, n) {
      if (n !== i && sl.classList.contains("is-active")) { sl.classList.add("is-leaving"); }
      sl.classList.toggle("is-active", n === i);
    });
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(function () {
      slides.forEach(function (sl, n) {
        if (n !== i) { sl.classList.remove("is-leaving"); }
      });
    }, 760);
    Array.prototype.forEach.call(dotsBox.children, function (d, n) {
      d.classList.toggle("is-on", n === i);
      d.setAttribute("aria-selected", n === i ? "true" : "false");
    });
    if (!skipHash) {
      history.replaceState(null, "", "#" + (i + 1));
    }
    document.title = slides[i].dataset.title + " · Josephine Baker — EXPODOM";
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  /* ---------- tela cheia ---------- */
  function toggleFull() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  /* ---------- eventos ---------- */
  document.getElementById("btn-next").addEventListener("click", next);
  document.getElementById("btn-prev").addEventListener("click", prev);
  document.getElementById("btn-full").addEventListener("click", toggleFull);
  document.getElementById("btn-print").addEventListener("click", function () { window.print(); });

  document.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home":
        e.preventDefault(); go(0); break;
      case "End":
        e.preventDefault(); go(total - 1); break;
      case "f":
      case "F":
        toggleFull(); break;
      case "Escape":
        if (document.exitFullscreen) { document.exitFullscreen(); }
        document.body.classList.remove("is-clean");
        break;
      case "h":
      case "H":
        document.body.classList.toggle("is-clean"); break;
    }
    hideHint();
  });

  document.addEventListener("fullscreenchange", function () {
    var b = document.getElementById("btn-full");
    b.textContent = document.fullscreenElement ? "Sair" : "Tela cheia";
    fit();
  });

  /* toque / swipe */
  document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (startX === null) { return; }
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () {
    var n = parseInt(location.hash.replace("#", ""), 10);
    if (!isNaN(n)) { go(n - 1, true); }
  });

  var hintTimer = setTimeout(function () { hideHint(); }, 6000);
  function hideHint() {
    clearTimeout(hintTimer);
    if (hint) { hint.classList.add("is-off"); }
  }

  /* ---------- inicialização ---------- */
  window.addEventListener("error", function (ev) {
    console.error("[apresentacao]", ev.message, ev.filename, ev.lineno);
  });

  buildDots();
  fit();

  var start = parseInt(location.hash.replace("#", ""), 10);
  if (!isNaN(start) && start >= 1 && start <= total) {
    current = -1;
    go(start - 1, true);
  } else {
    current = -1;
    go(0, true);
  }
})();

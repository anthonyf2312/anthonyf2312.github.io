// Type poster interactions: kinetic hero weight, scroll reveals, scroll cue.
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  document.getElementById("year").textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- match the sub-line width to ANTHONY ---------- */
  // The headline's width shifts as the kinetic weights animate, so measure a
  // hidden clone pinned at the resting weight (600) and size the sub to that.
  function sizeSub() {
    var title = document.querySelector(".hero-title");
    var sub = document.querySelector(".hero-sub");
    if (!title || !sub) return;
    var clone = title.cloneNode(true);
    clone.style.cssText = "position:absolute;visibility:hidden;left:-9999px;font-variation-settings:'wght' 600";
    clone.querySelectorAll(".k").forEach(function (k) {
      k.style.setProperty("--w", "600");
    });
    document.body.appendChild(clone);
    sub.style.width = clone.getBoundingClientRect().width + "px";
    clone.remove();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(sizeSub);
  } else {
    sizeSub();
  }
  window.addEventListener("resize", sizeSub);

  /* ---------- scroll reveals ---------- */
  var revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- scroll cue ---------- */
  var cue = document.querySelector(".scroll-cue");
  window.addEventListener("scroll", function onScroll() {
    if (window.scrollY > 40) {
      cue.classList.add("hidden");
      window.removeEventListener("scroll", onScroll);
    }
  }, { passive: true });

  /* ---------- kinetic hero type ---------- */
  if (reduceMotion) return;

  // Split each hero line into per-letter spans.
  var letters = [];
  document.querySelectorAll(".kinetic").forEach(function (line) {
    var text = line.textContent;
    line.textContent = "";
    line.setAttribute("aria-label", text);
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement("span");
      s.className = "k";
      s.setAttribute("aria-hidden", "true");
      s.textContent = text[i];
      line.appendChild(s);
      letters.push({ el: s, w: 800, target: 800 });
    }
  });
  if (!letters.length) return;

  var subEl = document.querySelector(".hero-sub");

  var MIN = 200, MAX = 900;
  var RADIUS = Math.max(220, window.innerWidth * 0.22); // px of cursor influence
  var mouse = null;          // last cursor position, null until first move
  var t = 0;                 // wave clock for touch / pre-mouse state
  var running = false;

  function frame() {
    var active = false;
    t += 0.035;

    for (var i = 0; i < letters.length; i++) {
      var L = letters[i];

      if (mouse) {
        var r = L.el.getBoundingClientRect();
        var dx = mouse.x - (r.left + r.width / 2);
        var dy = mouse.y - (r.top + r.height / 2);
        var d = Math.sqrt(dx * dx + dy * dy);
        var p = Math.max(0, 1 - d / RADIUS);        // 1 near cursor, 0 far
        p = p * p * (3 - 2 * p);                    // smoothstep for a soft bulge
        L.target = MIN + p * (MAX - MIN);           // thin far away, black under the cursor
      } else {
        // ambient wave until the cursor arrives (also covers touch devices)
        L.target = 500 + 300 * (0.5 + 0.5 * Math.sin(t + i * 0.45));
      }

      L.w += (L.target - L.w) * 0.16; // ease toward target
      if (Math.abs(L.target - L.w) > 0.5) active = true;
      L.el.style.setProperty("--w", L.w.toFixed(1));
    }

    // keep the sub-line exactly as wide as the name is right now
    // (the h1 is a block, so measure from first letter to last letter)
    if (subEl && letters.length) {
      var first = letters[0].el.getBoundingClientRect();
      var last = letters[letters.length - 1].el.getBoundingClientRect();
      subEl.style.width = (last.right - first.left) + "px";
    }

    if (active || !mouse) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function wake() {
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse") {
      mouse = { x: e.clientX, y: e.clientY };
      wake();
    }
  }, { passive: true });

  wake(); // start with the ambient wave
})();

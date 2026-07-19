// Type poster interactions: stinger, entrance, kinetic hero weight, scroll motion.
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    // GSAP CDN blocked but JS running: drop all motion, reveal everything.
    document.documentElement.classList.remove("js");
  }

  /* ---------- kinetic hero type: split letters ---------- */
  var letters = [];
  if (!reduceMotion) {
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
        letters.push({ el: s, w: 600, target: 600 });
      }
    });
  }

  var MIN = 200, MAX = 900;
  var RADIUS = Math.max(220, window.innerWidth * 0.22);
  var mouse = null;
  var t = 0;
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
        var p = Math.max(0, 1 - d / RADIUS);
        p = p * p * (3 - 2 * p);
        L.target = MIN + p * (MAX - MIN);
      } else {
        L.target = 500 + 300 * (0.5 + 0.5 * Math.sin(t + i * 0.45));
      }

      L.w += (L.target - L.w) * 0.16;
      if (Math.abs(L.target - L.w) > 0.5) active = true;
      L.el.style.setProperty("--w", L.w.toFixed(1));
    }

    if (active || !mouse) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function wake() {
    if (!running || !letters.length) {
      if (!letters.length) return;
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

  /* ---------- GSAP motion (skipped entirely under reduced motion) ---------- */
  var entrance = null;
  if (hasGsap) {
    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", function () {

      /* stinger: hold a beat on the papaya, then sweep off slow + heavy */
      entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance.to(".stinger", {
        xPercent: 115,
        yPercent: -12,
        duration: 1.1,
        ease: "power4.inOut",
        onComplete: function () {
          var s = document.querySelector(".stinger");
          if (s) s.remove();
        }
      }, 0.35);

      /* entrance: eyebrow → letters rise (overshoot) → weight ramp → cue, then kinetic.
         Positioned on an absolute timeline so the beats stay choreographed. */
      var eyebrowSpans = document.querySelectorAll(".hero-eyebrow span");
      var ks = document.querySelectorAll(".hero-title .k");

      gsap.set(eyebrowSpans, { opacity: 0, y: 14 });
      gsap.set(".scroll-cue", { opacity: 0 });
      gsap.set(ks, { "--w": 200 });

      entrance
        .to(eyebrowSpans, { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 }, 0.55)
        .from(ks, { yPercent: 65, opacity: 0, duration: 0.85, ease: "back.out(1.4)", stagger: 0.11 }, 0.75)
        .to(ks, { "--w": 600, duration: 0.8, ease: "power2.inOut", stagger: 0.11 }, 0.9)
        .to(".scroll-cue", { opacity: 1, duration: 0.65 }, 2.4)
        .call(wake);

      /* scroll reveals: per-section stagger */
      gsap.utils.toArray([".intro", ".work", ".f1", ".ms"]).forEach(function (section) {
        var items = section.querySelectorAll(".reveal");
        if (!items.length) return;
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 72%", once: true }
        });
      });

      /* parallax (scrubbed y) + ambient float (slow rotation) on the marks */
      var mark = document.querySelector(".f1-mark");
      var ribbon = document.querySelector(".ms-ribbon");

      // normalize into GSAP's transform system (matches the CSS centering transforms)
      gsap.set(mark, { yPercent: -50, rotation: -8, y: 0 });
      gsap.set(ribbon, { yPercent: -50, rotation: 10, y: 0 });

      gsap.fromTo(mark, { y: 70 }, {
        y: -70, ease: "none",
        scrollTrigger: { trigger: ".f1", start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.fromTo(ribbon, { y: 50 }, {
        y: -50, ease: "none",
        scrollTrigger: { trigger: ".ms", start: "top bottom", end: "bottom top", scrub: true }
      });

      gsap.to(mark, { rotation: -11, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(ribbon, { rotation: 13, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });

      /* imperceptible glow drift */
      gsap.to(".glow", { xPercent: 2.5, yPercent: 3, duration: 26, yoyo: true, repeat: -1, ease: "sine.inOut" });

      /* magnetic row arrows (mouse only) */
      var magnetCleanups = [];
      document.querySelectorAll("a.row").forEach(function (row) {
        var arrow = row.querySelector(".row-arrow");
        if (!arrow) return;
        var qx = gsap.quickTo(arrow, "x", { duration: 0.3, ease: "power3" });
        var qy = gsap.quickTo(arrow, "y", { duration: 0.3, ease: "power3" });
        function onMove(e) {
          if (e.pointerType !== "mouse") return;
          var r = arrow.getBoundingClientRect();
          var relX = (e.clientX - (r.left + r.width / 2)) * 0.06;
          var relY = (e.clientY - (r.top + r.height / 2)) * 0.06;
          qx(Math.max(-12, Math.min(12, relX)));
          qy(Math.max(-12, Math.min(12, relY)));
        }
        function onLeave() { qx(0); qy(0); }
        row.addEventListener("pointermove", onMove);
        row.addEventListener("pointerleave", onLeave);
        magnetCleanups.push(function () {
          row.removeEventListener("pointermove", onMove);
          row.removeEventListener("pointerleave", onLeave);
        });
      });

      /* matchMedia cleanup: GSAP reverts its own objects; listeners are ours to remove */
      return function () {
        magnetCleanups.forEach(function (fn) { fn(); });
      };

    });
  }

  /* ---------- scroll cue ---------- */
  var cue = document.querySelector(".scroll-cue");
  if (cue) {
    window.addEventListener("scroll", function onScroll() {
      if (window.scrollY > 40) {
        if (hasGsap && !reduceMotion) {
          gsap.killTweensOf(cue);
          gsap.to(cue, { opacity: 0, duration: 0.4 });
        } else if (cue) {
          cue.classList.add("hidden");
        }
        window.removeEventListener("scroll", onScroll);
      }
    }, { passive: true });
  }

  // Without GSAP there is no entrance timeline to start the kinetic loop.
  if (!hasGsap) wake();
})();

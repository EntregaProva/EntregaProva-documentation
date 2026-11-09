/* Acessibilidade (WCAG 2.1.1 / axe: scrollable-region-focusable)
   Blocos de código e tabelas que rolam na horizontal precisam ser alcançáveis
   pelo teclado. Adiciona tabindex="0" apenas onde há rolagem real. */
(function () {
  function markScrollable(root) {
    var selector = ".md-typeset pre, .md-typeset pre > code, .md-typeset .md-typeset__scrollwrap, .md-typeset .highlight";
    root.querySelectorAll(selector).forEach(function (el) {
      var scrolls = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
      var overflow = getComputedStyle(el).overflow + getComputedStyle(el).overflowX;
      if (scrolls && /auto|scroll/.test(overflow) && !el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "0");
        if (!el.hasAttribute("role") && el.tagName !== "CODE" && el.tagName !== "PRE") {
          el.setAttribute("role", "region");
        }
        if (!el.hasAttribute("aria-label")) {
          el.setAttribute("aria-label", "Conteúdo com rolagem horizontal");
        }
      }
    });
  }

  function run() { markScrollable(document); }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(run); /* navigation.instant do Material */
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  window.addEventListener("resize", run);
})();

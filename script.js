// ==UserScript==
// @name         AtCoderStrangeIHighlighter
// @namespace    https://github.com/asakuchi
// @version      1.0
// @description  AtCoderの制約において、範囲定義ではない i を強調します
// @author       asakuchi
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_IMPORTANT_I = {
    color: "#ff0080",
    fontWeight: "bold",
    fontSize: "1.25em",
  };

  function applyStyles(element, styles) {
    for (const [key, value] of Object.entries(styles)) {
      element.style[key] = value;
    }
  }

  function isRelation(node) {
    if (!node) return false;
    if (node.classList.contains("mrel")) return true;

    const text = node.textContent.trim();
    return [
      "<",
      ">",
      "≤",
      "≥",
      "≦",
      "≧",
      "=",
      "≠",
      "≡",
      "≪",
      "≫",
      "\\le",
      "\\ge",
    ].includes(text);
  }

  function highlightContextual() {
    const headers = Array.from(document.querySelectorAll("h3")).filter(
      (h) =>
        h.textContent.includes("制約") || h.textContent.includes("Constraints"),
    );

    headers.forEach((h3) => {
      const section = h3.parentElement;
      if (!section) return;

      const listItems = section.querySelectorAll("li");
      listItems.forEach((li) => {
        const katexHtml = li.querySelector(".katex-html");
        if (!katexHtml) return;

        const allNodes = Array.from(katexHtml.querySelectorAll("*"));

        const leafNodes = allNodes.filter((node) => {
          if (!node.textContent.trim()) return false;
          if (
            node.classList.contains("strut") ||
            node.classList.contains("mspace")
          )
            return false;

          return node.children.length === 0;
        });

        leafNodes.forEach((node, index) => {
          const text = node.textContent.trim();

          if (
            text === "i" &&
            (node.classList.contains("mathnormal") ||
              node.closest(".mathnormal")) &&
            !node.closest(".vlist-t")
          ) {
            const prev = leafNodes[index - 1];
            const next = leafNodes[index + 1];

            const isSandwiched = isRelation(prev) && isRelation(next);

            if (!isSandwiched) {
              if (!node.dataset.highlighted) {
                applyStyles(node, STYLE_IMPORTANT_I);
                node.dataset.highlighted = "true";
              }
            }
          }
        });
      });
    });
  }

  window.addEventListener("load", highlightContextual);

  setInterval(highlightContextual, 500);
})();

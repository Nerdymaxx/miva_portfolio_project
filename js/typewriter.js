document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll("[data-typewriter]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function typeInto(el, text) {
    el.textContent = "";
    const cursor = document.createElement("span");
    cursor.className = "typewriter-cursor";
    cursor.textContent = "█";
    el.appendChild(cursor);

    if (prefersReducedMotion) {
      cursor.insertAdjacentText("beforebegin", text);
      return;
    }

    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        cursor.insertAdjacentText("beforebegin", text[charIndex]);
        charIndex += 1;
        setTimeout(typeChar, 30 + Math.random() * 40);
      }
    }

    typeChar();
  }

  targets.forEach((el) => {
    const text = el.textContent.trim();
    const delay = Number(el.dataset.typewriterDelay) || 0;
    setTimeout(() => typeInto(el, text), delay);
  });
});

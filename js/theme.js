document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "amber") {
    document.body.classList.add("amber-theme");
  }

  function updateLabel() {
    const isAmber = document.body.classList.contains("amber-theme");
    const next = isAmber ? "green" : "amber";
    toggle.textContent = `[ ${next} ]`;
    toggle.setAttribute("aria-label", `Switch to ${next} phosphor theme`);
  }

  updateLabel();

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("amber-theme");
    const isAmber = document.body.classList.contains("amber-theme");
    localStorage.setItem("theme", isAmber ? "amber" : "green");
    updateLabel();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copy-email-btn");
  const feedback = document.getElementById("copy-feedback");

  if (copyBtn && feedback) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        feedback.textContent = "Copied to clipboard!";
      } catch (err) {
        feedback.textContent = email;
      }

      setTimeout(() => {
        feedback.textContent = "";
      }, 3000);
    });
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");

  const fields = {
    name: {
      input: document.getElementById("contact-name"),
      field: document.getElementById("name-field"),
      error: document.getElementById("name-error"),
      validate: (value) => (value.trim() ? "" : "Please enter your name."),
    },
    email: {
      input: document.getElementById("contact-email"),
      field: document.getElementById("email-field"),
      error: document.getElementById("email-error"),
      validate: (value) => {
        if (!value.trim()) return "Please enter your email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? ""
          : "Enter a valid email address (e.g. name@example.com).";
      },
    },
    phone: {
      input: document.getElementById("contact-phone"),
      field: document.getElementById("phone-field"),
      error: document.getElementById("phone-error"),
      validate: (value) => {
        const stripped = value.replace(/[\s-]/g, "");
        if (!stripped) return "Please enter your phone number.";
        return /^\d{7,15}$/.test(stripped)
          ? ""
          : "Digits only, please (7-15 digits - spaces/dashes are fine).";
      },
    },
    message: {
      input: document.getElementById("contact-message"),
      field: document.getElementById("message-field"),
      error: document.getElementById("message-error"),
      validate: (value) => (value.trim() ? "" : "Please enter a message."),
    },
  };

  function validateField(key) {
    const { input, field, error, validate } = fields[key];
    const message = validate(input.value);
    field.classList.toggle("invalid", Boolean(message));
    error.textContent = message;
    return !message;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("input", () => validateField(key));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    let allValid = true;

    Object.keys(fields).forEach((key) => {
      const valid = validateField(key);
      if (!valid) {
        allValid = false;
        firstInvalid = firstInvalid || fields[key].input;
      }
    });

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.className = "form-status error";
      firstInvalid.focus();
      return;
    }

    const name = fields.name.input.value.trim();
    const email = fields.email.input.value.trim();
    const phone = fields.phone.input.value.trim();
    const message = fields.message.input.value.trim();

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`);

    status.textContent = "Looks good - opening your email client to send this message…";
    status.className = "form-status success";
    window.location.href = `mailto:nerdymax84@gmail.com?subject=${subject}&body=${body}`;
  });
});

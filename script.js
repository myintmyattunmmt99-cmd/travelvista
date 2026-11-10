// Booking form validation. This script can be linked on all pages.
// The form exists on index.html only, so the condition prevents errors on other pages.
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  const formMessage = document.getElementById("formMessage");
  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    contactNumber: document.getElementById("contactNumber"),
    bookingReference: document.getElementById("bookingReference")
  };

  function showError(field, message) {
    document.getElementById(`${field.id}Error`).textContent = message;
    field.classList.add("invalid");
    field.classList.remove("valid");
    field.setAttribute("aria-invalid", "true");
  }

  function showValid(field) {
    document.getElementById(`${field.id}Error`).textContent = "";
    field.classList.remove("invalid");
    field.classList.add("valid");
    field.setAttribute("aria-invalid", "false");
  }

  function clearFieldState(field) {
    document.getElementById(`${field.id}Error`).textContent = "";
    field.classList.remove("invalid", "valid");
    field.removeAttribute("aria-invalid");
  }

  function validateRequired(field, label) {
    if (field.value.trim() === "") {
      showError(field, `${label} is required.`);
      return false;
    }
    showValid(field);
    return true;
  }

  function validateName() {
    if (!validateRequired(fields.fullName, "Full name")) return false;
    if (fields.fullName.value.trim().length < 2) {
      showError(fields.fullName, "Please enter a name with at least 2 characters.");
      return false;
    }
    showValid(fields.fullName);
    return true;
  }

  function validateEmail() {
    const email = fields.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateRequired(fields.email, "Email address")) return false;
    if ((email.match(/@/g) || []).length !== 1 || !emailPattern.test(email)) {
      showError(fields.email, "Enter a valid email address (example: name@example.com).");
      return false;
    }
    showValid(fields.email);
    return true;
  }

  function validatePasswordMatch() {
    if (!validateRequired(fields.confirmPassword, "Confirm password")) return false;
    if (fields.password.value !== fields.confirmPassword.value) {
      showError(fields.confirmPassword, "Passwords do not match.");
      return false;
    }
    showValid(fields.confirmPassword);
    return true;
  }

  function validateContactNumber() {
    const number = fields.contactNumber.value.trim();
    if (!validateRequired(fields.contactNumber, "Contact number")) return false;
    if (!/^[0-9-]+$/.test(number)) {
      showError(fields.contactNumber, "Use numbers and hyphens only.");
      return false;
    }
    const digitCount = number.replace(/-/g, "").length;
    if (digitCount === 0 || digitCount > 11) {
      showError(fields.contactNumber, "Contact number must contain 1 to 11 digits.");
      return false;
    }
    showValid(fields.contactNumber);
    return true;
  }

  function validateBookingReference() {
    const reference = fields.bookingReference.value.trim();
    if (!validateRequired(fields.bookingReference, "Booking reference ID")) return false;
    if (!/^TV-\d{4}$/.test(reference)) {
      showError(fields.bookingReference, "Use the format TV- followed by 4 digits (e.g. TV-2025).");
      return false;
    }
    showValid(fields.bookingReference);
    return true;
  }

  function validateForm() {
    const results = [
      validateName(),
      validateEmail(),
      validateRequired(fields.password, "Password"),
      validatePasswordMatch(),
      validateContactNumber(),
      validateBookingReference()
    ];
    return results.every(Boolean);
  }

  // Give immediate feedback as the visitor types.
  fields.fullName.addEventListener("input", validateName);
  fields.email.addEventListener("input", validateEmail);
  fields.password.addEventListener("input", () => {
    validateRequired(fields.password, "Password");
    if (fields.confirmPassword.value !== "") validatePasswordMatch();
  });
  fields.confirmPassword.addEventListener("input", validatePasswordMatch);
  fields.contactNumber.addEventListener("input", validateContactNumber);
  fields.bookingReference.addEventListener("input", validateBookingReference);

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Stop normal submission and page reload.
    formMessage.className = "form-message";
    formMessage.textContent = "";

    if (!validateForm()) {
      formMessage.textContent = "Please correct the highlighted fields and try again.";
      formMessage.classList.add("error");
      const firstInvalidField = bookingForm.querySelector(".invalid");
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    formMessage.textContent = "Your booking inquiry has been validated successfully. Thank you for choosing TravelVista!";
    formMessage.classList.add("success");
    bookingForm.reset();
    Object.values(fields).forEach(clearFieldState);
  });
}

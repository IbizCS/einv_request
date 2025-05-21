window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');

  if (ref) {
    const prefillData = {
      invoiceNo: ref,
      invoiceDate: '2025-05-20',
      amount: '256.40',
      name: 'Jane Doe',
      address: '123 Jalan ABC',
      city: 'Kuala Lumpur',
      stateCode: '14 - Kuala Lumpur',
      phone: '0123456789',
      email: 'jane@example.com'
    };

    for (const [id, value] of Object.entries(prefillData)) {
      const field = document.getElementById(id);
      if (field) {
        if (field.tagName === 'SELECT') {
          const options = Array.from(field.options);
          const match = options.find(opt => opt.text === value || opt.value === value);
          if (match) match.selected = true;
        } else {
          field.value = value;
        }
      }
    }
  }

  // Next and Prev buttons handlers
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (validateStep1()) {
      document.getElementById("step1").classList.remove("active");
      document.getElementById("step2").classList.add("active");
    }
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    document.getElementById("step2").classList.remove("active");
    document.getElementById("step1").classList.add("active");
  });

  document.getElementById("invoiceForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if(validateStep2()) {
      alert("Form submitted. Backend integration coming soon.");
    }
  });
});

function validateStep1() {
  let isValid = true;

  // Validate phone (Malaysia format)
    const phone = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const phoneRegex = /^(01[0-46-9]\d{7,8}|\+601[0-46-9]\d{7,8})$/;

    if (!phoneRegex.test(phone.value.trim())) {
    phone.classList.add('error');
    phoneError.textContent = 'Please enter a valid Malaysian phone number (e.g., 0123456789 or +60123456789)';
    isValid = false;
    } else {
    phone.classList.remove('error');
    phoneError.textContent = '';
    }


  // Validate email
  const email = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    email.classList.add('error');
    emailError.textContent = 'Please enter a valid email address';
    isValid = false;
  } else {
    email.classList.remove('error');
    emailError.textContent = '';
  }

  return isValid;
}

function validateStep2() {
  let isValid = true;

  const tinNo = document.getElementById('tinNo');
  const tinNoError = document.getElementById('tinNoError');
  if (!tinNo.value.trim()) {
    tinNo.classList.add('error');
    tinNoError.textContent = 'TIN No. is required';
    isValid = false;
  } else {
    tinNo.classList.remove('error');
    tinNoError.textContent = '';
  }

  const icNo = document.getElementById('icNo');
  const icNoError = document.getElementById('icNoError');
  if (!icNo.value.trim()) {
    icNo.classList.add('error');
    icNoError.textContent = 'IC No. is required';
    isValid = false;
  } else {
    icNo.classList.remove('error');
    icNoError.textContent = '';
  }

  return isValid;
}

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
      stateCode: '14',
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

  const form = document.getElementById("invoiceForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
  
    if (validateStep2()) {
      try {
        const response = await fetch("http://localhost:7071/api/submitInvoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        const text = await response.text();
  
        let result = {};
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          throw new Error("Invalid JSON response: " + text);
        }
  
        if (response.ok) {
          alert('Result: ' + (result.message || text));
        } else {
          alert('Error: ' + (result.message || text || 'Unknown error'));
        }
      } catch (err) {
        //console.error('Caught error:', err);
        const errMsg = err.message || (typeof err === 'string' ? err : JSON.stringify(err));
        alert("Error submitting form: " + errMsg);
      }
    }
  });  
});

function validateStep1() {
  let isValid = true;

  // Clear previous error messages
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

  // Validate Name
  const name = document.getElementById('name');
  const nameError = document.getElementById('nameError');
  if (!name.value.trim()) {
    name.classList.add('error');
    nameError.textContent = 'Name is required';
    isValid = false;
  } else {
    name.classList.remove('error');
    nameError.textContent = '';
  }

  // Validate Address
  const address = document.getElementById('address');
  const addressError = document.getElementById('addressError');
  if (!address.value.trim()) {
    address.classList.add('error');
    addressError.textContent = 'Address is required';
    isValid = false;
  } else {
    address.classList.remove('error');
    addressError.textContent = '';
  }

  // Validate City
  const city = document.getElementById('city');
  const cityError = document.getElementById('cityError');
  if (!city.value.trim()) {
    city.classList.add('error');
    cityError.textContent = 'City is required';
    isValid = false;
  } else {
    city.classList.remove('error');
    cityError.textContent = '';
  }

  // Validate State Code (dropdown)
  const stateCode = document.getElementById('stateCode');
  const stateCodeError = document.getElementById('stateCodeError');
  if (!stateCode.value) {
    stateCode.classList.add('error');
    stateCodeError.textContent = 'Please select a state';
    isValid = false;
  } else {
    stateCode.classList.remove('error');
    stateCodeError.textContent = '';
  }

  // Validate Phone (Malaysia format)
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

  // Validate Email
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

  // Validate Customer Type (dropdown)

  const customerType = document.getElementById('customerType');
  const customerTypeError = document.getElementById('customerTypeError');

  if (!customerType.value) {
    customerType.classList.add('error');
    customerTypeError.textContent = 'Please select a customer type';
    isValid = false;
  } else {
    customerType.classList.remove('error');
    customerTypeError.textContent = '';
  }

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

  if (customerType.value === 'Malaysian Individual') {
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
  }

  return isValid;
}

const states = [
  { "Code": "01", "State": "Johor" },
  { "Code": "02", "State": "Kedah" },
  { "Code": "03", "State": "Kelantan" },
  { "Code": "04", "State": "Melaka" },
  { "Code": "05", "State": "Negeri Sembilan" },
  { "Code": "06", "State": "Pahang" },
  { "Code": "07", "State": "Pulau Pinang" },
  { "Code": "08", "State": "Perak" },
  { "Code": "09", "State": "Perlis" },
  { "Code": "10", "State": "Selangor" },
  { "Code": "11", "State": "Terengganu" },
  { "Code": "12", "State": "Sabah" },
  { "Code": "13", "State": "Sarawak" },
  { "Code": "14", "State": "Wilayah Persekutuan Kuala Lumpur" },
  { "Code": "15", "State": "Wilayah Persekutuan Labuan" },
  { "Code": "16", "State": "Wilayah Persekutuan Putrajaya" },
  { "Code": "17", "State": "Not Applicable" }
];

const select = document.getElementById("stateCode");
states.forEach(({ Code, State }) => {
  const option = document.createElement("option");
  option.value = Code;
  option.textContent = State;
  select.appendChild(option);
});

const customerTypes = [
  { code: "Malaysian Business", label: "Malaysian Business" },
  { code: "Foreign Business", label: "Foreign Business" },
  { code: "Malaysian Individual", label: "Malaysian Individual" },
  { code: "Foreign Individual", label: "Foreign Individual" },
  { code: "Government", label: "Government" }
];

const customerTypeSelect = document.getElementById('customerType');

// Clear if any
customerTypeSelect.innerHTML = '<option value="">-- Select --</option>';

customerTypes.forEach(type => {
  const option = document.createElement('option');
  option.value = type.code;
  option.textContent = type.label;
  customerTypeSelect.appendChild(option);
});

//Run updateRequiredMarkers() on Page Load; If pre-populating customerType from saved data:
window.addEventListener('DOMContentLoaded', updateRequiredMarkers);

//Update Asterisks in Real-Time
document.getElementById('customerType').addEventListener('change', () => {
  updateRequiredMarkers();
  clearAllErrors();
});

function updateRequiredMarkers() {
  const customerType = document.getElementById('customerType').value;

  // Hide all by default
  document.getElementById('tinNoMarker').style.display = 'none';
  document.getElementById('icNoMarker').style.display = 'none';
  document.getElementById('passportNoMarker').style.display = 'none';
  document.getElementById('brnNoMarker').style.display = 'none';
  document.getElementById('armyNoMarker').style.display = 'none';

  // Conditional display
  if (customerType === 'Malaysian Individual') {
    document.getElementById('tinNoMarker').style.display = 'inline';
    document.getElementById('icNoMarker').style.display = 'inline';
  } else if (customerType === 'Foreign Individual') {
    document.getElementById('tinNoMarker').style.display = 'inline';
    document.getElementById('passportNoMarker').style.display = 'inline';
  } else if (customerType === 'Malaysian Business' || customerType === 'Foreign Business') {
    document.getElementById('tinNoMarker').style.display = 'inline';
    document.getElementById('brnNoMarker').style.display = 'inline';
  }
}

function clearAllErrors() {
  // Clear all .error-message text
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach((el) => (el.textContent = ''));

  // Remove red error borders
  const errorInputs = document.querySelectorAll('.error');
  errorInputs.forEach((input) => input.classList.remove('error'));
}
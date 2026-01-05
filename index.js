const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');

const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Step 1: Fetch alerts
function fetchWeatherAlerts(state) {
  // Clear previous alerts and hide error
  alertsDisplay.innerHTML = '';
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');

  // Validate input
  if (!state || state.length !== 2 || !/^[A-Z]{2}$/.test(state)) {
    errorDiv.textContent = 'Please enter a valid two-letter state abbreviation.';
    errorDiv.classList.remove('hidden');
    return;
  }

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) throw new Error(`API returned status ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(data); // For testing
      hideError(); // clear any previous error
      displayAlerts(data); // Note: test expects displayAlerts(data)
    })
    .catch(error => {
      console.log(error.message);
      errorDiv.textContent = error.message;
      errorDiv.classList.remove('hidden');
    });

  // Clear input field
  stateInput.value = '';
}

// Step 2: Display alerts
function displayAlerts(data) {
  const numAlerts = data.features.length;

  // Test expects title as "Weather Alerts: X"
  const titleEl = document.createElement('h2');
  titleEl.textContent = `Weather Alerts: ${numAlerts}`;
  alertsDisplay.appendChild(titleEl);

  if (numAlerts > 0) {
    const ul = document.createElement('ul');
    data.features.forEach(alert => {
      const li = document.createElement('li');
      li.textContent = alert.properties.headline;
      ul.appendChild(li);
    });
    alertsDisplay.appendChild(ul);
  }
}

// Helper to hide error
function hideError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}

// Step 4: Event listener
fetchBtn.addEventListener('click', () => {
  const state = stateInput.value.toUpperCase().trim();
  fetchWeatherAlerts(state);
});
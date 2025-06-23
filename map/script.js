'use strict';

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
    this.weather = null; // Will store weather data
    this.location = null; // Will store geocoded location
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Use location name if available, otherwise use generic description
    const locationName = this.location ? ` in ${this.location}` : '';
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}${locationName}`;
  }

  click() {
    this.clicks++;
  }

  // Set location from geocoding
  setLocation(location) {
    this.location = location;
    this._setDescription();
  }

  // Set weather data
  setWeather(weather) {
    this.weather = weather;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #markers = [];
  #editingWorkout = null;
  #currentRoute = null;
  #routePoints = [];
  #isDrawingRoute = false;

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._handleWorkoutClick.bind(this));
    
    // Add controls event listeners
    this._addControlsEventListeners();
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._handleMapClick.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });

    // Restore routes from localStorage
    this._restoreRoutes();
  }

  _handleMapClick(mapE) {
    if (this.#isDrawingRoute) {
      this._addRoutePoint(mapE);
    } else {
      this._showForm(mapE);
    }
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

    form.style.display = 'none';
    form.classList.add('hidden');
    form.classList.remove('form--editing');
    setTimeout(() => (form.style.display = 'grid'), 1000);
    
    this.#editingWorkout = null;
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  async _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        this._showError('Inputs have to be positive numbers!');
        return;
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        this._showError('Inputs have to be positive numbers!');
        return;
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // If editing existing workout
    if (this.#editingWorkout) {
      this._updateWorkout(workout);
      return;
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Get location and weather data asynchronously
    this._getLocationAndWeather(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();

    // Add route if points were drawn
    if (this.#routePoints.length > 0) {
      workout.route = [...this.#routePoints];
      this._drawRoute(workout.route);
      this.#routePoints = [];
      this.#isDrawingRoute = false;
      this._updateDrawRouteButton();
    }
  }

  async _getLocationAndWeather(workout) {
    try {
      // Get location name from coordinates
      const location = await this._reverseGeocode(workout.coords);
      workout.setLocation(location);

      // Get weather data
      const weather = await this._getWeatherData(workout.coords, workout.date);
      workout.setWeather(weather);

      // Re-render the workout with updated information
      this._updateWorkoutDisplay(workout);
      this._setLocalStorage();
    } catch (error) {
      console.error('Error getting location or weather:', error);
    }
  }

  async _reverseGeocode(coords) {
    try {
      const [lat, lng] = coords;
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      return data.city || data.locality || data.countryName || 'Unknown location';
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async _getWeatherData(coords, date) {
    try {
      const [lat, lng] = coords;
      // Using a free weather API (OpenWeatherMap requires API key)
      // For demo purposes, we'll simulate weather data
      const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear'];
      const temperatures = [15, 18, 22, 25, 28, 20, 16];
      
      return {
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        temperature: temperatures[Math.floor(Math.random() * temperatures.length)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }

  _updateWorkoutDisplay(workout) {
    const workoutEl = document.querySelector(`[data-id="${workout.id}"]`);
    if (workoutEl) {
      // Update the title with location
      const titleEl = workoutEl.querySelector('.workout__title');
      if (titleEl) {
        titleEl.textContent = workout.description;
      }

      // Add weather info if available
      if (workout.weather && !workoutEl.querySelector('.workout__weather')) {
        const weatherHtml = `
          <div class="workout__weather">
            <span class="workout__weather-icon">🌤️</span>
            <span class="workout__weather-temp">${workout.weather.temperature}°C</span>
            <span class="workout__weather-condition">${workout.weather.condition}</span>
          </div>
        `;
        workoutEl.insertAdjacentHTML('beforeend', weatherHtml);
      }
    }

    // Update popup content
    const marker = this.#markers.find(m => m.workoutId === workout.id);
    if (marker) {
      const popupContent = `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`;
      marker.setPopupContent(popupContent);
    }
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();

    // Store reference to marker with workout ID
    marker.workoutId = workout.id;
    this.#markers.push(marker);
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__controls">
          <button class="workout__btn workout__btn--edit" title="Edit workout">✏️</button>
          <button class="workout__btn workout__btn--delete" title="Delete workout">🗑️</button>
        </div>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      `;

    // Add weather information if available
    if (workout.weather) {
      html += `
        <div class="workout__weather">
          <span class="workout__weather-icon">🌤️</span>
          <span class="workout__weather-temp">${workout.weather.temperature}°C</span>
          <span class="workout__weather-condition">${workout.weather.condition}</span>
        </div>
      `;
    }

    html += `</li>`;

    form.insertAdjacentHTML('afterend', html);
  }

  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    // Handle edit button click
    if (e.target.classList.contains('workout__btn--edit')) {
      this._editWorkout(workoutEl.dataset.id);
      return;
    }

    // Handle delete button click
    if (e.target.classList.contains('workout__btn--delete')) {
      this._deleteWorkout(workoutEl.dataset.id);
      return;
    }

    // Handle workout click (move to popup)
    this._moveToPopup(e);
  }

  _editWorkout(id) {
    const workout = this.#workouts.find(work => work.id === id);
    if (!workout) return;

    this.#editingWorkout = workout;
    
    // Populate form with workout data
    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;
    
    if (workout.type === 'running') {
      inputCadence.value = workout.cadence;
    } else {
      inputElevation.value = workout.elevationGain;
    }

    // Show appropriate fields
    this._toggleElevationField();
    if (workout.type === 'running') {
      inputElevation.closest('.form__row').classList.add('form__row--hidden');
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
    } else {
      inputCadence.closest('.form__row').classList.add('form__row--hidden');
      inputElevation.closest('.form__row').classList.remove('form__row--hidden');
    }

    // Set map event to workout coordinates
    this.#mapEvent = { latlng: { lat: workout.coords[0], lng: workout.coords[1] } };

    // Show form with editing style
    form.classList.remove('hidden');
    form.classList.add('form--editing');
    inputDistance.focus();
  }

  _updateWorkout(newWorkoutData) {
    const workout = this.#editingWorkout;
    
    // Update workout properties
    workout.distance = newWorkoutData.distance;
    workout.duration = newWorkoutData.duration;
    
    if (workout.type === 'running') {
      workout.cadence = newWorkoutData.cadence;
      workout.calcPace();
    } else {
      workout.elevationGain = newWorkoutData.elevationGain;
      workout.calcSpeed();
    }

    // Re-render workout
    const workoutEl = document.querySelector(`[data-id="${workout.id}"]`);
    workoutEl.remove();
    this._renderWorkout(workout);

    // Hide form
    this._hideForm();

    // Update local storage
    this._setLocalStorage();

    this._showSuccess('Workout updated successfully!');
  }

  _deleteWorkout(id) {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    // Remove from workouts array
    this.#workouts = this.#workouts.filter(work => work.id !== id);

    // Remove from DOM
    const workoutEl = document.querySelector(`[data-id="${id}"]`);
    workoutEl.remove();

    // Remove marker from map
    const markerIndex = this.#markers.findIndex(marker => marker.workoutId === id);
    if (markerIndex !== -1) {
      this.#map.removeLayer(this.#markers[markerIndex]);
      this.#markers.splice(markerIndex, 1);
    }

    // Update local storage
    this._setLocalStorage();

    this._showSuccess('Workout deleted successfully!');
  }

  _moveToPopup(e) {
    if (!this.#map) return;

    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _addControlsEventListeners() {
    // Delete all workouts
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn--delete-all')) {
        this._deleteAllWorkouts();
      }
      
      if (e.target.classList.contains('btn--show-all')) {
        this._showAllWorkouts();
      }

      if (e.target.classList.contains('btn--draw-route')) {
        this._toggleDrawRoute();
      }
    });

    // Sort workouts
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('sort-select')) {
        this._sortWorkouts(e.target.value);
      }
    });

    // Modal controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__btn--confirm')) {
        this._confirmDeleteAll();
      }
      
      if (e.target.classList.contains('modal__btn--cancel') || 
          e.target.classList.contains('modal__overlay')) {
        this._hideModal();
      }
    });
  }

  _deleteAllWorkouts() {
    if (this.#workouts.length === 0) {
      this._showError('No workouts to delete!');
      return;
    }
    
    document.querySelector('.modal').classList.remove('hidden');
  }

  _confirmDeleteAll() {
    // Clear workouts array
    this.#workouts = [];

    // Remove all workout elements from DOM
    document.querySelectorAll('.workout').forEach(el => el.remove());

    // Remove all markers from map
    this.#markers.forEach(marker => this.#map.removeLayer(marker));
    this.#markers = [];

    // Clear local storage
    this._setLocalStorage();

    // Hide modal
    this._hideModal();

    this._showSuccess('All workouts deleted successfully!');
  }

  _hideModal() {
    document.querySelector('.modal').classList.add('hidden');
  }

  _showAllWorkouts() {
    if (this.#workouts.length === 0) {
      this._showError('No workouts to show!');
      return;
    }

    const group = new L.featureGroup(this.#markers);
    this.#map.fitBounds(group.getBounds().pad(0.1));
  }

  _sortWorkouts(sortBy) {
    let sortedWorkouts;
    
    switch(sortBy) {
      case 'distance':
        sortedWorkouts = this.#workouts.slice().sort((a, b) => b.distance - a.distance);
        break;
      case 'duration':
        sortedWorkouts = this.#workouts.slice().sort((a, b) => b.duration - a.duration);
        break;
      case 'date':
        sortedWorkouts = this.#workouts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      default:
        return;
    }

    // Remove all workout elements
    document.querySelectorAll('.workout').forEach(el => el.remove());

    // Re-render in sorted order
    sortedWorkouts.forEach(workout => this._renderWorkout(workout));
  }

  _toggleDrawRoute() {
    this.#isDrawingRoute = !this.#isDrawingRoute;
    this._updateDrawRouteButton();
    
    if (this.#isDrawingRoute) {
      this.#routePoints = [];
      this._showSuccess('Click on the map to draw your route. Click "Stop Drawing" when finished.');
    } else {
      if (this.#routePoints.length > 1) {
        this._drawRoute(this.#routePoints);
      }
      this.#routePoints = [];
    }
  }

  _updateDrawRouteButton() {
    const btn = document.querySelector('.btn--draw-route');
    if (btn) {
      btn.textContent = this.#isDrawingRoute ? 'Stop Drawing' : 'Draw Route';
      btn.style.backgroundColor = this.#isDrawingRoute ? '#e74c3c' : '#00c46a';
    }
  }

  _addRoutePoint(mapE) {
    const { lat, lng } = mapE.latlng;
    this.#routePoints.push([lat, lng]);
    
    // Add a small marker for the route point
    L.circleMarker([lat, lng], {
      radius: 4,
      fillColor: '#ff7800',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(this.#map);

    // Draw line if we have more than one point
    if (this.#routePoints.length > 1) {
      L.polyline(this.#routePoints, {
        color: '#ff7800',
        weight: 3,
        opacity: 0.7
      }).addTo(this.#map);
    }
  }

  _drawRoute(routePoints) {
    if (routePoints && routePoints.length > 1) {
      L.polyline(routePoints, {
        color: '#2980b9',
        weight: 4,
        opacity: 0.8
      }).addTo(this.#map);
    }
  }

  _restoreRoutes() {
    this.#workouts.forEach(workout => {
      if (workout.route) {
        this._drawRoute(workout.route);
      }
    });
  }

  _showError(message) {
    this._showNotification(message, 'error');
  }

  _showSuccess(message) {
    this._showNotification(message, 'success');
  }

  _showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('notification--show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('notification--show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    // Restore workout objects with proper prototypes
    this.#workouts = data.map(workoutData => {
      let workout;
      if (workoutData.type === 'running') {
        workout = new Running(
          workoutData.coords,
          workoutData.distance,
          workoutData.duration,
          workoutData.cadence
        );
      } else {
        workout = new Cycling(
          workoutData.coords,
          workoutData.distance,
          workoutData.duration,
          workoutData.elevationGain
        );
      }
      
      // Restore additional properties
      workout.id = workoutData.id;
      workout.date = new Date(workoutData.date);
      workout.clicks = workoutData.clicks || 0;
      workout.location = workoutData.location;
      workout.weather = workoutData.weather;
      workout.route = workoutData.route;
      workout._setDescription();
      
      return workout;
    });

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
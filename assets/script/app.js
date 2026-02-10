// ===== CONFIGURAÇÕES =====
const CONFIG = {
    api: {
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        tideUrl: 'https://api.oceantide.com/api/v1',
        forecastType: 'daily',
        cacheDuration: 10 * 60 * 1000, // 10 minutos
        maxCacheSize: 50
    },
    backgrounds: {
        clear: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&fit=crop&auto=format'
        ],
        clouds: [
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1501691223387-dd0500405c9e?w=1920&fit=crop&auto=format'
        ],
        rain: [
            'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&fit=crop&auto=format'
        ],
        snow: [
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1549476464-37392f717541?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1516820827855-3ea1bd6f79ea?w=1920&fit=crop&auto=format'
        ],
        thunderstorm: [
            'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1605727217472-2e5b94dc65c3?w=1920&fit=crop&auto=format'
        ],
        mist: [
            'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&fit=crop&auto=format'
        ]
    },
    icons: {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    }
};

// ===== ESTADO DA APLICAÇÃO =====
const state = {
    apiKey: '433de75a5f3d83f53f3d93d7ae74ca24',
    currentUnit: 'metric',
    currentCity: 'São Paulo',
    currentLat: 0,
    currentLon: 0,
    apiCalls: 0,
    totalCities: 1,
    cache: new Map(),
    isLoading: false,
    lastRequestTime: 0,
    responseTimes: []
};

// ===== ELEMENTOS DOM =====
const elements = {
    // Modal
    apiModal: document.getElementById('apiModal'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    saveApiKeyBtn: document.getElementById('saveApiKey'),

    // Loading
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),

    // Error
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),

    // Background
    backgroundSystem: document.getElementById('backgroundSystem'),
    heartsContainer: document.getElementById('heartsContainer'),

    // Status
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    apiCallsElement: document.getElementById('apiCalls'),
    responseTimeElement: document.getElementById('responseTime'),
    lastUpdateElement: document.getElementById('lastUpdate'),
    apiStatusFooter: document.getElementById('apiStatusFooter'),
    totalCitiesElement: document.getElementById('totalCities'),

    // Search
    cityInput: document.getElementById('cityInput'),
    searchButton: document.getElementById('searchButton'),
    locationButton: document.getElementById('locationButton'),

    // Content
    contentWrapper: document.getElementById('contentWrapper'),
    additionalInfo: document.getElementById('additionalInfo'),

    // Weather Display
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    temperature: document.getElementById('temperature'),
    weatherCondition: document.getElementById('weatherCondition'),
    weatherIcon: document.getElementById('weatherIcon'),

    // Details
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),

    // Forecast
    forecastList: document.getElementById('forecastList'),

    // Additional Info
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    visibility: document.getElementById('visibility'),
    precipitation: document.getElementById('precipitation'),
    cloudiness: document.getElementById('cloudiness'),
    dewPoint: document.getElementById('dewPoint'),
    tideHigh: document.getElementById('tideHigh'),
    tideLow: document.getElementById('tideLow'),

    // Unit Toggle
    unitButtons: document.querySelectorAll('.unit-button'),

    // Forecast Toggle
    forecastToggle: document.querySelectorAll('.forecast-toggle button')
};

// ==== Evento do Botão ===

elements.saveApiKeyBtn.addEventListener('click', () => {
  const key = elements.apiKeyInput.value.trim();

  if (!key) {
    alert('Por favor, insira uma chave da API');
    return;
  }

  state.apiKey = key;
  localStorage.setItem('weatherApiKey', key);

  elements.apiModal.classList.add('hidden');
  updateStatus('connected');

  console.log('✅ API Key ativada:', key);
});


// ===== INICIALIZAÇÃO =====
async function init() {
    console.log('🎀 Inicializando Kawaii Weather...');

    createHearts();
    setupEventListeners();
    loadSavedData();
    setupBackgrounds();

    // Verificar se já tem API key salva
    if (state.apiKey) {
        elements.apiModal.classList.add('hidden');
        updateStatus('connected');
        await fetchWeatherData(state.currentCity);
    } else {
        showModal();
    }

    // Atualizar relógio
    setInterval(updateClock, 1000);

    console.log('✨ Kawaii Weather inicializado!');
}

// ===== SISTEMA DE CORAÇÕES =====
function createHearts() {
    for (let i = 0; i < 20; i++) {
        createHeart();
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💕';

    // Posição aleatória
    heart.style.left = `${Math.random() * 100}%`;

    // Duração e delay aleatórios
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;

    elements.heartsContainer.appendChild(heart);

    // Remover e recriar coração após animação
    setTimeout(() => {
        heart.remove();
        createHeart();
    }, (duration + delay) * 1000);
}
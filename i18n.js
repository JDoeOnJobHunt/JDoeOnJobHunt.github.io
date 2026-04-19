/**
 * Simple i18n system with subdomain detection
 * Usage: Add data-i18n="key.path" to any element
 */

let i18nData = {};

// Detect language from subdomain
function getLanguage() {
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];

  // Map subdomains to languages
  const langMap = {
    'en': 'en',
    'de': 'de',
    'www': 'de', // Default to German
    'localhost': 'de'
  };

  return langMap[subdomain] || 'de';
}

// Load translation file
async function loadTranslations(lang) {
  try {
    const response = await fetch(`/locale/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
    i18nData = await response.json();
    console.log('Translations loaded:', lang, Object.keys(i18nData).length, 'keys');
  } catch (error) {
    console.error('Translation loading error:', error);
    // Fallback to German if loading fails
    if (lang !== 'de') {
      await loadTranslations('de');
    }
  }
}

// Get translation by dot notation (e.g., "nav.about")
function t(key, fallback = key) {
  const keys = key.split('.');
  let value = i18nData;

  for (const k of keys) {
    value = value?.[k];
  }

  const result = value || fallback;
  if (!value && fallback === key) {
    console.warn(`Translation missing for key: ${key}`);
  }
  return result;
}

// Replace all elements with data-i18n attribute
function applyTranslations() {
  let count = 0;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);

    // For HTML content (like <br> tags)
    if (element.hasAttribute('data-i18n-html')) {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
    }
    count++;
  });

  // Replace placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    element.setAttribute('placeholder', translation);
  });

  // Update lang attribute
  document.documentElement.lang = getLanguage();
  console.log(`Applied ${count} translations`);
}

// Initialize i18n on page load
async function initI18n() {
  const lang = getLanguage();
  console.log('Initializing i18n for language:', lang);

  await loadTranslations(lang);
  await loadSharedFooter();

  // Small delay to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 50));

  applyTranslations();

  // Store current language for reference
  window.currentLanguage = lang;
  console.log('i18n initialization complete');
}

// Load shared footer from footer.html
async function loadSharedFooter() {
  try {
    const response = await fetch('/footer.html');
    if (!response.ok) throw new Error('Failed to load footer');
    const footerHTML = await response.text();

    // Remove existing footer if present
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
      existingFooter.remove();
    }

    // Insert new footer before closing body tag
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  } catch (error) {
    console.error('Footer loading error:', error);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}

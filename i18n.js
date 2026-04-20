/**
 * Simple i18n system with subdomain detection
 * Usage: Add data-i18n="key.path" to any element
 */

let i18nData = {};

// Embedded fallback translations (German)
const FALLBACK_TRANSLATIONS = {
  "nav.about": "Über uns",
  "nav.services": "Leistungen",
  "nav.contact": "Kontakt",
  "hero.title": "Energie neu denken.<br> Wirtschaftlich handeln.",
  "hero.subtitle": "Finanzierungslösungen, industrielle Energiesysteme und Großbatteriespeicher aus einer Hand.",
  "hero.cta": "Beratung anfragen",
  "trust.text": "Wir skalieren die Energiewende: Von der 400kV-Hochspannungsanbindung bis zum GWh-Batteriespeicher. <br> Wir vereinen exklusiven Marktzugang mit technischem Programm-Management für institutionelle Investoren.",
  "about.title": "Über HBEE",
  "about.intro": "Mit über 25 Jahren Erfahrung in der Energiewirtschaft sind wir Experten darin, branchenübergreifend Strom für vielfältigste Anwendungen zu attraktiven Konditionen bereitzustellen. Mit unserer fundierten Management- und Finanzkompetenz sichern wir Ihren langfristigen Erfolg Ihrer Investironen.",
  "about.focus": "Unser Fokus: Effizienz, Nachhaltigkeit und wirtschaftliche Skalierbarkeit.",
  "about.point1": "Industrielle Energieversorgungslösungen: Maximale Absicherung Ihrer Energiebedarfe und Produktionsprozesse.",
  "about.point2": "Batteriegroßspeicher und Netzintegration: Stromabsicherung, Netzstabilisierung und Minimierung von Strompreisrisiken.",
  "about.point3": "Energetische Einbindung von Rechenzentren: Kombination aus Batteriespeicher, Netzinfrastruktur und Bereitstellung der notwendigen Infrastruktur für Hyperscaler.",
  "card1.front": "Industrielle Energiesysteme",
  "card2.front": "Batteriespeicher & Netzintegration",
  "card3.front": "Kompetenz: Trusted Advisor für Finanzinvestoren, Begleiter für alle Anliegen der Investoren gegenüber dem Projekt",
  "services.title": "Leistungen",
  "services.intro": "Wir verfügen über die erforderliche Schnittstellenkompetenz zur Sicherung Ihrer Investition und Sicherung der Projekte.",
  "services.description": "Wir sehen uns als Interessenwahrer unserer Finanzpartner. Unser Ziel ist es, die Komplexität der Hochspannungstechnik und der Energiemärkte so zu steuern, dass für den Investor ein transparentes, risikooptimiertes und hochgradig skalierbares Asset entsteht. Wir schaffen und steuern systemrelevante Assets mit nachhaltigem Mehrwert für Ihre Investments.",
  "service1.title": "Financial Engineering & Asset-Strategie",
  "service1.desc": "Wir vermitteln nicht nur Kapital, wir strukturieren Business Cases. Wir übersetzen technische Parameter in verlässliche Cashflow-Modelle für Finanzpartner. Dabei integrieren wir moderne Vermarktungskonzepte wie Multi-Use-Stacking, Arbitrage-Handel und Systemdienstleistungen sowie Nutzen der Energie für die Industrie.",
  "service2.title": "Technical Program Management",
  "service2.desc": "Ein 1.600 MWh-Projekt ist eine logistische und technische Meisterleistung. Wir steuern das gesamte Programm:",
  "service2.point1": "Anbindung an das 400-kV-Netz inklusive Planung der Trafostationen.",
  "service2.point2": "Sicherstellung der Konnektivität via Darkfiber für Echtzeit-Monitoring.",
  "service2.point3": "Begleitung der Technologieauswahl (LFP, Na-Ion) und Qualitätssicherung bis zum Commissioning.",
  "service3.title": "Exklusiver Marktzugang & Networking",
  "service3.desc": "Durch den direkten Zugang zu Entscheidern der Energiewirtschaft und ÜNBs identifizieren wir Standorte und Projekte, bevor sie den öffentlichen Markt erreichen. Wir verstehen die Sprache der Netzbetreiber und die regulatorischen Rahmenbedingungen, um komplexe Genehmigungsprozesse (BImSchG, NAP) zum Erfolg zu führen.",
  "cta.title": "Bereit für die nächste Stufe Ihrer Investionen in der Energieversorgung?",
  "cta.button": "Jetzt Gespräch starten",
  "contact.title": "Kontakt",
  "contact.name": "Name",
  "contact.email": "E-Mail",
  "contact.message": "Nachricht",
  "contact.submit": "Anfrage senden",
  "footer.company": "HBEE GmbH",
  "footer.address": "Chaltenbodenstrasse 8<br>8834 Schindellegi<br>CH - Schweiz",
  "footer.imprint": "Impressum",
  "footer.privacy": "Datenschutz",
  "footer.disclaimer": "Disclaimer / Rechtliche Hinweise"
};

// Initialize with fallback
i18nData = { ...FALLBACK_TRANSLATIONS };

// Detect language from URL path or query parameter
function getLanguage() {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  console.log(`📍 Pathname: ${pathname}`);
  console.log(`📍 Search: ${window.location.search}`);

  // Check for query parameter first (e.g., ?lang=en)
  const queryLang = searchParams.get('lang');
  if (queryLang === 'en' || queryLang === 'de') {
    console.log(`✅ Detected language from query param: ${queryLang}`);
    return queryLang;
  }

  // Check for path-based routing (e.g., /en/ or /de/)
  if (pathname.includes('/en')) {
    const parts = pathname.split('/').filter(p => p.length > 0);
    if (parts[0] === 'en') {
      console.log(`✅ Detected language from path: en`);
      return 'en';
    }
  }

  if (pathname.includes('/de')) {
    const parts = pathname.split('/').filter(p => p.length > 0);
    if (parts[0] === 'de') {
      console.log(`✅ Detected language from path: de`);
      return 'de';
    }
  }

  // Default to German for root path
  console.log(`⚠️ No language detected, defaulting to: de`);
  return 'de';
}

// Load translation file
async function loadTranslations(lang) {
  try {
    const timestamp = new Date().getTime(); // Cache buster
    const url = `/locale/${lang}.json?v=${timestamp}`;
    console.log(`📥 Fetching translations from ${url}`);
    const response = await fetch(url, {
      cache: 'no-cache',
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    i18nData = data;
    console.log(`✅ Translations loaded: ${lang} (${Object.keys(i18nData).length} keys)`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to load ${lang}.json:`, error);

    // Use fallback
    i18nData = { ...FALLBACK_TRANSLATIONS };
    console.log(`⚠️ Using fallback German translations (${Object.keys(i18nData).length} keys)`);

    // If not German, try to load German as fallback
    if (lang !== 'de') {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/locale/de.json?v=${timestamp}`, { cache: 'no-cache' });
        if (response.ok) {
          i18nData = await response.json();
          console.log(`✅ Fallback: Loaded German (${Object.keys(i18nData).length} keys)`);
        }
      } catch (fallbackError) {
        console.log(`⚠️ Fallback fetch also failed, using embedded translations`);
      }
    }
    return false;
  }
}

// Get translation by dot notation (e.g., "nav.about")
function t(key) {
  if (!key) return '';

  const keys = key.split('.');
  let value = i18nData;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`⚠️ Missing translation: ${key}`);
      return key; // Return the key as fallback
    }
  }

  return value || key;
}

// Load shared footer from footer.html
async function loadSharedFooter() {
  try {
    const response = await fetch('/footer.html');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const footerHTML = await response.text();

    // Remove existing footer if present
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
      existingFooter.remove();
    }

    // Insert new footer before closing body tag
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    console.log('✅ Footer loaded');
  } catch (error) {
    console.error('❌ Footer loading error:', error);
  }
}

// Replace all elements with data-i18n attribute
function applyTranslations() {
  console.log('🔄 Applying translations to page...');
  console.log('📊 i18nData keys:', Object.keys(i18nData).length);
  console.log('📋 i18nData:', i18nData);

  let count = 0;
  let applied = 0;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    count++;
    const key = element.getAttribute('data-i18n');
    const translation = t(key);

    console.log(`  [${count}] Key: "${key}" → Value: "${translation}"`);

    if (translation && translation !== key) {
      // For HTML content (like <br> tags)
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
      applied++;
      console.log(`      ✅ Applied`);
    } else {
      console.log(`      ⚠️ Not applied (same as key)`);
    }
  });

  // Replace placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation && translation !== key) {
      element.setAttribute('placeholder', translation);
    }
  });

  // Update lang attribute
  document.documentElement.lang = getLanguage();
  console.log(`✅ Applied ${applied}/${count} translations`);
}

// Initialize i18n on page load
async function initI18n() {
  console.log('=== i18n Initialization Started ===');

  try {
    const lang = getLanguage();
    console.log(`🌍 Detected language: ${lang}`);

    // Load translations
    console.log(`📥 Loading translations for: ${lang}`);
    const loaded = await loadTranslations(lang);
    console.log(`📥 Translations loaded: ${loaded}`);

    // Load footer
    await loadSharedFooter();

    // Apply translations
    console.log(`🔄 Applying translations...`);
    applyTranslations();

    // Store current language
    window.currentLanguage = lang;
    console.log(`✅ i18n Initialization Complete - Language: ${lang}`);
  } catch (error) {
    console.error('❌ i18n Initialization Failed:', error);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  // DOM already loaded
  initI18n();
}

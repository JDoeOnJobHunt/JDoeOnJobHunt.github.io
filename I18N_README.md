# i18n (Internationalization) Setup

Your website now supports multiple languages via subdomains!

## How It Works

### Subdomain Detection
- `de.[domain]` → German (default)
- `en.[domain]` → English
- `www.[domain]` → German (fallback)

**Example:**
- `en.example.com` → Shows English version
- `de.example.com` → Shows German version

### File Structure
```
locale/
├── en.json      # English translations
├── de.json      # German translations
└── [fr.json]    # Add more languages here
```

i18n.js  → Loader script that detects language and applies translations

## Adding a New Language

1. Create a new JSON file in `/locale/`, e.g., `locale/fr.json`
2. Copy the structure from `en.json` or `de.json` and translate all values
3. Update the `langMap` in `i18n.js` to map your subdomain to the language code:

```javascript
const langMap = {
  'en': 'en',
  'de': 'de',
  'fr': 'fr',  // Add this line
  'www': 'de'
};
```

4. Create a subdomain DNS record pointing to your site (e.g., `fr.[domain]`)

## Updating Translations

1. Edit the JSON file directly: `locale/en.json` or `locale/de.json`
2. Use dot notation for nested keys: `"nav.about"`, `"footer.company"`
3. The translations auto-update on next page load (no code changes needed)

## HTML Usage

### Simple Text Translation
```html
<p data-i18n="about.title">Über HBEE</p>
```

### HTML Content (preserves tags like `<br>`)
```html
<h2 data-i18n="hero.title" data-i18n-html>
  Energie neu denken.<br> Wirtschaftlich handeln.
</h2>
```

### Form Placeholders
```html
<input data-i18n-placeholder="contact.name" placeholder="Name">
```

## DNS Configuration

To use subdomains, add these DNS records:

```
en    CNAME    [your-github-pages-domain]
de    CNAME    [your-github-pages-domain]
fr    CNAME    [your-github-pages-domain]  (for example)
```

Or if using A records:
```
en    A    [your-ip]
de    A    [your-ip]
```

## Testing Locally

On Windows, edit `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1  en.localhost.local
127.0.0.1  de.localhost.local
127.0.0.1  localhost.local
```

Then visit:
- `http://en.localhost.local:8000`
- `http://de.localhost.local:8000`

## Fallback Behavior

- If a translation key is missing, it shows the key itself as fallback
- If a language JSON fails to load, it falls back to German (de.json)
- If a subdomain isn't recognized, it defaults to German

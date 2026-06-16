# Features

## Core Analysis Features

### Health Score
Overall website health score (0-100) based on:
- Status (20 pts) - Website reachability
- Security (20 pts) - HTTPS availability
- Performance (20 pts) - Response time
- SEO (20 pts) - Meta tags, headings, alt text
- Links (20 pts) - Broken link detection
- Images (20 pts) - Broken image detection
- JavaScript Errors (20 pts) - Console error detection

## Swym Customer Experience Features

### 1. JavaScript Error Detection
Detects potential JavaScript errors that could break functionality:
- Invalid script URLs
- Common error patterns (`console.error`, `throw`, `undefined.`)

### 2. Shopify/Swym Integration Detection
For Shopify stores, identifies:
- Swym wishlist button presence (`.swym-wishlist`, `[data-swym-wishlist]`)
- Hidden Swym elements (CSS `display:none`, hidden classes)
- Mixed content issues (HTTP scripts on HTTPS pages)

## Workflow

```
User enters URL → Analyze Website
       ↓
Fetch HTML + Analyze:
  ├── Website Status & Performance
  ├── Security (HTTPS check)
  ├── SEO (title, description, H1, alt text)
  ├── Links (check all <a href> URLs)
  ├── Images (check all <img src> URLs)
  ├── Console Errors (scan inline scripts)
  └── Shopify/Swym (detect integration issues)
       ↓
Generate Health Score + Recommendations
       ↓
Display Report Grid:
  ├── Health Score card (full width)
  ├── Website Status card
  ├── Security card
  ├── SEO card
  ├── Broken Links card (click for details)
  ├── Broken Images card (click for details)
  ├── Shopify Detection card (when detected)
  ├── JavaScript Errors card (click for details)
  ├── Score Breakdown card
  └── Recommendations card (full width)
```

## Report Cards

Each card in the grid shows a specific analysis result:
- **Broken Links/Images/JS Errors/Shopify issues** - Click to view detailed modal with URLs and status codes
- **Recommendations** - Full-width actionable items with priority levels (high/medium/low)
# WebPulse Frontend

React + Vite UI for the Swym Debug Assist - Customer Experience Debugger.

## Backend API

The frontend calls the backend API here:

- **POST** `http://localhost:5000/api/analyze`

### Request

`Content-Type: application/json`

```json
{
  "url": "https://example.com"
}
```

### Response (JSON)

Includes:

- `url` - The analyzed website URL
- `website` - Status, response time, performance rating
- `security` - HTTPS status and message
- `seo` - Title, description, H1, alt text analysis
- `links` - Total/ broken links with status codes
- `images` - Total/ broken images with status codes
- `console` - JavaScript error detection results (error count, issues)
- `shopify` - Shopify/Swym detection and integration issues
- `healthScore` - Overall health score out of 100
- `breakdown` - Score breakdown for each category
- `recommendations` - Prioritized action items with links to issues

### cURL example

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\"}"
```

## Notes

- Ensure the backend is running on port **5000**
- CORS is enabled on the backend for cross-origin requests
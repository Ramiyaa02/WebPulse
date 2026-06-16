const axios = require('axios');
const cheerio = require('cheerio');

function detectConsoleErrors(html, targetUrl) {
  const $ = cheerio.load(html || '');
  const scriptTags = $('script').toArray();
  const errors = [];

  // Check for inline scripts with common error patterns
  scriptTags.forEach((elem, idx) => {
    const src = $(elem).attr('src');
    const content = $(elem).html() || '';

    if (src) {
      // Check if script src exists
      try {
        new URL(src, targetUrl);
      } catch {
        errors.push({
          type: 'invalid-script-src',
          url: src,
          message: 'Invalid script URL',
        });
      }
    }

    // Detect potential console.error patterns
    const errorPatterns = [
      /console\.error/i,
      /throw\s+/i,
      /\$(\w+)\.ajax\s*\(/i, // jQuery errors
      /ReferenceError/i,
      /TypeError/i,
      /undefined\./i,
    ];

    errorPatterns.forEach((pattern) => {
      if (pattern.test(content) && content.length > 50) {
        errors.push({
          type: 'potential-error',
          scriptIndex: idx + 1,
          message: 'Potential error pattern detected in inline script',
        });
      }
    });
  });

  return {
    hasErrors: errors.length > 0,
    errorCount: errors.length,
    errors: errors.slice(0, 10),
    score: errors.length === 0 ? 20 : Math.max(0, 20 - errors.length * 2),
  };
}

module.exports = { detectConsoleErrors };
const cheerio = require('cheerio');

function detectShopifyIssues(html, targetUrl) {
  const $ = cheerio.load(html || '');
  const issues = [];

  // Check for Shopify-specific script indicators
  const hasShopifyAjax = /cdn\.shopify\.com\/ajax/i.test(html);
  const hasShopifyAssets = /cdn\.shopify\.com\/s\/files/i.test(html);
  const shopifyTemplates = /theme\.liquid|product\.liquid|collection\.liquid/i.test(html);

  // Check for Swym wishlist button patterns
  const swymSelectors = [
    '.swym-wishlist',
    '[data-swym-wishlist]',
    '.swym-button',
    '#swym-wishlist-button',
    '[class*="swym"]',
  ];

  swymSelectors.forEach((selector) => {
    const elements = $(selector);
    if (elements.length > 0) {
      // Check if elements are visible
      elements.each((idx, el) => {
        const styles = $(el).attr('style') || '';
        const computedDisplay = /display:\s*none/i.test(styles);
        const hiddenClass = /\b(hidden|d-none|hide|invisible)\b/i.test($(el).attr('class') || '');

        if (computedDisplay || hiddenClass) {
          issues.push({
            type: 'swym-hidden',
            selector,
            message: 'Swym element is hidden',
            element: $(el).prop('tagName'),
            severity: 'high',
          });
        }
      });
    }
  });

  // Check for jQuery (common dependency)
  const hasjQuery = typeof window !== 'undefined' && window.jQuery;
  const jQueryScript = /jquery.*\.min\.js/i.test(html);

  // Check for common Shopify JS errors
  const scriptTags = $('script[src]').toArray();
  scriptTags.forEach((tag) => {
    const src = $(tag).attr('src') || '';
    if (src && !src.includes('cdn.shopify.com') && !src.includes('ajax.googleapis.com')) {
      try {
        const url = new URL(src, targetUrl);
        if (!url.protocol.startsWith('https')) {
          issues.push({
            type: 'insecure-js',
            url: src,
            message: 'JavaScript loaded over HTTP (mixed content)',
            severity: 'high',
          });
        }
      } catch {
        // Invalid URL
      }
    }
  });

  return {
    isShopify: hasShopifyAjax || hasShopifyAssets || shopifyTemplates,
    hasSwym: swymSelectors.some((s) => $(s).length > 0),
    issues,
    issuesCount: issues.length,
  };
}

module.exports = { detectShopifyIssues };
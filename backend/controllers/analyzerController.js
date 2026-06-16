const { normalizeUrl } = require('../utils/urlHelper');
const { fetchWebsite } = require('../services/websiteChecker');
const { analyzeSecurity } = require('../services/securityChecker');
const { analyzeSEO } = require('../services/seoChecker');
const { analyzeLinks } = require('../services/linkChecker');
const { analyzeImages } = require('../services/imageChecker');
const { detectConsoleErrors } = require('../services/consoleChecker');
const { detectShopifyIssues } = require('../services/shopifyChecker');
const { calculateHealthScore } = require('../utils/scoreCalculator');
const { generateRecommendations } = require('../utils/recommendationEngine');

async function analyzeWebsite(req, res) {
  const { url } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  let targetUrl;
  try {
    targetUrl = normalizeUrl(url);
  } catch (error) {
    return res.status(400).json({ error: 'Unable to parse the URL. Please use a valid website address.' });
  }

  try {
    const website = await fetchWebsite(targetUrl);
    const security = analyzeSecurity(targetUrl);
    const seo = analyzeSEO(website.html, targetUrl);
    const console = detectConsoleErrors(website.html, targetUrl);
    const shopify = detectShopifyIssues(website.html, targetUrl);
    const [links, images] = await Promise.all([
      analyzeLinks(website.html, targetUrl),
      analyzeImages(website.html, targetUrl),
    ]);

    const score = calculateHealthScore({
      performanceScore: website.performanceScore,
      security,
      seoScore: seo.score,
      links,
      images,
      console,
      online: website.status === 'online',
    });

    const recommendations = generateRecommendations({
      security,
      links,
      images,
      seo,
      website,
      console,
      shopify,
    });

    return res.json({
      url: targetUrl,
      website,
      security,
      seo,
      links,
      images,
      console,
      shopify,
      healthScore: score.total,
      breakdown: score.breakdown,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to analyze the website at this time.',
      details: error.message,
    });
  }
}

module.exports = { analyzeWebsite, exportReport };

function exportReport(req, res) {
  const { report } = req.body;
  if (!report) {
    return res.status(400).json({ error: 'Report data is required.' });
  }
  res.json({ message: 'Export endpoint ready' });
}

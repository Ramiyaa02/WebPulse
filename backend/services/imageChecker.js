const axios = require('axios');
const cheerio = require('cheerio');
const { resolveRelativeUrl } = require('../utils/urlHelper');

async function checkImage(url) {
  try {
    const response = await axios.head(url, {
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'WebPulse/1.0 (+https://example.com)',
      },
    });
    const ok = response.status >= 200 && response.status < 400;
    return { ok, status: response.status };
  } catch (error) {
    return { ok: false, status: 'error' };
  }
}

async function analyzeImages(html, targetUrl) {
  const $ = cheerio.load(html || '');
  const imageTags = $('img[src]').toArray();
  const imageUrls = imageTags
    .map((elem) => $(elem).attr('src').trim())
    .filter(Boolean)
    .map((src) => resolveRelativeUrl(src, targetUrl));

  const uniqueImages = Array.from(new Set(imageUrls));
  const checks = await Promise.all(
    uniqueImages.map(async (url) => {
      const result = await checkImage(url);
      return { url, ok: result.ok, status: result.status };
    }),
  );

  const working = checks.filter((item) => item.ok).length;
  const broken = checks.length - working;

  return {
    total: checks.length,
    working,
    broken,
    images: checks,
    score: checks.length === 0 ? 20 : Math.max(0, Math.round(20 - (broken * 20) / checks.length)),
  };
}

module.exports = { analyzeImages };

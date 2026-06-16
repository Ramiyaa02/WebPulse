const axios = require('axios');
const cheerio = require('cheerio');
const { resolveRelativeUrl } = require('../utils/urlHelper');

async function checkLink(url) {
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

async function analyzeLinks(html, targetUrl) {
  const $ = cheerio.load(html || '');
  const anchorTags = $('a[href]').toArray();
  const links = anchorTags
    .map((elem) => $(elem).attr('href').trim())
    .filter(Boolean)
    .map((href) => resolveRelativeUrl(href, targetUrl));

  const uniqueLinks = Array.from(new Set(links));
  const checks = await Promise.all(
    uniqueLinks.map(async (link) => {
      const result = await checkLink(link);
      return { url: link, ok: result.ok, status: result.status };
    }),
  );

  const working = checks.filter((item) => item.ok).length;
  const broken = checks.length - working;

  return {
    total: checks.length,
    working,
    broken,
    links: checks,
    score: checks.length === 0 ? 20 : Math.max(0, Math.round(20 - (broken * 20) / checks.length)),
  };
}

module.exports = { analyzeLinks };

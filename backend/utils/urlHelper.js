const { URL } = require('url');

function normalizeUrl(value) {
  let normalized = value.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return new URL(normalized).toString();
}

function resolveRelativeUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

module.exports = { normalizeUrl, resolveRelativeUrl };

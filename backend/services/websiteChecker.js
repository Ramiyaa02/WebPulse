const axios = require('axios');

const PERFORMANCE_THRESHOLDS = [800, 1500, 2500];

function scorePerformance(ms) {
  if (ms <= PERFORMANCE_THRESHOLDS[0]) return 20;
  if (ms <= PERFORMANCE_THRESHOLDS[1]) return 15;
  if (ms <= PERFORMANCE_THRESHOLDS[2]) return 10;
  return 5;
}

async function fetchWebsite(targetUrl) {
  const startTime = Date.now();
  const response = await axios.get(targetUrl, {
    timeout: 25000,
    maxRedirects: 5,
    validateStatus: () => true,
    headers: {
      'User-Agent': 'WebPulse/1.0 (+https://example.com)',
    },
  });

  const responseTime = Date.now() - startTime;
  const statusCode = response.status;
  const online = statusCode >= 200 && statusCode < 400;

  return {
    url: targetUrl,
    status: online ? 'online' : 'offline',
    statusCode,
    responseTime,
    performanceRating: online ? scorePerformance(responseTime) : 0,
    performanceScore: online ? scorePerformance(responseTime) : 0,
    performanceLabel: online
      ? responseTime <= PERFORMANCE_THRESHOLDS[0]
        ? 'Excellent'
        : responseTime <= PERFORMANCE_THRESHOLDS[1]
        ? 'Good'
        : responseTime <= PERFORMANCE_THRESHOLDS[2]
        ? 'Moderate'
        : 'Slow'
      : 'Unavailable',
    html: typeof response.data === 'string' ? response.data : '',
  };
}

module.exports = { fetchWebsite };

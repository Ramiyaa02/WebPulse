function analyzeSecurity(targetUrl) {
  const secure = /^https:\/\//i.test(targetUrl);
  return {
    secure,
    protocol: secure ? 'https' : 'http',
    status: secure ? 'Secure' : 'Not Secure',
    message: secure ? 'HTTPS is enabled.' : 'HTTPS is not enabled.',
  };
}

module.exports = { analyzeSecurity };

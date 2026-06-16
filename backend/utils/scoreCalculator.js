function calculateHealthScore({ performanceScore, security, seoScore, links, images, console, online }) {
  const statusScore = online ? 20 : 0;
  const securityScore = security.secure ? 20 : 0;
  const seoScoreScaled = Math.min(20, (seoScore / 70) * 20);
  const total = Math.min(
    100,
    statusScore + securityScore + performanceScore + Math.round(seoScoreScaled) + Math.round(links.score) + Math.round(images.score) + Math.round(console?.score || 0),
  );

  return {
    total,
    breakdown: {
      status: statusScore,
      performance: performanceScore,
      security: securityScore,
      seo: Math.round(seoScoreScaled),
      links: Math.round(links.score),
      images: Math.round(images.score),
      console: Math.round(console?.score || 0),
    },
  };
}

module.exports = { calculateHealthScore };

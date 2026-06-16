function generateRecommendations(data) {
  const recommendations = [];

  if (!data.security.secure) {
    recommendations.push({
      priority: 'high',
      text: 'Enable HTTPS for your website to improve security and SEO ranking',
    });
  }

  if (data.links.broken > 0) {
    recommendations.push({
      priority: 'high',
      text: `Fix ${data.links.broken} broken link${data.links.broken > 1 ? 's' : ''}`,
      items: data.links.links.filter((link) => !link.ok).slice(0, 5),
    });
  }

  if (data.images.broken > 0) {
    recommendations.push({
      priority: 'medium',
      text: `Fix ${data.images.broken} broken image${data.images.broken > 1 ? 's' : ''}`,
      items: data.images.images.filter((img) => !img.ok).slice(0, 5),
    });
  }

  if (data.console?.hasErrors) {
    recommendations.push({
      priority: 'high',
      text: `Fix ${data.console.errorCount} JavaScript error${data.console.errorCount > 1 ? 's' : ''} that may break functionality`,
      items: data.console.errors.slice(0, 5),
    });
  }

  if (data.shopify?.issues?.length > 0) {
    recommendations.push({
      priority: 'high',
      text: `Fix ${data.shopify.issuesCount} Shopify/${data.shopify.hasSwym ? 'Swym' : ''} integration issue${data.shopify.issuesCount > 1 ? 's' : ''}`,
      items: data.shopify.issues.slice(0, 5),
    });
  }

  if (data.seo.missing.title) {
    recommendations.push({
      priority: 'high',
      text: 'Add a title tag to your homepage',
    });
  }

  if (data.seo.missing.description) {
    recommendations.push({
      priority: 'medium',
      text: 'Add a meta description to improve SEO click-through rates',
    });
  }

  if (data.seo.missing.h1) {
    recommendations.push({
      priority: 'medium',
      text: 'Add an H1 heading to your homepage',
    });
  }

  if (data.seo.missing.altTextIssues > 0) {
    recommendations.push({
      priority: 'low',
      text: `Add alt text to ${data.seo.missing.altTextIssues} image${data.seo.missing.altTextIssues > 1 ? 's' : ''}`,
    });
  }

  if (data.website.performanceRating < 15) {
    recommendations.push({
      priority: 'medium',
      text: 'Optimize page load performance - consider compressing images and minifying assets',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

module.exports = { generateRecommendations };
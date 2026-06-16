const cheerio = require('cheerio');

function analyzeSEO(html, targetUrl) {
  const $ = cheerio.load(html || '');
  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() || '';
  const h1 = $('h1').first().text().trim();
  const imagesMissingAlt = $('img').toArray().filter((img) => !$(img).attr('alt')?.trim()).length;

  const titleScore = title ? 20 : 0;
  const descriptionScore = description ? 20 : 0;
  const h1Score = h1 ? 15 : 0;
  const altScore = Math.max(0, 15 - Math.min(15, imagesMissingAlt * 3));
  const totalScore = Math.min(70, titleScore + descriptionScore + h1Score + altScore);

  return {
    title,
    description,
    h1,
    imagesMissingAlt,
    score: totalScore,
    missing: {
      title: !title,
      description: !description,
      h1: !h1,
      altTextIssues: imagesMissingAlt,
    },
  };
}

module.exports = { analyzeSEO };

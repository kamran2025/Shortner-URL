const shortid = require('shortid')
const URL = require('../models/url')

async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;
  try {
    if (!url) {
      return res.redirect('/');
    }
    const shortID = shortid.generate();
    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
      createdBy: req.user._id
    });
    return res.render('home', {
      id: shortID,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId
  const result = await URL.findOne({ shortId })
  return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory })
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
}
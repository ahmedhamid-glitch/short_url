const shortId = require("shortid");

const { URL } = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  // console.log("", body.user);

  const shortID = shortId();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {
    id: shortID,
  });

  // return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({
    shortId,
  });
  res.json({
    totalClick: result.visitHistory.length,
    analytics,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};

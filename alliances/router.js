const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ router: "alliances" });
});

module.exports = router;

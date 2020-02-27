const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ router: "countries" });
});

module.exports = router;

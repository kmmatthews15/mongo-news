const express = require("express");
const exphbs = require("express-handlebars");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/saved", (req, res) => {
	res.render("saved");
}const
module.exports = router;
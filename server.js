// all required packages
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//requires the two models files
const Comment = require('./models/Comment.js');
const Article = require('./models/Article.js');
//require the controllers
const htmlRouter = require('./routes/html-routes.js');
const articleRouter = require('./routes/article-routes.js');
//scraping tools 
const request = require('request');
const cheerio = require('cheerio');


const app = express();
const PORT = process.env.PORT || 3030;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//initialize handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routing
app.use("/", htmlRouter);
app.use("/", articleRouter);

//listen to the port
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
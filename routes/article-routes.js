const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");
const router = express.Router();


// ============= ROUTES FOR HOME =============//

// Scrape data from website and save to mongodb
router.get("/scrape", function(req, res) {
  // Grab the body of the html with request
  request("https://www.washingtonpost.com/news/arts-and-entertainment/wp/category/archives/", function(error, response, html) {
    // Load that into cheerio and save it to $ 
    let $ = cheerio.load(html);
    // Grab every part of the html that contains a separate article
    $("div.archivelist > article").each(function(i, element) {

      // Save an empty result object
      let result = {};

      result.title = $(element).children("div.item-info").children("h2.title").html();
      // result.description saves text description
			result.description = $(element).children("div.item-info").children("p.teaser").children("a").text();
      
      // Using our Article model, create a new entry
      let entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
    // Reload the page so that newly scraped articles will be shown on the page
    res.redirect("/");
  });  
});


// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({})
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Save an article
router.post("/save/:id", function(req, res) {
  // Use the article id to find and update it's saved property to true
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log("doc: ", doc);
    }
  });
});


// ============= ROUTES FOR SAVED ARTICLES PAGE =============//

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the comments associated with it
  .populate("comments")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Create a new comment
router.post("/comment/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  let newComment = new Comment(req.body);
  // And save the new comment the db
  newComment.save(function(error, newComment) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's comment
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

// Remove a saved article
router.post("/unsave/:id", function(req, res) {
  // Use the article id to find and update it's saved property to false
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/saved");
});


module.exports = router;